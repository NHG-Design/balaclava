# ADR 0002: Userscript versions stored in versions.json

**Status:** Accepted

## Context

Userscript version strings must be bumped on every change to trigger update notifications in userscript managers. They were previously hardcoded inside `scripts/build-userscripts.mjs`. Automated bumping (pre-commit hook + GitHub Actions) requires a script to read and write the version — patching a JavaScript source file with regex is fragile and couples the automation to the build script's formatting.

## Decision

Version strings for each userscript are stored in a dedicated `versions.json` at the repo root. `build-userscripts.mjs` reads from this file at build time. The bump scripts write to it directly as JSON.

## Consequences

- Any tool can read/write versions without parsing JavaScript.
- `versions.json` is the single canonical source of truth — no version appears in more than one place.
- Adding a new userscript requires adding it to both `versions.json` and `build-userscripts.mjs`.
