# Balaclava

Balaclava is a Torn-focused platform for live image signatures, web apps, and Tampermonkey userscripts.

Stack: SvelteKit 2, Svelte 5, TypeScript, Cloudflare Pages, pnpm. See [CONTEXT.md](CONTEXT.md) for the domain model and repository architecture.

## Tooling

| Task | Command |
|------|---------|
| Install dependencies | `pnpm install` |
| Start dev server | `pnpm dev` |
| Type check | `pnpm check` |
| Build | `pnpm build` |
| Deploy | `pnpm cf:deploy` |

There is no dedicated test suite yet. A change is considered verified when both `pnpm check` and `pnpm build` exit 0.

## Userscripts

### Balaclava Tooltip

Source lives in `src/userscripts/balaclava-tooltip/index.ts` and builds to
`dist/balaclava-tooltip.user.js`, a dependency-free Tampermonkey helper that exposes:

```javascript
unsafeWindow.BalaclavaTooltip
```

Use the pinned release URL in consumer userscripts:

```javascript
// @require https://raw.githubusercontent.com/nhg-design/balaclava/v1.0.1/dist/balaclava-tooltip.user.js
// @grant   unsafeWindow
```

The tooltip supports declarative attributes, imperative `show()` / `attach()` calls, global configuration, viewport-aware positioning, and `system` / `dark` / `light` / `custom` themes. See [plans/tooltip/balaclava-tooltip.md](plans/tooltip/balaclava-tooltip.md).

### Pyromaniac's Ledger

Source lives in `src/userscripts/pyromaniacs-ledger/` and builds to
`dist/pyromaniacs-ledger.user.js`. Run `pnpm build:userscripts` to regenerate userscript bundles.

## Signature Features

Personal signatures are configured in [src/lib/players.ts](src/lib/players.ts), with background images in `static/[tornId].png`.

Faction signatures use the whitelist in [src/lib/factions.ts](src/lib/factions.ts), plus faction assets under `static/factions/[id]/`.

Stats are centralized in [src/lib/personal-stats.ts](src/lib/personal-stats.ts). Raw Torn stats belong in `personalStats`; computed stats belong in `specialStats` with a `calculate` function.

## Runtime Notes

Routes run on the Cloudflare Workers runtime. Avoid Node-only APIs in `src/routes/`, and access private environment variables through SvelteKit's `$env/static/private`.

`workers-og` must be imported dynamically because its WASM cannot initialize at module scope in the Cloudflare Workers runtime.
