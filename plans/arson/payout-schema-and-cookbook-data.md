# Payout schema redesign + cookbook-driven repopulation

> Meridian map · Status: implemented · Started: 2026-08-11

## Destination

Redesign how `Scenario` in `src/data/scenarios.ts` represents payout (single value + `payoutMax`, vs. `payoutMin`/`payoutMax`, vs. an array TS derives a range from), build a reusable script to parse arson cookbook CSVs, and repopulate every scenario's payout data from the 5 CSVs in `plans/arson/cookbooks/`.

## Bearings

- **Brought as:** feature (data-model change + data repopulation)
- **Context:**
  - `Scenario.payout: number` + `Scenario.payoutMax?: number` currently exist in `src/data/scenarios.ts` (line ~32-39). `payout` doc comment: "Base listed payout... Treated as the 'average' payout." `payoutMax` doc comment: "Optional higher-end payout... currently sourced from pre-realignment payout figures, not derived from `payout`."
  - `payoutMax` is optional and only set on ~half of scenarios today (spot check: present on roughly half the entries in the first 80 lines).
  - Per [[remove-observed-payout]] (implemented), payout ranges are now meant to be the *canonical* source of truth — the old `observedPayout` (min/max/runs from audit logs) system was deleted entirely in favor of this.
  - 5 new CSV "cookbooks" exist at `plans/arson/cookbooks/arson_cookbook*.csv` (each ~106-247 rows), columns: Location, Story, Nerve, Cost, Reward, Profit, Profit/Nerve, Place, Ignite, Stoke, Dampen. `(Location, Story)` maps to a scenario.
  - No existing script reads these cookbooks — `scripts/audit-arson-cookbooks.ts` (old pipeline, compared canonical vs. observed) was deleted in the observedPayout removal. A fresh reusable reader script is in scope per the user's request.
  - Analysis of the 5 cookbooks (ad hoc, this session): 106 scenarios appear in all 5 files, 140 in 4, 2 in 3. Reward is **not** a simple ±10% spread around one base value — e.g. `Bank/Hot on the Trail`: [230000, 450000, 460000, 460000, 460000]; `Apartment/Burning Liability`: [46000, 57000, 160000, 170000, 170000]. Values often cluster bimodally (a low outlier + a tight high cluster), suggesting the visible reward may depend on an unmodeled factor (e.g. crime XP/level scaling, or a wider payout distribution than currently assumed) — not yet understood, flagged to Fog.
  - No test suite; `pnpm check` + `pnpm build` are the Definition of Done gate (AGENTS.md).
- **Appetite:** Full session — schema decision, reusable script, and full scenario repopulation from the 5 cookbooks, in this session.
- **For:** Arsonists' Ledger userscript users relying on the tooltip's payout range and PPN ("optimist"/ranking) calculations for planning arson runs.

## Decision log

