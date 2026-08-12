# Recipe Submission Popover

> Meridian map · Status: route-ready · Started: 2026-08-12

## Destination

Users can submit a candidate recipe (payout range, materials/steps, igniter, optional stoke/dampen) for a scenario via a popover on the Arson page, and submissions are persisted to a new Turso database.

## Bearings

- **Brought as:** feature
- **Context:** `arsonists-ledger` userscript (`src/userscripts/arsonists-ledger/`) augments Torn's Arson crime page. It has an existing settings popover (`settings.ts`) whose panel styling is the reuse target. Torn's per-crime DOM has a `div.abandonButtonWrapper___jkUrd` (desktop) inside `crimeOptionWrapper` containing the "Abandon target" close button; the new submit-recipe trigger button should be a sibling of that button in that wrapper. Scenario recipes today are hand-curated in `src/data/scenarios.ts` (`ScenarioActions`: `place: ActionItem[]`, optional `stoke`/`dampen: ActionItem[]` with `stokeTime`/`dampenTime`), derived via `scripts/analyze-arson-cookbooks.ts` against cookbook CSV samples in `plans/arson/cookbooks/`. No submission/intake pipeline exists yet. No Turso/`@libsql` usage exists anywhere in the repo — this is a new integration. The site side (`src/routes/`) is a SvelteKit 2 app on Cloudflare Pages/Workers runtime; userscripts cannot hold DB credentials, so persistence must go through a new Cloudflare-side API route, not a direct client→Turso connection from the userscript.
- **Appetite:** Polished v1 — real validation UX, success/error states, basic rate limiting, edge cases considered before calling it done. Not a throwaway MVP.
- **For:** Arsonist's Ledger userscript users on desktop (mobile deferred — no trigger position decided yet, per user)

## Decision log

