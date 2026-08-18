# Recipe Tooltip Material Icons & Colors

> Meridian map · Status: route-ready · Started: 2026-08-18

## Destination

Add two new opt-in (off by default) Visuals > Materials settings to the Arsonist's Ledger scenario recipe tooltip: (1) tiny inline icons next to each liquid/solid/gas material name, and (2) per-material text coloring for those same material names — igniters and dampeners untouched by both.

## Bearings

- **Brought as:** feature
- **Context:** The scenario recipe tooltip (`tooltip.ts`, `actionSection()`, `tooltip.ts:41-92`) renders each `ActionItem` as `{qty}× {name}` plain text via `nameEl.textContent` (`tooltip.ts:69`). This is distinct from the existing `material-badges` popover work ([[material-badges]]) — that targets Torn's native item-selector popover; this targets the userscript's own recipe tooltip. Settings for this tooltip already live in `buildVisualsTab()` (`settings.ts:603-739`), with an existing "Materials" group (`settings.ts:688-736`) holding a `Show material data` toggle-row and sub-checkboxes for intensity/momentum/suspicion/ignition risk/stoking risk. `CATALOG` (`src/data/catalog.ts`) already has everything needed to scope and render: `category: 'liquid' | 'solid' | 'gaseous' | 'igniter' | 'dampener' | 'misc'` and `tornId` (Torn's numeric item id, used in image URLs like `/images/items/172/medium.png` per `plans/arson/references/arson-crime-markup-materials-popover.html`).
- **Appetite:** Light — two checkboxes, reuse existing patterns (`checkboxRow`, `GM_setValue` persistence, `CATALOG` category field), no new visual exploration.
- **For:** Arsonist's Ledger users who want faster visual recognition of materials in the recipe tooltip, both as a supplement (icons) and as a stronger signal (color) than name-only text.

## Decision log

| # | Decision | Resolution | Via |
|---|----------|------------|-----|
| 1 | Icon source & shape | Torn's own item image (`/images/items/{tornId}/medium.png`, same source as the popover reference), scaled down to icon size (~12–14px) and cropped/masked to a square — not the native ~60×30 wide sprite, since these render inline with text. | J |
| 2 | Toggle coupling | Fully independent — "Show material icons" and "Color material text" are two separate checkboxes in the Materials settings group, any combination on/off, matching the existing flat checkbox-row pattern. | J |
| 3 | Color config location | Per-material color map (one color per individual material — Gasoline, Diesel, Kerosene, Potassium Nitrate, Magnesium Shavings, Thermite, Oxygen Tank, Methane Tank, Hydrogen Tank), hardcoded as constants (not user-editable in the settings UI, not category-level). | J |
| 4 | Scope | Both features apply only to liquids/solids/gases (`CATALOG[id].category` in `'liquid' \| 'solid' \| 'gaseous'`) — igniters and dampeners get neither icon nor color, consistent with "materials" meaning accelerants throughout this codebase's settings naming. | J |

## Fog

- Actual hex/color values per material — user said "I will be providing the colors." Route work can land with placeholder colors (or a clearly-marked TODO map) but final values are pending user input before ship.

## Ruled out

- Category-level color map (liquid/solid/gas, 3 colors) — rejected in favor of per-material granularity (decision #3).
- Coupling "color" setting to require "icons" enabled first — rejected; kept fully independent (decision #2).
- Generic category glyph icons (droplet/cube/vapor-cloud) instead of real item art — rejected in favor of Torn's actual item image, cropped square (decision #1).

## Route

1. [ ] Add a per-material color constant map keyed by `ResourceId` (liquids/solids/gases only) to `colors.ts`, using placeholder values pending the user-supplied palette — acceptance: `pnpm check` passes; map covers exactly the 9 liquid/solid/gas resource ids in `CATALOG` — from decisions #3, #4
2. [ ] Add two new persisted settings — `showMaterialIcons` and `showMaterialTextColor` — following the existing `showMaterialIntensity`-style get/set/`GM_setValue` pattern in `index.ts` (state, getters/setters, `SettingsCtx` wiring) — from decision #2
3. [ ] Add the two checkbox rows to the Materials group in `buildVisualsTab()` (`settings.ts:688-736`), alongside the existing intensity/momentum/suspicion/etc. rows — acceptance: rows render under Materials, off by default, persist across reload — from decision #2
4. [ ] Update `actionSection()` in `tooltip.ts` (`tooltip.ts:41-92`) to thread through the two new option flags: when icons enabled, prepend a small `<img>` (or CSS background) sized/cropped per decision #1, sourced from `CATALOG[item.resourceId].tornId`, before the name text — but only for items whose `category` is `liquid`/`solid`/`gaseous`; when color enabled, apply the per-material color from the new map to `nameEl` for the same category scope — igniters/dampeners/misc pass through unchanged either way — from decisions #1, #3, #4
5. [ ] Add/adjust CSS for the new inline icon (size, square crop/object-fit, vertical alignment with text) in the userscript's injected stylesheet — acceptance: icon doesn't distort line height or wrap awkwardly at narrow tooltip widths — from decision #1
6. [ ] Manual verification on the live Arson page: toggle each setting independently and together, confirm igniters/dampeners are unaffected, confirm off-by-default on fresh install — from decisions #2, #4
7. [ ] Swap in the user-supplied final color values once provided, replacing the Route #1 placeholders — from Fog entry

**First move:** Route #1 — stand up the placeholder per-material color map, since the settings wiring (#2/#3) and tooltip rendering (#4) both need a color source to read from even before final values land.
