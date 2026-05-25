# Torn Pyromaniac's Ledger PRD

Status: Reconstructed from the May 19-24, 2026 arson userscript planning session.

## Summary

Torn Pyromaniac's Ledger is a new Tampermonkey userscript for Torn's Arson crime. It replaces the legacy `arson-helper.js` with a typed, maintainable, profit-focused helper that recommends the best material strategy per visible Arson job.

The script is not an in-place migration of the legacy helper. It is a new userscript with new metadata, new storage keys, a typed source model, and generated output bundled to a plain JavaScript userscript.

## Goals

- Help users maximize Arson profit per nerve using current market/manual prices.
- Reduce reliance on brittle generated class names by using semantic selectors first and isolating fallbacks.
- Replace string-parsed strategy data with typed strategies, typed resources, and generated tooltip content.
- Integrate with Balaclava Tooltip for stable custom tooltip behavior.
- Preserve the useful legacy UX: inline profit per nerve, card highlighting, editable price thresholds, and API/manual prices.
- Support a low-impact tester build with partial typed scenario coverage and strong debug visibility.

## Non-Goals

- Full legacy feature/data parity before the first tester build.
- Storage migration from the old arson helper.
- Reading or importing old `localStorage` keys, including old API keys.
- Fire-state simulation for requirements such as damage, suspicion, visibility, or total destruction.
- Inventory-gated ranking in the first build.
- A framework-based UI for settings.

## Product Decisions

The visible userscript name is `Torn Pyromaniac's Ledger`. Internal CSS classes use `pyro-*`, DOM attributes use `data-pyro-*`, and storage uses fresh `pyroLedger.v1.*` keys.

`docs/arson-helper.js` remains the untouched legacy reference. The new script is built separately from typed source under `src/` and generated to `dist/`.

The first tester build may cover only the Arson scenarios the owner runs most often, plus edge cases. Uncovered scenarios receive no normal-mode recommendation; debug mode can show a small `missing` marker and log observed scenario names.

## User Experience

For covered scenarios, the script shows a compact inline profit label near the scenario title, formatted like `$8.4k/N`. Unconfirmed page-state fallback recommendations use a compact marker such as `~$8.4k/N`.

Card visual treatment is modestly redesigned but preserves the semantic profit bands:

- `negative`: profit per nerve `<= 0`
- `low`: profit per nerve `<= 5,000`
- `good`: profit per nerve `<= 10,000`
- `jackpot`: profit per nerve `> 10,000`

Highlighting applies to the title area plus inline label, not the whole card. Colorblind mode and non-color signals are required for profit band and unconfirmed status.

Desktop interaction uses hover/focus. Mobile/touch interaction uses tap on non-interactive card areas to toggle the tooltip, outside tap to close, and ignores Torn action controls. Capability detection should use hover/pointer media queries, not viewport width alone.

## Tooltip Requirements

The Arson script uses `BalaclavaTooltip.show()` and `BalaclavaTooltip.hide()` directly. It does not use `attach()`.

If `BalaclavaTooltip` is missing, non-tooltip behavior still works, tooltip interactions are skipped, and one warning is logged.

Balaclava owns the tooltip shell. Pyromaniac's Ledger generates and styles the structured content node passed into the tooltip.

Tooltip content shows the best candidate first. Alternatives are shown only when materials/actions or availability status differ meaningfully. Alternatives are grouped with confirmed-valid candidates first, then sorted by profit per nerve.

Tooltip action order is:

1. Evidence
2. Ignite
3. Place
4. Stoke
5. Dampen
6. Notes

Tooltip shows both full-job nerve and execution nerve. Payout variance is not mentioned in first-build tooltips.

## Strategy Model

Strategies are typed objects, not tooltip strings. Tooltip text is generated from structured strategy data.

Strategies reference canonical resource IDs from a catalog. A `RESOURCE` constants namespace maps IDs to display names, kinds, categories, and prices.

One resource catalog covers fuels/materials, evidence, and tools. Tools count toward action requirements, validity, and nerve, but do not count as market material cost by default. Evidence counts toward both cost and nerve.

Every strategy uses explicit action slots. Supported slots include Evidence, Ignite, Place, Stoke, and Dampen. Action slots support alternatives and explicit `required` and `optional` groups. Optional groups can carry labels explaining intent.

Alternatives expand into candidate combinations. The best valid candidate is selected for tooltip content, inline labels, and highlight state.

Plant Evidence is modeled as an action attempt.

Strategies store base/listed payout. Random +/-10% payout variance is ignored for ranking.

Incomplete or uncertain entries are marked `needs-verification` and excluded from ranking until they have structured candidates.

## Ranking

Ranking uses full-job profit per nerve. Full job nerve is:

`Breach + execution + Collect`

Execution nerve is:

`Plant Evidence + Place + Ignite + Stoke + Dampen`

Tie-breakers are:

1. Higher profit per nerve
2. Lower total nerve
3. Lower material cost
4. Stable strategy order

Candidate validity uses visible/selectable page options first, with skill/static constraints as fallback. If no candidate is confirmed from page state, show the best statically valid candidate with an unconfirmed indicator.

Inventory does not gate ranking. The script recommends the best market-value candidate. A future owned-only mode may mark or filter missing owned materials, but this is not in the first build.

The first build supports deterministic filtering for Specific Accelerant only. Other requirements may be stored as typed metadata but are not simulated.

## Settings

Settings stay embedded in the Arson header when possible, with a floating fallback if no stable header anchor exists.

Settings UI is implemented with small plain-DOM render functions/components, no framework.

First tester settings tabs:

- Prices
- Highlights
- API
- Debug

The active settings tab is persisted. The settings open/closed state is not persisted.

Prices are stored internally as integer Torn dollars. Formatting/parsing happens only at the UI boundary. The Prices tab groups resources by kind. Tool prices are not editable in the first build.

Profit band thresholds are editable. Colors are owned by theme/colorblind styling, not by arbitrary user color inputs.

API key storage uses Tampermonkey storage. The API key is optional; manual/default prices work without it. Saving a key validates immediately by attempting market-price fetch. Failed validation does not save the new key and preserves the previous valid key.

The first tester build uses manual API price refresh only. Last successful refresh timestamp is stored and shown.

Manual price overrides win until reset. API refresh updates base/API prices but does not overwrite manual overrides.

## Debug

Debug mode defaults off and is persisted as a boolean.

Debug mode exposes selector matches, candidate ranking, catalog validation, and missing-strategy observations. Missing observations and diagnostics stay in memory for the current page session.

Selector failures are user-visible only for core failures. Optional failures get one-time logs.

## Build And Source Layout

The new userscript uses TypeScript source modules and bundles to plain JavaScript.

Planned paths:

- `src/data/catalog.ts`
- `src/data/strategies.ts`
- `dist/pyromaniacs-ledger.user.js`

The recovered interview also mentioned `dist/arson-helper.user.js` before the rename decision. The final product naming should use Pyromaniac's Ledger for the generated userscript unless the repo build convention chooses a different filename.

## Verification

Pure-function tests should cover:

- Catalog normalization
- Candidate expansion
- Profit/nerve calculation
- Storage and price behavior
- Profit band selection
- Formatting

Use a minimal `node:test` setup for pure logic tests.
