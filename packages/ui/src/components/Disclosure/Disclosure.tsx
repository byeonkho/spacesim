import { useState, type ReactNode } from "react";
import { Chevron } from "../Chevron";
import styles from "./Disclosure.module.css";

export interface DisclosureProps {
  /** Header label. */
  title: ReactNode;
  /** Whether the content starts expanded. Default false. */
  defaultOpen?: boolean;
  /** Collapsible content. */
  children: ReactNode;
}

/** Self-contained collapsible: a header button with a rotating chevron. */
export function Disclosure({
  title,
  defaultOpen = false,
  children,
}: DisclosureProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={styles.disclosure}>
      <button
        type="button"
        className={styles.header}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <span className={styles.title}>{title}</span>
        <Chevron open={open} />
      </button>
      {open && <div className={styles.content}>{children}</div>}
    </div>
  );
}
