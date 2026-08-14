---
name: with-svelte
description: "Modern Svelte 5 + SvelteKit guidance and routing. Use whenever creating, editing, reviewing, or debugging a Svelte component (.svelte) or module (.svelte.ts/.svelte.js), or any SvelteKit project. Covers runes ($state, $derived, $effect, $props, $bindable), template directives ({@attach}, {@render}, {@html}, snippets, keyed each), components (Bits UI, web components, forms), SvelteKit routing/layouts/error boundaries, data flow (load functions, form actions, +page.server.ts vs +page.ts, serialization, invalidateAll), remote functions (query/form/command/prerender in .remote.ts), deployment (adapters, Vite, pnpm, PWA, Cloudflare), and the @sveltejs/mcp CLI. Triggers are Svelte, SvelteKit, runes, .svelte, .remote.ts, +page, load function, form action."
---

# with-svelte

Unified Svelte 5 + SvelteKit skill. This body is a router: apply the always-on core below, then **READ the one reference file** that matches the task before writing code. Load only the file(s) you need — not all of them.

## Always-on core (every Svelte task)

Write runes-mode Svelte 5. Never reach for a legacy feature that has a modern replacement:

- `$state` instead of implicit `let count = 0; count += 1`
- `$derived`/`$effect` instead of `$:` — and prefer `$derived` over `$effect` (effects are an escape hatch; never set state inside one)
- `$props` instead of `export let`, `$$props`, `$$restProps`
- `onclick={...}` instead of `on:click={...}`
- `{#snippet}`/`{@render}` instead of `<slot>`, `$$slots`, `<svelte:fragment>`
- `{@attach ...}` instead of `use:action`
- `<DynamicComponent>` instead of `<svelte:component this={...}>`; `import Self` instead of `<svelte:self>`
- classes with `$state` fields instead of stores; `createContext` instead of `setContext`/`getContext`
- clsx-style class arrays/objects instead of the `class:` directive
- keyed `{#each}` — never use the index as the key

When unsure of current syntax, do not guess — confirm via the `@sveltejs/mcp` CLI (see `references/tooling.md`) and run `svelte-autofixer` before finalizing any component.

## Routing table — READ the matching reference before writing

| Task involves… | MANDATORY READ |
|---|---|
| Reactive state, props, effects, `$state`/`$derived`/`$effect`/`$props`/`$bindable`, Svelte 4→5 migration, `$inspect`, await-in-component | `references/runes-reactivity.md` |
| `{@attach}` / `use:` actions, `{@html}`, `{@render}`, `{@const}`, `{@debug}`, snippets, keyed each, `bind:`, `<svelte:window>` | `references/template-directives.md` |
| Component libraries (Bits/Ark/Melt UI), web components, forms, styling child components, CSS-from-JS, context | `references/components.md` |
| Routing, file naming (`+page`/`+layout`/`+error`/`+server`), nested layouts, route groups, error boundaries, `<svelte:boundary>`, SSR/hydration | `references/sveltekit-structure.md` |
| `load` functions, `+page.server.ts` vs `+page.ts` vs `+server.ts`, form actions, `fail()`/`redirect()`/`error()`, serialization, `invalidateAll()` | `references/sveltekit-data-flow.md` |
| Remote functions: `query()`/`form()`/`command()`/`prerender()` in `*.remote.ts`, schema validation, `.updates()` | `references/sveltekit-remote-functions.md` |
| Adapters, Vite/pnpm setup, PWA, library authoring, Cloudflare/streaming, production build | `references/deployment.md` |
| Confirming syntax, looking up docs, validating/fixing code | `references/tooling.md` |

If a task spans areas (e.g. a form that uses runes + a server action), read each matching file. Do **not** load files outside the task's scope. If no reference covers the case, fetch authoritative docs via `references/tooling.md` rather than guessing.

## NEVER

- **NEVER set `$state` inside an `$effect` to compute a value**
  **Instead:** use `$derived` (or `$derived.by` for complex expressions).
  **Why:** effect-driven assignment creates extra render passes and update loops; `$derived` is glitch-free and runs lazily.

- **NEVER guard effect/lifecycle code with `if (browser) {...}` to make it server-safe**
  **Instead:** effects already don't run on the server; for global listeners use `<svelte:window>`/`<svelte:document>`, and for browser-only setup use the right reference's SSR guidance.
  **Why:** the guard is dead code inside an effect and signals a misunderstanding that hides real hydration bugs.

- **NEVER return non-serializable values (class instances, functions, symbols) from a SvelteKit `load` or remote function**
  **Instead:** return plain JSON-serializable data; see `references/sveltekit-data-flow.md` / `references/sveltekit-remote-functions.md`.
  **Why:** load uses JSON and remote functions use `devalue`; non-serializable returns fail silently or at runtime across the server→client boundary.

- **NEVER call `redirect()`/`error()` in SvelteKit without `throw`-ing them**
  **Instead:** `throw redirect(303, '/path')` / `throw error(404)`.
  **Why:** without `throw` execution continues and the navigation/error never happens.

- **NEVER guess current Svelte/SvelteKit API surface from memory for unfamiliar features**
  **Instead:** run `npx @sveltejs/mcp list-sections` + `get-documentation`, then `svelte-autofixer` (see `references/tooling.md`).
  **Why:** runes, remote functions, and async Svelte change fast and are version-gated; stale syntax compiles to subtly wrong behavior.
