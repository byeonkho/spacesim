import type { ReactNode } from "react";
import { Eyebrow } from "../Eyebrow";
import styles from "./Stat.module.css";

export interface StatProps {
  /** Eyebrow label above the value. */
  label: string;
  /** The value (rendered with tabular numerics). */
  value: ReactNode;
  /** Optional dim unit suffix. */
  unit?: string;
}

/** Labeled numeric readout: an eyebrow label over a tabular value. */
export function Stat({ label, value, unit }: StatProps) {
  return (
    <div className={styles.stat}>
      <Eyebrow>{label}</Eyebrow>
      <span className={styles.row}>
        <span className={styles.value}>{value}</span>
        {unit != null && <span className={styles.unit}>{unit}</span>}
      </span>
    </div>
  );
}
