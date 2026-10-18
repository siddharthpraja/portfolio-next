"use client";
import { useState } from "react";

type Box = { x: number; label: string };
const shapes: Record<"legacy" | "modern", { boxes: Box[]; note: string }> = {
  legacy: {
    boxes: [
      { x: 60, label: "DESKTOP APP" },
      { x: 360, label: "DATABASE" },
    ],
    note: "A desktop client talking straight to its data. Hard to reach from anywhere else.",
  },
  modern: {
    boxes: [
      { x: 20, label: "BROWSER / PHONE" },
      { x: 220, label: "API" },
      { x: 400, label: "DATABASE" },
    ],
    note: "Every client goes through an API layer, so web and mobile share one set of rules.",
  },
};

export function ModernizationVisual() {
  const [mode, setMode] = useState<"legacy" | "modern">("legacy");
  const s = shapes[mode];
  return (
    <div className="border border-line bg-surface p-5">
      <div role="group" aria-label="Architecture" className="mb-5 inline-flex border border-line font-mono text-xs">
        {(["legacy", "modern"] as const).map((m) => (
          <button
            key={m}
            aria-pressed={mode === m}
            onClick={() => setMode(m)}
            data-cursor
            className={`px-4 py-2 uppercase tracking-wider ${mode === m ? "bg-lime text-ink" : "text-muted hover:text-fg"}`}
          >
            {m}
          </button>
        ))}
      </div>
      <svg viewBox="0 0 560 150" className="h-auto w-full" role="img" aria-label={`${mode} architecture: ${s.boxes.map((b) => b.label).join(", then ")}`}>
        {s.boxes.map((b, i) => (
          <g key={b.label}>
            {i > 0 && (
              <path
                d={`M${s.boxes[i - 1].x + 140} 75 L${b.x} 75`}
                className="flow stroke-lime"
                strokeWidth="1.5"
                fill="none"
              />
            )}
            <rect x={b.x} y="45" width="140" height="60" className="fill-graphite stroke-bone/40" />
            <text x={b.x + 70} y="75" textAnchor="middle" dominantBaseline="central" className="fill-bone font-mono text-[11px] tracking-[0.12em]">
              {b.label}
            </text>
          </g>
        ))}
      </svg>
      <p aria-live="polite" className="mt-2 max-w-md font-mono text-xs leading-relaxed text-muted">{s.note}</p>
      <p className="mt-4 font-mono text-[11px] text-muted">Simplified illustration of the approach.</p>
    </div>
  );
}
