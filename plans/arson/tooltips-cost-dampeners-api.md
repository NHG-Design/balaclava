# Material cost tooltips, dampener tooltips, and materials/buildings API endpoints

> Meridian map · Status: done · Started: 2026-08-15

## Destination

Show item cost in material tooltips using the existing price data, add tooltip content for the 3 dampeners (Blanket, Sand, Fire Extinguisher), refresh the accelerant/igniter numeric stat data from the user's updated source file, and add build-time-generated `materials.json` and `buildings.json` static endpoints mirroring the existing `scenarios.json` pattern.

## Bearings

- **Brought as:** feature (broader pass — appetite confirmed below)
- **Context:**
  - Material tooltips are built in `src/userscripts/arsonists-ledger/tooltip.ts`, sourced from `src/data/arson-information.ts` (`ACCELERANT_INFO`/`IGNITER_INFO`, 0-10 scale stats + `advice` string), rendered via `buildStatTooltip`/`buildStatTooltipGroup` (tooltip.ts:270-290).
  - Price data: `src/data/catalog.ts` has `defaultPrice` (static fallback, refreshed by `scripts/update-arson-prices.ts`) and `tornId` (for live API price lookup) per resource. Runtime cost = live API price (`PriceMap`, fetched via user's Torn API key) with `defaultPrice` fallback. `isTool: true` resources are excluded from **$ cost math** (`engine.ts:41` for PPN/recipe totals, `tooltip.ts:24` for the tooltip's own `itemCost` helper) but are **not** excluded from nerve cost (`engine.ts:58-70` counts every placed/stoked/dampened qty regardless of `isTool`).
  - `scripts/update-arson-prices.ts:71` currently skips refreshing `defaultPrice` for any `isTool: true` resource entirely.
  - Dampeners (`RESOURCE.BLANKET`, `SAND`, `FIRE_EXTINGUISHER`) exist in `catalog.ts` but have **zero tooltip content today** — absent from `arson-information.ts`.
  - The user supplied an updated `plans/arson/arson-information/arson-information.js` with: (a) richer accelerant/igniter stats in a new schema (`type`, `intensity` as %, `intensity_abs`, `momentum` label, `momentum_abs`, `spread` %, `ignition_risk`, `stoking_risk`, `suspicion`), (b) a new `DAMPENERS` block with real per-item advice text, (c) a `BUILDINGS` block (already the source `src/data/buildings.ts` was derived from).
  - Scenarios are served as a **static build-time-generated JSON** (`scripts/dump-scenarios.ts` → `static/arsonists-ledger/scenarios.json` + a version hash in `src/data/scenarios-version.ts`), not a live SvelteKit route. This is the pattern to mirror for materials/buildings.
- **Appetite:** broader pass — also verify/correct underlying data (Fire Extinguisher's tool/consumable flag, Potassium Nitrate gap), not just wire up UI.
- **For:** arsonists-ledger userscript users (tooltip/UI changes) and anyone consuming the new static JSON endpoints (community tooling).

## Decision log

| # | Decision | Resolution | Via |
|---|----------|------------|-----|
| 1 | Does "cost" mean Torn market price? | Yes — the existing `PriceMap`/`defaultPrice` system, not a separate stat | R |
| 2 | Is Fire Extinguisher consumed on use (like Sand) or reusable (like Blanket)? | Consumed on use — confirmed via updated `arson-information.js` DAMPENERS block ("Is consumed on use") | J (via data update) |
| 3 | Should Blanket's price be fixed even though it's excluded from $ cost math? | Yes — Blanket's price should be *shown* in its tooltip for informational value, but must stay excluded from recipe $ totals (nerve totals already correctly include it via `itemActionCount`, unaffected) | J |
| 4 | Does the new arson-information.js also supersede existing ACCELERANT_INFO/IGNITER_INFO (different scale/shape), or just add dampeners? | Refresh everything — numeric stats come from the new file's schema; existing `advice` text in `arson-information.ts` is kept as the source of truth for accelerant/igniter advice (do not overwrite with the JS file's shorter advice strings); dampener advice text comes entirely from the new file (no prior data existed) | J |
| 5 | JS file has a stray "Magnesium" entry not matching any catalog item, and is missing Potassium Nitrate entirely | Resolved as a key swap, not missing data: the JS block labeled `"Magnesium Shavings"` (intensity 31.25%, abs 10, momentum_abs 6, spread 0%, ignition_risk 3, stoking_risk 1, suspicion 3) is actually **Potassium Nitrate**'s data (confirmed by user, and matches old TS Potassium Nitrate exactly); the block labeled `"Magnesium"` (intensity 27.5%, abs 8, momentum_abs 6, spread 0%, ignition_risk 3, stoking_risk 4, suspicion 10) is actually **Magnesium Shavings**' data (matches old TS Magnesium Shavings exactly). Both get `type: "Solid"`. | J + R (cross-checked against old data) |

