import { RefObject, useEffect, useState } from "react";

export interface UseClickOutsideOptions {
  enabled?: boolean;
  /** Skip clicks that land inside any element marked by floating-ui (Menu, Popover, Tooltip).
   *  Useful when the ref's content opens floating dropdowns whose portals escape the ref. */
  ignoreFloatingUiPortals?: boolean;
  /** Defer attaching the listener until the next animation frame, so the same event
   *  that opened the popup (still bubbling to document) can't immediately close it. */
  armOnNextFrame?: boolean;
}

export function useClickOutside<T extends HTMLElement>(
  ref: RefObject<T | null>,
  onClickOutside: () => void,
  options: boolean | UseClickOutsideOptions = true
): void {
  const opts: UseClickOutsideOptions =
    typeof options === "boolean" ? { enabled: options } : options;
  const { enabled = true, ignoreFloatingUiPortals = false, armOnNextFrame = false } = opts;

  const [armed, setArmed] = useState(!armOnNextFrame);
  useEffect(() => {
    if (!armOnNextFrame) return;
    const id = requestAnimationFrame(() => setArmed(true));
    return () => {
      cancelAnimationFrame(id);
      setArmed(false);
    };
  }, [armOnNextFrame, enabled]);

  useEffect(() => {
    if (!enabled || !armed) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Element | null;
      if (!target) return;
      if (ref.current && ref.current.contains(target as Node)) return;
      if (ignoreFloatingUiPortals && target.closest("[data-floating-ui-focusable]")) return;
      onClickOutside();
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [ref, onClickOutside, enabled, armed, ignoreFloatingUiPortals]);
}
