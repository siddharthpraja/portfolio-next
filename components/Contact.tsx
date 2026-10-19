import { contactLinks } from "@/lib/site";
import { Reveal, SectionLabel } from "./Reveal";

export function Contact() {
  const items = contactLinks().map((c) => ({ l: c.label, h: c.href }));
  return (
    <section id="contact" aria-labelledby="contact-h" className="grid-lines border-t border-line px-5 py-28 md:px-10 md:py-40">
      <div className="mx-auto max-w-[1500px]">
        <Reveal>
          <SectionLabel n="06">Contact</SectionLabel>
          <h2 id="contact-h" className="mt-4 text-[clamp(2.6rem,9vw,9rem)] font-extrabold leading-[0.9] tracking-[-0.04em]">
            Have a system that <span className="font-serif font-normal italic text-lime">needs building?</span>
          </h2>
          <p className="mt-6 text-lg text-muted">Open to freelance projects.</p>
        </Reveal>
        <ul className="mt-14 border-t border-line">
          {items.map((x) => (
            <li key={x.l} className="border-b border-line">
              <a
                href={x.h}
                target={x.h.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                data-cursor
                className="group flex items-center justify-between py-5 text-3xl font-semibold transition-colors hover:text-lime md:text-5xl"
              >
                {x.l}
                <span aria-hidden className="transition-transform group-hover:translate-x-2 group-hover:-translate-y-2">↗</span>
                {x.h.startsWith("http") && <span className="sr-only"> (opens in a new tab)</span>}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
