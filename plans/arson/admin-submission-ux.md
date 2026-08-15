# Arson admin/submissions UX: non-competing merges + partial field approval

> Meridian map · Status: implemented (unverified against live admin flow) · Started: 2026-08-15

## Destination

Admin can approve/deny a recipe submission field-by-field (payout, place, ignite, stoke, dampen) instead of only whole-submission approve/deny, sibling submissions that touch disjoint fields no longer get funneled into "deny all siblings", the redundant "vs #N: XYZ" line is removed, and cards reflect a "Partially approved" state when only some fields were accepted.

## Bearings

- **Brought as:** bug/UX gap report (3 related issues) on `/arson/admin` and `/arson/submissions`
- **Context:**
  - `RecipeSubmissionCard.svelte` (admin variant) currently only exposes whole-submission Approve/Deny buttons; siblings are listed as `vs #N: <changed fields>` text.
  - `admin/+page.svelte` groups pending submissions by scenario name, shows a "N competing" badge for any group >1, and after an approve, prompts "N other pending submissions for X — Deny all?" (`denyPrompt`).
  - `approve/+server.ts` always writes the submission's *full* recipe (`patchScenarioSource` requires complete `place`/`ignite`, etc.) — submissions carry a full recipe snapshot (unedited fields copied from current data at submit time), not a diff.
  - Because of that full-snapshot shape, two siblings editing disjoint fields (e.g. payout vs. place) can *already* both be approved sequentially today and the second approve's full-recipe write naturally layers on top — the "conflict" is a UI/workflow framing problem (nudging admin to deny one), not a data-model limitation, for the *whole-submission* case.
  - Partial approval *within one submission* (accept payout, reject its place change) is a new capability — needs a merged payload (submission's approved fields + current scenario's value for denied fields) built before calling `patchScenarioSource`. `admin/+page.server.ts` already builds this exact "current value per scenario" map from `SCENARIOS`, so `approve/+server.ts` can import `SCENARIOS` the same way — no new data source needed.
  - `recipe_submissions.status` enum is currently `pending | approved | merged | denied` (no partial state) — schema lives in Turso, no migration files in repo.
- **Appetite:** full feature — new DB state for partial decisions, merged-payload approve logic, redesigned admin card with per-field Approve/Deny toggles (default all-Approve) and bottom-of-card "Deny" / "Submit" actions.
- **For:** the site admin (Yukio/Rob) reviewing community recipe submissions; not the public submitter-facing `/arson/submissions` page (though its card also renders via `RecipeSubmissionCard`, `variant="public"`, unaffected by admin-only changes)

## Decision log

| # | Decision | Resolution | Via |
|---|----------|------------|-----|
| 1 | Does approve-time merge need a new server data source for "current" field values? | No — `SCENARIOS` (already imported by `admin/+page.server.ts`) has everything; `approve/+server.ts` imports it the same way. | R |
| 2 | Field granularity for toggles | Per-ingredient: Payout is one toggle; each item within Place/Ignite/Stoke/Dampen gets its own toggle (stoke/dampen *time* travels with their list as one extra toggle each). | J |
| 3 | Does a removed ingredient (in current, absent from submission) get its own toggle? | Yes — shown as a struck-through row with Approve(=confirm removal)/Deny(=keep it) like any other line. Requires per-item old-vs-new matching by `resourceId` within each list, not just whole-list comparison. | J |
| 4 | How is a partial decision persisted? | New `status: 'partial'` value alongside pending/approved/merged/denied, plus a new `field_decisions` JSON column recording the verdict per line (payout, and per-item keyed by list+resourceId). | J |
| 5 | Sibling nudge replacement | Drop "competing" wording and the forced post-approve "deny all siblings?" prompt entirely. Badge becomes a neutral "N submissions" count; admin acts on each sibling card independently via its own toggles. | J |
| 6 | What happens to denied lines/fields? | Discarded — no separate audit log entry; `field_decisions` JSON (which records every line's verdict) is itself the record. | J |
| 7 | Public `/arson/submissions` page display | Shows partial status too, with the same per-line breakdown (✓/✗ per line) reusing `field_decisions` — not admin-only. | J |
| 8 | "vs #N: XYZ" sibling delta line | Remove outright, no replacement. The scenario-level submission-count badge plus each card's own diff already convey what's needed. | J |

## Fog

*(none)*

## Ruled out

- Item-level diff without a stable per-item id (e.g. purely positional list diffing) — killed because: `resourceId` is already the natural unique key within a recipe's action list (a real recipe doesn't repeat the same resource in one list), and positional diffing breaks the moment items are reordered or one is inserted mid-list.
- Detecting true line-level overlap between siblings to conditionally keep a "deny the other" prompt — killed because: the whole point of per-line toggles is that the admin decides line-by-line per card; a second automated overlap-detection layer duplicates that judgment and adds surface area for no benefit once toggles exist.
- Keeping `status: 'approved'` and inferring "partial" purely from `field_decisions` client-side — killed because: it pushes status-derivation logic into every place that renders/queries by status (card badges, admin `others` list, History table, PR-pooling queries), instead of a single source of truth on the row.

