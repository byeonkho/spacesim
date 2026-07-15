import { describe, expect, it } from "vitest";
import type { LogEvent } from "@/app/store/slices/EventLogSlice";
import { eventSeekLocalIndex } from "./EventLogCard";

const event = (timeIndex?: number): LogEvent => ({
  id: 1,
  ts: 100,
  source: "SIM",
  severity: "info",
  message: "Mars is nearest the Sun",
  timeIndex,
});

describe("eventSeekLocalIndex", () => {
  it("returns a rounded local index for a retained event", () => {
    expect(eventSeekLocalIndex(event(12.4), 10, 5)).toBe(2);
  });

  it("returns null when history has no current-run target", () => {
    expect(eventSeekLocalIndex(event(undefined), 10, 5)).toBeNull();
  });

  it("returns null when the target is outside the retained window", () => {
    expect(eventSeekLocalIndex(event(9), 10, 5)).toBeNull();
    expect(eventSeekLocalIndex(event(15), 10, 5)).toBeNull();
  });
});
