# Recipe Submission Backlog (Voting Dropped)

> Meridian map · Status: route-ready (implemented) · Started: 2026-08-14

## Destination

Players submit arson recipes (unchanged) and can browse a public backlog of all submissions; each submission has a copyable share URL that deep-links directly to it (scrolling it into view). No voting, no player login. The existing admin approve/deny → GitHub PR → merge pipeline is untouched.

## Bearings

- **Brought as:** bug/backtrack — a shipped feature (voting) is being removed as scope-too-heavy, not a new idea
- **Context:** Supersedes [recipe-submission-review.md](recipe-submission-review.md), which built: player login via Torn Public API key (`/api/arson/auth/{login,logout,me}`, `PLAYER_SESSION_SECRET`), a vote endpoint (`/api/arson/recipe-submissions/[id]/vote`, `submission_votes` Turso table), and a public listing page (`/arson/submissions`) with login-gated vote buttons and score-based sorting. The admin review pipeline built in the same phase (admin login, `/arson/admin` dashboard with diff view, approve → GitHub PR → webhook → merge) is **not** in scope to change — it doesn't depend on voting or player login at all, it operates on `recipe_submissions.status`/`pr_number` directly.
- **Appetite:** Quick and clean — remove voting/login fully (routes, DB table, secret, UI), add the share-link feature properly, but no new design/polish pass beyond what the listing page already has.
- **For:** Arson players browsing/sharing submissions (no account needed now), submitters wanting to link a specific recipe (e.g. in a forum post or Discord)

## Decision log

| # | Decision | Resolution | Via |
|---|----------|------------|-----|
| 1 | Appetite | Quick and clean — full removal, not a UI-only disable | J |
| 4 | `submission_votes` production data check | One row exists — your own test vote (`player_id 906148`, submission 3). Nothing to preserve; safe to drop the table. | R |
| 5 | Blast radius of removal | Grepped for `PLAYER_SESSION`/`api/arson/auth`/`PlayerSession`/the vote route across `src/`: confined to exactly `session.ts`, `app.d.ts`, the three `auth/*` routes, the vote route, and `recipe-submissions/+server.ts` (GET) + `arson/submissions/+page.svelte`. Nothing in the admin pipeline, intake API, or userscript touches it — clean to remove. | R |

## Frontier

| # | Open decision | Type | Blocked by |
|---|---------------|------|------------|
| 2 | Share-link format: URL hash (`#submission-42`) or query param (`?id=42`)? | J | — |
| 3 | Default sort order for the backlog now that vote score is gone | J | — |
| 6 | Copy-link UX: dedicated "copy link" button per submission, or just make the URL bar update as you scroll (browser-native anchor behavior)? | J | #2 |
| 2 | Share-link format | URL hash: `/arson/submissions#submission-42`. Client-side scroll-into-view on load if the hash matches a submission's anchor. | J |
| 6 | Copy-link UX | Dedicated "copy link" button/icon per submission — copies the full URL to clipboard with brief "Copied!" confirmation | J |
| 3 | Default sort order | Grouped by scenario name (alphabetical), newest-first within each group — mirrors the admin dashboard's layout for consistency between the two pages | J |
| 7 | Show the same current-vs-submitted diff on the public backlog as the admin dashboard | User request — added mid-route. Reuse, not reimplement: extract the diff-computation logic (`computeDiff`, `itemsKey`) from `src/routes/arson/admin/+page.svelte` into a shared module both pages import, rather than duplicating it. The public page needs its own `+page.server.ts` loading the same `currentScenarios` lookup from `scenarios.ts` (admin's version is gated behind admin auth, can't be reused directly). | J |

## Fog

## Ruled out

- **UI-only disable, leaving routes/table/secret dormant** — killed because: appetite is "quick and clean," not a soft-disable; dead code and an unused secret are worth removing outright.
- **Query-param share URL (`?id=42`)** — killed because: no current need for server-side awareness of which submission is being viewed; a hash is simpler and sufficient.
- **No dedicated copy-link button (rely on browser hash behavior)** — killed because: effectively undiscoverable, doesn't satisfy "a share URL people can copy."
- **Newest-first flat sort** — killed because: user preferred consistency with the admin dashboard's scenario-grouped layout over the simpler flat-list option.

## Route

1. [x] Drop `submission_votes` Turso table (confirmed empty of real data except one test row) — from decision #4. Done.
2. [x] Remove `/api/arson/auth/{login,logout,me}` and `/api/arson/recipe-submissions/[id]/vote` routes entirely — from decisions #1, #5. Done.
3. [x] Strip the votes join/`score`/`yourVote` logic out of `GET /api/arson/recipe-submissions`, keep the status-filtered listing — from decision #1. Done.
4. [x] Remove `PLAYER_SESSION_COOKIE`/player-session usage from `session.ts` (keep `signSession`/`verifySession`/`sha256Hex`/`ADMIN_SESSION_COOKIE`, still used by admin auth); remove `PLAYER_SESSION_SECRET` from `app.d.ts`, `.dev.vars`, and the Cloudflare Pages secret — from decisions #1, #5. Done: secret deleted from Cloudflare via `wrangler pages secret delete`.
5. [x] Extract `computeDiff`/`itemsKey` (and the `FieldDiff` shape) out of `src/routes/arson/admin/+page.svelte` into a shared module — from decision #7. Done: new `src/lib/recipe-diff.ts` (`computeDiff`, `parseRecipe`, `formatItems`, types), admin page now imports it instead of a local copy.
6. [x] Rebuild `/arson/submissions`: remove the login modal, vote buttons, and session check; group submissions by scenario name (alphabetical) with newest-first within each group; add a stable `id="submission-{id}"` anchor and a copy-link button per submission; on mount, scroll a hash-matched submission into view; new `+page.server.ts` loading `currentScenarios` and rendering the same diff table as admin — from decisions #2, #3, #6, #7. Done. Highlight-on-scroll uses a `box-shadow`/`border-color` transition (not a layout property), `ease-out`-family easing.
7. [x] Full `pnpm check` + `pnpm build` pass, confirm no dangling references to the removed auth/vote code, and that admin's diff view still works after the extraction — from decisions #1, #7. Done: grepped for `PLAYER_SESSION`/`api/arson/auth`/vote-route/`submission_votes`/`yourVote`/`castVote` across `src/` — zero matches.

**Status: complete.**
