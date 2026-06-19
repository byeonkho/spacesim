// Copy and timing for the drift-fetch loading notice. The notice appears the
// instant a ground-truth fetch starts (so a toggle never feels like nothing
// happened), then escalates its copy once the wait is long enough to mean the
// backend is waking from sleep.

// Pending this long (ms) and the wait is the cold path (the backend waking from
// sleep, up to ~20 s), so swap in the slow-load explanation. Warm fetches
// answer well under this and never escalate past the loading line.
export const COLD_START_MS = 2000;

// Once shown, keep the notice up at least this long (ms) even if the fetch
// settles sooner, so a fast warm fetch reads as a brief loading state instead
// of a sub-second blink. Shorter than COLD_START_MS, so a held notice is always
// still in the loading tier (the hold only ever covers a fast fetch).
export const MIN_VISIBLE_MS = 600;

export const LOADING_COPY = "Loading real-world positions.";

export const COLD_START_COPY = `${LOADING_COPY} The first load can take a few moments while the simulator wakes up.`;

// Remaining min-display time (ms) for a notice shown at shownAtMs, evaluated at
// nowMs. Zero once the window has elapsed (clamped, never negative). Pure: the
// component feeds it Date.now() so the timing stays unit-testable.
export function minDisplayRemainingMs(shownAtMs: number, nowMs: number): number {
  return Math.max(0, MIN_VISIBLE_MS - (nowMs - shownAtMs));
}
