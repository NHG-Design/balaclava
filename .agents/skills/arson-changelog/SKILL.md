---
name: arson-changelog
description: Generates a Torn-forum-ready HTML changelog of scenario balance changes (payout, resource, qty, stoke/stokeTime edits) in src/data/scenarios.ts between two arsonists-ledger versions. Use when the user asks to write/build/post a changelog, release notes, or "what changed" summary for the arsonists-ledger userscript, references a version bump (e.g. "v1.0.4 to v1.0.5"), or wants scenario changes summarized for the Torn forums. Triggers: changelog, release notes, version bump summary, forum post, scenario changes since last version. Don't use for the balaclava-tooltip project or non-scenario code changes.
---

# Arson Changelog

Produces an HTML file matching Torn's forum WYSIWYG sanitizer, listing scenario changes between two `arsonists-ledger` versions. Output must use ONLY the sanitizer-safe tag subset below — anything else gets silently stripped in the forum editor and breaks the post's structure.

## Steps

1. **Resolve the version range.**
   - If the user gave two versions (e.g. `v1.0.4 v1.0.5`): run `git log -p -- versions.json` and find the commit where the `"arsonists-ledger"` key changed from the old value to the new value. That commit is the range end; the previous version-bump commit (or its parent) is the range start.
   - If the user gave one version (e.g. "changelog for v1.0.6" — this is the common case): treat it as the range end. Run `git log -p -- versions.json` and find the commit where `"arsonists-ledger"` changed to that value. The range start is the previous commit that changed `"arsonists-ledger"` (i.e. the prior version bump).
   - If no versions given: use `git log -p -- versions.json` to find the most recent commit that changed `"arsonists-ledger"`. Diff from that commit to the working tree (uncommitted + committed changes since).
   - If a named version never appears in `versions.json`'s history, stop and tell the user: "v<X> not found in versions.json history — check the version string." Do not guess a nearby commit.

2. **Diff the scenario data.**
   Run `git diff <start-commit> -- src/data/scenarios.ts` (add `HEAD` or omit end ref to include uncommitted changes). Also check other files under `src/data/` if the user mentions non-scenario changes (resources, catalog).
   If the diff is empty, tell the user: "No scenario changes found between <old> and <new>" and skip rendering rather than writing an empty or heading-only HTML file.

3. **Classify each changed scenario.** For every scenario object touched in the diff, work out what changed in plain terms:
   - `payout` value change → "Payout X → Y"
   - `qty` change on a resource in `place`/`stoke`/`ignite` → "<Resource> x<old> → x<new>"
   - resource swapped (one `resourceId` replaced by another at the same slot) → treat as a resource change, not two unrelated adds/removes
   - `stoke` array or `stokeTime` added/removed/changed → describe as added, removed, or changed
   - new scenario in diff (whole object added) → "New scenario"
   - removed scenario → "Removed"
   Skip scenarios where only whitespace/comments changed.

4. **Read the template before writing HTML.**
   **MANDATORY READ:** `plans/arson/changelogs/2026-07-16-scenario-changes.html` — this is the canonical structure. Match it exactly: block order, tag nesting, spacer paragraphs. Do not improvise new HTML structure even if it looks equivalent.

5. **Render.** For each changed scenario, produce one block:
   ```html
   <p>
     <strong><span style="font-size: 15px;">Scenario Name</span></strong
     ><br /><strong>Before</strong>: <old actions/payout><br /><strong>After</strong>: <new actions/payout>
   </p>
   <p>&nbsp;</p>
   ```
   Join sequential actions (ignite → place → stoke) with `&rarr;`. Wrap the whole set under one leading heading block:
   ```html
   <p>
     <strong><span style="font-size: 16px;">Balance changes</span></strong>
   </p>
   <p>&nbsp;</p>
   ```
   Only include a Before/After line if that part actually changed — if payout is unchanged, omit it from the summary rather than repeating an identical value.

6. **Save.** Write to `plans/arson/changelogs/<YYYY-MM-DD>-<old-version>-to-<new-version>.html` (today's date, e.g. `2026-07-20-v1.0.4-to-v1.0.5.html`).

## Sanitizer-safe tags only

- **NEVER use `<ul>`/`<li>`, `<table>`, `<div>`, `<h1>`-`<h6>`, or any `class`/`id` attribute in the output**
  **Instead:** structure everything as `<p>` blocks with `<strong>`, `<span style="font-size: ...">`, `<br />`, `&nbsp;` spacer paragraphs, and `&rarr;` for sequencing.
  **Why:** Torn's forum WYSIWYG editor strips these on paste — the user already had a changelog break this way and had to hand-fix it.

- **NEVER invent a version range by guessing at commit distance (e.g. "last 5 commits")**
  **Instead:** resolve the range from `versions.json`'s git history — it's the only source of truth for which commits belong to which version.
  **Why:** `arsonists-ledger` version bumps don't align with an N-commit cadence; guessing produces a changelog with missing or extra entries.

- **NEVER assume a version bump commit exists for a version the user names if it isn't actually in `versions.json` history**
  **Instead:** stop and report the version wasn't found (see Step 1) — don't pick the nearest commit as a stand-in.
  **Why:** a fabricated "close enough" range silently produces a changelog for the wrong set of commits, which is worse than refusing.

- **NEVER report a Before/After line for a field that didn't change**
  **Instead:** omit unchanged fields (e.g. skip the payout line if only the resource qty changed).
  **Why:** matches the existing template's convention and keeps the forum post scannable.
