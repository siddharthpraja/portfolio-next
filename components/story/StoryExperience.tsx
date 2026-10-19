"use client";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Component, useCallback, useEffect, useMemo, useReducer, useRef, useState, type ReactNode } from "react";
import { chapters } from "@/lib/story/script";
import { beatDuration, currentBeat, currentChapter, initialState, lastChapter, reducer } from "@/lib/story/engine";
import { StoryAudio } from "@/lib/audio/engine";
import { defaultPrefs, loadPrefs, savePrefs, type Prefs } from "@/lib/story/prefs";
import { accountbizLiveUrl } from "@/lib/accountbiz";
import { contactLinks, site } from "@/lib/site";
import { ChaptersBody, ContactBody, FeaturesCard, Panel, ProjectsBody, SkillsBody, type PanelState } from "./Panels";
import { Fallback2D } from "./Fallback2D";

const StoryScene = dynamic(() => import("./StoryScene"), { ssr: false, loading: () => <Loading /> });

function Loading() {
  return (
    <div className="absolute inset-0 grid place-items-center bg-[#03050a]" role="status">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">Waking up the bot…</p>
    </div>
  );
}

class SceneBoundary extends Component<{ onError: () => void; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onError(); }
  render() { return this.state.failed ? null : this.props.children; }
}

function webglAvailable(): boolean {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch { return false; }
}

type Mode = "boot" | "3d" | "2d";

