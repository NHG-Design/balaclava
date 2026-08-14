# SvelteKit Data Flow

Load functions, form actions, serialization rules, fail/redirect/error handling, and client-side auth invalidation. Last verified: 2025-01-11.

## Quick Start

**Which file?** Server-only (DB/secrets): `+page.server.ts` | Universal (runs both): `+page.ts` | API: `+server.ts`

**Load decision:** Need server resources? → server load | Need client APIs? → universal load

**Form actions:** Always `+page.server.ts`. Return `fail()` for errors, throw `redirect()` to navigate, throw `error()` for failures.

```typescript
// +page.server.ts
import { fail, redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
	const user = await db.users.get(locals.userId);
	return { user }; // Must be JSON-serializable
};

export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const email = data.get('email');

		if (!email) return fail(400, { email, missing: true });

		await updateEmail(email);
		throw redirect(303, '/success');
	},
};
```

## Load Functions: Server vs Universal

### Decision Matrix

| Need                                | Use            | File              |
| ----------------------------------- | -------------- | ----------------- |
| Database access                     | Server load    | `+page.server.ts` |
| Secrets/env vars                    | Server load    | `+page.server.ts` |
| Server-only packages                | Server load    | `+page.server.ts` |
| Browser APIs (window, localStorage) | Universal load | `+page.ts`        |
| Client-side fetch                   | Universal load | `+page.ts`        |
| Runs on both                        | Universal load | `+page.ts`        |

### Server Load (+page.server.ts)

**When:** Need server-only resources (DB, secrets, server APIs). **Runs:** Only on server (never in browser).

```typescript
// src/routes/profile/+page.server.ts
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/database';

export const load: PageServerLoad = async ({ locals, params }) => {
	const user = await db.query.users.findFirst({
		where: eq(users.id, locals.userId),
	});
	const posts = await db.query.posts.findMany({
		where: eq(posts.authorId, user.id),
	});
	// Must return serializable data
	return {
		user: { id: user.id, name: user.name, email: user.email },
		posts,
	};
};
```

**Key points:**

- Runs only on server
- Can access `$lib/server/*` imports
- Can use secrets from `env` safely
- Return values must be JSON-serializable
- Output is automatically passed to universal load

### Universal Load (+page.ts)

**When:** Need to run on both server and client, or need browser APIs. **Runs:** Server (during SSR) AND client (during navigation).

```typescript
// src/routes/dashboard/+page.ts
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ data, fetch }) => {
	// `data` comes from +page.server.ts if it exists
	const { user } = data;

	// Fetch additional data (works on both server and client)
	const response = await fetch('/api/stats');
	const stats = await response.json();

	// Can access browser APIs (but check if in browser first)
	const theme =
		typeof window !== 'undefined'
			? localStorage.getItem('theme')
			: null;

	return { user, stats, theme };
};
```

**Key points:**

- Runs on both server AND client
- Receives server load output as `data` parameter
- Use SvelteKit's `fetch` (automatically handles SSR)
- Check `typeof window !== 'undefined'` for browser APIs
- Cannot import from `$lib/server/*`

### Data Flow

```text
Request → Server Load (+page.server.ts)
            ↓ (returns { user })
        Universal Load (+page.ts)
            ↓ (receives data: { user }, returns { user, stats })
        Page Component (+page.svelte)
            ↓ (receives data: { user, stats })
```

```typescript
// +page.server.ts
export const load = async () => {
  return { serverData: 'from server' };
};

// +page.ts
export const load = async ({ data }) => {
  console.log(data.serverData);  // 'from server'
  return { ...data, clientData: 'from universal' };
};

// +page.svelte
<script>
  export let data;  // { serverData, clientData }
</script>
```

### Common Patterns

## Pattern 1: Server + Universal

```typescript
// +page.server.ts - Fetch sensitive data
export const load = async ({ locals }) => {
	const user = await getUser(locals.session);
	return { user };
};

// +page.ts - Fetch public data
export const load = async ({ data, fetch }) => {
	const publicPosts = await fetch('/api/posts').then((r) => r.json());
	return { ...data, publicPosts };
};
```

