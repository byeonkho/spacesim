"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

// Stable subscribe for useSyncExternalStore — never re-fires. Used only to
// defer client-only reads (document.body availability, the reduced-motion
// media query) to client render without a set-state-in-effect.
const noopSubscribe = () => () => {};

const PANEL_WIDTH = 336;
const GAP = 8; // px between the trigger and the panel
const MARGIN = 8; // min px from the viewport edge
const FADE_MS = 150;

const GITHUB_URL = "https://github.com/byeonkho/nbodysim";
const ISSUES_URL = "https://github.com/byeonkho/nbodysim/issues/new";
// Branded contact address — set up a Cloudflare Email Routing rule forwarding
// this to the real inbox. Swap the string here if the address changes.
const CONTACT_EMAIL = "contact@nbodysim.com";

const chevronRight = (
  <svg
    className="text-subdim ml-auto shrink-0 transition-colors group-hover:text-dim"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="m9 18 6-6-6-6" />
  </svg>
);

/** Generic git-branch glyph (two nodes + connector) — deliberately NOT the
 *  GitHub octocat, which is trademarked. */
const gitBranchIcon = (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <line x1="6" y1="3" x2="6" y2="15" />
    <circle cx="18" cy="6" r="3" />
    <circle cx="6" cy="18" r="3" />
    <path d="M18 9a9 9 0 0 1-9 9" />
  </svg>
);

const bugIcon = (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="m8 2 1.88 1.88" />
    <path d="M14.12 3.88 16 2" />
    <path d="M9 7.13v-1a3.003 3.003 0 1 1 6 0v1" />
    <path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6" />
    <path d="M12 20v-9" />
    <path d="M6.53 9C4.6 8.8 3 7.1 3 5" />
    <path d="M6 13H2" />
    <path d="M3 21c0-2.1 1.7-3.9 3.8-4" />
    <path d="M20.97 5c0 2.1-1.6 3.8-3.5 4" />
    <path d="M22 13h-4" />
    <path d="M17.2 17c2.1.1 3.8 1.9 3.8 4" />
  </svg>
);

const mailIcon = (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

function LinkRow({
  href,
  external,
  label,
  sub,
  icon,
  variant,
}: {
  href: string;
  external: boolean;
  label: string;
  sub: string;
  icon: React.ReactNode;
  variant: "accent" | "neutral";
}) {
  const accent = variant === "accent";
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      className={`group flex items-center gap-[13px] rounded-[10px] border p-[11px_13px] transition-colors ${
        accent
          ? "border-accent/[0.22] bg-accent/[0.08] hover:bg-accent/[0.12]"
          : "border-white/[0.06] bg-white/[0.03] hover:bg-white/[0.05]"
      }`}
    >
      <span
        className={`flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[9px] ${
          accent ? "bg-accent/[0.14] text-accent" : "bg-white/[0.05] text-dim"
        }`}
      >
        {icon}
      </span>
      <span className="flex min-w-0 flex-col">
        <span className="text-hi text-[12.5px] font-medium leading-tight">
          {label}
        </span>
        <span className="text-dim mt-0.5 truncate font-mono text-[10px] leading-tight">
          {sub}
        </span>
      </span>
      {chevronRight}
    </a>
  );
}

/**
 * Anchored "About" popover (not a modal). Mirrors InfoTooltip's portal
 * strategy: the panel renders into document.body so it escapes the top
 * strip's overflow:hidden, backdrop-filter, and stacking context. Position
 * is measured from the trigger button's bounding rect — opened below it and
 * right-aligned so the panel's right edge tracks the button's right edge.
 *
 * Open/close state is owned by the parent (TopStatusStrip, local useState).
 * This component handles measurement, the opacity fade, Escape + outside
 * mousedown dismissal, and focus management (focus the panel on open, return
 * focus to the trigger on close).
 */
