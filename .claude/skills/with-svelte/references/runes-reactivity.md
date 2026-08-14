# Svelte 5 Runes & Reactivity

Reference for `$state`, `$derived`, `$effect`, `$props`, `$bindable`, `$inspect`, reactivity patterns, async, and Svelte 4→5 migration. **Last verified:** 2026-03-12

## Quick Start

**Which rune?** Props: `$props()` | Bindable: `$bindable()` | Computed: `$derived()` | Side effect: `$effect()` | State: `$state()`

**Key rules:** Runes are top-level only. `$derived` can be overridden (use `const` for read-only). Don't mix Svelte 4/5 syntax. Objects/arrays are deeply reactive by default.

```svelte
<script>
	let count = $state(0); // Mutable state
	const doubled = $derived(count * 2); // Computed (const = read-only)

	$effect(() => {
		console.log(`Count is ${count}`); // Side effect
	});
</script>

<button onclick={() => count++}>
	{count} (doubled: {doubled})
</button>
```

## Decision Matrix

| Need                 | Use                    | Why                                    |
| -------------------- | ---------------------- | -------------------------------------- |
| Mutable state        | `$state()`             | Base reactive variable                 |
| Computed value       | `$derived()`           | Auto-updates when dependencies change  |
| Complex computation  | `$derived.by()`        | Use function body for multi-line logic |
| Large immutable data | `$state.raw()`         | Skip deep reactivity for performance   |
| Read-only snapshot   | `$state.snapshot()`    | Get plain JS value, no proxy           |
| Side effect          | `$effect()`            | Run code when dependencies change      |
| Pre-DOM effect       | `$effect.pre()`        | Run before DOM updates                 |
| Accept props         | `$props()`             | Declare component props                |
| Bindable prop        | `$bindable()`          | Allow parent to bind to prop           |
| Reactive class field | `$state` (class field) | Reactive property in class             |

## `$state`

Only use `$state` for variables that should be _reactive_ — i.e. that cause an `$effect`, `$derived` or template expression to update. Everything else can be a normal variable.

```svelte
<script>
	let count = $state(0); // Primitive
	let user = $state({ name: 'Alex', profile: { age: 30 } }); // Object (DEEP reactive)
	let items = $state([1, 2, 3]); // Array (DEEP reactive)
</script>
```

- Must be top-level in component (or a class field).
- Objects/arrays (`$state({...})` / `$state([...])`) are made **deeply reactive** — nested mutations trigger updates. The trade-off: objects must be proxied, which has performance overhead.
- Mutate nested properties directly: `user.profile.age = 31` ✅ (works!)
- Reassigning also works: `user = { ...user, name: 'Bo' }` ✅

### Deep reactivity works by default

```svelte
<script>
	let user = $state({ profile: { name: 'Alex' } });
	function updateName() {
		user.profile.name = 'Bo'; // This DOES trigger reactivity!
	}
</script>
<p>{user.profile.name}</p> <!-- Will update correctly -->
```

Array methods and nested mutations all work because `$state()` creates deep proxies:

```svelte
<script>
	let items = $state([1, 2, 3]);
	function addItem() {
		items.push(4);                 // ✅ Triggers reactivity
		items[items.length] = 5;       // ✅ Also works
		items = [...items, 6];         // ✅ Also works
	}
	let data = $state({ items: [1, 2, 3], nested: { arr: [10, 20] } });
	data.items.push(4);        // ✅ Deep reactivity
	data.nested.arr.push(30);  // ✅ Deeply reactive
</script>
```

### `$state.raw` (performance)

For large objects that are only ever **reassigned** (not mutated) — e.g. API responses — use `$state.raw` to skip proxy overhead.

```svelte
<script>
	let config = $state.raw(hugeConfigObject); // No proxy overhead
	let apiData = $state.raw(data);
	// Later: apiData = newData; (full replacement)

	// If you WILL mutate nested properties, use $state:
	let user = $state({ profile: { name: 'Alex' } });
	user.profile.name = 'Bo'; // Works with deep reactivity
</script>
```

**Use `$state.raw()` when:** data is large/immutable; you'll fully replace not mutate; performance-critical. **Don't when:** you need to mutate nested properties and see UI updates; data is small/medium.

### `$state.snapshot`

