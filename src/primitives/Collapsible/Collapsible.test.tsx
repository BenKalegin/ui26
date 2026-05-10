import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Collapsible, CollapsibleWithChevron } from "./Collapsible";

describe("Collapsible", () => {
  it("is closed by default", () => {
    render(
      <Collapsible trigger="Section">
        <div>body</div>
      </Collapsible>
    );
    expect(screen.queryByText("body")).toBeNull();
    expect(screen.getByRole("button", { name: "Section" })).toHaveAttribute("aria-expanded", "false");
  });

  it("respects defaultOpen", () => {
    render(
      <Collapsible trigger="Section" defaultOpen>
        <div>body</div>
      </Collapsible>
    );
    expect(screen.getByText("body")).toBeInTheDocument();
  });

  it("toggles on trigger click (uncontrolled)", () => {
    render(
      <Collapsible trigger="Section">
        <div>body</div>
      </Collapsible>
    );
    const trigger = screen.getByRole("button", { name: "Section" });
    fireEvent.click(trigger);
    expect(screen.getByText("body")).toBeInTheDocument();
    fireEvent.click(trigger);
    expect(screen.queryByText("body")).toBeNull();
  });

  it("controlled mode honors open prop and onOpenChange", () => {
    const onOpenChange = vi.fn();
    const { rerender } = render(
      <Collapsible trigger="Section" open={false} onOpenChange={onOpenChange}>
        <div>body</div>
      </Collapsible>
    );
    expect(screen.queryByText("body")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Section" }));
    expect(onOpenChange).toHaveBeenCalledWith(true);
    rerender(
      <Collapsible trigger="Section" open={true} onOpenChange={onOpenChange}>
        <div>body</div>
      </Collapsible>
    );
    expect(screen.getByText("body")).toBeInTheDocument();
  });

  it("trigger function receives the open state", () => {
    const trigger = vi.fn((open: boolean) => <span>{open ? "open" : "closed"}</span>);
    const { rerender } = render(
      <Collapsible trigger={trigger}>
        <div>body</div>
      </Collapsible>
    );
    expect(screen.getByText("closed")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button"));
    rerender(
      <Collapsible trigger={trigger}>
        <div>body</div>
      </Collapsible>
    );
    expect(screen.getByText("open")).toBeInTheDocument();
  });
});

describe("CollapsibleWithChevron", () => {
  it("renders left chevron by default and switches glyph on toggle", () => {
    render(
      <CollapsibleWithChevron header="Folder">
        <div>contents</div>
      </CollapsibleWithChevron>
    );
    const trigger = screen.getByRole("button");
    expect(trigger.textContent).toContain("▸");
    fireEvent.click(trigger);
    expect(trigger.textContent).toContain("▾");
  });

  it("supports custom chevron icons", () => {
    render(
      <CollapsibleWithChevron
        header="Folder"
        defaultOpen
        chevronIcons={{ open: "[-]", closed: "[+]" }}
      >
        <div>contents</div>
      </CollapsibleWithChevron>
    );
    expect(screen.getByRole("button").textContent).toContain("[-]");
  });
});
