"use client";
import Image from "next/image";
import { useState } from "react";

// Full class strings so Tailwind's compiler can see them.
const variants = {
  Solid: "bg-white text-black hover:bg-lime",
  Outline: "border border-white/60 text-white hover:border-lime hover:text-lime",
  Ghost: "text-white/80 hover:bg-white/10",
  Glow: "bg-white/5 text-white shadow-[0_0_24px_rgba(198,255,61,0.35)] hover:shadow-[0_0_36px_rgba(198,255,61,0.6)]",
} as const;
const radii = { Square: "rounded-none", Soft: "rounded-lg", Pill: "rounded-full" } as const;

export function ClipVisual() {
  const [v, setV] = useState<keyof typeof variants>("Solid");
  const [r, setR] = useState<keyof typeof radii>("Soft");
  const cls = `px-6 py-3 text-sm font-medium transition-all ${variants[v]} ${radii[r]}`;

  const pick = <T extends string>(opts: readonly T[], val: T, set: (x: T) => void, label: string) => (
    <div role="group" aria-label={label} className="flex flex-wrap items-center gap-2">
      <span className="w-14 font-mono text-[11px] uppercase tracking-wider text-muted">{label}</span>
      {opts.map((o) => (
        <button
          key={o}
          aria-pressed={val === o}
          onClick={() => set(o)}
          data-cursor
          className={`px-3 py-1 font-mono text-xs ${val === o ? "bg-lime text-ink" : "border border-line text-muted hover:text-fg"}`}
        >
          {o}
        </button>
      ))}
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="border border-line bg-black">
        <div className="flex min-h-[150px] items-center justify-center border-b border-line">
          <button type="button" className={cls}>Get started</button>
        </div>
        <div className="space-y-3 p-4">
          {pick(Object.keys(variants) as (keyof typeof variants)[], v, setV, "Style")}
          {pick(Object.keys(radii) as (keyof typeof radii)[], r, setR, "Shape")}
        </div>
        <pre className="overflow-x-auto border-t border-line p-4 font-mono text-xs leading-relaxed text-lime">
          <code>{`<button className="${cls}">\n  Get started\n</button>`}</code>
        </pre>
        <p className="border-t border-line px-4 py-2 font-mono text-[11px] text-muted">Demo built for this portfolio, not Clip-CSS&apos;s own API.</p>
      </div>
      <div className="overflow-hidden border border-line">
        <Image
          src="/images/clip-css.webp"
          alt="Clip-CSS home page on a laptop and a phone: a headline and a list of template groups (Buttons, Navbars, Hero Sections, Products)"
          width={1154}
          height={587}
          sizes="(min-width: 1024px) 58vw, 100vw"
          className="h-auto w-full"
        />
      </div>
    </div>
  );
}