## Pattern 2: Conditional Universal Load

```typescript
// +page.ts
import { browser } from '$app/environment';

export const load = async ({ fetch }) => {
	const serverData = await fetch('/api/data').then((r) => r.json());
	let clientOnlyData = null;
	if (browser) {
		clientOnlyData = localStorage.getItem('cache');
	}
	return { serverData, clientOnlyData };
};
```

## Pattern 3: Depends for Revalidation

```typescript
// +page.ts
export const load = async ({ fetch, depends }) => {
	depends('app:posts'); // Invalidate with invalidate('app:posts')
	const posts = await fetch('/api/posts').then((r) => r.json());
	return { posts };
};

// Somewhere else:
import { invalidate } from '$app/navigation';
invalidate('app:posts'); // Re-runs load function
```

### Common Mistakes

## ❌ Importing Server Code in Universal Load

```typescript
// +page.ts - WRONG
import { db } from '$lib/server/database'; // ERROR - can't import server code
```

**Fix:** Move to `+page.server.ts`

**❌ Returning Non-Serializable Data** — class instances aren't serializable. **Fix:** Return plain objects (see Serialization below).

**❌ Using window/localStorage Without Check** — fails on server. **Fix:** Check `browser`:

```typescript
import { browser } from '$app/environment';
export const load = async () => {
	const theme = browser ? localStorage.getItem('theme') : 'light';
	return { theme };
};
```

### When to Use Which

**Server Load:** DB access, secrets/env vars, server-only npm packages, hiding implementation details.

**Universal Load:** browser APIs (localStorage, window), public APIs (works on both), client-side navigation without server round-trip, public data.

**Both:** server load fetches sensitive data; universal load fetches public data or adds client-side enhancements.

## Form Actions

Form actions live in `+page.server.ts` and handle form submissions:

```typescript
// +page.server.ts
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const email = data.get('email');
		const password = data.get('password');

		if (!email) {
			return fail(400, { email, missing: true });
		}

		await login(email, password);
		throw redirect(303, '/dashboard');
	},
};
```

```svelte
<!-- +page.svelte -->
<script>
	export let form; // Contains return value from action
</script>

<form method="POST">
	<input name="email" value={form?.email ?? ''} />
	{#if form?.missing}
		<p class="error">Email is required</p>
	{/if}
	<button>Login</button>
</form>
```

### Named Actions

```typescript
export const actions: Actions = {
	login: async ({ request }) => { /* Handle login */ },
	register: async ({ request }) => { /* Handle registration */ },
};
```

```svelte
<form method="POST" action="?/login">...</form>
<form method="POST" action="?/register">...</form>
```

### Progressive Enhancement

Form works without JavaScript:

```svelte
<script>
	import { enhance } from '$app/forms';
</script>

<form method="POST" use:enhance>
	<!-- Works with or without JS -->
</form>
```

With custom handling:

```svelte
<form
	method="POST"
	use:enhance={({ formData, cancel }) => {
		// Before submit
		formData.append('timestamp', Date.now().toString());

		return async ({ result, update }) => {
			// After response
			if (result.type === 'success') {
				await update(); // Update form prop
			}
		};
	}}
>
	...
</form>
```

### Validation Pattern

```typescript
import { fail } from '@sveltejs/kit';
import { z } from 'zod';

const schema = z.object({
	email: z.string().email(),
	password: z.string().min(8),
});

export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const rawData = {
			email: data.get('email'),
			password: data.get('password'),
		};
		const result = schema.safeParse(rawData);
		if (!result.success) {
			return fail(400, {
				errors: result.error.flatten().fieldErrors,
				data: rawData,
			});
		}
		await createUser(result.data);
		throw redirect(303, '/welcome');
	},
};
```

### File Upload

