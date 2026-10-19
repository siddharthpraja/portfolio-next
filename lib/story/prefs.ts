// Small per-visitor preferences, stored in localStorage when available.
export type Prefs = { volume: number; muted: boolean; voice: boolean; english: boolean };
export const defaultPrefs: Prefs = { volume: 0.8, muted: false, voice: true, english: false };
const KEY = "gautam-story-prefs";

export function loadPrefs(): Prefs {
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? { ...defaultPrefs, ...JSON.parse(raw) } : defaultPrefs;
  } catch { return defaultPrefs; }
}
export function savePrefs(p: Prefs) {
  try { window.localStorage.setItem(KEY, JSON.stringify(p)); } catch { /* private mode: ignore */ }
}
