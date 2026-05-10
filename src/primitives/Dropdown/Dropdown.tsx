import { MouseEvent, ReactNode, useRef, useState } from "react";
import { useClickOutside } from "../../hooks/useClickOutside";
import "./Dropdown.css";

export interface DropdownProps {
  trigger: ReactNode;
  children: ReactNode;
  triggerClassName?: string;
  menuClassName?: string;
  containerClassName?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

function cls(...parts: Array<string | undefined | false>): string {
  return parts.filter(Boolean).join(" ");
}

export function Dropdown({
  trigger,
  children,
  triggerClassName,
  menuClassName,
  containerClassName,
  open: controlledOpen,
  onOpenChange
}: DropdownProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : uncontrolledOpen;

  const setIsOpen = (value: boolean) => {
    if (isControlled) onOpenChange?.(value);
    else setUncontrolledOpen(value);
  };

  useClickOutside(containerRef, () => setIsOpen(false), isOpen);

  const handleToggle = (e: MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  return (
    <div ref={containerRef} className={cls("ui26-dropdown", containerClassName)}>
      <button
        type="button"
        className={cls("ui26-dropdown__trigger", triggerClassName)}
        onClick={handleToggle}
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        {trigger}
      </button>
      {isOpen && (
        <div role="menu" className={cls("ui26-dropdown__menu", menuClassName)}>
          {children}
        </div>
      )}
    </div>
  );
}

export interface DropdownItemProps {
  onClick: () => void;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
}

export function DropdownItem({ onClick, children, className, disabled = false }: DropdownItemProps) {
  const handleClick = (e: MouseEvent) => {
    e.stopPropagation();
    if (!disabled) onClick();
  };
  return (
    <button
      type="button"
      role="menuitem"
      className={cls("ui26-dropdown__item", className)}
      onClick={handleClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
