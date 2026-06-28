import type { SimEvent } from "@/app/store/slices/NotableEventsSlice";

// One rendered pip on the scrubber. Collapses any events that would overlap on
// the current track width into a single cluster with a count.
export interface MarkerCluster {
  leftPct: number;
  events: SimEvent[];
}

// Convert global-coordinate events to positioned, de-overlapped clusters.
// Events outside the live window [0, total-1] are dropped (evicted or beyond
// what has been buffered). minGapPx is the minimum pixel separation before two
// markers merge.
export function layoutMarkers(
  events: SimEvent[],
  bufferStart: number,
  total: number,
  trackWidthPx: number,
  minGapPx = 10,
): MarkerCluster[] {
  if (total <= 1 || trackWidthPx <= 0) return [];

  const positioned = events
    .map((e) => {
      const local = (e.timeIndex - bufferStart) / (total - 1);
      return { e, local };
    })
    .filter((p) => p.local >= 0 && p.local <= 1)
    .sort((a, b) => a.local - b.local);

  const clusters: MarkerCluster[] = [];
  let current: { leftPct: number; pxAnchor: number; events: SimEvent[] } | null =
    null;
  const minGapFrac = minGapPx / trackWidthPx;

  for (const p of positioned) {
    if (current && p.local - current.pxAnchor <= minGapFrac) {
      current.events.push(p.e);
    } else {
      current = {
        leftPct: p.local * 100,
        pxAnchor: p.local,
        events: [p.e],
      };
      clusters.push(current);
    }
  }
  return clusters;
}
