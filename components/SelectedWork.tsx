import { projects, alsoBuilt } from "@/lib/projects";
import { ProjectPanel } from "./ProjectPanel";
import { Reveal, SectionLabel } from "./Reveal";

export function SelectedWork() {
  return (
    <section id="work" aria-labelledby="work-h">
      <div className="mx-auto max-w-[1500px] px-5 pb-16 pt-28 md:px-10 md:pt-40">
        <Reveal>
          <SectionLabel n="02">Selected Work</SectionLabel>
          <h2 id="work-h" className="mt-4 max-w-4xl text-5xl font-extrabold leading-[0.95] tracking-[-0.03em] md:text-8xl">
            Real products, built end to end.
          </h2>
        </Reveal>
      </div>
      {projects.map((p, i) => (
        <ProjectPanel key={p.slug} p={p} i={i} />
      ))}
      <div className="border-t border-line px-5 py-10 md:px-10">
        <div className="mx-auto flex max-w-[1500px] flex-wrap items-baseline justify-between gap-4">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">Also built</p>
          <p className="max-w-xl text-muted">
            <a href={alsoBuilt.href} target="_blank" rel="noopener noreferrer" className="font-semibold text-fg underline decoration-lime underline-offset-4">
              {alsoBuilt.title}<span className="sr-only"> (opens in a new tab)</span>
            </a>{" "}
            — {alsoBuilt.note}
          </p>
        </div>
      </div>
    </section>
  );
}
