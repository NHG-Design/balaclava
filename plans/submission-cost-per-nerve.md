# Show $/nerve on recipe submissions

> Meridian map · Status: route-ready · Started: 2026-08-15

## Destination

Show the expected $/nerve (profit per nerve, the app's existing PPN metric) for each recipe submission's proposed recipe, on both the admin and public submission cards, computed from the current material-price catalog — reflecting only the currently-approved lines when a submission is under partial review.

## Bearings

- **Brought as:** feature (small pass, building on the existing engine)
- **Context:** Recipe submissions (`recipe_submissions` table) carry a `recipe` (JSON: place/ignite/stoke/dampen `ActionItem[]` + optional stoke/dampen times) and `payout_min`/`payout_max` — structurally identical to a live `Scenario`. The userscript's `src/userscripts/arsonists-ledger/engine.ts` already computes exactly this metric for scenarios (`calcProfitPerNerve`, `calcNerve`, `calcMaterialCost`, `profitBand`, `formatPpn`) and is a pure, DOM-free module safe to import from SvelteKit code. There's no separate "yield/unit" field on a recipe, so "N" = nerve, matching the app's one existing convention (there is no other $/N metric anywhere in the codebase).
- **Shared card:** `src/lib/components/RecipeSubmissionCard.svelte` already renders both admin and public variants from one component (`variant: 'public' | 'admin'` prop), per AGENTS.md's no-duplicate-card rule — this is where the figure gets added once.
- **Partial approval:** admin submissions support per-line approve/deny (`recipe-diff.ts`'s `FieldDecisions`/`mergeDecisions`), already used to reconstruct "what would actually ship" from a submission + decisions map. The $/nerve figure should reuse `mergeDecisions` to reflect exactly that reconstructed recipe.
- **Appetite:** small — reuse `engine.ts` math and `mergeDecisions` wholesale, no new schema, no new API calls, no new price-fetching infra.
- **For:** admins reviewing submissions (`/arson/admin`) and the public submissions page (`/arson/submissions`).

## Decision log

| # | Decision | Resolution | Via |
|---|----------|------------|-----|
| 1 | What does "N" mean? | Nerve — reuse the existing `calcProfitPerNerve` convention from `engine.ts`, already used for scenario ranking | J |
| 2 | Price source, since there's no server-side live price feed today | Static `CATALOG[id].defaultPrice` (`src/data/catalog.ts`) — `engine.ts`'s `resolvePrice` already falls back to this when no override is passed, so an empty `PriceMap {}` is sufficient; no new price-loading code needed | J |
| 3 | Should the figure reflect the full submitted recipe or only approved lines during partial review? | Reflect approved-only lines on admin (live-recompute as reviewers toggle Approve/Deny); public always shows the full submission (nothing to toggle there) | J |
| 4 | How to reconstruct "the recipe as currently decided" for the calc | Reuse `mergeDecisions(s, recipe, current, decisions)` from `recipe-diff.ts` (already used for the shipped-diff logic) — feed it the live `decisions` state while admin-pending, `storedDecisions` (parsed `field_decisions`) for partial/decided-approved, and `{}` (= full submission) for public, merged, and plain-approved-without-field_decisions | R |
| 5 | Payout basis (average vs max) for the PPN calc | `'average'` — `calcProfitPerNerve`'s existing default, matches the scenario-ranking convention elsewhere in the app | R |
| 6 | Display placement/styling | A single line near the top of the card body (below the status/submitter row), reusing `formatPpn()` for text and `profitBand()`'s existing color semantics for tone — same for both variants | R |

## Frontier

*(empty — all decisions resolved)*

## Fog

*(none)*

## Ruled out

- **Live/fetched market prices server-side** — killed because: no server-side Torn API key or price infra exists today, and the appetite is a small pass; static catalog prices (already used for scenario ranking) are the established source of truth in-repo.
- **New yield/output-quantity field on submissions** — killed because: no such concept exists in the recipe/scenario model today; "N" already has one established meaning (nerve) in this codebase and introducing a second would need a schema change with no stated need for it.

## Route

1. [ ] **Add a `Recipe`→`Scenario`-shape adapter + PPN helper.** In `src/lib/recipe-diff.ts` (or a small new helper alongside it), add a function that takes a `MergedRecipe` (or raw `recipe`+payout) and returns `{ ppn, band }` using `calcProfitPerNerve`/`calcNerve`/`calcMaterialCost`/`profitBand` from `src/userscripts/arsonists-ledger/engine.ts` with `prices = {}` and `basis = 'average'`. Acceptance: given a submission's recipe/payout, returns the same PPN a scenario with identical `actions`/payout would produce via the existing engine functions. — from decisions #1, #2, #5
2. [ ] **Wire effective-decisions selection into `RecipeSubmissionCard.svelte`.** Add a `$derived` that picks the decisions map per the existing status/variant branches already in the template (admin+pending → live `decisions`; partial or approved-with-`field_decisions` → `storedDecisions`; everything else → `{}`), runs it through `mergeDecisions`, then through the new PPN helper. Acceptance: toggling a line's Approve/Deny on a pending admin card updates the shown $/nerve immediately; a partial/approved submission shows the figure for its actual decided outcome; public cards show the figure for the full submission. — from decisions #3, #4
3. [ ] **Render the figure.** Add one line to the card body (below the status/submitter row, same position for both variants) showing `formatPpn(ppn)` styled by `profitBand(ppn, DEFAULT_THRESHOLDS)`. Acceptance: visible on both `/arson/admin` and `/arson/submissions` for every submission with a parseable recipe; hidden/omitted when `recipe` fails to parse (existing "Recipe data couldn't be parsed" branch). — from decision #6
4. [ ] **Verify.** `pnpm check` and `pnpm build` exit 0. Manual dev-server spot check: a pending admin submission's figure changes when toggling a line's approve/deny; a public submission shows a sensible figure matching what the same recipe would show if it were a live scenario.

**First move:** Route item 1 — the PPN helper is the foundation both the admin toggle-recompute and public display depend on, and it's independent of any UI work.
