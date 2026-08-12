# Recipe Submission Review, Voting & Promotion

> Meridian map · Status: route-ready · Started: 2026-08-12

## Destination

Community-submitted arson recipes are publicly visible on balaclava.app, players can log in with their own Torn API key to upvote/downvote submissions, admins can approve or deny them, and approved recipes get shipped into the userscript's scenario dataset for all users.

## Bearings

- **Brought as:** feature (next phase of an already-shipped feature)
- **Context:** Builds directly on the completed intake pipeline in `plans/arson/recipe-submission.md` (route-ready, all items done): a "Submit" tab in the userscript's settings popover POSTs a candidate recipe to `POST /api/arson/recipe-submissions`, which validates it and inserts into a Turso table `recipe_submissions` (`balaclava-arson-recipes` DB) — columns `id, scenario_name, payout_min, payout_max, submitter_id (nullable, best-effort Torn ID), submitter_ip, recipe (JSON), created_at`. No status/approval column exists yet — every row is currently an undifferentiated pending submission. Nothing reads these rows back anywhere; there's no public listing, no voting, no admin UI. `src/data/scenarios.ts`'s `SCENARIOS` array is the bundled dataset the userscript ships with (`scripts/build-userscripts.mjs` bakes it into the `.user.js` body at build time) — it's also fetched at runtime from `https://balaclava.app/arsonists-ledger/scenarios.json` with a 24h client-side cache TTL (`SCENARIOS_VERSION`-keyed), except TornPDA users who only ever see the build-time-baked version (`AGENTS.md`/`CONTEXT.md`: no `GM_xmlhttpRequest` there).
- **Found while scoping:** `.dev.vars` already has `SCENARIO_ADMIN_USERNAME`, `SCENARIO_ADMIN_PASSWORD_HASH`, and `SCENARIO_ADMIN_SESSION_SECRET` — set up previously but **not referenced anywhere in `src/`** (only auto-generated into `.svelte-kit/ambient.d.ts`). This looks like unfinished prior scaffolding for exactly the admin approve/deny piece requested here.
- **Appetite:** Polished — matches the bar set for the submission popover itself: real empty/loading/error states, responsive pass, edge cases considered before calling it done. Not just "the loop works."
- **For:** (a) Arson players browsing/voting on submissions on balaclava.app, (b) Yukio (or whoever holds `SCENARIO_ADMIN_*` credentials) reviewing submissions, (c) all userscript users, who receive approved recipes automatically via the existing scenario-refresh mechanism

## Decision log

