import { render, fireEvent } from "@testing-library/react";
import { useRef } from "react";
import { describe, expect, it } from "vitest";
import { useFocusTrap } from "./useFocusTrap";

function Trap({ enabled = true }: { enabled?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useFocusTrap(ref, enabled);
  return (
    <div data-testid="trap" ref={ref}>
      <button data-testid="first">first</button>
      <button data-testid="middle">middle</button>
      <button data-testid="last">last</button>
    </div>
  );
}

describe("useFocusTrap", () => {
  it("focuses the first focusable on mount", () => {
    const { getByTestId } = render(<Trap />);
    expect(document.activeElement).toBe(getByTestId("first"));
  });

  it("wraps Tab from last to first", () => {
    const { getByTestId } = render(<Trap />);
    const last = getByTestId("last");
    last.focus();
    fireEvent.keyDown(getByTestId("trap"), { key: "Tab" });
    expect(document.activeElement).toBe(getByTestId("first"));
  });

  it("wraps Shift+Tab from first to last", () => {
    const { getByTestId } = render(<Trap />);
    const first = getByTestId("first");
    first.focus();
    fireEvent.keyDown(getByTestId("trap"), { key: "Tab", shiftKey: true });
    expect(document.activeElement).toBe(getByTestId("last"));
  });

  it("does not interfere mid-trap", () => {
    const { getByTestId } = render(<Trap />);
    const middle = getByTestId("middle");
    middle.focus();
    fireEvent.keyDown(getByTestId("trap"), { key: "Tab" });
    expect(document.activeElement).toBe(middle);
  });

  it("does nothing when disabled", () => {
    const initial = document.createElement("button");
    document.body.appendChild(initial);
    initial.focus();
    render(<Trap enabled={false} />);
    expect(document.activeElement).toBe(initial);
    initial.remove();
  });
});
