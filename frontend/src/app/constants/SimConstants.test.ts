import { describe, expect, it } from "vitest";

import { bodyProperties } from "./SimConstants";

describe("minor-body texture provenance fallbacks", () => {
  it("uses the project-authored fallback for blocked minor-body mosaics", () => {
    expect(bodyProperties.PLUTO.texture).toBe(bodyProperties.FALLBACK.texture);
    expect(bodyProperties.VESTA.texture).toBe(bodyProperties.FALLBACK.texture);
    expect(bodyProperties.EROS.texture).toBe(bodyProperties.FALLBACK.texture);
    expect(bodyProperties.BENNU.texture).toBe(bodyProperties.FALLBACK.texture);
  });

  it("keeps Ceres on its dedicated sourced mosaic", () => {
    expect(bodyProperties.CERES.texture).not.toBe(
      bodyProperties.FALLBACK.texture,
    );
  });
});
