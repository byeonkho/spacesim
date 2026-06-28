import { describe, it, expect } from "vitest";
import { findLocalExtrema, detectClosestApproaches } from "./eventScanner";
import {
  createChunkBuffer,
  appendChunk,
  type ChunkBuffer,
} from "@/app/store/chunkBuffer";

describe("findLocalExtrema", () => {
  it("finds an interior minimum and maximum", () => {
    // v-shape then peak: indices 0..6
    const v = [5, 3, 1, 4, 9, 6, 2];
    const { minima, maxima } = findLocalExtrema(v, 0, v.length - 1);
    expect(minima).toEqual([2]); // value 1
    expect(maxima).toEqual([4]); // value 9
  });

  it("ignores the endpoints (no extremum can be confirmed there)", () => {
    const v = [1, 2, 3];
    const { minima, maxima } = findLocalExtrema(v, 0, v.length - 1);
    expect(minima).toEqual([]);
    expect(maxima).toEqual([]);
  });

  it("respects the [from,to] window", () => {
    const v = [9, 1, 9, 1, 9];
    const { minima, maxima } = findLocalExtrema(v, 2, 4);
    expect(minima).toEqual([3]); // only the dip inside the window
    expect(maxima).toEqual([2]); // index 2 is an interior maximum (9 > 1 on both sides)
  });

  it("treats flat runs as non-extrema (strict turns only)", () => {
    const v = [3, 1, 1, 1, 3];
    const { minima } = findLocalExtrema(v, 0, v.length - 1);
    expect(minima).toEqual([]); // no strict v
  });
});

// Build a 2-body buffer where body B sweeps past stationary body A. Positions
// are metres; the minimum separation lands between keyframes so we also assert
// sub-keyframe refinement. Velocities are exact finite-difference tangents so
// the Hermite refinement matches the straight-line motion.
function buildApproachBuffer(): ChunkBuffer {
  const names = ["A", "B"];
  const T = 11;
  const buf = createChunkBuffer(names, T);
  const positions = new Float64Array(T * 2 * 6);
  const timestamps = new Float64Array(T);
  const dE = new Float32Array(T);
  const gapMs = 86_400_000; // 1 day
  const dtSec = gapMs / 1000;
  // B moves along +x from -5e9 to +5e9, closest approach (perp offset 1e8) at x=0,
  // which falls at t=5 exactly here; shift start so the min is between keyframes.
  for (let t = 0; t < T; t++) {
    timestamps[t] = t * gapMs;
    // A at origin, stationary.
    // B at (x(t), 1e8, 0), x(t) = (t - 5.4) * 1e9  -> min |x| near t=5.4
    const x = (t - 5.4) * 1e9;
    const base = t * 2 * 6;
    // A
    positions[base + 0] = 0;
    positions[base + 3] = 0;
    // B
    positions[base + 6] = x;
    positions[base + 7] = 1e8;
    positions[base + 6 + 3] = 1e9 / dtSec; // vx (m/s), matches dx/dt
  }
  appendChunk(buf, positions, timestamps, dE, T);
  return buf;
}

describe("detectClosestApproaches", () => {
  it("detects one prominent approach and refines below the keyframe grid", () => {
    const buf = buildApproachBuffer();
    const events = detectClosestApproaches(buf, 0, buf.totalTimesteps - 1);
    expect(events).toHaveLength(1);
    const e = events[0];
    expect(e.type).toBe("closestApproach");
    expect(new Set(e.bodies)).toEqual(new Set(["A", "B"]));
    // True min is at t≈5.4 (where x≈0, separation≈1e8). Refinement should land
    // within half a keyframe of 5.4 and the magnitude near 1e8.
    expect(e.timeIndex).toBeGreaterThan(4.8);
    expect(e.timeIndex).toBeLessThan(5.8);
    expect(e.magnitude).toBeLessThan(1.5e8);
    expect(e.message.length).toBeGreaterThan(0);
  });

  it("drops a shallow, non-prominent wobble", () => {
    const names = ["A", "B"];
    const T = 5;
    const buf = createChunkBuffer(names, T);
    const positions = new Float64Array(T * 2 * 6);
    const timestamps = new Float64Array(T);
    const dE = new Float32Array(T);
    // Separation sequence with only a 2% dip: 100,100,98,100,100 (scaled to metres)
    const sep = [100, 100, 98, 100, 100];
    for (let t = 0; t < T; t++) {
      timestamps[t] = t * 86_400_000;
      const base = t * 2 * 6;
      positions[base + 6] = sep[t] * 1e6; // B offset along x
    }
    appendChunk(buf, positions, timestamps, dE, T);
    const events = detectClosestApproaches(buf, 0, buf.totalTimesteps - 1);
    expect(events).toHaveLength(0);
  });
});
