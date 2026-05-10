import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Tab, TabList, TabPanel, Tabs } from "./Tabs";

function renderTabs(props: { value?: string; defaultValue?: string; onValueChange?: (v: string) => void } = {}) {
  return render(
    <Tabs {...props}>
      <TabList ariaLabel="Sections">
        <Tab value="overview">Overview</Tab>
        <Tab value="settings">Settings</Tab>
        <Tab value="logs" disabled>
          Logs
        </Tab>
      </TabList>
      <TabPanel value="overview">overview content</TabPanel>
      <TabPanel value="settings">settings content</TabPanel>
      <TabPanel value="logs">logs content</TabPanel>
    </Tabs>
  );
}

describe("Tabs", () => {
  it("renders tablist with selected initial tab", () => {
    renderTabs({ defaultValue: "overview" });
    expect(screen.getByRole("tablist")).toHaveAttribute("aria-label", "Sections");
    const overview = screen.getByRole("tab", { name: "Overview" });
    expect(overview).toHaveAttribute("aria-selected", "true");
    expect(overview).toHaveAttribute("tabindex", "0");
    expect(screen.getByRole("tab", { name: "Settings" })).toHaveAttribute("tabindex", "-1");
  });

  it("renders only the active panel", () => {
    renderTabs({ defaultValue: "overview" });
    expect(screen.getByText("overview content")).toBeInTheDocument();
    expect(screen.queryByText("settings content")).toBeNull();
  });

  it("clicking a tab activates its panel (uncontrolled)", () => {
    renderTabs({ defaultValue: "overview" });
    fireEvent.click(screen.getByRole("tab", { name: "Settings" }));
    expect(screen.getByText("settings content")).toBeInTheDocument();
    expect(screen.queryByText("overview content")).toBeNull();
  });

  it("controlled mode honors value and onValueChange", () => {
    const onValueChange = vi.fn();
    const { rerender } = render(
      <Tabs value="overview" onValueChange={onValueChange}>
        <TabList>
          <Tab value="overview">Overview</Tab>
          <Tab value="settings">Settings</Tab>
        </TabList>
        <TabPanel value="overview">overview content</TabPanel>
        <TabPanel value="settings">settings content</TabPanel>
      </Tabs>
    );
    fireEvent.click(screen.getByRole("tab", { name: "Settings" }));
    expect(onValueChange).toHaveBeenCalledWith("settings");
    expect(screen.getByText("overview content")).toBeInTheDocument();
    rerender(
      <Tabs value="settings" onValueChange={onValueChange}>
        <TabList>
          <Tab value="overview">Overview</Tab>
          <Tab value="settings">Settings</Tab>
        </TabList>
        <TabPanel value="overview">overview content</TabPanel>
        <TabPanel value="settings">settings content</TabPanel>
      </Tabs>
    );
    expect(screen.getByText("settings content")).toBeInTheDocument();
  });

  it("ArrowRight moves focus to next non-disabled tab and wraps", () => {
    renderTabs({ defaultValue: "overview" });
    const overview = screen.getByRole("tab", { name: "Overview" });
    const settings = screen.getByRole("tab", { name: "Settings" });
    overview.focus();
    fireEvent.keyDown(screen.getByRole("tablist"), { key: "ArrowRight" });
    expect(document.activeElement).toBe(settings);
    fireEvent.keyDown(screen.getByRole("tablist"), { key: "ArrowRight" });
    expect(document.activeElement).toBe(overview);
  });

  it("ArrowLeft wraps to last", () => {
    renderTabs({ defaultValue: "overview" });
    const overview = screen.getByRole("tab", { name: "Overview" });
    const settings = screen.getByRole("tab", { name: "Settings" });
    overview.focus();
    fireEvent.keyDown(screen.getByRole("tablist"), { key: "ArrowLeft" });
    expect(document.activeElement).toBe(settings);
  });

  it("Home goes to first, End goes to last", () => {
    renderTabs({ defaultValue: "settings" });
    const overview = screen.getByRole("tab", { name: "Overview" });
    const settings = screen.getByRole("tab", { name: "Settings" });
    settings.focus();
    fireEvent.keyDown(screen.getByRole("tablist"), { key: "Home" });
    expect(document.activeElement).toBe(overview);
    fireEvent.keyDown(screen.getByRole("tablist"), { key: "End" });
    expect(document.activeElement).toBe(settings);
  });

  it("disabled tab cannot be activated by click", () => {
    renderTabs({ defaultValue: "overview" });
    const logs = screen.getByRole("tab", { name: "Logs" });
    expect(logs).toBeDisabled();
    fireEvent.click(logs);
    expect(screen.getByText("overview content")).toBeInTheDocument();
  });

  it("Tab without provider throws", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() =>
      render(
        <Tab value="x">Bare</Tab>
      )
    ).toThrow(/must be rendered inside <Tabs>/);
    spy.mockRestore();
  });

  it("aria-controls and aria-labelledby form a matching pair", () => {
    renderTabs({ defaultValue: "overview" });
    const tab = screen.getByRole("tab", { name: "Overview" });
    const panel = screen.getByRole("tabpanel");
    expect(tab.getAttribute("aria-controls")).toBe(panel.id);
    expect(panel.getAttribute("aria-labelledby")).toBe(tab.id);
  });
});
