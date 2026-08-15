<script lang="ts">
  let {
    scenarioNames,
    value = $bindable(''),
  }: {
    scenarioNames: string[]
    value?: string
  } = $props()

  const listId = `scenario-combobox-${Math.random().toString(36).slice(2)}`
</script>

<div class="relative w-full max-w-xs">
  <input
    type="text"
    list={listId}
    bind:value
    placeholder="Search scenarios…"
    class="w-full rounded-lg border border-ink-700 bg-ink-900 px-3 py-1.5 text-sm text-ink-100 placeholder:text-ink-500 focus:border-accent-500 focus:outline-none"
  />
  <datalist id={listId}>
    {#each scenarioNames as name (name)}
      <option value={name}></option>
    {/each}
  </datalist>
  {#if value}
    <button
      type="button"
      onclick={() => (value = '')}
      aria-label="Clear search"
      class="absolute top-1/2 right-2 -translate-y-1/2 text-ink-500 hover:text-ink-200"
    >
      &times;
    </button>
  {/if}
</div>
