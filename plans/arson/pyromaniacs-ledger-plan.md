# Torn Pyromaniac's Ledger Implementation Plan

Status: Reconstructed from the May 19-24, 2026 arson userscript planning session.

## Ground Rules

- Keep `docs/arson-helper.js` as untouched legacy reference until the new userscript reaches feature parity.
- Build Torn Pyromaniac's Ledger as a new userscript, not a migration path.
- Do not import old storage or old API keys.
- Use `pyro-*`, `data-pyro-*`, and `pyroLedger.v1.*`.
- Keep each phase shippable for a private tester build.

## Phase 1 - Project Skeleton

Create the TypeScript source layout and bundling path for the new userscript.

Deliverables:

- `src/data/catalog.ts` with canonical `RESOURCE` constants.
- `src/data/strategies.ts` with a representative typed subset.
- Userscript metadata for `Torn Pyromaniac's Ledger`.
- Generated userscript output under `dist/`.
- Build script or bundler configuration consistent with the repo.

Acceptance checks:

- Legacy `docs/arson-helper.js` remains unchanged.
- Generated script installs as a separate userscript.
- No old `localStorage` keys are read.

## Phase 2 - Catalog And Strategy Core

Implement the pure strategy engine before touching Torn DOM integration.

Deliverables:

- Resource catalog for fuels/materials, evidence, and tools.
- Typed action model for Evidence, Ignite, Place, Stoke, Dampen, and Notes.
- Required/optional action groups with labeled optional groups.
- Alternative expansion into ranked candidate combinations.
- Full-job nerve and execution nerve calculation.
- Profit per nerve calculation using base/listed payout.
- Tie-breakers: profit per nerve, lower total nerve, lower material cost, stable strategy order.
- `needs-verification` exclusion for incomplete strategies.

Acceptance checks:

- Pure functions can rank the representative typed subset.
- Tools affect action/validity/nerve but not market cost by default.
- Evidence affects cost and nerve.
- Payout variance is ignored.

## Phase 3 - Tests For Pure Logic

Add minimal `node:test` coverage around the core model.

Deliverables:

- Catalog normalization tests.
- Candidate expansion tests.
- Profit/nerve calculation tests.
- Profit band selection tests.
- Formatting tests, including floor-to-nearest-100 behavior.
- Price override/API base price behavior tests if storage helpers exist by this phase.

Acceptance checks:

- Logic tests run without a browser.
- Ranking and formatting behavior is locked before DOM integration.

## Phase 4 - Torn Page Integration

Add resilient page scanning and Arson-owned DOM markers.

Deliverables:

- Selector layer prioritizing semantic, ARIA, and text anchors.
- Isolated generated-class fallbacks.
- Scenario title/name extraction.
- Visible/selectable action option detection where possible.
- Skill/static constraints fallback.
- Recompute loop that clears/reapplies only `pyro-*` and `data-pyro-*` markers.
- Inline `$8.4k/N` label near scenario title.
- Debug-only missing marker for uncovered scenarios.

Acceptance checks:

- Torn-owned classes such as `pending-collect` are not removed.
- Covered scenarios get inline labels and title-area highlighting.
- Uncovered scenarios stay visually untouched in normal mode.
- Price/settings changes recompute labels and highlights immediately.

## Phase 5 - Balaclava Tooltip Integration

Wire tooltip behavior through Balaclava while preserving non-tooltip behavior if missing.

Deliverables:

- `@require` declaration for Balaclava in release userscript metadata.
- Runtime detection for `BalaclavaTooltip`.
- `BalaclavaTooltip.show()` / `hide()` calls.
- Structured DOM tooltip content generated from selected candidates.
- Best candidate first, meaningful alternatives below.
- Confirmed candidates grouped before static/unconfirmed candidates.
- Missing-Balaclava one-time warning and graceful tooltip skip.

Acceptance checks:

- Inline labels and highlights still work without Balaclava.
- Tooltip content follows action order: Evidence, Ignite, Place, Stoke, Dampen, Notes.
- Tooltip shows full-job nerve and execution nerve.
- Unconfirmed recommendations have tooltip status text and visual markers.

## Phase 6 - Settings

Implement the small plain-DOM settings UI.

Deliverables:

- Header-embedded settings with floating fallback.
- Persisted active tab.
- Tabs: Prices, Highlights, API, Debug.
- Grouped price sections by resource kind.
- Integer-dollar internal price storage.
- Manual override handling.
- Profit threshold editing.
- Colorblind mode and non-color status signals.
- API key save/validate flow using Tampermonkey storage.
- Manual market price refresh.
- Last successful refresh timestamp.
- Debug panel with selector/ranking/catalog/missing-strategy diagnostics.

Acceptance checks:

- Failed API validation does not save the entered key.
- Manual overrides survive API refresh.
- Tool prices are not editable in the first build.
- Settings open/closed state is not persisted.

## Phase 7 - Tester Data Set

Convert the first useful batch of strategies.

Deliverables:

- Typed strategies for the owner's most-run Arson scenarios.
- A few edge cases covering alternatives, optional groups, Specific Accelerant, and Plant Evidence.
- Debug missing-strategy logger for observed uncovered scenario names.

Acceptance checks:

- Partial coverage is enough for a private tester build.
- Uncovered scenarios do not get legacy-derived recommendations.
- Missing observations are session-only.

## Phase 8 - Private Tester Build

Ship a low-impact tester build for the owner and maybe one friend.

Deliverables:

- Generated userscript artifact.
- Install/update URL decision consistent with repo hosting.
- Short local usage notes or docs link once a real docs URL exists.
- No legacy forum Help link in the tester build.

Acceptance checks:

- First build can run with no API key using manual/default prices.
- Help link is omitted unless a new docs URL exists.
- Debug mode can explain missing scenarios and ranking decisions.

## Later Work

- Batch-convert full legacy strategy coverage.
- Consider owned-only mode if inventory detection becomes reliable.
- Add richer requirement simulation only after deterministic requirements prove useful.
- Add optional setting for hiding inline labels if tester feedback says the UI is too noisy.
- Expand tests as strategy data grows.
