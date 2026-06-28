"use client";

import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "@/app/store/Store";
import {
  togglePause,
  setSpeedMultiplier,
  setCurrentTimeStepIndex,
  selectIsPaused,
  selectSpeedMultiplier,
  selectTotalTimeSteps,
  selectCurrentTimeStepIndex,
} from "@/app/store/slices/SimulationSlice";
import { formatSpeed } from "@/app/utils/formatSpeed";
import { ScrubberMarkers } from "@/app/components/chrome/ScrubberMarkers";

const clamp = (v: number, lo: number, hi: number) =>
  Math.max(lo, Math.min(hi, v));

export function MobileTransportBar() {
  const dispatch = useDispatch<AppDispatch>();
  const isPaused = useSelector(selectIsPaused);
  const speed = useSelector(selectSpeedMultiplier);
  const total = useSelector(selectTotalTimeSteps);
  const idx = useSelector(selectCurrentTimeStepIndex);
  const trackRef = useRef<HTMLDivElement>(null);

  const progress = total > 1 ? idx / (total - 1) : 0;

  const seek = (clientX: number) => {
    if (!trackRef.current || total <= 1) return;
    const rect = trackRef.current.getBoundingClientRect();
    const ratio = clamp((clientX - rect.left) / rect.width, 0, 1);
    dispatch(setCurrentTimeStepIndex(Math.round(ratio * (total - 1))));
  };

  return (
    <div className="flex flex-col gap-2.5 px-4 py-2.5">
      {/* Scrubber gets its own full-width row so the drag target spans the
          whole bar instead of fighting the transport buttons for space. */}
      <div
        ref={trackRef}
        className="relative h-8 w-full cursor-pointer touch-none"
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          seek(e.clientX);
        }}
        onPointerMove={(e) => {
          if (e.buttons & 1) seek(e.clientX);
        }}
      >
        <div className="absolute top-1/2 h-1 w-full -translate-y-1/2 rounded bg-white/[0.08]" />
        <div
          className="absolute top-1/2 h-1 -translate-y-1/2 rounded"
          style={{
            width: `${progress * 100}%`,
            background:
              "linear-gradient(90deg, rgba(164,168,255,0.25), var(--color-accent))",
          }}
        />
        <div
          className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
          style={{
            left: `${progress * 100}%`,
            boxShadow: "0 0 0 3px rgba(164,168,255,0.45), 0 2px 8px rgba(0,0,0,0.4)",
          }}
        />
        <ScrubberMarkers />
      </div>
      {/* The buttons are centered as their own group so the play button always
          lands dead-center of the bar, independent of the speed readout. The
          speed floats just past the last button (absolute, out of the centering
          flow) so it sits beside the controls without shifting them off-center. */}
      <div className="flex items-center justify-center">
        <div className="relative flex items-center gap-3">
          <button
            aria-label="slow down"
            className="grid h-11 w-11 place-items-center rounded-full border border-white/[0.06] text-dim transition-colors hover:bg-white/[0.04] hover:text-hi"
            onClick={() => dispatch(setSpeedMultiplier("decrease"))}
          >
            &#8810;
          </button>
          <button
            aria-label={isPaused ? "play" : "pause"}
            className="grid h-12 w-12 place-items-center rounded-full bg-accent text-bg"
            onClick={() => dispatch(togglePause())}
          >
            {isPaused ? "▶" : "❚❚"}
          </button>
          <button
            aria-label="speed up"
            className="grid h-11 w-11 place-items-center rounded-full border border-white/[0.06] text-dim transition-colors hover:bg-white/[0.04] hover:text-hi"
            onClick={() => dispatch(setSpeedMultiplier("increase"))}
          >
            &#8811;
          </button>
          <span className="absolute left-full top-1/2 ml-3 -translate-y-1/2 text-xs whitespace-nowrap">
            <span className="tabular font-mono text-hi">{formatSpeed(speed)}</span>
            <span className="text-dim">&#215;</span>
          </span>
        </div>
      </div>
    </div>
  );
}
