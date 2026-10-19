import type { Emotion, Gesture } from "./types";

// Pure animation maths for the robot rig. No three.js here, so it can be tested in Node.
// Conventions: the robot faces +z (towards the camera). "A" is the +x side, "B" the -x side.
// Arm/leg groups hang down from their pivot; rotating about x by a NEGATIVE angle swings forward (+z),
// rotating the A arm about z by a POSITIVE angle swings it outward/up (B arm: negative).
// Brow angle: positive = determined/angry, negative = worried/sad (B is mirrored in the component).

export type Pose = {
  bodyY: number; lean: number; roll: number;
  headYaw: number; headPitch: number; headRoll: number;
  aAx: number; aAz: number; aBx: number; aBz: number;
  legA: number; legB: number;
  eyeW: number; eyeH: number; glow: number;
  browAy: number; browAr: number; browBy: number; browBr: number;
  shake: number;
};

export const poseKeys = [
  "bodyY", "lean", "roll", "headYaw", "headPitch", "headRoll",
  "aAx", "aAz", "aBx", "aBz", "legA", "legB",
  "eyeW", "eyeH", "glow", "browAy", "browAr", "browBy", "browBr", "shake",
] as const satisfies readonly (keyof Pose)[];

export const basePose: Pose = {
  bodyY: 0, lean: 0, roll: 0, headYaw: 0, headPitch: 0, headRoll: 0,
  aAx: 0, aAz: 0.22, aBx: 0, aBz: -0.22, legA: 0, legB: 0,
  eyeW: 1, eyeH: 1, glow: 1, browAy: 0, browAr: 0, browBy: 0, browBr: 0, shake: 0,
};

type Face = Pick<Pose, "eyeW" | "eyeH" | "glow" | "browAy" | "browAr" | "browBy" | "browBr" | "headPitch">;
const f = (o: Partial<Face>): Face => ({ eyeW: 1, eyeH: 1, glow: 1, browAy: 0, browAr: 0, browBy: 0, browBr: 0, headPitch: 0, ...o });

export const emotions: Record<Emotion, Face> = {
  sleep:     f({ eyeH: 0.06, glow: 0.12, browAy: -0.03, browBy: -0.03, headPitch: 0.18 }),
  neutral:   f({}),
  happy:     f({ eyeW: 1.05, eyeH: 0.62, glow: 1.25, browAy: 0.04, browBy: 0.04, browAr: -0.05, browBr: -0.05 }),
  surprised: f({ eyeW: 1.2, eyeH: 1.5, glow: 1.3, browAy: 0.09, browBy: 0.09 }),
  nervous:   f({ eyeW: 0.9, eyeH: 1.15, glow: 0.9, browAy: 0.05, browBy: 0.05, browAr: -0.4, browBr: -0.4 }),
  sly:       f({ eyeH: 0.55, browAy: 0.08, browAr: 0.3, browBy: -0.02, browBr: 0.25 }),
  soft:      f({ eyeH: 0.85, glow: 0.85, browAr: -0.18, browBr: -0.18, headPitch: 0.06 }),
  proud:     f({ eyeW: 1.05, eyeH: 0.8, glow: 1.2, browAy: 0.04, browBy: 0.04, browAr: 0.06, browBr: 0.06, headPitch: -0.1 }),
  confused:  f({ browAy: 0.09, browAr: -0.12, browBy: -0.02, browBr: 0.32 }),
  laugh:     f({ eyeW: 1.15, eyeH: 0.35, glow: 1.3, browAy: 0.05, browBy: 0.05 }),
};

const ease = (x: number) => { const t = Math.min(1, Math.max(0, x)); return t * t * (3 - 2 * t); };

/**
 * Target pose for an emotion + gesture.
 * t: seconds since the gesture began. m: motion scale (0 for reduced motion = hold poses, skip wobble).
 */
