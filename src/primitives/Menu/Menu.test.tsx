import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Menu, MenuContent, MenuItem, MenuTrigger } from "./Menu";

describe("Menu", () => {
  it("starts closed", () => {
    render(
      <Menu>
        <MenuTrigger>Actions</MenuTrigger>
        <MenuContent>
          <MenuItem onSelect={() => {}}>Edit</MenuItem>
        </MenuContent>
      </Menu>
    );
    expect(screen.queryByRole("menu")).toBeNull();
  });

  it("opens on trigger click and renders items in body", () => {
    const { container } = render(
      <Menu>
        <MenuTrigger>Actions</MenuTrigger>
        <MenuContent>
          <MenuItem onSelect={() => {}}>Edit</MenuItem>
          <MenuItem onSelect={() => {}}>Delete</MenuItem>
        </MenuContent>
      </Menu>
    );
    fireEvent.click(screen.getByRole("button", { name: "Actions" }));
    expect(screen.getByRole("menu")).toBeInTheDocument();
    expect(screen.getAllByRole("menuitem")).toHaveLength(2);
    expect(container.querySelector(".ui26-menu")).toBeNull();
    expect(document.body.querySelector(".ui26-menu")).not.toBeNull();
  });

  it("activating an item calls onSelect and closes the menu", () => {
    const onSelect = vi.fn();
    render(
      <Menu>
        <MenuTrigger>Actions</MenuTrigger>
        <MenuContent>
          <MenuItem onSelect={onSelect}>Edit</MenuItem>
        </MenuContent>
      </Menu>
    );
    fireEvent.click(screen.getByRole("button", { name: "Actions" }));
    fireEvent.click(screen.getByRole("menuitem", { name: "Edit" }));
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("menu")).toBeNull();
  });

  it("disabled item does not fire onSelect", () => {
    const onSelect = vi.fn();
    render(
      <Menu>
        <MenuTrigger>Actions</MenuTrigger>
        <MenuContent>
          <MenuItem onSelect={onSelect} disabled>
            Delete
          </MenuItem>
        </MenuContent>
      </Menu>
    );
    fireEvent.click(screen.getByRole("button", { name: "Actions" }));
    fireEvent.click(screen.getByRole("menuitem", { name: "Delete" }));
    expect(onSelect).not.toHaveBeenCalled();
  });

  it("closes on Escape", () => {
    render(
      <Menu>
        <MenuTrigger>Actions</MenuTrigger>
        <MenuContent>
          <MenuItem onSelect={() => {}}>Edit</MenuItem>
        </MenuContent>
      </Menu>
    );
    fireEvent.click(screen.getByRole("button", { name: "Actions" }));
    fireEvent.keyDown(document.body, { key: "Escape" });
    expect(screen.queryByRole("menu")).toBeNull();
  });

  it("MenuTrigger without provider throws", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<MenuTrigger>Bare</MenuTrigger>)).toThrow(
      /must be rendered inside <Menu>/
    );
    spy.mockRestore();
  });
});
