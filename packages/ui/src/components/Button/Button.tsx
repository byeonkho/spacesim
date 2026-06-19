import type { ButtonHTMLAttributes } from "react";
import styles from "./Button.module.css";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style. "primary" is the accent gradient; "ghost" is bordered. */
  variant?: "primary" | "ghost";
  /** Gentle attention pulse for a call-to-action. Reduced-motion aware. */
  pulse?: boolean;
}

/** Action button in the nbodysim accent style. */
export function Button({
  variant = "primary",
  pulse = false,
  className,
  type = "button",
  ...rest
}: ButtonProps) {
  const cls = [
    styles.button,
    styles[variant],
    pulse ? styles.pulse : null,
    className,
  ]
    .filter(Boolean)
    .join(" ");
  return <button type={type} className={cls} {...rest} />;
}