| # | Decision | Resolution | Via |
|---|----------|------------|-----|
| 1 | Appetite | Polished v1 — real validation UX, success/error states, basic rate limiting, edge cases considered | J |
| 2 | Submission target scenario | The card's own scenario, resolved via the existing `scenarioIndex` match — no in-popover picker | J |
| 3 | Submitter identity | Torn player ID, captured opportunistically from the page/DOM if available; submission still succeeds if it can't be found. Exact extraction mechanism deferred to route research (#12 below). | J |
| 4 | Turso DB provisioning | Route creates a fresh Turso DB scoped to this feature (via CLI, user's existing account), generates an auth token, wires URL+token into Cloudflare secrets + `.dev.vars` as new env vars — flagged per AGENTS.md "ASK before adding a new environment variable," already covered by this decision | J |
| 5 | Submission schema shape | One `recipe_submissions` table: scenario id, payout_min/max, submitter id, created_at, plus a single `recipe` JSON column holding `{place: ActionItem[], igniter, stoke?, stokeTime?, dampen?, dampenTime?}` mirroring `ScenarioActions` shape | J |
| 6 | API route | `POST /api/arson/recipe-submissions`, new `/api/arson/` namespace alongside existing `/api/company/` | J |
| 7 | Abuse control | Cloudflare-side rate limit (per-IP, N/hour) + server-side payload validation (payout bounds, known scenario/resource ids, required fields). No CAPTCHA/shared secret for v1 | J |
| 8 | Place-material step structure | One material+qty per step row; '+' adds a row. Payload is flat `ActionItem[]`, matching `ScenarioActions.place` exactly — no new nesting shape | J |
| 9 | Igniter option set | All `catalog.ts` entries with `category: 'igniter'`, read live — no separate curated list to maintain | J |
| 10 | Stoke/dampen widget | Optional toggled sections, each reusing the same repeatable material+qty row component as place, plus a stokeTime/dampenTime text input — matches `ScenarioActions.stoke?/dampen?: ActionItem[]` exactly | J |
| 11 | Payout validation | Both fields required, non-negative, max ≥ min — no sanity cap | J |
| 13 | Popover chrome reuse | Extract settings popover's shell (positioning, backdrop, close-on-outside-click, base CSS) into a small shared helper; new popover consumes it rather than duplicating | J |
| 14 | Submit feedback | Inline error messages near offending fields; on success, brief inline confirmation then auto-close (~1.5s) | J |
| 15 | Post-intake scope | Intake only — popover → Turso. Review/promotion into `scenarios.ts` is explicitly future work, not part of this route | J |
| 12 | Submit button placement/markup | Confirmed via `plans/arson/references/arson-crime-markup-desktop.html`: insert a new `<button>` as a second child of `div.abandonButtonWrapper___jkUrd`, sized/styled to match the existing `closeButton___SueuL` (14×14 inline SVG icon, same hover-fill CSS var pattern) rather than reusing Torn's obfuscated class directly — a new `pyro-*`-prefixed class, consistent with this script's existing convention (`pyro-band--*`, `pyro-value-pill`) | R |
| 17 | **Supersedes #2 and #13.** Per-card popover redesigned into a Submit tab in the existing (singleton) settings popover | First build had a per-card popover instance created via `createPopover` on every scanned crime card, each reusing the same hardcoded `panelId: "pyro-recipe-panel"` — duplicate DOM ids across cards broke the click→open wiring entirely (the button never toggled its own panel). User's fix, better on its own merits too: fold submission into a new "Submit" tab on the one global settings popover. The scenario is now chosen via a dropdown (options = scenario names currently matched/visible on the page, via new `getVisibleScenarioNames()`), not implicitly bound to the clicked card. Per-card trigger button still exists and still targets that card's scenario, but now via `openSettingsToSubmit(scenarioName)` — it preselects the scenario in the dropdown and pre-fills the whole form from that scenario's known `ScenarioActions` (so tweaking just the payout doesn't require re-entering materials/igniter). One popover instance total, so the duplicate-id class of bug is structurally impossible now. | J |
| 18 | Recipe payload igniter shape correction | Changed from a single `igniter: string` to `ignite: ActionItem[]` (one entry, `qty: 1`), matching `ScenarioActions.ignite` exactly — the original submission schema (decision #5/#9) missed that `ScenarioActions` already has a dedicated `ignite` field shaped like `place`/`stoke`/`dampen`, not a bare igniter id. Caught while rebuilding the form to prefill from `Scenario.actions`. Requires redeploying the already-live API route (see Route #4 amendment) since the old shape shipped first. | R |

## Frontier

| # | Open decision | Type | Blocked by |
|---|---------------|------|------------|

## Fog

- Mobile trigger placement/UX — user has no solution or position yet. Clarifies when: desktop pattern is settled and user wants to revisit, or a mobile user complaint/request surfaces.

## Ruled out

## Route

1. [x] Provision Turso: `turso db create` a new DB for this feature, generate an auth token, add `TURSO_DATABASE_URL`/`TURSO_AUTH_TOKEN` to Cloudflare secrets + `.dev.vars` — from decision #4. Done: DB `balaclava-arson-recipes` (group `nhg`, aws-eu-west-1), secrets pushed to Cloudflare Pages project `balaclava` and local `.dev.vars`.
2. [x] Create `recipe_submissions` table (scenario id, payout_min, payout_max, submitter_id nullable, recipe JSON, created_at) — from decision #5. Done: `id, scenario_name TEXT, payout_min/max INTEGER, submitter_id TEXT nullable, recipe TEXT (JSON), created_at TEXT default CURRENT_TIMESTAMP` in `balaclava-arson-recipes`. Added `@libsql/client` npm dependency (user-approved).
3. [x] Spike: on the live Arson page, find how to read the logged-in player's Torn ID (global var / cookie / DOM). Outcome decides the submitter-id capture code path — resolves frontier #16, decision #3. Done: user confirmed live markup — top-nav `.user-information__* a.menu-value__*[href="/profiles.php?XID=<id>"]`. `getPlayerId()` in `recipe-submit.ts` scoped via new `SEL.USER_INFORMATION` selector.
4. [x] Build `POST /api/arson/recipe-submissions` SvelteKit route: validates payload (payout bounds, known scenario id, known resource ids, required fields), applies per-IP rate limit, inserts into Turso via `@libsql/client` — from decisions #6, #7, #11. Done: `src/routes/api/arson/recipe-submissions/+server.ts`, uses `@libsql/client/web` (workerd-compatible transport), rate limit is a Turso query against `submitter_ip`/`created_at` (5/hour) rather than a new KV/Rate-Limiting binding — avoids adding infra beyond what was already asked. `pnpm check` + `pnpm build` both pass. **Amended per decision #18**: validation now expects `recipe.ignite: ActionItem[]` instead of `recipe.igniter: string`. Deployed once already with the old shape (commit `5ca63f2`) — needs a follow-up commit + push to ship the corrected shape live.
5. [x] Extract shared popover chrome (positioning, backdrop, outside-click close, base CSS) out of `settings.ts` into a small reusable helper — from decision #13 (superseded by #17, but the extraction itself still stands — it's what the settings popover now runs on). Done: new `src/userscripts/arsonists-ledger/popover.ts` (`injectPopoverStyles`/`createPopover`, generic `.pyro-popover-*` classes). `settings.ts` refactored to consume it, keeping its `#pyro-settings-btn`/`#pyro-settings-panel` ids for existing lookups. `pnpm check` + `pnpm build` pass.
6. [x] Build the submit-recipe form: payout min/max fields, repeatable place material+qty rows (+ button), igniter dropdown (live from catalog), optional toggled stoke/dampen sections (same row widget + time input), inline validation, submit → POST → inline success/error — from decisions #8, #9, #10, #11, #14, #17, #18. Done: **redesigned per decision #17** as `src/userscripts/arsonists-ledger/submit-tab.ts`, a new "Submit" tab inside the existing settings popover (not its own popover — see #17 for why). Scenario picked via dropdown (`getVisibleScenarioNames()`); selecting one prefills the whole form from that scenario's known `ScenarioActions`. POSTs via `GM_xmlhttpRequest` to `https://balaclava.app/api/arson/recipe-submissions` (falls back to `fetch` in non-GM/dev contexts — CORS headers `Access-Control-Allow-Origin: https://www.torn.com` on the API route cover that path). Added `ICON_PLUS`/`ICON_TRASH`/`ICON_SEND` to `icons.ts`.
7. [x] Add the submit-recipe trigger button as a sibling inside `div.abandonButtonWrapper___jkUrd`, sized to match `closeButton___SueuL`, scoped to the card's matched scenario (absent if `scenarioIndex` match fails) — from decisions #2, #12, #17. Done: new `SEL.ABANDON_BUTTON_WRAPPER` selector; `attachRecipeSubmitTrigger()` in `index.ts` builds a plain `pyro-popover-btn`-styled button (no popover of its own now, per #17).
8. [x] Wire trigger click → open settings popover on Submit tab with this card's scenario preselected/prefilled — from decisions #2, #3, #17. Done: `attachRecipeSubmitTrigger()`'s click handler calls `openSettingsToSubmit(scenarioName)` (new export in `settings.ts`), which force-opens the singleton settings panel, switches to the Submit tab, and rerenders it with that scenario preselected. `pnpm check` + `pnpm build` pass for the full route.
9. [ ] Commit + push the API route's `ignite` shape correction (decision #18) so production matches what the (still-local, untested-in-Tampermonkey) userscript now sends.

**First move:** Route #9 — push the API's corrected `ignite` shape, since the userscript rebuild already sends it and testing against the stale live shape would misleadingly fail validation.
