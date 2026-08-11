# Material Badges on Arson Crime Popover

> Meridian map · Status: route-ready · Started: 2026-08-11

## Destination

Add at-a-glance visual badges to each material in the Torn arson crime item-selector popover (Liquids/Solids/Gases/Igniters/Dampeners), surfacing key `arson-information.js` data (type, intensity, momentum, spread, risks, suspicion, advice) — with the info also reachable without hover, so it works on mobile.

## Bearings

- **Brought as:** feature
- **Context:** Torn's native crime page renders an `itemSelector` popover (`plans/arson/references/arson-crime-markup-materials-popover.html`) listing usable materials as `.itemCell` buttons, grouped by `igniters`/`liquids`/`solids`/`gases`/`dampeners`. Each button already has a native `aria-label`/title-style hover tooltip showing the item name + owned count — that hover slot is taken. `arson-information.js` (untyped reference data, not yet ported into `src/`) holds per-material stats: type, intensity (%, abs), momentum (label + abs), spread (%), ignition_risk, stoking_risk, suspicion, and a free-text advice line. This is a *new* overlay onto Torn's native DOM, distinct from the existing `arsonists-ledger` userscript's own tooltip system (`tooltip.ts`/`dom.ts`/`balaclava-tooltip`), though that system is the established pattern for building DOM fragments and injecting styles in this codebase.
- **Appetite:** Light — pick one clean badge/inline pattern, apply consistently across all 5 groups, ship in one pass. No multi-option layout exploration.
- **For:** Arsonist's Ledger users choosing materials mid-crime on both desktop (mouse, hover available) and mobile/TornPDA (tap only, no hover) — they need to compare materials at a glance without the reference doc open in another tab.

## Decision log

| # | Decision | Resolution | Via |
|---|----------|------------|-----|
| 1 | Which fields shown per group | Accelerants (liquids/solids/gases): intensity, momentum, suspicion, ignition risk, stoking risk. Igniters: suspicion only. Dampeners: nothing — they're differentiated by safety, not by comparable stats worth badging. | J |
| 2 | Placement of the stat display | A new sibling element underneath each `.itemCellWrap`/`.itemCell` — not overlaid on the 60x30 card, not growing the card's own height. The card stays untouched; a strip sits below it. | J |
| 3 | Visual encoding inside the strip | Mini horizontal bars, one per stat, stacked vertically — 1px-tall colored segments, length/color = magnitude, no numbers. Accelerants: 5 stacked bars (int/mom/sus/ignition/stoking). Igniters: 1 bar (suspicion). Dampeners: none. | J |
| 4 | Advice text (free-text line) | Out of scope for this popover — bars only. No inline expansion, no reference panel. Keeps the strip purely visual, matches light appetite. | J |

| 5 | Bar color direction | Direction-aware: intensity/momentum bars ramp neutral→green (more = better); suspicion/ignition-risk/stoking-risk ramp neutral→red (more = worse). | J |

| 6 | Bar length normalization | Fixed 0–10 absolute scale for every stat (not per-stat min/max) — `intensity_abs`, `momentum_abs`, `stoking_risk` map directly; `ignition_risk` (0–3) scales onto the same 0–10 bar; `suspicion` (-3 to 10) clamps negative values to 0. | J |

| 7 | Code location | Port `ACCELERANTS`/`IGNITERS` (skip `DAMPENERS` — no badge data needed) from `plans/arson/arson-information/arson-information.js` into typed `src/data/arson-information.ts`, keyed by `ResourceId` to match `catalog.ts`. New `src/userscripts/arsonists-ledger/material-badges.ts` owns bar-building + popover injection, following the `tooltip.ts` pattern (pure DOM-building functions, `el()` from `dom.ts`). | J |
| 8 | Injection strategy | Reuse the existing `MutationObserver` loop in `index.ts` (`scanPage()` at the observer callback, `index.ts:1020-1023`) rather than a second observer — add a `scanMaterialPopover()` step there. Add new `SEL` entries in `selectors.ts` for the popover root/groups/item cells (mirrors the `itemSelector___`/`group___`/`itemCellWrap___` obfuscated classes seen in the reference HTML). Match each `.itemCell` to a `ResourceId` via the item image's numeric id in its `src`/`srcset` (e.g. `/images/items/172/medium.png` → item 172 → Gasoline), not by parsing the name out of `aria-label` (fragile against Torn's "0 owned"/"is unavailable" suffix variations). Guard injection idempotency with a marker class/attribute on the strip (matches existing pattern of checking `!root.contains(btn)` before re-injecting), since `scanMaterialPopover()` reruns on every DOM mutation while the popover is open (including group enable/disable transitions as the scenario stage advances place→ignite→dampen). | R |

## Fog

- (none yet)

## Ruled out

- (none yet)

## Route

1. [ ] Port `ACCELERANTS` + `IGNITERS` from `arson-information.js` into `src/data/arson-information.ts`, typed and keyed by `ResourceId` — acceptance: every accelerant/igniter in `CATALOG` that appears in the reference popover has a matching entry; `pnpm check` passes — from decision #7
2. [ ] Add `SEL` entries for the item-selector popover (root, group, item cell, item image) in `selectors.ts` — acceptance: selectors correctly scope to the popover markup in `plans/arson/references/arson-crime-markup-materials-popover.html` — from decision #8
3. [ ] Build `material-badges.ts`: bar-strip DOM builder (stacked 1px segments, direction-aware color ramp, fixed 0–10 scale per decision #5/#6) for accelerants (5 bars) and igniters (1 bar); dampeners get no strip — from decisions #1, #3, #5, #6
4. [ ] Wire `scanMaterialPopover()` into the existing `MutationObserver` loop in `index.ts`, matching `.itemCell` → `ResourceId` via image src, appending the strip as a sibling under each matched `.itemCellWrap` — from decisions #2, #8
5. [ ] Manual verification against the live Arson page (or the captured reference HTML) across desktop and mobile viewport widths, confirming strips render without breaking the popover's native click-to-select/hover-name behavior — acceptance: no layout overflow at 60px card width, native tooltip still works, popover still closes/selects correctly

**First move:** Route #1 — port the typed data, since every later step (bar builder, injection, matching) depends on having `ResourceId`-keyed stat data to read from.
