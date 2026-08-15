<script lang="ts">
  let {
    scenarioNames,
    value = $bindable(''),
    placeholder = 'Search scenarios…',
  }: {
    scenarioNames: string[]
    value?: string
    placeholder?: string
  } = $props()

  let open = $state(false)
  let highlighted = $state(-1)
  let inputEl = $state<HTMLInputElement>()
  const listId = `scenario-combobox-list-${Math.random().toString(36).slice(2)}`

  let filtered = $derived(
    value.trim()
      ? scenarioNames.filter((n) => n.toLowerCase().includes(value.trim().toLowerCase()))
      : scenarioNames,
  )

  function openList() {
    open = true
  }

  function closeList() {
    open = false
    highlighted = -1
  }

  function choose(name: string) {
    value = name
    closeList()
    inputEl?.blur()
  }

  function onInput() {
    highlighted = -1
    openList()
  }

  function onBlur() {
    setTimeout(closeList, 120)
  }

  function onKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      closeList()
      inputEl?.blur()
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (!open) openList()
      highlighted = Math.min(highlighted + 1, filtered.length - 1)
      return
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      highlighted = Math.max(highlighted - 1, 0)
      return
    }
    if (e.key === 'Enter') {
      e.preventDefault()
      if (highlighted >= 0 && filtered[highlighted]) choose(filtered[highlighted])
    }
  }
</script>

<div class="relative w-full max-w-xs">
  <input
    bind:this={inputEl}
    bind:value
    type="text"
    role="combobox"
    aria-expanded={open}
    aria-controls={listId}
    aria-autocomplete="list"
    autocomplete="off"
    spellcheck="false"
    {placeholder}
    onfocus={openList}
    oninput={onInput}
    onblur={onBlur}
    onkeydown={onKeydown}
    class="w-full rounded-lg border border-ink-700 bg-ink-900 px-3 py-1.5 text-sm text-ink-100 placeholder:text-ink-500 focus:border-accent-500 focus:outline-none"
  />
  {#if value}
    <button
      type="button"
      onmousedown={(e) => e.preventDefault()}
      onclick={() => {
        value = ''
        inputEl?.focus()
      }}
      aria-label="Clear search"
      class="absolute top-1/2 right-2 -translate-y-1/2 text-ink-500 hover:text-ink-200"
    >
      &times;
    </button>
  {/if}

  {#if open}
    <div
      id={listId}
      role="listbox"
      class="absolute inset-x-0 top-[calc(100%+4px)] z-20 flex max-h-[180px] flex-col gap-0.5 overflow-y-auto rounded-md border border-ink-700 bg-ink-900 p-1 shadow-lg shadow-black/50"
    >
      {#if filtered.length === 0}
        <div class="px-2 py-1.5 text-xs text-ink-400">No matching scenarios</div>
      {:else}
        {#each filtered as name, i (name)}
          <button
            type="button"
            role="option"
            aria-selected={name === value}
            onmousedown={(e) => {
              e.preventDefault()
              choose(name)
            }}
            class="w-full rounded px-2 py-1.5 text-left text-xs text-ink-100 hover:bg-ink-800 {i ===
            highlighted
              ? 'bg-ink-800'
              : ''} {name === value ? 'bg-accent-500/20' : ''}"
          >
            {name}
          </button>
        {/each}
      {/if}
    </div>
  {/if}
</div>
