import { chapters } from "./script";
import type { Beat, Chapter, Flag } from "./types";

// Pure playback state machine. No timers, no audio, no React in here, so it can be tested directly.
// Rule that prevents overlapping dialogue: every change of beat bumps `seq`, and a "finish"
// from a timer or a speech callback is ignored unless it carries the current `seq`.

export type Status = "playing" | "paused" | "ended";

export type PlayState = {
  chapter: number;
  beat: number;
  status: Status;
  flags: Flag[];
  seq: number;
};

export type Action =
  | { type: "finish"; seq: number }
  | { type: "next" }              // Continue button: leaves a hold, or skips the current beat
  | { type: "skipChapter" }
  | { type: "replayChapter" }
  | { type: "goChapter"; chapter: number }
  | { type: "pause" }
  | { type: "resume" };

export const lastChapter = chapters.length - 1;

function applyBeatFlags(flags: Flag[], beat: Beat): Flag[] {
  let out = flags.filter((f) => !(beat.clear ?? []).includes(f));
  for (const f of beat.set ?? []) if (!out.includes(f)) out = [...out, f];
  return out;
}

function enter(state: PlayState, chapter: number, beat: number, resetFlags: boolean): PlayState {
  const c = chapters[chapter];
  const base = resetFlags ? [] : state.flags;
  return {
    ...state,
    chapter,
    beat,
    status: state.status === "ended" ? "playing" : state.status,
    flags: applyBeatFlags(base, c.beats[beat]),
    seq: state.seq + 1,
  };
}

export function initialState(): PlayState {
  return enter({ chapter: 0, beat: 0, status: "playing", flags: [], seq: 0 }, 0, 0, true);
}

function advance(state: PlayState): PlayState {
  const c = chapters[state.chapter];
  if (state.beat < c.beats.length - 1) return enter(state, state.chapter, state.beat + 1, false);
  if (state.chapter < lastChapter) return enter(state, state.chapter + 1, 0, true);
  return { ...state, status: "ended", seq: state.seq + 1 };
}

export function reducer(state: PlayState, a: Action): PlayState {
  switch (a.type) {
    case "finish": {
      if (a.seq !== state.seq || state.status !== "playing") return state; // stale or paused
      if (currentBeat(state).hold) return state;                           // holds wait for the visitor
      return advance(state);
    }
    case "next":
      if (state.status === "ended") return state;
      return advance({ ...state, status: "playing" });
    case "skipChapter":
      if (state.chapter < lastChapter) return enter({ ...state, status: "playing" }, state.chapter + 1, 0, true);
      // Last chapter: jump to its final beat so nothing is lost.
      return enter({ ...state, status: "playing" }, state.chapter, chapters[state.chapter].beats.length - 1, false);
    case "replayChapter":
      return enter({ ...state, status: "playing" }, state.chapter, 0, true);
    case "goChapter": {
      const ch = Math.max(0, Math.min(lastChapter, a.chapter));
      return enter({ ...state, status: "playing" }, ch, 0, true);
    }
    case "pause":
      return state.status === "playing" ? { ...state, status: "paused" } : state;
    case "resume":
      // Restart the current beat so speech and timers begin cleanly.
      return state.status === "paused" ? { ...state, status: "playing", seq: state.seq + 1 } : state;
  }
}

export const currentChapter = (s: PlayState): Chapter => chapters[s.chapter];
export const currentBeat = (s: PlayState): Beat => chapters[s.chapter].beats[s.beat];

/** How long a beat stays on screen when no voice is driving it. */
export function beatDuration(b: Beat): number {
  if (b.text) return Math.min(9000, Math.max(2200, 1500 + b.text.length * 55));
  return b.pause ?? 1200;
}
