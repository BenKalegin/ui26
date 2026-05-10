import { fireEvent, render, screen, act } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { Tooltip } from "./Tooltip";

describe("Tooltip", () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("is hidden by default", () => {
    render(
      <Tooltip content="Description">
        <button>Hover me</button>
      </Tooltip>
    );
    expect(screen.queryByRole("tooltip")).toBeNull();
  });

  it("opens after hover delay", () => {
    render(
      <Tooltip content="Description" delay={150}>
        <button>Hover me</button>
      </Tooltip>
    );
    fireEvent.mouseEnter(screen.getByRole("button", { name: "Hover me" }));
    expect(screen.queryByRole("tooltip")).toBeNull();
    act(() => {
      vi.advanceTimersByTime(150);
    });
    expect(screen.getByRole("tooltip")).toHaveTextContent("Description");
  });

  it("closes on mouse leave", () => {
    render(
      <Tooltip content="Description" delay={0}>
        <button>Hover me</button>
      </Tooltip>
    );
    const trigger = screen.getByRole("button", { name: "Hover me" });
    fireEvent.mouseEnter(trigger);
    act(() => {
      vi.runAllTimers();
    });
    expect(screen.getByRole("tooltip")).toBeInTheDocument();
    fireEvent.mouseLeave(trigger);
    expect(screen.queryByRole("tooltip")).toBeNull();
  });

  it("opens on focus and closes on blur", () => {
    render(
      <Tooltip content="Description">
        <button>Focus me</button>
      </Tooltip>
    );
    const trigger = screen.getByRole("button", { name: "Focus me" });
    fireEvent.focus(trigger);
    expect(screen.getByRole("tooltip")).toBeInTheDocument();
    fireEvent.blur(trigger);
    act(() => {
      vi.runAllTimers();
    });
    expect(screen.queryByRole("tooltip")).toBeNull();
  });

  it("portals tooltip into body", () => {
    const { container } = render(
      <Tooltip content="Description" delay={0}>
        <button>Hover me</button>
      </Tooltip>
    );
    fireEvent.mouseEnter(screen.getByRole("button"));
    act(() => {
      vi.runAllTimers();
    });
    expect(container.querySelector(".ui26-tooltip")).toBeNull();
    expect(document.body.querySelector(".ui26-tooltip")).not.toBeNull();
  });

  it("respects controlled open prop", () => {
    const { rerender } = render(
      <Tooltip content="Description" open={false}>
        <button>Trigger</button>
      </Tooltip>
    );
    expect(screen.queryByRole("tooltip")).toBeNull();
    rerender(
      <Tooltip content="Description" open={true}>
        <button>Trigger</button>
      </Tooltip>
    );
    expect(screen.getByRole("tooltip")).toBeInTheDocument();
  });
});
