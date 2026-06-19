import { describe, expect, it } from "vitest";
import {
  COLD_START_COPY,
  COLD_START_MS,
  LOADING_COPY,
  MIN_VISIBLE_MS,
  minDisplayRemainingMs,
} from "@/app/utils/driftFetchNotice";

describe("driftFetchNotice timing", () => {
  it("holds for the full min-display window when shown just now", () => {
    expect(minDisplayRemainingMs(1000, 1000)).toBe(MIN_VISIBLE_MS);
  });

  it("returns the remaining window partway through", () => {
    expect(minDisplayRemainingMs(1000, 1000 + 200)).toBe(MIN_VISIBLE_MS - 200);
  });

  it("returns zero once the window has elapsed", () => {
    expect(minDisplayRemainingMs(1000, 1000 + MIN_VISIBLE_MS)).toBe(0);
  });

  it("clamps to zero (never negative) long after the window", () => {
    expect(minDisplayRemainingMs(1000, 1000 + 60_000)).toBe(0);
  });

  // The min-display hold only ever covers a fast warm fetch, so a held notice
  // is always still in the loading tier. That holds only while the hold window
  // is shorter than the cold-start escalation; pin the invariant here.
  it("keeps the min-display window shorter than cold-start escalation", () => {
    expect(MIN_VISIBLE_MS).toBeLessThan(COLD_START_MS);
  });
});

describe("driftFetchNotice copy", () => {
  it("escalates by appending to the loading line (shared prefix)", () => {
    expect(COLD_START_COPY.startsWith(LOADING_COPY)).toBe(true);
    expect(COLD_START_COPY.length).toBeGreaterThan(LOADING_COPY.length);
  });

  it("uses no em-dashes in user-facing copy", () => {
    // U+2014 em-dash, built from its code point so this guard file itself stays em-dash-free.
    const emDash = String.fromCharCode(0x2014);
    expect(LOADING_COPY).not.toContain(emDash);
    expect(COLD_START_COPY).not.toContain(emDash);
  });
});
