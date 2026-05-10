import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Switch } from "./Switch";

describe("Switch", () => {
  it("renders an input with role=switch", () => {
    render(<Switch label="Notify" checked={false} onChange={() => {}} />);
    const input = screen.getByRole("switch", { name: "Notify" });
    expect(input).toHaveAttribute("type", "checkbox");
  });

  it("calls onChange with new boolean", () => {
    const onChange = vi.fn();
    render(<Switch label="Notify" checked={false} onChange={onChange} />);
    fireEvent.click(screen.getByRole("switch", { name: "Notify" }));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it("reflects controlled checked state", () => {
    const { rerender } = render(<Switch label="On" checked={false} onChange={() => {}} />);
    expect(screen.getByRole("switch")).not.toBeChecked();
    rerender(<Switch label="On" checked={true} onChange={() => {}} />);
    expect(screen.getByRole("switch")).toBeChecked();
  });

  it("propagates disabled to the underlying input", () => {
    render(<Switch label="Off" checked={false} onChange={() => {}} disabled />);
    expect(screen.getByRole("switch")).toBeDisabled();
  });

  it("renders label text", () => {
    render(<Switch label="Verbose" checked={false} onChange={() => {}} />);
    expect(screen.getByText("Verbose")).toBeInTheDocument();
  });
});
