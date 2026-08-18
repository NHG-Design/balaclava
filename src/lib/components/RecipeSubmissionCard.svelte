<script lang="ts">
  import {
    calcSubmissionPpn,
    computeDiff,
    computeLineDiffs,
    mergeDecisions,
    parseFieldDecisions,
    parseRecipe,
    summarizeRecipe,
    type CurrentScenario,
    type FieldDecisions,
    type LineDecision,
    type RecipeSubmission,
  } from '$lib/recipe-diff'
  import { formatPpn } from '../../userscripts/arsonists-ledger/engine'

  interface Props {
    submission: RecipeSubmission
    currentScenarios: Record<string, CurrentScenario>
    variant: 'public' | 'admin'
    /** public only */
    highlighted?: boolean
    /** admin only */
    actionBusy?: boolean
    actionError?: string
    onSubmit?: (decisions: FieldDecisions) => void
    onDeny?: (note: string) => void
  }

  let {
    submission: s,
    currentScenarios,
    variant,
    highlighted = false,
    actionBusy = false,
    actionError = '',
    onSubmit,
    onDeny,
  }: Props = $props()

  const STATUS_CLASSES: Record<RecipeSubmission['status'], string> = {
    pending: 'bg-amber-500/15 text-amber-300',
    approved: 'bg-sky-500/15 text-sky-300',
    partial: 'bg-violet-500/15 text-violet-300',
    merged: 'bg-emerald-500/15 text-emerald-300',
    denied: 'bg-rose-500/15 text-rose-300',
  }

  const PPN_BAND_CLASSES: Record<ReturnType<typeof calcSubmissionPpn>['band'], string> = {
    negative: 'text-rose-400',
    low: 'text-amber-400',
    good: 'text-sky-400',
    excellent: 'text-emerald-400',
  }

  const STATUS_LABELS: Record<RecipeSubmission['status'], string> = {
    pending: 'pending',
    approved: 'approved',
    partial: 'partially approved',
    merged: 'merged',
    denied: 'denied',
  }

  let recipe = $derived(parseRecipe(s.recipe))
  let current = $derived(currentScenarios[s.scenario_name])
  let diff = $derived(s.status === 'merged' ? null : computeDiff(s, recipe, currentScenarios))
  let hasChanges = $derived(diff ? diff.some((f) => f.changed) : false)
  let summary = $derived(s.status === 'merged' ? summarizeRecipe(s, recipe) : null)
  let isNew = $derived(!current)

  /** Per-line diff against current scenario data, used for the admin toggle list (while
   *  pending) and for the "which lines got in" breakdown once decided as partial. */
  let lineDiffs = $derived(recipe ? computeLineDiffs(s, recipe, current) : [])
  let storedDecisions = $derived(parseFieldDecisions(s.field_decisions))

  let decisions = $state<FieldDecisions>({})
  let denyNote = $state('')
  const DENY_NOTE_MAX = 500

  /** Which decisions map reflects "the recipe as currently decided", per variant/status:
   *  live toggles while an admin is reviewing a pending submission, the stored per-line
   *  verdicts once decided as partial/approved, otherwise the full submission (nothing to
   *  toggle). */
  let effectiveDecisions = $derived(
    variant === 'admin' && s.status === 'pending'
      ? decisions
      : s.status === 'partial' || (s.status === 'approved' && s.field_decisions)
        ? storedDecisions
        : {},
  )
  let ppn = $derived(
    recipe ? calcSubmissionPpn(mergeDecisions(s, recipe, current, effectiveDecisions)) : null,
  )

  function decisionFor(key: string): LineDecision {
    return decisions[key] ?? 'approve'
  }

  function toggle(key: string, value: LineDecision) {
    decisions = { ...decisions, [key]: value }
  }

  function submit() {
    onSubmit?.(decisions)
  }

  function deny() {
    onDeny?.(denyNote.trim())
  }

  function rowOldText(row: (typeof lineDiffs)[number]): string {
    return row.kind === 'added' ? '' : row.oldText
  }
  function rowNewText(row: (typeof lineDiffs)[number]): string {
    return row.kind === 'removed' ? '' : row.newText
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
        {STATUS_LABELS[s.status]}
      </span>
      <span class="font-medium text-ink-200">#{s.id}</span>
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
    </div>
  </div>

  {#if ppn}
    <p class="text-xs text-ink-400">
      Expected <span class="font-medium {PPN_BAND_CLASSES[ppn.band]}">{formatPpn(ppn.ppn)}/nerve</span
      >
    </p>
  {/if}

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
  {:else if s.status === 'partial' || (s.status === 'approved' && s.field_decisions)}
    <!-- Decided outcome: show what was actually accepted vs. rejected, line by line. -->
    <div class="flex flex-col gap-1 text-[13px]">
      {#each lineDiffs as row (row.key)}
        {#if row.kind === 'unchanged'}
          <p class="flex items-center gap-1.5">
            <span class="text-ink-400">{row.label}:</span>
            <span class="text-ink-300">{row.newText}</span>
          </p>
        {:else}
          {@const approved = (storedDecisions[row.key] ?? 'approve') === 'approve'}
          <p class="flex items-center gap-1.5">
            <span class={approved ? 'text-emerald-400' : 'text-rose-400'}>
              {approved ? '✓' : '✗'}
            </span>
            <span class="text-ink-400">{row.label}:</span>
            {#if rowOldText(row)}
              <span class="text-ink-500 line-through">{rowOldText(row)}</span>
            {/if}
            {#if rowOldText(row) && rowNewText(row)}
              <span class="text-ink-600">→</span>
            {/if}
            {#if rowNewText(row)}
              <span class="font-medium {approved ? 'text-ink-200' : 'text-ink-500 line-through'}"
                >{rowNewText(row)}</span
              >
            {/if}
          </p>
        {/if}
      {/each}
    </div>
  {:else if diff && !hasChanges}
    <p class="text-sm text-ink-400">No changes from current data.</p>
  {:else if variant === 'admin' && s.status === 'pending'}
    <!-- Pending: per-line Approve/Deny toggles feeding the Submit action below. -->
    <div class="flex flex-col gap-1.5 text-[13px]">
      {#each lineDiffs as row (row.key)}
        {#if row.kind === 'unchanged'}
          <p class="flex items-center gap-1.5">
            <span class="text-ink-400">{row.label}:</span>
            <span class="text-ink-300">{row.newText}</span>
          </p>
        {:else}
          <div class="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
            <p>
              <span class="text-ink-400">{row.label}:</span>
              {#if rowOldText(row)}
                <span class="text-rose-400 line-through">{rowOldText(row)}</span>
              {/if}
              {#if rowOldText(row) && rowNewText(row)}
                <span class="text-ink-600">→</span>
              {/if}
              {#if rowNewText(row)}
                <span class="font-medium text-emerald-400">{rowNewText(row)}</span>
              {/if}
            </p>
            <div class="inline-flex overflow-hidden rounded-md border border-ink-700 text-[11px]">
              <button
                disabled={actionBusy}
                onclick={() => toggle(row.key, 'approve')}
                class="px-2 py-1 font-medium transition-colors disabled:pointer-events-none disabled:opacity-40 {decisionFor(
                  row.key,
                ) === 'approve'
                  ? 'bg-emerald-500/25 text-emerald-300'
                  : 'text-ink-400 hover:text-ink-200'}"
              >
                Approve
              </button>
              <button
                disabled={actionBusy}
                onclick={() => toggle(row.key, 'deny')}
                class="px-2 py-1 font-medium transition-colors disabled:pointer-events-none disabled:opacity-40 {decisionFor(
                  row.key,
                ) === 'deny'
                  ? 'bg-rose-500/25 text-rose-300'
                  : 'text-ink-400 hover:text-ink-200'}"
              >
                Deny
              </button>
            </div>
          </div>
        {/if}
      {/each}
      {#if lineDiffs.every((r) => r.kind === 'unchanged')}
        <p class="text-sm text-ink-400">No changes from current data.</p>
      {/if}
    </div>
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

  {#if s.status === 'approved' && s.pr_number}
    <p class="text-xs text-ink-400">
      Under final review in
      <a
        href={`https://github.com/NHG-Design/balaclava/pull/${s.pr_number}`}
        target="_blank"
        rel="noopener noreferrer"
        class="text-accent-400 hover:underline"
      >
        PR #{s.pr_number}
      </a>
    </p>
  {:else if s.status === 'partial' && s.pr_number}
    <p class="text-xs text-ink-400">
      Under final review in
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

  {#if s.status === 'denied' && s.deny_note}
    <div class="rounded-md border border-rose-500/20 bg-rose-500/5 px-3 py-2">
      <p class="text-[10px] font-medium tracking-wide text-rose-400/80 uppercase">Denied — note</p>
      <p class="mt-0.5 text-[13px] whitespace-pre-wrap text-ink-200">{s.deny_note}</p>
    </div>
  {/if}

  {#if variant === 'admin' && s.status === 'pending'}
    {#if actionError}
      <p class="text-xs text-rose-400">{actionError}</p>
    {/if}

    <textarea
      bind:value={denyNote}
      disabled={actionBusy}
      maxlength={DENY_NOTE_MAX}
      placeholder="Optional note (shown to players if denied)…"
      rows="2"
      class="w-full resize-none rounded-md border border-ink-700 bg-ink-900 px-2.5 py-1.5 text-[13px] text-ink-100 placeholder:text-ink-500 focus:border-accent-500 focus:outline-none disabled:opacity-40"
    ></textarea>

    <div class="flex gap-2">
      <button
        disabled={actionBusy}
        onclick={deny}
        class="rounded-md bg-rose-500/15 px-3 py-1.5 text-xs font-medium text-rose-300 transition-colors hover:bg-rose-500/25 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-40"
      >
        Deny
      </button>
      <button
        disabled={actionBusy}
        onclick={submit}
        class="rounded-md bg-emerald-500/15 px-3 py-1.5 text-xs font-medium text-emerald-300 transition-colors hover:bg-emerald-500/25 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-40"
      >
        Submit
      </button>
    </div>
  {/if}
</article>
