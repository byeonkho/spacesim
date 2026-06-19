import {
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import styles from "./InfoTooltip.module.css";

// Stable subscribe for useSyncExternalStore: never re-fires. The hook's only
// job here is to defer "we have document.body" to client render, so the portal
// target exists without writing state in an effect.
const noopSubscribe = () => () => {};

export interface InfoTooltipProps {
  /** Screen-reader label for the icon button. */
  label: string;
  /** Tooltip body (text or rich content). */
  children: ReactNode;
  /** Open direction. Default "above". */
  placement?: "above" | "below";
}

/**
 * Info-icon button with a hover/focus tooltip. The body renders through a
 * portal into document.body so it escapes every ancestor's stacking context,
 * overflow:hidden, and backdrop-filter. Position is computed from the icon
 * button's bounding rect once the tooltip becomes visible and clamped into
 * the viewport. Visibility is opacity-only; pointer-events stay off the body.
 */
export function InfoTooltip({
  label,
  children,
  placement = "above",
}: InfoTooltipProps) {
  const tooltipId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState<{ left: number; top: number } | null>(
    null,
  );

  // Portal target = document.body, only available client-side. Returns false
  // on the server and true post-hydration, gating createPortal without a
  // state-write-in-effect.
  const mounted = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );

  useEffect(() => {
    if (!open || !buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const tooltipWidth = 256;
    const gap = 8;
    const margin = 8;
    const rawLeft = rect.left + rect.width / 2 - tooltipWidth / 2;
    const left = Math.max(
      margin,
      Math.min(rawLeft, window.innerWidth - tooltipWidth - margin),
    );
    setCoords({
      left,
      top: placement === "below" ? rect.bottom + gap : rect.top - gap,
    });
  }, [open, placement]);

  return (
    <span className={styles.wrap}>
      <button
        ref={buttonRef}
        type="button"
        aria-label={label}
        aria-describedby={open ? tooltipId : undefined}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        className={styles.trigger}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          className={styles.icon}
          aria-hidden="true"
        >
          <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm0 1.5a5.5 5.5 0 110 11 5.5 5.5 0 010-11zM7 6.5a1 1 0 112 0v4.5a1 1 0 11-2 0V6.5zM8 3.75a1 1 0 100 2 1 1 0 000-2z" />
        </svg>
      </button>
      {mounted &&
        coords &&
        createPortal(
          <div
            id={tooltipId}
            role="tooltip"
            className={styles.tooltip}
            style={{
              left: coords.left,
              top: coords.top,
              opacity: open ? 1 : 0,
              transform: placement === "above" ? "translateY(-100%)" : "none",
            }}
          >
            {children}
          </div>,
          document.body,
        )}
    </span>
  );
}