```typescript
export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const file = data.get('file') as File;
		if (!file || file.size === 0) {
			return fail(400, { error: 'No file uploaded' });
		}
		const bytes = await file.arrayBuffer();
		const buffer = Buffer.from(bytes);
		await saveFile(buffer, file.name);
		throw redirect(303, '/uploads');
	},
};
```

```svelte
<form method="POST" enctype="multipart/form-data">
	<input type="file" name="file" required />
	<button>Upload</button>
</form>
```

### Key Rules

1. ✅ Actions must be in `+page.server.ts` (not `+page.ts`)
2. ✅ ALWAYS throw `redirect()` and `error()` (not return)
3. ✅ Return `fail()` for validation errors
4. ✅ Return only serializable data
5. ✅ Don't catch redirects/errors without rethrowing
6. ✅ Use `enhance` for progressive enhancement
7. ✅ Access FormData with `data.get('fieldName')`

## fail(), redirect(), error()

| Function     | When             | Must Throw? | Use Case                              |
| ------------ | ---------------- | ----------- | ------------------------------------- |
| `fail()`     | Validation error | No (return) | Form validation errors                |
| `redirect()` | Navigate user    | **YES**     | After successful action               |
| `error()`    | Fatal error      | **YES**     | Unauthorized, not found, server error |

### fail() — Validation Errors

