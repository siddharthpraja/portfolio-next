"use client";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { projects } from "@/lib/projects";
import { skillGroups } from "@/lib/skills";
import { approach, hasFlag, makeLabelTexture, type SceneProps } from "./shared";
import type { EnvId } from "@/lib/story/types";

// The seven environments, built from primitives so no model downloads are needed.
// Each reads `flags` (set by the script) to change what is visible.

type Handlers = {
  onProject: (slug: string) => void;
  onSkillGroup: (id: string) => void;
  onOpenLive: () => void;
};
type EnvProps = SceneProps & Handlers;

// ── helpers ────────────────────────────────────────────────────────────────
function useTexture<T extends THREE.Texture>(make: () => T, deps: unknown[] = []) {
  const tex = useMemo(make, deps); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => () => tex.dispose(), [tex]);
  return tex;
}

function Ground({ color, size = 80, rough = 0.35, metal = 0.3 }: { color: string; size?: number; rough?: number; metal?: number }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[size, size]} />
      <meshStandardMaterial color={color} roughness={rough} metalness={metal} />
    </mesh>
  );
}

function Block({ p, s, c, r = 0.7, m = 0.1, rot }: { p: [number, number, number]; s: [number, number, number]; c: string; r?: number; m?: number; rot?: [number, number, number] }) {
  return (
    <mesh position={p} scale={s} rotation={rot}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={c} roughness={r} metalness={m} />
    </mesh>
  );
}

function Label({ tex, pos, scale }: { tex: THREE.Texture; pos: [number, number, number]; scale: [number, number, number] }) {
  return (
    <sprite position={pos} scale={scale}>
      <spriteMaterial map={tex} transparent depthWrite={false} />
    </sprite>
  );
}

// Deterministic pseudo-random so scenes look the same each load.
const rnd = (i: number) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

function setCursor(on: boolean) { if (typeof document !== "undefined") document.body.style.cursor = on ? "pointer" : ""; }

// ── 1. THE VOID ───────────────────────────────────────────────────────────
function VoidEnv() {
  const ring = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    const r = ring.current; if (!r) return;
    const k = (clock.elapsedTime * 0.5) % 1;
    r.scale.setScalar(1 + k * 6);
    (r.material as THREE.MeshBasicMaterial).opacity = (1 - k) * 0.35;
  });
  return (
    <>
      <color attach="background" args={["#03050a"]} />
      <fog attach="fog" args={["#03050a", 9, 32]} />
      <ambientLight intensity={0.25} />
      <pointLight position={[0, 2.4, 3]} intensity={14} distance={14} color="#59d9ff" />
      <Ground color="#05080e" rough={0.25} metal={0.7} />
      <gridHelper args={[60, 60, "#0e4357", "#0a1b26"]} position={[0, 0.003, 0]} />
      <mesh ref={ring} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[0.9, 1, 64]} />
        <meshBasicMaterial color="#59d9ff" transparent opacity={0.3} depthWrite={false} />
      </mesh>
    </>
  );
}

