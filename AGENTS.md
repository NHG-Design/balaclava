# AGENTS.md

## Project

Balaclava is a Torn-focused platform serving live image signatures, web apps, and Tampermonkey userscripts. Stack: Next.js 13 (T3), TypeScript, Tailwind, pnpm. See `CONTEXT.md` for domain model.

## Toolchain

| Task | Command |
|------|---------|
| Install | `pnpm install` |
| Dev server | `pnpm dev` |
| Build | `pnpm build` |
| Lint | `pnpm lint` |
| Type check | `pnpm tsc --noEmit` |

No test suite exists. Lint + type check are the verification gate.

## Definition of Done

A task is complete when **all** of the following exit 0:
1. `pnpm lint`
2. `pnpm tsc --noEmit`
3. `pnpm build`

## Boundaries

**NEVER:**
- Use Full Torn API keys (`Full` tier) — never needed by any feature
- Use a Limited key for anything other than company employee endpoints (`src/pages/api/company/`) — Limited keys are provided by Company owners, not by Yukio
- Use Node.js-only APIs inside `src/pages/api/` routes — all image endpoints run on the edge runtime
- Add factions to the whitelist without explicit instruction from the user — Yukio controls this list
- Extend the tRPC router (`src/server/trpc/`) — it is unused scaffolding, not an active pattern

**ASK before:**
- Adding a new environment variable
- Adding a new npm dependency
- Adding a new Whitelisted Faction to `src/lib/factions.tsx`

**ALWAYS:**
- Add new Personal Stats to `src/lib/personal-stats.tsx` — never hardcode stat labels elsewhere
- Add new Derived Stats to the `specialStats` export in `src/lib/personal-stats.tsx` with a `calculate` function
- Use `app.config.mjs` for the canonical app URL — never hardcode `balaclava.app` as a string

## When Adding a Faction Signature Feature

1. Add the faction ID string to `whitelisted.getAll` in `src/lib/factions.tsx`
2. Add `public/factions/[id]/banner.png` and `public/factions/[id]/logo.svg`
3. Verify the Faction Builder at `/faction` validates the new ID correctly

## When Adding a Personal Signature

1. Create `src/pages/api/sigs/[playername].tsx` — copy `yukio.tsx` as reference
2. Use `export const config = { runtime: "edge" }` — required on all image endpoints
3. Hardcode the player's Torn numeric ID — Personal Signatures are not self-service

## When Adding a Stat

- Raw Torn API stat → add to `personalStats` in `src/lib/personal-stats.tsx`
- Computed from other stats → add to `specialStats` with a `calculate` function
- Stat will automatically appear in the Faction Builder combobox via `labeledStats`

## Known Constraints

- `@vercel/og` is Vercel-specific. The platform is migrating to Cloudflare Workers — do not introduce new Vercel-specific dependencies. Use `@cloudflare/workers-og` or `satori` + `resvg` directly as the replacement.
- The codebase will be rewritten in SvelteKit. Avoid Next.js-specific patterns beyond what already exists.
- The whitelist is hardcoded, not database-backed. There is no admin UI.
