# Shared Component Layer for Userscripts

> Meridian map · Status: done · Started: 2026-08-14

## Destination

Extract the duplicated and parallel UI/logic patterns across `arsonists-ledger` and `balaclava-tooltip` into a shared `src/userscripts/shared/` module — with a real abstraction layer (base widget patterns, a theming-token bridge, a settings-panel framework) — so future userscripts import consistent, tree-shaken components instead of re-implementing them, while each `.user.js` still ships as one inlined bundle (TornPDA has no `@require` support yet).

## Bearings

- **Brought as:** idea — cleanup after UI tweaks wrapped up, ahead of building more userscripts.
- **Context:**
  - Two userscripts today: `arsonists-ledger` (~5.3K source lines across 13 files, 7,338-line built bundle) and `balaclava-tooltip` (1,123 lines, 830-line bundle). `balaclava-tooltip` is already imported by `arsonists-ledger` (`index.ts:3`) and built standalone.
  - `esbuild` bundles each userscript as an IIFE with tree-shaking (`scripts/build-userscripts.mjs`) — a shared module already dedups at the *build* level for anything imported once; the goal here is deduping at the *source* level so the abstraction exists once, not per-file.
  - There's a documented future path (`build-userscripts.mjs:28`, ADR 0002) to switch to `@require`-loaded static modules once TornPDA ships PR #452 — shared code should be structured so it drops in cleanly as a `@require`-able static module later.
  - `src/userscripts/arsonists-ledger/dom.ts` already centralizes basic `el`/`txt`/`svgEl` helpers and is correctly reused everywhere in that userscript — a working precedent for what "shared" should feel like.
  - Survey findings (Explore agent, 2026-08-14) — concrete duplication:
    1. Two independent anchored-popup positioning engines (`balaclava-tooltip/index.ts` L868-1037 JS-computed vs `popover.ts` L44-118 CSS-anchored) — different techniques, same goal.
    2. Icon+status-text idiom duplicated verbatim (`settings.ts` L95-103, `submit-tab.ts` L1125/1140).
    3. Byte-near-identical checkbox CSS + duplicated `CHECKMARK_DATA_URI` constant (`settings.ts` L255-289/L29-31 vs `submit-tab.ts` L446-479/L37-39).
    4. Segmented "stat bar" widget implemented 3 parallel ways (`tooltip.ts` `buildStatBar` L210-238, `material-badges.ts` L198-241, band-color logic spread across 4 files).
    5. Toggle-group / tab-bar button pattern duplicated (`settings.ts` `toggleGroupRow` L629-674 vs `buildTabBar` L917-947).
    6. `<style>` injection idempotency guard copy-pasted 5x (`popover.ts`, `settings.ts`, `submit-tab.ts`, `material-badges.ts`, `index.ts`).
    7. Torn theme-token bridge (`color-mix` off host `--crimes-*`/`--tooltip-bg-color` vars) reimplemented independently in `popover.ts` L22-43 and `balaclava-tooltip/index.ts` L233-236.
    8. Number-input blur/clamp/revert pattern duplicated (`settings.ts` L339-546 vs `submit-tab.ts` L799-816/L600-609).
    - Single-occurrence but clearly generalizable for a 3rd future userscript: `createPopover` (popover.ts), `buildStatTooltipGroup`/`StatEntry`/`StatBar` (tooltip.ts).
