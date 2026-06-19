import {
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import styles from "./Popover.module.css";

const noopSubscribe = () => () => {};

export interface PopoverProps {
  /** Content of the clickable trigger (wrapped in a button). */
  trigger: ReactNode;
  /** Popover body. */
  children: ReactNode;
  /** Open direction. Default "below". */
  placement?: "above" | "below";
}

/**
 * Anchored popover. The body renders through a portal into document.body so it
 * escapes overflow and stacking contexts, positioned from the trigger rect and
 * clamped into the viewport. Dismisses on Escape and outside-click, restoring
 * focus to the trigger.
 */
export function Popover({ trigger, children, placement = "below" }: PopoverProps) {
  const id = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState<{ left: number; top: number } | null>(
    null,
  );

  const mounted = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );

  useEffect(() => {
    if (!open || !triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const width = 240;
    const gap = 8;
    const margin = 8;
    const rawLeft = rect.left + rect.width / 2 - width / 2;
    const left = Math.max(
      margin,
      Math.min(rawLeft, window.innerWidth - width - margin),
    );
    setCoords({
      left,
      top: placement === "below" ? rect.bottom + gap : rect.top - gap,
    });
  }, [open, placement]);

  useEffect(() => {
    if (!open) return;
    const close = () => {
      setOpen(false);
      triggerRef.current?.focus();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (contentRef.current?.contains(t) || triggerRef.current?.contains(t)) {
        return;
      }
      setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDown);
    };
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? id : undefined}
        onClick={() => setOpen((o) => !o)}
        className={styles.trigger}
      >
        {trigger}
      </button>
      {mounted &&
        open &&
        coords &&
        createPortal(
          <div
            ref={contentRef}
            id={id}
            role="dialog"
            className={styles.content}
            style={{
              left: coords.left,
              top: coords.top,
              transform: placement === "above" ? "translateY(-100%)" : "none",
            }}
          >
            {children}
          </div>,
          document.body,
        )}
    </>
  );
}
