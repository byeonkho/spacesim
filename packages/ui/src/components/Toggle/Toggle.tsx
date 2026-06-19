import styles from "./Toggle.module.css";

export type ToggleState = "off" | "mixed" | "on";

export interface ToggleProps {
  /** Current state. */
  state: ToggleState;
  /** Controlled change. Click advances off->on, on->off, mixed->on. */
  onChange?: (next: ToggleState) => void;
  /** Accessible label for the switch. */
  label: string;
  /** Track width in px; height derives from it. Default 44. */
  width?: number;
}

// Tri-state toggle. "mixed" sits the knob centered with an accent-tinted track
// and a dash on the knob, so it reads distinct from both off and on. The macOS
// convention is that clicking a mixed control resolves it to "on".
export function Toggle({ state, onChange, label, width = 44 }: ToggleProps) {
  const w = width;
  const h = Math.round((w * 26) / 44);
  const knob = h - 4;
  const left =
    state === "on" ? w - knob - 2 : state === "mixed" ? (w - knob) / 2 : 2;
  const bg =
    state === "on"
      ? "var(--color-accent)"
      : state === "mixed"
        ? "rgba(164, 168, 255, 0.32)"
        : "rgba(255, 255, 255, 0.10)";
  const ariaChecked: boolean | "mixed" =
    state === "on" ? true : state === "mixed" ? "mixed" : false;

  return (
    <button
      type="button"
      role="switch"
      aria-checked={ariaChecked}
      aria-label={label}
      onClick={() => onChange?.(state === "on" ? "off" : "on")}
      className={styles.toggle}
      style={{ width: w, height: h, background: bg }}
    >
      <span
        className={styles.knob}
        style={{ left, width: knob, height: knob }}
      >
        {state === "mixed" && (
          <span className={styles.dash} style={{ width: knob * 0.4 }} />
        )}
      </span>
    </button>
  );
}
