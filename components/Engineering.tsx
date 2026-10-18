"use client";
import { useState } from "react";
import { Reveal, SectionLabel } from "./Reveal";

const areas = [
  { k: "Full-stack", line: "From the database to the interface, in one codebase I can reason about.", stack: ["Next.js", "React", "TypeScript", "Node.js", "Express", "Tailwind CSS", "Prisma", "Stripe", "MDX"] },
  { k: "Mobile", line: "Apps that share their API with the web product.", stack: ["React Native", "Expo"] },
  { k: "Databases", line: "Schemas and queries built around transactions and data ownership.", stack: ["SQL Server", "PostgreSQL", "MongoDB", "PocketBase"] },
  { k: "AI", line: "AI used where it removes typing, such as scanning a document to pre-fill a voucher or speaking an invoice.", stack: ["Document scan", "Voice input"] },
  { k: "Automation", line: "Jobs that move data and nudge people so nobody has to remember.", stack: ["Sync agents", "Reminders", "Scheduled jobs", "Electron"] },
];

export function Engineering() {
  const [i, setI] = useState(0);
  const a = areas[i];
  return (
    <section id="engineering" aria-labelledby="eng-h" className="border-t border-line px-5 py-28 md:px-10 md:py-40">
      <div className="mx-auto grid max-w-[1500px] gap-12 lg:grid-cols-12">
        <Reveal className="lg:col-span-5">
          <SectionLabel n="03">Engineering</SectionLabel>
          <h2 id="eng-h" className="mt-4 text-5xl font-extrabold leading-[0.95] tracking-[-0.03em] md:text-7xl">
            What I build with.
          </h2>
          <div role="tablist" aria-label="Engineering areas" className="mt-10 border-t border-line">
            {areas.map((x, k) => (
              <button
                key={x.k}
                role="tab"
                id={`eng-tab-${k}`}
                aria-selected={i === k}
                aria-controls="eng-panel"
                onClick={() => setI(k)}
                data-cursor
                className={`flex w-full items-baseline justify-between border-b border-line py-4 text-left text-3xl font-semibold transition-colors md:text-4xl ${i === k ? "text-accent" : "text-fg/60 hover:text-fg"}`}
              >
                {x.k}
                <span className="font-mono text-xs">0{k + 1}</span>
              </button>
            ))}
          </div>
        </Reveal>

        <div id="eng-panel" role="tabpanel" aria-labelledby={`eng-tab-${i}`} className="lg:col-span-7 lg:pt-24">
          <p className="max-w-xl font-serif text-3xl italic leading-snug md:text-5xl">{a.line}</p>
          <ul className="mt-10 flex flex-wrap gap-3">
            {a.stack.map((s) => (
              <li key={s} className="border border-line px-4 py-2 font-mono text-sm">{s}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
