import { KeyboardEvent } from "react";

export interface UseEnterSubmitOptions {
  preventDefault?: boolean;
  allowShiftEnter?: boolean;
}

export function useEnterSubmit(
  onSubmit: () => void,
  options: UseEnterSubmitOptions = {}
): (event: KeyboardEvent) => void {
  const { preventDefault = true, allowShiftEnter = true } = options;

  return (event: KeyboardEvent) => {
    if (event.key !== "Enter") return;
    if (allowShiftEnter && event.shiftKey) return;
    if (preventDefault) event.preventDefault();
    onSubmit();
  };
}
