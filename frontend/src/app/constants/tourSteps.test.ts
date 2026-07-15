import { describe, expect, it } from "vitest";
import { MOBILE_TOUR_STEPS } from "./mobileTourSteps";
import { PHASE1_STEPS } from "./tourSteps";

describe("tour welcome copy", () => {
  it("distinguishes instant presets from custom simulations", () => {
    const welcome = PHASE1_STEPS.find((step) => step.id === "welcome");

    expect(welcome?.copy).toContain("ready-made solar system");
    expect(welcome?.copy).toContain("build your own");
    expect(welcome?.copy).toContain("calculate");
    expect(welcome?.copy).not.toMatch(/computed live|pre-baked/i);
  });
});

describe("mobile tour welcome copy", () => {
  it("distinguishes instant presets from custom simulations", () => {
    const welcome = MOBILE_TOUR_STEPS.find((step) => step.id === "welcome");

    expect(welcome?.copy).toContain("ready-made solar system");
    expect(welcome?.copy).toContain("build your own");
    expect(welcome?.copy).toContain("calculate");
    expect(welcome?.copy).not.toMatch(/worked out live|pre-baked/i);
  });
});
