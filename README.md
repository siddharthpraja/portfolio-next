# Gautam Prajapati — Portfolio + "The Little Bot With A Big Story"

Next.js 15 · React 19 · TypeScript · Tailwind 3 · Three.js · React Three Fiber 9 · Framer Motion · Web Audio

An interactive 3D story at `/story` (a small robot, G.A.U.T.A.M. Bot, tells Gautam's story in Hinglish) on top of the existing portfolio, plus conventional crawlable pages: `/`, `/about`, `/projects`, `/work/[slug]`, `/skills`, `/experience`, `/contact`.

## Setup
```bash
npm install
npm run dev          # http://localhost:3000  (story at /story)
npm test             # story/script/rig checks + typecheck
npm run build && npm start
```
Set `NEXT_PUBLIC_SITE_URL` to your domain (canonical URLs, sitemap, Open Graph).

## Where to edit
| What | File |
|---|---|
| Dialogue, gestures, shots, timing, scene flags | `lib/story/script.ts` (data only) |
| Camera framing presets | `lib/story/shots.ts` |
| Emotions and gestures (joint maths) | `lib/story/pose.ts` |
| Playback state machine (pause/skip/replay, no overlapping lines) | `lib/story/engine.ts` |
| Music, sound effects, voice | `lib/audio/engine.ts` |
| Robot model and rig | `components/story/Robot.tsx` |
| The 7 environments | `components/story/Environments.tsx` |
| Controls, captions, panels | `components/story/StoryExperience.tsx`, `Panels.tsx` |
| Text/2D fallback | `components/story/Fallback2D.tsx` |
| Projects, skills, experience, contact | `lib/projects.ts`, `lib/skills.ts`, `lib/experience.ts`, `lib/site.ts` |
| Accountbiz feature status | `lib/accountbiz.ts` |

## How the story behaves
- Opening plays on load with captions only. Audio (music, effects, voice) starts only after a click: "Chalo, Story Shuru Karein" or the sound button.
- Every spoken line has Hinglish (caption), Devanagari (used for Hindi text-to-speech) and English (toggle "EN").
- Voice uses the browser's speech synthesis: Hindi voice if installed, else an Indian-English voice, else captions with soft talk blips. Voices differ across devices; for identical voice, generate licensed recordings and add an `audio` field to beats.
- Controls: pause/resume, replay chapter, skip chapter, chapter jump, mute, volume, voice toggle, English captions, text version. Keys: Space, →, R, M.
- Chapters 3 and 5 wait on "Continue" so visitors can click skills and project portals.
- Contact, Projects and Skills are one click away at all times.
- Fallbacks: no WebGL, reduced-motion preference, context loss, or sustained low frame rate switch to the text version (same script data). Low-power devices get lower resolution and no antialiasing. Rendering stops when the tab is hidden.

## Assets
None required. The robot, scenes, music and sound effects are generated in code. The only file used is `public/images/accountbiz.webp` (the Accountbiz screenshot; replace with a current one). No Accountbiz logo was supplied, so the reveal uses a text wordmark: drop a logo into `public/` and swap it in `RevealEnv`. To use a modelled/rigged GLB for the robot instead, replace `Robot.tsx` with a `useGLTF` model and drive its bones from `targetPose()`.

## Please verify before publishing
1. **Not run in a browser by me.** My workspace blocked the npm registry, so I could not install Next/Three or run the site. Verified: story script and playback logic (`npm run check:story`, 24 checks), rig maths, and that all imports resolve. Not verified: 3D rendering, audio, layout, mobile performance. Expect small fixes on first run; check the browser console.
2. **Experience / CRM-ERP** content follows the brief; no employer, dates or metrics are stated. Add them in `lib/experience.ts`.
3. **Accountbiz features**: everything listed is "Built", copied from your project notes. Nothing is claimed as in development or planned. Move/add items in `lib/accountbiz.ts` when confirmed. Same for Clip-CSS backend status in `lib/projects.ts` (currently "Live").
4. **Prisma and SQLite** appear in Skills as listed skills with no project mapped.
5. **Links and GitHub handle** (`siddharthpraja`) were carried over unchanged from the old site; confirm. Add `email` in `lib/site.ts`.
6. "A question came up" in chapter 2 is storytelling, not a dated event.
7. Robot jokes and dialogue are my drafts in Hinglish; read them aloud and adjust.

## Deploy (Vercel)
1. Push to GitHub, import the repo in Vercel (framework: Next.js, defaults).
2. Env var: `NEXT_PUBLIC_SITE_URL=https://your-domain`.
3. Deploy, then open `/story`, `/sitemap.xml`, `/robots.txt`.
Other hosts: `npm run build && npm start` on Node 20+.
Checklist after deploy: story plays through, sound button works on a phone, reduced-motion shows text version, contact links open, no console errors.
