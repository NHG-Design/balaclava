# Recipe Approval PR Pooling + Version Bump

> Meridian map · Status: complete · Started: 2026-08-15

## Destination

Approved recipe changes land in a single pooled open PR (instead of one PR per approval) against `scenarios.ts`, and every such PR always carries a patch-version bump to `versions.json`'s `arsonists-ledger` that stays exactly one ahead of whatever's on `main`, even if another PR merges (and bumps the version) while this one is still open.

## Bearings

- **Brought as:** feature (reworking a piece of the already-shipped review/promotion pipeline)
- **Context:** Today, `POST /api/arson/admin/recipe-submissions/[id]/approve` (`src/routes/api/arson/admin/recipe-submissions/[id]/approve/+server.ts`) does, per approval: create branch `recipe-approval-<id>` off `main` → patch `scenarios.ts` via `src/lib/server/scenarios-patch.ts` → open a PR via `src/lib/server/github.ts`. One PR per approved submission, no version bump at all currently. `versions.json` currently holds `{"balaclava-tooltip": "1.0.7", "arsonists-ledger": "1.2.0"}` — patch bumps have so far always been done by hand (most recently to 1.2.0, by the user, alongside a build + changelog, committed straight to `main`, not via this PR pipeline). The build script (`scripts/build-userscripts.mjs`) reads `versions.json` to stamp the userscript's `@version` header at build time — so a merged scenario-data PR that doesn't bump this file ships new recipe data under an unchanged version number, meaning Greasyfork/GM update-checks wouldn't notice anything changed. `GET /api/arson/github-webhook` already listens for `pull_request` "closed+merged" events and flips DB rows to `merged` by looking up `pr_number` — any pooling model must keep that working (one Turso row's `pr_number` pointing at whichever PR its change ended up in).
- **Appetite:** Functional, matches the existing pipeline's bar — correct, handles the version-bump race for real, but no extra polish/visualization beyond what's needed to use it.
- **For:** Yukio, reducing review overhead from a growing pile of small one-scenario PRs; also closes a real gap (approved recipes currently ship with no version bump at all, so users' update checks never fire)

## Decision log

| # | Decision | Resolution | Via |
|---|----------|------------|-----|
| 1 | Appetite | Functional, matches the existing pipeline's bar — real race handling, no extra polish | J |
| 2 | Pooling model | Auto-pool: approve stays a single click. If a PR is already open on a fixed `recipe-pool` branch, the new approval's scenario patch is added to that same branch/PR; otherwise a fresh branch+PR is opened. No new UI or admin-facing step. | J |
| 3 | Version bump mechanics | Recomputed fresh from `main`'s current `versions.json` (+1 patch) on every approval that touches the pool — overwrites, doesn't compound, the branch's prior bump. Lazy refresh (triggered by the next approval, not eagerly by unrelated merges); a stale-if-idle window is accepted since a real drift surfaces as a visible git conflict on merge, not a silent bad one. | J |
| 4 | Pool detection | Fixed branch name `recipe-pool`, reused across cycles. "Is a pool currently open" = does GitHub report an open PR with `head=recipe-pool`? (`GET /pulls?head=<owner>:recipe-pool&state=open`, no such helper exists yet in `github.ts` — new `findOpenPullRequest()`). If yes, patch that branch's *current* content (fetched from the branch, not `main`) and push additional commits. If no (first-ever approval, or the last pool PR just merged/was closed), delete any stale `recipe-pool` ref if present, branch fresh off `main`, proceed as today. | R |
| 5 | Same-scenario double-approval | Not specifically guarded — if an admin approves two submissions for the same scenario without denying either first (already discouraged by the existing competing-submission UI from the prior route), the second patch simply overwrites the first's change to that scenario's block in the shared branch, same end state as if two single-scenario PRs had merged in sequence. No new failure mode introduced by pooling. | R |
| 6 | Patch commit shape | Two sequential commits per approval on the pool branch: one updating `scenarios.ts` (existing `patchScenarioSource`), one updating `versions.json` (only pushed when the recomputed bump differs from what's already on the branch — avoids a no-op commit when nothing changed). Reuses the existing `updateFile`/`getFileContent` helpers; `versions.json` just needs the same read-SHA-then-write flow already used for `scenarios.ts`. | R |
| 7 | PR body on pooled updates | Re-fetch and rewrite the PR body/description on every addition so it lists every currently-pooled submission (id + scenario name), not just the first one — otherwise a reviewer opening the PR days later only sees the original submission's description. Needs a new small `updatePullRequestBody()` in `github.ts` (GitHub's `PATCH /pulls/{number}`). | R |

## Frontier

| # | Open decision | Type | Blocked by |
|---|---------------|------|------------|

## Fog

## Ruled out

- **Stack-then-submit batching flow** — killed because: adds a required second step and a new "queued" in-between DB state that doesn't exist today, for no benefit over auto-pooling given the user was indifferent between the two.
- **Eager webhook-triggered version-bump refresh** — killed because: meaningfully more to build (the webhook now has to react to merges unrelated to itself) for a race window that's rare given only this pipeline and occasional manual bumps touch `versions.json`; a stale pool PR fails loudly (git conflict) rather than silently, which is an acceptable trade at this appetite.
- **Rebuild-the-whole-branch-from-main on every approval** (reapplying every pooled patch from a fresh `main` snapshot each time) — killed because: only buys protection against `main` drifting for reasons unrelated to this pipeline (e.g. a hand-edit to `scenarios.ts` elsewhere), which is a general long-lived-branch risk out of scope for "functional, no extra polish"; the incremental patch-the-current-branch approach reaches the same end state for the actual use case with far less complexity.

## Route

1. [x] `src/lib/server/github.ts`: add `findOpenPullRequest(token, branch)` (`GET /pulls?head=<owner>:<branch>&state=open`, returns the PR number/body or null) and `updatePullRequestBody(token, prNumber, body)` (`PATCH /pulls/{number}`) — from decisions #4, #7. Done: implemented; required an added `User-Agent` header on all GitHub requests to avoid a `403 Request forbidden by administrative rules` on the `/pulls?head=...` search.
2. [x] New `src/lib/server/version-bump.ts`: `bumpPatch(version: string): string` (semver patch +1) — from decision #3. Done: implemented and unit-verified (`1.2.0→1.2.1`, `1.2.9→1.2.10`, throws on non-semver input).
3. [x] Rewrite `src/routes/api/arson/admin/recipe-submissions/[id]/approve/+server.ts`:
   - Look up an open `recipe-pool` PR via route-1's helper.
   - **If found:** fetch `scenarios.ts` from that branch (not `main`), apply the patch, push; fetch `main`'s `versions.json`, compute the fresh bump, compare against the pool branch's current `versions.json` and only push an update if it differs; rewrite the PR body to list every pooled submission (id + scenario); set this submission's `status='approved'` + `pr_number` = the existing pool PR's number.
   - **If not found:** delete any stale `recipe-pool` ref, branch fresh off `main`, apply the scenario patch + a fresh version bump (both computed from `main`), open the PR, same status/pr_number update as today.
   - Preserve the existing rollback behavior (delete the branch on failure) *only* when this invocation created the branch — never delete a pool branch that already held other approved submissions' work.
   — from decisions #2, #3, #4, #5, #6, #7. Done: implemented and live-verified against real Turso/GitHub (see route #5).
4. [x] Confirm (no code change expected, just a check): `GET /api/arson/github-webhook`'s merge-detection query already updates *every* row sharing a merged PR's `pr_number` to `merged` — verify this still holds true for a pooled PR with 3+ submissions before calling the route done. Done: confirmed by reading `src/routes/api/arson/github-webhook/+server.ts` — its `UPDATE ... WHERE pr_number = ? AND status = 'approved'` is unscoped to a single submission id, so it flips every row sharing a merged PR's number regardless of pool size. No change needed.
5. [x] Full `pnpm check` + `pnpm build` pass; manually exercise the pool path locally against the real `balaclava-arson-recipes` Turso DB + a scratch GitHub branch before trusting it against real submissions (open one pool PR, approve a second submission into it, confirm one commit updates `scenarios.ts` and — only if `main`'s version actually changed — a second commit updates `versions.json`). Done: live-tested end-to-end. Approved submission #11 → opened PR #24 on `recipe-pool`, `scenarios.ts` patched, `versions.json` bumped 1.2.0→1.2.1. Approved submission #12 → pooled into the *same* PR #24 (not a new PR), second scenario patched alongside the first, `versions.json` bump correctly stayed at 1.2.1 (not double-bumped), PR body updated to list both submissions. Verified via direct Turso query and the GitHub API (PR body + `.diff`). Test artifacts cleaned up afterward: PR #24 closed without merging, `recipe-pool` branch deleted, submissions #11/#12 removed from Turso.

**Status: complete.** All route items done and live-verified against real infrastructure.
