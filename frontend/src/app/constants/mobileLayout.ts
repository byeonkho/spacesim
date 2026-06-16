// Shared mobile layout contract: how much room the persistent bottom control
// dock (MobileControlSheet, z-40) occupies, so other bottom-docked surfaces can
// clear it instead of rendering underneath it.
//
// The dock's collapsed height is deterministic from its fixed pieces:
//   chevron row        30px   (h-[30px])
//   transport bar     110px   (py-2.5 = 20 + scrubber h-8 = 32 + gap-2.5 = 10 + buttons h-12 = 48)
//   bottom inset       14px   (BOTTOM_INSET's px term)
//   ------------------------
//   total            ~154px
// Plus a 6px gap so a cleared surface's last row does not kiss the dock's glass
// edge. The env() term tracks the device safe area (home indicator), which the
// dock also pads with, so it must appear here too.
//
// If the dock's internal layout changes (a taller transport row, an extra
// control), update the px total here and both consumers move together.
export const MOBILE_DOCK_CLEARANCE = "calc(env(safe-area-inset-bottom, 0px) + 160px)";
