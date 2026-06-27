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
