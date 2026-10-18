"use client";
import Link from "next/link";
import { useState } from "react";
import { nav } from "@/lib/site";

export function Nav() {
  const [open, setOpen] = useState(false);
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line bg-ink/80 backdrop-blur-md">
      <nav aria-label="Primary" className="mx-auto flex h-14 max-w-[1500px] items-center justify-between px-5 md:px-10">
        <Link href="/" className="font-mono text-sm tracking-widest" aria-label="Gautam Prajapati, home">
          GP<span className="text-accent">/</span>
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {nav.map((i) => (
            <li key={i.href}>
              <Link href={i.href} className="group font-mono text-xs uppercase tracking-[0.18em] text-muted transition-colors hover:text-fg">
                <span className="mr-1 text-accent opacity-0 transition-opacity group-hover:opacity-100">{i.n}</span>
                {i.label}
              </Link>
            </li>
          ))}
        </ul>

        <button
          type="button"
          className="font-mono text-xs uppercase tracking-[0.18em] md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </nav>

      {open && (
        <ul id="mobile-menu" className="border-t border-line bg-ink px-5 pb-4 md:hidden">
          {nav.map((i) => (
            <li key={i.href}>
              <Link
                href={i.href}
                onClick={() => setOpen(false)}
                className="flex items-baseline justify-between border-b border-line py-3 text-2xl font-semibold"
              >
                {i.label}
                <span className="font-mono text-xs text-accent">{i.n}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
