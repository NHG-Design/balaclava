<script lang="ts">
  import { onMount, tick } from 'svelte'
  import type { PageData } from './$types'
  import type { RecipeSubmission } from '$lib/recipe-diff'
  import RecipeSubmissionCard from '$lib/components/RecipeSubmissionCard.svelte'
  import ScenarioCombobox from '$lib/components/ScenarioCombobox.svelte'
  import Button from '$lib/components/Button.svelte'

  let { data }: { data: PageData } = $props()

  type Submission = RecipeSubmission

  type StatusFilter = 'pending' | 'approved' | 'shipped' | 'denied'

  const TABS: { key: StatusFilter; label: string; statuses: string }[] = [
    { key: 'pending', label: 'Pending', statuses: 'pending' },
    { key: 'approved', label: 'Approved', statuses: 'approved,partial' },
    { key: 'shipped', label: 'Shipped', statuses: 'merged' },
    { key: 'denied', label: 'Denied', statuses: 'denied' },
  ]

  const PAGE_SIZE = 40

  let submissions = $state<Submission[]>([])
  let loading = $state(true)
  let loadingMore = $state(false)
  let loadError = $state('')
  let statusFilter = $state<StatusFilter>('pending')
  let scenarioQuery = $state('')
  let offset = $state(0)
  let hasMore = $state(false)
  let copiedId = $state<number | null>(null)
  let highlightedId = $state<number | null>(null)

  async function fetchPage(nextOffset: number) {
    const qs = new URLSearchParams({ limit: String(PAGE_SIZE), offset: String(nextOffset) })
    const tab = TABS.find((t) => t.key === statusFilter)
    if (tab) qs.set('status', tab.statuses)
    const res = await fetch(`/api/arson/recipe-submissions?${qs}`)
    const json = (await res.json()) as { submissions?: Submission[]; error?: string }
    if (!res.ok) throw new Error(json.error ?? `HTTP ${res.status}`)
    return json.submissions ?? []
  }

  async function loadSubmissions() {
    loading = true
    loadError = ''
    try {
      const page = await fetchPage(0)
      submissions = page
      offset = page.length
      hasMore = page.length === PAGE_SIZE
    } catch {
      loadError = 'Network error'
    } finally {
      loading = false
    }
  }

  async function loadMore() {
    loadingMore = true
    try {
      const page = await fetchPage(offset)
      submissions = [...submissions, ...page]
      offset += page.length
      hasMore = page.length === PAGE_SIZE
    } catch {
      loadError = 'Network error'
    } finally {
      loadingMore = false
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

  let filteredSubmissions = $derived(
    scenarioQuery.trim()
      ? submissions.filter((s) =>
          s.scenario_name.toLowerCase().includes(scenarioQuery.trim().toLowerCase()),
        )
      : submissions,
  )
  let groupedCurrent = $derived(groupByScenario(filteredSubmissions))
  let scenarioNames = $derived(Object.keys(data.currentScenarios).sort((a, b) => a.localeCompare(b)))
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
    <div class="mb-6 flex flex-wrap items-center justify-between gap-4">
      <div class="inline-flex rounded-full border border-ink-700 bg-ink-900 p-1">
        {#each TABS as tab (tab.key)}
          <button
            onclick={() => (statusFilter = tab.key)}
            class="rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors {statusFilter ===
            tab.key
              ? 'bg-accent-500 text-ink-950'
              : 'text-ink-400 hover:text-ink-100'}"
          >
            {tab.label}
          </button>
        {/each}
      </div>

      <ScenarioCombobox {scenarioNames} bind:value={scenarioQuery} />
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
    {:else if groupedCurrent.size === 0}
      <p class="text-sm text-ink-400">
        {scenarioQuery ? 'No submissions match that search.' : 'No submissions here yet.'}
      </p>
    {:else}
      {@render scenarioGroups(groupedCurrent)}
    {/if}

    {#if !loading && !loadError && hasMore}
      <div class="mt-8 flex justify-center">
        <Button onclick={loadMore} disabled={loadingMore}>
          {loadingMore ? 'Loading…' : 'Load more'}
        </Button>
      </div>
    {/if}
  </main>
</div>
