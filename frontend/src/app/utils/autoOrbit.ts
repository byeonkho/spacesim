// Pure decision logic for the cinematic auto-orbit camera. After a stretch of
// no user input the camera slowly orbits whatever it is looking at; any input
// resets the idle clock. Extracted for unit-testability, same split as
// playbackGate.ts: this file is pure, the DOM/three.js glue lives in Camera.tsx.

// Idle stretch before the orbit begins. Exposed as a dev tunable (seconds) via
// devSettingsStore; this is the canonical default.
export const AUTO_ORBIT_IDLE_MS = 30_000;

// OrbitControls autoRotateSpeed once fully ramped. three.js default is 2.0; a
// cinematic drift wants much slower. Canonical default for the dev tunable.
export const AUTO_ORBIT_SPEED = 0.4;

// Ease-in window: speed ramps 0 -> target over this long after idle begins, so
// the orbit starts imperceptibly rather than snapping into motion.
export const AUTO_ORBIT_RAMP_MS = 1_500;

export interface AutoOrbitInput {
  now: number; // performance.now()
  lastActivityAt: number; // performance.now() of the last user input
  idleMs: number; // idle threshold before orbiting
  rampMs: number; // ease-in duration
  targetSpeed: number; // fully-ramped autoRotateSpeed
}

// Returns the autoRotateSpeed to apply this frame. 0 means "not orbiting".
// Once idle past idleMs, ramps linearly from 0 to targetSpeed over rampMs,
// then holds targetSpeed.
export function autoOrbitSpeed(input: AutoOrbitInput): number {
  const { now, lastActivityAt, idleMs, rampMs, targetSpeed } = input;
  const idleFor = now - lastActivityAt;
  if (idleFor < idleMs) return 0;
  const intoRamp = idleFor - idleMs;
  if (intoRamp >= rampMs) return targetSpeed;
  return targetSpeed * (intoRamp / rampMs);
}
