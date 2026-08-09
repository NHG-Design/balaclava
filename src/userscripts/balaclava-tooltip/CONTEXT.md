# BalaclavaTooltip Userscript

## Overview

`balaclava-tooltip` is a self-contained, dependency-free tooltip engine shared across balaclava userscripts, so tooltip UI/positioning/theming logic isn't duplicated per script. It renders into an isolated Shadow DOM host, auto-discovers `data-balaclava-tooltip` attributes via a `MutationObserver`, and exposes an imperative API on the global window (`unsafeWindow.BalaclavaTooltip` / `window.BalaclavaTooltip`) for consumer scripts to call directly. Currently consumed by `arsonists-ledger` (see `../arsonists-ledger/CONTEXT.md`).

## Language

- **BalaclavaTooltipAPI**: The public surface exposed on `unsafeWindow.BalaclavaTooltip` — `version`, `show()`, `hide()`, `configure()`, `attach()`, `rescan()` (aliased `scanAll`), `destroy()`.
- **Host / Shadow root**: A single fixed-position `<div id="balaclava-tooltip-host">` with `attachShadow({ mode: 'closed' })`, isolating tooltip styles from page CSS. _Avoid_: "tooltip container" (the host is the shadow-root attach point, not the visible tooltip element)
- **TooltipConfig / TooltipThemeTokens**: The shape passed to `configure()` — theme (`system | dark | light | custom`), colors, `borderRadius`, `padding`, `maxWidth`, arrow sizing, `zIndex`, `offset`.
- **Auto-scan attribute convention**: `data-balaclava-tooltip`, `-position`, `-arrow`, `-theme` — elements bearing these are found and attached automatically by `rescan()`/the internal `MutationObserver`, as an alternative to calling `attach()` imperatively.
- **Cooldown / instant re-show**: `tooltipCooldownEnd` / `nextShowInstant` internal state that skips the enter animation when a user rapidly re-hovers the same or a different target within 600ms of `hide()`.
- **Internal VERSION**: The `const VERSION` at the top of `index.ts`, used only for the re-injection guard and the `api.version` field. This is a separate number from the userscript's `@version` header (sourced from `versions.json`'s `balaclava-tooltip` key) — the two can drift and mean different things.

## Architecture

A single IIFE guarded by `if (!rootWindow[API_NAME]?.version)`, so re-injection (e.g. a consumer script loading it twice) is a no-op. All state (host, shadow root, config, tracked target element/rect, observers) is closed over by module-scope functions — no classes. The positioning pipeline is `getInitialPosition` → `applyFallback` (flips position if it would overflow) → `clampToViewport` (also recomputes arrow offset), driven by `requestAnimationFrame` polling in `trackTargetPosition` plus `resize`/`scroll` listeners and an `IntersectionObserver` that hides the tooltip if its target scrolls out of view. A `MutationObserver` on `document.body` handles both dynamic-DOM attribute scanning and attachment cleanup when elements are removed.

## Key Patterns

- **Build**: bundled as a standalone IIFE to `dist/balaclava-tooltip.js` via esbuild in `scripts/build-userscripts.mjs`.
- **Consumption**: `arsonists-ledger/index.ts` currently inlines it via `import "../balaclava-tooltip/index.js"` (bundled together at build time) rather than a real userscript `@require`, because TornPDA doesn't yet support `@require` — `build-userscripts.mjs` has a commented-out `require:` block to switch to once supported.
- **Versioning**: per `docs/adr/0002-userscript-versions-in-versions-json.md`, the userscript's `@version` header comes from `versions.json`. The internal `VERSION` constant in `index.ts` is unrelated and only guards re-injection/reports via `api.version` — bumping one does not bump the other.
- **Duck-typed consumption**: consumer scripts don't import the type; they look up `unsafeWindow.BalaclavaTooltip` (falling back to `window`), duck-type via `typeof api.show === 'function'`, and no-op with a console warning if the API is absent — the dependency is soft, not enforced.
- **Global exposure**: `exposeApi()` sets the API on both `unsafeWindow` and `window` when they differ, to support Tampermonkey's `unsafeWindow` proxy and plain page contexts alike.

## Known Gaps

- The internal `VERSION` constant and the `versions.json`-sourced `@version` userscript header are two independent numbers that can silently drift out of sync — do not assume they match.
- `destroy()` only removes the global `BalaclavaTooltip` property if `version` still matches the instance being destroyed, to avoid clobbering a newer instance loaded after it — relevant if debugging double-injection issues.
