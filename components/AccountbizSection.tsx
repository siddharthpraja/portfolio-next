import Link from "next/link";
import type { CSSProperties } from "react";
import { Reveal, SectionLabel } from "./Reveal";

const principles = [
  { t: "One place for the rules", d: "Voucher posting lives in a single engine instead of being rewritten for every screen." },
  { t: "One copy of the data", d: "A company’s address, phone or email is stored once and shown wherever it is needed." },
  { t: "No re-typing", d: "Details entered at sign-up pre-fill the company and branch steps of setup." },
];

export function AccountbizSection() {
  return (
    <section id="accountbiz" aria-labelledby="ab-h" className="border-t border-line bg-lime px-5 py-28 text-ink md:px-10 md:py-40" style={{ "--muted": "rgba(11,11,12,.75)", "--line": "rgba(11,11,12,.25)" } as CSSProperties}>
      <div className="mx-auto grid max-w-[1500px] gap-12 lg:grid-cols-12">
        <Reveal className="lg:col-span-7">
          <p className="font-mono text-xs uppercase tracking-[0.2em]">(05) Accountbiz</p>
          <h2 id="ab-h" className="mt-4 text-5xl font-extrabold leading-[0.92] tracking-[-0.04em] md:text-8xl">
            A product I own, not just a project I shipped.
          </h2>
          <Link href="/work/accountbiz" data-cursor className="mt-10 inline-block bg-ink px-6 py-4 text-sm font-semibold uppercase tracking-wider text-lime">
            Read the Accountbiz case study →
          </Link>
        </Reveal>
        <ul className="lg:col-span-5">
          {principles.map((p, k) => (
            <li key={p.t} className="border-t border-ink/25 py-6">
              <Reveal delay={k * 0.08}>
                <h3 className="text-2xl font-semibold">{p.t}</h3>
                <p className="mt-2 text-ink/80">{p.d}</p>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
