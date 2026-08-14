# Svelte 5 Template Directives

Reference for `{@attach}`, `{@html}`, `{@render}`, `{@const}`, `{@debug}`, snippets, keyed each blocks, `bind:`, and `<svelte:window>`/`<svelte:document>`. **Last verified:** 2026-03-12

## Quick Reference

| Directive          | Purpose                        | Reactive? |
| ------------------ | ------------------------------ | --------- |
| `{@attach}`        | DOM manipulation, 3rd-party    | Yes       |
| `{@html}`          | Render raw HTML strings        | Yes       |
| `{@render}`        | Render snippets                | Yes       |
| `{@const}`         | Local constants in blocks      | N/A       |
| `{@debug}`         | Pause debugger on value change | N/A       |
| `{#each (key)}`    | Keyed iteration (always key!)  | Yes       |
| `<svelte:window>`  | Window event listeners         | N/A       |

## `{@attach}` (Svelte 5.29+)

**The reactive alternative to `use:` actions.** Attachments are functions that run in an effect when an element is mounted to the DOM or when state read inside the function updates. Optionally they return a function called before the attachment re-runs, or after the element is removed from the DOM. An element can have any number of attachments.

```svelte
<script>
	/** @type {import('svelte/attachments').Attachment} */
	function myAttachment(element) {
		console.log(element.nodeName); // 'DIV'
		return () => { console.log('cleaning up'); };
	}
</script>
<div {@attach myAttachment}>...</div>
```

### `@attach` vs `use:` actions

| Feature               | `use:`  | `@attach`           |
| --------------------- | ------- | ------------------- |
| Re-runs on arg change | No      | **Yes**             |
| Composable            | Limited | **Fully**           |
| Pass through props    | Manual  | **Auto via spread** |
| Convert legacy        | N/A     | `fromAction()`      |

Attachments are **fully reactive** — `{@attach foo(bar)}` re-runs on changes to `foo` _or_ `bar` (or any state read inside `foo`). Actions only run once on mount.

```svelte
<!-- use: - runs ONCE, ignores content changes -->
<button use:tooltip={content}>Won't update</button>
<!-- @attach - re-runs when content changes -->
<button {@attach tooltip(content)}>Updates!</button>
```

**Still use `use:` actions when:** legacy code/libraries not yet updated; you specifically DON'T want re-runs on argument change; simple one-time DOM setup with no reactive dependencies.

### Attachment factories

A function that _returns_ an attachment, enabling parameterized behavior. Since `tooltip(content)` runs inside an effect, the attachment is destroyed and recreated whenever `content` changes.

```svelte
<script>
	import tippy from 'tippy.js';
	let content = $state('Hello!');
	/** @returns {import('svelte/attachments').Attachment} */
	function tooltip(content) {
		return (element) => {
			const tooltip = tippy(element, { content });
			return tooltip.destroy;
		};
	}
</script>
<input bind:value={content} />
<button {@attach tooltip(content)}>Hover me</button>
```

### Inline attachments

```svelte
<canvas
	width={32} height={32}
	{@attach (canvas) => {
		const context = canvas.getContext('2d');
		$effect(() => {
			context.fillStyle = color;
			context.fillRect(0, 0, canvas.width, canvas.height);
		});
	}}
></canvas>
```

> The nested effect runs whenever `color` changes; the outer effect (`getContext`) runs only once since it reads no reactive state. Good for canvas where you need reactive updates without recreating the context.

### Conditional attachments

Falsy values (`false`/`undefined`) are treated as no attachment:

```svelte
<div {@attach enabled && myAttachment}>...</div>
```

### Passing attachments through components

On a component, `{@attach ...}` creates a prop keyed by a `Symbol`. If the component spreads props onto an element, the element receives the attachments. Enables "augmented element" wrapper components.

```svelte
<!-- Button.svelte -->
<script>
	/** @type {import('svelte/elements').HTMLButtonAttributes} */
	let { children, ...props } = $props();
</script>
<button {...props}>
	{@render children?.()}
</button>

<!-- App.svelte -->
<Button {@attach tooltip('Click me for help')}>Help</Button>
```

