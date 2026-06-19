import type { ReactNode } from "react";
import styles from "./Eyebrow.module.css";

export interface EyebrowProps {
  /** The label text. */
  children: ReactNode;
  /** Optional extra class names, merged after the component's own. */
  className?: string;
}

/** Uppercase mono micro-label, 0.18em tracking. */
export function Eyebrow({ children, className }: EyebrowProps) {
  const cls = [styles.eyebrow, className].filter(Boolean).join(" ");
  return <span className={cls}>{children}</span>;
}
