# Svelte 5 Component Patterns

Reference for component libraries (Bits UI, Ark UI, Melt UI), web components, form patterns, styling child components, JS variables in CSS, and context. **Last verified:** 2025-01-14

## Component Libraries

**Bits UI** (headless) | **Ark UI** | **Melt UI** (primitives). All three work with Svelte 5 runes.

| Library | Style    | Approach   | Best For            |
| ------- | -------- | ---------- | ------------------- |
| Bits UI | Unstyled | Components | Quick accessible UI |
| Ark UI  | Unstyled | Components | Feature-rich apps   |
| Melt UI | Unstyled | Builders   | Maximum control     |

### Bits UI

Headless, unstyled, accessible (ARIA, keyboard nav) components. Composable compound components; bring your own CSS. [bits-ui.com](https://bits-ui.com)

```bash
pnpm add bits-ui
```

```svelte
<script>
	import { Button } from 'bits-ui';
</script>
<Button.Root class="my-button">Click me</Button.Root>
```

### Ark UI

Full-featured component library. [ark-ui.com](https://ark-ui.com)

```bash
pnpm add @ark-ui/svelte
```

```svelte
<script>
	import { Dialog } from '@ark-ui/svelte';
</script>
<Dialog.Root>
	<Dialog.Trigger>Open</Dialog.Trigger>
	<Dialog.Backdrop />
	<Dialog.Positioner>
		<Dialog.Content>
			<Dialog.Title>Title</Dialog.Title>
			<Dialog.Description>Description</Dialog.Description>
			<Dialog.CloseTrigger>Close</Dialog.CloseTrigger>
		</Dialog.Content>
	</Dialog.Positioner>
</Dialog.Root>
```

### Melt UI

Low-level primitives (**builders** — functions, not components) for maximum flexibility. [melt-ui.com](https://melt-ui.com)

```bash
pnpm add @melt-ui/svelte
```

```svelte
<script>
	import { createDialog } from '@melt-ui/svelte';
	const {
		elements: { trigger, portalled, overlay, content, title, close },
		states: { open },
	} = createDialog();
</script>
<button use:melt={$trigger}>Open</button>
{#if $open}
	<div use:melt={$portalled}>
		<div use:melt={$overlay} />
		<div use:melt={$content}>
			<h2 use:melt={$title}>Title</h2>
			<button use:melt={$close}>Close</button>
		</div>
	</div>
{/if}
```

## Web Components (customElement)

```javascript
// svelte.config.js — enable for entire project
export default {
	compilerOptions: { customElement: true },
};
```

Or per-component with `<svelte:options>`:

```svelte
<svelte:options customElement="my-element" />
<script>
	let { name = 'World' } = $props();
</script>
<p>Hello {name}!</p>
```

### Gotchas

**1. Self-closing tags** — Svelte 5 requires closing tags for custom elements:

```svelte
<my-element />          <!-- WRONG -->
<my-element></my-element> <!-- RIGHT -->
```

**2. Nested HTML in `<option>`** — causes compiler errors; use snippets:

```svelte
<!-- WRONG - compiler error -->
<select><option><div>Rich content</div></option></select>
<!-- WORKAROUND -->
{#snippet optionContent()}<div>Rich content</div>{/snippet}
<select><option>{@render optionContent()}</option></select>
```

**3. Shadow DOM styling** — styles are scoped to the shadow DOM by default:

```svelte
<svelte:options customElement="styled-button" />
<button><slot /></button>
<style>
	button { background: blue; } /* Only affects this component's shadow DOM */
</style>
```

### Exposing props as attributes

```svelte
<svelte:options
	customElement={{
		tag: 'my-counter',
		props: { count: { reflect: true, type: 'Number' } },
	}}
/>
<script>
	let { count = 0 } = $props();
</script>
<button onclick={() => count++}>{count}</button>
```

### Events

```svelte
<svelte:options customElement="event-button" />
<script>
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();
</script>
<button onclick={() => dispatch('clicked', { time: Date.now() })}>Click me</button>
```

```html
<event-button></event-button>
<script>
	document.querySelector('event-button')
		.addEventListener('clicked', (e) => console.log(e.detail));
</script>
```

### Library distribution

```json
// package.json — always include svelte in keywords + peerDependencies
{
	"svelte": "./dist/index.js",
	"exports": { ".": { "svelte": "./dist/index.js" } },
	"keywords": ["svelte"],
	"peerDependencies": { "svelte": "^5.0.0" }
}
```

## Form Patterns

### Form attribute trick

When you can't nest a form (e.g. inside tables), use the `form` attribute to associate inputs with a form anywhere in the document. Submit-with-Enter, FormData collection, and accessibility all work.

```svelte
<form id="add-item" action="?/add" method="POST"></form>
<table>
	<tbody>
		{#each items as item}
			<tr><td>{item.name}</td><td>{item.price}</td></tr>
		{/each}
		<tr>
			<td><input form="add-item" name="name" required /></td>
			<td><input form="add-item" name="price" type="number" required /></td>
			<td><button form="add-item">Add</button></td>
		</tr>
	</tbody>
</table>
```

### Default values and reset

Forms support `defaultValue` for easy resets:

```svelte
<script>
	let name = $state('');
</script>
<form onreset={() => (name = '')}>
	<input bind:value={name} defaultValue="" />
	<button type="submit">Save</button>
	<button type="reset">Reset</button>
</form>
```

### Progressive enhancement

```svelte
<script>
	import { enhance } from '$app/forms';
	let submitting = $state(false);
</script>
<form
	method="POST"
	use:enhance={() => {
		submitting = true;
		return async ({ update }) => { await update(); submitting = false; };
	}}
>
	<input name="email" type="email" required />
	<button disabled={submitting}>{submitting ? 'Saving...' : 'Save'}</button>
</form>
```

### Form validation with Valibot

```typescript
// +page.server.ts
import * as v from 'valibot';
import { fail } from '@sveltejs/kit';

const ContactSchema = v.object({
	email: v.pipe(v.string(), v.email()),
	message: v.pipe(v.string(), v.minLength(10)),
});

export const actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const data = Object.fromEntries(formData);
		const result = v.safeParse(ContactSchema, data);
		if (!result.success) {
			return fail(400, { data, errors: v.flatten(result.issues) });
		}
		await saveContact(result.output);
	},
};
```

```svelte
<!-- +page.svelte -->
<script>
	let { form } = $props();
</script>
<form method="POST">
	<label>
		Email
		<input name="email" type="email" value={form?.data?.email ?? ''} />
		{#if form?.errors?.nested?.email}
			<span class="error">{form.errors.nested.email[0]}</span>
		{/if}
	</label>
	<label>
		Message
		<textarea name="message">{form?.data?.message ?? ''}</textarea>
		{#if form?.errors?.nested?.message}
			<span class="error">{form.errors.nested.message[0]}</span>
		{/if}
	</label>
	<button>Send</button>
</form>
```

### Multiple forms on one page

Use named actions (`?/subscribe`, `?/contact`) mapping to keys in `export const actions`:

```svelte
<form action="?/subscribe" method="POST"><input name="email" type="email" /><button>Subscribe</button></form>
<form action="?/contact" method="POST"><input name="message" /><button>Send</button></form>
```

```typescript
// +page.server.ts
export const actions = {
	subscribe: async ({ request }) => { /* … */ },
	contact: async ({ request }) => { /* … */ },
};
```

## Using JavaScript Variables in CSS

To use a JS variable inside CSS, set a CSS custom property with the `style:` directive, then reference `var(--…)` in `<style>`.

```svelte
<div style:--columns={columns}>...</div>
<style>
	/* var(--columns) available here */
</style>
```

## Styling Child Components

Component `<style>` is scoped to that component. For a parent to control a child's styles, the **preferred** way is CSS custom properties:

```svelte
<!-- Parent.svelte -->
<Child --color="red" />

<!-- Child.svelte -->
<h1>Hello</h1>
<style>
	h1 { color: var(--color); }
</style>
```

If impossible (e.g. the child comes from a library), use `:global` to override:

```svelte
<div>
	<Child />
</div>
<style>
	div :global {
		h1 { color: red; }
	}
</style>
```

## Context

Consider using context instead of declaring state in a shared module. This scopes the state to the part of the app that needs it, and eliminates the possibility of it leaking between users when server-side rendering.

Use `createContext` rather than `setContext`/`getContext`, as it provides type safety.

```ts
// context.ts
import { createContext } from 'svelte';
const [get_theme, set_theme] = createContext<{ current: string }>('theme');
export { get_theme, set_theme };
```

```svelte
<!-- Provider.svelte -->
<script>
	import { set_theme } from './context';
	let theme = $state('dark');
	set_theme({
		get current() { return theme; },
		set current(value) { theme = value; },
	});
</script>
{@render children()}
```

```svelte
<!-- Consumer.svelte -->
<script>
	import { get_theme } from './context';
	const theme = get_theme();
</script>
<p>Theme: {theme.current}</p>
<button onclick={() => theme.current = 'light'}>Light mode</button>
```

### Why `createContext` over `set`/`getContext`

| Feature        | `setContext`/`getContext` | `createContext`     |
| -------------- | ------------------------- | ------------------- |
| Type safety    | Manual casting            | **Automatic**       |
| Key management | String keys (typo-prone)  | **Module-scoped**   |
| Default values | Manual check              | **Built-in support**|

### Context vs shared module state

Context scopes state to the component tree, preventing leaks between users during SSR. Use it for deeply nested components instead of prop drilling.

```ts
// BAD - shared module state leaks between SSR requests
export let theme = $state('dark');
// GOOD - context is scoped per component tree
const [get_theme, set_theme] = createContext<string>('theme');
```