### Controlling when attachments re-run

For expensive/unavoidable setup work, pass data via an accessor function and read it in a child effect, so only the cheap update re-runs:

```js
function foo(getBar) {
	return (node) => {
		veryExpensiveSetupWork(node);
		$effect(() => { update(node, getBar()); }); // cheap, re-runs on data change
	};
}
```

```svelte
<!-- Pass accessor function, not the data directly -->
<div {@attach expensiveChart(() => data)}>Chart</div>
```

### Converting legacy actions — `fromAction`

```svelte
<script>
	import { fromAction } from 'svelte/attachments';
	import { someAction } from 'some-legacy-library';
	const attached = fromAction(someAction);
</script>
<div {@attach attached(options)}>...</div>
```

To add attachments to an object spread onto a component/element programmatically, use `createAttachmentKey` from `svelte/attachments`.

### Multiple attachments

```svelte
<button
	{@attach tooltip('Help text')}
	{@attach trackClicks}
	{@attach highlight(isActive ? 'yellow' : 'transparent')}
>Multi-attached button</button>
```

### DOM-controlling libraries (ProseMirror, etc.)

Combine `@attach` with the imperative `mount`/`unmount` API for libraries that control their own DOM segment:

```svelte
<script>
	import { mount, unmount } from 'svelte';
	import MyComponent from './MyComponent.svelte';
	function proseMirrorNodeView(node) {
		return (dom) => {
			const component = mount(MyComponent, { target: dom, props: { data: node.attrs } });
			return () => unmount(component);
		};
	}
</script>
```

### Registering elements with global state

Use `@attach` to register DOM elements with state classes — avoids `$effect` sync loops and `bind:this` chains, and avoids event loops from `dialog.close()` firing `onclose`.

```ts
// modal-state.svelte.ts
class ModalState {
	dialog: HTMLDialogElement | null = null;
	input: HTMLInputElement | null = null;
	is_open = $state(false);
	register = (el: HTMLDialogElement) => { this.dialog = el; return () => { this.dialog = null; }; };
	register_input = (el: HTMLInputElement) => { this.input = el; return () => { this.input = null; }; };
	open() { if (!this.dialog?.open) { this.is_open = true; this.dialog?.showModal(); this.input?.focus(); } }
	close() { this.is_open = false; this.dialog?.close(); }
	toggle() { this.is_open ? this.close() : this.open(); }
}
export const modal_state = new ModalState();
```

```svelte
<!-- Modal.svelte -->
<dialog {@attach modal_state.register} onclose={modal_state.close}>
	<input {@attach modal_state.register_input} />
</dialog>
<!-- Anywhere else - no component ref needed -->
<button onclick={modal_state.toggle}>Open Modal</button>
```

## Snippets — `{#snippet}` / `{@render}`

Snippets are reusable chunks of markup instantiated with `{@render ...}` or passed to components as props. They must be declared within the template. Instead of duplicative code:

```svelte
{#snippet figure(image)}
	<figure>
		<img src={image.src} alt={image.caption} width={image.width} height={image.height} />
		<figcaption>{image.caption}</figcaption>
	</figure>
{/snippet}

{#each images as image}
	{#if image.href}
		<a href={image.href}>{@render figure(image)}</a>
	{:else}
		{@render figure(image)}
	{/if}
{/each}
```

Like functions, snippets can have any number of parameters, with default values and destructuring. **You cannot use rest parameters.**

### `{@render}`

```svelte
{#snippet sum(a, b)}<p>{a} + {b} = {a + b}</p>{/snippet}
{@render sum(1, 2)}
```

The expression can be an identifier or any JS expression: `{@render (cool ? coolSnippet : lameSnippet)()}`.

**Optional snippets** — optional chaining, or `{#if}`/`{:else}` for fallback:

```svelte
{@render children?.()}
{#if children}
	{@render children()}
{:else}
	<p>fallback content</p>
{/if}
```

### Snippet scope

