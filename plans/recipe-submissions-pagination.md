# Paginate recipe submission lists

> Meridian map · Status: route-ready · Started: 2026-08-15

## Destination

Add "load more" pagination to the public submissions page (pending & approved, and the denied tab) using real server-side paging, and add client-side "load more" to the admin History table, so neither list has to fetch/render its entire growing row set at once.

## Bearings

- **Brought as:** feature (small, quick pass)
- **Context:** `recipe_submissions` (Turso/libSQL) is growing — "quite a few approved" recipes now. Three lists currently fetch everything in one shot:
  - Public submissions page (`src/routes/arson/submissions/+page.svelte:20-37`) — fetches by `status` filter (`default` = pending+approved+merged, or `denied`), no limit/offset sent, groups client-side by scenario.
  - Admin page (`src/routes/arson/admin/+page.svelte:19-39`) — fetches everything unfiltered, splits client-side into `pending` (grouped by scenario, always shown in full) and `others` (the History table, `+page.svelte:202-250`).
  - Both API endpoints (`src/routes/api/arson/recipe-submissions/+server.ts:344-361` and `src/routes/api/arson/admin/recipe-submissions/+server.ts:18-28`) already accept `limit`/`offset` server-side — just unused by the clients today. Neither returns a total count.
- **Appetite:** small, quick pass — reuse existing limit/offset params, minimal new UI, no redesign, no sorting/filtering additions.
- **For:** the public submissions page (community-facing) and the admin recipe-submissions page (Yukio/admins only).

## Decision log

| # | Decision | Resolution | Via |
|---|----------|------------|-----|
| 1 | Load-more button vs numbered pages vs infinite scroll | Load-more button — reuses existing limit/offset, no COUNT(*) needed | J |
| 2 | Admin: paginate pending too, or keep pending fully loaded and only page History? | Keep the single combined admin fetch as-is (no API change); "load more" on History reveals more of the already-fetched list client-side | J |
| 3 | Public submissions page: real server-side paging vs client-side reveal | Real server-side paging — "load more" calls the API again with the next `offset`, so the initial payload doesn't grow with the approved list | J |
| 4 | Page size | 40 rows per page/reveal | J |
| 5 | How to know if more pages exist (no total count available) | Disable/hide "Load more" when a fetched page returns fewer than `limit` rows — no COUNT(*) query needed | R (implementation detail, no user judgment needed) |

## Frontier

*(empty — all decisions resolved)*

## Fog

*(none)*

## Ruled out

- **Numbered pages** — killed because: requires adding a `COUNT(*)` query to both endpoints for total-page math, more UI work than the appetite calls for.
- **Infinite scroll** — killed because: adds scroll-listener/sentinel complexity for what is a low-volume admin/submissions page; not worth it for this appetite.
- **Server-side pagination for admin History** — killed because: user chose to keep the single combined admin fetch unchanged (no API/status-filter change) and only paginate presentation of the already-fetched list; revisit if admin fetch payload itself becomes a real problem.

## Route

1. [x] **Public submissions page — paginated fetch.** In `src/routes/arson/submissions/+page.svelte`, track `offset` and `hasMore` state per `statusFilter`. `loadSubmissions()` fetches with `limit=40&offset=…`; a "load more" call appends the returned rows to `submissions` (existing `groupByScenario` derivation already re-groups on any array change) rather than replacing it. Switching `statusFilter` resets `offset` to 0 and replaces `submissions`. `hasMore = returned.length === 40`. Acceptance: initial load fetches only the first 40 rows; clicking "Load more" appends the next 40 without re-fetching earlier rows; switching between "Pending & approved" and "Denied" tabs resets to a fresh first page; the button is hidden/disabled once a fetch returns fewer than 40 rows. — from decisions #1, #3, #4, #5
2. [x] **Admin History table — client-side reveal.** In `src/routes/arson/admin/+page.svelte`, keep `load()` as-is (single unfiltered fetch). Add a `historyShown` state (default 40) used to slice `others` for the table (`others.slice(0, historyShown)`); a "load more" button under the table increases `historyShown` by 40 and is hidden once `historyShown >= others.length`. Acceptance: History table initially renders at most 40 rows even when more non-pending submissions exist; "Load more" reveals 40 more at a time; button disappears once all history rows are shown; pending items are unaffected (still all shown, ungated). — from decisions #2, #4
3. [x] **Verify.** `pnpm check` and `pnpm build` both exit 0 (confirmed). Manual dev-server check of "load more" UX not yet done — recommended before merge.

**First move:** Route item 1 (public submissions page paginated fetch) — it's the one addressing the actual growth problem flagged (approved list size), and is independent of item 2.
