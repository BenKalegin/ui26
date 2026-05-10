import { MouseEvent, ReactNode, useState } from "react";
import "./Collapsible.css";

export interface CollapsibleProps {
  trigger: ReactNode | ((open: boolean) => ReactNode);
  children: ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  triggerClassName?: string;
  contentClassName?: string;
}

function cls(...parts: Array<string | undefined | false>): string {
  return parts.filter(Boolean).join(" ");
}

export function Collapsible({
  trigger,
  children,
  defaultOpen = false,
  open: controlledOpen,
  onOpenChange,
  className,
  triggerClassName,
  contentClassName
}: CollapsibleProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : uncontrolledOpen;

  const setIsOpen = (value: boolean) => {
    if (isControlled) onOpenChange?.(value);
    else setUncontrolledOpen(value);
  };

  const handleToggle = (e: MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const triggerContent = typeof trigger === "function" ? trigger(isOpen) : trigger;

  return (
    <div className={cls("ui26-collapsible", className)}>
      <button
        type="button"
        className={cls("ui26-collapsible__trigger", triggerClassName)}
        onClick={handleToggle}
        aria-expanded={isOpen}
      >
        {triggerContent}
      </button>
      {isOpen && (
        <div className={cls("ui26-collapsible__content", contentClassName)}>{children}</div>
      )}
    </div>
  );
}

export interface CollapsibleWithChevronProps extends Omit<CollapsibleProps, "trigger"> {
  header: ReactNode;
  chevronPosition?: "left" | "right";
  chevronIcons?: { open: ReactNode; closed: ReactNode };
}

export function CollapsibleWithChevron({
  header,
  chevronPosition = "left",
  chevronIcons = { open: "▾", closed: "▸" },
  ...props
}: CollapsibleWithChevronProps) {
  const trigger = (isOpen: boolean) => (
    <>
      {chevronPosition === "left" && (
        <span className="ui26-collapsible__chevron">
          {isOpen ? chevronIcons.open : chevronIcons.closed}
        </span>
      )}
      <span style={{ flex: 1 }}>{header}</span>
      {chevronPosition === "right" && (
        <span className="ui26-collapsible__chevron">
          {isOpen ? chevronIcons.open : chevronIcons.closed}
        </span>
      )}
    </>
  );
  return <Collapsible {...props} trigger={trigger} />;
}