Snippets can be declared anywhere and can reference values from `<script>` or `{#each}` blocks. They are 'visible' to everything in the same lexical scope (siblings and their children). They can reference themselves and each other (recursion):

```svelte
{#snippet blastoff()}<span>🚀</span>{/snippet}
{#snippet countdown(n)}
	{#if n > 0}
		<span>{n}...</span>
		{@render countdown(n - 1)}
	{:else}
		{@render blastoff()}
	{/if}
{/snippet}
{@render countdown(10)}
```

### Passing snippets to components

**Explicit props** — snippets are values like any other:

```svelte
{#snippet header()}<th>fruit</th><th>qty</th>{/snippet}
{#snippet row(d)}<td>{d.name}</td><td>{d.qty}</td>{/snippet}
<Table data={fruits} {header} {row} />
```

**Implicit props** — snippets declared directly inside a component become props on it:

```svelte
<Table data={fruits}>
	{#snippet header()}<th>fruit</th>{/snippet}
	{#snippet row(d)}<td>{d.name}</td>{/snippet}
</Table>
```

**Implicit `children` snippet** — any non-snippet content inside the component tags becomes the `children` snippet:

```svelte
<!-- App.svelte --> <Button>click me</Button>
<!-- Button.svelte -->
<script>
	let { children } = $props();
</script>
<button>{@render children()}</button>
```

> You cannot have a prop called `children` if you also have content inside the component — avoid props with that name.

### Snippets with parameters

```svelte
<!-- List.svelte -->
<script>
	let { items, children } = $props();
</script>
<ul>
	{#each items as item, i}
		<li>{@render children(item, i)}</li>
	{/each}
</ul>
<!-- Usage -->
<List items={users}>
	{#snippet children(item, index)}{index}: {item.name}{/snippet}
</List>
```

### Typing snippets

Snippets implement the `Snippet` interface from `'svelte'`. The type argument is a tuple (snippets can have multiple parameters).

```svelte
<script lang="ts">
	import type { Snippet } from 'svelte';
	interface Props {
		children: Snippet;
		header?: Snippet;
		item?: Snippet<[{ name: string; age: number }]>; // with params
	}
	let { children, header, item }: Props = $props();
</script>
```

Tighten with a generic so two props share a type:

```svelte
<script lang="ts" generics="T">
	import type { Snippet } from 'svelte';
	let { data, row }: { data: T[]; row: Snippet<[T]> } = $props();
</script>
```

### Exporting snippets

Top-level snippets can be exported from a `<script module>` for use in other components, provided they don't reference non-module `<script>` declarations (directly or indirectly). _Requires Svelte 5.5.0+._

```svelte
<script module>
	export { add };
</script>
{#snippet add(a, b)}{a} + {b} = {a + b}{/snippet}
```

Snippets can also be created with `createRawSnippet` (advanced use cases).

### Snippets vs slots

In Svelte 4, content was passed via slots; snippets are more powerful and flexible, and slots are **deprecated** in Svelte 5.

| Feature          | Svelte 4 (Slots)               | Svelte 5 (Snippets + Children)         |
| ---------------- | ------------------------------ | -------------------------------------- |
| Default content  | `<slot />`                     | `{@render children()}`                 |
| Named content    | `<slot name="header" />`       | `{@render header()}`                   |
| Provide content  | `<div slot="header">...</div>` | `{#snippet header()}...{/snippet}`     |
| Slot props       | `<slot item={data} />`         | `{@render item(data)}`                 |
| Fallback content | `<slot>Fallback</slot>`        | `{@render children?.() ?? 'Fallback'}` |

Why snippets are better: more explicit (props show what content exists); better TS support (typed parameters); composable (passed around like functions); cleaner (no `let:prop`); more powerful (reusable within components); consistent (everything is a prop).

**Slot prop / `$$slots` migration:**

```svelte
<!-- Before -->
{#each items as item}<slot {item} />{/each}
{#if $$slots.header}<slot name="header" />{:else}<h1>Default</h1>{/if}
<!-- After -->
{#each items as item}{@render children(item)}{/each}
{#if header}{@render header()}{:else}<h1>Default</h1>{/if}
```

