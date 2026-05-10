import { afterEach, describe, expect, it } from "vitest";
import { applyTheme, getActiveTheme } from "./applyTheme";
import { DEFAULT_THEME_ID, findTheme, THEMES, ThemeId } from "./themes";

afterEach(() => {
  applyTheme(DEFAULT_THEME_ID);
});

describe("applyTheme", () => {
  it("writes every color token as a CSS custom property on <html>", () => {
    const theme = applyTheme(ThemeId.Nord);
    const style = document.documentElement.style;
    expect(style.getPropertyValue("--bg-base").trim()).toBe(theme.colors.bgBase);
    expect(style.getPropertyValue("--text-primary").trim()).toBe(theme.colors.textPrimary);
    expect(style.getPropertyValue("--accent").trim()).toBe(theme.colors.accent);
    expect(style.getPropertyValue("--diff-removed-bg").trim()).toBe(theme.colors.diffRemovedBg);
  });

  it("writes the derived --bg-elevated equal to bgOverlay", () => {
    const theme = applyTheme(ThemeId.Dracula);
    expect(document.documentElement.style.getPropertyValue("--bg-elevated").trim()).toBe(
      theme.colors.bgOverlay
    );
  });

  it("falls back to the default theme on an unknown id", () => {
    const result = applyTheme("not-a-theme" as ThemeId);
    expect(result.id).toBe(DEFAULT_THEME_ID);
  });

  it("updates getActiveTheme", () => {
    applyTheme(ThemeId.GithubLight);
    expect(getActiveTheme().id).toBe(ThemeId.GithubLight);
  });

  it("registers all 9 themes", () => {
    expect(THEMES).toHaveLength(9);
    expect(findTheme(ThemeId.CatppuccinMocha)).toBeDefined();
    expect(findTheme(ThemeId.Graphite)).toBeDefined();
    expect(findTheme(ThemeId.GruvboxLight)).toBeDefined();
  });
});
