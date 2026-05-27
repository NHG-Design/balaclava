# ADR 0003 — Debug Build Flag and Scenario Editor

## Status

Superseded

## Context

This ADR described a debug-build gating system (build-time `__DEBUG_PLAYER_ID__`), a scenario editor modal reachable from arson cards in debug builds, a Full Access API key stored in a debug-only settings tab, a log-audit feature, and a Strategy Override persistence layer (`pyroLedger.v1.override.*`).

## Decision (superseded)

All debug-build machinery, the scenario editor modal, the log-audit feature, and Strategy Override persistence have been removed. Updating scenario data is done by editing `src/data/scenarios.ts` directly and committing. The settings panel has three tabs: Prices, Thresholds, API.

There is one canonical recipe per scenario name (first-occurrence-wins in `populateScenarioIndex`). If a player's CS is too low to use a required tool they wait until their CS is high enough.

## Consequences

- No debug build; the full public build is the only artefact.
- `pyroLedger.v1.debugApiKey` and `pyroLedger.v1.override.*` GM storage keys are unused.
- The scenario authoring workflow is: observe in-game → edit `src/data/scenarios.ts` → commit.
