# Arsonist's Ledger Userscript

## Overview

Arsonist's Ledger is a userscript that augments Torn's Arson crime page. It scans the on-page scenario cards, matches each against the bundled scenario dataset (`src/data/scenarios.ts`), computes Profit Per Nerve, and annotates each card with a color-coded band plus a rich tooltip showing payout, cost, and required materials/timing. It also injects a settings panel for price overrides, Torn API price sync, and display toggles.

## Language

- **RankedScenario**: `{ Scenario, materialCost, baseNerve, profitPerNerve, band }` — the output of `rankForScenario()` in `engine.ts`, joining a raw `Scenario` with its computed cost/profit figures.
- **ProfitBand**: `'negative' | 'low' | 'good' | 'excellent'`, computed by `profitBand()` in `engine.ts` against `ProfitThresholds`. Drives the `pyro-band--*` class swapped onto each scenario card (`applyToSection()` in `index.ts`), plus the `.pyro-value-pill` badge (`$`/`$$`/`$$$`/`-`/`?`). The band color renders as an inset `box-shadow` on the card's `::after` pseudo-element (not the card itself, and not a literal DOM node) — the card's own box-shadow painted below `.crime-image`'s content in stacking order and was invisible under Torn's crime thumbnail; `::after`, as the last-painted positioned box, renders above it.
- **PPN bar position**: `'left' | 'right'` (`PpnBarPosition` in `settings.ts`), user-toggleable in Settings → Visuals → "PPN bar position". Persisted as `pyroLedger.v1.ppnBarPosition` (default `'right'`) and applied via a `data-pyro-bar-position` attribute on `<html>`, which flips the `--pyro-bar-x` CSS custom property the `pyro-band--*::after` box-shadow bar reads its horizontal offset from — no per-card re-render needed.
- **ProfitThresholds**: `{ low, good }` cutoffs used to compute a ProfitBand. `DEFAULT_THRESHOLDS = { low: 5_000, good: 10_000 }`, user-tunable via the settings panel. _Avoid_: "profit tiers" (not used in code)
- **PayoutBasis**: `'average' | 'max'` (`engine.ts`), user-toggleable in Settings → Thresholds → "Payout basis". Selects whether `calcProfitPerNerve()`/`rankForScenario()` use `Scenario.payout` (the realistic average) or `Scenario.payoutMax` (an optimistic upper end, when on record) as the payout input — see `effectivePayout()`. Persisted as `pyroLedger.v1.payoutBasis` (default `'average'`), and unlike the PPN bar position toggle, this one calls `resetScans()` since it changes the actual PPN figure/band per card, not just a CSS offset.
- **payoutMax**: Optional field on `Scenario` (`src/data/scenarios.ts`) — a higher-end payout figure, currently only populated for the 150 scenarios where the pre-realignment (pre-`8680626`) payout value was strictly greater than the new average `payout`. Drives both the tooltip's payout range display (`payout`–`payoutMax`) and the `PayoutBasis` "max" toggle. Absent (not derived/computed) for scenarios without a real recorded higher figure — no synthetic ±% range is generated.
- **PriceMap**: `Partial<Record<ResourceId, number>>` — a resource-id → price override map. Used for both manual and API-sourced prices.
- **baseNerve**: The nerve cost of a scenario — fixed 10 (Breach 3 + Ignite 5 + Collect 2) plus 5 per non-optional action-slot quantity across evidence/place/stoke/dampen. Computed by `calcNerve()` in `engine.ts`.
- **materialCost**: The sum of non-optional, non-tool item costs across a scenario's action slots, resolved via `resolvePrice()` (manual override > API price > catalog `defaultPrice`). Computed by `calcMaterialCost()` in `engine.ts`.
- **`pyroLedger.v1.*`**: The GM/localStorage key namespace for manual prices, API prices/key/refresh timestamp, thresholds, active settings tab, and visual toggles. _Avoid_: "userscript storage" (too broad — this is a specific versioned namespace)
- **`pyroLedger.<SCENARIOS_VERSION>.scenariosCache`**: A separate cache namespace, independent of `pyroLedger.v1.*`, keyed by scenario dataset version. Holds the remote-fetched scenario JSON with a 24h TTL.
- **scenarioIndex**: A `Map<lowercaseName, Scenario>` used to match on-page scenario text (lowercased) to the bundled dataset. If Torn changes a scenario's displayed name, the match silently fails and the card falls back to an "unknown" tooltip.
- **statsOnly tooltip**: A condensed tooltip (no action breakdown) shown for pending-collect cards that don't need verification, as opposed to the full tooltip shown when `needsVerification` is set on a scenario.
- **isTool**: A catalog flag (in `src/data/catalog.ts`) excluding reusable/permanent equipment (Flamethrower, Blanket, Fire Extinguisher, Windproof Lighter) from cost and nerve calculations — tools are owned once, not consumed per job.

