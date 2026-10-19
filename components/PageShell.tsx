import type { ReactNode } from "react";

export function PageShell({ kicker, title, intro, children }: { kicker: string; title: ReactNode; intro?: string; children: ReactNode }) {
  return (
    <div className="px-5 pb-24 pt-28 md:px-10">
      <div className="mx-auto max-w-[1200px]">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">{kicker}</p>
        <h1 className="mt-4 text-5xl font-extrabold leading-[0.95] tracking-[-0.03em] md:text-8xl">{title}</h1>
        {intro && <p className="mt-6 max-w-2xl text-xl leading-relaxed text-muted">{intro}</p>}
        <div className="mt-14">{children}</div>
      </div>
    </div>
  );
}
