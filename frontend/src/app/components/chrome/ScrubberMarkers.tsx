"use client";

import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectDetectedEvents } from "@/app/store/slices/NotableEventsSlice";
import {
  selectActiveBodyName,
  selectBufferStartTimestep,
  selectTotalTimeSteps,
  setCurrentTimeStepIndex,
} from "@/app/store/slices/SimulationSlice";
import { layoutMarkers } from "@/app/utils/markerLayout";

// Shared marker overlay for the desktop and mobile scrubbers. Absolutely fills
// its parent track; positions are a fraction of the measured track width.
// Markers involving the active body are accented; clicking seeks the playhead.
export function ScrubberMarkers() {
  const dispatch = useDispatch();
  const events = useSelector(selectDetectedEvents);
  const bufferStart = useSelector(selectBufferStartTimestep);
  const total = useSelector(selectTotalTimeSteps);
  const activeBody = useSelector(selectActiveBodyName);

  const wrapRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      setWidth(entries[0].contentRect.width);
    });
    ro.observe(el);
    setWidth(el.getBoundingClientRect().width);
    return () => ro.disconnect();
  }, []);

  const clusters =
    width > 0 ? layoutMarkers(events, bufferStart, total, width) : [];

  const seekTo = (timeIndex: number) => {
    const local = timeIndex - bufferStart;
    if (local < 0 || local > total - 1) return;
    dispatch(setCurrentTimeStepIndex(Math.round(local)));
  };

  return (
    <div
      ref={wrapRef}
      className="pointer-events-none absolute inset-0"
      aria-hidden={clusters.length === 0}
    >
      {clusters.map((c) => {
        const first = c.events[0];
        const involvesActive =
          activeBody != null &&
          c.events.some((e) =>
            e.bodies.some((b) => b.toUpperCase() === activeBody.toUpperCase()),
          );
        const accent = involvesActive || activeBody == null;
        const label =
          c.events.length > 1
            ? `${c.events.length} events. ${first.message}`
            : first.message;
        return (
          <button
            key={first.id}
            type="button"
            onClick={() => seekTo(first.timeIndex)}
            title={label}
            aria-label={label}
            className="pointer-events-auto absolute -translate-x-1/2"
            style={{ left: `${c.leftPct}%`, top: "-2px" }}
          >
            <span
              className={[
                "block rounded-full transition-opacity",
                c.events.length > 1 ? "h-2 w-2" : "h-1.5 w-1.5",
                first.severity === "warn"
                  ? "bg-amber"
                  : "bg-accent",
                accent ? "opacity-90" : "opacity-30",
              ].join(" ")}
              style={{
                boxShadow:
                  accent && first.severity === "warn"
                    ? "0 0 6px var(--color-amber)"
                    : undefined,
              }}
            />
          </button>
        );
      })}
    </div>
  );
}
