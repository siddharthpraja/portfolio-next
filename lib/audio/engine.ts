// Audio for the story: procedural music and sound effects (Web Audio, no files to license)
// plus optional voice (browser speech synthesis).
// Nothing here runs until `enable()` is called from a user gesture.

import type { Beat, MusicId, SfxId, Tone } from "../story/types";

type MusicSpec = {
  chord: number[];          // MIDI notes held as a pad
  wave: OscillatorType;
  cutoff: number;           // pad low-pass cutoff, Hz
  gain: number;
  arp?: { notes: number[]; every: number; wave: OscillatorType; gain: number };
  heartbeat?: number;       // ms between low thumps
};

export const MUSIC: Record<MusicId, MusicSpec> = {
  void:     { chord: [33, 45, 57],           wave: "sine",     cutoff: 500,  gain: 0.5 },
  office:   { chord: [48, 55, 60, 64],       wave: "triangle", cutoff: 1400, gain: 0.45, arp: { notes: [72, 76, 79, 76, 74, 79], every: 520, wave: "triangle", gain: 0.12 } },
  corridor: { chord: [45, 52, 57],           wave: "sawtooth", cutoff: 700,  gain: 0.3,  arp: { notes: [57, 60, 64, 69], every: 260, wave: "sine", gain: 0.1 } },
  lab:      { chord: [45, 52, 57, 60],       wave: "triangle", cutoff: 1800, gain: 0.35, arp: { notes: [69, 72, 76, 72, 67, 71, 74, 71], every: 230, wave: "square", gain: 0.05 } },
  legacy:   { chord: [38, 44, 50],           wave: "sawtooth", cutoff: 380,  gain: 0.4,  heartbeat: 1100 },
  universe: { chord: [48, 55, 59, 64],       wave: "sine",     cutoff: 2200, gain: 0.4,  arp: { notes: [72, 76, 79, 83, 79, 76], every: 340, wave: "triangle", gain: 0.12 } },
  reveal:   { chord: [48, 55, 64, 67],       wave: "triangle", cutoff: 2600, gain: 0.5 },
  finale:   { chord: [48, 55, 60, 64, 67],   wave: "sine",     cutoff: 1800, gain: 0.45, arp: { notes: [72, 71, 69, 67], every: 900, wave: "sine", gain: 0.1 } },
};

const midi = (n: number) => 440 * Math.pow(2, (n - 69) / 12);

type MusicHandle = { stop: () => void };

export class StoryAudio {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private musicBus: GainNode | null = null;
  private sfxBus: GainNode | null = null;
  private music: MusicHandle | null = null;
  private musicId: MusicId | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private utterance: SpeechSynthesisUtterance | null = null;
  volume = 0.8;
  muted = false;
  voiceOn = true;

  get enabled() { return this.ctx !== null; }

