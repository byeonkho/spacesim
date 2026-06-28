import { describe, it, expect } from "vitest";
import { layoutMarkers } from "./markerLayout";
import type { SimEvent } from "@/app/store/slices/NotableEventsSlice";

function ev(id: number, timeIndex: number): SimEvent {
  return {
    id,
    type: "perihelion",
    timeIndex,
    bodies: ["P"],
    severity: "info",
    magnitude: 1,
    message: `e${id}`,
  };
}

describe("layoutMarkers", () => {
  it("places events by their local fraction of the track", () => {
    const out = layoutMarkers([ev(1, 0), ev(2, 50), ev(3, 100)], 0, 101, 1000, 10);
    expect(out.map((c) => Math.round(c.leftPct))).toEqual([0, 50, 100]);
    expect(out.every((c) => c.events.length === 1)).toBe(true);
  });

  it("drops evicted (local < 0) and future (local > 1) events", () => {
    const out = layoutMarkers([ev(1, -5), ev(2, 50), ev(3, 200)], 0, 101, 1000, 10);
    expect(out).toHaveLength(1);
    expect(out[0].events[0].id).toBe(2);
  });

  it("clusters markers closer than minGapPx", () => {
    // Track 1000px, minGap 10px -> 1% apart. Two events 0.5% apart cluster.
    const out = layoutMarkers([ev(1, 50), ev(2, 50.5)], 0, 101, 1000, 10);
    expect(out).toHaveLength(1);
    expect(out[0].events.map((e) => e.id).sort()).toEqual([1, 2]);
  });

  it("offsets local coordinates by bufferStart", () => {
    const out = layoutMarkers([ev(1, 1050)], 1000, 101, 1000, 10);
    expect(Math.round(out[0].leftPct)).toBe(50);
  });
});
