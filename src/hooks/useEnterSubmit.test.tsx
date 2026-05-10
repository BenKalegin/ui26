import { render, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useEnterSubmit, UseEnterSubmitOptions } from "./useEnterSubmit";

function Harness({
  onSubmit,
  options
}: {
  onSubmit: () => void;
  options?: UseEnterSubmitOptions;
}) {
  const handleKeyDown = useEnterSubmit(onSubmit, options);
  return <input data-testid="input" onKeyDown={handleKeyDown} />;
}

describe("useEnterSubmit", () => {
  it("fires on Enter and prevents default by default", () => {
    const onSubmit = vi.fn();
    const { getByTestId } = render(<Harness onSubmit={onSubmit} />);
    const input = getByTestId("input");
    const result = fireEvent.keyDown(input, { key: "Enter" });
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(result).toBe(false);
  });

  it("ignores Shift+Enter when allowShiftEnter is true (default)", () => {
    const onSubmit = vi.fn();
    const { getByTestId } = render(<Harness onSubmit={onSubmit} />);
    fireEvent.keyDown(getByTestId("input"), { key: "Enter", shiftKey: true });
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("submits on Shift+Enter when allowShiftEnter is false", () => {
    const onSubmit = vi.fn();
    const { getByTestId } = render(
      <Harness onSubmit={onSubmit} options={{ allowShiftEnter: false }} />
    );
    fireEvent.keyDown(getByTestId("input"), { key: "Enter", shiftKey: true });
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it("does not preventDefault when preventDefault: false", () => {
    const onSubmit = vi.fn();
    const { getByTestId } = render(
      <Harness onSubmit={onSubmit} options={{ preventDefault: false }} />
    );
    const result = fireEvent.keyDown(getByTestId("input"), { key: "Enter" });
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(result).toBe(true);
  });

  it("ignores non-Enter keys", () => {
    const onSubmit = vi.fn();
    const { getByTestId } = render(<Harness onSubmit={onSubmit} />);
    fireEvent.keyDown(getByTestId("input"), { key: "a" });
    fireEvent.keyDown(getByTestId("input"), { key: "Escape" });
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
