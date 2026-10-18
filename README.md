# Gautam Prajapati — Portfolio

Next.js 15 · React 19 · TypeScript · Tailwind CSS 3 · Framer Motion

```bash
npm install
npm run dev        # http://localhost:3000
npm run typecheck
npm run build
```

Set `NEXT_PUBLIC_SITE_URL` to your real domain (used for sitemap, canonical URLs, Open Graph).

## Where things live
- `lib/projects.ts` — all project copy, links, roles, tags. Edit here; home page and case studies update together.
- `lib/site.ts` — name, contact links, nav. Add `email` and a mailto link appears in Contact.
- `components/visuals/` — one interactive visual per project.
- `components/SystemVisual.tsx` — hero diagram (cursor tilt on desktop, scroll tilt on touch).

## Please verify before publishing
1. **Links** — project URLs and the GitHub handle are copied from the old site and were not checked live. The GitHub handle is `siddharthpraja`; confirm it is yours.
2. **Accountbiz** — copy follows your project notes (Node/Express + SQL Server). The old site said Next.js + Prisma. Remove anything not live yet in `lib/projects.ts`. The dashboard image is the older screenshot from the old site.
3. **CRM/ERP Modernization and React Native apps** — no screenshots or details were provided, so these use a clearly labelled simplified diagram and phone wireframes. Add real screens to `public/screens/` and pass `src` into the phone mockups.
4. **Clip-CSS playground** — a demo made for this portfolio, labelled as such. It is not Clip-CSS's real API.
5. **Contact** — the old email form posted to a Google Sheet; it was not carried over (no fake forms). Add an email in `lib/site.ts`.
6. No awards, metrics or client names are claimed.

## Accessibility and performance
Reduced-motion supported, skip link, keyboard-operable interactive visuals, `aria-live` captions, visible focus, `next/image`, `next/font`, static case-study pages, sitemap, robots and JSON-LD.
