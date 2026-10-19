"use client";
import Link from "next/link";
import { chapters } from "@/lib/story/script";
import { projects } from "@/lib/projects";
import { ContactBody } from "./Panels";
import { site } from "@/lib/site";

const reasons: Record<string, string> = {
  "no-webgl": "Your browser or device can't run 3D graphics, so here is the story as text.",
  "reduced-motion": "Your device asks for reduced motion, so the animated film is off by default. Here is the story as text.",
  slow: "The 3D version was running slowly on this device, so here is the text version.",
  chosen: "Text version of the story.",
};

/** The story as an accessible, animation-free page. Uses the same script data as the 3D film. */
export function Fallback2D({ reason, canPlay3D, onPlay3D }: { reason: string | null; canPlay3D: boolean; onPlay3D: () => void }) {
  return (
    <div id="main" className="fixed inset-0 overflow-y-auto bg-ink text-fg">
      <header className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-line bg-ink/90 px-5 py-3 backdrop-blur">
        <Link href="/" className="font-mono text-xs uppercase tracking-wider hover:text-lime">← Portfolio</Link>
        {canPlay3D && (
          <button type="button" onClick={onPlay3D} className="bg-lime px-4 py-2 text-xs font-semibold uppercase tracking-wider text-ink">
            Play the 3D story
          </button>
        )}
      </header>
      <article className="mx-auto max-w-3xl px-5 pb-24 pt-12">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">The Little Bot With A Big Story</p>
        <h1 className="mt-3 text-5xl font-extrabold leading-none tracking-tight md:text-7xl">{site.name}</h1>
        <p className="mt-3 font-serif text-2xl italic text-muted">The Human Behind the Code</p>
        {reason && <p role="status" className="mt-6 border-l-2 border-lime pl-4 text-muted">{reasons[reason] ?? reasons.chosen}</p>}

        {chapters.map((c) => (
          <section key={c.id} aria-labelledby={`ch-${c.id}`} className="mt-14 border-t border-line pt-8">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">{c.n === 0 ? "Opening" : `Chapter ${String(c.n).padStart(2, "0")}`}</p>
            <h2 id={`ch-${c.id}`} className="mt-2 text-3xl font-bold">{c.title}</h2>
            <p className="font-serif text-lg italic text-muted">{c.subtitle}</p>
            <ul className="mt-5 space-y-4">
              {c.beats.filter((b) => b.text).map((b) => (
                <li key={b.id}>
                  <p className="text-lg"><span className="mr-2 font-mono text-xs uppercase text-accent">Bot</span>{b.text}</p>
                  <p className="pl-10 text-sm text-muted">{b.en}</p>
                </li>
              ))}
            </ul>
            {c.id === "universe" && (
              <ul className="mt-6 grid gap-2 sm:grid-cols-2">
                {projects.map((p) => (
                  <li key={p.slug}><Link href={`/work/${p.slug}`} className="block border border-line p-4 hover:border-lime"><span className="font-semibold">{p.title}</span><span className="block text-sm text-muted">{p.summary}</span></Link></li>
                ))}
              </ul>
            )}
          </section>
        ))}

        <section aria-labelledby="contact-fb" className="mt-14 border-t border-line pt-8">
          <h2 id="contact-fb" className="text-3xl font-bold">Contact</h2>
          <div className="mt-4"><ContactBody /></div>
        </section>
      </article>
    </div>
  );
}
