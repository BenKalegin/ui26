import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { IconButton } from "./IconButton";

describe("IconButton", () => {
  it("renders with required aria-label and default md size", () => {
    render(<IconButton aria-label="Settings">⚙</IconButton>);
    const btn = screen.getByRole("button", { name: "Settings" });
    expect(btn.className).toContain("ui26-icon-btn--md");
    expect(btn).toHaveAttribute("type", "button");
  });

  it("applies size override", () => {
    render(
      <IconButton aria-label="Close" size="sm">
        ×
      </IconButton>
    );
    expect(screen.getByRole("button", { name: "Close" }).className).toContain("ui26-icon-btn--sm");
  });

  it("forwards onClick", () => {
    const onClick = vi.fn();
    render(
      <IconButton aria-label="Tap" onClick={onClick}>
        ★
      </IconButton>
    );
    fireEvent.click(screen.getByRole("button", { name: "Tap" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("respects disabled", () => {
    const onClick = vi.fn();
    render(
      <IconButton aria-label="Off" onClick={onClick} disabled>
        ●
      </IconButton>
    );
    fireEvent.click(screen.getByRole("button", { name: "Off" }));
    expect(onClick).not.toHaveBeenCalled();
  });
});
