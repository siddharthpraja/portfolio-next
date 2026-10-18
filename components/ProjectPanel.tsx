"use client";
import Link from "next/link";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import type { Project } from "@/lib/projects";
import { visuals } from "./visuals";

export function ProjectPanel({ p, i }: { p: Project; i: number }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const Visual = visuals[p.slug];
  const flip = i % 2 === 1;

  return (
    <article
      ref={ref}
      data-theme={p.theme === "paper" ? "paper" : undefined}
      aria-labelledby={`${p.slug}-h`}
      className={`relative border-t border-line px-5 py-20 md:px-10 md:py-28 ${p.panelClass}`}
    >
      <div className="mx-auto grid max-w-[1500px] items-center gap-10 lg:grid-cols-12 lg:gap-16">
        <div className={`lg:col-span-5 ${flip ? "lg:order-2" : ""}`}>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
            <span className="text-accent">{p.n}</span> · {p.kicker}
          </p>
          <h3 id={`${p.slug}-h`} className="mt-4 text-5xl font-extrabold leading-[0.95] tracking-[-0.03em] md:text-7xl">
            <Link href={`/work/${p.slug}`} data-cursor className="hover:text-accent">{p.title}</Link>
          </h3>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-muted">{p.summary}</p>

          <dl className="mt-8 grid grid-cols-[6rem_1fr] gap-y-3 border-t border-line pt-6 text-sm">
            <dt className="font-mono text-xs uppercase tracking-wider text-muted">Role</dt>
            <dd>{p.role}</dd>
            <dt className="font-mono text-xs uppercase tracking-wider text-muted">Stack</dt>
            <dd>
              <ul className="flex flex-wrap gap-2">
                {p.tags.map((t) => (
                  <li key={t} className="border border-line px-2 py-0.5 font-mono text-xs">{t}</li>
                ))}
              </ul>
            </dd>
          </dl>

          <div className="mt-8 flex flex-wrap items-center gap-5">
            <Link href={`/work/${p.slug}`} data-cursor className="bg-lime px-5 py-3 text-sm font-semibold uppercase tracking-wider text-ink">
              Case study →
            </Link>
            {p.links.map((l) => (
              <a key={l.href + l.label} href={l.href} target="_blank" rel="noopener noreferrer" className="border-b border-fg/40 pb-0.5 text-sm uppercase tracking-wider hover:border-lime hover:text-accent">
                {l.label} ↗<span className="sr-only"> (opens in a new tab)</span>
              </a>
            ))}
          </div>
        </div>

        <motion.div style={reduce ? undefined : { y }} className={`lg:col-span-7 ${flip ? "lg:order-1" : ""}`}>
          <Visual />
        </motion.div>
      </div>
    </article>
  );
}