export function AboutPopover({
  open,
  anchorRef,
  onClose,
}: {
  open: boolean;
  anchorRef: React.RefObject<HTMLButtonElement | null>;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState<{ left: number; top: number } | null>(
    null,
  );
  // `present` = portal is in the DOM (kept alive through the close fade).
  // `shown` = opacity target. The two split so the close fade can play out
  // before unmount; on unmount the dialog leaves the a11y tree.
  const [present, setPresent] = useState(false);
  const [shown, setShown] = useState(false);

  // Portal target = document.body, client only (same idiom as InfoTooltip).
  const mounted = useSyncExternalStore(noopSubscribe, () => true, () => false);

  // Read prefers-reduced-motion once. A live media-query listener is overkill
  // for a setting users rarely toggle mid-session; SSR returns false.
  const reduceMotion = useSyncExternalStore(
    noopSubscribe,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );

  // Right-aligned to the trigger, opened below it, clamped into the viewport.
  const measure = useCallback(() => {
    const rect = anchorRef.current?.getBoundingClientRect();
    if (!rect) return;
    const rawLeft = rect.right - PANEL_WIDTH;
    const left = Math.max(
      MARGIN,
      Math.min(rawLeft, window.innerWidth - PANEL_WIDTH - MARGIN),
    );
    setCoords({ left, top: rect.bottom + GAP });
  }, [anchorRef]);

  // Open → mount the portal. The flip is deferred into a rAF callback: a
  // synchronous constant setState in an effect body trips
  // react-hooks/set-state-in-effect, and deferring it is harmless for a
  // click-triggered surface.
  useEffect(() => {
    if (!open) return;
    const raf = requestAnimationFrame(() => setPresent(true));
    return () => cancelAnimationFrame(raf);
  }, [open]);

  // Once mounted (and still open), measure and fade in on the next frame so
  // the panel is committed at opacity 0 before the transition flips it on.
  useEffect(() => {
    if (!present || !open) return;
    measure();
    const raf = requestAnimationFrame(() => setShown(true));
    return () => cancelAnimationFrame(raf);
  }, [present, open, measure]);

  // Close → fade out, then unmount after the transition (reduced motion skips
  // the wait). Both flips are deferred for the same lint reason as above.
  useEffect(() => {
    if (open) return;
    const raf = requestAnimationFrame(() => setShown(false));
    const t = window.setTimeout(
      () => setPresent(false),
      reduceMotion ? 0 : FADE_MS,
    );
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(t);
    };
  }, [open, reduceMotion]);

  // Keep anchored to the (fixed) strip button across viewport resizes.
  useEffect(() => {
    if (!open) return;
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [open, measure]);

  // Escape + outside-mousedown dismissal. mousedown (per spec) fires before
  // the click that would otherwise re-toggle the popover via the trigger, so
  // clicks on the trigger are ignored here and left to its own onClick.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const onDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (panelRef.current?.contains(target)) return;
      if (anchorRef.current?.contains(target)) return;
      onClose();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDown);
    };
  }, [open, onClose, anchorRef]);

  // Capture whatever had focus when the popover opened (the trigger) and
  // restore it on close. Declared before the focus-into-panel effect so it
  // captures the trigger, not the panel.
  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    return () => previouslyFocused?.focus?.();
  }, [open]);

  // Move focus into the panel once it has mounted.
  useEffect(() => {
    if (open && present) panelRef.current?.focus();
  }, [open, present]);

  if (!mounted || !present || !coords) return null;

  return createPortal(
    <div
      ref={panelRef}
      role="dialog"
      aria-label="About nbodysim"
      tabIndex={-1}
      className={`glass fixed z-50 flex flex-col gap-[14px] p-[18px] outline-none ${
        reduceMotion ? "" : "transition-opacity duration-150"
      }`}
      style={{
        left: coords.left,
        top: coords.top,
        width: PANEL_WIDTH,
        borderRadius: 14,
        opacity: shown ? 1 : 0,
        // glass owns the box-shadow property, so the stronger drop shadow and
        // the faint accent ring (the trailing `0 0 0 1px` layer is the
        // equivalent of ring-1 ring-accent/10) are stacked here rather than via
        // shadow/ring utilities that would clobber the glass recipe. The first
        // layer preserves glass's inset top highlight.
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.04), 0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(164,168,255,0.10)",
      }}
    >
      {/* Optional caret pointing up at the trigger (right-aligned panel, so it
          sits near the right edge). backdrop-filter matches the glass blur. */}
      <span
        aria-hidden="true"
        className="absolute h-[10px] w-[10px] rotate-45"
        style={{
          top: -5,
          right: 16,
          background: "rgba(20,22,30,0.62)",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          borderLeft: "1px solid rgba(255,255,255,0.06)",
          backdropFilter: "blur(22px) saturate(150%)",
          WebkitBackdropFilter: "blur(22px) saturate(150%)",
        }}
      />

      {/* 1. Brand row */}
      <div className="flex items-center gap-3">
        <div
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[8px]"
          style={{ background: "linear-gradient(135deg, #a4a8ff, #6e74d4)" }}
        >
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#16182a"
            strokeWidth="1.6"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="2.4" />
            <ellipse
              cx="12"
              cy="12"
              rx="9"
              ry="3.6"
              transform="rotate(-30 12 12)"
            />
          </svg>
        </div>
        <div className="flex flex-col">
          <span className="text-hi text-[16px] font-semibold leading-tight">
            nbodysim
          </span>
          {/* eyebrow sets color: subdim; inline accent wins over the utility. */}
          <span className="eyebrow" style={{ color: "var(--color-accent)" }}>
            REAL-TIME SOLAR SYSTEM SIMULATOR
          </span>
        </div>
      </div>

      {/* 2. Pitch */}
      <p className="text-text text-[12.5px] leading-relaxed">
        A real-time gravitational simulation of any number of celestial bodies
        from our solar system, computed on the fly with your parameters. Pick
        the bodies you want, then hit{" "}
        <span className="text-hi font-medium">Run</span> and watch their real
        orbits play back in 3D.
      </p>

      {/* 2b. Data provenance / credibility note. */}
      <p className="text-dim text-[11.5px] leading-relaxed">
        Seeded with data from Orekit, and verifiable against real JPL Horizons
        data.
      </p>

      {/* 3. Divider */}
      <div className="h-px bg-white/[0.06]" />

      {/* 4. Links */}
      <div className="flex flex-col gap-2">
        <LinkRow
          href={GITHUB_URL}
          external
          label="View on GitHub"
          sub="github.com/byeonkho/nbodysim"
          icon={gitBranchIcon}
          variant="accent"
        />
        <LinkRow
          href={ISSUES_URL}
          external
          label="Report a bug"
          sub="Open an issue on GitHub"
          icon={bugIcon}
          variant="neutral"
        />
        <LinkRow
          href={`mailto:${CONTACT_EMAIL}`}
          external={false}
          label="Contact the author"
          sub={CONTACT_EMAIL}
          icon={mailIcon}
          variant="neutral"
        />
      </div>
    </div>,
    document.body,
  );
}
