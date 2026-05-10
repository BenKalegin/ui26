import { render, fireEvent, screen, act } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Dialog, DialogBody, DialogFooter, DialogHeader } from "./Dialog";

function dispatchEscape() {
  document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
}

describe("Dialog", () => {
  it("renders children when open", () => {
    render(
      <Dialog open onClose={() => {}}>
        <DialogBody>hello</DialogBody>
      </Dialog>
    );
    expect(screen.getByText("hello")).toBeInTheDocument();
  });

  it("renders nothing when closed", () => {
    render(
      <Dialog open={false} onClose={() => {}}>
        <DialogBody>hidden</DialogBody>
      </Dialog>
    );
    expect(screen.queryByText("hidden")).not.toBeInTheDocument();
  });

  it("portals into document.body", () => {
    const { container } = render(
      <Dialog open onClose={() => {}} ariaLabel="my-dialog">
        <DialogBody>portaled</DialogBody>
      </Dialog>
    );
    expect(container.querySelector(".ui26-dialog")).toBeNull();
    expect(document.body.querySelector(".ui26-dialog")).not.toBeNull();
  });

  it("calls onClose on Escape", () => {
    const onClose = vi.fn();
    render(
      <Dialog open onClose={onClose}>
        <DialogBody>x</DialogBody>
      </Dialog>
    );
    act(() => dispatchEscape());
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("does not close on Escape when closeOnEscape is false", () => {
    const onClose = vi.fn();
    render(
      <Dialog open onClose={onClose} closeOnEscape={false}>
        <DialogBody>x</DialogBody>
      </Dialog>
    );
    act(() => dispatchEscape());
    expect(onClose).not.toHaveBeenCalled();
  });

  it("closes on overlay mousedown", () => {
    const onClose = vi.fn();
    render(
      <Dialog open onClose={onClose}>
        <DialogBody>x</DialogBody>
      </Dialog>
    );
    const overlay = document.querySelector(".ui26-dialog__overlay") as HTMLElement;
    fireEvent.mouseDown(overlay);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("does not close on dialog content mousedown", () => {
    const onClose = vi.fn();
    render(
      <Dialog open onClose={onClose}>
        <DialogBody>inside</DialogBody>
      </Dialog>
    );
    fireEvent.mouseDown(screen.getByText("inside"));
    expect(onClose).not.toHaveBeenCalled();
  });

  it("does not close on overlay mousedown when closeOnClickOutside is false", () => {
    const onClose = vi.fn();
    render(
      <Dialog open onClose={onClose} closeOnClickOutside={false}>
        <DialogBody>x</DialogBody>
      </Dialog>
    );
    fireEvent.mouseDown(document.querySelector(".ui26-dialog__overlay") as HTMLElement);
    expect(onClose).not.toHaveBeenCalled();
  });

  it("DialogHeader close button calls onClose", () => {
    const onClose = vi.fn();
    render(
      <Dialog open onClose={onClose}>
        <DialogHeader onClose={onClose}>Title</DialogHeader>
        <DialogBody>body</DialogBody>
      </Dialog>
    );
    fireEvent.click(screen.getByLabelText("Close"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("focuses the first focusable element when opened", () => {
    render(
      <Dialog open onClose={() => {}}>
        <DialogFooter>
          <button data-testid="ok">OK</button>
          <button data-testid="cancel">Cancel</button>
        </DialogFooter>
      </Dialog>
    );
    expect(document.activeElement).toBe(screen.getByTestId("ok"));
  });

  it("applies className and overlayClassName", () => {
    render(
      <Dialog open onClose={() => {}} className="custom-dialog" overlayClassName="custom-overlay">
        <DialogBody>x</DialogBody>
      </Dialog>
    );
    expect(document.querySelector(".ui26-dialog.custom-dialog")).not.toBeNull();
    expect(document.querySelector(".ui26-dialog__overlay.custom-overlay")).not.toBeNull();
  });

  it("sets role=dialog and aria-modal=true", () => {
    render(
      <Dialog open onClose={() => {}} ariaLabel="My modal">
        <DialogBody>x</DialogBody>
      </Dialog>
    );
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAttribute("aria-label", "My modal");
  });
});
