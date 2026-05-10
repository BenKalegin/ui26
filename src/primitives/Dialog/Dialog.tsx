import { ReactNode, useRef } from "react";
import { createPortal } from "react-dom";
import { useEscapeKey } from "../../hooks/useEscapeKey";
import { useClickOutside } from "../../hooks/useClickOutside";
import { useFocusTrap } from "../../hooks/useFocusTrap";
import "./Dialog.css";

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  closeOnClickOutside?: boolean;
  closeOnEscape?: boolean;
  trapFocus?: boolean;
  className?: string;
  overlayClassName?: string;
  ariaLabel?: string;
}

function cls(...parts: Array<string | undefined | false>): string {
  return parts.filter(Boolean).join(" ");
}

export function Dialog({
  open,
  onClose,
  children,
  closeOnClickOutside = true,
  closeOnEscape = true,
  trapFocus = true,
  className,
  overlayClassName,
  ariaLabel
}: DialogProps) {
  const ref = useRef<HTMLDivElement>(null);
  useEscapeKey(onClose, open && closeOnEscape);
  useClickOutside(ref, onClose, open && closeOnClickOutside);
  useFocusTrap(ref, open && trapFocus);

  if (!open) return null;

  return createPortal(
    <div className={cls("ui26-dialog__overlay", overlayClassName)}>
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        className={cls("ui26-dialog", className)}
      >
        {children}
      </div>
    </div>,
    document.body
  );
}

export interface DialogHeaderProps {
  children: ReactNode;
  onClose?: () => void;
  className?: string;
}

export function DialogHeader({ children, onClose, className }: DialogHeaderProps) {
  return (
    <div className={cls("ui26-dialog__header", className)}>
      <span>{children}</span>
      {onClose && (
        <button type="button" className="ui26-dialog__close" onClick={onClose} aria-label="Close">
          ×
        </button>
      )}
    </div>
  );
}

export interface DialogBodyProps {
  children: ReactNode;
  className?: string;
}

export function DialogBody({ children, className }: DialogBodyProps) {
  return <div className={cls("ui26-dialog__body", className)}>{children}</div>;
}

export interface DialogFooterProps {
  children: ReactNode;
  className?: string;
}

export function DialogFooter({ children, className }: DialogFooterProps) {
  return <div className={cls("ui26-dialog__footer", className)}>{children}</div>;
}