  /** Must be called from a click/keypress handler. Safe to call repeatedly. */
  async enable() {
    if (typeof window === "undefined") return;
    if (!this.ctx) {
      const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!Ctx) return;
      this.ctx = new Ctx();
      this.master = this.ctx.createGain();
      this.musicBus = this.ctx.createGain();
      this.sfxBus = this.ctx.createGain();
      this.musicBus.gain.value = 0.35;
      this.sfxBus.gain.value = 0.6;
      this.musicBus.connect(this.master);
      this.sfxBus.connect(this.master);
      this.master.connect(this.ctx.destination);
      this.applyVolume();
      this.loadVoices();
    }
    if (this.ctx.state === "suspended") await this.ctx.resume();
    if (this.musicId) { const id = this.musicId; this.musicId = null; this.setMusic(id); }
  }

  private loadVoices() {
    if (!("speechSynthesis" in window)) return;
    const load = () => { this.voices = window.speechSynthesis.getVoices(); };
    load();
    window.speechSynthesis.addEventListener?.("voiceschanged", load);
  }

  private applyVolume() {
    if (this.master && this.ctx) this.master.gain.setTargetAtTime(this.muted ? 0 : this.volume, this.ctx.currentTime, 0.05);
  }
  setVolume(v: number) { this.volume = Math.max(0, Math.min(1, v)); this.applyVolume(); }
  setMuted(m: boolean) { this.muted = m; this.applyVolume(); if (m) this.cancelSpeech(); }

  // ── Music ──────────────────────────────────────────────────────
  setMusic(id: MusicId | null) {
    if (id === this.musicId) return;
    this.musicId = id;
    const ctx = this.ctx, bus = this.musicBus;
    if (this.music) { this.music.stop(); this.music = null; }
    if (!ctx || !bus || !id) return;

    const spec = MUSIC[id];
    const out = ctx.createGain();
    out.gain.value = 0;
    out.gain.setTargetAtTime(spec.gain, ctx.currentTime, 0.8);
    out.connect(bus);

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = spec.cutoff;
    filter.connect(out);

    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.value = 0.12;
    lfoGain.gain.value = spec.cutoff * 0.35;
    lfo.connect(lfoGain).connect(filter.frequency);
    lfo.start();

    const oscs: OscillatorNode[] = [lfo];
    spec.chord.forEach((n, i) => {
      for (const d of [-6, 6]) {
        const o = ctx.createOscillator();
        o.type = spec.wave;
        o.frequency.value = midi(n);
        o.detune.value = d + i;
        const g = ctx.createGain();
        g.gain.value = 0.9 / (spec.chord.length * 2);
        o.connect(g).connect(filter);
        o.start();
        oscs.push(o);
      }
    });

    const timers: number[] = [];
    if (spec.arp) {
      const a = spec.arp;
      let step = 0;
      timers.push(window.setInterval(() => {
        if (ctx.state !== "running") return;
        this.note(midi(a.notes[step++ % a.notes.length]), 0.5, a.wave, a.gain, out);
      }, a.every));
    }
    if (spec.heartbeat) {
      timers.push(window.setInterval(() => {
        if (ctx.state !== "running") return;
        this.note(52, 0.25, "sine", 0.5, out, 40);
        window.setTimeout(() => this.note(52, 0.2, "sine", 0.35, out, 40), 180);
      }, spec.heartbeat));
    }

    this.music = {
      stop: () => {
        timers.forEach((t) => window.clearInterval(t));
        out.gain.setTargetAtTime(0, ctx.currentTime, 0.25);
        window.setTimeout(() => { oscs.forEach((o) => { try { o.stop(); } catch { /* already stopped */ } }); out.disconnect(); }, 1200);
      },
    };
  }

  private note(freq: number, dur: number, type: OscillatorType, gain: number, dest: AudioNode, slideTo?: number) {
    const ctx = this.ctx; if (!ctx) return;
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, ctx.currentTime);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, ctx.currentTime + dur);
    g.gain.setValueAtTime(0.0001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(gain, ctx.currentTime + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
    o.connect(g).connect(dest);
    o.start();
    o.stop(ctx.currentTime + dur + 0.05);
  }

  private noise(dur: number, from: number, to: number, gain: number) {
    const ctx = this.ctx, bus = this.sfxBus; if (!ctx || !bus) return;
    const buf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * dur), ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource(); src.buffer = buf;
    const f = ctx.createBiquadFilter(); f.type = "bandpass"; f.Q.value = 1.2;
    f.frequency.setValueAtTime(from, ctx.currentTime);
    f.frequency.exponentialRampToValueAtTime(to, ctx.currentTime + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(gain, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
    src.connect(f).connect(g).connect(bus);
    src.start();
  }

  // ── Sound effects ──────────────────────────────────────────────
  sfx(id: SfxId) {
    const ctx = this.ctx, bus = this.sfxBus;
    if (!ctx || !bus || this.muted) return;
    const at = (ms: number, fn: () => void) => window.setTimeout(fn, ms);
    switch (id) {
      case "wake":    this.note(220, 0.5, "sine", 0.4, bus, 660); at(250, () => this.note(660, 0.4, "triangle", 0.3, bus, 990)); break;
      case "blip":    this.note(520 + Math.random() * 200, 0.08, "square", 0.08, bus); break;
      case "whoosh":  this.noise(0.8, 300, 3000, 0.5); break;
      case "chime":   [72, 76, 79, 84].forEach((n, i) => at(i * 110, () => this.note(midi(n), 1.2, "sine", 0.35, bus))); break;
      case "thud":    this.note(110, 0.4, "sine", 0.8, bus, 40); break;
      case "laugh":   [0, 120, 240, 360].forEach((t, i) => at(t, () => this.note(420 + i * 30, 0.09, "square", 0.1, bus))); break;
      case "gasp":    this.noise(0.25, 1200, 2400, 0.3); this.note(500, 0.2, "sine", 0.2, bus, 800); break;
      case "click":   this.note(1200, 0.04, "square", 0.1, bus); break;
      case "power":   this.note(120, 0.7, "sawtooth", 0.2, bus, 480); at(500, () => this.note(880, 0.3, "triangle", 0.25, bus)); break;
      case "glitch":  this.noise(0.3, 4000, 400, 0.35); at(150, () => this.noise(0.15, 2000, 300, 0.25)); break;
      case "sparkle": [84, 88, 91, 96].forEach((n, i) => at(i * 70, () => this.note(midi(n), 0.4, "sine", 0.18, bus))); break;
    }
  }

  // ── Voice ──────────────────────────────────────────────────────
  /** "hi" when a Hindi voice exists, "en" for an Indian-English voice, otherwise null (captions only). */
  voiceKind(): "hi" | "en" | null {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return null;
    const vs = this.voices.length ? this.voices : window.speechSynthesis.getVoices();
    if (vs.some((v) => v.lang.toLowerCase().startsWith("hi"))) return "hi";
    if (vs.some((v) => v.lang.toLowerCase().replace("_", "-") === "en-in")) return "en";
    return null;
  }

  /**
   * Speak a beat. Calls `done` once when speech ends, errors, or cannot start.
   * Returns false if speech is unavailable (caller should fall back to its timer).
   */
  speak(beat: Beat, done: () => void): boolean {
    if (!this.enabled || this.muted || !this.voiceOn) return false;
    const kind = this.voiceKind();
    if (!kind) return false;
    const text = kind === "hi" ? beat.hi ?? beat.text : beat.text;
    if (!text) return false;
    const vs = this.voices.length ? this.voices : window.speechSynthesis.getVoices();
    const voice =
      kind === "hi"
        ? vs.find((v) => v.lang.toLowerCase().startsWith("hi"))
        : vs.find((v) => v.lang.toLowerCase().replace("_", "-") === "en-in");
    this.cancelSpeech();
    const u = new SpeechSynthesisUtterance(text);
    if (voice) { u.voice = voice; u.lang = voice.lang; }
    const t: Record<Tone, { rate: number; pitch: number }> = {
      normal: { rate: 1.0, pitch: 1.35 }, soft: { rate: 0.9, pitch: 1.2 },
      excited: { rate: 1.12, pitch: 1.5 }, whisper: { rate: 0.85, pitch: 1.1 },
    };
    const p = t[beat.tone ?? "normal"];
    u.rate = p.rate; u.pitch = p.pitch; u.volume = this.volume;
    let finished = false;
    const end = () => { if (!finished) { finished = true; done(); } };
    u.onend = end; u.onerror = end;
    this.utterance = u;
    window.speechSynthesis.speak(u);
    return true;
  }

  cancelSpeech() {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      if (this.utterance) { this.utterance.onend = null; this.utterance.onerror = null; this.utterance = null; }
      window.speechSynthesis.cancel();
    }
  }

  async suspend() { this.cancelSpeech(); await this.ctx?.suspend(); }
  async resume() { if (this.ctx && !this.muted) await this.ctx.resume(); }

  dispose() {
    this.cancelSpeech();
    this.music?.stop();
    this.music = null;
    void this.ctx?.close();
    this.ctx = null; this.master = null; this.musicBus = null; this.sfxBus = null;
  }
}
