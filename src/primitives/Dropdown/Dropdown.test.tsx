import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Dropdown, DropdownItem } from "./Dropdown";

describe("Dropdown", () => {
  it("is closed by default", () => {
    render(
      <Dropdown trigger="Open">
        <DropdownItem onClick={() => {}}>One</DropdownItem>
      </Dropdown>
    );
    expect(screen.queryByRole("menu")).toBeNull();
    expect(screen.getByRole("button", { name: "Open" })).toHaveAttribute("aria-expanded", "false");
  });

  it("opens on trigger click and shows items", () => {
    render(
      <Dropdown trigger="Open">
        <DropdownItem onClick={() => {}}>One</DropdownItem>
        <DropdownItem onClick={() => {}}>Two</DropdownItem>
      </Dropdown>
    );
    fireEvent.click(screen.getByRole("button", { name: "Open" }));
    expect(screen.getByRole("menu")).toBeInTheDocument();
    expect(screen.getAllByRole("menuitem")).toHaveLength(2);
  });

  it("toggles closed when trigger clicked again", () => {
    render(
      <Dropdown trigger="Open">
        <DropdownItem onClick={() => {}}>One</DropdownItem>
      </Dropdown>
    );
    const trigger = screen.getByRole("button", { name: "Open" });
    fireEvent.click(trigger);
    fireEvent.click(trigger);
    expect(screen.queryByRole("menu")).toBeNull();
  });

  it("closes on outside mousedown", () => {
    render(
      <>
        <Dropdown trigger="Open">
          <DropdownItem onClick={() => {}}>One</DropdownItem>
        </Dropdown>
        <div data-testid="outside">outside</div>
      </>
    );
    fireEvent.click(screen.getByRole("button", { name: "Open" }));
    fireEvent.mouseDown(screen.getByTestId("outside"));
    expect(screen.queryByRole("menu")).toBeNull();
  });

  it("DropdownItem fires onClick when not disabled", () => {
    const onClick = vi.fn();
    render(
      <Dropdown trigger="Open">
        <DropdownItem onClick={onClick}>Pick me</DropdownItem>
      </Dropdown>
    );
    fireEvent.click(screen.getByRole("button", { name: "Open" }));
    fireEvent.click(screen.getByRole("menuitem", { name: "Pick me" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("disabled DropdownItem does not fire onClick", () => {
    const onClick = vi.fn();
    render(
      <Dropdown trigger="Open">
        <DropdownItem onClick={onClick} disabled>
          No
        </DropdownItem>
      </Dropdown>
    );
    fireEvent.click(screen.getByRole("button", { name: "Open" }));
    fireEvent.click(screen.getByRole("menuitem", { name: "No" }));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("controlled mode honors open prop and onOpenChange", () => {
    const onOpenChange = vi.fn();
    const { rerender } = render(
      <Dropdown trigger="Open" open={false} onOpenChange={onOpenChange}>
        <DropdownItem onClick={() => {}}>One</DropdownItem>
      </Dropdown>
    );
    expect(screen.queryByRole("menu")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Open" }));
    expect(onOpenChange).toHaveBeenCalledWith(true);
    rerender(
      <Dropdown trigger="Open" open={true} onOpenChange={onOpenChange}>
        <DropdownItem onClick={() => {}}>One</DropdownItem>
      </Dropdown>
    );
    expect(screen.getByRole("menu")).toBeInTheDocument();
  });
});
