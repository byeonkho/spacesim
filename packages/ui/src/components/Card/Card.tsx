import type { ReactNode } from "react";
import { GlassPanel } from "../GlassPanel";
import { CelestialPortrait } from "../CelestialPortrait";
import { Stat } from "../Stat";
import styles from "./Card.module.css";

export interface CardStatItem {
  label: string;
  value: ReactNode;
  unit?: string;
}

export interface CardProps {
  title: ReactNode;
  subtitle?: ReactNode;
  /** Optional body avatar shown in the header. */
  portrait?: { color: string; ring?: boolean };
  /** Optional grid of readouts, rendered with Stat. */
  stats?: CardStatItem[];
  children?: ReactNode;
}

/** Branded info card: a glass panel with a portrait header and stat grid. */
export function Card({ title, subtitle, portrait, stats, children }: CardProps) {
  // The portrait gets an accessible label only when the title is plain text.
  const portraitLabel = typeof title === "string" ? title : undefined;

  return (
    <GlassPanel className={styles.card}>
      <div className={styles.header}>
        {portrait && (
          <CelestialPortrait
            color={portrait.color}
            ring={portrait.ring}
            size={44}
            label={portraitLabel}
          />
        )}
        <div className={styles.heading}>
          <div className={styles.title}>{title}</div>
          {subtitle != null && <div className={styles.subtitle}>{subtitle}</div>}
        </div>
      </div>

      {stats && stats.length > 0 && (
        <div className={styles.stats}>
          {stats.map((s, i) => (
            <Stat key={i} label={s.label} value={s.value} unit={s.unit} />
          ))}
        </div>
      )}

      {children != null && <div className={styles.body}>{children}</div>}
    </GlassPanel>
  );
}