| # | Decision | Resolution | Via |
|---|----------|------------|-----|
| 1 | Appetite | Polished — matches the submission-popover bar | J |
| 2 | Promotion mechanism | Auto-commit into `scenarios.ts` via GitHub's API (no local git/filesystem access exists in the Workers runtime — direct git CLI use is impossible there). Chosen over a dynamic Turso-overlay endpoint despite the latter being lower-risk/instant, because it keeps one source of truth instead of two to reconcile later. | J |
| 2a | Commit vs. PR on approval | Opens a PR (not a direct push to main) via GitHub's API — a second human checkpoint (merging) catches bad data before it reaches every user. Cloudflare Pages' existing git integration auto-deploys on merge to main, no extra deploy step needed. | J |
| 3 | Replace vs. alternate on approval | Approved submission's payoutMin/Max + actions overwrite the scenario's existing entry wholesale — one canonical recipe per scenario, matching the current `Scenario` type's shape. No "alternates" concept added. | J |
| 4 | Submission status model | Single `status TEXT DEFAULT 'pending'` column added to the existing `recipe_submissions` table — 1:1 lifecycle per row, no separate table needed. **Amended (#19/#20 below): 4 states, not 3** — `pending` / `approved` (PR open, not yet live) / `merged` (PR merged, live) / `denied`. Also needs a `pr_number` column to correlate the webhook back to a submission. | R |
| 19 | Approved-vs-merged distinction | New explicit `approved` (PR open) vs. `merged` (PR merged, live) statuses — public page shows "approved" submissions honestly as pending-deploy rather than claiming they're already live | J |
| 20 | PR-open failure handling | If the GitHub API call to open the PR fails, the submission stays `pending` and the admin sees an inline error — no silent "approved but no PR exists" state | J |
| 21 | Merge detection | GitHub webhook (new endpoint, e.g. `POST /api/arson/github-webhook`) flips `approved` → `merged` the instant a PR merges. Needs a new webhook secret to verify payloads are genuinely from GitHub. | J |
| 17 | `scenarios.ts` edit mechanism for the PR | Bracket-match the target scenario's object literal by its unique `scenarioName: "X",` anchor in the raw file text, replace that block wholesale with a freshly serialized one. `ts-morph`/TS-compiler-API rejected — too heavy to safely bundle into a Cloudflare Worker (multi-MB, real size-limit risk). Fragility mitigated by the PR step (#2a) putting a human diff-review before merge. | R |
| 5 | Torn API key tier for player login | Public tier only — read-only basic profile (player ID, name, level), validated server-side once against Torn's API, raw key not stored/reused afterward | J |
| 6 | Session mechanism | Signed/httpOnly session cookie minted after one-time key validation (e.g. JWT with player ID + expiry). Raw key never persisted. | J |
| 7 | Session signing secret | New separate `PLAYER_SESSION_SECRET` — kept independent from `SCENARIO_ADMIN_SESSION_SECRET` so the two trust boundaries (low-stakes voting vs. high-stakes admin approval) can rotate independently | J |
| 8 | Admin auth | Confirmed: reuse the existing `SCENARIO_ADMIN_USERNAME`/`SCENARIO_ADMIN_PASSWORD_HASH`/`SCENARIO_ADMIN_SESSION_SECRET` scaffolding rather than building new admin auth | J |
| 9 | Admin actions | Approve or deny only, no edit-before-approve — keeps approved data as exact submitter provenance; a flawed submission gets denied and the player resubmits corrected | J |
| 10 | Denied submissions | Kept in Turso (`status='denied'`), visible to the submitter/public with that status — full audit trail, no separate reason field (matches #9's binary-only scope) | J |
| 12 | Vote changes | Allowed anytime — one row per (submission, player) with a unique constraint, upserted on change/retraction | J |
| 11 | Vote schema | One row per (submission_id, player_id), unique constraint, value ±1 — resolved by #12's answer, no separate aggregate-counter table | R |
| 13 | View vs. vote gating | Public listing is visible to everyone, unauthenticated; login (Public API key) is only prompted when a player tries to cast a vote | J |
| 15 | Competing submissions for the same scenario | They compete, but no hard DB constraint auto-denies losers — admin sees submissions grouped/badged by scenario in the review UI so they don't approve two conflicting ones back-to-back | J |
| 14 | Public listing scope/route | `/arson/submissions` — pending (votable) + approved (reference/history) shown by default, sorted by vote score; denied hidden behind a status filter | J |
| 16 | TornPDA scope | Same existing constraint applies (next full version bump only) — not something this feature needs to solve | J |
| 18 | New GitHub token | Approved — fine-grained PAT, repo-scoped, `contents:write` + `pull-requests:write` only, added as a new Cloudflare secret when built | J |

## Frontier

| # | Open decision | Type | Blocked by |
|---|---------------|------|------------|

## Fog

- Whether merged community-approved recipes should feed the existing `arson-changelog` skill (Torn-forum changelog generator, diffs `scenarios.ts` between versions) — plausibly yes since it already diffs exactly this file, but not scoped here. Clarifies when: this feature has shipped and produced a first real merged PR to see what the diff actually looks like in practice.

## Ruled out

- **Dynamic Turso-overlay endpoint for promotion** — killed because: user chose to keep one source of truth (`scenarios.ts`) over the lower-risk/instant option, accepting the extra build-out cost of GitHub-API automation.
- **Direct push to main on approval** — killed because: no human review before a bad automated edit ships to every player; a PR adds a cheap second checkpoint.
- **`ts-morph`/TS-compiler-API for the `scenarios.ts` edit** — killed because: too heavy to safely bundle into a Cloudflare Worker (multi-MB, real size-limit risk).
- **"Alternate recipes" data model (multiple candidate recipes per scenario)** — killed because: no such concept exists in the current `Scenario` type, and it fights the direction of the recent payout-schema redesign (`plans/arson/payout-schema-and-cookbook-data.md`, commit `5816968`).
- **Edit-before-approve admin action** — killed because: blurs provenance (approved data may no longer be exactly what the player submitted) and needs more UI than approve/deny alone.
- **Auto-deny other pending submissions for the same scenario on approval** — killed because: silently denies someone's work without an admin ever looking at it.
- **Login required just to view the public list** — killed because: works against the explicit "publicize submissions" goal.
- **Scheduled poll for merge detection** — killed because: adds latency and another moving part (cron config) versus an instant webhook.
- **Reusing `SCENARIO_ADMIN_SESSION_SECRET` for player sessions** — killed because: couples two different trust boundaries (low-stakes voting, high-stakes admin approval) to one signing key.
- **Marking a submission 'approved' even if the PR-open call fails** — killed because: risks a silently stuck submission that looks approved but has no actual PR.
- **Deleting denied submissions outright** — killed because: loses the audit trail and gives the submitter no visible feedback that their submission was reviewed.

## Route

1. [x] Schema migration on `recipe_submissions`: add `status TEXT DEFAULT 'pending'` (`pending`/`approved`/`merged`/`denied`) and `pr_number INTEGER` columns; add a `submission_votes` table (`submission_id`, `player_id`, `value` ±1, unique on `(submission_id, player_id)`) — from decisions #4, #11, #19. Done.
2. [x] Provision new secrets: `PLAYER_SESSION_SECRET`, GitHub fine-grained PAT (repo-scoped, `contents:write` + `pull-requests:write`), GitHub webhook secret — add to Cloudflare Pages secrets + `.dev.vars` — from decisions #7, #18, #21. Done: all three generated/provisioned, pushed to Cloudflare Pages secrets + local `.dev.vars`. PAT write access end-to-end verified live (branch create → file write → PR open → close/delete cleanup) against the real repo before trusting it in code.
3. [x] Build player login: `POST /api/arson/auth/login` accepts a Torn Public-tier API key, validates it once against Torn's API, mints a signed httpOnly session cookie (`PLAYER_SESSION_SECRET`) containing the player ID, discards the raw key — from decisions #5, #6, #7. Done: `src/routes/api/arson/auth/{login,logout,me}/+server.ts`, `src/lib/server/session.ts` (hand-rolled HMAC-SHA256 signed cookie via Web Crypto `crypto.subtle` — no new npm dependency for JWT). `pnpm check` + `pnpm build` pass.
4. [x] Build voting endpoint: `POST /api/arson/recipe-submissions/[id]/vote` — requires the player session cookie, upserts into `submission_votes` (change/retract supported) — from decisions #12, #13. Done: `src/routes/api/arson/recipe-submissions/[id]/vote/+server.ts` — `value: 1|-1|0` (0 retracts, deletes the row), `ON CONFLICT DO UPDATE` upsert, returns live score. `pnpm check` + `pnpm build` pass.
5. [x] Build admin auth: reuse `SCENARIO_ADMIN_USERNAME`/`SCENARIO_ADMIN_PASSWORD_HASH`/`SCENARIO_ADMIN_SESSION_SECRET` for a login form + session cookie — from decision #8. Done: `src/routes/api/arson/admin/auth/{login,logout,me}/+server.ts`, `isAdminRequest()` helper in `session.ts` for reuse by route #7. **Assumption flagged**: `SCENARIO_ADMIN_PASSWORD_HASH` is a 64-hex-char value, which I've implemented as an unsalted SHA-256 hex digest of the password — that's the most common convention for a bare `_HASH` env var of that length, but I don't know how the existing value was actually generated. If login fails, this is the first thing to check — tell me the real scheme (or regenerate the hash with `sha256(password)`) and I'll adjust.
6. [x] Build the `scenarios.ts`-editing helper: given a scenario name + new payout/actions, locates and replaces that scenario's object literal in the file text via its `scenarioName` anchor — from decision #17. Done: `src/lib/server/scenarios-patch.ts`. Only touches `payoutMin`/`payoutMax`/`actions` on the matched entry — `notes`/`needsVerification` and every other entry untouched (verified against the real `scenarios.ts`: byte-identical outside the patched block). Matches the codebase's `210_000`-style numeric separators.
7. [x] Build admin approve/deny endpoints: deny sets `status='denied'`; approve calls GitHub's API to create a branch, apply the route-6 edit, open a PR, store `pr_number`, set `status='approved'` — only on successful PR creation, otherwise leaves `status='pending'` and returns an inline error — from decisions #2, #2a, #3, #9, #10, #20. Done: `src/lib/server/github.ts` (branch/file/PR helpers + webhook signature verification for route #9), `src/routes/api/arson/admin/recipe-submissions/{+server.ts (list), [id]/approve, [id]/deny}/+server.ts`. Approve rolls back (deletes the branch) if any GitHub step fails, DB status only flips on full success. `pnpm check` + `pnpm build` pass.
8. [x] Build the admin review UI (behind route-5 auth): lists pending submissions grouped/badged by scenario so competing submissions are visible together, approve/deny actions per submission — from decisions #9, #15. Done: `src/routes/arson/admin/{login,+page.svelte}` + `+page.server.ts` server-side auth guard (redirects to login if the admin cookie isn't valid). Pending submissions grouped by scenario with a "N competing submissions" badge; approved/merged/denied shown in a history table below. `pnpm check` + `pnpm build` pass.
9. [x] Build `POST /api/arson/github-webhook`: verifies the GitHub signature against the route-2 webhook secret, and on a merged-PR event looks up the submission by `pr_number` and sets `status='merged'` — from decision #21. Done: `src/routes/api/arson/github-webhook/+server.ts`. `verifyWebhookSignature()` checked against GitHub's own published test vector (secret `"It's a Secret to Everybody"`, payload `"Hello, World!"` → known signature) before trusting it — matched exactly. **Still needs**: registering the actual webhook on the GitHub repo (Settings → Webhooks → Add webhook, URL `https://balaclava.app/api/arson/github-webhook`, content type `application/json`, secret = the `GITHUB_WEBHOOK_SECRET` value, event: "Pull requests") — that's a one-time manual step on GitHub's side, not something a Worker can do for itself.
10. [x] Build the public `/arson/submissions` page: unauthenticated view, lists pending (votable, sorted by vote score) and approved/merged (reference/history) submissions, denied hidden behind a status filter; vote buttons prompt the route-3 login flow if not logged in; loading/empty/error states per the Polished appetite — from decisions #13, #14, #1. Done: `src/routes/arson/submissions/+page.svelte`, plus a new `GET` handler on `/api/arson/recipe-submissions` (public, joins `submission_votes` for live scores + the requester's own vote). Clicking a vote arrow while logged out opens a login modal instead of failing; the vote that triggered it fires automatically on successful login. `pnpm check` (0 warnings after an a11y pass on the modal) + `pnpm build` pass.

**First move:** Route #1 — the schema migration, since routes 3 through 9 all read or write columns/tables it introduces.
