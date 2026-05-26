# ADR 0003 — Debug Build Flag and Scenario Editor

## Status

Accepted

## Context

The Arsonist's Ledger settings panel has a Debug tab visible to all users. It contains a toggle that enables a `?` badge on unmatched scenario cards, and a list of scenarios seen this session that have no Strategy entry. This is useless to players and potentially confusing.

Separately, updating scenario data (payout, actions, verification status) requires editing `src/data/scenarios.ts` directly and redeploying — there is no in-game authoring flow. Yukio plays Arson regularly and observes scenario recipes and payouts first-hand; the gap between observation and corrected data requires manual TypeScript editing from memory.

The Torn user log API (Full Access key) records every arson action in structured form: materials placed, nerve used per action, and reward collected. This data can drive a structured editor that pre-fills scenario recipes from observed play.

## Decision

### Debug gating via build-time player ID

A `__DEBUG_PLAYER_ID__` constant is injected at esbuild bundle time via the `define` option, reading from `process.env.DEBUG_PLAYER_ID`. At runtime the script reads the logged-in player's Torn ID from the page DOM and compares it to the constant.

- When they match: debug features are active.
- When `DEBUG_PLAYER_ID` is unset (public build): the constant is an empty string, the comparison always fails, and esbuild tree-shakes debug-only code paths out of the bundle.

**Alternatives rejected:**
- *Torn player ID hardcoded in source*: works but couples a personal identifier to the public codebase. A build-time env var keeps it out of version control.
- *Passphrase in the UI*: security through obscurity; anyone reading the minified bundle can find it.
- *Read-only access tier check*: the Torn API doesn't expose the key owner's player ID without a round-trip; a build-time constant avoids that dependency.

### Debug tab restructured

The "enable debug mode" checkbox is removed — debug is always active in debug builds and never active in public builds. The tab gains a Full Access API key field (stored under a new `pyroLedger.v1.debugApiKey` GM storage key, separate from the Public key in the API tab). The missing scenarios list is retained.

The Full Access key is placed in the debug tab rather than the shared API tab because it carries elevated permissions and is an authoring tool, not a user-facing feature. It must not be present in non-debug builds.

### Inline report button on each card

In debug builds, each arson job card receives a small edit icon placed next to the scenario name in the card header (not on the crime image, to keep it visually separate from the user-facing info badge). Clicking opens the Scenario Editor modal.

### Scenario Editor modal

The modal opens immediately with the current data for that scenario (from the bundled Strategy Dataset or any existing Strategy Override in GM storage). It does not fetch the API on open.

Fields:
- `scenarioName` — read-only; the bare job name (e.g. `'From the Ashes'`)
- Location — read-only display context extracted from the card (e.g. `'Ad Agency'`); not persisted
- `payout` — editable number; observed payout from logs is shown as a hint but must be manually confirmed as a base payout due to ±10% variance
- `actions` — editable: place / stoke / ignite / dampen / evidence, each as resource + quantity; stokeTime / dampenTime selects
- `needsVerification` — checkbox
- `notes` — text field

A "Fetch from logs" button inside the modal triggers a Torn user log API call (Full Access key required). Log entries of the form `"Location (ScenarioName)"` are matched by extracting the parenthetical and comparing case-insensitively to `scenarioName`. Matched entries populate the action fields; the observed payout is shown as a hint, not written to the payout field directly.

**Fetch-first rejected**: opening the modal pre-filled is faster on the happy path but obscures what was already in the dataset, gives no feedback when logs are empty, and blocks editing from memory.

### Export as TypeScript snippet

A "Copy as TypeScript" button in the modal copies a snippet formatted for direct paste into the `SCENARIOS` array in `src/data/scenarios.ts`. Resource identifiers use the `RESOURCE.X` constants. Payouts use underscore-separated numeric literals (e.g. `140_000`).

**JSON patch rejected**: adds a translation step. The TypeScript format is what Yukio already authors and is directly pasteable with no conversion.

### Strategy Override persistence

Saved overrides are stored in GM storage under `pyroLedger.v1.override.<scenarioName>`. On load, overrides are merged on top of the bundled Strategy Dataset (override wins on all fields). This means corrections are immediately reflected in PPN rankings and card colour bands without a script update.

## Consequences

- Public builds contain no debug code; the Debug tab is absent.
- The scenario authoring workflow is: observe in-game → click report → optionally fetch logs → adjust fields → copy TypeScript → paste into source → commit.
- The Full Access key is never present in non-debug builds and never leaves the local GM storage.
- A new `pyroLedger.v1.debugApiKey` storage key is introduced; existing `pyroLedger.v1.*` keys are unaffected.
- `scripts/build-userscripts.mjs` gains a `define` entry; `process.env.DEBUG_PLAYER_ID` must be set in the build environment (e.g. `.env.local` or a local shell export) to produce a debug build.
