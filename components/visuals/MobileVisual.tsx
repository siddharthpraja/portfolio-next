"use client";
import { useState } from "react";

const apps = [
  { id: 0, name: "Client app", note: "The customer-facing mobile experience." },
  { id: 1, name: "Legacy-connected app", note: "Reads and writes data held in the existing system." },
];

function Phone({ label, on, onClick }: { label: string; on: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={on}
      aria-label={label}
      data-cursor
      className={`block w-[44%] max-w-[200px] shrink-0 rounded-[2rem] border-2 bg-ink p-2 transition-all duration-300 ${on ? "-translate-y-2 border-lime" : "border-line opacity-70"}`}
    >
      <div className="aspect-[9/19] overflow-hidden rounded-[1.5rem] bg-surface p-3 text-left">
        <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-line" />
        <div className="h-3 w-2/3 bg-line" />
        <div className="mt-4 space-y-2">
          {[0, 1, 2, 3].map((k) => (
            <div key={k} className="border border-line p-2">
              <div className="h-2 w-3/4 bg-line" />
              <div className="mt-2 h-2 w-1/2 bg-line/60" />
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-around">
          {[0, 1, 2].map((k) => <div key={k} className="h-3 w-3 rounded-full bg-line" />)}
        </div>
      </div>
    </button>
  );
}

export function MobileVisual() {
  const [a, setA] = useState(0);
  return (
    <div className="border border-line bg-surface/60 p-6">
      <div className="flex items-center justify-center gap-3">
        <Phone label="Client app" on={a === 0} onClick={() => setA(0)} />
        <div className="flex w-16 flex-col items-center gap-1 font-mono text-[10px] text-muted">
          <svg viewBox="0 0 64 8" className="w-full" aria-hidden>
            <path d="M0 4 L64 4" className="flow stroke-lime" strokeWidth="1.5" fill="none" />
          </svg>
          API
        </div>
        <Phone label="Legacy-connected app" on={a === 1} onClick={() => setA(1)} />
      </div>
      <p aria-live="polite" className="mt-6 text-center font-mono text-xs leading-relaxed text-muted">
        <span className="text-accent">{apps[a].name}</span> — {apps[a].note}
      </p>
      <p className="mt-2 text-center font-mono text-[11px] text-muted">Wireframes. Real screens can be added in /public/screens.</p>
    </div>
  );
}