export function targetPose(emotion: Emotion, gesture: Gesture, t: number, m = 1): Pose {
  const p: Pose = { ...basePose, ...emotions[emotion] };
  const s = (x: number) => Math.sin(x) * m;
  const a = ease(t / 0.35); // blend-in so poses don't snap

  switch (gesture) {
    case "idle":
    case "faceCamera":
      break;
    case "lookAround":
      p.headYaw = s(t * 1.3) * 0.75; p.headPitch += s(t * 0.9) * 0.1; break;
    case "tilt":
      p.headRoll = 0.38 * a; p.headPitch += 0.05; break;
    case "point":
      p.aBx = -1.45 * a; p.aBz = -0.12; p.aBx += s(t * 5) * 0.04 * a; p.lean = 0.05; break;
    case "laugh":
      p.bodyY = Math.abs(s(t * 10)) * 0.08; p.lean = -0.1 + s(t * 10) * 0.05;
      p.aAz = 0.9 + s(t * 10) * 0.2; p.aBz = -0.9 - s(t * 10) * 0.2; p.headPitch -= 0.15; break;
    case "tremble":
      p.shake = 0.025 * m; p.aAz = 0.1; p.aBz = -0.1; p.aAx = -0.5; p.aBx = -0.5; p.bodyY = -0.03; break;
    case "surprise":
      p.bodyY = t < 0.5 ? Math.sin((t / 0.5) * Math.PI) * 0.22 * m : 0;
      p.aAz = 1.1 * a; p.aBz = -1.1 * a; p.lean = -0.12 * a; break;
    case "think":
      p.bodyY = -0.27 * a; p.legA = -1.4 * a; p.legB = -1.4 * a;
      p.aBx = -1.9 * a; p.aBz = -0.3; p.headPitch += 0.15; p.headRoll = 0.1 + s(t * 0.8) * 0.06; break;
    case "celebrate":
      p.bodyY = Math.abs(s(t * 6)) * 0.16; p.aAz = 2.7 + s(t * 12) * 0.2; p.aBz = -2.7 - s(t * 12) * 0.2;
      p.headPitch -= 0.2; p.roll = s(t * 3) * 0.06; break;
    case "wave":
      p.aAz = 2.5 * a + s(t * 9) * 0.35; p.headRoll = 0.1 * a; break;
    case "checkWatch":
      p.aBx = -1.3 * a; p.aBz = -0.6; p.aBx += s(t * 8) * 0.05; p.headPitch += 0.25 * a; break;
    case "lean":
      p.lean = 0.32 * a; p.headPitch -= 0.1; break;
    case "shrug":
      p.aAz = 0.95 * a; p.aBz = -0.95 * a; p.headRoll = 0.15 * a; p.bodyY = 0.04 * a; break;
  }
  return p;
}

/** Walk/run cycle added on top of a pose. `phase` advances with distance travelled. */
export function applyLocomotion(p: Pose, phase: number, run: boolean, armsFree: boolean): Pose {
  const amp = run ? 0.9 : 0.55;
  const out = { ...p };
  out.legA = Math.sin(phase) * amp;
  out.legB = -Math.sin(phase) * amp;
  out.bodyY += Math.abs(Math.cos(phase)) * (run ? 0.1 : 0.04);
  out.lean += run ? 0.2 : 0.05;
  if (armsFree) {
    out.aAx = -Math.sin(phase) * amp * 0.8;
    out.aBx = Math.sin(phase) * amp * 0.8;
    if (run) { out.aAz = 0.1; out.aBz = -0.1; }
  }
  return out;
}

/** Gestures whose arms are doing something specific; the walk cycle should not swing them. */
export const armGestures: readonly Gesture[] = ["point", "laugh", "tremble", "surprise", "think", "celebrate", "wave", "checkWatch", "shrug"];

/** Exponential smoothing of `cur` towards `tgt` in place. */
export function dampPose(cur: Pose, tgt: Pose, dt: number, rate = 9, faceRate = 16) {
  const faceKeys = new Set(["eyeW", "eyeH", "glow", "browAy", "browAr", "browBy", "browBr"]);
  for (const k of poseKeys) {
    const r = faceKeys.has(k) ? faceRate : rate;
    cur[k] += (tgt[k] - cur[k]) * (1 - Math.exp(-r * dt));
  }
}

/** Shortest-angle interpolation. */
export function lerpAngle(a: number, b: number, k: number) {
  let d = ((b - a + Math.PI) % (2 * Math.PI)) - Math.PI;
  if (d < -Math.PI) d += 2 * Math.PI;
  return a + d * k;
}
