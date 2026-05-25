# AGENTS.md

## Project

Balaclava is a Torn-focused platform serving live image signatures, web apps, and userscripts. Stack: SvelteKit 2 + Svelte 5, Cloudflare Pages, TypeScript, pnpm. See `CONTEXT.md` for domain model.

## Toolchain

| Task | Command |
|------|---------|
| Install | `pnpm install` |
| Dev server | `pnpm dev` |
| Type check | `pnpm check` |
| Build | `pnpm build` |
| Deploy | `pnpm cf:deploy` |

No test suite exists. Type check + build are the verification gate.

## Definition of Done

A task is complete when **all** of the following exit 0:
1. `pnpm check` (svelte-check + TypeScript)
2. `pnpm build` (Cloudflare adapter — catches edge runtime violations)

## Boundaries

**NEVER:**
- Use Full Torn API keys (`Full` tier) — never needed by any feature
- Use a Limited key for anything other than company employee endpoints (`src/routes/api/company/`) — Limited keys are provided by Company owners, not by Yukio
- Use Node.js-only APIs inside `src/routes/` handlers — all routes run on the Cloudflare Workers runtime; use `nodejs_compat` flag APIs only
- Add factions to the whitelist without explicit instruction from the user — Yukio controls this list
- Use `export const config = { runtime: "edge" }` — that is Next.js syntax; the Cloudflare adapter handles runtime automatically

**ASK before:**
- Adding a new environment variable (must be added to Cloudflare secrets + `.dev.vars`)
- Adding a new npm dependency
- Adding a new Whitelisted Faction to `src/lib/factions.ts`

**ALWAYS:**
- Add new Personal Stats to `src/lib/personal-stats.ts` — never hardcode stat labels elsewhere
- Add new Derived Stats to the `specialStats` export in `src/lib/personal-stats.ts` with a `calculate` function
- Access env vars via SvelteKit's `$env/static/private` — never expose Torn API keys to the client

## When Adding a Faction Signature Feature

1. Add the faction ID string to `whitelisted.getAll` in `src/lib/factions.ts`
2. Add `static/factions/[id]/banner.png` and `static/factions/[id]/logo.svg`
3. Verify the Faction Builder at `/faction` validates the new ID correctly

## When Adding a Personal Signature

1. Add the player's Torn numeric ID and styling config to `src/lib/players.ts`
2. Add `static/[tornId].png` — the background image for the signature

## When Adding a Stat

- Raw Torn API stat → add to `personalStats` in `src/lib/personal-stats.ts`
- Computed from other stats → add to `specialStats` with a `calculate` function
- Stat will automatically appear in the Faction Builder combobox via `labeledStats`

## Known Constraints

- The whitelist is hardcoded in `src/lib/factions.ts`, not database-backed. There is no admin UI.
- `workers-og` must be imported dynamically (not at module level) — WASM cannot be initialized at module scope in the Cloudflare Workers runtime.
