// Types for the story script. The script itself lives in script.ts as plain data,
// so dialogue, timing, gestures and camera shots can be revised without touching components.

export type EnvId = "void" | "office" | "corridor" | "lab" | "legacy" | "universe" | "reveal";
export type MusicId = "void" | "office" | "corridor" | "lab" | "legacy" | "universe" | "reveal" | "finale";

export type Emotion =
  | "sleep" | "neutral" | "happy" | "surprised" | "nervous"
  | "sly" | "soft" | "proud" | "confused" | "laugh";

export type Gesture =
  | "idle" | "lookAround" | "tilt" | "point" | "laugh" | "tremble" | "surprise"
  | "think" | "celebrate" | "faceCamera" | "wave" | "checkWatch" | "lean" | "shrug";

export type Shot = "wide" | "mid" | "close" | "eyes" | "low" | "high" | "left" | "right" | "follow";
export type Tone = "normal" | "soft" | "excited" | "whisper";
export type SfxId = "wake" | "blip" | "whoosh" | "chime" | "thud" | "laugh" | "gasp" | "click" | "power" | "glitch" | "sparkle";

/** Scene flags a beat can switch on. Scenes read these to change what is visible. */
export type Flag =
  | "title" | "cta" | "papersLoop" | "codeRain" | "skills" | "legacyFixed"
  | "portals" | "dark" | "logo" | "reveal" | "features" | "contact" | "end";

export type Beat = {
  id: string;
  /** Hinglish line (Roman script). Shown as the main subtitle. */
  text?: string;
  /** Devanagari version, used for text-to-speech with Hindi voices. */
  hi?: string;
  /** English gloss, shown when "English" captions are on. */
  en?: string;
  emotion: Emotion;
  gesture: Gesture;
  shot: Shot;
  /** Robot walks here (x, z in scene coordinates). */
  at?: [number, number];
  run?: boolean;
  /** Where the robot points or looks (scene coordinates). */
  target?: [number, number, number];
  tone?: Tone;
  sfx?: SfxId;
  /** Silent beat length in ms (beats without text). */
  pause?: number;
  /** Stop here until the visitor presses Continue / the chapter's own action. */
  hold?: boolean;
  /** Flags switched on when this beat starts. */
  set?: Flag[];
  /** Flags switched off when this beat starts. */
  clear?: Flag[];
  /** Show the chapter title card on this beat. */
  title?: boolean;
};

export type Chapter = {
  id: string;
  /** 0 is the opening; 1-7 are the story chapters. */
  n: number;
  title: string;
  subtitle: string;
  env: EnvId;
  music: MusicId;
  /** Robot start position for this chapter. */
  start: [number, number];
  /** The real fact from Gautam's story this chapter is built on. */
  basis: string;
  beats: Beat[];
};
