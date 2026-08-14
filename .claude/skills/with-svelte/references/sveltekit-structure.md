# SvelteKit Routing & Structure

Routing, file naming, nested layouts, route groups, error boundaries, `<svelte:boundary>`, and SSR/hydration. Last verified: 2025-01-11.

## File Naming Conventions

| File                | Purpose               | Runs                  | Example                                       |
| ------------------- | --------------------- | --------------------- | --------------------------------------------- |
| `+page.svelte`      | Page component        | Client & Server (SSR) | `/routes/about/+page.svelte` → `/about`       |
| `+page.ts`          | Universal load        | Client & Server       | Data for +page.svelte                         |
| `+page.server.ts`   | Server load & actions | Server only           | DB queries, form actions                      |
| `+layout.svelte`    | Layout wrapper        | Client & Server       | Wraps child routes                            |
| `+layout.ts`        | Layout universal load | Client & Server       | Data for +layout.svelte                       |
| `+layout.server.ts` | Layout server load    | Server only           | Auth, user data                               |
| `+error.svelte`     | Error boundary        | Client & Server       | Shown when error thrown                       |
| `+server.ts`        | API endpoint          | Server only           | `/routes/api/users/+server.ts` → `/api/users` |

### Route Parameters

| Pattern        | Matches        | Example                                                          |
| -------------- | -------------- | ---------------------------------------------------------------- |
| `[id]`         | Single param   | `/posts/[id]/+page.svelte` → `/posts/123`                        |
| `[slug]`       | Single param   | `/blog/[slug]/+page.svelte` → `/blog/hello-world`                |
| `[[optional]]` | Optional param | `/search/[[query]]/+page.svelte` → `/search` or `/search/svelte` |
| `[...rest]`    | Rest params    | `/docs/[...path]/+page.svelte` → `/docs/a/b/c`                   |

### Route Groups

| Pattern       | Purpose                      | URL                                            |
| ------------- | ---------------------------- | ---------------------------------------------- |
| `(group)`     | Group routes (no URL impact) | `/(app)/dashboard/+page.svelte` → `/dashboard` |
| `(marketing)` | Separate layouts             | Different layout for marketing pages           |

Parentheses make groups invisible in URLs (`/about`, NOT `/(marketing)/about`). Useful for authentication boundaries and applying different layouts per section.

### Special Files

- `hooks.server.ts` - Server hooks (handle function, runs on every request)
- `hooks.client.ts` - Client hooks (runs in browser)
- `app.html` - HTML template
- `service-worker.ts` - Service worker
- `params/*.ts` - Param validators

### Example Tree

```text
src/routes/
├── +layout.svelte              # Root layout
├── +layout.ts                  # Root data
├── +page.svelte                # Homepage
├── +error.svelte               # Root error boundary
│
├── (app)/                      # App routes (grouped)
│   ├── +layout.svelte          # App layout (auth required)
│   ├── dashboard/+page.svelte  # /dashboard
│   └── settings/+page.svelte   # /settings
│
├── (marketing)/                # Marketing routes (grouped)
│   ├── +layout.svelte          # Marketing layout
│   ├── about/+page.svelte      # /about
│   └── pricing/+page.svelte    # /pricing
│
├── blog/
│   ├── +page.svelte            # /blog (list)
│   └── [slug]/
│       ├── +page.svelte        # /blog/post-title
│       └── +page.server.ts     # Load post data
│
└── api/
    └── posts/
        └── +server.ts          # API: GET/POST /api/posts
```

## Layouts

Layouts apply to all child routes. A `+layout.svelte` at any level wraps its descendants.

```svelte
<!-- src/routes/+layout.svelte -->
<script>
	let { children } = $props();
</script>

<header>Header</header>
<main>{@render children()}</main>
<footer>Footer</footer>
```

**Key points:**

- Must declare `children` in `$props()`
- Use `{@render children()}` to render nested content
- Root layout wraps ALL pages

### Nested Layouts

Layouts inherit from parent layouts. Root layout wraps section layout wraps page.

```text
src/routes/
├── +layout.svelte          # Root layout (all pages)
└── dashboard/
    ├── +layout.svelte      # Dashboard layout (dashboard pages only)
    └── +page.svelte        # Uses both layouts
```

