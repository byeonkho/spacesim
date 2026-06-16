import { describe, expect, it } from "vitest";
import {
  AUTO_ORBIT_IDLE_MS,
  AUTO_ORBIT_RAMP_MS,
  AUTO_ORBIT_SPEED,
  autoOrbitSpeed,
} from "./autoOrbit";

const base = {
  idleMs: AUTO_ORBIT_IDLE_MS,
  rampMs: AUTO_ORBIT_RAMP_MS,
  targetSpeed: AUTO_ORBIT_SPEED,
};

describe("autoOrbitSpeed", () => {
  it("returns 0 while activity is recent (below the idle threshold)", () => {
    expect(autoOrbitSpeed({ now: 10_000, lastActivityAt: 0, ...base })).toBe(0);
  });

  it("returns 0 at the exact instant the idle threshold is reached", () => {
    expect(
      autoOrbitSpeed({ now: AUTO_ORBIT_IDLE_MS, lastActivityAt: 0, ...base }),
    ).toBe(0);
  });

  it("ramps linearly partway through the ease-in window", () => {
    const now = AUTO_ORBIT_IDLE_MS + AUTO_ORBIT_RAMP_MS / 2;
    expect(autoOrbitSpeed({ now, lastActivityAt: 0, ...base })).toBeCloseTo(
      AUTO_ORBIT_SPEED / 2,
      5,
    );
  });

  it("caps at target speed once the ramp has fully elapsed", () => {
    const now = AUTO_ORBIT_IDLE_MS + AUTO_ORBIT_RAMP_MS + 5_000;
    expect(autoOrbitSpeed({ now, lastActivityAt: 0, ...base })).toBe(
      AUTO_ORBIT_SPEED,
    );
  });

  it("returns to 0 after fresh activity resets the timer", () => {
    expect(
      autoOrbitSpeed({ now: 100_000, lastActivityAt: 99_000, ...base }),
    ).toBe(0);
  });
});
