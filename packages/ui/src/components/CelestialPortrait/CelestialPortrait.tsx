import styles from "./CelestialPortrait.module.css";

export interface CelestialPortraitProps {
  /** Base color, e.g. "var(--color-body-earth)" or any CSS color. */
  color: string;
  /** Diameter in px. Default 48. */
  size?: number;
  /** Draw a Saturn-style ring. */
  ring?: boolean;
  /** Accessible label; sets role="img" + aria-label. Decorative when omitted. */
  label?: string;
}

/** Radial-gradient body avatar built from the design's body palette. */
export function CelestialPortrait({
  color,
  size = 48,
  ring = false,
  label,
}: CelestialPortraitProps) {
  const a11y = label
    ? ({ role: "img", "aria-label": label } as const)
    : ({ "aria-hidden": true } as const);
  // Lit from the upper-left: a lightened highlight fades to the base color and
  // then a darkened limb. color-mix keeps it a single-color API.
  const fill = `radial-gradient(circle at 32% 28%, color-mix(in srgb, ${color} 76%, white), ${color} 56%, color-mix(in srgb, ${color} 72%, black))`;

  return (
    <span
      className={styles.portrait}
      style={{ width: size, height: size }}
      {...a11y}
    >
      <span className={styles.disc} style={{ background: fill }} />
      {ring && <span className={styles.ring} style={{ borderColor: color }} />}
    </span>
  );
}