```svelte
<!-- src/routes/+layout.svelte -->
<script>
	let { children } = $props();
</script>

<div class="app">
	<nav>Global Nav</nav>
	{@render children()}
</div>
```

```svelte
<!-- src/routes/dashboard/+layout.svelte -->
<script>
	let { children } = $props();
</script>

<div class="dashboard">
	<aside>Dashboard Sidebar</aside>
	<main>{@render children()}</main>
</div>
```

Rendered HTML nests root → dashboard → page accordingly.

### Layout Groups

Use `(groups)` to organize layouts without affecting URLs — different layouts for different sections, useful for auth boundaries.

```text
src/routes/
├── (marketing)/
│   ├── +layout.svelte      # Marketing layout
│   ├── about/+page.svelte  # /about (uses marketing layout)
│   └── pricing/+page.svelte # /pricing (uses marketing layout)
│
└── (app)/
    ├── +layout.svelte      # App layout
    ├── dashboard/+page.svelte  # /dashboard (uses app layout)
    └── settings/+page.svelte   # /settings (uses app layout)
```

### Reset Layout

`@` in a filename to break layout inheritance is **NOT RECOMMENDED** — deprecated in SvelteKit 2+. Use layout groups to create separate hierarchies instead.

### Layout with Data Loading

```typescript
// src/routes/+layout.server.ts
export const load = async ({ locals }) => {
	// Available to all child routes
	return { user: locals.user };
};
```

```svelte
<!-- src/routes/+layout.svelte -->
<script>
	let { children, data } = $props();
</script>

<header>
	{#if data.user}
		<span>Welcome, {data.user.name}</span>
	{:else}
		<a href="/login">Login</a>
	{/if}
</header>

{@render children()}
```

### Protected Layouts

```typescript
// src/routes/(app)/+layout.server.ts
import { redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(303, '/login');
	}
	return { user: locals.user };
};
```

All routes under `(app)` now require authentication.

### Sharing Layout State

```svelte
<!-- src/routes/+layout.svelte -->
<script>
	import { setContext } from 'svelte';
	let { children, data } = $props();
	setContext('user', data.user);
</script>

{@render children()}
```

```svelte
<!-- Any child component -->
<script>
	import { getContext } from 'svelte';
	const user = getContext('user');
</script>

<p>Hello, {user.name}</p>
```

### Layout Slot Props (Snippets)

```svelte
<!-- src/routes/dashboard/+layout.svelte -->
<script>
	let { children, header } = $props();
</script>

<div class="dashboard">
	<aside>Sidebar</aside>
	<div class="content">
		{#if header}
			<header>{@render header()}</header>
		{/if}
		<main>{@render children()}</main>
	</div>
</div>
```

```svelte
<!-- src/routes/dashboard/+page.svelte -->
{#snippet header()}
	<h1>Custom Dashboard Header</h1>
{/snippet}

<p>Dashboard content</p>
```

### Layout Best Practices

1. Keep root layout minimal (shared across ALL pages)
2. Use layout groups for separate sections
3. Load shared data in layout's load function
4. Use context for sharing state with descendants
5. Avoid too many nested layouts (max 2-3 levels)
6. Don't put auth logic in root layout (use groups)
7. Layouts share data DOWN, not UP
8. ❌ Avoid conditionals in layouts (use groups instead)

## Error Handling

### Error Boundary Placement

**Key rule:** `+error.svelte` must be _above_ the failing route in the hierarchy.

```text
src/routes/
├── +error.svelte           # Catches errors in all routes below
├── +page.svelte            # If this errors → uses +error.svelte above
└── admin/
    ├── +error.svelte       # Catches errors in admin routes
    └── +page.svelte        # If this errors → uses admin/+error.svelte
```

**Wrong:**

```text
src/routes/dashboard/
├── +layout.svelte          # If this errors...
└── +error.svelte           # This won't catch it (too low)
```

**Right:**

```text
src/routes/
├── +error.svelte           # Catches dashboard layout errors
└── dashboard/
    ├── +layout.svelte
    └── +error.svelte       # Catches dashboard page errors
```

