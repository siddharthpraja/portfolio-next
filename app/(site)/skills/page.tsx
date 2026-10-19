import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { skillGroups } from "@/lib/skills";
import { getProject } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Skills",
  description: "Full-stack, mobile, database, AI and automation, and business skills, each linked to the projects that use them.",
  alternates: { canonical: "/skills" },
};

export default function Skills() {
  return (
    <PageShell kicker="Skills" title="What I build with." intro="No percentage bars. Each skill points to the projects that actually use it.">
      <div className="space-y-16">
        {skillGroups.map((g) => (
          <section key={g.id} aria-labelledby={`g-${g.id}`}>
            <h2 id={`g-${g.id}`} className="text-3xl font-semibold md:text-4xl">{g.title}</h2>
            <p className="mt-2 max-w-xl font-serif text-xl italic text-muted">{g.line}</p>
            <ul className="mt-6 grid gap-px border border-line bg-line sm:grid-cols-2">
              {g.skills.map((s) => (
                <li key={s.name} className="bg-ink p-5">
                  <p className="font-mono text-sm text-accent">{s.name}</p>
                  <p className="mt-1 text-sm text-muted">{s.note}</p>
                  {s.projects.length > 0 && (
                    <p className="mt-3 flex flex-wrap gap-2 text-xs">
                      {s.projects.map((slug) => {
                        const p = getProject(slug);
                        return p ? (
                          <Link key={slug} href={`/work/${slug}`} className="border border-line px-2 py-0.5 hover:border-lime hover:text-lime">
                            {p.title}
                          </Link>
                        ) : null;
                      })}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </PageShell>
  );
}