**Return** (don't throw) from form actions to show validation errors:

```typescript
import { fail } from '@sveltejs/kit';

export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const email = data.get('email');
		if (!email || !email.includes('@')) {
			return fail(400, { email, error: 'Invalid email', missing: !email });
		}
		await processEmail(email);
		throw redirect(303, '/success');
	},
};
```

**Key points:** Return (don't throw) · status code (400 = bad request) · return validation errors + form data to repopulate fields · accessible via `form` prop · page stays on same URL.

### redirect() — Navigation

**Throw** redirect() to navigate user to another page:

```typescript
import { redirect } from '@sveltejs/kit';

export const actions = {
	login: async ({ request, cookies }) => {
		const data = await request.formData();
		const user = await authenticate(data);
		if (!user) return fail(401, { error: 'Invalid credentials' });
		cookies.set('session', user.sessionToken, { path: '/' });
		throw redirect(303, '/dashboard'); // MUST throw
	},
};
```

**Status codes:** `303` See Other (recommended POST → GET) · `301` Moved Permanently · `302` Found (temporary) · `307` Temporary (preserves method) · `308` Permanent (preserves method). **Use 303** for most cases (especially after form submission).

**Key points:** MUST throw · use 303 for form actions · can redirect to external URLs · can use relative paths `throw redirect(303, '..')`.

### error() — Fatal Errors

**Throw** error() for unrecoverable errors (auth, not found, server error):

```typescript
import { error } from '@sveltejs/kit';

export const load = async ({ params, locals }) => {
	const post = await db.query.posts.findFirst({ where: eq(posts.id, params.id) });
	if (!post) throw error(404, 'Post not found'); // MUST throw
	if (post.authorId !== locals.userId) throw error(403, 'Forbidden'); // MUST throw
	return { post };
};
```

**Common status codes:** 400 Bad Request · 401 Unauthorized · 403 Forbidden · 404 Not Found · 500 Internal Server Error.

With custom error data:

```typescript
// src/routes/posts/[id]/+page.server.ts
if (!post) {
	throw error(404, { message: 'Post not found', postId: params.id });
}
```

```svelte
<!-- src/routes/posts/[id]/+error.svelte -->
<script>
	import { page } from '$app/stores';
</script>

<h1>{$page.status}: {$page.error.message}</h1>
{#if $page.error.postId}
	<p>Could not find post with ID: {$page.error.postId}</p>
{/if}
```

**Key points:** MUST throw · renders closest `+error.svelte` · accessible via `$page.status` and `$page.error` · stops load function execution · use for authorization, not found, server errors.

### Common Mistakes

**❌ Not Throwing redirect()** — `redirect(303, '/home')` DOESN'T WORK; use `throw redirect(303, '/home')`.

**❌ Not Throwing error()** — `error(404, 'Not found')` DOESN'T WORK; use `throw error(404, 'Not found')`.

**❌ Throwing fail()** — `throw fail(...)` is WRONG; use `return fail(400, { error: 'Bad' })`.

## ❌ Catching redirect Without Rethrowing

```typescript
// WRONG
try {
	throw redirect(303, '/success');
} catch (e) {
	console.error(e); // Catches redirect - it won't work!
	return fail(500, { error: 'Failed' });
}

// RIGHT
import { isRedirect } from '@sveltejs/kit';
try {
	throw redirect(303, '/success');
} catch (e) {
	if (isRedirect(e)) throw e; // Rethrow redirect
	console.error(e);
	return fail(500, { error: 'Failed' });
}
```

### Decision Tree

```text
Problem in form action?
├─ Validation error (show to user) → return fail(400, { errors })
├─ Success (navigate) → throw redirect(303, '/success')
└─ Fatal error (auth, not found) → throw error(403, 'Forbidden')

Problem in load function?
├─ Data not found → throw error(404, 'Not found')
├─ Unauthorized → throw error(401, 'Unauthorized')
├─ Forbidden → throw error(403, 'Forbidden')
└─ Server error → throw error(500, 'Server error')
```

### Summary Table

|                      | fail()            | redirect()      | error()         |
| -------------------- | ----------------- | --------------- | --------------- |
| **Throw or return?** | Return            | **Throw**       | **Throw**       |
| **Use in**           | Form actions      | Actions & load  | Actions & load  |
| **Purpose**          | Validation errors | Navigate        | Fatal errors    |
| **Status codes**     | 400-499           | 301-308         | 400-599         |
| **Accessible via**   | `form` prop       | N/A (navigates) | `+error.svelte` |
| **Stays on page?**   | Yes               | No (navigates)  | No (error page) |

## Serialization: What Can/Can't Be Returned

**The Rule:** Server load functions and form actions must return JSON-serializable data. Data travels server → client as JSON; non-JSON types break.

### ✅ Serializable (Safe)

String · Number · Boolean · `null` · Array · Plain Object · Nested (if all values serializable).

### ❌ NOT Serializable (Breaks)

| Type           | Example        | Why                        | Fix                                          |
| -------------- | -------------- | -------------------------- | -------------------------------------------- |
| Date           | `new Date()`   | Becomes string             | Use `.toISOString()`                         |
| undefined      | `undefined`    | Removed from JSON          | Use `null`                                   |
| Function       | `() => {}`     | Can't serialize            | Remove or convert to data                    |
| Class instance | `new User()`   | Only serializes properties | Convert to plain object                      |
| Map            | `new Map()`    | Becomes `{}`               | Convert to object: `Object.fromEntries(map)` |
| Set            | `new Set()`    | Becomes `{}`               | Convert to array: `Array.from(set)`          |
| BigInt         | `123n`         | Error                      | Convert to string                            |
| Symbol         | `Symbol('id')` | Removed                    | Don't use                                    |
| RegExp         | `/test/`       | Becomes `{}`               | Convert to string                            |
| Error          | `new Error()`  | Loses stack                | Extract message/code                         |

### Examples

**Date** — convert to ISO string in load, parse back in component:

```typescript
// +page.server.ts - RIGHT
return {
	user: { id: user.id, name: user.name, createdAt: user.createdAt.toISOString() },
};
```

```svelte
<script>
	export let data;
	const createdAt = new Date(data.user.createdAt); // Parse back to Date
</script>
```

**Class instance** — methods are lost during serialization; return a plain object instead.

**undefined** — removed during `JSON.stringify` (key disappears); use `null` to preserve.

**Map/Set** — become `{}`; convert with `Array.from(set)` / `Object.fromEntries(map)`.

**BigInt** — can't serialize; return as a string.

### ORM Returns (Drizzle, Prisma)

Most ORMs return plain objects with Date fields:

```typescript
return {
	user: { ...user, createdAt: user.createdAt.toISOString() },
};
```

Or use a helper:

```typescript
function serialize<T extends Record<string, any>>(obj: T): T {
	return JSON.parse(JSON.stringify(obj)); // Forces serialization
}
```

### Detecting Issues

SvelteKit throws if you return non-serializable data:

```text
Error: Data returned from `load` while rendering / is not serializable:
  - Cannot stringify arbitrary non-POJOs
```

### Quick Checklist

Before returning from server load or form action: all values string/number/boolean/null/array/plain object? · No Date (use `.toISOString()`)? · No undefined (use null)? · No class instances? · No Map/Set? · No functions? · No BigInt (convert to string)?

## Client-Side Auth Invalidation

When using client-side auth libraries (Better Auth, Firebase, Supabase client), layout server data doesn't auto-refresh after login/logout.

### The Problem

```typescript
// signin/+page.svelte - BROKEN
async function handle_signin() {
  await auth_client.signIn.email({ email, password });
  goto('/');  // Layout still shows "logged out"
}
```

**Why?** Client-side navigation (`goto()`) doesn't re-run server load functions. The session cookie is set, but `+layout.server.ts` data is stale.

### ✅ Correct Pattern

Use `goto()` with `invalidateAll: true` in a single call to ensure layout data refreshes:

```typescript
// RIGHT: Single call with invalidateAll option
await goto('/dashboard', { invalidateAll: true });
```

**Why this matters:** After client-side auth, cookies are set but the root layout's `load` function (which typically checks `auth.api.getSession()`) has cached data. `invalidateAll: true` forces all load functions to re-run with the new session cookie.

### Solution A: Inline Invalidation (Simple)

```typescript
// signin/+page.svelte
import { goto, invalidateAll } from '$app/navigation';

async function handle_signin() {
  const result = await auth_client.signIn.email({ email, password });
  if (result.error) return;
  await invalidateAll();  // Re-runs ALL load functions
  goto('/');
}

async function handle_signout() {
  await auth_client.signOut();
  await invalidateAll();
}
```

**Use when:** Single auth entry point, simple apps.

### Solution B: Auth State Listener (Robust)

```svelte
<!-- +layout.svelte -->
<script>
  import { invalidateAll } from '$app/navigation';
  import { onMount } from 'svelte';
  import { auth_client } from '$lib/auth-client';

  onMount(() => {
    const unsubscribe = auth_client.onAuthStateChange(() => {
      invalidateAll();
    });
    return unsubscribe;
  });
</script>
```

**Use when:** Multiple auth flows (OAuth, magic links, etc.), complex apps.

### Common Mistakes

**❌ Separate invalidateAll + goto** — race condition; data might not refresh before navigation:

```typescript
// WRONG
await invalidateAll();
goto('/dashboard');
// ALSO WRONG: goto doesn't wait for invalidation
await invalidateAll();
await goto('/dashboard');
```

Prefer the single `await goto(url, { invalidateAll: true })`. If using `invalidateAll()` separately, always `await` it before `goto()`.

**❌ Destructuring layout data** — static snapshot never updates after `invalidateAll()`:

```svelte
<!-- WRONG -->
<script>
  let { data } = $props();
  const { user } = data;  // Never updates
</script>

<!-- RIGHT - reactive access -->
<script>
  let { data } = $props();
</script>
{data.user?.email}
```

### When invalidateAll() Runs

`invalidateAll()` is the nuclear option — it re-runs ALL load functions for the current page regardless of dependencies: `+layout.server.ts` (all levels), `+layout.ts` (all levels), `+page.server.ts`, `+page.ts`.

### Comparison with Server-Side Auth

| Approach     | Auth Location              | Invalidation               |
| ------------ | -------------------------- | -------------------------- |
| Form actions | Server (`+page.server.ts`) | Automatic (page reload)    |
| Client auth  | Browser (auth_client)      | Manual (`invalidateAll()`) |

Form actions with `throw redirect()` cause a full navigation, which naturally re-runs load functions. Client-side auth with `goto()` does not.
