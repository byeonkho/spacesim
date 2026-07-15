import { describe, expect, it } from "vitest";
import {
  NotableEventStreamScanner,
  type ScannerChunkPayload,
} from "./notableEventStreamScanner";

const DAY_MS = 86_400_000;

function radialChunk(
  radii: number[],
  startGlobal: number,
  names: [string, string] = ["Sun", "P"],
): ScannerChunkPayload {
  const positions = new Float64Array(radii.length * 2 * 6);
  const timestamps = new Float64Array(radii.length);
  for (let i = 0; i < radii.length; i++) {
    timestamps[i] = (startGlobal + i) * DAY_MS;
    positions[i * 12 + 6] = radii[i];
  }
  return {
    bodyNames: names,
    bodyCount: 2,
    timestepCount: radii.length,
    positions,
    timestamps,
  };
}

function pairChunk(
  separations: number[],
  startGlobal: number,
): ScannerChunkPayload {
  const positions = new Float64Array(separations.length * 2 * 6);
  const timestamps = new Float64Array(separations.length);
  for (let i = 0; i < separations.length; i++) {
    timestamps[i] = (startGlobal + i) * DAY_MS;
    positions[i * 12 + 6] = separations[i];
  }
  return {
    bodyNames: ["A", "B"],
    bodyCount: 2,
    timestepCount: separations.length,
    positions,
    timestamps,
  };
}

function refinedFlybyChunk(): ScannerChunkPayload {
  const timestepCount = 12;
  const positions = new Float64Array(timestepCount * 2 * 6);
  const timestamps = new Float64Array(timestepCount);
  const dtSeconds = DAY_MS / 1000;
  for (let t = 0; t < timestepCount; t++) {
    timestamps[t] = t * DAY_MS;
    const base = t * 12 + 6;
    const x = t < 11 ? (t - 5.4) * 1e9 : 4e9;
    positions[base] = x;
    positions[base + 1] = 1e8;
    positions[base + 3] =
      t < 11 ? 1e9 / dtSeconds : -0.6e9 / dtSeconds;
  }
  return {
    bodyNames: ["A", "B"],
    bodyCount: 2,
    timestepCount,
    positions,
    timestamps,
  };
}

describe("NotableEventStreamScanner Sun-relative extrema", () => {
  it("detects a seam perihelion exactly once", () => {
    const scanner = new NotableEventStreamScanner();
    expect(scanner.consume(radialChunk([3, 2], 0), 0)).toEqual([]);

    const events = scanner.consume(radialChunk([1, 2, 3], 2), 2);

    expect(
      events.filter((event) => event.type === "perihelion"),
    ).toHaveLength(1);
    expect(Math.round(events[0].timeIndex)).toBe(2);
    expect(scanner.consume(radialChunk([4, 5], 5), 5)).toEqual([]);
  });

  it("detects strict perihelion and aphelion but ignores flat extrema", () => {
    const scanner = new NotableEventStreamScanner();
    const events = scanner.consume(
      radialChunk([3, 1, 3, 5, 3, 3, 5], 0),
      0,
    );
    expect(
      events
        .filter((event) => event.type !== "closestApproach")
        .map((event) => event.type),
    ).toEqual(["perihelion", "aphelion"]);
  });

  it("reset clears the run schema", () => {
    const scanner = new NotableEventStreamScanner();
    scanner.consume(radialChunk([3, 2], 0), 0);
    scanner.reset();
    expect(() =>
      scanner.consume(radialChunk([1, 2, 3], 0, ["STAR", "Q"]), 0),
    ).not.toThrow();
  });

  it("fails closed on a schema change, then accepts the original schema fresh", () => {
    const scanner = new NotableEventStreamScanner();
    scanner.consume(radialChunk([3, 2], 0), 0);
    expect(() =>
      scanner.consume(radialChunk([1, 2], 2, ["P", "Sun"]), 2),
    ).toThrow(/body schema/i);
    expect(scanner.consume(radialChunk([3, 2, 1], 4), 4)).toEqual([]);
  });

  it("fails closed on an index gap and never creates an event across it", () => {
    const scanner = new NotableEventStreamScanner();
    scanner.consume(radialChunk([3, 2], 0), 0);
    expect(() => scanner.consume(radialChunk([1, 2], 5), 5)).toThrow(
      /index/i,
    );
    expect(scanner.consume(radialChunk([3, 2, 1], 7), 7)).toEqual([]);
  });

  it("fails closed on malformed typed-array lengths", () => {
    const scanner = new NotableEventStreamScanner();
    const malformed = radialChunk([3, 2, 1], 0);
    malformed.positions = new Float64Array(1);
    expect(() => scanner.consume(malformed, 0)).toThrow(/malformed/i);
    expect(scanner.consume(radialChunk([3, 2, 1], 3), 3)).toEqual([]);
  });
});