Extract plain JS values from proxies:

```svelte
<script>
	let user = $state({ name: 'Alex', age: 30 });
	function saveToAPI() {
		const plain = $state.snapshot(user); // Get plain object
		fetch('/api/users', { body: JSON.stringify(plain) });
	}
</script>
```

## `$derived`

To compute something from state, use `$derived` rather than `$effect`:

```js
// do this
let square = $derived(num * num);

// don't do this
let square;
$effect(() => {
	square = num * num;
});
```

> `$derived` is given an expression, _not_ a function. If you need a function (complex expression) use `$derived.by`.

```svelte
<script>
	let count = $state(0);
	let doubled = $derived(count * 2); // Simple
	let message = $derived.by(() => {
		if (count === 0) return 'Zero';
		return count > 10 ? 'High' : 'Low';
	});
</script>
```

- **Deriveds are writable** — as of Svelte 5.25+ you can reassign them, but they re-evaluate when their expression changes. Use `const` to make truly read-only.
- Auto-tracks dependencies. **Lazy** — only computes when accessed; garbage-collectable.
- If the derived expression is an object/array, it is returned as-is — **not** made deeply reactive. You can use `$state` inside `$derived.by` in the rare cases you need this.

## `$effect`

**Effects are an escape hatch and should mostly be avoided.** In particular, avoid updating state inside effects.

```text
Need to react to state change?
├─ Can use event handler? → USE EVENT HANDLER (preferred)
├─ Is it a computed value? → USE $derived
├─ Is it DOM-specific? → USE @attach
└─ External side effect? → USE $effect (with cleanup)
```

- If you need to sync state to an external library (e.g. D3), it is often neater to use `{@attach ...}`.
- If you need code in response to user interaction, put it directly in an event handler or use a function binding.
- If you need to log values for debugging, use `$inspect`.
- If you need to observe something external to Svelte, use `createSubscriber`.

Never wrap effect contents in `if (browser) {...}` — **effects do not run on the server**.

```svelte
<script>
	let count = $state(0);
	$effect(() => {
		console.log(`Count changed to ${count}`);
		document.title = `Count: ${count}`;
	});

	// $effect with cleanup
	$effect(() => {
		const interval = setInterval(() => {...}, 1000);
		return () => clearInterval(interval); // runs on re-run or unmount
	});
</script>
```