// ── 2. THE NUMBERS WORLD (warm accounting office) ─────────────────────────
function OfficeEnv({ flags, reduced }: SceneProps) {
  const papers = useRef<(THREE.Mesh | null)[]>([]);
  const loop = useRef(0);
  const N = 14;
  useFrame(({ clock }, dtRaw) => {
    const dt = Math.min(dtRaw, 0.05);
    loop.current = approach(loop.current, hasFlag(flags, "papersLoop") ? 1 : 0, dt, 1.5);
    const t = clock.elapsedTime * (reduced ? 0.15 : 1);
    papers.current.forEach((m, i) => {
      if (!m) return;
      const a = t * (0.25 + loop.current * 1.4) + (i / N) * Math.PI * 2;
      const rx = 2.4 + (i % 3) * 0.5, y = 2.2 + Math.sin(t * 0.7 + i) * 0.25 + (i % 4) * 0.25;
      const ringX = Math.cos(a) * rx, ringZ = -2.5 + Math.sin(a) * rx * 0.8;
      const homeX = (rnd(i) - 0.5) * 9, homeZ = -2 - rnd(i + 20) * 3;
      m.position.set(
        THREE.MathUtils.lerp(homeX + Math.sin(t * 0.5 + i) * 0.3, ringX, loop.current),
        y,
        THREE.MathUtils.lerp(homeZ, ringZ, loop.current),
      );
      m.rotation.set(Math.sin(t + i) * 0.4, a * 0.6, Math.cos(t * 0.8 + i) * 0.3);
      (m.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.1 + loop.current * 0.5;
    });
  });
  const books = useMemo(() => Array.from({ length: 30 }, (_, i) => ({
    x: -6.6 + (i % 10) * 1.32, y: 1 + Math.floor(i / 10) * 1.35, h: 0.8 + rnd(i) * 0.4,
    c: ["#7a2e2e", "#2f5d50", "#8a6a2b", "#3b4a7a", "#5a3b6e"][i % 5],
  })), []);
  return (
    <>
      <color attach="background" args={["#1a110a"]} />
      <fog attach="fog" args={["#1a110a", 10, 26]} />
      <ambientLight intensity={0.55} color="#ffd9a8" />
      <hemisphereLight args={["#ffd9a8", "#3a2414", 0.5]} />
      <pointLight position={[0, 4.2, -1]} intensity={55} distance={16} color="#ffb45a" />
      <pointLight position={[-4, 2, 3]} intensity={12} distance={9} color="#ff9a4d" />
      <Ground color="#5a3a22" rough={0.55} metal={0.05} />
      <Block p={[0, 3.5, -6.5]} s={[18, 8, 0.2]} c="#3a2616" />
      {books.map((b, i) => <Block key={i} p={[b.x, b.y + 0.5, -6.2]} s={[1.1, b.h, 0.5]} c={b.c} r={0.8} />)}
      {/* desk */}
      <Block p={[3.4, 0.55, -2.6]} s={[4.2, 0.12, 1.8]} c="#6b4527" r={0.5} />
      {[[-1.9, -1.6], [1.9, -1.6], [-1.9, 1.6], [1.9, 1.6]].map(([dx, dz], i) => <Block key={i} p={[3.4 + dx * 0.95, 0.27, -2.6 + dz * 0.4]} s={[0.12, 0.55, 0.12]} c="#4a2e18" />)}
      {/* ledgers + invoice stacks */}
      {[0, 1, 2].map((i) => <Block key={i} p={[2.2 + i * 0.1, 0.68 + i * 0.1, -2.7]} s={[0.9, 0.09, 0.65]} c={["#7a2e2e", "#2f5d50", "#3b4a7a"][i]} rot={[0, 0.15 * i, 0]} />)}
      {[0, 1, 2, 3].map((i) => <Block key={i} p={[4.5, 0.65 + i * 0.05, -2.4 + i * 0.03]} s={[0.7, 0.04, 0.95]} c="#f5efe2" rot={[0, i * 0.1, 0]} />)}
      {/* calculators */}
      {[3.1, 3.9].map((cx, k) => (
        <group key={k} position={[cx, 0.66, -2.2]} rotation={[0, -0.25 + k * 0.4, 0]}>
          <Block p={[0, 0.03, 0]} s={[0.55, 0.07, 0.8]} c="#222" m={0.3} />
          <Block p={[0, 0.075, -0.25]} s={[0.45, 0.02, 0.17]} c="#9be3a2" />
          {Array.from({ length: 12 }, (_, i) => <Block key={i} p={[-0.17 + (i % 3) * 0.17, 0.08, -0.05 + Math.floor(i / 3) * 0.14]} s={[0.12, 0.03, 0.1]} c={i === 11 ? "#c9743a" : "#ddd"} />)}
        </group>
      ))}
      {/* hanging lamp */}
      <mesh position={[0, 5.4, -1]}><cylinderGeometry args={[0.01, 0.01, 2.4, 6]} /><meshBasicMaterial color="#222" /></mesh>
      <mesh position={[0, 4.15, -1]}><coneGeometry args={[0.7, 0.5, 20, 1, true]} /><meshStandardMaterial color="#2c1c10" side={THREE.DoubleSide} /></mesh>
      <mesh position={[0, 4.0, -1]}><sphereGeometry args={[0.16, 16, 12]} /><meshBasicMaterial color="#ffd48a" /></mesh>
      {/* floating invoices */}
      {Array.from({ length: N }, (_, i) => (
        <mesh key={i} ref={(m) => { papers.current[i] = m; }}>
          <planeGeometry args={[0.55, 0.75]} />
          <meshStandardMaterial color="#f7f1e3" emissive="#ffb45a" emissiveIntensity={0.1} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </>
  );
}

// ── 3. THE CORRIDOR (accounting -> programming) ───────────────────────────
function CorridorEnv({ flags, reduced }: SceneProps) {
  const code = useTexture(() => {
    const c = document.createElement("canvas"); c.width = 512; c.height = 1024;
    const g = c.getContext("2d")!;
    g.fillStyle = "#04080d"; g.fillRect(0, 0, 512, 1024);
    g.font = "20px ui-monospace, monospace";
    const chars = "0123456789{}[]()=>;:+-*/%<>&|".split("");
    for (let col = 0; col < 24; col++) for (let row = 0; row < 48; row++) {
      const v = rnd(col * 97 + row);
      g.fillStyle = v > 0.92 ? "#c8f6ff" : v > 0.5 ? "#1fa7c4" : "#0f4c5c";
      g.fillText(chars[Math.floor(rnd(col * 13 + row * 7) * chars.length)], col * 21 + 4, row * 21 + 18);
    }
    const t = new THREE.CanvasTexture(c);
    t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(3, 1.2); t.colorSpace = THREE.SRGBColorSpace;
    return t;
  });
  const wallMats = useRef<THREE.MeshBasicMaterial[]>([]);
  const lvl = useRef(0.15);
  useFrame((_, dtRaw) => {
    const dt = Math.min(dtRaw, 0.05);
    lvl.current = approach(lvl.current, hasFlag(flags, "codeRain") ? 0.9 : 0.15, dt, 1.2);
    if (!reduced) code.offset.y -= dt * 0.35;
    wallMats.current.forEach((m) => { if (m) m.opacity = lvl.current; });
  });
  const frames = Array.from({ length: 12 }, (_, i) => i);
  const amber = new THREE.Color("#ffb45a"), cyan = new THREE.Color("#3de0ff");
  return (
    <>
      <color attach="background" args={["#07090e"]} />
      <fog attach="fog" args={["#07090e", 6, 26]} />
      <ambientLight intensity={0.25} />
      <pointLight position={[0, 2.8, 3]} intensity={35} distance={11} color="#ffb45a" />
      <pointLight position={[0, 2.4, -14]} intensity={60} distance={16} color="#3de0ff" />
      <Ground color="#0a0f16" size={120} rough={0.15} metal={0.8} />
      {frames.map((i) => {
        const col = amber.clone().lerp(cyan, i / 11);
        const z = 4 - i * 2;
        return (
          <group key={i} position={[0, 0, z]}>
            <mesh position={[0, 3.4, 0]}><boxGeometry args={[4.6, 0.1, 0.12]} /><meshBasicMaterial color={col} toneMapped={false} /></mesh>
            {[-2.25, 2.25].map((x) => <mesh key={x} position={[x, 1.7, 0]}><boxGeometry args={[0.1, 3.4, 0.12]} /><meshBasicMaterial color={col} toneMapped={false} /></mesh>)}
          </group>
        );
      })}
      {[-2.6, 2.6].map((x, i) => (
        <mesh key={x} position={[x, 1.8, -6]} rotation={[0, i ? -Math.PI / 2 : Math.PI / 2, 0]}>
          <planeGeometry args={[26, 3.6]} />
          <meshBasicMaterial ref={(m) => { if (m) wallMats.current[i] = m; }} map={code} transparent opacity={0.15} depthWrite={false} />
        </mesh>
      ))}
      <mesh position={[0, 1.7, -18]}><planeGeometry args={[4.4, 3.4]} /><meshBasicMaterial color="#d9fbff" toneMapped={false} /></mesh>
    </>
  );
}

// ── 4. THE DEVELOPER LAB ──────────────────────────────────────────────────
const GROUP_COLORS: Record<string, string> = { fullstack: "#59d9ff", mobile: "#b58cff", databases: "#ffc247", ai: "#6be0a5", business: "#ff8a6b" };

function monitorTexture(seed: number) {
  const c = document.createElement("canvas"); c.width = 512; c.height = 300;
  const g = c.getContext("2d")!;
  g.fillStyle = "#07111b"; g.fillRect(0, 0, 512, 300);
  g.font = "16px ui-monospace, monospace";
  const colors = ["#59d9ff", "#b58cff", "#6be0a5", "#ffc247", "#9aa7b4"];
  for (let r = 0; r < 14; r++) {
    const indent = Math.floor(rnd(seed + r) * 4) * 22;
    let x = 18 + indent;
    for (let w = 0; w < 1 + Math.floor(rnd(seed * 3 + r) * 3); w++) {
      const len = 40 + rnd(seed + r * 9 + w) * 110;
      g.fillStyle = colors[Math.floor(rnd(seed + r + w * 5) * colors.length)];
      g.fillRect(x, 20 + r * 19, len, 9);
      x += len + 10;
    }
  }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

function SkillOrb({ id, title, x, i, show, onPick }: { id: string; title: string; x: number; i: number; show: boolean; onPick: (id: string) => void }) {
  const g = useRef<THREE.Group>(null);
  const hover = useRef(false);
  const s = useRef(0);
  const tex = useTexture(() => makeLabelTexture([title], { w: 512, h: 96, size: 52 }), [title]);
  useFrame(({ clock }, dtRaw) => {
    const dt = Math.min(dtRaw, 0.05);
    s.current = approach(s.current, show ? (hover.current ? 1.15 : 1) : 0, dt, 5);
    if (g.current) {
      g.current.scale.setScalar(Math.max(0.001, s.current));
      g.current.position.y = 3.6 + Math.sin(clock.elapsedTime * 1.1 + i) * 0.12;
    }
  });
  return (
    <group ref={g} position={[x, 3.6, -1.8]}
      onClick={(e) => { e.stopPropagation(); onPick(id); }}
      onPointerOver={(e) => { e.stopPropagation(); hover.current = true; setCursor(true); }}
      onPointerOut={() => { hover.current = false; setCursor(false); }}>
      <mesh><sphereGeometry args={[0.5, 24, 18]} /><meshStandardMaterial color={GROUP_COLORS[id]} emissive={GROUP_COLORS[id]} emissiveIntensity={0.7} roughness={0.3} /></mesh>
      <Label tex={tex} pos={[0, -0.95, 0]} scale={[2.6, 0.49, 1]} />
    </group>
  );
}

function LabEnv({ flags, onSkillGroup }: EnvProps) {
  const screens = useMemo(() => [1, 2, 3].map((s) => monitorTexture(s * 17)), []);
  useEffect(() => () => { screens.forEach((t) => t.dispose()); }, [screens]);
  const leds = useRef<THREE.MeshBasicMaterial[]>([]);
  useFrame(({ clock }) => {
    leds.current.forEach((m, i) => { if (m) m.color.setHSL(i % 3 ? 0.5 : 0.35, 1, 0.3 + 0.3 * Math.max(0, Math.sin(clock.elapsedTime * (1.5 + (i % 5) * 0.7) + i))); });
  });
  return (
    <>
      <color attach="background" args={["#050a13"]} />
      <fog attach="fog" args={["#050a13", 10, 30]} />
      <ambientLight intensity={0.35} />
      <pointLight position={[0, 4.5, 1]} intensity={45} distance={16} color="#8fdcff" />
      <pointLight position={[-6, 2, -2]} intensity={14} distance={9} color="#6b8cff" />
      <Ground color="#0a111c" rough={0.2} metal={0.7} />
      <Block p={[0, 3, -7]} s={[24, 8, 0.2]} c="#0b1522" />
      {[-3.9, 0, 3.9].map((x, i) => (
        <group key={x} position={[x, 2.6, -5.6]}>
          <Block p={[0, 0, -0.06]} s={[3.5, 2.2, 0.1]} c="#10151d" m={0.5} />
          <mesh><planeGeometry args={[3.2, 1.9]} /><meshBasicMaterial map={screens[i]} toneMapped={false} /></mesh>
        </group>
      ))}
      <Block p={[0, 0.9, -4.8]} s={[12, 0.1, 1.4]} c="#1b2430" m={0.4} r={0.4} />
      {/* server racks with blinking lights */}
      {[-8, -6.6].map((x, r) => (
        <group key={x} position={[x, 0, -2.5]}>
          <Block p={[0, 1.6, 0]} s={[1.1, 3.2, 1]} c="#12171f" m={0.6} />
          {Array.from({ length: 8 }, (_, i) => (
            <mesh key={i} position={[-0.3 + (i % 2) * 0.6, 0.7 + Math.floor(i / 2) * 0.6, 0.52]}>
              <boxGeometry args={[0.12, 0.05, 0.02]} />
              <meshBasicMaterial ref={(m) => { if (m) leds.current[r * 8 + i] = m; }} color="#3de0ff" toneMapped={false} />
            </mesh>
          ))}
        </group>
      ))}
      {skillGroups.map((g, i) => (
        <SkillOrb key={g.id} id={g.id} title={g.title} i={i} x={-5.2 + i * 2.6} show={hasFlag(flags, "skills")} onPick={onSkillGroup} />
      ))}
    </>
  );
}

// ── 5. THE LEGACY SYSTEM ──────────────────────────────────────────────────
function diagramTexture() {
  const c = document.createElement("canvas"); c.width = 1024; c.height = 512;
  const g = c.getContext("2d")!;
  g.fillStyle = "rgba(6,14,24,0.92)"; g.fillRect(0, 0, 1024, 512);
  g.strokeStyle = "#59d9ff"; g.lineWidth = 3; g.strokeRect(2, 2, 1020, 508);
  g.textAlign = "center"; g.textBaseline = "middle";
  const box = (x: number, y: number, w: number, h: number, t: string, col: string) => {
    g.fillStyle = "rgba(255,255,255,0.06)"; g.fillRect(x, y, w, h); g.strokeStyle = col; g.lineWidth = 3; g.strokeRect(x, y, w, h);
    g.fillStyle = "#fff"; g.font = "600 30px system-ui, sans-serif"; g.fillText(t, x + w / 2, y + h / 2);
  };
  const arrow = (x1: number, y1: number, x2: number, y2: number) => {
    g.strokeStyle = "#59d9ff"; g.lineWidth = 3; g.beginPath(); g.moveTo(x1, y1); g.lineTo(x2, y2); g.stroke();
    const a = Math.atan2(y2 - y1, x2 - x1); g.beginPath(); g.moveTo(x2, y2);
    g.lineTo(x2 - 14 * Math.cos(a - 0.4), y2 - 14 * Math.sin(a - 0.4)); g.lineTo(x2 - 14 * Math.cos(a + 0.4), y2 - 14 * Math.sin(a + 0.4)); g.fill();
  };
  g.fillStyle = "#fff"; g.font = "700 34px system-ui, sans-serif"; g.fillText("After: modern web application", 512, 48);
  box(50, 190, 240, 110, "React", "#59d9ff");
  box(390, 190, 240, 110, "MERN web app", "#59d9ff");
  box(740, 110, 250, 100, "MongoDB", "#6be0a5");
  box(740, 280, 250, 100, "Microsoft SQL Server", "#ffc247");
  box(390, 390, 240, 90, "Existing business app", "#ff8a6b");
  arrow(290, 245, 390, 245); arrow(630, 225, 740, 165); arrow(630, 265, 740, 330); arrow(510, 390, 510, 300);
  g.fillStyle = "rgba(255,255,255,0.6)"; g.font = "500 22px ui-monospace, monospace"; g.fillText("Simplified illustration, not a screenshot", 512, 495);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

function LegacyEnv({ flags, reduced }: SceneProps) {
  const fixed = useRef(0);
  const redLight = useRef<THREE.PointLight>(null);
  const screenMats = useRef<THREE.MeshBasicMaterial[]>([]);
  const cableMats = useRef<THREE.MeshBasicMaterial[]>([]);
  const panel = useRef<THREE.Mesh>(null);
  const diagram = useTexture(diagramTexture);
  const sign = useTexture(() => makeLabelTexture(["VBScript + MySQL"], { w: 768, h: 140, size: 70, fg: "#ff9a6b" }));
  const cables = useMemo(() => Array.from({ length: 8 }, (_, i) => {
    const pts = Array.from({ length: 6 }, (_, k) => new THREE.Vector3((rnd(i * 9 + k) - 0.5) * 9, 0.2 + rnd(i * 5 + k * 3) * 3.2, -1 - rnd(i * 7 + k) * 4.5));
    return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 48, 0.035, 6, false);
  }), []);
  useEffect(() => () => cables.forEach((g) => g.dispose()), [cables]);
  const red = new THREE.Color("#ff4a22"), cyan = new THREE.Color("#59d9ff"), tmp = useMemo(() => new THREE.Color(), []);
  useFrame(({ clock }, dtRaw) => {
    const dt = Math.min(dtRaw, 0.05);
    fixed.current = approach(fixed.current, hasFlag(flags, "legacyFixed") ? 1 : 0, dt, 1.1);
    const f = fixed.current, t = clock.elapsedTime;
    const flick = reduced ? 0.8 : 0.55 + 0.45 * Math.abs(Math.sin(t * 13) * Math.sin(t * 5.3));
    if (redLight.current) {
      tmp.copy(red).lerp(cyan, f); redLight.current.color.copy(tmp);
      redLight.current.intensity = (30 * flick) * (1 - f) + 45 * f;
    }
    screenMats.current.forEach((m, i) => { if (!m) return; tmp.setRGB(0.15, 1, 0.45).multiplyScalar(0.5 + 0.5 * Math.abs(Math.sin(t * (3 + i)))).lerp(cyan, f); m.color.copy(tmp); });
    cableMats.current.forEach((m) => { if (m) m.opacity = 1 - f; });
    if (panel.current) { panel.current.scale.setScalar(Math.max(0.001, f)); panel.current.visible = f > 0.01; }
  });
  return (
    <>
      <color attach="background" args={["#0a0605"]} />
      <fog attach="fog" args={["#0a0605", 4, 20]} />
      <ambientLight intensity={0.12} />
      <pointLight ref={redLight} position={[0, 3.5, 1.5]} intensity={30} distance={14} color="#ff4a22" />
      <Ground color="#120c0a" rough={0.5} metal={0.4} />
      <Block p={[0, 3, -7]} s={[22, 8, 0.2]} c="#150e0b" />
      {Array.from({ length: 7 }, (_, i) => {
        const x = -5.4 + (i % 4) * 3.6 - (i > 3 ? 1.8 : 0), y = i > 3 ? 2.1 : 0.55, z = -3.4 - (i > 3 ? 0.3 : 0);
        return (
          <group key={i} position={[x, y + 0.5, z]} rotation={[0, (rnd(i) - 0.5) * 0.4, 0]}>
            <Block p={[0, 0, 0]} s={[1.5, 1.2, 1.2]} c="#b4a98f" r={0.9} m={0} />
            <mesh position={[0, 0.05, 0.62]}><planeGeometry args={[1.1, 0.85]} /><meshBasicMaterial ref={(m) => { if (m) screenMats.current[i] = m; }} color="#27ff73" toneMapped={false} /></mesh>
          </group>
        );
      })}
      {cables.map((geo, i) => (
        <mesh key={i} geometry={geo}><meshBasicMaterial ref={(m) => { if (m) cableMats.current[i] = m; }} color="#1b1412" transparent /></mesh>
      ))}
      <Label tex={sign} pos={[0, 5.2, -6.8]} scale={[7, 1.28, 1]} />
      <mesh ref={panel} position={[0, 3.4, -2]}><planeGeometry args={[5.6, 2.8]} /><meshBasicMaterial map={diagram} transparent toneMapped={false} /></mesh>
    </>
  );
}

// ── 6. THE PROJECT UNIVERSE ───────────────────────────────────────────────
const PORTALS: { slug: string; x: number; z: number; y: number; color: string; big?: boolean }[] = [
  { slug: "crm-erp-modernization", x: -5.4, z: -3.0, y: 2.2, color: "#ff7a59" },
  { slug: "react-native-apps", x: -2.7, z: -4.4, y: 2.3, color: "#59a8ff" },
  { slug: "accountbiz", x: 0, z: -6.4, y: 3.0, color: "#ffc247", big: true },
  { slug: "clip-css", x: 2.7, z: -4.4, y: 2.3, color: "#b58cff" },
  { slug: "qresume", x: 5.4, z: -3.0, y: 2.2, color: "#6be0a5" },
];

function Portal({ slug, x, y, z, color, big, onPick }: (typeof PORTALS)[number] & { onPick: (s: string) => void }) {
  const g = useRef<THREE.Group>(null);
  const ring2 = useRef<THREE.Mesh>(null);
  const hover = useRef(false);
  const sc = useRef(0);
  const title = projects.find((p) => p.slug === slug)?.title ?? slug;
  const tex = useTexture(() => makeLabelTexture([title], { w: 640, h: 110, size: 56 }), [title]);
  useFrame(({ clock }, dtRaw) => {
    const dt = Math.min(dtRaw, 0.05), t = clock.elapsedTime;
    sc.current = approach(sc.current, (big ? 1.35 : 1) * (hover.current ? 1.1 : 1), dt, 5);
    if (g.current) { g.current.scale.setScalar(sc.current); g.current.position.y = y + Math.sin(t * 0.9 + x) * 0.1; }
    if (ring2.current) { ring2.current.rotation.z = t * (big ? 0.9 : 0.35); }
  });
  return (
    <group ref={g} position={[x, y, z]}
      onClick={(e) => { e.stopPropagation(); onPick(slug); }}
      onPointerOver={(e) => { e.stopPropagation(); hover.current = true; setCursor(true); }}
      onPointerOut={() => { hover.current = false; setCursor(false); }}>
      <mesh><torusGeometry args={[1, 0.07, 16, 64]} /><meshBasicMaterial color={color} toneMapped={false} /></mesh>
      <mesh ref={ring2} scale={0.84}><torusGeometry args={[1, 0.02, 8, 48]} /><meshBasicMaterial color={color} transparent opacity={0.6} toneMapped={false} /></mesh>
      <mesh><circleGeometry args={[0.95, 40]} /><meshBasicMaterial color={color} transparent opacity={big ? 0.32 : 0.2} depthWrite={false} /></mesh>
      <Label tex={tex} pos={[0, -1.45, 0]} scale={[3.2, 0.55, 1]} />
    </group>
  );
}

function UniverseEnv({ flags, onProject }: EnvProps) {
  return (
    <>
      <color attach="background" args={["#050716"]} />
      <fog attach="fog" args={["#050716", 10, 34]} />
      <ambientLight intensity={0.4} />
      <pointLight position={[0, 6, 2]} intensity={50} distance={20} color="#9ad7ff" />
      <pointLight position={[0, 3, -5]} intensity={30} distance={10} color="#ffc247" />
      <mesh position={[0, -0.06, -2]}><cylinderGeometry args={[9, 9.3, 0.12, 64]} /><meshStandardMaterial color="#0b1230" roughness={0.3} metalness={0.7} /></mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, -2]}><ringGeometry args={[8.7, 9, 64]} /><meshBasicMaterial color="#59d9ff" toneMapped={false} /></mesh>
      <Ground color="#04050d" rough={0.4} metal={0.5} />
      {hasFlag(flags, "portals") && PORTALS.map((p) => <Portal key={p.slug} {...p} onPick={onProject} />)}
    </>
  );
}

// ── 7. THE ACCOUNTBIZ REVEAL (and the closing scene) ──────────────────────
function Screenshot({ onOpenLive, show, aside }: { onOpenLive: () => void; show: boolean; aside: boolean }) {
  const tex = useLoader(THREE.TextureLoader, "/images/accountbiz.webp");
  useMemo(() => { tex.colorSpace = THREE.SRGBColorSpace; }, [tex]);
  const g = useRef<THREE.Group>(null);
  const s = useRef(0), x = useRef(0), hover = useRef(false);
  const img = tex.image as { width: number; height: number } | undefined;
  const ratio = img?.width && img?.height ? img.width / img.height : 16 / 9;
  const H = 3.4, W = H * ratio;
  useFrame((_, dtRaw) => {
    const dt = Math.min(dtRaw, 0.05);
    s.current = approach(s.current, show ? (aside ? 0.6 : 1) * (hover.current ? 1.03 : 1) : 0, dt, 2.2);
    x.current = approach(x.current, aside ? -4.4 : 0, dt, 2);
    if (g.current) { g.current.scale.setScalar(Math.max(0.001, s.current)); g.current.position.set(x.current, 2.7 + (1 - Math.min(1, s.current)) * -1.5, -3.4); }
  });
  return (
    <group ref={g}
      onClick={(e) => { e.stopPropagation(); onOpenLive(); }}
      onPointerOver={(e) => { e.stopPropagation(); hover.current = true; setCursor(true); }}
      onPointerOut={() => { hover.current = false; setCursor(false); }}>
      <mesh position={[0, 0, -0.06]}><boxGeometry args={[W + 0.25, H + 0.25, 0.1]} /><meshStandardMaterial color="#141b26" metalness={0.6} roughness={0.35} /></mesh>
      <mesh><planeGeometry args={[W, H]} /><meshBasicMaterial map={tex} toneMapped={false} /></mesh>
    </group>
  );
}

function RevealEnv({ flags, reduced, onOpenLive }: EnvProps) {
  const key = useRef<THREE.PointLight>(null);
  const warm = useRef<THREE.PointLight>(null);
  const amb = useRef<THREE.AmbientLight>(null);
  const burst = useRef<THREE.Mesh>(null);
  const lvl = useRef(0.05), burstT = useRef(-1), wasReveal = useRef(false);
  const word = useTexture(() => makeLabelTexture(["ACCOUNTBIZ"], { w: 1024, h: 200, size: 130, fg: "#ffe3a3" }));
  const wordS = useRef(0);
  const wordRef = useRef<THREE.Sprite>(null);
  const dark = hasFlag(flags, "dark"), reveal = hasFlag(flags, "reveal"), aside = hasFlag(flags, "contact");
  useFrame((_, dtRaw) => {
    const dt = Math.min(dtRaw, 0.05);
    lvl.current = approach(lvl.current, dark ? 0.04 : reveal ? 1 : 0.12, dt, 1.6);
    const l = lvl.current;
    if (key.current) key.current.intensity = 70 * l;
    if (warm.current) warm.current.intensity = (aside ? 40 : 18) * l;
    if (amb.current) amb.current.intensity = 0.05 + 0.5 * l;
    if (reveal && !wasReveal.current) burstT.current = 0;
    wasReveal.current = reveal;
    if (burst.current) {
      if (burstT.current >= 0 && !reduced) {
        burstT.current += dt;
        const k = Math.min(1, burstT.current / 1.6);
        burst.current.scale.setScalar(1 + k * 9);
        (burst.current.material as THREE.MeshBasicMaterial).opacity = (1 - k) * 0.6;
        if (k >= 1) burstT.current = -1;
      } else burst.current.visible = false;
      if (burstT.current >= 0) burst.current.visible = true;
    }
    wordS.current = approach(wordS.current, hasFlag(flags, "logo") && !aside ? 1 : 0, dt, 3);
    if (wordRef.current) wordRef.current.scale.set(6 * wordS.current, 1.17 * wordS.current, 1);
  });
  return (
    <>
      <color attach="background" args={["#0a1426"]} />
      <fog attach="fog" args={["#0a1426", 12, 34]} />
      <ambientLight ref={amb} intensity={0.1} color="#cfe6ff" />
      <pointLight ref={key} position={[0, 6, 4]} intensity={4} distance={22} color="#bfe3ff" />
      <pointLight ref={warm} position={[-3, 2.5, 2]} intensity={2} distance={14} color="#ffc27a" />
      <Ground color="#0e1b33" rough={0.18} metal={0.7} />
      <mesh ref={burst} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, -1]} visible={false}>
        <ringGeometry args={[0.95, 1, 64]} /><meshBasicMaterial color="#ffe3a3" transparent opacity={0} depthWrite={false} toneMapped={false} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, -1]}><ringGeometry args={[4.4, 4.5, 80]} /><meshBasicMaterial color="#ffc247" transparent opacity={0.5} toneMapped={false} /></mesh>
      <Suspense fallback={null}><Screenshot onOpenLive={onOpenLive} show={reveal && !dark} aside={aside} /></Suspense>
      <sprite ref={wordRef} position={[0, 5.5, -3.4]} scale={[0.001, 0.001, 1]}><spriteMaterial map={word} transparent depthWrite={false} toneMapped={false} /></sprite>
    </>
  );
}

export function StoryEnvironment(props: EnvProps & { env: EnvId }) {
  const { env, ...rest } = props;
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  if (!ready) return null; // canvas textures need the DOM
  switch (env) {
    case "void": return <VoidEnv />;
    case "office": return <OfficeEnv {...rest} />;
    case "corridor": return <CorridorEnv {...rest} />;
    case "lab": return <LabEnv {...rest} />;
    case "legacy": return <LegacyEnv {...rest} />;
    case "universe": return <UniverseEnv {...rest} />;
    case "reveal": return <RevealEnv {...rest} />;
  }
}
