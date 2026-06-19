import styles from "./Chevron.module.css";

export interface ChevronProps {
  /** Rotates to point down when true, right when false. */
  open: boolean;
  /** Size in px. Default 14. */
  size?: number;
}

/** Small rotating chevron affordance for collapsible surfaces. */
export function Chevron({ open, size = 14 }: ChevronProps) {
  const cls = [styles.chevron, open ? styles.open : null]
    .filter(Boolean)
    .join(" ");
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className={cls}
    >
      <path
        d="M4 6l4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
