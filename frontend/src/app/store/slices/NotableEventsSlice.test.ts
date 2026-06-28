import { describe, it, expect } from "vitest";
import reducer, {
  addDetectedEvents,
  advanceNarrationCursor,
  resetNotableEvents,
  eventsToNarrate,
  type SimEvent,
} from "./NotableEventsSlice";
import type { DetectedEvent } from "@/app/utils/eventScanner";

function de(timeIndex: number): DetectedEvent {
  return {
    type: "perihelion",
    timeIndex,
    bodies: ["P"],
    severity: "info",
    magnitude: 1,
    message: `e${timeIndex}`,
  };
}

describe("NotableEventsSlice", () => {
  it("adds events, assigns ids, keeps them sorted", () => {
    let s = reducer(undefined, addDetectedEvents({ events: [de(30), de(10)], bufferStartTimestep: 0 }));
    expect(s.detectedEvents.map((e) => e.timeIndex)).toEqual([10, 30]);
    expect(new Set(s.detectedEvents.map((e) => e.id)).size).toBe(2);
    s = reducer(s, addDetectedEvents({ events: [de(20)], bufferStartTimestep: 0 }));
    expect(s.detectedEvents.map((e) => e.timeIndex)).toEqual([10, 20, 30]);
  });

  it("drops events evicted out of the live window", () => {
    let s = reducer(undefined, addDetectedEvents({ events: [de(5), de(50)], bufferStartTimestep: 0 }));
    s = reducer(s, addDetectedEvents({ events: [], bufferStartTimestep: 40 }));
    expect(s.detectedEvents.map((e) => e.timeIndex)).toEqual([50]);
  });

  it("advances the narration cursor monotonically", () => {
    let s = reducer(undefined, advanceNarrationCursor(100));
    expect(s.narrationCursorGlobal).toBe(100);
    s = reducer(s, advanceNarrationCursor(50)); // backward scrub does not lower it
    expect(s.narrationCursorGlobal).toBe(100);
  });

  it("resets everything", () => {
    let s = reducer(undefined, addDetectedEvents({ events: [de(5)], bufferStartTimestep: 0 }));
    s = reducer(s, advanceNarrationCursor(5));
    s = reducer(s, resetNotableEvents());
    expect(s.detectedEvents).toEqual([]);
    expect(s.narrationCursorGlobal).toBe(-1);
  });
});

describe("eventsToNarrate", () => {
  const evs: SimEvent[] = [10, 20, 30].map((t, i) => ({ ...de(t), id: i + 1 }));
  it("returns events strictly past the cursor and up to the playhead", () => {
    expect(eventsToNarrate(evs, 9, 20).map((e) => e.timeIndex)).toEqual([10, 20]);
  });
  it("returns nothing when the playhead is at or behind the cursor", () => {
    expect(eventsToNarrate(evs, 20, 20)).toEqual([]);
  });
});
