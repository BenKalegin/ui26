import {
  ReactNode,
  createContext,
  useContext,
  useMemo,
  useState
} from "react";
import {
  useFloating,
  useClick,
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
import "./Popover.css";

type FloatingApi = ReturnType<typeof useFloating>;
type InteractionsApi = ReturnType<typeof useInteractions>;

interface PopoverContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  refs: FloatingApi["refs"];
  floatingStyles: FloatingApi["floatingStyles"];
  context: FloatingApi["context"];
  getReferenceProps: InteractionsApi["getReferenceProps"];
  getFloatingProps: InteractionsApi["getFloatingProps"];
}

const PopoverContext = createContext<PopoverContextValue | null>(null);

function usePopoverContext(): PopoverContextValue {
  const ctx = useContext(PopoverContext);
  if (!ctx) throw new Error("Popover compound parts must be rendered inside <Popover>");
  return ctx;
}

function cls(...parts: Array<string | undefined | false>): string {
  return parts.filter(Boolean).join(" ");
}

export interface PopoverProps {
  children: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  placement?: Placement;
  offset?: number;
  closeOnEscape?: boolean;
  closeOnClickOutside?: boolean;
}

export function Popover({
  children,
  open: controlledOpen,
  onOpenChange,
  placement = "bottom-start",
  offset: off = 4,
  closeOnEscape = true,
  closeOnClickOutside = true
}: PopoverProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  const setOpen = (value: boolean) => {
    if (isControlled) onOpenChange?.(value);
    else setUncontrolledOpen(value);
  };

  const { refs, floatingStyles, context } = useFloating({
    open,
    onOpenChange: setOpen,
    placement,
    middleware: [offsetMiddleware(off), flip(), shift({ padding: 8 })],
    whileElementsMounted: autoUpdate
  });

  const click = useClick(context);
  const dismiss = useDismiss(context, {
    escapeKey: closeOnEscape,
    outsidePress: closeOnClickOutside
  });
  const role = useRole(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss, role]);

  const value = useMemo<PopoverContextValue>(
    () => ({
      open,
      setOpen,
      refs,
      floatingStyles,
      context,
      getReferenceProps,
      getFloatingProps
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [open, refs, floatingStyles, context, getReferenceProps, getFloatingProps]
  );

  return <PopoverContext.Provider value={value}>{children}</PopoverContext.Provider>;
}

export interface PopoverTriggerProps {
  children: ReactNode;
  className?: string;
}

export function PopoverTrigger({ children, className }: PopoverTriggerProps) {
  const ctx = usePopoverContext();
  return (
    <button
      type="button"
      ref={ctx.refs.setReference}
      className={className}
      data-state={ctx.open ? "open" : "closed"}
      {...ctx.getReferenceProps()}
    >
      {children}
    </button>
  );
}

export interface PopoverContentProps {
  children: ReactNode;
  className?: string;
}

export function PopoverContent({ children, className }: PopoverContentProps) {
  const ctx = usePopoverContext();
  if (!ctx.open) return null;
  return (
    <FloatingPortal>
      <div
        ref={ctx.refs.setFloating}
        style={ctx.floatingStyles}
        className={cls("ui26-popover", className)}
        {...ctx.getFloatingProps()}
      >
        {children}
      </div>
    </FloatingPortal>
  );
}
