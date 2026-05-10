export type ThemeMode = "light" | "dark";

export function applyTheme(mode: ThemeMode, target: HTMLElement = document.documentElement): void {
  target.setAttribute("data-theme", mode);
}
