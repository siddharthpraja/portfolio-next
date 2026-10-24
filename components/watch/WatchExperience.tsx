"use client";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Component, useEffect, useMemo, useReducer, useRef, useState, type ReactNode } from "react";
import { StoryAudio } from "@/lib/audio/engine";
import { beatDuration } from "@/lib/story/engine";
import { makeEngine } from "@/lib/story/engineFor";
import { features, featureChapter, getFeature } from "@/lib/story/features";
import { accountbizLiveUrl } from "@/lib/accountbiz";

const StoryScene = dynamic(() => import("@/components/story/StoryScene"), { ssr: false, loading: () => <div className="absolute inset-0 bg-[#03050a]" role="status" aria-label="Loading" /> });

class Boundary extends Component<{ onError: () => void; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onError(); }
  render() { return this.state.failed ? null : this.props.children; }
}

const btn = "min-h-11 border border-fg/50 bg-ink/70 px-4 text-sm font-semibold backdrop-blur hover:border-lime hover:text-lime";

export function WatchExperience({ slug }: { slug: string }) {
  const f = getFeature(slug)!;
  const idx = features.findIndex((x) => x.slug === slug);
  const next = features[(idx + 1) % features.length];
  const chapter = useMemo(() => featureChapter(f), [f]);
  const eng = useMemo(() => makeEngine([chapter]), [chapter]);
  const [state, dispatch] = useReducer(eng.reducer, undefined, eng.initialState);
  const [mode, setMode] = useState<"boot" | "3d" | "2d">("boot");
  const [reduced, setReduced] = useState(false);
  const [lowPower, setLowPower] = useState(false);
  const [audioOn, setAudioOn] = useState(false);
  const [english, setEnglish] = useState(false);
  const [started, setStarted] = useState(false);
  const speaking = useRef(false);
  const statusRef = useRef<string>("paused");
  const audio = useMemo(() => new StoryAudio(), []);
  const beat = eng.beatOf(state);
  const pain = state.flags.includes("papersLoop");
  statusRef.current = state.status;
  const ended = state.status === "ended" || state.flags.includes("end");

  useEffect(() => {
    let gl = false;
    try { const c = document.createElement("canvas"); gl = !!(c.getContext("webgl2") || c.getContext("webgl")); } catch { gl = false; }
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReduced(rm); setLowPower(navigator.hardwareConcurrency <= 2 || window.innerWidth < 768);
    setMode(gl && !rm ? "3d" : "2d");
    return () => audio.dispose();
  }, [audio]);

  useEffect(() => { if (audioOn && mode === "3d") audio.setMusic(chapter.music); else audio.setMusic(null); }, [audio, audioOn, mode, chapter.music]);

  // One timer or one utterance per beat, guarded by seq (same rule as the main story).
  useEffect(() => {
    if (mode !== "3d" || state.status !== "playing") { speaking.current = false; return; }
    const seq = state.seq, b = beat, timers: number[] = [];
    const finish = () => dispatch({ type: "finish", seq });
    if (b.sfx) audio.sfx(b.sfx);
    let voiced = false;
    if (b.text) {
      speaking.current = true;
      if (audioOn) voiced = audio.speak(b, () => { speaking.current = false; timers.push(window.setTimeout(finish, 500)); });
    }
    if (!b.hold) timers.push(window.setTimeout(() => { speaking.current = false; finish(); }, voiced ? beatDuration(b) * 2.2 + 3000 : beatDuration(b)));
    return () => { timers.forEach((t) => window.clearTimeout(t)); audio.cancelSpeech(); speaking.current = false; };
  }, [state.seq, state.status, mode]); // eslint-disable-line react-hooks/exhaustive-deps

  const hiddenPaused = useRef(false);
  useEffect(() => {
    const onVis = () => {
      if (document.hidden) { if (statusRef.current === "playing") { hiddenPaused.current = true; dispatch({ type: "pause" }); } }
      else if (hiddenPaused.current) { hiddenPaused.current = false; dispatch({ type: "resume" }); }
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  const play = async (sound: boolean) => {
    if (sound) { await audio.enable(); setAudioOn(audio.enabled); audio.sfx("click"); }
    setStarted(true); dispatch({ type: "resume" });
  };
  const replay = () => { setStarted(true); dispatch({ type: "replayChapter" }); };
  const lines = [f.pain, ...f.fix].map((l) => (english ? l[1] : l[0]));

  const End = (
    <div className="flex flex-wrap justify-center gap-3">
      <button type="button" onClick={replay} className={btn}>Replay</button>
      <Link href={`/watch/${next.slug}`} className={btn + " grid place-items-center"}>Next: {next.title}</Link>
      <a href={accountbizLiveUrl} target="_blank" rel="noopener noreferrer" className="grid min-h-11 place-items-center bg-lime px-5 text-sm font-bold text-ink">Open Accountbiz</a>
      <Link href="/accountbiz" className={btn + " grid place-items-center"}>All features</Link>
    </div>
  );

  if (mode === "boot") return <div className="fixed inset-0 bg-[#03050a]" />;
  if (mode === "2d") {
    return (
      <main id="main" className="min-h-dvh bg-ink px-5 py-16 text-fg">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-4xl font-extrabold tracking-tight">{f.title}</h1>
          <ol className="mt-8 space-y-5">
            {lines.map((l, i) => (
              <li key={i} className={"border-l-4 pl-4 text-xl " + (i === 0 ? "border-red-400" : "border-lime")}><span className="font-mono text-xs text-muted">{i === 0 ? "The pain" : "The fix"}</span><br />{l}</li>
            ))}
          </ol>
          <div className="mt-10">{End}</div>
        </div>
      </main>
    );
  }

  return (
    <div id="main" className="fixed inset-0 overflow-hidden bg-[#03050a] text-fg">
      <Boundary onError={() => setMode("2d")}>
        <StoryScene chapter={chapter} beat={beat} seq={state.seq} flags={state.flags} speaking={speaking} active
          reduced={reduced} lowPower={lowPower} onProject={() => {}} onSkillGroup={() => {}} onOpenLive={() => window.open(accountbizLiveUrl, "_blank", "noopener,noreferrer")} onFail={() => setMode("2d")} />
      </Boundary>

      <header className="absolute inset-x-0 top-0 z-20 flex items-center justify-between gap-3 p-4 pt-[max(1rem,env(safe-area-inset-top))]">
        <Link href="/accountbiz" className={btn + " grid place-items-center"}>← Features</Link>
        <div className="text-right">
          <p className={"font-mono text-xs font-bold " + (pain ? "text-red-400" : "text-lime")}>{ended ? "BALANCED" : pain ? "THE PAIN" : "THE FIX"}</p>
          <h1 className="text-lg font-extrabold leading-tight sm:text-2xl">{f.title}</h1>
        </div>
      </header>

      {!started && (
        <div className="absolute inset-0 z-30 grid place-items-center bg-black/60 p-6 text-center backdrop-blur-sm">
          <div className="max-w-md">
            <p className="text-3xl font-extrabold tracking-tight sm:text-5xl">{f.title}</p>
            <p className="mt-3 text-muted">A 30 second story: the pain, then the fix.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <button type="button" onClick={() => play(true)} className="min-h-12 bg-lime px-6 text-sm font-bold text-ink">Watch with sound</button>
              <button type="button" onClick={() => play(false)} className={btn}>Captions only</button>
            </div>
          </div>
        </div>
      )}

      <div className="absolute inset-x-0 bottom-0 z-20 flex flex-col items-center gap-3 bg-gradient-to-t from-black/85 to-transparent p-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-16">
        {beat.text && !ended && <p role="status" aria-live="polite" className="max-w-2xl text-center text-lg font-semibold leading-snug drop-shadow sm:text-2xl">{english ? beat.en : beat.text}</p>}
        {ended ? End : (
          <div className="flex flex-wrap justify-center gap-2">
            <button type="button" className={btn} onClick={() => dispatch({ type: state.status === "paused" ? "resume" : "pause" })}>{state.status === "paused" ? "Play" : "Pause"}</button>
            <button type="button" className={btn} onClick={replay}>Replay</button>
            <button type="button" className={btn} aria-pressed={english} onClick={() => setEnglish((v) => !v)}>{english ? "Hinglish" : "English"}</button>
            <Link href={`/watch/${next.slug}`} className={btn + " grid place-items-center"}>Skip →</Link>
          </div>
        )}
      </div>
    </div>
  );
}
