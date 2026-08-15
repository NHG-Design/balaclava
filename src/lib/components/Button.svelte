<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLButtonAttributes } from 'svelte/elements'

  let {
    children,
    class: className = '',
    ...rest
  }: HTMLButtonAttributes & { children: Snippet } = $props()
</script>

<button
  {...rest}
  class="rounded-full border border-ink-700 bg-ink-900 px-4 py-2 text-xs font-medium text-ink-300 transition-colors hover:text-ink-100 disabled:pointer-events-none disabled:opacity-40 {className}"
>
  {@render children()}
</button>
