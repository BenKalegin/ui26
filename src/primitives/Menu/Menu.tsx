import {
  ButtonHTMLAttributes,
  MouseEvent as ReactMouseEvent,
  ReactNode,
  RefObject,
  createContext,
  useContext,
  useMemo,
  useRef,
  useState
} from "react";
import {
  useFloating,
  useClick,
  useDismiss,
  useRole,
  useListNavigation,
  useInteractions,
  useListItem,
  FloatingPortal,
  FloatingFocusManager,
  FloatingList,
  offset as offsetMiddleware,
  flip,
  shift,
  autoUpdate,
  type Placement
} from "@floating-ui/react";
import "./Menu.css";

type FloatingApi = ReturnType<typeof useFloating>;
type InteractionsApi = ReturnType<typeof useInteractions>;

interface MenuContextValue {
  open: boolean;
  setOpen: (v: boolean) => void;
  refs: FloatingApi["refs"];
  floatingStyles: FloatingApi["floatingStyles"];
  context: FloatingApi["context"];
  getReferenceProps: InteractionsApi["getReferenceProps"];
  getFloatingProps: InteractionsApi["getFloatingProps"];
  getItemProps: InteractionsApi["getItemProps"];
  activeIndex: number | null;
  elementsRef: RefObject<Array<HTMLElement | null>>;
  labelsRef: RefObject<Array<string | null>>;
}

const MenuContext = createContext<MenuContextValue | null>(null);

function useMenuContext(): MenuContextValue {
  const ctx = useContext(MenuContext);
  if (!ctx) throw new Error("Menu compound parts must be rendered inside <Menu>");
  return ctx;
}

function cls(...parts: Array<string | undefined | false>): string {
  return parts.filter(Boolean).join(" ");
}

export interface MenuProps {
  children: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  placement?: Placement;
  offset?: number;
}

export function Menu({
  children,
  open: controlledOpen,
  onOpenChange,
  placement = "bottom-start",
  offset: off = 4
}: MenuProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;
  const setOpen = (v: boolean) => {
    if (isControlled) onOpenChange?.(v);
    else setUncontrolledOpen(v);
  };

  const elementsRef = useRef<Array<HTMLElement | null>>([]);
  const labelsRef = useRef<Array<string | null>>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const { refs, floatingStyles, context } = useFloating({
    open,
    onOpenChange: setOpen,
    placement,
    middleware: [offsetMiddleware(off), flip(), shift({ padding: 8 })],
    whileElementsMounted: autoUpdate
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: "menu" });
  const listNav = useListNavigation(context, {
    listRef: elementsRef,
    activeIndex,
    onNavigate: setActiveIndex,
    loop: true
  });

  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions([
    click,
    dismiss,
    role,
    listNav
  ]);

  const value = useMemo<MenuContextValue>(
    () => ({
      open,
      setOpen,
      refs,
      floatingStyles,
      context,
      getReferenceProps,
      getFloatingProps,
      getItemProps,
      activeIndex,
      elementsRef,
      labelsRef
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      open,
      refs,
      floatingStyles,
      context,
      getReferenceProps,
      getFloatingProps,
      getItemProps,
      activeIndex
    ]
  );

  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
}

export interface MenuTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export function MenuTrigger({ children, className, ...rest }: MenuTriggerProps) {
  const ctx = useMenuContext();
  return (
    <button
      type="button"
      {...rest}
      ref={ctx.refs.setReference}
      className={className}
      data-state={ctx.open ? "open" : "closed"}
      {...ctx.getReferenceProps()}
    >
      {children}
    </button>
  );
}

export interface MenuContentProps {
  children: ReactNode;
  className?: string;
}

export function MenuContent({ children, className }: MenuContentProps) {
  const ctx = useMenuContext();
  if (!ctx.open) return null;
  return (
    <FloatingPortal>
      <FloatingFocusManager context={ctx.context} modal={false}>
        <FloatingList elementsRef={ctx.elementsRef} labelsRef={ctx.labelsRef}>
          <div
            ref={ctx.refs.setFloating}
            style={ctx.floatingStyles}
            className={cls("ui26-menu", className)}
            {...ctx.getFloatingProps()}
          >
            {children}
          </div>
        </FloatingList>
      </FloatingFocusManager>
    </FloatingPortal>
  );
}

export interface MenuItemProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  onSelect?: () => void;
  /** floating-ui list typeahead label */
  label?: string;
}

export function MenuItem({
  children,
  onSelect,
  disabled = false,
  className,
  label,
  onClick: userOnClick,
  ...rest
}: MenuItemProps) {
  const ctx = useMenuContext();
  const item = useListItem({ label: label ?? null });
  const isActive = ctx.activeIndex === item.index;

  return (
    <button
      type="button"
      role="menuitem"
      tabIndex={isActive ? 0 : -1}
      {...rest}
      ref={item.ref}
      disabled={disabled}
      data-active={isActive ? "" : undefined}
      className={cls("ui26-menu__item", className)}
      {...ctx.getItemProps({
        onClick: (e) => {
          if (disabled) return;
          userOnClick?.(e as ReactMouseEvent<HTMLButtonElement>);
          onSelect?.();
          ctx.setOpen(false);
        }
      })}
    >
      {children}
    </button>
  );
}
