"use client";

import { useSyncExternalStore } from "react";

// Viewports narrower than 1280px use the mobile guided-explorer chrome. The
// current rule is width-only and does not inspect pointer capabilities.
export const MOBILE_MAX_WIDTH = 1280;

const QUERY = `(max-width: ${MOBILE_MAX_WIDTH - 1}px)`;

// Pure helper used by PrefsHydrator to decide whether to auto-start the
// desktop intro tour. Keeps the auto-start cutoff pinned to the same
// constant as the mobile chrome breakpoint so the tour never fires while
// the mobile UI is active.
export function isDesktopTourViewport(
  innerWidth: number,
  prefersCoarsePointer: boolean
): boolean {
  return innerWidth >= MOBILE_MAX_WIDTH && !prefersCoarsePointer;
}

function subscribe(callback: () => void): () => void {
  const mql = window.matchMedia(QUERY);
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

function getSnapshot(): boolean {
  return window.matchMedia(QUERY).matches;
}

// Server (and the first client render) reports desktop so SSR markup
// matches first paint; the canvas is identical either way, so the
// post-hydration swap to mobile chrome is seamless.
function getServerSnapshot(): boolean {
  return false;
}

export function useIsMobile(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
