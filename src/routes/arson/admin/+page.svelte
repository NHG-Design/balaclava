<script lang="ts">
  import { onMount } from 'svelte'
  import type { PageData } from './$types'
  import type { FieldDecisions, RecipeSubmission } from '$lib/recipe-diff'
  import RecipeSubmissionCard from '$lib/components/RecipeSubmissionCard.svelte'
  import ScenarioCombobox from '$lib/components/ScenarioCombobox.svelte'
  import Button from '$lib/components/Button.svelte'

  let { data }: { data: PageData } = $props()

  type Submission = RecipeSubmission

  type StatusFilter = 'pending' | 'approved' | 'shipped' | 'denied'

  const TABS: { key: StatusFilter; label: string; statuses: Submission['status'][] }[] = [
    { key: 'pending', label: 'Pending', statuses: ['pending'] },
    { key: 'approved', label: 'Approved', statuses: ['approved', 'partial'] },
    { key: 'shipped', label: 'Shipped', statuses: ['merged'] },
    { key: 'denied', label: 'Denied', statuses: ['denied'] },
  ]

  let submissions = $state<Submission[]>([])
  let loading = $state(true)
  let loadError = $state('')
  let actionError = $state<Record<number, string>>({})
  let actionBusy = $state<Record<number, boolean>>({})
  let statusFilter = $state<StatusFilter>('pending')
  let scenarioQuery = $state('')

  async function load() {
    loading = true
    loadError = ''
    try {
      const res = await fetch('/api/arson/admin/recipe-submissions')
      if (res.status === 401) {
        window.location.href = '/arson/admin/login'
        return
      }
      const json = (await res.json()) as { submissions?: Submission[]; error?: string }
      if (!res.ok) {
        loadError = json.error ?? `HTTP ${res.status}`
        return
      }
      submissions = json.submissions ?? []
      historyShown = HISTORY_PAGE_SIZE
    } catch {
      loadError = 'Network error'
    } finally {
      loading = false
    }
  }

  onMount(load)

  async function act(
    id: number,
    action: 'approve' | 'deny',
    decisions?: FieldDecisions,
    note?: string,
  ) {
    actionBusy = { ...actionBusy, [id]: true }
    actionError = { ...actionError, [id]: '' }
    try {
      const res = await fetch(`/api/arson/admin/recipe-submissions/${id}/${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          action === 'approve' ? { decisions: decisions ?? {} } : { note: note ?? '' },
        ),
      })
      const json = (await res.json()) as { ok?: boolean; error?: string }
      if (!res.ok || !json.ok) {
        actionError = { ...actionError, [id]: json.error ?? `HTTP ${res.status}` }
        return
      }
      await load()
    } catch {
      actionError = { ...actionError, [id]: 'Network error' }
    } finally {
      actionBusy = { ...actionBusy, [id]: false }
    }
  }

  let scenarioNames = $derived(Object.keys(data.currentScenarios).sort((a, b) => a.localeCompare(b)))

  let tabStatuses = $derived(TABS.find((t) => t.key === statusFilter)?.statuses ?? [])
  let filteredForTab = $derived(
    submissions.filter((s) => {
      if (!tabStatuses.includes(s.status)) return false
      if (!scenarioQuery.trim()) return true
      return s.scenario_name.toLowerCase().includes(scenarioQuery.trim().toLowerCase())
    }),
  )

  let pending = $derived(statusFilter === 'pending' ? filteredForTab : [])
  let grouped = $derived.by(() => {
    const map = new Map<string, Submission[]>()
    for (const s of pending) {
      const list = map.get(s.scenario_name) ?? []
      list.push(s)
      map.set(s.scenario_name, list)
    }
    return map
  })
  let others = $derived(statusFilter === 'pending' ? [] : filteredForTab)

  const HISTORY_PAGE_SIZE = 40
  let historyShown = $state(HISTORY_PAGE_SIZE)
  let visibleHistory = $derived(others.slice(0, historyShown))

  $effect(() => {
    statusFilter
    historyShown = HISTORY_PAGE_SIZE
  })

  const STATUS_CLASSES: Record<Submission['status'], string> = {
    pending: 'bg-amber-500/15 text-amber-300',
    approved: 'bg-sky-500/15 text-sky-300',
    partial: 'bg-violet-500/15 text-violet-300',
    merged: 'bg-emerald-500/15 text-emerald-300',
    denied: 'bg-rose-500/15 text-rose-300',
  }

  async function logout() {
    await fetch('/api/arson/admin/auth/logout', { method: 'POST' })
    window.location.href = '/arson/admin/login'
  }
</script>

<svelte:head>
  <title>Recipe submissions — Admin</title>
</svelte:head>

<div class="min-h-screen bg-ink-950 text-ink-100">
  <header class="border-b border-ink-800 bg-ink-900/60">
    <div class="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
      <div>
        <p class="text-xs font-medium tracking-wide text-accent-400 uppercase">
          Arsonist's Ledger
        </p>
        <h1 class="text-xl font-semibold text-ink-100">Recipe submissions</h1>
      </div>
      <button
        onclick={logout}
        class="rounded-md px-3 py-1.5 text-sm text-ink-400 transition-colors hover:text-ink-100"
      >
        Log out
      </button>
    </div>
  </header>

  <main class="mx-auto max-w-6xl px-6 py-10">
    <div class="mb-8 flex flex-wrap items-center justify-between gap-4">
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

    {#if loading}
      <p class="text-sm text-ink-400">Loading…</p>
    {:else if loadError}
      <p class="text-sm text-rose-400">{loadError}</p>
    {:else if pending.length === 0 && others.length === 0}
      <p class="text-sm text-ink-400">
        {scenarioQuery ? 'No submissions match that search.' : `No ${statusFilter} submissions.`}
      </p>
    {:else}
      <div class="flex flex-col gap-10">
        {#each [...grouped.entries()] as [scenarioName, group] (scenarioName)}
          <section>
            <div class="mb-3 flex items-center gap-2.5">
              <h2 class="text-base font-semibold text-ink-100">{scenarioName}</h2>
              {#if group.length > 1}
                <span
                  class="rounded-full border border-ink-700 px-2 py-0.5 text-[10px] font-medium tracking-wide text-ink-400 uppercase"
                >
                  {group.length} submissions
                </span>
              {/if}
            </div>

            <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {#each group as s (s.id)}
                <RecipeSubmissionCard
                  submission={s}
                  currentScenarios={data.currentScenarios}
                  variant="admin"
                  actionBusy={actionBusy[s.id]}
                  actionError={actionError[s.id]}
                  onSubmit={(decisions) => act(s.id, 'approve', decisions)}
                  onDeny={(note) => act(s.id, 'deny', undefined, note)}
                />
              {/each}
            </div>
          </section>
        {/each}

        {#if others.length > 0}
          <section>
            <h2 class="mb-3 text-base font-semibold text-ink-100">
              {TABS.find((t) => t.key === statusFilter)?.label}
            </h2>
            <div class="overflow-x-auto rounded-xl border border-ink-700">
              <table class="w-full border-collapse text-[13px]">
                <thead>
                  <tr class="border-b border-ink-700 text-left text-xs text-ink-400">
                    <th class="px-4 py-2.5 font-medium">Scenario</th>
                    <th class="px-4 py-2.5 font-medium">Status</th>
                    <th class="px-4 py-2.5 font-medium">PR</th>
                    <th class="px-4 py-2.5 font-medium">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {#each visibleHistory as s (s.id)}
                    <tr class="border-b border-ink-800 last:border-0">
                      <td class="px-4 py-2.5 text-ink-100">{s.scenario_name}</td>
                      <td class="px-4 py-2.5">
                        <span
                          class="rounded px-1.5 py-0.5 text-[10px] font-medium tracking-wide uppercase {STATUS_CLASSES[
                            s.status
                          ]}"
                        >
                          {s.status}
                        </span>
                      </td>
                      <td class="px-4 py-2.5">
                        {#if s.pr_number}
                          <a
                            href={`https://github.com/NHG-Design/balaclava/pull/${s.pr_number}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            class="text-accent-400 hover:underline"
                          >
                            #{s.pr_number}
                          </a>
                        {:else}
                          <span class="text-ink-600">—</span>
                        {/if}
                      </td>
                      <td class="px-4 py-2.5 text-ink-400">
                        {new Date(s.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  {/each}
                </tbody>
              </table>
            </div>
            {#if historyShown < others.length}
              <div class="mt-4 flex justify-center">
                <Button onclick={() => (historyShown += HISTORY_PAGE_SIZE)}>Load more</Button>
              </div>
            {/if}
          </section>
        {/if}
      </div>
    {/if}
  </main>
</div>
