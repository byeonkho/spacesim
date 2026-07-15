// Step definitions + copy for the first-timer intro tour. Pure data so the
// TourSlice can import phase lengths for stepIndex clamping without pulling
// in the DOM. Copy is the source of truth for these UI strings — plain
// English, no jargon, no em-dashes (presentation-layer rule).

export interface TourStep {
  id: string;
  /** data-tour value of the element to spotlight; null = centered card. */
  target: string | null;
  placement: "above" | "below" | "center";
  eyebrow: string;
  copy: string;
}

// Landing steps shown before the visitor starts or accepts a simulation.
export const PHASE1_STEPS: readonly TourStep[] = [
  {
    id: "welcome",
    target: null,
    placement: "center",
    eyebrow: "Welcome",
    copy:
      "Welcome to nbodysim. Explore a ready-made solar system instantly, or " +
      "build your own and let the simulator calculate how the worlds move " +
      "under gravity. Here's the 30-second tour.",
  },
  {
    id: "sim-setup",
    target: "sim-setup",
    placement: "below",
    eyebrow: "Getting started",
    copy:
      "This is mission control. Open it to assemble your own solar system, " +
      "then press Run.",
  },
];

// Playback steps shown after the first chunk reaches the scene.
export const PHASE2_STEPS: readonly TourStep[] = [
  {
    id: "timeline",
    target: "timeline",
    placement: "above",
    eyebrow: "Getting started",
    copy:
      "Your time machine. Scrub through the motion, or fast-forward " +
      "centuries in seconds.",
  },
  {
    id: "body-selector",
    target: "body-selector",
    placement: "below",
    eyebrow: "Getting started",
    copy: "Click any body to lock the camera onto it and follow it around.",
  },
  {
    id: "info-card",
    target: "info-card",
    placement: "below",
    eyebrow: "Getting started",
    copy:
      "Live telemetry for whatever you've selected: where it is, how fast " +
      "it's moving, the shape of its orbit, and how faithfully the " +
      "simulation keeps the physics honest.",
  },
  {
    id: "frame-compass",
    target: "frame-compass",
    placement: "below",
    eyebrow: "Getting started",
    copy:
      "Choose what sits still at the center. Keep the Sun pinned and the " +
      "planets loop around it, or pin Earth instead and watch the Sun and " +
      "Mars trace the strange backward loops that puzzled astronomers for " +
      "centuries.",
  },
  {
    id: "done",
    target: null,
    placement: "center",
    eyebrow: "All set",
    copy:
      "That's the tour. You can replay it anytime from the question mark up " +
      "top.",
  },
];
