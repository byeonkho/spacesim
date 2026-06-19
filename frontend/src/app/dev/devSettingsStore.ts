"use client";

import { useSyncExternalStore } from "react";
import { AUTO_ORBIT_IDLE_MS, AUTO_ORBIT_SPEED } from "@/app/utils/autoOrbit";

/**
 * Dev-only tunables exposed to the floating <DevToolbar />. Lives outside
 * Redux because (a) it's not part of the simulation domain model, (b) we
 * don't want it persisted to URL/serialised state, and (c) some consumers
 * read these values from event handlers (no Provider plumbing).
 *
 * Module-level state + useSyncExternalStore: components subscribe with
 * useDevSettings(), event handlers read with getDevSettings().
 */

export interface DevSettings {
  /**
   * Multiplier on wheel deltaY for tracking-zoom updates.
   * Camera wheel handler: trackingZoomRef *= 1 + deltaY * zoomSensitivity.
   */
  zoomSensitivity: number;
  /** OrbitControls dampingFactor — smaller = more damping. */
  orbitDampingFactor: number;
  /**
   * Seconds of no user input before the cinematic auto-orbit begins. See
   * autoOrbit.ts. Canonical default is AUTO_ORBIT_IDLE_MS / 1000.
   */
  autoOrbitIdleSeconds: number;
  /**
   * OrbitControls autoRotateSpeed target for the cinematic auto-orbit once
   * fully ramped. three.js default is 2.0; we run slower. Canonical default
   * is AUTO_ORBIT_SPEED.
   */
  autoOrbitSpeed: number;
  /**
   * Per-frame lerp factor used in body-tracking mode for the radial
   * (zoom) component of the camera position. Higher = snappier zoom
   * response. Decoupled from tangential smoothing so body transitions
   * stay buttery while zoom stays responsive.
   */
  cameraZoomLerpRate: number;
  /**
   * Number of trailing snapshot points each body's Trail renders.
   * Hard-capped at MAX_TRAIL_POINTS in Trail.tsx — buffer geometry is
   * allocated once at that size and the slider just changes how many
   * points get drawn, so dragging is allocation-free.
   */
  trailLength: number;
  /**
   * Log preset: overall stretch multiplier on the log curve. Bigger A =
   * larger system in world space; ratios between planet positions are
   * unchanged. See worldDistance() in scalePipeline.ts.
   */
  logScaleA: number;
  /**
   * Log preset: anchor distance (metres) for log1p. Sets where the
   * curve transitions from linear-ish (r << r_ref) to logarithmic
   * (r >> r_ref). Default is 1 AU; smaller values compress outer
   * planets more aggressively.
   */
  logScaleRRef: number;
  /**
   * Log preset: power-law exponent for body-radius compression.
   * `(R / 1e8) ^ k`. k = 1 collapses to linear (real ratios, tiny inner
   * planets); k = 0.5 is sqrt (pleasant compression — Sun stays dominant
   * but Moon / Mercury remain visibly distinct from Earth).
   * Realistic preset ignores this.
   */
  logRadiusExponent: number;
  /**
   * Log preset: minimum world-radius for any body, applied AFTER the
   * power-law compression. Without a floor, the smallest named NEAs
   * (Apophis 185 m, Bennu 245 m, Ryugu 435 m) render at ~0.001–0.002 wu
   * — sub-pixel at any zoom. Default 0.02 wu lifts those four to a barely
   * visible dot while leaving Moon (0.13 wu), Pluto (0.11 wu), the dwarf
   * planets (0.05–0.07 wu), and everything larger fully unaffected.
   * Set to 0 to disable. Realistic preset ignores this.
   */
  logMinRadius: number;
}

const DEFAULTS: DevSettings = {
  zoomSensitivity: 0.001,
  orbitDampingFactor: 0.01,
  autoOrbitIdleSeconds: AUTO_ORBIT_IDLE_MS / 1000,
  autoOrbitSpeed: AUTO_ORBIT_SPEED,
  cameraZoomLerpRate: 0.1,
  trailLength: 1000,
  logScaleA: 60,
  logScaleRRef: 149_597_870_700,
  logRadiusExponent: 0.5,
  logMinRadius: 0.02,
};

let state: DevSettings = { ...DEFAULTS };
const listeners = new Set<() => void>();

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

const getSnapshot = (): DevSettings => state;

/** Read current settings from outside React (event handlers, refs). */
export const getDevSettings = (): DevSettings => state;

/** Imperative setter — notifies all subscribed components. */
export const setDevSetting = <K extends keyof DevSettings>(
  key: K,
  value: DevSettings[K],
): void => {
  state = { ...state, [key]: value };
  listeners.forEach((l) => l());
};

/** React hook — subscribes to changes, no Provider required. */
export const useDevSettings = (): DevSettings =>
  useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
