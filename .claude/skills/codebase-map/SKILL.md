---
name: codebase-map
description: "Structural codebase index — element registry, store topology, MandatorSettings type sections, test locations. Load this skill FIRST when investigating bugs, implementing specs, writing specs, or reviewing code to skip broad discovery searches. For mandator config lookup (merge hierarchy, presets, features, locale rules), load the `mandators` skill instead."
---

# Codebase Map

Pre-built structural indexes for fast lookup. Saves agents from re-discovering the same codebase layout every session.

**Bundled references** (auto-generated — run `npm run generate:codebase-map` to refresh):
- [ELEMENT_REGISTRY.md](ELEMENT_REGISTRY.md) — all `con-*` custom elements → file paths, grouped by category
- [STORE_MAP.md](STORE_MAP.md) — 4 stores, their state types, key fields, usage patterns
- [TYPE_SECTIONS.md](TYPE_SECTIONS.md) — MandatorSettings top-level sections with line numbers, backend base types

**Complementary skill**: For mandator config — merge hierarchy, presets, features, locale rules, runtime pipeline — load the [`mandators`](../mandators/SKILL.md) skill.

---

## Quick orientation

**Freshness check**: If a component you're looking for isn't in the registry, or line numbers don't match, run `npm run generate:codebase-map` before continuing. When search results and the registry conflict, **trust search**.

```
apps/conx/src/        → Lit components (pages, modals, elements, partials, logic)
apps/localizr/src/    → Localization tooling app
packages/business/    → Stores, types (MandatorSettings hub), helpers, controllers
packages/core/        → CoreElement base class, decorators, Store lib
packages/backend-elements/ → Backend API integration components
packages/shared-helpers/   → Pure utilities (findProperty, mergeProperty, etc.)
packages/buildscript/ → Vite build, mandator pipeline
mandators/src/        → Settings + locale JSON (see mandators skill)
apps/conx/templates/  → Handlebars build templates (HTML pages, manifest, settings)
```

## Stores (4 total)

| Store key | State type | Holds |
|-----------|-----------|-------|
| `stateApp` | `ApplicationState` | Session status — decisions, device mode, UI state |
| `stateUcp` | `UcpState` | Backend cache — configuration, pricing, conflicts |
| `stateVehicle` | `VehicleState` | Current vehicle config (rebuilt on every change) |
| `stateResource` | `ResourceState` | Settings (`MandatorSettings`) + localisation |

→ Full details: [STORE_MAP.md](STORE_MAP.md)

## MandatorSettings — key sections

The central settings type (~2200 lines). Top sections with their line numbers:

| Section | What it controls |
|---------|-----------------|
| `APP` | App-level flags, branding, pages, entry points |
| `DEVELOPMENT` | Debug flags, active variants, logger config |
| `CONFIG_EXTENSION` | Runtime config pipeline (overwrites, states, variants) |
| `CONFLICT` | Conflict resolution UI behavior |
| `LINKS` | External links and CTAs |
| `RFX` | RFX layout variant settings |
| `EQUIPMENTS` | Equipment/option display rules |
| `PACKAGES_AND_OPTIONS` | Package grouping and ordering |
| `MODALS` | Modal dialog configuration |
| `STAGE` / `STAGE_VIEW` / `STAGE_CONTROLS` | Visualizer stage behavior |
| `PRINT_PAGE` | Print layout configuration |
| `WALLET` | Financial/wallet features |

→ Full section index with line numbers: [TYPE_SECTIONS.md](TYPE_SECTIONS.md)

## Test locations

| Package | Test dir | Count | Framework |
|---------|----------|-------|-----------|
| `apps/conx` | `apps/conx/test/` | ~300 | `@open-wc/testing`, Mocha BDD, Sinon |
| `packages/business` | `packages/business/test/` | ~215 | Same |
| `packages/backend-elements` | `packages/backend-elements/test/` | ~60 | Same |
| `packages/core` | `packages/core/test/` | ~30 | Same |
| `packages/shared-helpers` | `packages/shared-helpers/test/` | ~7 | Same |

**Test patterns**: `@provideStore` mock wrapper → `fixture(html\`...\`)` → `elementUpdated` → Sinon stubs. See adjacent test files for examples.

## Settings trace cheatsheet

When debugging "why does the UI show X instead of Y":

```
1. FIND THE COMPONENT     → search ELEMENT_REGISTRY.md for the tag name
                          → MANDATORY: open ELEMENT_REGISTRY.md
2. READ THE COMPONENT     → find which store property / settings path it reads
3. CHECK THE STORE        → use STORE_MAP.md to identify the store and its type
                          → MANDATORY: open STORE_MAP.md
4. TRACE THE SETTING      → search MandatorSettings (TYPE_SECTIONS.md) for the property
5. FIND THE CONFIG SOURCE → switch to the `mandators` skill:
                            default → markets → brand → user → preset → feature → env → backend
                            Runtime: OVERWRITES → VARIANTS → STATES (states win)
```

**When the map is insufficient**: If the target component or setting isn't in any reference file, run `npm run generate:codebase-map` first. If still missing, it may be dynamically registered or live outside the standard paths — fall back to `grep` in `apps/conx/src/`.

## NEVER

- **NEVER treat line numbers in TYPE_SECTIONS.md as exact** — they drift between regenerations. Use them for approximate navigation, then confirm with a search.
- **NEVER assume the element registry is complete** — dynamically-registered or very new components may be missing. If not found, search `apps/conx/src/elements/` directly.
- **NEVER skip this skill to "save tokens"** — re-discovering structure from scratch costs 5-10x more tokens than loading the map.
- **NEVER use STORE_MAP as proof a value isn't stored** — some components use local `@state` or session storage outside the 4 main stores.

## Keeping indexes fresh

Run when components, stores, or MandatorSettings change:

```bash
npm run generate:codebase-map
```

**Staleness check** (runs automatically on `npm run prepush`):

```bash
npm run check:codebase-map
```

This regenerates the files and fails if they differ from what's committed — ensuring agents never work from stale indexes.
