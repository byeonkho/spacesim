import { describe, it, expect } from "vitest";
import { findLocalExtrema } from "./eventScanner";

describe("findLocalExtrema", () => {
  it("finds an interior minimum and maximum", () => {
    // v-shape then peak: indices 0..6
    const v = [5, 3, 1, 4, 9, 6, 2];
    const { minima, maxima } = findLocalExtrema(v, 0, v.length - 1);
    expect(minima).toEqual([2]); // value 1
    expect(maxima).toEqual([4]); // value 9
  });

  it("ignores the endpoints (no extremum can be confirmed there)", () => {
    const v = [1, 2, 3];
    const { minima, maxima } = findLocalExtrema(v, 0, v.length - 1);
    expect(minima).toEqual([]);
    expect(maxima).toEqual([]);
  });

  it("respects the [from,to] window", () => {
    const v = [9, 1, 9, 1, 9];
    const { minima } = findLocalExtrema(v, 2, 4);
    expect(minima).toEqual([3]); // only the dip inside the window
  });

  it("treats flat runs as non-extrema (strict turns only)", () => {
    const v = [3, 1, 1, 1, 3];
    const { minima } = findLocalExtrema(v, 0, v.length - 1);
    expect(minima).toEqual([]); // no strict v
  });
});
