# AGENTS.md

## Project

Balaclava is a Torn-focused platform serving live image signatures, web apps, and userscripts. Stack: SvelteKit 2 + Svelte 5, Tailwind 4, Cloudflare Pages, Turso, TypeScript, pnpm. See `CONTEXT.md` for domain model.

## Toolchain

| Task | Command |
|------|---------|
| Install | `pnpm install` |
| Dev server | `pnpm dev` |
| Type check | `pnpm check` |
| Build (incl. userscripts) | `pnpm build` |
| Userscripts only | `pnpm build:userscripts` |
| Userscript engine tests | `pnpm test:userscripts` |
| Deploy | `pnpm cf:deploy` |

## Definition of Done

A task is complete when **all** of the following exit 0:
1. `pnpm check` (svelte-check + TypeScript)
2. `pnpm build` (Cloudflare adapter — catches edge runtime violations)
3. `pnpm test:userscripts` — only if `src/userscripts/arsonists-ledger/engine.ts` changed

## Boundaries

**NEVER:**
- Use Full Torn API keys (`Full` tier) — never needed by any feature
- Use a Limited key for anything other than company employee endpoints (`src/routes/api/company/`) — Limited keys come from Company owners, not Yukio
- Use Node.js-only APIs inside `src/routes/` — routes run on Cloudflare Workers; use `nodejs_compat` APIs only
- Use PBKDF2 with >100000 iterations — Workers' WebCrypto rejects it at runtime, not at build time
- Use `export const config = { runtime: "edge" }` — Next.js syntax; the Cloudflare adapter handles runtime
- Add factions to the whitelist without explicit instruction — Yukio controls that list
- Build a second component that renders what an existing one already renders — extend the existing one with a variant or prop (admin vs. public submission cards must be one component)
- `git push` unless the user asked for it in that message — "commit" means commit only

**ASK before:**
- Adding a new environment variable (needs Cloudflare secret + `.dev.vars`)
- Adding a new npm dependency
- Adding a new Whitelisted Faction to `src/lib/factions.ts`

**ALWAYS:**
- Add new Personal Stats to `src/lib/personal-stats.ts`; Derived Stats to `specialStats` with a `calculate` function — never hardcode stat labels elsewhere
- Access env vars via `$env/static/private` — never expose Torn API keys to the client
- Format numbers via `src/lib/utils/data-formatting.ts` (K/M/B) — never inline `toLocaleString` math

## When Building UI (balaclava.app — `src/routes/`, `src/lib/components/`)

**Every new UI element becomes a component in `src/lib/components/` — never inline markup at the call site.** Tabs → a `Tabs` component with `Tabs.Tab` subcomponents. A status chip → a `Chip` component with themed variants. If it needs a second look on a second page, it was always a component.

- Style with `tv()` from `tailwind-variants` — a `base` string plus named `variants` and `defaultVariants`. Never string-concatenate conditional class names.
- One variant axis per concern (`variant`, `size`, `radius`), never a boolean per style.
- Compound components: one directory, `component.svelte` + `component-<part>.svelte` + `index.ts` re-exporting `Root`/`Content`/`Title`, shared state via a `component-context.ts`.
- Colors come from the semantic tokens in `src/app.css` `@theme` (`accent-*`, `ink-*`) — never raw Tailwind palette colors (`bg-violet-600`) in a component.

Reference implementations in the `orakl` repo (`X:/Dev/orakl`): `src/lib/button-variants.ts` (extracted variants), `src/components/svelte/Badge.svelte` (inline variants), `src/lib/components/ui/dialog/` (compound), `src/styles/global.css` (`@theme` semantic tokens + `@custom-variant` theme switching).

## When Building Userscript UI (`src/userscripts/`)

Torn's page is the host. Tailwind and `tv` do not apply here — that stack is for balaclava.app only. Userscript UI is hand-rolled CSS in shadow DOM.

- Reuse the primitives in `src/userscripts/shared/` (`checkbox.ts`, `toggle-row.ts`, `number-input.ts`, `button-group.ts`, `status.ts`) — add a new primitive there rather than a second local implementation
- Theme from Torn's CSS variables (`--tooltip-bg-color`, `--crimes-baseText-color`, `--crimes-subtleSubText-color`, `--mini-profile-border`) — never branch on the `.dark-mode` body class; light mode must work without extra code
- Shadow-DOM children don't inherit Torn's variables — pass them through the host element explicitly
- `type="button"` on every button and tab — otherwise Torn's surrounding form submits
- New `fetch` targets must be added to Torn's CSP `connect-src` allowlist, or the request is blocked in-page

## When Shipping Scenario Changes

1. Any change to `src/userscripts/arsonists-ledger/scenarios.ts` bumps the userscript patch version in `versions.json` by +1
2. If a PR is already open and the version moved meanwhile, re-bump on top of the PR's value
3. `pnpm build:userscripts`, then `/arson-changelog` for the release notes

## When Adding a Faction Signature / Personal Signature

- Faction: add ID to `whitelisted.getAll` in `src/lib/factions.ts`, add `static/factions/[id]/banner.png` + `logo.svg`, verify `/faction` validates the ID
- Personal: add Torn numeric ID + styling to `src/lib/players.ts`, add `static/[tornId].png`

## Escalation

- Cloudflare secret changed → a redeploy is required before it takes effect; say so instead of debugging the old value
- Same fix failing twice → stop and report with the observed error, do not try a third variant
- Need a runtime log → ask the user for the Cloudflare log output; never invent a deployment ID

## Known Constraints

- The faction whitelist is hardcoded in `src/lib/factions.ts`, not database-backed. No admin UI.
- `workers-og` must be imported dynamically — WASM cannot initialize at module scope on Workers.
- Admin is gated to a single Torn user ID (906148).
