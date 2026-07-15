import { describe, expect, it } from "vitest";

import { bodyProperties } from "./SimConstants";

describe("minor-body texture mappings", () => {
  it("keeps the restored minor-body maps instead of the generic fallback", () => {
    for (const body of ["PLUTO", "CERES", "VESTA", "EROS", "BENNU"]) {
      expect(bodyProperties[body].texture).not.toBe(
        bodyProperties.FALLBACK.texture,
      );
    }
  });
});
