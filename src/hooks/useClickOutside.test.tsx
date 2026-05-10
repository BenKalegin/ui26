import { render } from "@testing-library/react";
import { useRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { useClickOutside } from "./useClickOutside";

function Harness({ onOutside, enabled }: { onOutside: () => void; enabled?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, onOutside, enabled);
  return (
    <>
      <div data-testid="inside" ref={ref}>
        <button data-testid="child">child</button>
      </div>
      <div data-testid="outside">outside</div>
    </>
  );
}

function mousedownOn(el: HTMLElement) {
  el.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
}

describe("useClickOutside", () => {
  it("fires when mousedown lands outside the ref", () => {
    const onOutside = vi.fn();
    const { getByTestId } = render(<Harness onOutside={onOutside} />);
    mousedownOn(getByTestId("outside"));
    expect(onOutside).toHaveBeenCalledTimes(1);
  });

  it("does not fire when mousedown lands inside the ref", () => {
    const onOutside = vi.fn();
    const { getByTestId } = render(<Harness onOutside={onOutside} />);
    mousedownOn(getByTestId("child"));
    mousedownOn(getByTestId("inside"));
    expect(onOutside).not.toHaveBeenCalled();
  });

  it("does not fire when disabled", () => {
    const onOutside = vi.fn();
    const { getByTestId } = render(<Harness onOutside={onOutside} enabled={false} />);
    mousedownOn(getByTestId("outside"));
    expect(onOutside).not.toHaveBeenCalled();
  });
});
