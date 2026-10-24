import type { Beat, Chapter, Flag } from "./types";
import type { Action, PlayState } from "./engine";

// Same state machine as engine.ts, but for any list of chapters (used by the Accountbiz Watch pages).
export function makeEngine(chapters: Chapter[]) {
  const last = chapters.length - 1;
  const flagsFor = (flags: Flag[], b: Beat): Flag[] => {
    let out = flags.filter((f) => !(b.clear ?? []).includes(f));
    for (const f of b.set ?? []) if (!out.includes(f)) out = [...out, f];
    return out;
  };
  const enter = (s: PlayState, chapter: number, beat: number, reset: boolean): PlayState => ({
    ...s, chapter, beat, status: s.status === "ended" ? "playing" : s.status,
    flags: flagsFor(reset ? [] : s.flags, chapters[chapter].beats[beat]), seq: s.seq + 1,
  });
  const advance = (s: PlayState): PlayState => {
    const c = chapters[s.chapter];
    if (s.beat < c.beats.length - 1) return enter(s, s.chapter, s.beat + 1, false);
    if (s.chapter < last) return enter(s, s.chapter + 1, 0, true);
    return { ...s, status: "ended", seq: s.seq + 1 };
  };
  const beatOf = (s: PlayState): Beat => chapters[s.chapter].beats[s.beat];
  // Starts paused: the visitor's click (Play) is what begins playback and allows sound.
  const initialState = (): PlayState => ({ ...enter({ chapter: 0, beat: 0, status: "paused", flags: [], seq: 0 }, 0, 0, true), status: "paused" });
  const reducer = (s: PlayState, a: Action): PlayState => {
    switch (a.type) {
      case "finish": return a.seq !== s.seq || s.status !== "playing" || beatOf(s).hold ? s : advance(s);
      case "next": return s.status === "ended" ? s : advance({ ...s, status: "playing" });
      case "skipChapter": case "goChapter": return s;
      case "replayChapter": return enter({ ...s, status: "playing" }, 0, 0, true);
      case "pause": return s.status === "playing" ? { ...s, status: "paused" } : s;
      case "resume": return s.status === "paused" ? { ...s, status: "playing", seq: s.seq + 1 } : s;
    }
  };
  return { reducer, initialState, beatOf };
}
