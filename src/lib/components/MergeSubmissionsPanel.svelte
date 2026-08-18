<script lang="ts">
  import {
    computeMergeLines,
    parseRecipe,
    type CurrentScenario,
    type MergeResolutions,
    type RecipeSubmission,
  } from '$lib/recipe-diff'

  interface Props {
    submissions: RecipeSubmission[]
    current: CurrentScenario | undefined
    busy?: boolean
    error?: string
    onCancel?: () => void
    onSubmit?: (resolutions: MergeResolutions, notes: Record<number, string>) => void
  }

  let { submissions, current, busy = false, error = '', onCancel, onSubmit }: Props = $props()

  const NOTE_MAX = 500
  let denyNotes = $state<Record<number, string>>({})

  let mergeable = $derived(
    submissions.flatMap((s) => {
      const recipe = parseRecipe(s.recipe)
      return recipe ? [{ id: s.id, payout_min: s.payout_min, payout_max: s.payout_max, recipe }] : []
    }),
  )
  let lines = $derived(computeMergeLines(mergeable, current))

  let resolutions = $state<MergeResolutions>({})

  $effect(() => {
    const defaults: MergeResolutions = {}
    for (const line of lines) {
      if (resolutions[line.key] !== undefined) continue
      const firstSubmission = line.candidates.find((c) => c.source !== 'current')
      if (firstSubmission) defaults[line.key] = firstSubmission.source as number
    }
    if (Object.keys(defaults).length > 0) resolutions = { ...resolutions, ...defaults }
  })

  function candidateLabel(source: 'current' | number): string {
    return source === 'current' ? 'Current' : `#${source}`
  }

  function submit() {
    onSubmit?.(resolutions, denyNotes)
  }
</script>

<div class="flex flex-col gap-3 rounded-xl border border-accent-400/40 bg-ink-900 p-4">
  <p class="text-xs font-medium tracking-wide text-accent-400 uppercase">
    Merging {submissions.length} submissions
  </p>

  {#if lines.length === 0}
    <p class="text-sm text-ink-400">No changed lines across the selected submissions.</p>
  {:else}
    <div class="flex flex-col gap-2.5 text-[13px]">
      {#each lines as row (row.key)}
        <div>
          <p class="mb-1 text-ink-400">{row.label}:</p>
          <div class="flex flex-wrap gap-x-4 gap-y-1">
            {#each row.candidates as candidate (candidate.source)}
              <label class="flex items-center gap-1.5">
                <input
                  type="radio"
                  name={row.key}
                  disabled={busy}
                  checked={(resolutions[row.key] ?? 'current') === candidate.source}
                  onchange={() => (resolutions = { ...resolutions, [row.key]: candidate.source })}
                  class="accent-accent-500"
                />
                <span class="text-ink-500">{candidateLabel(candidate.source)}:</span>
                <span class="font-medium text-ink-200">{candidate.text}</span>
              </label>
            {/each}
          </div>
        </div>
      {/each}
    </div>
  {/if}

  <div class="flex flex-col gap-2">
    {#each submissions as s (s.id)}
      <div>
        <p class="mb-1 text-xs text-ink-400">
          Note for #{s.id}<span class="text-ink-600"> — used only if this submission ends up denied</span>
        </p>
        <textarea
          value={denyNotes[s.id] ?? ''}
          oninput={(e) => (denyNotes = { ...denyNotes, [s.id]: e.currentTarget.value })}
          disabled={busy}
          maxlength={NOTE_MAX}
          placeholder="Optional note…"
          rows="2"
          class="w-full resize-none rounded-md border border-ink-700 bg-ink-900 px-2.5 py-1.5 text-[13px] text-ink-100 placeholder:text-ink-500 focus:border-accent-500 focus:outline-none disabled:opacity-40"
        ></textarea>
      </div>
    {/each}
  </div>

  {#if error}
    <p class="text-xs text-rose-400">{error}</p>
  {/if}

  <div class="flex gap-2">
    <button
      type="button"
      disabled={busy}
      onclick={onCancel}
      class="rounded-md px-3 py-1.5 text-xs font-medium text-ink-400 transition-colors hover:text-ink-200 disabled:pointer-events-none disabled:opacity-40"
    >
      Cancel
    </button>
    <button
      type="button"
      disabled={busy || lines.length === 0}
      onclick={submit}
      class="rounded-md bg-accent-500/15 px-3 py-1.5 text-xs font-medium text-accent-300 transition-colors hover:bg-accent-500/25 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-40"
    >
      {busy ? 'Merging…' : 'Submit merge'}
    </button>
  </div>
</div>
