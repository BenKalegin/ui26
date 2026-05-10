import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Popover, PopoverContent, PopoverTrigger } from "./Popover";

describe("Popover", () => {
  it("starts closed", () => {
    render(
      <Popover>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>Hi</PopoverContent>
      </Popover>
    );
    expect(screen.queryByText("Hi")).toBeNull();
    expect(screen.getByRole("button", { name: "Open" })).toHaveAttribute("data-state", "closed");
  });

  it("opens on trigger click and portals content to body", () => {
    const { container } = render(
      <Popover>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>Hi</PopoverContent>
      </Popover>
    );
    fireEvent.click(screen.getByRole("button", { name: "Open" }));
    expect(screen.getByText("Hi")).toBeInTheDocument();
    expect(container.querySelector(".ui26-popover")).toBeNull();
    expect(document.body.querySelector(".ui26-popover")).not.toBeNull();
  });

  it("closes on Escape", () => {
    render(
      <Popover>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>Hi</PopoverContent>
      </Popover>
    );
    fireEvent.click(screen.getByRole("button", { name: "Open" }));
    expect(screen.getByText("Hi")).toBeInTheDocument();
    fireEvent.keyDown(document.body, { key: "Escape" });
    expect(screen.queryByText("Hi")).toBeNull();
  });

  it("closes on outside press", () => {
    render(
      <>
        <Popover>
          <PopoverTrigger>Open</PopoverTrigger>
          <PopoverContent>Hi</PopoverContent>
        </Popover>
        <div data-testid="outside">outside</div>
      </>
    );
    fireEvent.click(screen.getByRole("button", { name: "Open" }));
    fireEvent.pointerDown(screen.getByTestId("outside"));
    fireEvent.mouseDown(screen.getByTestId("outside"));
    expect(screen.queryByText("Hi")).toBeNull();
  });

  it("does not close on Escape when closeOnEscape is false", () => {
    render(
      <Popover closeOnEscape={false}>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>Hi</PopoverContent>
      </Popover>
    );
    fireEvent.click(screen.getByRole("button", { name: "Open" }));
    fireEvent.keyDown(document.body, { key: "Escape" });
    expect(screen.getByText("Hi")).toBeInTheDocument();
  });

  it("controlled mode honors open and onOpenChange", () => {
    const onOpenChange = vi.fn();
    const { rerender } = render(
      <Popover open={false} onOpenChange={onOpenChange}>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>Hi</PopoverContent>
      </Popover>
    );
    expect(screen.queryByText("Hi")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Open" }));
    expect(onOpenChange).toHaveBeenCalledWith(true);
    rerender(
      <Popover open={true} onOpenChange={onOpenChange}>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>Hi</PopoverContent>
      </Popover>
    );
    expect(screen.getByText("Hi")).toBeInTheDocument();
  });

  it("PopoverTrigger uses without provider throws", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<PopoverTrigger>Bare</PopoverTrigger>)).toThrow(
      /must be rendered inside <Popover>/
    );
    spy.mockRestore();
  });
});
