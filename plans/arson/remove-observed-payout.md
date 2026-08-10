---
status: implemented
---

# Remove observedPayout logic

## Destination
Remove the `observedPayout` (min/max/runs) system from the arsonists-ledger codebase — data file, type, generator, UI toggle, and tooltip rendering — now that scenarios carry a canonical `payoutMax` range instead.

## Bearings
- Payout ranges (`payoutMin`/`payoutMax`?) are now the source of truth on `Scenario` in `src/data/scenarios.ts` (per recent commits "add payout-max range" and "realign arson scenario payouts with old-scenario audit data").
- `observedPayout` is a *separate* legacy system: a generated fallback map (`scenario-observations.ts`) built by `scripts/dump-scenarios.ts` from audit reports, merged onto scenarios at runtime (`index.ts`), toggleable in settings (`settings.ts`), and rendered as an extra tooltip row (`tooltip.ts`).
- `scripts/audit-arson-logs.ts` also has "observed" naming (`ObservedRecipe`, `observedRunCount`, etc.) but that's *recipe/action* auditing — orthogonal to payout ranges. Not in scope unless the user says otherwise.
- `scripts/audit-arson-cookbooks.ts` directly imports `OBSERVED_PAYOUTS` to compare canonical vs. observed payout — in scope.
- No test suite; `pnpm check` + `pnpm build` are the verification gate (per AGENTS.md).
- Appetite: unknown yet — ask.

## Decision log
- D1: Payout-observation removal is the primary scope; additionally, `audit-arson-logs.ts`'s "observed" naming (ObservedRecipe, observedRunCount, bestObservedRecipe, etc., recipe-auditing not payout) will also get a review/rename pass rather than being left untouched, since the naming overlap is confusing.
- D2: `audit-arson-logs.ts` rename uses a consistent `Logged` prefix (ObservedRecipe→LoggedRecipe, observedRunCount→loggedRunCount, etc. — full mapping in Route). No external files import these identifiers, so the rename is self-contained to this one script. Prose in help text (L149-150) is optional to tweak, not required.
- D3: `scripts/dump-scenarios.ts` — delete the generation step that builds/writes `scenario-observations.ts` entirely; the script continues generating `static/arsonists-ledger/scenarios.json` but stops touching observedPayout.
- D4: `scripts/audit-arson-cookbooks.ts` — delete the script outright; its purpose (comparing canonical payout vs. observed runs) no longer applies once payout ranges are canonical.
- D4b (revised mid-implementation): `audit-arson-cookbooks.ts` turned out to be the producer of `.cookbooks.json` reports consumed by `triage-arson-cookbook-conflicts.ts` and `apply-arson-cookbook-triage.ts` — a full cookbook-conflict pipeline, not a payout-only tool (only ~5 of 585 lines touched OBSERVED_PAYOUTS). User confirmed: delete the whole pipeline anyway — cookbook auditing will be done differently in the future. All three scripts and their `package.json` entries (`audit:arson:cookbooks`, `:triage`, `:apply`) removed.
- D5: Straightforward single-session mechanical removal — no separate design pass for the settings UI change; it's pure cleanup of a dead feature.

## Frontier
(empty — route-ready)

## Fog
(none)

## Ruled out
- Repointing `audit-arson-cookbooks.ts` at a different comparison — killed because there's no remaining "observed vs canonical" pair to compare once observedPayout is gone; the script's premise is gone, not just its data source.
- Keeping `dump-scenarios.ts`'s generation scaffolding for `scenario-observations.ts` "just in case" — killed as dead weight; nothing will consume that output anymore.

## Route
1. Delete `src/data/scenario-observations.ts`.
2. `src/data/scenarios.ts` — remove `ObservedPayout` interface, `Scenario.observedPayout?` field, and any inline `observedPayout: {...}` literals in the `SCENARIOS` array (e.g. "Damned If You Don't"). *(D1–D5)*
3. `src/userscripts/arsonists-ledger/index.ts` — remove `OBSERVED_PAYOUTS` import and `withObservedPayout()`; stop calling it in `populateScenarioIndex`. *(D1)*
4. `src/userscripts/arsonists-ledger/settings.ts` — remove `getShowObservedPayouts()`/`setShowObservedPayouts()` from `SettingsCtx`, `KEY_SHOW_OBSERVED_PAYOUTS` storage key, and the "Show observed payout and runs" toggle row. *(D1, D5)*
5. `src/userscripts/arsonists-ledger/tooltip.ts` — remove `formatObservedPayout()`, `observedPayoutLabel()`, and the observed-payout tooltip row (gated by `options?.showObservedPayout`). *(D1)*
6. `scripts/dump-scenarios.ts` — remove the code path that builds/writes `scenario-observations.ts`; keep the rest of the generation (e.g. `static/arsonists-ledger/scenarios.json`) intact. *(D3)*
7. Delete `scripts/audit-arson-cookbooks.ts` outright; remove its `package.json` script entry if one exists. *(D4)*
8. `scripts/audit-arson-logs.ts` — apply the `Logged`-prefix rename across all "observed" identifiers (self-contained, no external importers): `ObservedRecipe`→`LoggedRecipe`, `observedRunCount`→`loggedRunCount`, `bestObservedPayout`→`bestLoggedPayout`, `bestObservedConsumables`→`bestLoggedConsumables`, `bestObservedProfitPerNerve`→`bestLoggedProfitPerNerve`, `scenariosObserved`→`scenariosLogged`, `observedCounts`→`loggedCounts`, `observedRecipeForRun`→`loggedRecipeForRun`, `observedScenario`→`loggedScenario`, `observedConsumableLines`→`loggedConsumableLines`, `bestObservedRecipe`→`bestLoggedRecipe`, `observedLines`→`loggedLines`, `highestObservedPayoutByScenario`→`highestLoggedPayoutByScenario`, `bestObservedRecipeByScenario`→`bestLoggedRecipeByScenario`, `mergedActions` param `observed`→`logged`, `observedItems`→`loggedItems`, local `observedPayout`→`loggedPayout`, local `observedRecipe`→`loggedRecipe`. *(D2)*
9. Regenerate build outputs: run `scripts/dump-scenarios.ts` to refresh `static/arsonists-ledger/scenarios.json`; rebuild the userscript bundle so `dist/arsonists-ledger.user.js` and `static/arsonists-ledger/scenarios.js` drop stale observedPayout output.
10. Verify: `pnpm check` and `pnpm build` both exit 0 (Definition of Done per AGENTS.md).

**First move:** Route item 2 — remove the `ObservedPayout` type and `Scenario.observedPayout` field from `src/data/scenarios.ts`; it's the type-level change everything else (index.ts, tooltip.ts, scenario-observations.ts deletion) depends on for a clean typecheck.
