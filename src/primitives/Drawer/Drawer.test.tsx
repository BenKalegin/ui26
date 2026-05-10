import { fireEvent, render, screen, act } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Drawer, DrawerBody, DrawerFooter, DrawerHeader } from "./Drawer";

function dispatchEscape() {
  document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
}

describe("Drawer", () => {
  it("renders nothing when closed", () => {
    render(
      <Drawer open={false} onClose={() => {}}>
        <DrawerBody>hidden</DrawerBody>
      </Drawer>
    );
    expect(screen.queryByText("hidden")).toBeNull();
  });

  it("portals into body when open", () => {
    const { container } = render(
      <Drawer open onClose={() => {}}>
        <DrawerBody>visible</DrawerBody>
      </Drawer>
    );
    expect(container.querySelector(".ui26-drawer")).toBeNull();
    expect(document.body.querySelector(".ui26-drawer")).not.toBeNull();
    expect(screen.getByText("visible")).toBeInTheDocument();
  });

  it("applies side class (default right)", () => {
    render(
      <Drawer open onClose={() => {}}>
        <DrawerBody>x</DrawerBody>
      </Drawer>
    );
    expect(document.body.querySelector(".ui26-drawer.ui26-drawer--right")).not.toBeNull();
  });

  it("applies left/top/bottom side classes", () => {
    const { rerender } = render(
      <Drawer open onClose={() => {}} side="left">
        <DrawerBody>x</DrawerBody>
      </Drawer>
    );
    expect(document.body.querySelector(".ui26-drawer--left")).not.toBeNull();
    rerender(
      <Drawer open onClose={() => {}} side="top">
        <DrawerBody>x</DrawerBody>
      </Drawer>
    );
    expect(document.body.querySelector(".ui26-drawer--top")).not.toBeNull();
    rerender(
      <Drawer open onClose={() => {}} side="bottom">
        <DrawerBody>x</DrawerBody>
      </Drawer>
    );
    expect(document.body.querySelector(".ui26-drawer--bottom")).not.toBeNull();
  });

  it("applies size as width on left/right and height on top/bottom", () => {
    const { rerender } = render(
      <Drawer open onClose={() => {}} side="right" size={400}>
        <DrawerBody>x</DrawerBody>
      </Drawer>
    );
    const right = document.body.querySelector(".ui26-drawer") as HTMLElement;
    expect(right.style.width).toBe("400px");
    rerender(
      <Drawer open onClose={() => {}} side="bottom" size="50%">
        <DrawerBody>x</DrawerBody>
      </Drawer>
    );
    const bottom = document.body.querySelector(".ui26-drawer") as HTMLElement;
    expect(bottom.style.height).toBe("50%");
  });

  it("renders overlay when modal (default)", () => {
    render(
      <Drawer open onClose={() => {}}>
        <DrawerBody>x</DrawerBody>
      </Drawer>
    );
    expect(document.body.querySelector(".ui26-drawer__overlay")).not.toBeNull();
  });

  it("does not render overlay when modal=false", () => {
    render(
      <Drawer open onClose={() => {}} modal={false}>
        <DrawerBody>x</DrawerBody>
      </Drawer>
    );
    expect(document.body.querySelector(".ui26-drawer__overlay")).toBeNull();
  });

  it("calls onClose on Escape", () => {
    const onClose = vi.fn();
    render(
      <Drawer open onClose={onClose}>
        <DrawerBody>x</DrawerBody>
      </Drawer>
    );
    act(() => dispatchEscape());
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose on overlay mousedown when modal", () => {
    const onClose = vi.fn();
    render(
      <Drawer open onClose={onClose}>
        <DrawerBody>x</DrawerBody>
      </Drawer>
    );
    fireEvent.mouseDown(document.body.querySelector(".ui26-drawer__overlay") as HTMLElement);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("does not close on outside click when modal=false", () => {
    const onClose = vi.fn();
    render(
      <>
        <Drawer open onClose={onClose} modal={false}>
          <DrawerBody>x</DrawerBody>
        </Drawer>
        <div data-testid="outside">outside</div>
      </>
    );
    fireEvent.mouseDown(screen.getByTestId("outside"));
    expect(onClose).not.toHaveBeenCalled();
  });

  it("DrawerHeader close button calls onClose", () => {
    const onClose = vi.fn();
    render(
      <Drawer open onClose={onClose}>
        <DrawerHeader onClose={onClose}>Title</DrawerHeader>
        <DrawerBody>body</DrawerBody>
        <DrawerFooter>
          <button>OK</button>
        </DrawerFooter>
      </Drawer>
    );
    fireEvent.click(screen.getByLabelText("Close"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("sets role=dialog and aria-modal=true when modal", () => {
    render(
      <Drawer open onClose={() => {}} ariaLabel="My drawer">
        <DrawerBody>x</DrawerBody>
      </Drawer>
    );
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAttribute("aria-label", "My drawer");
  });
});
