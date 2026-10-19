"use client";
import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { projects, getProject, alsoBuilt } from "@/lib/projects";
import { skillGroups } from "@/lib/skills";
import { contactLinks } from "@/lib/site";
import { chapters } from "@/lib/story/script";
import { accountbizFeatures, statusLabel, type FeatureStatus } from "@/lib/accountbiz";

export type PanelState =
  | { type: "contact" }
  | { type: "projects" }
  | { type: "project"; slug: string }
  | { type: "skills"; group?: string }
  | { type: "chapters" };

const focusable = 'a[href],button:not([disabled]),input,[tabindex]:not([tabindex="-1"])';

/** Modal drawer: Esc closes, Tab stays inside, focus returns to the opener. */
export function Panel({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    ref.current?.focus();
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") { e.stopPropagation(); onClose(); }
      if (e.key === "Tab" && ref.current) {
        const els = Array.from(ref.current.querySelectorAll<HTMLElement>(focusable));
        if (!els.length) return;
        const first = els[0], last = els[els.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", key);
    return () => { document.removeEventListener("keydown", key); opener?.focus?.(); };
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/60 sm:items-center" onClick={onClose}>
      <div
        ref={ref} role="dialog" aria-modal="true" aria-label={title} tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[88vh] w-full overflow-y-auto border border-line bg-ink p-6 text-fg shadow-2xl outline-none sm:max-w-2xl"
      >
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-3xl font-extrabold tracking-tight">{title}</h2>
          <button type="button" onClick={onClose} className="border border-line px-3 py-1 font-mono text-xs uppercase tracking-wider hover:border-lime hover:text-lime">Close</button>
        </div>
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}

const ext = { target: "_blank", rel: "noopener noreferrer" } as const;

export function ContactBody() {
  return (
    <>
      <p className="text-muted">Open to freelance projects. Reach Gautam directly, no need to finish the story.</p>
      <ul className="mt-5 border-t border-line">
        {contactLinks().map((c) => (
          <li key={c.label} className="border-b border-line">
            <a href={c.href} {...(c.href.startsWith("http") ? ext : {})} className="flex items-center justify-between py-4 text-2xl font-semibold hover:text-lime">
              {c.label}<span aria-hidden>↗</span>
              {c.href.startsWith("http") && <span className="sr-only"> (opens in a new tab)</span>}
            </a>
          </li>
        ))}
      </ul>
      <p className="mt-5 text-sm text-muted">
        Prefer to read? <Link href="/about" className="underline decoration-lime underline-offset-4">About</Link>,{" "}
        <Link href="/experience" className="underline decoration-lime underline-offset-4">Experience</Link>,{" "}
        <Link href="/contact" className="underline decoration-lime underline-offset-4">Contact page</Link>.
      </p>
    </>
  );
}

export function ProjectDetail({ slug, onBack }: { slug: string; onBack?: () => void }) {
  const p = getProject(slug);
  if (!p) return null;
  return (
    <div>
      {onBack && <button type="button" onClick={onBack} className="mb-4 font-mono text-xs uppercase tracking-wider text-muted hover:text-lime">← All projects</button>}
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted"><span className="text-accent">{p.n}</span> · {p.kicker}</p>
      <p className="mt-3 text-lg leading-relaxed">{p.summary}</p>
      <dl className="mt-5 grid gap-4 border-y border-line py-4 sm:grid-cols-2">
        <div><dt className="font-mono text-xs uppercase tracking-wider text-muted">My role</dt><dd className="mt-1">{p.role}</dd></div>
        <div><dt className="font-mono text-xs uppercase tracking-wider text-muted">Status</dt><dd className="mt-1">{p.status}</dd></div>
      </dl>
      <ul className="mt-4 flex flex-wrap gap-2">{p.tags.map((t) => <li key={t} className="border border-line px-2 py-0.5 font-mono text-xs">{t}</li>)}</ul>
      {p.review && <p className="mt-4 text-xs text-muted">Description kept conservative; details are confirmed on the case-study page.</p>}
      <div className="mt-6 flex flex-wrap gap-3">
        <Link href={`/work/${p.slug}`} className="bg-lime px-4 py-2 text-sm font-semibold uppercase tracking-wider text-ink">Read case study</Link>
        {p.links.map((l) => (
          <a key={l.href + l.label} href={l.href} {...ext} className="border border-line px-4 py-2 text-sm uppercase tracking-wider hover:border-lime hover:text-lime">
            {l.label} ↗<span className="sr-only"> (opens in a new tab)</span>
          </a>
        ))}
      </div>
    </div>
  );
}

export function ProjectsBody({ initial, onPick }: { initial?: string; onPick?: (slug: string) => void }) {
  const [slug, setSlug] = useState<string | undefined>(initial);
  useEffect(() => setSlug(initial), [initial]);
  if (slug) return <ProjectDetail slug={slug} onBack={() => setSlug(undefined)} />;
  return (
    <>
      <ul className="border-t border-line">
        {projects.map((p) => (
          <li key={p.slug} className="border-b border-line">
            <button type="button" onClick={() => { setSlug(p.slug); onPick?.(p.slug); }} className="flex w-full items-baseline justify-between gap-4 py-4 text-left hover:text-lime">
              <span className="text-2xl font-semibold">{p.title}</span>
              <span className="font-mono text-xs uppercase tracking-wider text-muted">{p.status}</span>
            </button>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-sm text-muted">
        Also built:{" "}
        <a href={alsoBuilt.href} {...ext} className="underline decoration-lime underline-offset-4">{alsoBuilt.title}<span className="sr-only"> (opens in a new tab)</span></a>.
      </p>
    </>
  );
}

export function SkillsBody({ initialGroup }: { initialGroup?: string }) {
  const [gid, setGid] = useState(initialGroup ?? skillGroups[0].id);
  const [skill, setSkill] = useState<string | null>(null);
  useEffect(() => { if (initialGroup) { setGid(initialGroup); setSkill(null); } }, [initialGroup]);
  const g = skillGroups.find((x) => x.id === gid) ?? skillGroups[0];
  const s = g.skills.find((x) => x.name === skill);
  return (
    <>
      <div role="tablist" aria-label="Skill groups" className="flex flex-wrap gap-2">
        {skillGroups.map((x) => (
          <button key={x.id} role="tab" aria-selected={x.id === g.id} type="button" onClick={() => { setGid(x.id); setSkill(null); }}
            className={`border px-3 py-1 font-mono text-xs uppercase tracking-wider ${x.id === g.id ? "border-lime text-lime" : "border-line text-muted hover:text-fg"}`}>
            {x.title}
          </button>
        ))}
      </div>
      <p className="mt-4 font-serif text-xl italic text-muted">{g.line}</p>
      <ul className="mt-4 flex flex-wrap gap-2">
        {g.skills.map((x) => (
          <li key={x.name}>
            <button type="button" aria-pressed={skill === x.name} onClick={() => setSkill(x.name)}
              className={`border px-3 py-1.5 font-mono text-sm ${skill === x.name ? "border-lime bg-lime text-ink" : "border-line hover:border-lime"}`}>
              {x.name}
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-5 min-h-[5rem] border-l-2 border-lime pl-4" aria-live="polite">
        {s ? (
          <>
            <p>{s.note}</p>
            {s.projects.length > 0 ? (
              <p className="mt-3 flex flex-wrap gap-2 text-sm">
                {s.projects.map((slug) => <Link key={slug} href={`/work/${slug}`} className="border border-line px-2 py-0.5 hover:border-lime hover:text-lime">{getProject(slug)?.title}</Link>)}
              </p>
            ) : <p className="mt-2 text-sm text-muted">No project page names this skill yet.</p>}
          </>
        ) : <p className="text-muted">Pick a skill to see where it was used.</p>}
      </div>
    </>
  );
}

export function ChaptersBody({ current, onGo }: { current: number; onGo: (n: number) => void }) {
  return (
    <ol className="border-t border-line">
      {chapters.map((c) => (
        <li key={c.id} className="border-b border-line">
          <button type="button" onClick={() => onGo(c.n)} aria-current={c.n === current ? "step" : undefined}
            className={`flex w-full items-baseline gap-4 py-3 text-left hover:text-lime ${c.n === current ? "text-lime" : ""}`}>
            <span className="font-mono text-xs">{c.n === 0 ? "—" : String(c.n).padStart(2, "0")}</span>
            <span className="text-xl font-semibold">{c.title}</span>
            <span className="ml-auto hidden text-sm text-muted sm:inline">{c.subtitle}</span>
          </button>
        </li>
      ))}
    </ol>
  );
}

/** Floating card in the Accountbiz chapter. Statuses come from lib/accountbiz.ts. */
export function FeaturesCard() {
  const groups = (Object.keys(accountbizFeatures) as FeatureStatus[]).filter((k) => accountbizFeatures[k].length > 0);
  return (
    <aside aria-label="Accountbiz features" className="pointer-events-auto absolute right-3 top-16 z-20 max-h-[52vh] w-[min(92vw,22rem)] overflow-y-auto border border-line bg-ink/90 p-4 text-sm backdrop-blur sm:right-6">
      {groups.map((k) => (
        <section key={k}>
          <h3 className="font-mono text-xs uppercase tracking-[0.16em] text-accent">{statusLabel[k]}</h3>
          <ul className="mt-2 list-disc space-y-1 pl-4 text-muted">{accountbizFeatures[k].map((f) => <li key={f}>{f}</li>)}</ul>
        </section>
      ))}
      <p className="mt-3 border-t border-line pt-2 text-xs text-muted">Only items listed as Built are confirmed. Nothing is claimed as in development or planned.</p>
    </aside>
  );
}
