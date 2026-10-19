// Run: npx tsx scripts/check-story.ts
// Validates the script data and the playback state machine. No browser needed.
import assert from "node:assert/strict";
import { chapters } from "../lib/story/script";
import { reducer, initialState, currentBeat, currentChapter, beatDuration, lastChapter, type PlayState } from "../lib/story/engine";
import { projects } from "../lib/projects";
import { skillGroups } from "../lib/skills";
import { accountbizFeatures } from "../lib/accountbiz";

let passed = 0;
const test = (name: string, fn: () => void) => { fn(); passed++; console.log("ok -", name); };

const SHOTS = ["wide", "mid", "close", "eyes", "low", "high", "left", "right", "follow"];
const ENVS = ["void", "office", "corridor", "lab", "legacy", "universe", "reveal"];

test("opening plus seven chapters, numbered 0-7", () => {
  assert.equal(chapters.length, 8);
  chapters.forEach((c, i) => assert.equal(c.n, i));
});

test("all seven environments are used", () => {
  assert.deepEqual([...new Set(chapters.map((c) => c.env))].sort(), [...ENVS].sort());
});

test("beat ids are unique and every beat has valid fields", () => {
  const ids = new Set<string>();
  for (const c of chapters) {
    assert.ok(c.beats.length >= 4, `${c.id} needs 4+ beats`);
    for (const b of c.beats) {
      assert.ok(!ids.has(b.id), `duplicate id ${b.id}`); ids.add(b.id);
      assert.ok(SHOTS.includes(b.shot), `bad shot ${b.id}`);
      assert.ok(b.text || b.pause, `${b.id} needs text or a pause`);
    }
  }
});

test("every spoken line has Hinglish, Devanagari and English", () => {
  for (const c of chapters) for (const b of c.beats) if (b.text) {
    assert.ok(b.hi && /[ऀ-ॿ]/.test(b.hi), `${b.id} missing Devanagari`);
    assert.ok(b.en && b.en.length > 3, `${b.id} missing English`);
  }
});

test("each chapter has a title card beat and a basis note", () => {
  for (const c of chapters.slice(1)) {
    assert.ok(c.beats.some((b) => b.title), `${c.id} has no title beat`);
    assert.ok(c.basis.length > 10);
  }
});

test("opening ends on a hold with the CTA flag", () => {
  const last = chapters[0].beats.at(-1)!;
  assert.ok(last.hold && last.set?.includes("cta"));
});

test("opening lines match the brief exactly", () => {
  const t = chapters[0].beats.filter((b) => b.text).map((b) => b.text);
  assert.equal(t[0], "Hello? Testing... testing...");
  assert.equal(t[1], "Arre! Aap aa gaye? Finally!");
  assert.ok(t[2]!.startsWith("Main toh kab se wait kar raha tha."));
  assert.equal(t[3], "Chaliye, aapko ek interesting bande ki story sunata hoon. Naam hai Gautam.");
  assert.equal(t[4], "Developer hai. Projects banata hai. Accountbiz chalata hai.");
});

test("skills only reference real project slugs", () => {
  const slugs = new Set(projects.map((p) => p.slug));
  for (const g of skillGroups) for (const s of g.skills) for (const p of s.projects) assert.ok(slugs.has(p), `${s.name} -> ${p}`);
});

test("no invented feature lists: only 'implemented' is populated", () => {
  assert.ok(accountbizFeatures.implemented.length > 0);
  assert.equal(accountbizFeatures["in-development"].length + accountbizFeatures.idea.length, 0);
});

test("story plays from beginning to end via finish events", () => {
  let s: PlayState = initialState();
  const visited: string[] = [];
  let guard = 0;
  while (s.status !== "ended" && guard++ < 500) {
    visited.push(currentBeat(s).id);
    if (currentBeat(s).hold) s = reducer(s, { type: "next" });
    else s = reducer(s, { type: "finish", seq: s.seq });
  }
  assert.equal(s.status, "ended");
  assert.equal(visited.length, chapters.reduce((n, c) => n + c.beats.length, 0));
  assert.equal(new Set(visited.map((id) => chapters.findIndex((c) => c.beats.some((b) => b.id === id)))).size, 8);
});

test("stale finish events are ignored (no overlapping dialogue)", () => {
  const s0 = initialState();
  const s1 = reducer(s0, { type: "finish", seq: s0.seq });
  assert.notEqual(s1.beat, s0.beat);
  const s2 = reducer(s1, { type: "finish", seq: s0.seq }); // old timer fires late
  assert.equal(s2, s1);
});

test("paused state ignores finish; resume restarts the same beat with a new seq", () => {
  const s0 = initialState();
  const p = reducer(s0, { type: "pause" });
  assert.equal(reducer(p, { type: "finish", seq: p.seq }), p);
  const r = reducer(p, { type: "resume" });
  assert.equal(r.beat, s0.beat); assert.equal(r.status, "playing"); assert.ok(r.seq > s0.seq);
});

test("a hold beat does not auto-advance but Continue does", () => {
  let s = reducer(initialState(), { type: "goChapter", chapter: 0 });
  const holdIdx = chapters[0].beats.findIndex((b) => b.hold);
  s = { ...s, beat: holdIdx };
  assert.equal(reducer(s, { type: "finish", seq: s.seq }), s);
  assert.equal(reducer(s, { type: "next" }).chapter, 1);
});

