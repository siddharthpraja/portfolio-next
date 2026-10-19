import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { projects, alsoBuilt } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Projects",
  description: "Accountbiz, CRM/ERP modernization, React Native apps, Clip-CSS and Qresume: projects by Gautam Prajapati, each with a case study.",
  alternates: { canonical: "/projects" },
};

export default function Projects() {
  return (
    <PageShell kicker="Projects" title="Real products, built end to end." intro="Each project has a case study with its role, stack and current status.">
      <ul className="border-t border-line">
        {projects.map((p) => (
          <li key={p.slug} className="border-b border-line">
            <Link href={`/work/${p.slug}`} className="group grid gap-3 py-8 md:grid-cols-12 md:items-baseline">
              <span className="font-mono text-xs text-accent md:col-span-1">{p.n}</span>
              <span className="text-3xl font-semibold transition-colors group-hover:text-lime md:col-span-4 md:text-4xl">{p.title}</span>
              <span className="text-muted md:col-span-5">{p.summary}</span>
              <span className="font-mono text-xs uppercase tracking-wider text-muted md:col-span-2 md:text-right">{p.status}</span>
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-10 text-muted">
        Also built:{" "}
        <a href={alsoBuilt.href} target="_blank" rel="noopener noreferrer" className="font-semibold text-fg underline decoration-lime underline-offset-4">
          {alsoBuilt.title}<span className="sr-only"> (opens in a new tab)</span>
        </a>{" "}
        — {alsoBuilt.note}
      </p>
    </PageShell>
  );
}