## Architecture

`index.ts` is the orchestrator: it owns state (prices, thresholds, toggles), runs a `MutationObserver` to rescan the Arson page DOM, matches scenario cards to the dataset, and wires tooltip hover/tap events. It delegates to five single-responsibility modules: `engine.ts` (pure nerve/cost/profit math, no DOM), `tooltip.ts` (pure DOM-building from a `RankedScenario`, no state), `settings.ts` (the injected settings panel UI, against a `SettingsCtx` interface `index.ts` implements), `selectors.ts` (the single source of truth for Torn's DOM selectors), and `api.ts` (a thin fetch wrapper around Torn's `v2/torn/items` endpoint). Tooltip rendering itself is delegated to the separate `balaclava-tooltip` userscript (see `../balaclava-tooltip/CONTEXT.md`) via a soft-dependency lookup on `unsafeWindow.BalaclavaTooltip` — if absent, the script warns once and no-ops rather than failing.

## Directory Structure

| File | Purpose |
|------|---------|
| `index.ts` | Entry point — GM storage shim, DOM scanning/observing, state, event wiring |
| `engine.ts` | Pure nerve/cost/profit-per-nerve math and banding — no DOM, fully unit-tested |
| `tooltip.ts` | Builds tooltip content/styles from a `RankedScenario` |
| `settings.ts` | Injected settings panel (price overrides, thresholds, visual toggles, API key) |
| `selectors.ts` | `SEL.*` — all Torn DOM selectors, isolating obfuscated-class coupling |
| `api.ts` | Fetches live prices from Torn's `v2/torn/items` endpoint |
| `colors.ts` | `BAND_COLOR` palette shared by highlight CSS, settings, and tooltip |
| `dom.ts` | Generic `el`/`txt`/`svgEl` DOM helpers |
| `icons.ts` | Inline SVG icon constants for the settings panel |
| `scenarios.ts` | Standalone bootstrap exposing `window.BalaclavaScenarios` — not part of `index.ts`'s import graph |
| `engine.test.ts` | Unit tests for `engine.ts` and `CATALOG`/`SCENARIOS` data integrity |

## Key Patterns

- **GM storage fallback**: `store_get`/`store_set` in `index.ts` transparently fall back to `localStorage` when `GM_getValue`/`GM_setValue` are undefined (dev/non-GM context).
- **Price resolution precedence**: manual override > API price > catalog `defaultPrice`, implemented in `effectivePrices()` (`index.ts`) and mirrored by `resolvePrice()` (`engine.ts`). `settings.ts` re-implements this precedence for its own styling (`applyPriceStyle`) — the two must be kept in sync manually, they don't share code.
- **API price cache-busting**: `syncStoredPricesToCatalog()` wipes cached API prices if the catalog data's `CATALOG_UPDATED` date has advanced past the last API refresh timestamp.
- **Scenario data refresh**: independent of the price system — gated by `GM_xmlhttpRequest` availability, 24h TTL, keyed by `SCENARIOS_VERSION`, fetched from `https://balaclava.app/arsonists-ledger/scenarios.json`.
- **iOS handling**: `isIosDevice()` UA/platform sniffing disables hover binding in favor of tap-only tooltips.
- **Attribute-driven visual toggles**: most settings toggles (`showScenarioName`, `stackResources`, etc.) call `resetScans()` to rebuild every card's tooltip/annotations. The PPN bar position toggle instead flips a `data-pyro-bar-position` attribute on `<html>`, read by a CSS custom property (`--pyro-bar-x`) in the static injected stylesheet — cheaper, and preferred for any future toggle that's pure CSS with no per-card content change.

## Known Gaps

- Heavy coupling to Torn's obfuscated CSS class names via `[class*="..."]` prefix selectors in `selectors.ts` — a Torn front-end rebuild could silently break scanning/annotation.
- Scenario matching is purely by lowercased display-name text; any scenario rename on Torn's side desyncs the match with no error surfaced beyond a generic "unknown" tooltip.
- Test coverage is limited to `engine.ts` and data integrity — `index.ts` orchestration, `tooltip.ts` rendering, `settings.ts` UI, and `api.ts` fetch logic are untested.
- `scenarios.ts` exposes `window.BalaclavaScenarios` but nothing in this directory reads it back — appears intended for external consumption, not internal use.
