import { configureStore } from "@reduxjs/toolkit";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/app/store/chunkBuffer", async (importOriginal) => {
  const actual = await importOriginal<
    typeof import("@/app/store/chunkBuffer")
  >();
  return {
    ...actual,
    selectBufferByteBudget: () =>
      15 * 2 * actual.BYTES_PER_TIMESTEP_PER_BODY,
  };
});

import simulationReducer, {
  appendChunkToBuffer,
  loadSimulation,
  setCurrentTimeStepIndex,
} from "@/app/store/slices/SimulationSlice";
import eventLogReducer, {
  pushEvent,
} from "@/app/store/slices/EventLogSlice";
import notableEventsReducer from "@/app/store/slices/NotableEventsSlice";
import { createNotableEventsMiddleware } from "./notableEventsMiddleware";

const DAY_MS = 86_400_000;

function makeStore() {
  return configureStore({
    reducer: {
      simulation: simulationReducer,
      eventLog: eventLogReducer,
      notableEvents: notableEventsReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ serializableCheck: false }).concat(
        createNotableEventsMiddleware(),
      ),
  });
}

function pairPayload(
  separations: number[],
  startGlobal: number,
  bodyNames: [string, string] = ["A", "B"],
) {
  const positions = new Float64Array(separations.length * 2 * 6);
  const timestamps = new Float64Array(separations.length);
  for (let i = 0; i < separations.length; i++) {
    positions[i * 12 + 6] = separations[i];
    timestamps[i] = (startGlobal + i) * DAY_MS;
  }
  return {
    bodyNames,
    bodyCount: 2,
    timestepCount: separations.length,
    positions,
    timestamps,
    mu: { [bodyNames[0]]: 0, [bodyNames[1]]: 0 },
    deltaERelative: new Float32Array(separations.length),
    dp853AvgStepSeconds: null,
    dp853AcceptRate: null,
  };
}

function radialPayload(radii: number[], startGlobal: number) {
  const payload = pairPayload(radii, startGlobal, ["Sun", "P"]);
  return { ...payload, mu: { Sun: 1, P: 0 } };
}

const load = () =>
  loadSimulation({
    celestialBodyPropertiesList: [],
    simulationMetaData: null,
  });

describe("notableEventsMiddleware streaming lifecycle", () => {
  it("detects a prominent seam approach and narrates it once when confirmed late", () => {
    const store = makeStore();
    store.dispatch(
      appendChunkToBuffer(
        pairPayload([100, 90, 80, 70, 60, 50, 40, 30, 11, 10], 0),
      ),
    );
    store.dispatch(setCurrentTimeStepIndex(9));
    expect(store.getState().eventLog.events).toHaveLength(0);

    store.dispatch(
      appendChunkToBuffer(pairPayload([11, 30, 60, 100, 90], 10)),
    );

    const detected = store
      .getState()
      .notableEvents.detectedEvents.filter(
        (event) => event.type === "closestApproach",
      );
    expect(detected).toHaveLength(1);
    expect(Math.round(detected[0].timeIndex)).toBe(9);
    expect(detected[0].narrated).toBe(true);
    expect(
      store.getState().eventLog.events.filter((event) => event.source === "SIM"),
    ).toHaveLength(1);

    store.dispatch(setCurrentTimeStepIndex(0));
    store.dispatch(setCurrentTimeStepIndex(14));
    expect(
      store.getState().eventLog.events.filter((event) => event.source === "SIM"),
    ).toHaveLength(1);
  });

  it("detects a seam perihelion after the whole prior chunk is evicted", () => {
    const store = makeStore();
    store.dispatch(
      appendChunkToBuffer(
        radialPayload([11, 10, 9, 8, 7, 6, 5, 4, 3, 2], 0),
      ),
    );
    store.dispatch(
      appendChunkToBuffer(
        radialPayload([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 10),
      ),
    );

    expect(store.getState().simulation.chunkBuffer?.bufferStartTimestep).toBe(10);
    const perihelia = store
      .getState()
      .notableEvents.detectedEvents.filter(
        (event) => event.type === "perihelion",
      );
    expect(perihelia).toHaveLength(1);
    expect(Math.round(perihelia[0].timeIndex)).toBe(10);
  });

  it("detects an event at the retained head of an oversized first chunk", () => {
    const store = makeStore();
    const radii = Array.from(
      { length: 20 },
      (_, index) => 1 + Math.abs(index - 5),
    );

    store.dispatch(appendChunkToBuffer(radialPayload(radii, 0)));

    expect(store.getState().simulation.chunkBuffer?.bufferStartTimestep).toBe(5);
    const perihelia = store
      .getState()
      .notableEvents.detectedEvents.filter(
        (event) => event.type === "perihelion",
      );
    expect(perihelia).toHaveLength(1);
    expect(Math.round(perihelia[0].timeIndex)).toBe(5);
  });

  it("resets notable state and invalidates old SIM seek targets on load", () => {
    const store = makeStore();
    store.dispatch(
      pushEvent({
        source: "SIM",
        severity: "info",
        message: "Old run",
        timeIndex: 5,
        ts: 100,
      }),
    );
    store.dispatch(appendChunkToBuffer(radialPayload([3, 1, 3], 0)));
    expect(store.getState().notableEvents.detectedEvents).toHaveLength(1);

    store.dispatch(load());
    store.dispatch(
      appendChunkToBuffer(pairPayload([1, 2, 3, 4, 5, 6], 0)),
    );

    expect(store.getState().notableEvents.detectedEvents).toEqual([]);
    expect(store.getState().simulation.chunkBuffer?.totalTimesteps).toBe(6);
    expect(store.getState().eventLog.events[0].message).toBe("Old run");
    expect(store.getState().eventLog.events[0].timeIndex).toBeUndefined();
  });

  it("creates independent scanner state for each test store", () => {
    const first = makeStore();
    first.dispatch(
      appendChunkToBuffer(pairPayload([100, 10, 30, 100, 90], 0)),
    );

    const second = makeStore();
    second.dispatch(
      appendChunkToBuffer(pairPayload([100, 10, 30, 100, 90], 0)),
    );

    expect(first.getState().notableEvents.detectedEvents).toHaveLength(1);
    expect(second.getState().notableEvents.detectedEvents).toHaveLength(1);
  });

  it("keeps an accepted buffer append when scanner validation fails", () => {
    const warning = vi.spyOn(console, "warn").mockImplementation(() => {});
    try {
      const store = makeStore();
      store.dispatch(appendChunkToBuffer(pairPayload([100, 90], 0)));
      expect(() =>
        store.dispatch(
          appendChunkToBuffer(pairPayload([80, 70], 2, ["B", "A"])),
        ),
      ).not.toThrow();
      expect(store.getState().simulation.chunkBuffer?.totalTimesteps).toBe(4);
      expect(warning).toHaveBeenCalledOnce();
      expect(store.getState().notableEvents.detectedEvents).toEqual([]);
    } finally {
      warning.mockRestore();
    }
  });
});
