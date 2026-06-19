import type { HTMLAttributes } from "react";
import styles from "./GlassPanel.module.css";

export interface GlassPanelProps extends HTMLAttributes<HTMLDivElement> {
  /** "panel" is the floating glass surface; "dock" is the bottom-docked sheet. */
  variant?: "panel" | "dock";
}

/** Translucent glass surface. The dock variant is the bottom-docked sheet. */
export function GlassPanel({
  variant = "panel",
  className,
  ...rest
}: GlassPanelProps) {
  const cls = [styles.panel, variant === "dock" ? styles.dock : null, className]
    .filter(Boolean)
    .join(" ");
  return <div className={cls} {...rest} />;
}
