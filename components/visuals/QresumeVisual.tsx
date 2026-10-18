"use client";
import Image from "next/image";
import { useState } from "react";

const steps = [
  { t: "Choose a document", d: "Resume, cover letter or resignation letter." },
  { t: "Pick a template", d: "Venture, Aspire, Elevate or Nexus." },
  { t: "Track jobs", d: "Browse jobs and keep your applications in one place." },
];
const templates = [
  { n: "Venture", tint: "bg-[#e3d5ff]" },
  { n: "Aspire", tint: "bg-[#ffe98a]" },
  { n: "Elevate", tint: "bg-[#bff0c4]" },
  { n: "Nexus", tint: "bg-[#c4dcff]" },
];

export function QresumeVisual() {
  const [s, setS] = useState(0);
  const [t, setT] = useState(0);
  return (
    <div className="space-y-4">
      <div className="overflow-hidden border border-line bg-surface">
        <Image
          src="/images/qresume.webp"
          alt="Qresume dashboard on a phone and a laptop: resume templates (Venture, Aspire, Elevate, Nexus) and a trending jobs list"
          width={1152}
          height={546}
          sizes="(min-width: 1024px) 58vw, 100vw"
          className="h-auto w-full"
        />
      </div>

      <div className="border border-line bg-surface p-4">
        <ol className="grid gap-2 sm:grid-cols-3">
          {steps.map((x, k) => (
            <li key={x.t}>
              <button
                onClick={() => setS(k)}
                aria-current={s === k ? "step" : undefined}
                data-cursor
                className={`w-full border p-3 text-left transition-colors ${s === k ? "border-lime bg-lime text-ink" : "border-line hover:border-fg"}`}
              >
                <span className="font-mono text-[11px] opacity-70">0{k + 1}</span>
                <span className="mt-1 block text-sm font-semibold">{x.t}</span>
              </button>
            </li>
          ))}
        </ol>
        <p aria-live="polite" className="mt-3 text-sm text-muted">{steps[s].d}</p>

        {s === 1 && (
          <div className="mt-4 grid grid-cols-4 gap-2" role="group" aria-label="Templates">
            {templates.map((x, k) => (
              <button
                key={x.n}
                onClick={() => setT(k)}
                aria-pressed={t === k}
                data-cursor
                className={`aspect-[3/4] p-2 text-left text-ink ${x.tint} ${t === k ? "ring-2 ring-ink ring-offset-2" : ""}`}
              >
                <div className="h-2 w-1/2 bg-ink/50" />
                <div className="mt-2 h-1 w-full bg-ink/25" />
                <div className="mt-1 h-1 w-4/5 bg-ink/25" />
                <span className="mt-2 block font-mono text-[10px]">{x.n}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
