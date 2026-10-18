import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject, projects } from "@/lib/projects";
import { visuals } from "@/components/visuals";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  return { title: `${p.title} case study`, description: p.summary, alternates: { canonical: `/work/${p.slug}` } };
}

export default async function CaseStudy({ params }: Props) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();

  const idx = projects.findIndex((x) => x.slug === slug);
  const next = projects[(idx + 1) % projects.length];
  const Visual = visuals[p.slug];

  return (
    <article data-theme={p.theme === "paper" ? "paper" : undefined} className="min-h-screen px-5 pb-24 pt-28 md:px-10">
      <div className="mx-auto max-w-[1200px]">
        <Link href="/#work" className="font-mono text-xs uppercase tracking-[0.2em] text-muted hover:text-accent">← All work</Link>
        <p className="mt-10 font-mono text-xs uppercase tracking-[0.2em] text-muted">
          <span className="text-accent">{p.n}</span> · {p.kicker}
        </p>
        <h1 className="mt-4 text-5xl font-extrabold leading-[0.95] tracking-[-0.03em] md:text-8xl">{p.title}</h1>
        <p className="mt-6 max-w-2xl text-xl leading-relaxed text-muted">{p.summary}</p>

        <dl className="mt-12 grid gap-6 border-y border-line py-6 sm:grid-cols-3">
          <div><dt className="font-mono text-xs uppercase tracking-wider text-muted">Role</dt><dd className="mt-1">{p.role}</dd></div>
          <div><dt className="font-mono text-xs uppercase tracking-wider text-muted">Status</dt><dd className="mt-1">{p.status}</dd></div>
          <div>
            <dt className="font-mono text-xs uppercase tracking-wider text-muted">Stack</dt>
            <dd className="mt-1 flex flex-wrap gap-2">
              {p.tags.map((t) => <span key={t} className="border border-line px-2 py-0.5 font-mono text-xs">{t}</span>)}
            </dd>
          </div>
        </dl>

        <div className="mt-12"><Visual /></div>

        <div className="mt-16 grid gap-12 md:grid-cols-2">
          {p.story.map((s) => (
            <section key={s.heading}>
              <h2 className="text-2xl font-semibold">{s.heading}</h2>
              <p className="mt-3 leading-relaxed text-muted">{s.body}</p>
            </section>
          ))}
        </div>

        {p.links.length > 0 && (
          <div className="mt-14 flex flex-wrap gap-4">
            {p.links.map((l) => (
              <a key={l.href + l.label} href={l.href} target="_blank" rel="noopener noreferrer" className="bg-lime px-5 py-3 text-sm font-semibold uppercase tracking-wider text-ink">
                {l.label} ↗<span className="sr-only"> (opens in a new tab)</span>
              </a>
            ))}
          </div>
        )}

        <Link href={`/work/${next.slug}`} className="mt-20 block border-t border-line pt-8">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted">Next project</span>
          <span className="mt-2 block text-4xl font-extrabold tracking-tight hover:text-accent md:text-6xl">{next.title} →</span>
        </Link>
      </div>
    </article>
  );
}
