import { describe, it, expect } from "vitest";
import { configureStore } from "@reduxjs/toolkit";
import simulationReducer, {
  appendChunkToBuffer,
  setCurrentTimeStepIndex,
} from "@/app/store/slices/SimulationSlice";
import eventLogReducer from "@/app/store/slices/EventLogSlice";
import notableEventsReducer from "@/app/store/slices/NotableEventsSlice";
import { notableEventsMiddleware } from "./notableEventsMiddleware";

// Minimal store with just the slices the middleware touches.
function makeStore() {
  return configureStore({
    reducer: {
      simulation: simulationReducer,
      eventLog: eventLogReducer,
      notableEvents: notableEventsReducer,
    },
    middleware: (gdm) =>
      gdm({ serializableCheck: false }).concat(notableEventsMiddleware),
  });
}

// Build the appendChunkToBuffer payload for the A/B fly-by (see eventScanner.test).
function approachChunkPayload() {
  const T = 11;
  const positions = new Float64Array(T * 2 * 6);
  const timestamps = new Float64Array(T);
  const dtSec = 86_400;
  for (let t = 0; t < T; t++) {
    timestamps[t] = t * 86_400_000;
    const base = t * 2 * 6;
    positions[base + 6] = (t - 5.4) * 1e9;
    positions[base + 7] = 1e8;
    positions[base + 6 + 3] = 1e9 / dtSec;
  }
  return {
    bodyNames: ["A", "B"],
    bodyCount: 2,
    timestepCount: T,
    positions,
    timestamps,
    mu: { A: 0, B: 0 },
    deltaERelative: new Float32Array(T),
    dp853AvgStepSeconds: null,
    dp853AcceptRate: null,
  };
}

describe("notableEventsMiddleware", () => {
  it("scans on appendChunkToBuffer and narrates as the playhead crosses", () => {
    const store = makeStore();
    store.dispatch(appendChunkToBuffer(approachChunkPayload()));
    const detected = store.getState().notableEvents.detectedEvents;
    expect(detected.length).toBeGreaterThanOrEqual(1);

    // Playhead behind the event: no SIM log entry yet.
    store.dispatch(setCurrentTimeStepIndex(2));
    expect(store.getState().eventLog.events.filter((e) => e.source === "SIM")).toHaveLength(0);

    // Playhead past the event: it narrates exactly once.
    store.dispatch(setCurrentTimeStepIndex(10));
    const sim1 = store.getState().eventLog.events.filter((e) => e.source === "SIM");
    expect(sim1.length).toBeGreaterThanOrEqual(1);
    expect(sim1[0].timeIndex).toBeDefined();

    // Scrub back then forward: no duplicate narration.
    store.dispatch(setCurrentTimeStepIndex(2));
    store.dispatch(setCurrentTimeStepIndex(10));
    const sim2 = store.getState().eventLog.events.filter((e) => e.source === "SIM");
    expect(sim2.length).toBe(sim1.length);
  });
});