### Error Propagation

Errors bubble up to the nearest `+error.svelte`. If no error boundary exists at that level, it goes to the parent.

```text
src/routes/
├── +error.svelte                    # Level 1 (root fallback)
└── blog/
    ├── +error.svelte                # Level 2 (blog fallback)
    └── [slug]/
        ├── +layout.server.ts        # Error here → blog/+error.svelte
        ├── +page.server.ts          # Error here → blog/+error.svelte
        └── +page.svelte             # Error here → blog/+error.svelte
```

### Basic Error Page

```svelte
<!-- +error.svelte -->
<script>
	import { page } from '$app/stores';
</script>

<h1>{$page.status}</h1><p>{$page.error.message}</p>
```

### Custom Error Data

```typescript
// +page.server.ts
import { error } from '@sveltejs/kit';

export const load = async ({ params }) => {
	const post = await getPost(params.id);

	if (!post) {
		throw error(404, {
			message: 'Post not found',
			postId: params.id,
		});
	}

	return { post };
};
```

```svelte
<!-- +error.svelte -->
<script>
	import { page } from '$app/stores';
</script>

<h1>{$page.status}</h1>
<p>{$page.error.message}</p>

{#if $page.error.postId}
	<p>Could not find post with ID: {$page.error.postId}</p>
{/if}
```

### Status Code Specific Errors

```svelte
<!-- +error.svelte -->
<script>
	import { page } from '$app/stores';
</script>

{#if $page.status === 404}
	<h1>Page Not Found</h1>
	<a href="/">Go home</a>
{:else if $page.status === 403}
	<h1>Access Denied</h1>
{:else if $page.status === 401}
	<h1>Unauthorized</h1>
	<a href="/login">Login</a>
{:else if $page.status >= 500}
	<h1>Server Error</h1>
{:else}
	<h1>Error {$page.status}</h1>
	<p>{$page.error.message}</p>
{/if}
```

### Common Status Codes

- **400** Bad Request | **401** Unauthorized (not logged in) | **403** Forbidden (logged in, no permission) | **404** Not Found | **500** Internal Server Error | **503** Service Unavailable

### Expected vs Unexpected Errors

**Expected (use `error()`):**

```typescript
if (!post) throw error(404, 'Post not found');
if (post.authorId !== user.id) throw error(403, 'Not your post');
```

**Unexpected (let it bubble):** Unhandled exceptions (DB connection fails) show generic 500.

### handleError Hook (logging/monitoring)

```typescript
// src/hooks.server.ts
import type { HandleServerError } from '@sveltejs/kit';

export const handleError: HandleServerError = ({ error, event }) => {
	console.error('Error:', error, 'Path:', event.url.pathname);
	// Return user-friendly message (don't expose internals)
	return {
		message: 'An unexpected error occurred',
		code: error?.code ?? 'UNKNOWN',
	};
};
```

### Best Practice: Throw in load, not components

Validate and throw errors in `load` functions, not components. A component reading undefined `data` just renders nothing (or crashes) without triggering an error boundary.

### Fallback Error Handling

Always have a root `src/routes/+error.svelte`. Show details in dev, generic in production:

```svelte
<!-- src/routes/+error.svelte -->
<script>
	import { page } from '$app/stores';
	import { dev } from '$app/environment';
</script>

<h1>Oops! Something went wrong</h1>

{#if dev}
	<pre>{JSON.stringify($page.error, null, 2)}</pre>
{:else}
	<p>We're sorry, but something unexpected happened.</p>
{/if}

<a href="/">Go home</a>
```

## svelte:boundary Component

> Available in Svelte 5.3+

### Two Purposes

1. **Error boundaries** - catch rendering errors
2. **Pending UI** - show loading state while `await` resolves

### Basic Error Boundary

```svelte
<svelte:boundary onerror={(e, reset) => console.error(e)}>
	<RiskyComponent />

	{#snippet failed(error, reset)}
		<p>Error: {error.message}</p>
		<button onclick={reset}>Try again</button>
	{/snippet}
</svelte:boundary>
```

### Pending UI (Loading States)

