import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useEscapeKey } from "./useEscapeKey";

function dispatchKey(key: string) {
  document.dispatchEvent(new KeyboardEvent("keydown", { key }));
}

describe("useEscapeKey", () => {
  it("fires the callback on Escape", () => {
    const onEscape = vi.fn();
    renderHook(() => useEscapeKey(onEscape));
    dispatchKey("Escape");
    expect(onEscape).toHaveBeenCalledTimes(1);
  });

  it("ignores other keys", () => {
    const onEscape = vi.fn();
    renderHook(() => useEscapeKey(onEscape));
    dispatchKey("Enter");
    dispatchKey("a");
    expect(onEscape).not.toHaveBeenCalled();
  });

  it("does not fire when disabled", () => {
    const onEscape = vi.fn();
    renderHook(() => useEscapeKey(onEscape, false));
    dispatchKey("Escape");
    expect(onEscape).not.toHaveBeenCalled();
  });

  it("detaches listener on unmount", () => {
    const onEscape = vi.fn();
    const { unmount } = renderHook(() => useEscapeKey(onEscape));
    unmount();
    dispatchKey("Escape");
    expect(onEscape).not.toHaveBeenCalled();
  });
});