test("skip chapter, replay chapter and jump all work immediately", () => {
  let s = initialState();
  s = reducer(s, { type: "skipChapter" }); assert.equal(s.chapter, 1); assert.equal(s.beat, 0);
  s = reducer(s, { type: "finish", seq: s.seq }); assert.equal(s.beat, 1);
  s = reducer(s, { type: "replayChapter" }); assert.equal(s.chapter, 1); assert.equal(s.beat, 0);
  s = reducer(s, { type: "goChapter", chapter: 5 }); assert.equal(currentChapter(s).id, "universe");
  s = reducer(s, { type: "goChapter", chapter: 99 }); assert.equal(s.chapter, lastChapter);
});

test("flags reset on chapter entry and apply set/clear", () => {
  let s = reducer(initialState(), { type: "goChapter", chapter: 6 });
  assert.deepEqual(s.flags, ["dark"]);                            // only this chapter's first-beat flag
  s = reducer(s, { type: "goChapter", chapter: 4 });
  for (let i = 0; i < 4; i++) s = reducer(s, { type: "next" });   // reach the 'legacyFixed' beat
  assert.ok(s.flags.includes("legacyFixed"));
  s = reducer(s, { type: "goChapter", chapter: 5 });
  assert.ok(!s.flags.includes("legacyFixed"));
});

test("skip on the last chapter lands on its final beat; ended stays ended", () => {
  let s = reducer(initialState(), { type: "goChapter", chapter: lastChapter });
  s = reducer(s, { type: "skipChapter" });
  assert.equal(s.beat, chapters[lastChapter].beats.length - 1);
  assert.ok(currentBeat(s).set?.includes("end"));
  s = reducer(s, { type: "next" });
  assert.equal(s.status, "ended");
  assert.equal(reducer(s, { type: "next" }), s);
});

test("durations are bounded and silent beats use pause", () => {
  for (const c of chapters) for (const b of c.beats) {
    const d = beatDuration(b);
    assert.ok(d >= 1000 && d <= 9000, `${b.id}: ${d}`);
  }
});

console.log(`\n${passed} checks passed`);

// ── Rig maths ──
import { targetPose, applyLocomotion, dampPose, basePose, poseKeys, emotions, lerpAngle } from "../lib/story/pose";
import { shotFor } from "../lib/story/shots";
import type { Emotion, Gesture } from "../lib/story/types";

test("every emotion x gesture gives finite, bounded poses over time (also with motion off)", () => {
  const gs = [...new Set(chapters.flatMap((c) => c.beats.map((b) => b.gesture)))] as Gesture[];
  const es = Object.keys(emotions) as Emotion[];
  for (const e of es) for (const g of gs) for (const m of [1, 0]) for (const t of [0, 0.2, 1, 7.3]) {
    const p = targetPose(e, g, t, m);
    for (const k of poseKeys) { assert.ok(Number.isFinite(p[k]), `${e}/${g}/${k}`); assert.ok(Math.abs(p[k]) < 4, `${e}/${g}/${k}=${p[k]}`); }
  }
});

test("every gesture and emotion named in the script exists in the rig", () => {
  const known: Gesture[] = ["idle","lookAround","tilt","point","laugh","tremble","surprise","think","celebrate","faceCamera","wave","checkWatch","lean","shrug"];
  for (const c of chapters) for (const b of c.beats) {
    assert.ok(known.includes(b.gesture), `${b.id} gesture ${b.gesture}`);
    assert.ok(b.emotion in emotions, `${b.id} emotion ${b.emotion}`);
  }
});

test("reduced motion removes wobble; held poses remain", () => {
  const a = targetPose("happy", "laugh", 0.77, 0), b = targetPose("happy", "laugh", 2.31, 0);
  assert.deepEqual(a, b);
  assert.ok(Math.abs(targetPose("happy", "celebrate", 1, 0).aAz - 2.7) < 1e-9);
});

test("damping converges and never overshoots", () => {
  const cur = { ...basePose }, tgt = targetPose("surprised", "wave", 5, 0);
  for (let i = 0; i < 400; i++) dampPose(cur, tgt, 1 / 60);
  for (const k of poseKeys) assert.ok(Math.abs(cur[k] - tgt[k]) < 1e-3, k);
});

test("walking swings legs; arm gestures keep their arms", () => {
  const w = applyLocomotion(basePose, Math.PI / 2, false, true);
  assert.ok(w.legA > 0.4 && w.legB < -0.4 && w.aAx < -0.3);
  const k = applyLocomotion(targetPose("proud", "point", 2), 1, false, false);
  assert.ok(k.aBx < -1.2);
});

test("angles take the short way round", () => {
  assert.ok(Math.abs(lerpAngle(3, -3, 1) - (-3 + 2 * Math.PI)) < 1e-9 || Math.abs(lerpAngle(3, -3, 1) - -3) < 1e-9);
  assert.ok(Math.abs(lerpAngle(0, Math.PI / 2, 0.5) - Math.PI / 4) < 1e-9);
});

test("all shots are above the floor, in front of the robot or beside it, with sane fov", () => {
  for (const s of SHOTS as any[]) {
    const f = shotFor(s, { x: 1, z: -2 });
    assert.ok(f.pos[1] > 0.2 && f.fov >= 25 && f.fov <= 60, s);
    assert.ok(f.pos.concat(f.look).every(Number.isFinite));
  }
});

console.log(`${passed} checks passed (with rig)`);
