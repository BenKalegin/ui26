import { CSSProperties, ReactNode, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useEscapeKey } from "../../hooks/useEscapeKey";
import { useClickOutside } from "../../hooks/useClickOutside";
import { useFocusTrap } from "../../hooks/useFocusTrap";
import "./Drawer.css";

export type DrawerSide = "left" | "right" | "top" | "bottom";

const SLIDE_DURATION_MS = 195;

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  side?: DrawerSide;
  size?: string | number;
  modal?: boolean;
  closeOnEscape?: boolean;
  closeOnClickOutside?: boolean;
  trapFocus?: boolean;
  className?: string;
  overlayClassName?: string;
  ariaLabel?: string;
}

function cls(...parts: Array<string | undefined | false>): string {
  return parts.filter(Boolean).join(" ");
}

function sizeStyle(side: DrawerSide, size: string | number | undefined): CSSProperties {
  if (size === undefined) return {};
  const value = typeof size === "number" ? `${size}px` : size;
  return side === "left" || side === "right" ? { width: value } : { height: value };
}

/** Keeps the drawer mounted long enough for slide-out CSS transition to complete. */
function useTransitionRender(open: boolean, durationMs: number) {
  const [rendered, setRendered] = useState(open);
  const [active, setActive] = useState(open);
  useEffect(() => {
    if (open) {
      setRendered(true);
      const id = requestAnimationFrame(() => setActive(true));
      return () => cancelAnimationFrame(id);
    }
    setActive(false);
    const t = setTimeout(() => setRendered(false), durationMs);
    return () => clearTimeout(t);
  }, [open, durationMs]);
  return { rendered, active };
}

export function Drawer({
  open,
  onClose,
  children,
  side = "right",
  size,
  modal = true,
  closeOnEscape = true,
  closeOnClickOutside = true,
  trapFocus,
  className,
  overlayClassName,
  ariaLabel
}: DrawerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { rendered, active } = useTransitionRender(open, SLIDE_DURATION_MS);
  useEscapeKey(onClose, open && closeOnEscape);
  useClickOutside(ref, onClose, open && modal && closeOnClickOutside);
  const trap = trapFocus ?? modal;
  useFocusTrap(ref, open && trap);

  if (!rendered) return null;

  const drawer = (
    <div
      ref={ref}
      role="dialog"
      aria-modal={modal ? "true" : undefined}
      aria-label={ariaLabel}
      className={cls(
        "ui26-drawer",
        `ui26-drawer--${side}`,
        active && "ui26-drawer--open",
        className
      )}
      style={sizeStyle(side, size)}
    >
      {children}
    </div>
  );

  return createPortal(
    modal ? (
      <div
        className={cls(
          "ui26-drawer__overlay",
          active && "ui26-drawer__overlay--open",
          overlayClassName
        )}
      >
        {drawer}
      </div>
    ) : (
      drawer
    ),
    document.body
  );
}

export interface DrawerHeaderProps {
  children: ReactNode;
  onClose?: () => void;
  className?: string;
}

export function DrawerHeader({ children, onClose, className }: DrawerHeaderProps) {
  return (
    <div className={cls("ui26-drawer__header", className)}>
      <span>{children}</span>
      {onClose && (
        <button type="button" className="ui26-drawer__close" onClick={onClose} aria-label="Close">
          ×
        </button>
      )}
    </div>
  );
}

export interface DrawerBodyProps {
  children: ReactNode;
  className?: string;
}

export function DrawerBody({ children, className }: DrawerBodyProps) {
  return <div className={cls("ui26-drawer__body", className)}>{children}</div>;
}

export interface DrawerFooterProps {
  children: ReactNode;
  className?: string;
}

export function DrawerFooter({ children, className }: DrawerFooterProps) {
  return <div className={cls("ui26-drawer__footer", className)}>{children}</div>;
}
