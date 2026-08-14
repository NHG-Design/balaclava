<script lang="ts">
  import { onMount } from 'svelte'
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

  let submissions = $state<Submission[]>([])
  let loading = $state(true)
  let loadError = $state('')
  let actionError = $state<Record<number, string>>({})
  let actionBusy = $state<Record<number, boolean>>({})

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
    } catch {
      loadError = 'Network error'
    } finally {
      loading = false
    }
  }

  onMount(load)

  async function act(id: number, action: 'approve' | 'deny') {
    actionBusy = { ...actionBusy, [id]: true }
    actionError = { ...actionError, [id]: '' }
    try {
      const res = await fetch(`/api/arson/admin/recipe-submissions/${id}/${action}`, {
        method: 'POST',
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

  let pending = $derived(submissions.filter((s) => s.status === 'pending'))
  let grouped = $derived.by(() => {
    const map = new Map<string, Submission[]>()
    for (const s of pending) {
      const list = map.get(s.scenario_name) ?? []
      list.push(s)
      map.set(s.scenario_name, list)
    }
    return map
  })
  let others = $derived(submissions.filter((s) => s.status !== 'pending'))

  const STATUS_CLASSES: Record<Submission['status'], string> = {
    pending: 'bg-amber-500/15 text-amber-300',
    approved: 'bg-sky-500/15 text-sky-300',
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
    {#if loading}
      <p class="text-sm text-ink-400">Loading…</p>
    {:else if loadError}
      <p class="text-sm text-rose-400">{loadError}</p>
    {:else if pending.length === 0 && others.length === 0}
      <p class="text-sm text-ink-400">No submissions yet.</p>
    {:else}
      {#if pending.length === 0}
        <p class="mb-8 text-sm text-ink-400">No pending submissions.</p>
      {/if}

      <div class="flex flex-col gap-10">
        {#each [...grouped.entries()] as [scenarioName, group] (scenarioName)}
          <section>
            <div class="mb-3 flex items-center gap-2.5">
              <h2 class="text-base font-semibold text-ink-100">{scenarioName}</h2>
              {#if group.length > 1}
                <span
                  class="rounded-full border border-amber-400/40 px-2 py-0.5 text-[10px] font-medium tracking-wide text-amber-300 uppercase"
                >
                  {group.length} competing
                </span>
              {/if}
            </div>

            <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {#each group as s (s.id)}
                {@const recipe = parseRecipe(s.recipe)}
                {@const diff = computeDiff(s, recipe, data.currentScenarios)}
                <article class="flex flex-col gap-3 rounded-xl border border-ink-700 bg-ink-900 p-4">
                  <div class="flex items-center justify-between text-xs text-ink-400">
                    <span>vs. current scenario data</span>
                    <span>{new Date(s.created_at).toLocaleString()}</span>
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

                  {#if !data.currentScenarios[s.scenario_name]}
                    <p class="text-xs text-ink-400">
                      No current data for this scenario — this would be a brand new entry.
                    </p>
                  {/if}
                  {#if s.submitter_id}
                    <p class="text-xs text-ink-400">Submitter: {s.submitter_id}</p>
                  {/if}
                  {#if actionError[s.id]}
                    <p class="text-xs text-rose-400">{actionError[s.id]}</p>
                  {/if}

                  <div class="mt-1 flex gap-2">
                    <button
                      disabled={actionBusy[s.id]}
                      onclick={() => act(s.id, 'approve')}
                      class="rounded-md bg-emerald-500/15 px-3 py-1.5 text-xs font-medium text-emerald-300 transition-colors hover:bg-emerald-500/25 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-40"
                    >
                      {actionBusy[s.id] ? 'Working…' : 'Approve'}
                    </button>
                    <button
                      disabled={actionBusy[s.id]}
                      onclick={() => act(s.id, 'deny')}
                      class="rounded-md bg-rose-500/15 px-3 py-1.5 text-xs font-medium text-rose-300 transition-colors hover:bg-rose-500/25 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-40"
                    >
                      {actionBusy[s.id] ? 'Working…' : 'Deny'}
                    </button>
                  </div>
                </article>
              {/each}
            </div>
          </section>
        {/each}

        {#if others.length > 0}
          <section>
            <h2 class="mb-3 text-base font-semibold text-ink-100">History</h2>
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
                  {#each others as s (s.id)}
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
          </section>
        {/if}
      </div>
    {/if}
  </main>
</div>
