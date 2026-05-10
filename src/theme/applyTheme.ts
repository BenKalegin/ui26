import { THEMES, DEFAULT_THEME_ID, type ThemeId, type ThemeMeta, type ThemeColors } from "./themes";

const COLOR_TO_CSS_VAR: Record<keyof ThemeColors, string> = {
  bgBase: "--bg-base",
  bgSurface: "--bg-surface",
  bgOverlay: "--bg-overlay",
  bgMuted: "--bg-muted",
  textPrimary: "--text-primary",
  textSecondary: "--text-secondary",
  textMuted: "--text-muted",
  accent: "--accent",
  accentHover: "--accent-hover",
  green: "--green",
  red: "--red",
  yellow: "--yellow",
  border: "--border",
  scrollbarBg: "--scrollbar-bg",
  scrollbarThumb: "--scrollbar-thumb",
  diffAddedBg: "--diff-added-bg",
  diffRemovedBg: "--diff-removed-bg"
};

let _activeTheme: ThemeMeta = THEMES.find((t) => t.id === DEFAULT_THEME_ID)!;

export function getActiveTheme(): ThemeMeta {
  return _activeTheme;
}

export function applyTheme(themeId: ThemeId): ThemeMeta {
  const theme =
    THEMES.find((t) => t.id === themeId) ?? THEMES.find((t) => t.id === DEFAULT_THEME_ID)!;
  _activeTheme = theme;

  const root = document.documentElement;
  const keys = Object.keys(COLOR_TO_CSS_VAR) as Array<keyof ThemeColors>;
  for (const key of keys) {
    root.style.setProperty(COLOR_TO_CSS_VAR[key], theme.colors[key]);
  }
  // Derived: bg-elevated tracks bg-overlay
  root.style.setProperty("--bg-elevated", theme.colors.bgOverlay);

  return theme;
}
