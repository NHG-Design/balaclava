<script lang="ts">
  import { onMount, tick } from 'svelte'
  import type { PageData } from './$types'
  import { computeDiff, parseRecipe } from '$lib/recipe-diff'

  let { data }: { data: PageData } = $props()

  interface Submission {
    id: number
    scenario_name: string
    payout_min: number
    payout_max: number
    submitter_id: string | null
    recipe: string
    status: 'pending' | 'approved' | 'merged' | 'denied'
    pr_number: number | null
    created_at: string
  }

  type StatusFilter = 'default' | 'denied'

  let submissions = $state<Submission[]>([])
  let loading = $state(true)
  let loadError = $state('')
  let statusFilter = $state<StatusFilter>('default')
  let copiedId = $state<number | null>(null)
  let highlightedId = $state<number | null>(null)

  async function loadSubmissions() {
    loading = true
    loadError = ''
    try {
      const qs = statusFilter === 'denied' ? '?status=denied' : ''
      const res = await fetch(`/api/arson/recipe-submissions${qs}`)
      const json = (await res.json()) as { submissions?: Submission[]; error?: string }
      if (!res.ok) {
        loadError = json.error ?? `HTTP ${res.status}`
        return
      }
      submissions = json.submissions ?? []
    } catch {
      loadError = 'Network error'
    } finally {
      loading = false
    }
  }

  async function scrollToHash() {
    const hash = window.location.hash
    const match = /^#submission-(\d+)$/.exec(hash)
    if (!match) return
    const id = Number(match[1])
    await tick()
    const el = document.getElementById(`submission-${id}`)
    if (!el) return
    el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    highlightedId = id
    setTimeout(() => {
      if (highlightedId === id) highlightedId = null
    }, 2000)
  }

  onMount(() => {
    void loadSubmissions().then(scrollToHash)
  })

  $effect(() => {
    statusFilter
    void loadSubmissions()
  })

  async function copyLink(id: number) {
    const url = `${window.location.origin}${window.location.pathname}#submission-${id}`
    try {
      await navigator.clipboard.writeText(url)
      copiedId = id
      setTimeout(() => {
        if (copiedId === id) copiedId = null
      }, 1500)
    } catch {
      /* clipboard unavailable — link is still visible in the URL bar after a manual click */
    }
  }

  let grouped = $derived.by(() => {
    const map = new Map<string, Submission[]>()
    for (const s of submissions) {
      const list = map.get(s.scenario_name) ?? []
      list.push(s)
      map.set(s.scenario_name, list)
    }
    for (const list of map.values()) {
      list.sort((a, b) => b.created_at.localeCompare(a.created_at))
    }
    return new Map([...map.entries()].sort(([a], [b]) => a.localeCompare(b)))
  })

  const STATUS_CLASSES: Record<Submission['status'], string> = {
    pending: 'bg-amber-500/15 text-amber-300',
    approved: 'bg-sky-500/15 text-sky-300',
    merged: 'bg-emerald-500/15 text-emerald-300',
    denied: 'bg-rose-500/15 text-rose-300',
  }
</script>

<svelte:head>
  <title>Recipe submissions — Arsonist's Ledger</title>
</svelte:head>

<div class="min-h-screen bg-ink-950 text-ink-100">
  <header class="border-b border-ink-800 bg-ink-900/60">
    <div class="mx-auto max-w-6xl px-6 py-8">
      <p class="text-xs font-medium tracking-wide text-accent-400 uppercase">Arsonist's Ledger</p>
      <h1 class="text-2xl font-semibold text-ink-100">Community recipe submissions</h1>
      <p class="mt-1 text-sm text-ink-400">
        Recipes submitted from the userscript, browsable by scenario.
      </p>
    </div>
  </header>

  <main class="mx-auto max-w-6xl px-6 py-8">
    <div class="mb-6 inline-flex rounded-full border border-ink-700 bg-ink-900 p-1">
      <button
        onclick={() => (statusFilter = 'default')}
        class="rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors {statusFilter ===
        'default'
          ? 'bg-accent-500 text-ink-950'
          : 'text-ink-400 hover:text-ink-100'}"
      >
        Pending &amp; approved
      </button>
      <button
        onclick={() => (statusFilter = 'denied')}
        class="rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors {statusFilter ===
        'denied'
          ? 'bg-accent-500 text-ink-950'
          : 'text-ink-400 hover:text-ink-100'}"
      >
        Denied
      </button>
    </div>

    {#if loading}
      <p class="text-sm text-ink-400">Loading…</p>
    {:else if loadError}
      <p class="text-sm text-rose-400">{loadError}</p>
    {:else if submissions.length === 0}
      <p class="text-sm text-ink-400">No submissions here yet.</p>
    {:else}
      <div class="flex flex-col gap-10">
        {#each [...grouped.entries()] as [scenarioName, group] (scenarioName)}
          <section>
            <h2 class="mb-3 text-base font-semibold text-ink-100">{scenarioName}</h2>

            <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {#each group as s (s.id)}
                {@const recipe = parseRecipe(s.recipe)}
                {@const diff = computeDiff(s, recipe, data.currentScenarios)}
                <article
                  id={`submission-${s.id}`}
                  class="flex scroll-mt-6 flex-col gap-3 rounded-xl border border-ink-700 bg-ink-900 p-4 transition-shadow duration-500 {highlightedId ===
                  s.id
                    ? 'border-accent-400 shadow-[0_0_0_2px_var(--color-accent-400)]'
                    : ''}"
                >
                  <div class="flex items-center justify-between gap-2">
                    <span
                      class="rounded px-1.5 py-0.5 text-[10px] font-medium tracking-wide uppercase {STATUS_CLASSES[
                        s.status
                      ]}"
                    >
                      {s.status}
                    </span>
                    <div class="flex items-center gap-3">
                      <span class="text-xs text-ink-400">
                        {new Date(s.created_at).toLocaleString()}
                      </span>
                      <button
                        onclick={() => copyLink(s.id)}
                        aria-label="Copy share link"
                        class="inline-flex items-center gap-1 rounded px-1 py-0.5 text-xs text-ink-400 transition-colors hover:text-accent-400"
                      >
                        {#if copiedId === s.id}
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
                    </div>
                  </div>

                  {#if recipe}
                    <table class="w-full border-collapse text-[13px]">
                      <tbody>
                        {#each diff as f (f.label)}
                          <tr>
                            <td class="w-px py-1 pr-3 align-top whitespace-nowrap text-ink-400">
                              {f.label}
                            </td>
                            {#if f.changed}
                              <td class="py-1 pr-2 align-top text-rose-400 line-through">
                                {f.oldText}
                              </td>
                              <td class="w-px py-1 pr-2 align-top text-ink-600">→</td>
                              <td class="py-1 align-top font-medium text-emerald-400">
                                {f.newText}
                              </td>
                            {:else}
                              <td class="py-1 align-top text-ink-200" colspan="3">
                                {f.newText}
                                <span class="text-ink-600">(unchanged)</span>
                              </td>
                            {/if}
                          </tr>
                        {/each}
                      </tbody>
                    </table>
                  {:else}
                    <p class="text-sm text-rose-400">Recipe data couldn't be parsed.</p>
                  {/if}

                  {#if s.status === 'approved' && s.pr_number}
                    <p class="text-xs text-ink-400">
                      Approved — deploying via
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
                </article>
              {/each}
            </div>
          </section>
        {/each}
      </div>
    {/if}
  </main>
</div>
