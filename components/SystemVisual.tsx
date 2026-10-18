"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";

type N = { id: string; x: number; y: number; label: string; note: string };

const nodes: N[] = [
  { id: "api", x: 300, y: 200, label: "API", note: "Node.js and Express services. This is where business rules live." },
  { id: "code", x: 90, y: 100, label: "CODE", note: "TypeScript and React, written to be read and maintained." },
  { id: "ui", x: 510, y: 100, label: "INTERFACE", note: "Responsive web interfaces with Next.js and Tailwind CSS." },
  { id: "mobile", x: 510, y: 310, label: "MOBILE", note: "React Native and Expo apps that talk to the same API." },
  { id: "db", x: 300, y: 360, label: "DATABASE", note: "SQL Server, PostgreSQL and MongoDB." },
  { id: "auto", x: 90, y: 300, label: "AUTOMATION", note: "Sync jobs, reminders and scheduled workflows." },
];
const edges: [string, string][] = [
  ["api", "code"], ["api", "ui"], ["api", "mobile"], ["api", "db"], ["api", "auto"], ["auto", "db"],
];
const get = (id: string) => nodes.find((n) => n.id === id)!;

export function SystemVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [fine, setFine] = useState(true);
  const [active, setActive] = useState("api");

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 80, damping: 18 });
  const sy = useSpring(my, { stiffness: 80, damping: 18 });
  const rotateY = useTransform(sx, [-1, 1], [-9, 9]);
  const rotateX = useTransform(sy, [-1, 1], [7, -7]);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const scrollTilt = useTransform(scrollYProgress, [0, 1], [-8, 8]);

  useEffect(() => setFine(window.matchMedia("(pointer: fine)").matches), []);

  const onMove = (e: React.PointerEvent) => {
    if (!fine || reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width) * 2 - 1);
    my.set(((e.clientY - r.top) / r.height) * 2 - 1);
  };
  const onLeave = () => { mx.set(0); my.set(0); };

  const current = get(active);

  return (
    <div ref={ref} onPointerMove={onMove} onPointerLeave={onLeave} className="[perspective:1000px]">
      <motion.div style={{ rotateY: reduce ? 0 : fine ? rotateY : scrollTilt, rotateX: reduce || !fine ? 0 : rotateX }}>
        <svg
          viewBox="0 0 600 420"
          className="h-auto w-full"
          role="group"
          aria-label="Interactive diagram: code, interface, mobile, database and automation connected through an API"
        >
          {edges.map(([a, b], i) => {
            const A = get(a), B = get(b);
            const hot = active === a || active === b;
            const d = `M${A.x} ${A.y} L${B.x} ${B.y}`;
            return (
              <g key={a + b}>
                <path d={d} className={hot ? "flow stroke-lime" : "flow stroke-bone/30"} fill="none" strokeWidth={hot ? 1.6 : 1} />
                {!reduce && (
                  <circle r="3" className="fill-lime">
                    <animateMotion dur={`${3 + (i % 3)}s`} begin={`${i * 0.5}s`} repeatCount="indefinite" path={d} />
                  </circle>
                )}
              </g>
            );
          })}
          {nodes.map((n) => {
            const on = n.id === active;
            return (
              <g
                key={n.id}
                transform={`translate(${n.x} ${n.y})`}
                tabIndex={0}
                role="button"
                aria-label={`${n.label}: ${n.note}`}
                aria-pressed={on}
                onMouseEnter={() => setActive(n.id)}
                onFocus={() => setActive(n.id)}
                onClick={() => setActive(n.id)}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setActive(n.id)}
                className="cursor-pointer outline-none [&:focus-visible>rect]:stroke-lime [&:focus-visible>rect]:stroke-2"
                data-cursor
              >
                <rect x="-62" y="-20" width="124" height="40" rx="3" className={on ? "fill-lime stroke-lime" : "fill-graphite stroke-bone/40"} />
                <text textAnchor="middle" dominantBaseline="central" className={`font-mono text-[11px] tracking-[0.14em] ${on ? "fill-ink" : "fill-bone"}`}>
                  {n.label}
                </text>
              </g>
            );
          })}
        </svg>
      </motion.div>
      <p aria-live="polite" className="mt-2 min-h-[3rem] max-w-md font-mono text-xs leading-relaxed text-muted">
        <span className="text-accent">{current.label}</span> — {current.note}
      </p>
    </div>
  );
}
