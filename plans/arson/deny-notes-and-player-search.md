# Deny notes & player search

> Meridian map · Status: route-ready · Started: 2026-08-17

## Destination

Admins can attach an optional note when denying a submission, which is shown on the submission's card whenever anyone (admin or public) views it in a denied state. Separately, the public submissions page (`/arson/submissions`) gets a player ID & name search box, alongside its existing submission-ID and scenario searches.

## Bearings

- **Brought as:** feature (two small, related additions to the existing recipe-submission review pipeline)
- **Context:** Builds on the completed pipeline in `plans/arson/recipe-submission-review.md` and the shared-component split (`RecipeSubmissionCard.svelte`, `variant: 'public' | 'admin'`) from its 2026-08-15 reopened route. The public page (`src/routes/arson/submissions/+page.svelte`) already has a submission-ID search (`idQuery`, exact match via `?id=` on `GET /api/arson/recipe-submissions`) and a scenario search (`ScenarioCombobox`, client-side substring filter) — `idQuery` non-empty greys out the status tabs and scenario search (`idSearchActive`). The admin page (`src/routes/arson/admin/+page.svelte`) only has scenario search, no ID search. Deny today (`src/routes/api/arson/admin/recipe-submissions/[id]/deny/+server.ts`) is a one-click POST with no body, no reason captured anywhere.
- **Appetite:** Small, quick pass — reuse existing patterns (shared card component, `idSearchActive`-style mutual exclusion, existing GET endpoint's query-param filtering), no redesign.
- **For:** Yukio (admin, Torn ID 906148) reviewing submissions; arson players browsing the public denied-submissions view; players/admins looking up a specific player's submission history.

## Decision log

| # | Decision | Resolution | Via |
|---|----------|------------|-----|
| 1 | Player search scope | Public `/arson/submissions` page only, next to the existing ID + scenario search — admin page unaffected | J |
| 2 | Deny-note UX | Always-visible optional textarea on a pending admin card (not revealed only after clicking Deny) — its contents are sent along when Deny is clicked; ignored if Submit (approve) is clicked | J |
| 3 | Deny-note required? | Optional — zero-friction one-click deny still works for obvious cases (dupes, spam) | J |
| 4 | Player search match logic | Substring match against both `submitter_id` and `submitter_name` — one query, either field can hit | J |
| 5 | Player search vs. other filters | Mutually exclusive, same pattern as the existing `idSearchActive` — entering a player query greys out tabs, scenario search, and ID search | J |
| 6 | Deny-note length limit | 500 characters, enforced server-side on the deny endpoint | J |
| 7 | Deny-note storage | New nullable `deny_note TEXT` column on `recipe_submissions`, set only by the deny endpoint, never cleared/edited afterward (matches the no-edit-after-decision precedent set by `field_decisions`) | R |
| 8 | Player search implementation | New `player` query param on `GET /api/arson/recipe-submissions`, `LIKE '%q%'` against `submitter_id` and `submitter_name` server-side (mirrors the existing `id` exact-match branch, not client-side filtering — keeps it working across paginated results) | R |

## Frontier

*(empty — all decisions resolved)*

## Fog

*(none)*

## Ruled out

- **Deny-note textarea revealed only after clicking Deny** — killed because: user wants it always visible/ready, including while using the per-line deny toggles on a submission, not gated behind a click.
- **`prompt()` / modal dialog for the deny note** — killed because: clashes with the card's existing inline, no-modal UI style.
- **Required deny note** — killed because: adds friction to obvious one-click denies (spam/dupes) that don't need an explanation.
- **Player search on admin page too** — killed because: user scoped this to the public page only, matching where the existing ID/scenario search combo already lives.
- **Client-side player-search filtering (like scenario search)** — killed because: the public page's submission list is server-paginated; a client-side filter would only search the currently-loaded page, not the full dataset — the existing `id` search already sets the precedent of a dedicated server query for exact/targeted lookups.

## Route

1. [ ] **Schema migration.** Add nullable `deny_note TEXT` column to `recipe_submissions` (Turso, `balaclava-arson-recipes` DB) — from decision #7. Acceptance: column exists, defaults to `NULL` for all existing rows.
2. [ ] **Deny endpoint.** `POST /api/arson/admin/recipe-submissions/[id]/deny` accepts an optional JSON body `{ note?: string }`; validate `note` is a string ≤500 chars (trim, reject/truncate longer — reject with 400 rather than silently truncate); store into `deny_note` alongside the existing `status = 'denied'` update — from decisions #2, #3, #6, #7. Acceptance: denying with no body still works unchanged; denying with a note persists it; a >500-char note is rejected with a clear error.
3. [ ] **`RecipeSubmission` type + `recipe-diff.ts`.** Add `deny_note: string | null` to the shared type — from decision #7.
4. [ ] **Admin card UI.** In `RecipeSubmissionCard.svelte` (admin variant, pending status): add an always-visible optional `<textarea>` near the per-line toggles/action buttons, bound to local state; `onDeny` is called with the note text so the admin page's `act()` can include it in the deny POST body — from decisions #2, #3. Acceptance: textarea is visible on every pending admin card without any prior click; typing has no effect on Submit (approve); clicking Deny sends whatever's currently typed (including empty).
5. [ ] **Denied-card display.** In `RecipeSubmissionCard.svelte`, when `s.status === 'denied'` and `s.deny_note` is non-empty, render it in both `public` and `admin` variants (e.g. a labeled block near the status badge) — from decision #7 (destination requirement: visible to players checking denied submissions). Acceptance: a denied submission with a note shows it on both the public and admin card; a denied submission without one shows nothing extra.
6. [ ] **Public search endpoint.** Add a `player` query param to `GET /api/arson/recipe-submissions`: when present (and no `id` param), run a `LIKE '%q%'` match against `submitter_id` and `submitter_name`, same response shape as the existing `id` branch — from decisions #4, #8. Acceptance: querying a partial player ID or partial name returns matching submissions across all statuses the caller would otherwise see.
7. [ ] **Public page UI.** In `src/routes/arson/submissions/+page.svelte`: add a `playerQuery` input next to the existing ID/scenario search; a non-empty `playerQuery` greys out tabs, scenario search, and the ID input (and vice versa — only one of ID/player search active at a time), mirroring the existing `idSearchActive` pattern; wire to the new `player` param via a `fetchByPlayer()` helper analogous to `fetchById()` — from decisions #1, #4, #5. Acceptance: typing in the player box filters results live (same debounce/effect pattern as `idQuery`), clears/restores tabs when emptied, and an empty-result state shows a player-specific message.
8. [ ] **Verify.** `pnpm check` and `pnpm build` both exit 0. Manual dev-server check: deny with and without a note, confirm it renders on both card variants; player search by partial ID and by partial name on the public page.

**First move:** Route #1 — the schema migration, since the deny endpoint (#2), card display (#5), and type (#3) all depend on the column existing.