export function StoryExperience() {
  const [state, dispatch] = useReducer(reducer, undefined, initialState);
  const [mode, setMode] = useState<Mode>("boot");
  const [why2d, setWhy2d] = useState<"no-webgl" | "reduced-motion" | "slow" | "chosen" | null>(null);
  const [canGL, setCanGL] = useState(true);
  const [reduced, setReduced] = useState(false);
  const [lowPower, setLowPower] = useState(false);
  const [prefs, setPrefs] = useState<Prefs>(defaultPrefs);
  const [audioOn, setAudioOn] = useState(false);
  const [active, setActive] = useState(true);
  const [panel, setPanel] = useState<PanelState | null>(null);
  const speaking = useRef(false);
  const wasPlaying = useRef(false);
  const hiddenPaused = useRef(false);
  const audio = useMemo(() => new StoryAudio(), []);

  const chapter = currentChapter(state);
  const beat = currentBeat(state);

  // ── boot: detect capability and preferences ──
  useEffect(() => {
    const gl = webglAvailable();
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mem = (navigator as unknown as { deviceMemory?: number }).deviceMemory;
    const weak = (mem !== undefined && mem <= 3) || navigator.hardwareConcurrency <= 2 || window.innerWidth < 768;
    const p = loadPrefs();
    setCanGL(gl); setReduced(rm); setLowPower(weak); setPrefs(p);
    audio.volume = p.volume; audio.muted = p.muted; audio.voiceOn = p.voice;
    if (!gl) { setWhy2d("no-webgl"); setMode("2d"); }
    else if (rm) { setWhy2d("reduced-motion"); setMode("2d"); }
    else setMode("3d");
    return () => audio.dispose();
  }, [audio]);

  const updatePrefs = useCallback((patch: Partial<Prefs>) => {
    setPrefs((cur) => { const n = { ...cur, ...patch }; savePrefs(n); return n; });
  }, []);

  // ── audio: only ever started from a click ──
  const enableSound = useCallback(async () => {
    await audio.enable();
    audio.volume = prefs.volume; audio.setMuted(prefs.muted); audio.voiceOn = prefs.voice;
    setAudioOn(audio.enabled);
    audio.sfx("click");
  }, [audio, prefs]);

  useEffect(() => { audio.setVolume(prefs.volume); audio.setMuted(prefs.muted); audio.voiceOn = prefs.voice; }, [audio, prefs]);
  useEffect(() => { if (audioOn && mode === "3d") audio.setMusic(chapter.music); }, [audio, audioOn, mode, chapter.music]);
  useEffect(() => { if (mode !== "3d") { audio.setMusic(null); audio.cancelSpeech(); } }, [audio, mode]);

  // ── the player: one timer or one utterance per beat, guarded by seq ──
  useEffect(() => {
    if (mode !== "3d" || state.status !== "playing") { speaking.current = false; return; }
    const seq = state.seq;
    const b = beat;
    const timers: number[] = [];
    const finish = () => dispatch({ type: "finish", seq });
    const dur = beatDuration(b);
    if (b.sfx) audio.sfx(b.sfx);
    let voiced = false;
    if (b.text) {
      speaking.current = true;
      if (audioOn) voiced = audio.speak(b, () => { speaking.current = false; timers.push(window.setTimeout(finish, 500)); });
      if (b.text && audioOn && !voiced) {
        // no usable voice: little talk blips so the character still feels alive
        for (let i = 0; i < Math.min(14, Math.floor(dur / 260)); i++) timers.push(window.setTimeout(() => audio.sfx("blip"), 150 + i * 260));
      }
    }
    if (!b.hold) {
      timers.push(window.setTimeout(() => { speaking.current = false; finish(); }, voiced ? dur * 2.2 + 3000 : dur));
    } else if (b.text && !voiced) {
      timers.push(window.setTimeout(() => { speaking.current = false; }, dur));
    }
    return () => { timers.forEach((t) => window.clearTimeout(t)); audio.cancelSpeech(); speaking.current = false; };
    // `beat` is derived from state.chapter/state.beat, which always change together with seq
  }, [state.seq, state.status, mode]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── pause when the tab is hidden ──
  useEffect(() => {
    const onVis = () => {
      const hidden = document.hidden;
      setActive(!hidden);
      if (hidden) { hiddenPaused.current = true; dispatch({ type: "pause" }); void audio.suspend(); }
      else { void audio.resume(); if (hiddenPaused.current) { hiddenPaused.current = false; dispatch({ type: "resume" }); } }
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [audio]);

  // ── panels pause the story ──
  const openPanel = useCallback((p: PanelState) => {
    if (state.status === "playing") { wasPlaying.current = true; dispatch({ type: "pause" }); }
    setPanel(p);
  }, [state.status]);
  const closePanel = useCallback(() => {
    setPanel(null);
    if (wasPlaying.current) { wasPlaying.current = false; dispatch({ type: "resume" }); }
  }, []);

  // ── keyboard ──
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (panel || e.metaKey || e.ctrlKey || e.altKey) return;
      if (t && /^(INPUT|TEXTAREA|SELECT|BUTTON|A)$/.test(t.tagName)) return;
      if (e.key === " ") { e.preventDefault(); dispatch({ type: state.status === "paused" ? "resume" : "pause" }); }
      else if (e.key === "ArrowRight") dispatch({ type: "skipChapter" });
      else if (e.key.toLowerCase() === "r") dispatch({ type: "replayChapter" });
      else if (e.key.toLowerCase() === "m") updatePrefs({ muted: !prefs.muted });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [panel, state.status, prefs.muted, updatePrefs]);

  const fail = useCallback((reason: "context-lost" | "slow") => { setWhy2d(reason === "slow" ? "slow" : "no-webgl"); setMode("2d"); }, []);

  const onStart = async () => { await enableSound(); dispatch({ type: "goChapter", chapter: 1 }); };
  const soundClick = async () => { if (!audioOn) await enableSound(); else updatePrefs({ muted: !prefs.muted }); };

  // ───────────── render ─────────────
  if (mode === "boot") return <div className="fixed inset-0 bg-[#03050a]"><Loading /></div>;
  if (mode === "2d") {
    return <Fallback2D reason={why2d} canPlay3D={canGL} onPlay3D={() => { setWhy2d(null); setMode("3d"); dispatch({ type: "goChapter", chapter: 0 }); }} />;
  }

  const inIntro = chapter.n === 0;
  const hasFlag = (f: (typeof state.flags)[number]) => state.flags.includes(f);
  const showStart = inIntro && hasFlag("cta");
  const showContinue = !inIntro && !!beat.hold && chapter.n !== lastChapter;
  const ended = hasFlag("end");

  return (
    <div className="fixed inset-0 overflow-hidden bg-[#03050a] text-fg" id="main">
      <SceneBoundary onError={() => fail("context-lost")}>
        <StoryScene
          chapter={chapter} beat={beat} seq={state.seq} flags={state.flags} speaking={speaking}
          active={active}
          reduced={reduced} lowPower={lowPower}
          onProject={(slug) => openPanel({ type: "project", slug })}
          onSkillGroup={(id) => openPanel({ type: "skills", group: id })}
          onOpenLive={() => window.open(accountbizLiveUrl, "_blank", "noopener,noreferrer")}
          onFail={fail}
        />
      </SceneBoundary>

      {/* chapter change: quick fade through black, never blocks input */}
      <div key={chapter.id} aria-hidden className="story-fade pointer-events-none absolute inset-0 bg-black" />

      {/* top bar */}
      <header className="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-center justify-between gap-2 p-3 sm:p-5">
        <Link href="/" className="pointer-events-auto border border-line bg-ink/70 px-3 py-2 font-mono text-xs uppercase tracking-wider backdrop-blur hover:border-lime hover:text-lime">← Portfolio</Link>
        <nav aria-label="Story shortcuts" className="pointer-events-auto flex flex-wrap justify-end gap-2">
          {([["Projects", () => openPanel({ type: "projects" })], ["Skills", () => openPanel({ type: "skills" })], ["Chapters", () => openPanel({ type: "chapters" })]] as const).map(([l, fn]) => (
            <button key={l} type="button" onClick={fn} className="border border-line bg-ink/70 px-3 py-2 font-mono text-xs uppercase tracking-wider backdrop-blur hover:border-lime hover:text-lime">{l}</button>
          ))}
          <button type="button" onClick={() => openPanel({ type: "contact" })} className="bg-lime px-3 py-2 font-mono text-xs font-semibold uppercase tracking-wider text-ink">Contact</button>
        </nav>
      </header>

      {/* chapter title card */}
      {beat.title && !inIntro && (
        <div key={chapter.id + "-title"} className="story-title pointer-events-none absolute inset-x-0 top-[22%] z-20 px-6 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent">Chapter {String(chapter.n).padStart(2, "0")}</p>
          <p className="mt-3 text-4xl font-extrabold tracking-tight drop-shadow sm:text-6xl">{chapter.title}</p>
          <p className="mt-2 font-serif text-xl italic text-muted">{chapter.subtitle}</p>
        </div>
      )}

      {/* opening title + start actions */}
      {inIntro && hasFlag("title") && (
        <div className="story-title pointer-events-none absolute inset-x-0 top-[16%] z-20 px-6 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight drop-shadow sm:text-7xl">{site.name.toUpperCase()}</h1>
          <p className="mt-3 font-serif text-2xl italic text-accent sm:text-3xl">The Human Behind the Code</p>
        </div>
      )}
      {inIntro && (
        <div className="absolute inset-x-0 bottom-36 z-30 flex flex-wrap items-center justify-center gap-3 px-4 sm:bottom-40">
          {showStart && (
            <button type="button" onClick={onStart} autoFocus className="bg-lime px-6 py-4 text-sm font-semibold uppercase tracking-wider text-ink transition-transform hover:-translate-y-0.5">
              Chalo, Story Shuru Karein
            </button>
          )}
          <button type="button" onClick={() => dispatch({ type: "goChapter", chapter: 1 })} className="border border-fg/50 bg-ink/60 px-5 py-4 text-sm uppercase tracking-wider backdrop-blur hover:border-lime hover:text-lime">
            Skip Intro
          </button>
        </div>
      )}

      {/* accountbiz chapter extras */}
      {hasFlag("features") && chapter.n === 6 && <FeaturesCard />}
      {chapter.n === 6 && hasFlag("cta") && (
        <div className="absolute inset-x-0 bottom-44 z-30 flex justify-center px-4">
          <a href={accountbizLiveUrl} target="_blank" rel="noopener noreferrer" className="bg-lime px-6 py-4 text-sm font-semibold uppercase tracking-wider text-ink">
            Open Accountbiz ↗<span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>
      )}

      {/* chapter 7: contact + replay */}
      {hasFlag("contact") && (
        <ul aria-label="Contact Gautam" className="absolute inset-x-0 bottom-44 z-30 flex flex-wrap justify-center gap-2 px-4">
          {contactLinks().map((c) => (
            <li key={c.label}>
              <a href={c.href} {...(c.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="block border border-fg/40 bg-ink/80 px-4 py-3 text-sm font-semibold uppercase tracking-wider backdrop-blur hover:border-lime hover:text-lime">
                {c.label}{c.href.startsWith("http") && <span className="sr-only"> (opens in a new tab)</span>}
              </a>
            </li>
          ))}
        </ul>
      )}
      {ended && (
        <div className="absolute inset-x-0 bottom-60 z-30 flex flex-wrap justify-center gap-3 px-4 sm:bottom-56">
          <button type="button" onClick={() => dispatch({ type: "goChapter", chapter: 0 })} className="border border-fg/50 bg-ink/80 px-5 py-3 text-sm uppercase tracking-wider hover:border-lime hover:text-lime">Replay story</button>
          <button type="button" onClick={() => openPanel({ type: "projects" })} className="border border-fg/50 bg-ink/80 px-5 py-3 text-sm uppercase tracking-wider hover:border-lime hover:text-lime">Explore projects</button>
        </div>
      )}

      {/* captions */}
      <div className="pointer-events-none absolute inset-x-0 bottom-20 z-20 flex justify-center px-3 sm:bottom-24">
        <div role="status" aria-live="polite" className="max-w-3xl text-center">
          {beat.text && state.status !== "ended" && (
            <p key={beat.id} className="inline-block bg-black/80 px-4 py-2 text-lg font-medium leading-snug text-white sm:text-2xl">
              {beat.text}
              {prefs.english && beat.en && <span className="mt-1 block text-sm font-normal text-white/80 sm:text-base">{beat.en}</span>}
            </p>
          )}
        </div>
      </div>

      {/* controls */}
      <div className="absolute inset-x-0 bottom-0 z-30 border-t border-line bg-ink/80 px-3 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur sm:px-5">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-4 gap-y-2">
          <div className="flex items-center gap-1.5" role="group" aria-label="Playback">
            <Ctl label="Replay chapter" onClick={() => dispatch({ type: "replayChapter" })}>↺</Ctl>
            <Ctl label={state.status === "paused" ? "Resume" : "Pause"} onClick={() => dispatch({ type: state.status === "paused" ? "resume" : "pause" })}>{state.status === "paused" ? "▶" : "❚❚"}</Ctl>
            <Ctl label={chapter.n === lastChapter ? "Skip to the end" : "Skip chapter"} onClick={() => dispatch({ type: "skipChapter" })}>⏭</Ctl>
            {showContinue && (
              <button type="button" onClick={() => dispatch({ type: "next" })} className="ml-1 bg-lime px-4 py-2 text-xs font-semibold uppercase tracking-wider text-ink">Continue →</button>
            )}
          </div>

          <ol aria-label="Chapters" className="hidden items-center gap-1.5 md:flex">
            {chapters.slice(1).map((c) => (
              <li key={c.id}>
                <button type="button" onClick={() => dispatch({ type: "goChapter", chapter: c.n })} aria-label={`Chapter ${c.n}: ${c.title}`} aria-current={c.n === chapter.n ? "step" : undefined}
                  className={`h-2.5 w-8 transition-colors ${c.n === chapter.n ? "bg-lime" : c.n < chapter.n ? "bg-fg/60" : "bg-fg/20 hover:bg-fg/40"}`} />
              </li>
            ))}
          </ol>
          <p className="font-mono text-[11px] uppercase tracking-wider text-muted md:hidden">{inIntro ? "Intro" : `Ch ${chapter.n}/7`}</p>

          <div className="flex items-center gap-1.5" role="group" aria-label="Sound and captions">
            <Ctl label={!audioOn ? "Turn sound on" : prefs.muted ? "Unmute" : "Mute"} onClick={soundClick} pressed={audioOn && !prefs.muted}>{!audioOn || prefs.muted ? "🔇" : "🔊"}</Ctl>
            <label className="hidden items-center sm:flex">
              <span className="sr-only">Volume</span>
              <input type="range" min={0} max={1} step={0.05} value={prefs.volume} onChange={(e) => updatePrefs({ volume: Number(e.target.value) })} className="h-1 w-20 accent-[#c6ff3d]" />
            </label>
            <Ctl label={prefs.voice ? "Voice on (click to turn off)" : "Voice off (click to turn on)"} onClick={() => updatePrefs({ voice: !prefs.voice })} pressed={prefs.voice}>VO</Ctl>
            <Ctl label={prefs.english ? "English captions on" : "English captions off"} onClick={() => updatePrefs({ english: !prefs.english })} pressed={prefs.english}>EN</Ctl>
            <Ctl label="Switch to the text version" onClick={() => { setWhy2d("chosen"); setMode("2d"); }}>Aa</Ctl>
          </div>
        </div>
      </div>

      {panel && (
        <Panel
          title={panel.type === "contact" ? "Contact Gautam" : panel.type === "projects" || panel.type === "project" ? "Projects" : panel.type === "skills" ? "Skills" : "Chapters"}
          onClose={closePanel}
        >
          {panel.type === "contact" && <ContactBody />}
          {(panel.type === "projects" || panel.type === "project") && <ProjectsBody initial={panel.type === "project" ? panel.slug : undefined} />}
          {panel.type === "skills" && <SkillsBody initialGroup={panel.group} />}
          {panel.type === "chapters" && <ChaptersBody current={chapter.n} onGo={(n) => { dispatch({ type: "goChapter", chapter: n }); setPanel(null); wasPlaying.current = false; }} />}
        </Panel>
      )}
    </div>
  );
}

function Ctl({ label, onClick, children, pressed }: { label: string; onClick: () => void; children: ReactNode; pressed?: boolean }) {
  return (
    <button type="button" onClick={onClick} aria-label={label} title={label} aria-pressed={pressed}
      className={`grid h-10 min-w-10 place-items-center border px-2 text-sm ${pressed ? "border-lime text-lime" : "border-line hover:border-lime hover:text-lime"}`}>
      {children}
    </button>
  );
}
