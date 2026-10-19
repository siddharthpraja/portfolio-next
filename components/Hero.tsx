"use client";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { SystemVisual } from "./SystemVisual";
import { site } from "@/lib/site";

const lines = ["ENGINEERING", "IDEAS INTO", "REALITY."];
const ease = [0.2, 0.7, 0.2, 1] as const;

export function Hero() {
  const reduce = useReducedMotion();
  const name = site.name.split("");

  return (
    <section id="top" aria-labelledby="hero-h" className="grid-lines relative flex min-h-screen flex-col justify-end overflow-hidden px-5 pb-10 pt-24 md:px-10">
      <div className="mx-auto w-full max-w-[1500px]">
        <p className="mb-6 font-mono text-xs uppercase tracking-[0.2em] text-muted">
          <span className="text-accent">(01)</span> Introduction
        </p>

        <h1
          id="hero-h"
          className="font-sans text-[clamp(2.6rem,10.6vw,10.5rem)] font-extrabold leading-[0.88] tracking-[-0.04em]"
        >
          {lines.map((l, i) => (
            <span key={l} className="block overflow-hidden pb-[0.05em]">
              <motion.span
                className={`block ${i === 2 ? "text-lime" : ""}`}
                initial={reduce ? false : { y: "108%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.9, delay: 0.1 + i * 0.12, ease }}
              >
                {l}
              </motion.span>
            </span>
          ))}
        </h1>

        <div className="mt-10 grid items-end gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p aria-label={site.name} className="font-serif text-4xl italic md:text-5xl">
              {name.map((c, i) => (
                <motion.span
                  key={i}
                  aria-hidden
                  className="inline-block whitespace-pre"
                  initial={reduce ? false : { opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 + i * 0.035, ease }}
                >
                  {c}
                </motion.span>
              ))}
            </p>
            <p className="mt-3 font-mono text-xs uppercase tracking-[0.16em] text-lime">{site.title}</p>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-muted">{site.description}</p>

            <div className="mt-8 flex flex-wrap items-center gap-6">
              <Link
                href="/story"
                data-cursor
                className="inline-flex items-center gap-3 bg-lime px-6 py-4 text-sm font-semibold uppercase tracking-wider text-ink transition-transform hover:-translate-y-0.5"
              >
                Watch the story <span aria-hidden>▶</span>
              </Link>
              <a href="#work" className="border-b border-fg/40 pb-1 text-sm uppercase tracking-wider transition-colors hover:border-lime hover:text-lime">
                Skip to the work ↓
              </a>
            </div>
          </div>

          <div className="lg:col-span-7">
            <SystemVisual />
          </div>
        </div>
      </div>
    </section>
  );
}
