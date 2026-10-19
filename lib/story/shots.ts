import type { Shot } from "./types";

// Camera choreography. A shot is a camera position and look-at point relative to the robot,
// so the camera follows the robot while it walks. Edit here to re-frame the whole film.

export type ShotFrame = { pos: [number, number, number]; look: [number, number, number]; fov: number };

export function shotFor(shot: Shot, r: { x: number; z: number }): ShotFrame {
  const { x, z } = r;
  switch (shot) {
    case "wide":   return { pos: [x * 0.3, 2.7, z + 8.8], look: [x * 0.5, 1.4, z - 2], fov: 50 };
    case "mid":    return { pos: [x + 0.8, 1.7, z + 4.4], look: [x, 1.25, z], fov: 42 };
    case "close":  return { pos: [x + 0.4, 1.55, z + 2.7], look: [x, 1.4, z], fov: 38 };
    case "eyes":   return { pos: [x, 1.5, z + 1.7], look: [x, 1.45, z + 0.3], fov: 30 };
    case "low":    return { pos: [x, 0.4, z + 3.8], look: [x, 1.7, z - 1], fov: 50 };
    case "high":   return { pos: [x, 4.6, z + 4.6], look: [x, 0.8, z], fov: 45 };
    case "left":   return { pos: [x - 3.4, 1.6, z + 4], look: [x + 0.4, 1.3, z], fov: 42 };
    case "right":  return { pos: [x + 3.4, 1.6, z + 4], look: [x - 0.4, 1.3, z], fov: 42 };
    case "follow": return { pos: [x, 1.9, z + 4.6], look: [x, 1.2, z - 3], fov: 45 };
  }
}