## Route

1. [x] **DB schema**: add `status` value `'partial'` and a `field_decisions TEXT` (JSON) column to `recipe_submissions` (Turso migration, no local migration file precedent — apply directly against the DB and note the schema change somewhere durable, e.g. a comment in the admin submissions server code). Update `RecipeSubmission` type in `recipe-diff.ts` (`status` union, optional `field_decisions`). — acceptance: new column exists, `status` type includes `'partial'`, existing rows unaffected — from decisions #4
2. [x] **Item-level diff helper**: extend `recipe-diff.ts` with a per-list item diff (keyed by `resourceId`) producing added/removed/modified/unchanged rows for `place`/`ignite`/`stoke`/`dampen`, plus the existing whole-field diff for `payout`/`stokeTime`/`dampenTime`. — acceptance: unit-checkable via `pnpm check`/manual verification against a submission with mixed add/remove/modify lines — from decisions #2, #3
3. [x] **Admin card redesign**: `RecipeSubmissionCard.svelte` (admin variant) renders a toggle (default Approve) per payout row and per item-diff row (including removed-item rows), with a bottom-of-card "Deny" (denies everything, one click) and "Submit" (posts current toggle configuration) action, replacing the current plain Approve/Deny buttons. Remove the "vs #N: XYZ" sibling block entirely. — acceptance: matches the sketched layout; Deny still works as a one-click full deny — from decisions #2, #3, #8
4. [x] **Submit-with-decisions endpoint**: replace (or extend) `approve/+server.ts` to accept a per-line decision payload, build a merged `RecipePayload` (submission's value for approved lines, `SCENARIOS`' current value for denied lines — omitting items whose "removal" was denied means keeping them, and omitting newly-added items that were denied), call `patchScenarioSource` with the merged payload, and set `status` to `'approved'` (all-approve) or `'partial'` (mixed) accordingly, storing `field_decisions`. All-deny still routes through the existing `deny` endpoint. — acceptance: a submission with payout approved + one item denied produces a PR patch containing only the approved change; row status/field_decisions reflect the mix — from decisions #4, #6
5. [x] **Admin page sibling UI**: `admin/+page.svelte` — rename "N competing" badge to a neutral "N submissions" label, remove the `denyPrompt` post-approve modal and its wiring (`siblingsToDeny`, `denyAllSiblings`). — acceptance: approving one submission never triggers a "deny all siblings" prompt; siblings remain visible/actionable as normal cards — from decision #5
6. [x] **Partial status badge + public display**: add `'partial'` to `STATUS_CLASSES` in both the card and admin page (e.g. amber/blue blend, label "Partially approved"), and render the per-line ✓/✗ breakdown from `field_decisions` for `status === 'partial'` submissions in both `variant="admin"` and `variant="public"` card modes. — acceptance: a partially-approved submission shows the correct badge and per-line breakdown on both `/arson/admin` and `/arson/submissions` — from decisions #4, #7
7. [x] **Verify**: `pnpm check` and `pnpm build` pass (both green). Manual runthrough against live Turso/GitHub not performed this session — flagged below as follow-up. — from all decisions

**First move:** Route #1 (DB schema: `status: 'partial'` + `field_decisions` column) — everything else (diff helper, card, endpoint, badges) depends on this shape existing first.