**Legitimate uses:** logging/analytics; updating external state (localStorage, document.title); setting up/tearing down subscriptions; third-party library integration (when @attach isn't suitable).

**Key points:** eager execution (runs whenever deps change until destroyed); lifecycle-bound (only in effect roots / components); runs after DOM (use `$effect.pre` for pre-DOM); no SSR; return cleanup function; don't update state the effect depends on (infinite loop!).

**Why `$derived` is preferred for computed values:** `$derived` is lazy + garbage-collectable with no lifecycle management; `$effect` is eager and keeps running until destroyed.

### `$effect.pre`

Runs BEFORE DOM updates. Useful for measuring DOM before changes.

```svelte
<script>
	let element = $state(null);
	$effect.pre(() => { /* Runs BEFORE DOM updates */ });
</script>
```

## `$effect` vs `$derived`

- **`$derived`** — transforming data; computing from other state; value used in template; read-only computed property.
- **`$effect`** — logging/analytics; updating external state (localStorage, DOM); fetching data; subscriptions (intervals, listeners); any operation with side effects.

## `$props`

Treat props as though they will change. Values that depend on props should usually use `$derived`:

```js
let { type } = $props();
let color = $derived(type === 'danger' ? 'red' : 'green'); // do this
let color = type === 'danger' ? 'red' : 'green'; // don't — won't update if `type` changes
```

```svelte
<script>
	let { name, age = 18, ...rest } = $props(); // Destructure with defaults + rest
	// OR
	let props = $props(); // props.name, props.age
</script>
```

- Replaces `export let`. Props are reactive automatically.

### TypeScript

```svelte
<script lang="ts">
	interface Props {
		name: string;
		age?: number; // Optional with default
	}
	let { name, age = 18 }: Props = $props();
</script>
```

### Generic components

```svelte
<script lang="ts" generics="T">
	interface Props<T> {
		items: T[];
		selected?: T;
		onSelect?: (item: T) => void;
	}
	let { items, selected, onSelect }: Props<T> = $props();
</script>
```

### Props are reactive — don't over-derive

```svelte
<!-- UNNECESSARY -->
<script>
	let { count } = $props();
	let doubled = $derived(count * 2); // Overkill if used once
</script>
<p>{doubled}</p>

<!-- SIMPLER -->
<script>
	let { count } = $props();
</script>
<p>{count * 2}</p>
```

Use `$derived` when the value is used multiple times, computation is expensive, or you derive from multiple props.

## `$bindable`

Makes a prop two-way bindable so the parent can use `bind:propName`.

```svelte
<!-- Child.svelte -->
<script>
	let { value = $bindable() } = $props();
</script>
<input bind:value />

<!-- Parent.svelte -->
<script>
	let text = $state('');
</script>
<Child bind:value={text} />
<p>You typed: {text}</p>
```

- Provide a default: `$bindable('default')`.
- Multiple bindable props OK: `let { min = $bindable(0), max = $bindable(100) } = $props();`

### Props vs Bindable decision tree

```text
Parent needs to read child state?
├─ No  → Just pass callbacks (controlled component)
└─ Yes → Parent needs to UPDATE child state?
    ├─ No  → Callback to notify parent (onChange pattern)
    └─ Yes → Use $bindable (two-way binding)
```

**Controlled component (no $bindable)** — parent fully controls state:

```svelte
<!-- Counter.svelte -->
<script>
	let { count, onIncrement } = $props();
</script>
<button onclick={onIncrement}>Count: {count}</button>
<!-- Usage: <Counter {count} onIncrement={() => count++} /> -->
```

**Hybrid: bindable with callback:**

```svelte
<script>
	let { value = $bindable(50), onChange } = $props();
	function handleChange() { onChange?.(value); }
</script>
<input type="range" bind:value oninput={handleChange} />
```

**Rule of thumb:** Only use `$bindable` when the parent _needs_ to update the prop value.

## Reactive class fields

```svelte
<script>
	class Counter {
		count = $state(0);
		doubled = $derived(this.count * 2);
		increment() { this.count++; }
	}
	const counter = new Counter();
</script>
<button onclick={() => counter.increment()}>
	{counter.count} (doubled: {counter.doubled})
</button>
```

Use classes with `$state` fields to share reactivity between components, instead of stores.

## `createSubscriber` — external observables

_Available since 5.7.0._ From `svelte/reactivity`. Integrates external event-based systems (MediaQuery, IntersectionObserver, WebSocket) with Svelte reactivity **without `$effect`**.

If `subscribe` is called inside an effect (incl. via a getter), the `start` callback is called with an `update` function; calling `update` re-runs the effect. If `start` returns a cleanup function, it's called when the effect is destroyed. With multiple effects, `start` runs once and teardown runs when all are destroyed.

```js
import { createSubscriber } from 'svelte/reactivity';
import { on } from 'svelte/events';

export class MediaQuery {
	#query;
	#subscribe;
	constructor(query) {
		this.#query = window.matchMedia(`(${query})`);
		this.#subscribe = createSubscriber((update) => {
			const off = on(this.#query, 'change', update);
			return () => off();
		});
	}
	get current() {
		this.#subscribe(); // makes the getter reactive if read in an effect
		return this.#query.matches;
	}
}
```

```dts
function createSubscriber(
	start: (update: () => void) => (() => void) | void
): () => void;
```

Another example (browser location):

```ts
function createLocationStore() {
	let location = window.location.href;
	const subscribe = createSubscriber((update) => {
		const handler = () => { location = window.location.href; update(); };
		window.addEventListener('popstate', handler);
		return () => window.removeEventListener('popstate', handler);
	});
	return { get href() { subscribe(); return location; } };
}
```

**When:** wrapping browser APIs, third-party event emitters, or any external source that doesn't integrate with Svelte's reactivity natively.

## `$inspect`

> `$inspect` only works during development. In a production build it becomes a noop.

Roughly equivalent to `console.log`, but re-runs whenever its argument changes. Tracks reactive state **deeply**.

```svelte
<script>
	let count = $state(0);
	let message = $state('hello');
	$inspect(count, message); // logs when `count` or `message` change
</script>
```

On updates a stack trace is printed (except in the playground).

### `$inspect(...).with`

Returns a `with` property; invoke with a callback used instead of `console.log`. First arg is `"init"` or `"update"`; rest are the inspected values.

```svelte
<script>
	let count = $state(0);
	$inspect(count).with((type, count) => {
		if (type === 'update') {
			debugger; // or console.trace, etc.
		}
	});
</script>
```

### `$inspect.trace`

_Added in 5.14._ Debugging tool for reactivity. If something isn't updating properly or runs more than it should, add `$inspect.trace(label)` as the **first statement** of an `$effect` or `$derived.by` (or any function they call) to trace dependencies and discover which one triggered an update.

```svelte
<script>
	let count = $state(0);
	let name = $state('world');

	$effect(() => {
		$inspect.trace('greeting effect'); // must be first statement
		console.log(`Hello ${name}, count is ${count}`);
	});

	const message = $derived.by(() => {
		$inspect.trace('message derived');
		return `${name}: ${count}`;
	});
</script>
```

`$inspect.trace` takes an optional first argument used as the label. **When:** something not updating when it should; an effect/derived running more than expected; identifying which dependency triggered a re-run. Remove before production.

## Async Svelte

If using Svelte 5.36+, you can use `await` directly in three places previously unavailable: at the top level of `<script>`, inside `$derived(...)`, and inside markup. **Experimental** — opt in via `experimental.async` in `svelte.config.js`; the flag will be removed in Svelte 6.

```js
// svelte.config.js
export default {
	compilerOptions: { experimental: { async: true } },
};
```

### Synchronized updates

When an `await` expression depends on state, changes are **not** reflected in the UI until the async work completes (UI never left inconsistent):

```svelte
<script>
	let a = $state(1);
	let b = $state(2);
	async function add(a, b) {
		await new Promise((f) => setTimeout(f, 500));
		return a + b;
	}
</script>
<input type="number" bind:value={a} />
<input type="number" bind:value={b} />
<p>{a} + {b} = {await add(a, b)}</p>
```

Incrementing `a` does **not** immediately show `2 + 2 = 3`; the text updates to `2 + 2 = 4` when `add` resolves. Updates can overlap — a fast update shows while an earlier slow one is ongoing.

### Concurrency

Independent `await` expressions in markup run in parallel:

```svelte
<p>{await one()}</p><p>{await two()}</p>
```

Sequential `await`s inside `<script>` / async functions run like normal async JS. Independent `$derived` expressions update independently (but run sequentially the first time):

```js
let a = $derived(await one());
let b = $derived(await two());
```

> Code like this triggers an `await_waterfall` warning.

### Loading states

Wrap content in `<svelte:boundary>` with a `pending` snippet (shown on first creation, not subsequent updates). After first resolution, detect subsequent async work with `$effect.pending()` (e.g. async-validation spinner). Use `settled()` for a promise that resolves when the current update completes:

```js
import { tick, settled } from 'svelte';
async function onclick() {
	updating = true;
	await tick(); // else change to `updating` is grouped with others, not reflected
	color = 'octarine';
	answer = 42;
	await settled();
	updating = false;
}
```

### Error handling / SSR / Forking

- Errors in `await` expressions bubble to the nearest `<svelte:boundary>` error boundary.
- SSR: `await render(App)` (`svelte/server`). SvelteKit does this for you. A `<svelte:boundary>` `pending` snippet renders during SSR while the rest is ignored; all `await`s outside such boundaries resolve before `render` returns.
- `fork(...)` (added 5.42) runs `await` expressions you _expect_ to happen soon (preloading). Mainly for frameworks.

```svelte
<script>
	import { fork } from 'svelte';
	let open = $state(false);
	/** @type {import('svelte').Fork | null} */
	let pending = null;
	function preload() { pending ??= fork(() => { open = true; }); }
	function discard() { pending?.discard(); pending = null; }
</script>
<button
	onpointerenter={preload}
	onpointerleave={discard}
	onclick={() => { pending?.commit(); pending = null; open = true; }}>open menu</button>
```

**Caveat:** as experimental, details (and `$effect.pending()`) may change outside a semver major. With `experimental.async` true, block effects (`{#if}`, `{#each}`) now run before an `$effect.pre`/`beforeUpdate` in the same component.

## `hydratable`

Solves the pitfall where awaited server data is re-fetched during client hydration (blocking it). Low-level API (usually used behind the scenes by data-fetching libraries; powers SvelteKit remote functions).

```svelte
<script>
	import { hydratable } from 'svelte';
	import { getUser } from 'my-database-library';
	// SSR: serializes & stashes result under the key, baked into `head` content.
	// Hydration: returns the serialized version instead of running getUser.
	// Post-hydration: subsequent calls just invoke getUser.
	const user = await hydratable('user', () => getUser());
</script>
<h1>{user.name}</h1>
```

Also for stable random/time values across SSR + hydration:

```ts
const rand = hydratable('random', () => Math.random());
```

Library authors: prefix keys with the library name to avoid conflicts.

**Serialization:** all returned data must be serializable. Uses [`devalue`](https://npmjs.com/package/devalue) — supports `Map`, `Set`, `URL`, `BigInt`, and (via Svelte magic) promises:

```svelte
<script>
	import { hydratable } from 'svelte';
	const promises = hydratable('random', () => ({
		one: Promise.resolve(1),
		two: Promise.resolve(2),
	}));
</script>
{await promises.one}
{await promises.two}
```

**CSP:** `hydratable` adds an inline `<script>` to the `head`. Provide a `nonce` to `render`:

```js
const nonce = crypto.randomUUID();
const { head, body } = await render(App, { csp: { nonce } });
response.headers.set('Content-Security-Policy', `script-src 'nonce-${nonce}'`);
```

A `nonce` must only be used when dynamically server-rendering one response. For static HTML use hashes:

```js
const { head, body, hashes } = await render(App, { csp: { hash: true } });
response.headers.set(
	'Content-Security-Policy',
	`script-src ${hashes.script.map((h) => `'${h}'`).join(' ')}`,
);
```

Prefer `nonce` over `hash` — `hash` will interfere with future streaming SSR.

## Svelte 4 → 5 Migration

### Quick translation table

| Svelte 4                      | Svelte 5                                       | Notes                  |
| ----------------------------- | ---------------------------------------------- | ---------------------- |
| `let count = 0`               | `let count = $state(0)`                        | Make reactive          |
| `$: doubled = count * 2`      | `let doubled = $derived(count * 2)`            | Computed value         |
| `$: { console.log(count); }`  | `$effect(() => { console.log(count); })`       | Side effect            |
| `$: if (count > 10) { ... }`  | `$effect(() => { if (count > 10) { ... } })`   | Conditional effect     |
| `export let name`             | `let { name } = $props()`                      | Props                  |
| `export let value` (bindable) | `let { value = $bindable() } = $props()`       | Two-way binding        |
| `on:click={handler}`          | `onclick={handler}`                            | Event handler          |
| `on:click\|preventDefault`    | `onclick={(e) => { e.preventDefault(); ... }}` | Event modifier         |
| `<slot />`                    | `{@render children()}`                         | Default slot           |
| `<slot name="header" />`      | `{@render header()}`                           | Named slot             |
| N/A                           | `{#snippet name()}...{/snippet}`               | Define reusable markup |

### TypeScript props

```svelte
<!-- Svelte 4 -->
<script lang="ts">
	export let count: number;
</script>

<!-- Svelte 5 -->
<script lang="ts">
	interface Props { count: number; }
	let { count }: Props = $props();
</script>
```

### Lifecycle

`onMount` still works (return value = cleanup). For most `onDestroy` cleanup, use `$effect` with a cleanup function:

```svelte
<script>
	import { onMount } from 'svelte';
	onMount(() => { console.log('mounted'); return () => console.log('cleanup'); });
	$effect(() => {
		const interval = setInterval(() => {...}, 1000);
		return () => clearInterval(interval);
	});
</script>
```

### Stores still work

```svelte
<script>
	import { writable } from 'svelte/store';
	const count = writable(0);
</script>
<button onclick={() => $count++}>{$count}</button>
```

**Runes:** component-local state. **Stores:** global/shared state. (Prefer classes with `$state` for shared reactivity.)

### Avoid legacy features

- `$state` instead of implicit reactivity (`let count = 0; count += 1`)
- `$derived`/`$effect` instead of `$:` (use effects only when no better solution)
- `$props` instead of `export let`, `$$props`, `$$restProps`
- `onclick={...}` instead of `on:click={...}`
- `{#snippet}`/`{@render}` instead of `<slot>`, `$$slots`, `<svelte:fragment>`
- `<DynamicComponent>` instead of `<svelte:component this={...}>`
- `import Self from './ThisComponent.svelte'` + `<Self>` instead of `<svelte:self>`
- classes with `$state` fields instead of stores
- `{@attach ...}` instead of `use:action`
- clsx-style arrays/objects in `class` instead of the `class:` directive

### Migration strategy

1. Don't mix syntaxes — migrate one component at a time fully.
2. Start with leaf components (bottom up).
3. Test incrementally.
4. Use TypeScript to catch binding/prop errors.
5. Read the [migration guide](https://svelte.dev/docs/svelte/v5-migration-guide).

**Feature detection** (if supporting both): `import { VERSION } from 'svelte/compiler'; const isSvelte5 = VERSION.startsWith('5');` — but full migration is generally better.

## Common Mistakes / Anti-Patterns

### ❌ Using `$effect` for derived state

```svelte
<!-- WRONG -->
<script>
	let count = $state(0);
	let doubled = $state(0);
	$effect(() => { doubled = count * 2; });
</script>
<!-- RIGHT -->
<script>
	let count = $state(0);
	let doubled = $derived(count * 2);
</script>
```

### ❌ Using `$effect` when an event handler works

Per Svelte docs: "If you can put your side effects in an event handler, that's almost always preferable." Event handlers are predictable and run once per action.

```svelte
<!-- RIGHT -->
<script>
	let count = $state(0);
	function increment() {
		count++;
		console.log(`Count is now ${count}`); // side effect in handler
	}
</script>
<button onclick={increment}>Increment</button>
```

### ❌ Using `$effect` to sync linked values

Avoid effects for "connecting one value to another". Use `oninput` callbacks / function bindings:

```svelte
<script>
	let celsius = $state(0);
	let fahrenheit = $state(32);
	function updateFromCelsius(e) {
		celsius = +e.target.value;
		fahrenheit = (celsius * 9) / 5 + 32;
	}
	function updateFromFahrenheit(e) {
		fahrenheit = +e.target.value;
		celsius = ((fahrenheit - 32) * 5) / 9;
	}
</script>
<input type="number" value={celsius} oninput={updateFromCelsius} />
<input type="number" value={fahrenheit} oninput={updateFromFahrenheit} />
```

### ❌ Using `$effect` to sync async data into form state

```svelte
<!-- WRONG — $effect as escape hatch to sync query → form state -->
<script>
	let query = $derived(get_item({ id }))
	let name = $state('')
	$effect(() => { if (query.ready) name = query.current.name })
</script>
<input bind:value={name} />
```

**RIGHT — gate child behind `.ready`; child inits `$state` from prop once at mount:**

```svelte
<!-- Parent.svelte -->
<script>
	let query = $derived(get_item({ id }))
</script>
{#if !query.ready}
	<Skeleton />
{:else}
	<EditForm item={query.current} />
{/if}
```

```svelte
<!-- EditForm.svelte -->
<script>
	let { item } = $props()
	// svelte-ignore state_referenced_locally
	let form = $state({ name: item.name }) // init from prop at mount
</script>
<input bind:value={form.name} />
```

No `$effect` needed, no `state_unsafe_mutation` warning. Standard pattern for editable forms backed by async data.

### ❌ Optional chaining breaks effect reactivity

```svelte
<!-- WRONG — if particles is undefined, `scheme` is NEVER read, so no dependency -->
<script>
	$effect(() => { particles?.updateScheme(scheme); });
</script>
<!-- RIGHT — read scheme first to create dependency -->
<script>
	$effect(() => {
		const currentScheme = scheme;
		if (particles) particles.updateScheme(currentScheme);
	});
</script>
```

JS short-circuits optional chaining; if `particles` is nullish, `scheme` is never evaluated.

### ❌ Infinite loops in `$effect`

```svelte
<!-- WRONG -->
<script>
	let count = $state(0);
	$effect(() => { count++; }); // effect updates count → triggers effect…
</script>
```

Fixes: update _different_ state (`log.push(count)`), or read without subscribing via `untrack`:

```svelte
<script>
	import { untrack } from 'svelte';
	let count = $state(0);
	$effect(() => {
		const current = untrack(() => count); // read without creating dependency
	});
</script>
```

### ❌ Using `$effect` to sync state with DOM elements

```svelte
<!-- WRONG - Dialog sync via effect -->
<script>
	let is_open = $state(false);
	let dialog_element = $state<HTMLDialogElement>();
	$effect(() => {
		if (is_open) dialog_element?.showModal();
		else dialog_element?.close(); // fires 'close' event → handler → loop!
	});
</script>
<dialog bind:this={dialog_element} onclose={() => is_open = false}>
```

`dialog.close()` fires the native `close` event → your handler → loops/double-firing. **RIGHT** — state class with `@attach` register + call DOM methods directly:

```ts
// state.svelte.ts
class DialogState {
	dialog: HTMLDialogElement | null = null;
	is_open = $state(false);
	register = (el: HTMLDialogElement) => { this.dialog = el; return () => { this.dialog = null; }; };
	open() { if (!this.dialog?.open) { this.is_open = true; this.dialog?.showModal(); } }
	close() { this.is_open = false; this.dialog?.close(); }
}
```

```svelte
<dialog {@attach dialog_state.register} onclose={dialog_state.close}>
```

### ❌ Using runes inside functions

```svelte
<!-- WRONG -->
<script>
	function createCounter() {
		let count = $state(0); // ERROR - runes must be top-level
		return count;
	}
</script>
```

Fix: top-level runes, or reactive class fields (`class Counter { count = $state(0); }`). Runes must be statically analyzable at compile time.

### ❌ Mixing Svelte 4 and 5 syntax

```svelte
<!-- WRONG -->
<script>
	let count = $state(0);
	$: doubled = count * 2; // Mixing runes with reactive statements!
</script>
```

### ❌ Forgetting `$state`

```svelte
<script>
	let count = 0; // Not reactive in Svelte 5! UI won't update
</script>
<button onclick={() => count++}>{count}</button>
```

### ❌ Trying to bind without `$bindable`

```svelte
<!-- Child.svelte WRONG -->
<script>
	let { value } = $props(); // not bindable
</script>
<!-- Parent: <Child bind:value={text} /> → errors -->
<!-- RIGHT -->
<script>
	let { value = $bindable() } = $props();
</script>
```

### ❌ Mutating non-bindable props

```svelte
<!-- WRONG -->
<script>
	let { count } = $props(); // not bindable
	function increment() { count++; } // BAD - mutating parent's prop
</script>
<!-- RIGHT: use a callback (onIncrement) OR make it $bindable -->
```

### ❌ Not providing default for bindable / unnecessary bindable

```svelte
let { value = $bindable() } = $props();      // RISKY - undefined if parent omits
let { value = $bindable('default') } = $props(); // SAFER
let { label = 'Submit' } = $props();          // RIGHT - label needn't be bindable
```

### ❌ Forgetting `{@render}` for children

```svelte
<div>{children}</div>      <!-- WRONG - shows [object Object] -->
<div>{@render children()}</div> <!-- RIGHT -->
```

Children is a snippet, not a value.

### Performance / TS mistakes

- Don't wrap non-changing values in `$state` — use a plain `const` (`const API_URL = '...'`).
- Don't `$derived` a value used only once — inline it (`{count * 2}`).
- Always type props with an interface; bindable props must be **optional** in the type (`value?: string` with `$bindable('')`).

### Error messages

- **"Cannot access 'count' before initialization"** — rune used out of order / inside a function. Declare `$state` before `$derived` that uses it.
- **"Cannot read properties of undefined (reading '$effect')"** — rune used outside component scope (e.g. `<script context="module">`). Move to instance `<script>`.
- **"bind:value is not available on this component"** — forgot `$bindable()`.

## Notes

- Use `onclick` not `on:click`; `{@render children()}` in layouts.
- `$derived` can be reassigned (5.25+) — use `const` for read-only.
- Use `createContext` over `setContext`/`getContext` for type safety.
- Use `$inspect.trace` to debug reactivity issues.
- `$effect` doesn't run during SSR.