> **⚠️ Known Bug:** `<svelte:boundary>` + `{@const await}` causes
> infinite navigation loops during client-side page transitions when
> pages share async queries. See
> [sveltejs/svelte#17717](https://github.com/sveltejs/svelte/issues/17717).
> Use `{#await}` blocks until this is fixed.

With `experimental.async: true` (Svelte 5.36+), `{@const await}` is possible but **not safe for pages with shared queries or navigation**:

```svelte
<!-- ⚠️ Causes navigation loops - use {#await} instead -->
<svelte:boundary>
	{#snippet pending()}
		<LoadingSpinner />
	{/snippet}

	{@const data = await loadData()}
	<DataView {data} />
</svelte:boundary>
```

**Safe alternative:**

```svelte
{#await loadData()}
	<LoadingSpinner />
{:then data}
	<DataView {data} />
{:catch error}
	<p>Error: {error.message}</p>
{/await}
```

### Combined Error + Pending

Use `svelte:boundary` for **error catching only**, with `{#await}` for async data:

```svelte
<svelte:boundary onerror={logError}>
	{#snippet failed(error, reset)}
		<p>Failed to load user</p>
		<button onclick={reset}>Retry</button>
	{/snippet}

	{#await fetchUser()}
		<p>Loading user...</p>
	{:then user}
		<UserProfile {user} />
	{:catch error}
		<p>Error: {error.message}</p>
	{/await}
</svelte:boundary>
```

### What Gets Caught

**Caught:** Errors during rendering; errors in `$effect`.

**NOT Caught:** Event handler errors (`onclick`, etc.); errors after `setTimeout`; async errors outside boundary's await.

### vs +error.svelte

| Feature  | svelte:boundary         | +error.svelte |
| -------- | ----------------------- | ------------- |
| Scope    | Component subtree       | Route segment |
| Reset    | Built-in reset function | Navigate away |
| Pending  | Yes (pending snippet)   | No            |
| Use case | Component-level         | Page-level    |

### Nested Boundaries

Inner boundary catches first.

```svelte
<svelte:boundary>
	{#snippet failed(e)}
		<p>Outer caught: {e.message}</p>
	{/snippet}

	<svelte:boundary>
		{#snippet failed(e)}
			<p>Inner caught: {e.message}</p>
		{/snippet}

		<ComponentThatMightFail />
	</svelte:boundary>
</svelte:boundary>
```

### Key Points

- Use `svelte:boundary` for component-level error isolation; `+error.svelte` for route-level error pages
- `pending` snippet shows only on **initial** load (not on refresh - no flicker)
- `failed` snippet replaces content on error; `reset` function lets users retry
- Errors in event handlers are NOT caught
- Requires `experimental.async: true` in svelte.config.js for `{@const await}`
- **⚠️ Bug:** `{@const await}` + navigation causes infinite loops ([#17717](https://github.com/sveltejs/svelte/issues/17717)) — use `{#await}` instead

## SSR & Hydration

### The Problem

SvelteKit runs on server (SSR) then hydrates in browser. Code using browser APIs (`window`, `document`, `localStorage`) fails on server.

### Solution: Check for Browser

```typescript
import { browser } from '$app/environment';

// In load function
export const load = async () => {
	const theme = browser ? localStorage.getItem('theme') : 'light';
	return { theme };
};
```

```svelte
<!-- In component -->
<script>
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';

	let data = $state(null);

	// Option 1: browser check
	if (browser) {
		data = localStorage.getItem('data');
	}

	// Option 2: onMount (only runs in browser)
	onMount(() => {
		data = localStorage.getItem('data');
	});

	// Option 3: $effect with browser check
	$effect(() => {
		if (browser) {
			data = localStorage.getItem('data');
		}
	});
</script>
```

### Common Mistakes

**❌ Using window without check** — `window.innerWidth` in a load function errors on server. Guard with `browser ? window.innerWidth : 1024`.

**❌ Accessing DOM in load** — `document.getElementById(...)` errors on server. Do DOM work in `onMount` instead.

### Disable SSR (Not Recommended)

```typescript
// +page.ts
export const ssr = false; // Disables SSR for this page
```

Only use when absolutely necessary (e.g., heavy Canvas/WebGL).
