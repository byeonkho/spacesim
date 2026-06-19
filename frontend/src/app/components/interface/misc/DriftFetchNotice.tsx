"use client";

import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  selectOverlayEnabled,
  selectUserGroundTruthFetchInFlight,
} from "@/app/store/slices/GroundTruthSlice";
import {
  COLD_START_COPY,
  COLD_START_MS,
  LOADING_COPY,
  minDisplayRemainingMs,
} from "@/app/utils/driftFetchNotice";

// Bottom-center notice for a drift-data load. It appears the instant a
// user-initiated fetch is in flight (toggling Drift, switching the focused
// body) so the action never feels like nothing happened, then escalates its
// copy once the wait is long enough to mean the cold path (the backend waking
// from sleep, up to ~20 s). A min-display hold keeps a fast warm fetch (well
// under a second) from flashing it as a sub-second blink. It deliberately
// ignores the automatic background top-up refetches during playback, which
// would otherwise blink it on a steady interval; failures of those surface
// only when the user is actively waiting (see fetchGroundTruth).
const DriftFetchNotice: React.FC = () => {
  const enabled = useSelector(selectOverlayEnabled);
  const fetching = useSelector(selectUserGroundTruthFetchInFlight);
  const pending = enabled && fetching;

  const [visible, setVisible] = useState(false);
  const [cold, setCold] = useState(false);
  // When the notice most recently became visible, for the min-display hold.
  const shownAtRef = useRef(0);

  // Show immediately on the rising edge (loading tier). Guarded set-state in
  // render (not in an effect body) to satisfy the repo's set-state-in-effect
  // lint rule; the overlay starts disabled, so pending is always false at mount
  // and the first toggle is a real transition. The falling edge is handled by
  // the effect below, which needs a timer for the min-display hold.
  const [prevPending, setPrevPending] = useState(pending);
  if (prevPending !== pending) {
    setPrevPending(pending);
    if (pending) {
      setVisible(true);
      setCold(false);
    }
  }

  useEffect(() => {
    if (pending) {
      // Anchor the min-display window and arm the cold-start escalation.
      shownAtRef.current = Date.now();
      const id = window.setTimeout(() => setCold(true), COLD_START_MS);
      return () => window.clearTimeout(id);
    }
    // Settled: hold the notice for the remainder of the min-display window,
    // then hide. remaining is 0 once the window has elapsed (the common case
    // for any non-trivial fetch), so the notice hides on the next tick.
    const remaining = minDisplayRemainingMs(shownAtRef.current, Date.now());
    const id = window.setTimeout(() => {
      setVisible(false);
      setCold(false);
    }, remaining);
    return () => window.clearTimeout(id);
  }, [pending]);

  if (!visible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="text-hi pointer-events-none fixed left-1/2 z-50 flex -translate-x-1/2 items-center gap-2.5 rounded-md border border-white/[0.08] px-4 py-2.5 text-sm shadow-lg"
      style={{
        background: "rgba(10, 12, 20, 0.96)",
        bottom: "calc(env(safe-area-inset-bottom, 0px) + 1.5rem)",
      }}
    >
      <span className="animate-pulse text-accent">●</span>
      <span>{cold ? COLD_START_COPY : LOADING_COPY}</span>
    </div>
  );
};

export default DriftFetchNotice;
