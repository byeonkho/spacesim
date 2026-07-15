import { describe, expect, it } from "vitest";
import type { DetectedEvent } from "@/app/utils/eventScanner";
import reducer, {
  addDetectedEvents,
  eventsToNarrate,
  markEventsNarrated,
  resetNotableEvents,
  type SimEvent,
} from "./NotableEventsSlice";

function detected(timeIndex: number): DetectedEvent {
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
  it("adds events, assigns ids, initializes narration, and sorts", () => {
    let state = reducer(
      undefined,
      addDetectedEvents({
        events: [detected(30), detected(10)],
        bufferStartTimestep: 0,
      }),
    );
    expect(state.detectedEvents.map((event) => event.timeIndex)).toEqual([
      10,
      30,
    ]);
    expect(new Set(state.detectedEvents.map((event) => event.id)).size).toBe(2);
    expect(state.detectedEvents.every((event) => !event.narrated)).toBe(true);

    state = reducer(
      state,
      addDetectedEvents({
        events: [detected(20)],
        bufferStartTimestep: 0,
      }),
    );
    expect(state.detectedEvents.map((event) => event.timeIndex)).toEqual([
      10,
      20,
      30,
    ]);
  });

  it("drops events evicted out of the live window", () => {
    let state = reducer(
      undefined,
      addDetectedEvents({
        events: [detected(5), detected(50)],
        bufferStartTimestep: 0,
      }),
    );
    state = reducer(
      state,
      addDetectedEvents({ events: [], bufferStartTimestep: 40 }),
    );
    expect(state.detectedEvents.map((event) => event.timeIndex)).toEqual([50]);
  });

  it("marks only requested ids", () => {
    let state = reducer(
      undefined,
      addDetectedEvents({
        events: [detected(10), detected(20)],
        bufferStartTimestep: 0,
      }),
    );
    state = reducer(
      state,
      markEventsNarrated([state.detectedEvents[0].id]),
    );
    expect(state.detectedEvents.map((event) => event.narrated)).toEqual([
      true,
      false,
    ]);
  });

  it("resets events and ids", () => {
    let state = reducer(
      undefined,
      addDetectedEvents({
        events: [detected(5)],
        bufferStartTimestep: 0,
      }),
    );
    state = reducer(state, markEventsNarrated([1]));
    state = reducer(state, resetNotableEvents());
    expect(state.detectedEvents).toEqual([]);
    expect(state.nextId).toBe(1);
  });
});

describe("eventsToNarrate", () => {
  const events: SimEvent[] = [
    { ...detected(10), id: 1, narrated: true },
    { ...detected(20), id: 2, narrated: false },
    { ...detected(30), id: 3, narrated: false },
  ];

  it("returns every unnarrated event at or behind the playhead", () => {
    expect(eventsToNarrate(events, 25).map((event) => event.id)).toEqual([2]);
  });

  it("includes a late-added event even when its time is far behind", () => {
    const late = { ...detected(5), id: 4, narrated: false };
    expect(
      eventsToNarrate([late, ...events], 25).map((event) => event.id),
    ).toEqual([4, 2]);
  });
});
