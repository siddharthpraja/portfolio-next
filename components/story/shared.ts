import * as THREE from "three";
import type { Beat, Flag } from "@/lib/story/types";

/** Live robot position, written by <Robot/>, read by the camera and scenes. */
export type RobotPosRef = { current: { x: number; z: number } };
/** Whether the robot is currently speaking (drives mouth and chest light). */
export type SpeakingRef = { current: boolean };

export type SceneProps = {
  flags: Flag[];
  reduced: boolean;
  lowPower: boolean;
  beat: Beat;
};

/** Draw a small label to a canvas texture. Used instead of loading fonts. */
export function makeLabelTexture(lines: string[], opts: { w?: number; h?: number; bg?: string; fg?: string; size?: number; sub?: string } = {}) {
  const { w = 512, h = 128, bg = "rgba(0,0,0,0)", fg = "#ffffff", size = 54, sub } = opts;
  const c = document.createElement("canvas");
  c.width = w; c.height = h;
  const g = c.getContext("2d")!;
  g.fillStyle = bg; g.fillRect(0, 0, w, h);
  g.fillStyle = fg; g.textAlign = "center"; g.textBaseline = "middle";
  g.font = `700 ${size}px system-ui, sans-serif`;
  lines.forEach((l, i) => g.fillText(l, w / 2, h / 2 + (i - (lines.length - 1) / 2) * size * 1.15 - (sub ? size * 0.25 : 0)));
  if (sub) { g.font = `500 ${Math.round(size * 0.42)}px ui-monospace, monospace`; g.globalAlpha = 0.8; g.fillText(sub, w / 2, h - size * 0.45); }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export const hasFlag = (flags: Flag[], f: Flag) => flags.includes(f);

/** Exponential approach used for scene fades. */
export const approach = (cur: number, target: number, dt: number, rate = 3) => cur + (target - cur) * (1 - Math.exp(-rate * dt));