describe("NotableEventStreamScanner closest-approach prominence", () => {
  it("retains the left peak across a normal chunk seam", () => {
    const scanner = new NotableEventStreamScanner();
    expect(
      scanner.consume(
        pairChunk([100, 90, 80, 70, 60, 50, 40, 30, 11, 10], 0),
        0,
      ),
    ).toEqual([]);

    const events = scanner.consume(
      pairChunk([11, 30, 60, 100, 90], 10),
      10,
    );

    expect(events).toHaveLength(1);
    expect(events[0].type).toBe("closestApproach");
    expect(Math.round(events[0].timeIndex)).toBe(9);
    expect(events[0].severity).toBe("warn");
  });

  it("waits for the following peak to turn down", () => {
    const scanner = new NotableEventStreamScanner();
    expect(scanner.consume(pairChunk([100, 10, 20, 40], 0), 0)).toEqual([]);
    expect(scanner.consume(pairChunk([80], 4), 4)).toEqual([]);
    const events = scanner.consume(pairChunk([70], 5), 5);
    expect(events).toHaveLength(1);
    expect(Math.round(events[0].timeIndex)).toBe(1);
  });

  it("does not emit an unresolved final candidate", () => {
    const scanner = new NotableEventStreamScanner();
    expect(
      scanner.consume(pairChunk([100, 10, 20, 40, 80], 0), 0),
    ).toEqual([]);
  });

  it("drops shallow and flat-bottom dips", () => {
    const shallow = new NotableEventStreamScanner();
    expect(
      shallow.consume(pairChunk([100, 98, 100, 99], 0), 0),
    ).toEqual([]);
    const flat = new NotableEventStreamScanner();
    expect(
      flat.consume(pairChunk([100, 10, 10, 100, 90], 0), 0),
    ).toEqual([]);
  });

  it("accepts a flat-topped surrounding peak after its later decline", () => {
    const scanner = new NotableEventStreamScanner();
    const events = scanner.consume(
      pairChunk([100, 10, 50, 100, 100, 90], 0),
      0,
    );
    expect(events).toHaveLength(1);
    expect(Math.round(events[0].timeIndex)).toBe(1);
  });

  it("prunes a pending event outside the live window", () => {
    const scanner = new NotableEventStreamScanner();
    scanner.consume(pairChunk([100, 10, 20], 0), 0);
    scanner.pruneBefore(2);
    expect(scanner.consume(pairChunk([100, 90], 3), 3)).toEqual([]);
  });

  it("refines the minimum between keyframes and emits it once", () => {
    const scanner = new NotableEventStreamScanner();
    const events = scanner.consume(refinedFlybyChunk(), 0);
    expect(events).toHaveLength(1);
    expect(events[0].timeIndex).toBeGreaterThan(4.8);
    expect(events[0].timeIndex).toBeLessThan(5.8);
    expect(events[0].magnitude).toBeLessThan(1.5e8);
    expect(scanner.consume(pairChunk([5e9, 4e9], 12), 12)).toEqual([]);
  });
});
