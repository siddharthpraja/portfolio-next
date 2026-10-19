import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { roles } from "@/lib/experience";

export const metadata: Metadata = {
  title: "Experience",
  description: "Experience of Gautam Prajapati: enterprise CRM/ERP modernization from VBScript/MySQL to MERN, and ownership of Accountbiz.",
  alternates: { canonical: "/experience" },
};

export default function Experience() {
  return (
    <PageShell kicker="Experience" title="Where the work happened." intro="Confidential employer details, customer data and source code are not published here.">
      <ol className="border-t border-line">
        {roles.map((r) => (
          <li key={r.title} className="grid gap-6 border-b border-line py-10 md:grid-cols-12">
            <div className="md:col-span-4">
              <h2 className="text-2xl font-semibold">{r.title}</h2>
              {(r.org || r.period) && <p className="mt-1 font-mono text-xs uppercase tracking-wider text-muted">{[r.org, r.period].filter(Boolean).join(" · ")}</p>}
            </div>
            <div className="md:col-span-8">
              <p className="text-lg text-muted">{r.summary}</p>
              <ul className="mt-4 list-disc space-y-1 pl-5 text-muted">{r.points.map((x) => <li key={x}>{x}</li>)}</ul>
              <ul className="mt-5 flex flex-wrap gap-2">{r.stack.map((t) => <li key={t} className="border border-line px-2 py-0.5 font-mono text-xs">{t}</li>)}</ul>
            </div>
          </li>
        ))}
      </ol>
    </PageShell>
  );
}
