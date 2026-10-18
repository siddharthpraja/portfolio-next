import { Reveal, SectionLabel } from "./Reveal";

const steps = [
  { n: "i", t: "Accounting", d: "Learning how businesses actually keep their books: ledgers, vouchers, GST." },
  { n: "ii", t: "Software", d: "Turning that day-to-day knowledge into code that removes repeated work." },
  { n: "iii", t: "Product ownership", d: "Owning Accountbiz: deciding what to build, how it should behave and who it serves." },
];

export function Journey() {
  return (
    <section id="journey" aria-labelledby="journey-h" className="border-t border-line px-5 py-28 md:px-10 md:py-40">
      <div className="mx-auto max-w-[1500px]">
        <Reveal>
          <SectionLabel n="04">My Journey</SectionLabel>
          <h2 id="journey-h" className="mt-4 max-w-5xl text-5xl font-extrabold leading-[0.95] tracking-[-0.03em] md:text-8xl">
            From the ledger <span className="font-serif font-normal italic text-accent">to the codebase.</span>
          </h2>
        </Reveal>
        <ol className="mt-16 grid gap-px border border-line bg-line md:grid-cols-3">
          {steps.map((s, k) => (
            <li key={s.t} className="bg-ink p-8 md:p-10">
              <Reveal delay={k * 0.1}>
                <p className="font-serif text-5xl italic text-accent">{s.n}</p>
                <h3 className="mt-6 text-2xl font-semibold">{s.t}</h3>
                <p className="mt-3 text-muted">{s.d}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
