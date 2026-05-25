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

`dist/balaclava-tooltip.user.js` is a dependency-free Tampermonkey helper that exposes:

```javascript
unsafeWindow.BalaclavaTooltip
```

Use the pinned release URL in consumer userscripts:

```javascript
// @require https://raw.githubusercontent.com/nhg-design/balaclava/v1.0.1/dist/balaclava-tooltip.user.js
// @grant   unsafeWindow
```

The tooltip supports declarative attributes, imperative `show()` / `attach()` calls, global configuration, viewport-aware positioning, and `system` / `dark` / `light` / `custom` themes. See [docs/balaclava-tooltip.md](docs/balaclava-tooltip.md).

### Arson Helper

[docs/arson-helper.js](docs/arson-helper.js) is the current reference source for the arson userscript. Keep it in docs until it is promoted into a distributable userscript path.

## Signature Features

Personal signatures are configured in [src/lib/players.ts](src/lib/players.ts), with background images in `static/[tornId].png`.

Faction signatures use the whitelist in [src/lib/factions.ts](src/lib/factions.ts), plus faction assets under `static/factions/[id]/`.

Stats are centralized in [src/lib/personal-stats.ts](src/lib/personal-stats.ts). Raw Torn stats belong in `personalStats`; computed stats belong in `specialStats` with a `calculate` function.

## Runtime Notes

Routes run on the Cloudflare Workers runtime. Avoid Node-only APIs in `src/routes/`, and access private environment variables through SvelteKit's `$env/static/private`.

`workers-og` must be imported dynamically because its WASM cannot initialize at module scope in the Cloudflare Workers runtime.
