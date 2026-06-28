// Pure client-side scanner that turns the decoded ChunkBuffer's geometry into
// notable events (closest approaches, perihelia/aphelia). No React, no Redux.
// Reuses chunkBuffer's cubic-Hermite accessor for sub-keyframe refinement, so
// it introduces no new physics. All emitted timeIndex values are GLOBAL
// (bufferStartTimestep + local), making them invariant to live-buffer eviction.

import type { EventSeverity } from "@/app/store/slices/EventLogSlice";

export type EventType = "closestApproach" | "perihelion" | "aphelion";

export interface DetectedEvent {
  type: EventType;
  timeIndex: number;
  bodies: string[];
  severity: EventSeverity;
  magnitude: number;
  message: string;
}

// Interior strict turning points within [from, to]. A minimum is a strictly
// lower sample than both neighbours; a maximum strictly higher. Endpoints are
// never extrema (a turn cannot be confirmed without both neighbours). Flat
// runs are not extrema (strict comparison), which keeps noise off the scrubber.
export function findLocalExtrema(
  values: Float64Array | number[],
  from: number,
  to: number,
): { minima: number[]; maxima: number[] } {
  const minima: number[] = [];
  const maxima: number[] = [];
  const lo = Math.max(1, from);
  const hi = Math.min(values.length - 2, to);
  for (let i = lo; i <= hi; i++) {
    const a = values[i - 1];
    const b = values[i];
    const c = values[i + 1];
    if (b < a && b < c) minima.push(i);
    else if (b > a && b > c) maxima.push(i);
  }
  return { minima, maxima };
}

import { Vector3 } from "three";
import {
  type ChunkBuffer,
  readBodyPositionInto,
  getTimestampAsIsoString,
} from "@/app/store/chunkBuffer";

// A closest approach is kept only if it closes at least this fraction from the
// shallower of its two surrounding peaks (topographic prominence). Self-
// relative, so it works for both a tight inner-planet pass and a distant outer
// one without an absolute metre threshold.
export const MIN_PROMINENCE_FRACTION = 0.15;
// Above this prominence the approach is dramatic enough to flag as "warn"
// (brighter marker / dot), purely a presentation accent.
export const WARN_PROMINENCE_FRACTION = 0.5;
// Sub-keyframe refinement resolution per side of a candidate minimum.
export const REFINE_SUBSTEPS = 8;

// Title-case a possibly-uppercase body name for display ("EARTH" -> "Earth").
function displayName(name: string): string {
  if (name.length === 0) return name;
  return name[0].toUpperCase() + name.slice(1).toLowerCase();
}

export function describeApproach(
  bodies: [string, string],
  isoDate: string,
): string {
  const [a, b] = bodies.map(displayName);
  const date = isoDate ? isoDate.slice(0, 10) : "";
  return date
    ? `${a} is closest to ${b} on ${date}`
    : `${a} is closest to ${b}`;
}

// Scratch vectors, module-level to avoid per-call allocation in the scan.
const scratchA = new Vector3();
const scratchB = new Vector3();

// Distance between two bodies at a (possibly fractional) local index.
function separationAt(
  buffer: ChunkBuffer,
  localIdx: number,
  aIdx: number,
  bIdx: number,
): number {
  readBodyPositionInto(scratchA, buffer, localIdx, aIdx);
  readBodyPositionInto(scratchB, buffer, localIdx, bIdx);
  return scratchA.distanceTo(scratchB);
}

// Refine a minimum bracketed by [center-1, center+1] by sampling the Hermite
// interpolant. Returns { localIdx, distance } of the finest sample.
function refineMinimum(
  buffer: ChunkBuffer,
  center: number,
  aIdx: number,
  bIdx: number,
): { localIdx: number; distance: number } {
  const lo = Math.max(0, center - 1);
  const hi = Math.min(buffer.totalTimesteps - 1, center + 1);
  let bestIdx = center;
  let bestDist = separationAt(buffer, center, aIdx, bIdx);
  const steps = REFINE_SUBSTEPS;
  const span = hi - lo;
  const total = steps * 2;
  for (let k = 0; k <= total; k++) {
    const idx = lo + (span * k) / total;
    const d = separationAt(buffer, idx, aIdx, bIdx);
    if (d < bestDist) {
      bestDist = d;
      bestIdx = idx;
    }
  }
  return { localIdx: bestIdx, distance: bestDist };
}

// Nearest surrounding peak value on each side of a local minimum at `minPos`,
// walking outward through the precomputed distance array until it turns down.
function surroundingPeaks(
  dist: Float64Array,
  minPos: number,
  from: number,
  to: number,
): { leftPeak: number; rightPeak: number } {
  let left = dist[minPos];
  for (let i = minPos - 1; i >= from; i--) {
    if (dist[i] >= left) left = dist[i];
    else break;
  }
  let right = dist[minPos];
  for (let i = minPos + 1; i <= to; i++) {
    if (dist[i] >= right) right = dist[i];
    else break;
  }
  return { leftPeak: left, rightPeak: right };
}

export function detectClosestApproaches(
  buffer: ChunkBuffer,
  fromLocal: number,
  toLocal: number,
): DetectedEvent[] {
  const events: DetectedEvent[] = [];
  const n = buffer.bodyCount;
  const names = buffer.bodyNames;
  const from = Math.max(0, fromLocal);
  const to = Math.min(buffer.totalTimesteps - 1, toLocal);
  if (to - from < 2) return events;

  const dist = new Float64Array(to - from + 1);
  for (let a = 0; a < n; a++) {
    for (let b = a + 1; b < n; b++) {
      for (let i = from; i <= to; i++) {
        dist[i - from] = separationAt(buffer, i, a, b);
      }
      const { minima } = findLocalExtrema(dist, 0, dist.length - 1);
      for (const mLocalInArray of minima) {
        const { leftPeak, rightPeak } = surroundingPeaks(
          dist,
          mLocalInArray,
          0,
          dist.length - 1,
        );
        const ref = Math.min(leftPeak, rightPeak);
        if (ref <= 0) continue;
        const prominence = (ref - dist[mLocalInArray]) / ref;
        if (prominence < MIN_PROMINENCE_FRACTION) continue;

        const center = mLocalInArray + from;
        const refined = refineMinimum(buffer, center, a, b);
        const isoDate = getTimestampAsIsoString(
          buffer,
          Math.round(refined.localIdx),
        );
        events.push({
          type: "closestApproach",
          timeIndex: refined.localIdx + buffer.bufferStartTimestep,
          bodies: [names[a], names[b]],
          severity:
            prominence >= WARN_PROMINENCE_FRACTION ? "warn" : "info",
          magnitude: refined.distance,
          message: describeApproach([names[a], names[b]], isoDate),
        });
      }
    }
  }
  return events;
}
