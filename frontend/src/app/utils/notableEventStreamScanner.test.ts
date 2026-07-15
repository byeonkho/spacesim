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