### Snippet common mistakes

```svelte
{@render children}      <!-- ❌ Missing () -->
{@render children()}    <!-- ✅ -->
<slot />                <!-- ❌ Don't mix slot with snippet syntax -->
{@render header()}      <!-- ❌ Errors if header not provided; use {#if} or ?.() -->
```

Always declare `children` in `$props()` before rendering it.

## `{@html ...}`

Renders raw HTML strings. **Use with caution — never render untrusted content.** Always sanitize user-provided HTML (e.g. DOMPurify).

```svelte
<script>
	import DOMPurify from 'dompurify';
	let userContent = $state('');
	const sanitized = $derived(DOMPurify.sanitize(userContent));
</script>
{@html sanitized}
```

Common uses: markdown→HTML, CMS content, syntax-highlighted code blocks.

## `{@const ...}`

Declares local constants within template blocks (`{#each}`, `{#if}`). Avoids recalculating values, improves readability, scoped to the block.

```svelte
{#each items as item}
	{@const fullName = `${item.firstName} ${item.lastName}`}
	{@const isLongName = fullName.length > 20}
	<div class:truncate={isLongName}>{fullName}</div>
{/each}
```

## `{@debug ...}`

Pauses execution and opens devtools when the specified values change. Remove before production; use specific variables, not entire objects. `{@debug}` with no args pauses on every update.

```svelte
{@debug count, items}
```

## Each blocks — always keyed, never index

Prefer keyed each blocks for performance — Svelte can surgically insert/remove/reorder items rather than updating existing DOM in place.

```svelte
{#each items as item (item.id)}
	<li>{item.name} x {item.qty}</li>
{/each}
<!-- with index -->
{#each items as item, i (item.id)}
	<li>{i + 1}: {item.name} x {item.qty}</li>
{/each}
```

The key **must uniquely identify the object** — do NOT use the index. Strings/numbers are recommended (identity persists when objects change).

```svelte
{#each items as item, i (i)}    <!-- WRONG - index as key -->
{#each items as item (item.id)} <!-- RIGHT - unique identifier -->
```

**Without key:** removing item B from [A,B,C] updates node 2 to show C's data and removes the last node. **With key:** B's DOM node is actually removed, leaving A and C untouched.

You can use destructuring/rest patterns in each blocks, **but avoid destructuring if you need to mutate the item** — the destructured value is disconnected from the original.

```svelte
{#each items as { count } (item.id)}<input bind:value={count} />{/each}     <!-- WRONG -->
{#each items as item (item.id)}<input bind:value={item.count} />{/each}      <!-- RIGHT -->
```

## `bind:` — function bindings

Use `bind:property={get, set}`, where `get`/`set` are functions, to perform validation/transformation. _Available in Svelte 5.9.0+._

```svelte
<input bind:value={() => value, (v) => (value = v.toLowerCase())} />
```

For readonly bindings (e.g. dimensions), the `get` value should be `null`:

```svelte
<div bind:clientWidth={null, redraw} bind:clientHeight={null, redraw}>...</div>
```

## `<svelte:window>` / `<svelte:document>` — global events

Use these for window/document event listeners. Avoid `onMount` or `$effect` — they auto-clean-up listeners when the component is destroyed.

```svelte
<svelte:window onkeydown={handleKeydown} onscroll={handleScroll} />
<svelte:document onvisibilitychange={handleVisibility} />
```

Common patterns:

```svelte
<!-- Keyboard shortcuts -->
<svelte:window onkeydown={(e) => {
	if (e.key === 'Escape') closeModal();
	if (e.ctrlKey && e.key === 's') { e.preventDefault(); save(); }
}} />
<!-- Online/offline -->
<svelte:window ononline={() => status = 'online'} onoffline={() => status = 'offline'} />
<!-- Bindable window properties -->
<svelte:window bind:innerWidth bind:innerHeight bind:scrollX bind:scrollY bind:online />
```
