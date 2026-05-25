---
name: codebase-investigation
description: Systematic codebase investigation techniques for the CONX configurator — component track discovery, name bias mitigation, blast radius analysis, hypothesis-driven investigation, large file navigation, and ground truth verification. Use when investigating which components are involved in a change, when a ticket names a component that might be wrong, when tracing data flow across stores and settings, or when verifying implementation correctness against the environment.
---

# Codebase Investigation

Reusable investigation patterns for navigating the CONX multi-track component architecture and verifying changes against the environment.

## Component track discovery

This codebase has legacy components and modular replacements that coexist for the same UI area. A ticket or bug report may name only one track — or the wrong one entirely.

### Name bias warning

**Do not trust component names from the ticket.** Jira tickets often mention the wrong component, a parent wrapper, or only one component in a chain. Always trace the actual data flow and rendering path to find every component involved.

**Beware name bias in search.** Searching for a concept (e.g. "engine card") will strongly rank components with that term in their name and may hide components that serve the same role via attributes, settings, or runtime composition. Always complement semantic searches with broad regex alternation patterns.

### Multi-track search strategy

Use all four techniques to discover component tracks:

1. **Search by runtime attribute or CSS selector** — e.g., `[engine-card]`, `:host([engine-card])`
2. **Search by settings path** — e.g., the mandator JSON key `engineCard` or `ENGINE_DATA`
3. **Search by shared template functions** — functions imported by both old and new components
4. **Check mandator presets** — presets determine which component track a brand actually uses

### Determining the target track

Once you find multiple tracks:
- Check which brands/markets use which track via mandator presets
- Flag all discovered tracks to the user
- Ask which track(s) the work should target
- If the ticket assumed a single track, flag the discrepancy

### Independent verification

Even if the ticket says "the bug is in file X, line Y", start from the symptom and trace backwards. If your independent investigation converges on the same location — great, the reporter was right. If it doesn't, **trust your investigation over the ticket's theory** and flag the discrepancy to the user.

## Blast radius analysis

After identifying the target component(s):

1. **Use `search/usages`** to find all call sites for a suspicious function or property
2. **Search for clones** — check whether the same pattern exists elsewhere (typo, wrong literal, etc.)
3. **Check mandator hierarchy** — trace settings from `default.settings.json` → `_brand/` → `_preset/` → `_feature/` → `markets/` to understand where values originate
4. **Check for drift** — run `git log --oneline --since="<date>" -- <affected-files>` to detect files that changed after a document was written; flag meaningful changes

## Ground truth verification

Do not trust that changes work based on reading alone — **verify with the environment**.

**Key pitfall**: Settings changes can silently fail if a higher-priority layer overrides your value. The runtime priority order is: STATES > VARIANTS > OVERWRITES > market > preset > brand > default. Always verify the final merged output, not just the file you edited.

### Verification steps

1. **Run automated checks** — at minimum: `npx tsc --noEmit` for type-checking and the test runner for affected test files (e.g., `npx wtr --files <test-file-path>`)
2. **Read the output** — if tests fail or compilation breaks, diagnose the failure from the terminal output
3. **Fix and re-run** — adjust the implementation or test, then re-run. Iterate until green. Do not declare done while tests are red
4. **Check for pre-existing failures** — if a failure seems unrelated to your changes, use `git stash` to check whether it pre-dates your work. If it does, document it as a pre-existing issue and proceed. If it only fails after your changes, fix it
5. **Note criteria needing manual verification** — for visual or browser-dependent checks, list what the reviewer should verify

### Verification commands

| Check | Command |
|-------|---------|
| Type-check | `npx tsc --noEmit` |
| Single test file | `npx wtr --files <test-file-path>` |
| Full pre-push | `npm run prepush` |
| Lint | `npm run lint` |

## Data flow tracing

Standard path for tracing a value from UI to source:

1. **Locate the symptom** — find the component or function where the wrong behaviour is rendered (use the `codebase-map` skill's element registry)
2. **Trace the data** — follow the value upstream: component → store → business logic → settings → mandator hierarchy (use the store map and type sections)
3. **Pinpoint the cause** — identify the exact line or config value responsible
4. **Sanity-check** — compare your finding against the reporter's theory; state any discrepancy explicitly

## Large file navigation

Key large files: `con-configure.ts` (2000+ lines), `con-model-page.ts`, `con-finance.ts`. Always search within these files first — never read the whole file. Check the class declaration area (first ~80 lines) for the reactive property "table of contents".

## Hypothesis-driven investigation

Form 2-3 hypotheses naming **specific** areas (a function, store, settings path, or mandator layer) before searching broadly. Example:
- H1: "The category observer in `con-configure` passes the wrong value to the progress bar"
- H2: "The menu item lookup in `navigationStore` returns a child instead of parent"
- H3: "The `_preset/` config disables nested category support for this brand"

Test each with **one targeted search** (function name, settings key, store property — never a generic term like "category"). Track: confirmed / rejected / inconclusive. If all rejected after 3 hypotheses, **stop and ask for direction**.

Use for Medium/Complex bugs. Skip when the user or spec already identifies the exact function and file.

## NEVER

- **NEVER search for a single generic term** (e.g., "category", "price", "model") — hundreds of false hits in this codebase. INSTEAD use the store property name, settings key, or function name as the search term.
- **NEVER trust the component name in the Jira ticket** — reporters often name parent wrappers, legacy tracks, or components one level removed from the actual bug site.
- **NEVER expand investigation beyond 3 rejected hypotheses without stopping** — unbounded searching wastes context and delays resolution. Present findings and ask for direction.
- **NEVER read an entire file >500 lines** — search within it first, then read ±50 lines around the match.
- **NEVER skip the mandator hierarchy check for settings-related bugs** — a higher-priority layer (STATES > VARIANTS > OVERWRITES > market > preset > brand > default) may silently override the value you're looking at.

## Operating rules

- **Load `codebase-map` first** — use the element registry, store map, and type sections as starting points instead of broad searches. If `codebase-map` is unavailable, use `grep` with element tag pattern `con-*` and check `apps/conx/src/elements/` as the primary component directory.
- **Load `mandators` skill** when the investigation involves settings merge hierarchy, merge operators, or brand/market overrides
- **Load `lit-expertise` skill** when the investigation involves Lit component lifecycle, decorators, or store bindings
- **Use `execute` only for verification** — run tests, type-checks, and lint. Do not run build, install, or destructive commands

## Common investigation dead-ends

Traps that waste time in this codebase:

- **Component exists but isn't used** — finding `con-X` in `apps/conx/src/elements/` but it's disabled by a `_feature/` flag or replaced by a newer track via a `_preset/` switch
- **Settings key exists but is overridden** — editing the correct key in `default.settings.json` but a market-level or state-level override nullifies your change
- **Re-exports hide the real file** — `packages/core/` re-exports components from `apps/conx/`; editing the re-export barrel doesn't change the source
- **Searching by tag name misses attribute-based variants** — e.g., `<con-card>` with `[engine-card]` attribute behaves completely differently from `<con-card>` without it
- **Test file mirrors wrong track** — test imports the legacy component while the bug is in the modular replacement (or vice versa)