- **New constraint (2026-08-14, mid-session):** `balaclava-tooltip` is likely not userscript-only long-term — it will probably also be used by apps/tools within the Balaclava SvelteKit webapp itself, not just injected into Torn pages via userscript. This means the tooltip/positioning primitive (frontier #3's resolution) can't assume a userscript-only IIFE-bundling context — it needs to work as a normal module importable from `src/lib`/webapp routes too, not just from `src/userscripts/`.
- **Appetite:** Full abstraction layer — proper shared component system (base widget patterns, consistent theming API, reusable settings-panel framework) that future userscripts build on from day one, not just a quick dedup pass.
- **For:** Future userscript development (this repo) — not a public/external component library.

## Decision log

| # | Decision | Resolution | Via |
|---|----------|------------|-----|
| 1 | Where does shared code live? | ~~New `src/userscripts/shared/` directory~~ — **superseded** (see #1b): webapp reuse of balaclava-tooltip means a single userscript-only home is wrong. | J |
| 1b | Where does shared code live, given balaclava-tooltip may also serve the webapp? | Split home: `src/lib/shared-ui/` for anything genuinely reachable from both the SvelteKit webapp and userscripts (the tooltip/positioning primitive, theme-token bridge), plain framework-agnostic TS/DOM code with no userscript-only assumptions. `src/userscripts/shared/` for userscript-only concerns (settings-panel widgets, icon+status idiom, checkbox CSS) with no webapp use case. Both still get inlined per-bundle by esbuild for userscripts; no build config changes needed now. | J |
| 2 | Which duplication clusters are in scope for this pass? | All 8: positioning engines, icon+status idiom, checkbox CSS/constant, stat-bar widget, toggle-group/tab-bar, style-injection guard, theme-token bridge, number-input factory — matches the "full abstraction layer" appetite. | J |
| 3 | Do the two popover/tooltip positioning engines get unified? | ~~Yes, one shared primitive~~ — superseded (see #3b): full-code read revealed different interaction models. | J |
| 3b | Given popover.ts (click-toggle dropdown, plain CSS, no viewport math) and balaclava-tooltip (hover-follow, JS-measured, real viewport-clamping/fallback-flip/arrow-offset math, versioned public API) are different problems, how do they share code? | Extract only the shared math — pull balaclava-tooltip viewport-clamping/fallback-flip/arrow-offset calc into a pure reusable function in src/lib/shared-ui/. popover.ts keeps its simple CSS-anchored approach (no viewport-edge cases in practice). No forced merge into one primitive. | J |
| 4 | What does the "settings-panel framework" standardize? | Widget catalog only, no registration/layout framework — standalone factory functions (toggle, dropdown, slider, number-input, tab-bar, toggle-group) in the style of existing `dom.ts` helpers; callers wire up layout/state by hand. Matches current plain-function style, lower risk. Lives in `src/userscripts/shared/` (userscript-only per #1b). | J |
| 5 | What shape does the theming-token bridge take? | Fixed CSS custom-property injector — one shared function injects a fixed `--shared-*` vocabulary (bg, text, border, shadow, surface, danger) derived via `color-mix` from Torn's host `--crimes-*`/`--tooltip-bg-color` vars, once per page. Callers reference `var(--shared-*)` in CSS, matching how `popover.ts`/`balaclava-tooltip` already consume theming. Lives in `src/lib/shared-ui/` (webapp-reachable per #1b), since webapp UI would also want to match Torn's host theme when embedded/previewing. | J |
| 6 | Does `arsonists-ledger`'s existing `dom.ts` move into shared? | Yes — `el`/`txt`/`svgEl` are generic, no userscript-specific assumptions. Moves to `src/lib/shared-ui/dom.ts` as the base layer everything else (widgets, popover, theme bridge) builds on; `arsonists-ledger` imports from there instead of its local copy. | J |
| 7 | How is regression risk managed during extraction? | Manual visual check in Torn after each duplication cluster is extracted — build both userscripts and verify the affected UI on the actual Torn crimes page before moving to the next cluster. No test suite covers rendered userscript UI, so this is the gate. In practice, checks during implementation were `pnpm check`/`pnpm build` + bundle diffing after each item, since the assistant has no authenticated Torn session — actual in-Torn visual verification is still owed (see Route item 12). | J |
| 8 | Route item 11 assumed submit-tab.ts payout/qty inputs duplicated the blur/clamp/revert pattern — did they? | No — on inspection, submit-tab.ts's payout/qty inputs validate on plain `input` events with no blur-revert; only `settings.ts`'s `priceInput`/`thresholdInput` use the blur/clamp/revert/Enter idiom, and only `thresholdInput`'s simpler version fit a shared factory cleanly (`priceInput` has manual/api/db precedence logic that doesn't generalize). Extracted `buildNumberInput()` to `src/userscripts/shared/number-input.ts` anyway, since it's a clean, generically reusable primitive for a future userscript even though today it has one caller. | R |

## Frontier

*(empty — all decisions resolved)*

## Fog

## Ruled out

## Route

1. [x] Scaffold `src/lib/shared-ui/` and `src/userscripts/shared/` directories — from decision #1b
2. [x] Move `arsonists-ledger/dom.ts` (`el`/`txt`/`svgEl`) into `src/lib/shared-ui/dom.ts`; update `arsonists-ledger` imports — from decisions #6, #7
3. [x] Extract `injectStyleOnce(id, css)` into `src/lib/shared-ui/dom.ts`; replace the 5 copy-pasted style-injection guards — from decisions #2, #7
4. [x] Extract the Torn theme-token bridge into `src/lib/shared-ui/theme-bridge.ts` + `theme-tokens.ts`; wire into `popover.ts` and `balaclava-tooltip` — from decisions #2, #5, #7
5. [x] Extract balaclava-tooltip's viewport-clamping/fallback-flip/arrow-offset math into a pure function in `src/lib/shared-ui/anchor-position.ts` — from decisions #2, #3b
6. [x] Wire `balaclava-tooltip/index.ts` to the extracted `anchor-position.ts` function; `popover.ts` unchanged (per #3b) — from decisions #3b, #7
7. [x] Extract the segmented stat-bar widget into `src/userscripts/shared/segment-bar.ts` (`buildSegmentTrack`); wired into `tooltip.ts` and `material-badges.ts` — from decisions #2, #7
8. [x] Extract icon+status-text idiom into `src/userscripts/shared/status.ts` (`setIconStatus`) — from decisions #2, #4, #7
9. [x] Dedup the checkbox CSS block and checkmark data URI into `src/userscripts/shared/checkbox.ts` (`checkboxCss`, `CHECKMARK_DATA_URI`) — from decisions #2, #4, #7
10. [x] Extract the toggle-group / tab-bar button pattern into `src/userscripts/shared/button-group.ts` (`buildButtonGroup`) — from decisions #2, #4, #7
11. [x] Extract the number-input blur/clamp/revert pattern into `src/userscripts/shared/number-input.ts` (`buildNumberInput`); wired into `thresholdInput` only — the assumed submit-tab.ts duplication didn't hold up, see decision #8 — from decisions #2, #4, #7
12. [x] Full end-to-end manual pass: build both userscripts, exercise every migrated UI surface (tooltip, popover, settings panel, submit tab, material badges) on the live Torn crimes page — user confirmed 2026-08-14, no regressions — from decision #7

**Status:** Done. All 12 route items implemented and verified; `pnpm check`/`pnpm build` passed clean after every step, and the user confirmed no visual/behavioral regressions in Torn.