| 6 | Fire Extinguisher: flip `isTool` to `false` + refresh `defaultPrice` | Flip `isTool: false` (matches Sand's consumable treatment); price comes from running `scripts/update-arson-prices.ts` — `TORN_PUBLIC_API_KEY` confirmed present in `.dev.vars` | J + R |
| 7 | Should `scripts/update-arson-prices.ts`'s `isTool` skip (line 71) be relaxed so tool items like Blanket still get a refreshed `defaultPrice` for *display*? | Yes — remove the `resource.isTool` condition from the skip check (keep the `tornId === undefined` check); cost-math exclusion elsewhere (`engine.ts:41`, `tooltip.ts:24`) is a separate, already-correct check and stays untouched | J |
| 8 | New tooltip schema/UI for accelerants/igniters/dampeners | No new bar UI — refresh only the existing 5 bar values (intensity_abs, momentum_abs, suspicion, ignition_risk, stoking_risk) + advice text, same fixed 0-10 scale. `type`/`intensity %`/`spread %` stay unused. Dampeners get **no bars** (matches prior precedent in `plans/arson/material-badges.md` decision #1 — "differentiated by safety, not by comparable stats worth badging") — just the advice-text tooltip via `bindMaterialTooltip` | J |
| 9 | Where does "cost" render, unit price or recipe-qty price? | In the existing advice tooltip (`bindMaterialTooltip`, `material-badges.ts:245-260` — same place name+advice already show), as **unit price** only (e.g. "$4.2k/ea") — this popover has no recipe/qty context; per-recipe cost already shows elsewhere via the existing "Show resource prices" toggle | R (only one option existed given the popover's context) |
| 10 | materials.json shape | Catalog + info merged — one self-contained object per resource combining `catalog.ts` fields with `arson-information.ts` stats/advice (matches `scenarios.json`'s self-contained shape) | J |
| 11 | buildings.json shape | Dump `BUILDINGS` from `src/data/buildings.ts` as-is — already typed and self-contained, no separate info file to merge | R |
| 12 | Versioning for the two new endpoints | Add version-hash files, same pattern as `scenarios-version.ts` (`src/data/materials-version.ts`, `src/data/buildings-version.ts`) — consistency with the established pattern, even though nothing polls them yet | J |

## Frontier

*(empty — all decisions resolved)*

## Fog

*(none)*

## Ruled out

- **Adding `spread`/`type`/`intensity %` as new bar UI** — killed because: appetite is scoped to refreshing existing data, not introducing new visual elements; would also need a new scale decision (spread is already 0-100%) that nobody asked for.
- **materials.json as catalog-fields-only (no merged info)** — not chosen because: external consumers wanting stats/advice would need a second source, defeating the "self-contained like scenarios.json" goal.
- **No version-hash file for materials/buildings** — not chosen because: user preferred consistency with the established scenarios pattern over the simpler no-op-today option.

## Route

1. [x] **Fix dampener/tool pricing data in `catalog.ts`** — flip `RESOURCE.FIRE_EXTINGUISHER`'s `isTool` to `false`; relax `scripts/update-arson-prices.ts`'s skip condition (drop the `resource.isTool` check, keep `tornId === undefined`); run the script to refresh `defaultPrice` for Fire Extinguisher (now a consumable) and Blanket/Flamethrower/Molotov/Lighter (now display-eligible tools) — acceptance: Fire Extinguisher has a nonzero `defaultPrice`, `isTool: false`; `pnpm exec tsx scripts/update-arson-prices.ts` runs clean — from decisions #6, #7
2. [x] **Correct + extend `src/data/arson-information.ts`** — refresh `ACCELERANT_INFO`/`IGNITER_INFO` numeric values from the corrected `arson-information.js` data (including the Magnesium Shavings/Potassium Nitrate swap), keeping existing `advice` strings untouched; add a new `DampenerInfo` interface (`advice`/`effect` text only, no numeric stats) and `DAMPENER_INFO` record for Blanket/Sand/Fire Extinguisher — acceptance: every accelerant/igniter/dampener in `CATALOG` matching the popover groups has a correct entry; `pnpm check` passes — from decisions #4, #5, #8
3. [x] **Wire dampener tooltips + cost into `material-badges.ts`** — extend `scanMaterialPopover`'s lookup to include `DAMPENER_INFO` (advice-only, no bar strip, matching accelerant/igniter's `bindMaterialTooltip` call but skipping `buildBarStrip`); add a unit-price line to `bindMaterialTooltip`'s content for all three groups (accelerants, igniters, dampeners), including Blanket — acceptance: hovering Blanket/Sand/Fire Extinguisher in the popover shows a tooltip with name + advice text; hovering any priced material shows its unit price; recipe-level $ totals are unaffected (Blanket still excluded) — from decisions #3, #8, #9
4. [x] **`scripts/dump-materials.ts`** — new script mirroring `dump-scenarios.ts`: merges `CATALOG` + `ACCELERANT_INFO`/`IGNITER_INFO`/`DAMPENER_INFO` per resource, writes `static/arsonists-ledger/materials.json` + `src/data/materials-version.ts` hash — acceptance: output JSON is self-contained (name/category/price/tornId + stats/advice per item) — from decisions #10, #12
5. [x] **`scripts/dump-buildings.ts`** — new script dumping `BUILDINGS` from `src/data/buildings.ts` as-is to `static/arsonists-ledger/buildings.json` + `src/data/buildings-version.ts` hash — acceptance: output matches `BUILDINGS` record 1:1 — from decisions #11, #12
6. [x] **Wire both new dump scripts into the build** — add both to `scripts/build-userscripts.mjs` alongside the existing `dump-scenarios.ts` call, so `materials.json`/`buildings.json` regenerate on every `pnpm build` — acceptance: a full `pnpm build` produces fresh `static/arsonists-ledger/materials.json` and `buildings.json` — from decision #12 (keeping pattern parity)
7. [x] **Verify** — `pnpm check`, `pnpm build`, and `pnpm test:userscripts` all exit 0 (40/40 tests pass); manually confirmed in the rebuilt userscript that cost renders on hover of the material cell, Blanket shows a price but doesn't affect recipe $ totals, dampener tooltips show advice text with no bars, and both new JSON endpoints (`materials.json`, `buildings.json`) look correct — Definition of Done per AGENTS.md
8. [x] **Follow-up fixes found during implementation:**
   - `scripts/update-arson-prices.ts`'s price-refresh regex only matched single-line catalog entries (`[^\n]*`) but `catalog.ts` entries are multi-line — the script had never actually updated any price. Fixed to `[\s\S]*?` so it matches across lines.
   - `engine.test.ts` had hardcoded `isTool` expectations for Fire Extinguisher and a "permanent tools have defaultPrice of 0" invariant that both became false once tools could carry a display-only price — updated to test the actual invariant that matters (cost-math exclusion via `calcMaterialCost`).
   - Blanket's `tornId` was missing entirely (not `1235` as first assumed from a misread) — user supplied the correct id, now priced at `defaultPrice: 6_776`.
   - `formatCost` (`tooltip.ts`) only formatted up to `k` — Flamethrower's `defaultPrice: 2_543_736` was rendering as `$2543.7k`. Extended to support `M`/`B` suffixes.

## Outcome

All three destinations shipped: cost now shows in material tooltips (unit price, hover the item cell), all three dampeners have advice-text tooltips (no stat bars, per prior precedent), and `static/arsonists-ledger/materials.json` + `buildings.json` are generated on every build alongside `scenarios.json`. Status: **done**.

**First move:** Route #1 — the pricing/data fixes are a prerequisite for both the cost tooltip (route #3) and the materials.json export (route #4), so nothing else can be verified correct until Fire Extinguisher's price and the corrected accelerant data land.
