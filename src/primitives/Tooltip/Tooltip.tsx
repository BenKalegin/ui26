import {
  ReactElement,
  ReactNode,
  cloneElement,
  isValidElement,
  useState
} from "react";
import {
  useFloating,
  useHover,
  useFocus,
  useDismiss,
  useRole,
  useInteractions,
  FloatingPortal,
  offset as offsetMiddleware,
  flip,
  shift,
  autoUpdate,
  type Placement
} from "@floating-ui/react";
import "./Tooltip.css";

export interface TooltipProps {
  content: ReactNode;
  children: ReactElement;
  placement?: Placement;
  offset?: number;
  delay?: number;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

function cls(...parts: Array<string | undefined | false>): string {
  return parts.filter(Boolean).join(" ");
}

export function Tooltip({
  content,
  children,
  placement = "top",
  offset: off = 6,
  delay = 200,
  open: controlledOpen,
  onOpenChange,
  className
}: TooltipProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;
  const setOpen = (v: boolean) => {
    if (isControlled) onOpenChange?.(v);
    else setUncontrolledOpen(v);
  };

  const { refs, floatingStyles, context } = useFloating({
    open,
    onOpenChange: setOpen,
    placement,
    middleware: [offsetMiddleware(off), flip(), shift({ padding: 8 })],
    whileElementsMounted: autoUpdate
  });

  const hover = useHover(context, { delay: { open: delay, close: 0 }, move: false });
  const focus = useFocus(context);
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: "tooltip" });
  const { getReferenceProps, getFloatingProps } = useInteractions([hover, focus, dismiss, role]);

  if (!isValidElement(children)) {
    throw new Error("Tooltip expects a single React element child");
  }

  const trigger = cloneElement(
    children,
    getReferenceProps({
      ref: refs.setReference,
      ...(children.props as Record<string, unknown>)
    }) as Record<string, unknown>
  );

  return (
    <>
      {trigger}
      {open && content !== undefined && content !== null && (
        <FloatingPortal>
          <div
            ref={refs.setFloating}
            style={floatingStyles}
            className={cls("ui26-tooltip", className)}
            {...getFloatingProps()}
          >
            {content}
          </div>
        </FloatingPortal>
      )}
    </>
  );
}
