<script lang="ts">
  import {
    computeDiff,
    parseRecipe,
    summarizeRecipe,
    type CurrentScenario,
    type RecipeSubmission,
  } from '$lib/recipe-diff'

  interface Props {
    submission: RecipeSubmission
    currentScenarios: Record<string, CurrentScenario>
    variant: 'public' | 'admin'
    /** public only */
    highlighted?: boolean
    copied?: boolean
    onCopyLink?: () => void
    /** admin only */
    siblings?: RecipeSubmission[]
    actionBusy?: boolean
    actionError?: string
    onApprove?: () => void
    onDeny?: () => void
  }

  let {
    submission: s,
    currentScenarios,
    variant,
    highlighted = false,
    copied = false,
    onCopyLink,
    siblings = [],
    actionBusy = false,
    actionError = '',
    onApprove,
    onDeny,
  }: Props = $props()

  const STATUS_CLASSES: Record<RecipeSubmission['status'], string> = {
    pending: 'bg-amber-500/15 text-amber-300',
    approved: 'bg-sky-500/15 text-sky-300',
    merged: 'bg-emerald-500/15 text-emerald-300',
    denied: 'bg-rose-500/15 text-rose-300',
  }

  let recipe = $derived(parseRecipe(s.recipe))
  let diff = $derived(s.status === 'merged' ? null : computeDiff(s, recipe, currentScenarios))
  let hasChanges = $derived(diff ? diff.some((f) => f.changed) : false)
  let summary = $derived(s.status === 'merged' ? summarizeRecipe(s, recipe) : null)
  let isNew = $derived(!currentScenarios[s.scenario_name])

  function siblingDelta(sibling: RecipeSubmission): string {
    const siblingRecipe = parseRecipe(sibling.recipe)
    if (!recipe || !siblingRecipe) return ''
    const asCurrentScenario = {
      [s.scenario_name]: {
        payoutMin: sibling.payout_min,
        payoutMax: sibling.payout_max,
        actions: siblingRecipe,
      },
    }
    const changed = computeDiff(s, recipe, asCurrentScenario)
      .filter((f) => f.changed)
      .map((f) => f.label)
    return changed.length > 0 ? changed.join(', ') : 'identical'
  }
</script>

<article
  id={variant === 'public' ? `submission-${s.id}` : undefined}
  class="flex flex-col gap-2.5 rounded-xl border p-4 transition-shadow duration-500 {variant ===
  'public'
    ? 'scroll-mt-6'
    : ''} {highlighted
    ? 'border-accent-400 shadow-[0_0_0_2px_var(--color-accent-400)]'
    : 'border-ink-700 bg-ink-900'}"
>
  <div class="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
    <span class="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-ink-400">
      <span
        class="rounded px-1.5 py-0.5 text-[10px] font-medium tracking-wide uppercase {STATUS_CLASSES[
          s.status
        ]}"
      >
        {s.status}
      </span>
      {#if variant === 'admin'}
        <span class="font-medium text-ink-200">#{s.id}</span>
      {/if}
      {#if s.submitter_id}
        <a
          href={`https://www.torn.com/profiles.php?XID=${s.submitter_id}`}
          target="_blank"
          rel="noopener noreferrer"
          class="text-accent-400 hover:underline"
        >
          {s.submitter_name ?? s.submitter_id}
        </a>
      {/if}
      {#if variant === 'admin' && isNew}
        <span
          class="rounded-full border border-accent-400/40 px-1.5 py-px text-[10px] font-medium tracking-wide text-accent-400 uppercase"
        >
          New scenario
        </span>
      {/if}
    </span>
    <div class="flex items-center gap-3">
      <span class="text-xs text-ink-400">
        {new Date(s.created_at).toLocaleString()}
      </span>
      {#if variant === 'public' && onCopyLink}
        <button
          onclick={onCopyLink}
          aria-label="Copy share link"
          class="inline-flex items-center gap-1 rounded px-1 py-0.5 text-xs text-ink-400 transition-colors hover:text-accent-400"
        >
          {#if copied}
            Copied!
          {:else}
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M9 15l6 -6" />
              <path d="M11 6l.463 -.536a5 5 0 0 1 7.071 7.072l-.534 .464" />
              <path
                d="M13 18l-.397 .534a5.068 5.068 0 0 1 -7.127 0a4.972 4.972 0 0 1 0 -7.071l.524 -.463"
              />
            </svg>
            Copy link
          {/if}
        </button>
      {/if}
    </div>
  </div>

  {#if !recipe}
    <p class="text-sm text-rose-400">Recipe data couldn't be parsed.</p>
  {:else if summary}
    <div class="flex flex-col gap-1 text-[13px]">
      {#each summary as f (f.label)}
        <p>
          <span class="text-ink-400">{f.label}:</span>
          <span class="font-medium text-ink-200">{f.text}</span>
        </p>
      {/each}
    </div>
  {:else if diff && !hasChanges}
    <p class="text-sm text-ink-400">No changes from current data.</p>
  {:else if diff}
    <div class="flex flex-col gap-1 text-[13px]">
      {#each diff as f (f.label)}
        <p>
          <span class="text-ink-400">{f.label}:</span>
          {#if f.changed}
            <span class="text-rose-400 line-through">{f.oldText}</span>
            <span class="text-ink-600">→</span>
            <span class="font-medium text-emerald-400">{f.newText}</span>
          {:else}
            <span class="text-ink-300">{f.newText}</span>
          {/if}
        </p>
      {/each}
    </div>
  {/if}

  {#if variant === 'admin' && siblings.length > 0}
    <div class="flex flex-col gap-0.5">
      {#each siblings as sibling (sibling.id)}
        <p class="text-xs text-ink-400">vs #{sibling.id}: {siblingDelta(sibling)}</p>
      {/each}
    </div>
  {/if}

  {#if s.status === 'approved' && s.pr_number}
    <p class="text-xs text-ink-400">
      Final review in
      <a
        href={`https://github.com/NHG-Design/balaclava/pull/${s.pr_number}`}
        target="_blank"
        rel="noopener noreferrer"
        class="text-accent-400 hover:underline"
      >
        PR #{s.pr_number}
      </a>
    </p>
  {:else if s.status === 'merged' && s.pr_number}
    <p class="text-xs text-ink-400">
      Shipped via
      <a
        href={`https://github.com/NHG-Design/balaclava/pull/${s.pr_number}`}
        target="_blank"
        rel="noopener noreferrer"
        class="text-accent-400 hover:underline"
      >
        PR #{s.pr_number}
      </a>
    </p>
  {/if}

  {#if variant === 'admin'}
    {#if actionError}
      <p class="text-xs text-rose-400">{actionError}</p>
    {/if}

    <div class="flex gap-2">
      <button
        disabled={actionBusy}
        onclick={onApprove}
        class="rounded-md bg-emerald-500/15 px-3 py-1.5 text-xs font-medium text-emerald-300 transition-colors hover:bg-emerald-500/25 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-40"
      >
        {actionBusy ? 'Working…' : 'Approve'}
      </button>
      <button
        disabled={actionBusy}
        onclick={onDeny}
        class="rounded-md bg-rose-500/15 px-3 py-1.5 text-xs font-medium text-rose-300 transition-colors hover:bg-rose-500/25 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-40"
      >
        {actionBusy ? 'Working…' : 'Deny'}
      </button>
    </div>
  {/if}
</article>
