<script lang="ts">
  import { onMount, tick } from 'svelte'
  import type { PageData } from './$types'
  import type { RecipeSubmission } from '$lib/recipe-diff'
  import RecipeSubmissionCard from '$lib/components/RecipeSubmissionCard.svelte'

  let { data }: { data: PageData } = $props()

  type Submission = RecipeSubmission

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

  function groupByScenario(list: Submission[]): Map<string, Submission[]> {
    const map = new Map<string, Submission[]>()
    for (const s of list) {
      const group = map.get(s.scenario_name) ?? []
      group.push(s)
      map.set(s.scenario_name, group)
    }
    for (const group of map.values()) {
      group.sort((a, b) => b.created_at.localeCompare(a.created_at))
    }
    return new Map([...map.entries()].sort(([a], [b]) => a.localeCompare(b)))
  }

  let groupedPending = $derived(groupByScenario(submissions.filter((s) => s.status === 'pending')))
  let groupedAccepted = $derived(
    groupByScenario(submissions.filter((s) => s.status === 'approved' || s.status === 'merged')),
  )
  let groupedDenied = $derived(groupByScenario(submissions.filter((s) => s.status === 'denied')))
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

    {#snippet scenarioGroups(groups: Map<string, Submission[]>)}
      <div class="flex flex-col gap-10">
        {#each [...groups.entries()] as [scenarioName, group] (scenarioName)}
          <section>
            <h3 class="mb-3 text-base font-semibold text-ink-100">{scenarioName}</h3>

            <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {#each group as s (s.id)}
                <RecipeSubmissionCard
                  submission={s}
                  currentScenarios={data.currentScenarios}
                  variant="public"
                  highlighted={highlightedId === s.id}
                  copied={copiedId === s.id}
                  onCopyLink={() => copyLink(s.id)}
                />
              {/each}
            </div>
          </section>
        {/each}
      </div>
    {/snippet}

    {#if loading}
      <p class="text-sm text-ink-400">Loading…</p>
    {:else if loadError}
      <p class="text-sm text-rose-400">{loadError}</p>
    {:else if submissions.length === 0}
      <p class="text-sm text-ink-400">No submissions here yet.</p>
    {:else if statusFilter === 'denied'}
      {#if groupedDenied.size === 0}
        <p class="text-sm text-ink-400">No denied submissions.</p>
      {:else}
        {@render scenarioGroups(groupedDenied)}
      {/if}
    {:else}
      <div class="flex flex-col gap-12">
        <section>
          <h2 class="mb-4 text-2xl font-semibold text-ink-100">Pending</h2>
          {#if groupedPending.size === 0}
            <p class="text-sm text-ink-400">No pending submissions.</p>
          {:else}
            {@render scenarioGroups(groupedPending)}
          {/if}
        </section>

        <section>
          <h2 class="mb-4 text-2xl font-semibold text-ink-100">Approved</h2>
          {#if groupedAccepted.size === 0}
            <p class="text-sm text-ink-400">No approved submissions yet.</p>
          {:else}
            {@render scenarioGroups(groupedAccepted)}
          {/if}
        </section>
      </div>
    {/if}
  </main>
</div>
