# @benkalegin/ui26

Shared UI primitives, hooks, and theme tokens used by `@benkalegin/clouddiagram-editor` and the axonize app.

## Status

Pre-release scaffold (`0.0.0`). Surface area is being built up incrementally.

## Planned exports

- **Theme**: CSS variables (light + dark) plus an `applyTheme(mode)` helper. Consumers import `@benkalegin/ui26/theme.css` once at the app root.
- **Hooks**: `useEscapeKey`, `useClickOutside`, `useEnterSubmit`, `useFocusTrap`.
- **Primitives**: `Dialog`, `Drawer`, `Popover`, `Menu`, `Tooltip`, `Tabs`, `Collapsible`, `Dropdown`, form fields. Built on `@floating-ui/react` for anchor positioning.

## Dev

```bash
pnpm install
pnpm typecheck
pnpm build
pnpm test
```

## Consumers

- `@benkalegin/clouddiagram-editor` — embedded in axonize, also published standalone.
- `axonize` — Electron app; replaces its hand-rolled `src/renderer/components/primitives/`.
