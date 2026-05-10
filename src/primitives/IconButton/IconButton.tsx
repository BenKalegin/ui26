import { ButtonHTMLAttributes } from "react";
import "./IconButton.css";

export type IconButtonSize = "sm" | "md" | "lg";

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: IconButtonSize;
  "aria-label": string;
}

function cls(...parts: Array<string | undefined | false>): string {
  return parts.filter(Boolean).join(" ");
}

export function IconButton({
  size = "md",
  type = "button",
  className,
  children,
  ...rest
}: IconButtonProps) {
  return (
    <button
      type={type}
      className={cls("ui26-icon-btn", `ui26-icon-btn--${size}`, className)}
      {...rest}
    >
      {children}
    </button>
  );
}
