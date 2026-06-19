import styles from "./Selector.module.css";

export interface SelectorItem<T extends string> {
  value: T;
  label: React.ReactNode;
  /** Optional decorative leading element (icon or color dot). */
  leading?: React.ReactNode;
}

export interface SelectorProps<T extends string> {
  items: SelectorItem<T>[];
  value: T | null;
  onChange: (value: T) => void;
}

/** Vertical single-select list. */
export function Selector<T extends string>({
  items,
  value,
  onChange,
}: SelectorProps<T>) {
  return (
    <div className={styles.list}>
      {items.map((it) => {
        const active = it.value === value;
        const cls = [styles.item, active ? styles.active : null]
          .filter(Boolean)
          .join(" ");
        return (
          <button
            key={it.value}
            type="button"
            className={cls}
            aria-pressed={active}
            onClick={() => onChange(it.value)}
          >
            {it.leading != null && (
              <span className={styles.leading} aria-hidden="true">
                {it.leading}
              </span>
            )}
            <span className={styles.label}>{it.label}</span>
          </button>
        );
      })}
    </div>
  );
}
