"use client";
import { useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { Beat, Chapter, Flag } from "@/lib/story/types";
import { shotFor } from "@/lib/story/shots";
import { Robot } from "./Robot";
import { StoryEnvironment } from "./Environments";
import type { RobotPosRef, SpeakingRef } from "./shared";

type Props = {
  chapter: Chapter;
  beat: Beat;
  seq: number;
  flags: Flag[];
  speaking: SpeakingRef;
  /** false when the tab is hidden or the story is scrolled out of view: stops rendering. */
  active: boolean;
  reduced: boolean;
  lowPower: boolean;
  onProject: (slug: string) => void;
  onSkillGroup: (id: string) => void;
  onOpenLive: () => void;
  /** Called if WebGL fails or the device cannot keep up. */
  onFail: (reason: "context-lost" | "slow") => void;
};

/** Camera that glides to the beat's shot, relative to the robot's live position. */
function CameraRig({ beat, posRef, reduced }: { beat: Beat; posRef: RobotPosRef; reduced: boolean }) {
  const { camera } = useThree();
  const look = useRef(new THREE.Vector3(0, 1.3, 0));
  const pos = useRef(new THREE.Vector3(0, 2, 9));
  const fov = useRef(45);
  const first = useRef(true);
  const tp = useRef(new THREE.Vector3());
  const tl = useRef(new THREE.Vector3());
  useFrame(({ clock }, dtRaw) => {
    const dt = Math.min(dtRaw, 0.05);
    const f = shotFor(beat.shot, posRef.current);
    const rate = reduced || first.current ? 60 : 2.4;
    const k = 1 - Math.exp(-rate * dt);
    const drift = reduced ? 0 : 1;
    const t = clock.elapsedTime;
    tp.current.set(f.pos[0] + Math.sin(t * 0.3) * 0.06 * drift, f.pos[1] + Math.sin(t * 0.4) * 0.04 * drift, f.pos[2]);
    tl.current.set(f.look[0], f.look[1], f.look[2]);
    pos.current.lerp(tp.current, k);
    look.current.lerp(tl.current, 1 - Math.exp(-(reduced || first.current ? 60 : 3.2) * dt));
    fov.current += (f.fov - fov.current) * k;
    first.current = false;
    camera.position.copy(pos.current);
    camera.lookAt(look.current);
    const pc = camera as THREE.PerspectiveCamera;
    if (Math.abs(pc.fov - fov.current) > 0.01) { pc.fov = fov.current; pc.updateProjectionMatrix(); }
  });
  return null;
}

/** Watches frame times. First lowers resolution, then asks for the 2D version if the device still cannot cope. */
function PerfGuard({ onFail }: { onFail: Props["onFail"] }) {
  const { setDpr } = useThree();
  const st = useRef({ n: 0, sum: 0, stage: 0, warm: 0 });
  useFrame((_, dt) => {
    const s = st.current;
    s.warm += dt;
    if (s.warm < 3 || dt > 0.5) return; // ignore start-up hitches and tab switches
    s.n++; s.sum += dt;
    if (s.n >= 90) {
      const avg = s.sum / s.n;
      s.n = 0; s.sum = 0;
      if (avg > 1 / 20) {
        if (s.stage === 0) { s.stage = 1; setDpr(1); }
        else if (s.stage === 1) { s.stage = 2; onFail("slow"); }
      }
    }
  });
  return null;
}

export default function StoryScene(p: Props) {
  const posRef = useRef({ x: p.chapter.start[0], z: p.chapter.start[1] });
  const failRef = useRef(p.onFail);
  failRef.current = p.onFail;

  return (
    <Canvas
      frameloop={p.active ? "always" : "never"}
      dpr={p.lowPower ? [1, 1.25] : [1, 2]}
      gl={{ antialias: !p.lowPower, powerPreference: "high-performance", alpha: false }}
      camera={{ fov: 45, near: 0.1, far: 80, position: [0, 2, 9] }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;
        gl.domElement.addEventListener("webglcontextlost", (e) => { e.preventDefault(); failRef.current("context-lost"); });
      }}
      aria-hidden="true"
    >
      <StoryEnvironment
        env={p.chapter.env} flags={p.flags} reduced={p.reduced} lowPower={p.lowPower} beat={p.beat}
        onProject={p.onProject} onSkillGroup={p.onSkillGroup} onOpenLive={p.onOpenLive}
      />
      <Robot beat={p.beat} chapter={p.chapter} seq={p.seq} speaking={p.speaking} posRef={posRef} reduced={p.reduced} />
      <CameraRig beat={p.beat} posRef={posRef} reduced={p.reduced} />
      <PerfGuard onFail={(r) => failRef.current(r)} />
    </Canvas>
  );
}
