import type { ReactNode } from "react";
import styles from "./Chip.module.css";

export interface ChipProps {
  children: ReactNode;
  /** Selected (accent-tinted) state. */
  selected?: boolean;
  /** When provided, the chip is an interactive button; otherwise a static span. */
  onClick?: () => void;
  /** Optional leading element (icon or color dot). */
  leading?: ReactNode;
  className?: string;
}

/** Compact pill. Static by default, interactive when given an onClick. */
export function Chip({
  children,
  selected = false,
  onClick,
  leading,
  className,
}: ChipProps) {
  const cls = [styles.chip, selected ? styles.selected : null, className]
    .filter(Boolean)
    .join(" ");
  const content = (
    <>
      {leading != null && <span className={styles.leading}>{leading}</span>}
      {children}
    </>
  );

  if (onClick) {
    return (
      <button
        type="button"
        className={cls}
        aria-pressed={selected}
        onClick={onClick}
      >
        {content}
      </button>
    );
  }
  return <span className={cls}>{content}</span>;
}
