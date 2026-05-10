import {
  KeyboardEvent,
  ReactNode,
  createContext,
  useContext,
  useId,
  useRef,
  useState
} from "react";
import "./Tabs.css";

interface TabsContextValue {
  value: string;
  setValue: (v: string) => void;
  baseId: string;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext(): TabsContextValue {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error("Tabs compound parts must be rendered inside <Tabs>");
  return ctx;
}

function cls(...parts: Array<string | undefined | false>): string {
  return parts.filter(Boolean).join(" ");
}

export interface TabsProps {
  children: ReactNode;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  className?: string;
}

export function Tabs({
  children,
  value: controlledValue,
  defaultValue = "",
  onValueChange,
  className
}: TabsProps) {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : uncontrolledValue;
  const setValue = (v: string) => {
    if (!isControlled) setUncontrolledValue(v);
    onValueChange?.(v);
  };
  const baseId = useId();
  return (
    <TabsContext.Provider value={{ value, setValue, baseId }}>
      <div className={cls("ui26-tabs", className)}>{children}</div>
    </TabsContext.Provider>
  );
}

export interface TabListProps {
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
}

export function TabList({ children, className, ariaLabel }: TabListProps) {
  const ref = useRef<HTMLDivElement>(null);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!ref.current) return;
    const tabs = Array.from(
      ref.current.querySelectorAll<HTMLButtonElement>('[role="tab"]:not(:disabled)')
    );
    if (tabs.length === 0) return;
    const current = tabs.indexOf(document.activeElement as HTMLButtonElement);
    if (current === -1) return;

    let next = -1;
    if (e.key === "ArrowRight") next = (current + 1) % tabs.length;
    else if (e.key === "ArrowLeft") next = (current - 1 + tabs.length) % tabs.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = tabs.length - 1;

    if (next !== -1) {
      e.preventDefault();
      tabs[next].focus();
    }
  };

  return (
    <div
      ref={ref}
      role="tablist"
      aria-label={ariaLabel}
      className={cls("ui26-tablist", className)}
      onKeyDown={handleKeyDown}
    >
      {children}
    </div>
  );
}

export interface TabProps {
  value: string;
  children: ReactNode;
  disabled?: boolean;
  className?: string;
}

export function Tab({ value, children, disabled = false, className }: TabProps) {
  const ctx = useTabsContext();
  const isActive = ctx.value === value;
  return (
    <button
      type="button"
      role="tab"
      id={`${ctx.baseId}-tab-${value}`}
      aria-selected={isActive}
      aria-controls={`${ctx.baseId}-panel-${value}`}
      tabIndex={isActive ? 0 : -1}
      disabled={disabled}
      onClick={() => ctx.setValue(value)}
      className={cls("ui26-tab", isActive && "ui26-tab--active", className)}
    >
      {children}
    </button>
  );
}

export interface TabPanelProps {
  value: string;
  children: ReactNode;
  className?: string;
}

export function TabPanel({ value, children, className }: TabPanelProps) {
  const ctx = useTabsContext();
  if (ctx.value !== value) return null;
  return (
    <div
      role="tabpanel"
      id={`${ctx.baseId}-panel-${value}`}
      aria-labelledby={`${ctx.baseId}-tab-${value}`}
      tabIndex={0}
      className={cls("ui26-tabpanel", className)}
    >
      {children}
    </div>
  );
}