- D1 (Frontier #5, R): `SCENARIOS` has 249 entries; the 5 cookbooks together cover 248 distinct `(Location, Story)` pairs — near-total coverage. One scenario has zero cookbook rows (to be identified during repopulation).
- D3 (Frontier #1, J): Payout schema becomes explicit `payoutMin: number` / `payoutMax: number` (both required), replacing `payout`/`payoutMax?`. Rejected array-of-samples (overclaims precision from 1-5 arbitrary samples) and status-quo (`payout` as fuzzy "average" doesn't express an observed range cleanly).
- D2 (Frontier #2, R): The wide/bimodal reward spread is **not** random variance around one payout — it's different recipes. Cookbook rows for a given scenario mix multiple recipes users tried (different `Place`/`Stoke`/`Nerve`/`Cost`), and reward tracks the recipe. Evidence: `Bank/Hot on the Trail` canonical recipe is `place: Gasoline x2` (`src/data/scenarios.ts`); matching cookbook rows give [450000, 460000, 460000, 460000], while the 230000 outlier used `Place=Kerosene` — a different, non-canonical recipe. Same pattern confirmed on `Apartment/Burning Liability` and `Arcade/Insert Coin to Continue` (low outliers always used a cheaper/different Place item or lower Nerve). **Implication: repopulation must filter cookbook rows to only those matching each scenario's current canonical `actions.place`/`stoke` before computing a range** — mixing recipes would corrupt the range with unrelated scenarios-in-disguise.

- D4 (Frontier #3, J): Reusable script `scripts/analyze-arson-cookbooks.ts` parses all CSVs in `plans/arson/cookbooks/`, groups rows by `(Location, Story)`, filters to rows whose `Place`/`Stoke` resource names match each scenario's canonical `actions.place`/`actions.stoke` (matched via `catalog.ts` `Resource.name` strings), and outputs a report (matched-sample count, min/max, mismatched-recipe rows shown as informational). It does **not** write `scenarios.ts` directly — a human applies the reported numbers. Rejected auto-writing the data file: codegen touching a hand-maintained file risks formatting/ordering damage and is harder to spot-check before committing.
- D5 (Frontier #4, J): Scenarios with fewer than 2 matching-recipe samples after filtering (including zero-coverage scenarios) keep their current values untouched — for these, `payoutMin` = old `payout`, `payoutMax` = old `payoutMax ?? payout` — and are listed in the script's report as "insufficient data" for future revisiting as more cookbooks arrive. Rejected point-estimate-from-1-sample: a single sample understates the true range.
- D6 (post-implementation revision, J — user-applied then codified into `scripts/analyze-arson-cookbooks.ts`): After the first full repopulation pass, two refinements to the policy, discovered by diffing the user's manual corrections against the generated changelog:
  1. **Scenarios that already had a range before this analysis are left untouched**, even when cookbook data exists and matches the canonical recipe. A prior cookbook round already set a considered range; a later, possibly noisier round (fewer samples, different recipe mix) shouldn't silently overwrite it. Applies to 176 of 249 scenarios as of the 5 current cookbooks. Rejected auto-updating these too — the initial pass did this and produced several nonsensical narrowings (a scenario's range shrinking to a single value based on only 2-3 samples), which the user had to manually catch and revert.
  2. **For scenarios that had a single payout value, the computed range is unioned with the old value, not replaced by it.** If the old single value falls outside `[computed_min, computed_max]`, the range extends to include it (`final_min = min(computed_min, old)`, `final_max = max(computed_max, old)`) rather than discarding it as stale. Verified this was the user's actual rule by reverse-engineering all 24 of their manual edits — 100% match, no exceptions. Rejected replacing outright: the old value, even if from an earlier less-rigorous source, is still a real observed payout and dropping it loses information the cookbook sample (often just 2-4 rows) doesn't yet cover.
  `scripts/analyze-arson-cookbooks.ts` now computes and reports a `recommended` field implementing both rules directly, so future cookbook rounds don't require this manual reverse-engineering step.

## Frontier

(empty — route-ready)

## Fog

(none — resolved into D2)

## Ruled out

- Array of observed payouts with TS deriving min/max — killed because it overclaims precision from 1-5 arbitrary samples and bloats the data file with numbers no one reads individually. *(D3)*
- Status quo (`payout` as fuzzy "average" + optional `payoutMax`) — killed because `payout` is documented as an average but nothing computes one; it doesn't cleanly express an observed range. *(D3)*
- Script auto-writing `scenarios.ts` — killed because codegen on a hand-maintained data file risks formatting/ordering damage and removes the human spot-check step before committing. *(D4)*
- Single-sample point estimate (`payoutMin = payoutMax` = the one sample) for sparse scenarios — killed because it understates the true range and looks more confident than the data supports. *(D5)*

## Route

1. `src/data/scenarios.ts` — replace `payout: number` / `payoutMax?: number` with `payoutMin: number` / `payoutMax: number` on the `Scenario` interface, update doc comments to describe them as an observed range (not an average). *(D3)*
2. Write `scripts/analyze-arson-cookbooks.ts`: parse all CSVs in `plans/arson/cookbooks/`, group rows by `(Location, Story)`, match each `SCENARIOS` entry's canonical `actions.place`/`actions.stoke` resource names (via `catalog.ts` `RESOURCE`/`Resource.name`) against each row's `Place`/`Stoke` text, and report per scenario: matched-sample count, min/max Reward among matches, and any non-matching rows (informational). Flag scenarios with <2 matching samples as "insufficient data." *(D4)*
3. Run the script; using its report, update every scenario in `src/data/scenarios.ts` with sufficient data to `payoutMin`/`payoutMax` computed from matching cookbook samples. *(D4, D5)*
4. For scenarios flagged "insufficient data" (including the ~1 scenario absent from all cookbooks), set `payoutMin` = old `payout`, `payoutMax` = old `payoutMax ?? payout` — no data-driven change, just the field rename. *(D5)*
5. `src/userscripts/arsonists-ledger/engine.ts` (~line 13-18) — update the PPN-basis helper: `'max'` basis reads `payoutMax`, default/average basis reads... decide the average-basis replacement now that there's no single `payout` (likely the midpoint of `payoutMin`/`payoutMax`, or rename the basis to `'min'`/`'max'`) — confirm with user during implementation since this is a small in-scope judgment call, not deferred to Frontier.
6. `src/userscripts/arsonists-ledger/tooltip.ts` (~line 127-129) — update the payout-range display to use `payoutMin`/`payoutMax` directly (range display already exists; simplifies since both fields are now always present).
7. `src/userscripts/arsonists-ledger/engine.test.ts` — update any test fixtures/assertions referencing `payout`/`payoutMax`.
8. `src/userscripts/arsonists-ledger/CONTEXT.md` — update prose describing the payout field(s) to match the new schema.
9. Regenerate build outputs: run `scripts/dump-scenarios.ts` to refresh `static/arsonists-ledger/scenarios.json`; rebuild the userscript bundle.
10. Verify: `pnpm check` and `pnpm build` both exit 0 (Definition of Done per AGENTS.md).

**First move:** Route item 1 — rename the `Scenario` payout fields to `payoutMin`/`payoutMax` in `src/data/scenarios.ts`. This is the type-level change everything else (the analysis script's report format, engine.ts, tooltip.ts) is written against.
