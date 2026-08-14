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
      const data = (await res.json()) as { submissions?: Submission[]; error?: string }
      if (!res.ok) {
        loadError = data.error ?? `HTTP ${res.status}`
        return
      }
      submissions = data.submissions ?? []
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
      const data = (await res.json()) as { ok?: boolean; error?: string }
      if (!res.ok || !data.ok) {
        actionError = { ...actionError, [id]: data.error ?? `HTTP ${res.status}` }
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
</script>

<svelte:head>
  <title>Recipe submissions — Admin</title>
</svelte:head>

<main>
  <h1>Recipe submissions</h1>

  {#if loading}
    <p class="muted">Loading…</p>
  {:else if loadError}
    <p class="error">{loadError}</p>
  {:else if pending.length === 0 && others.length === 0}
    <p class="muted">No submissions yet.</p>
  {:else}
    {#if pending.length === 0}
      <p class="muted">No pending submissions.</p>
    {/if}

    {#each [...grouped.entries()] as [scenarioName, group] (scenarioName)}
      <section class="scenario-group">
        <h2>
          {scenarioName}
          {#if group.length > 1}
            <span class="badge">{group.length} competing submissions</span>
          {/if}
        </h2>
        {#each group as s (s.id)}
          {@const recipe = parseRecipe(s.recipe)}
          {@const diff = computeDiff(s, recipe, data.currentScenarios)}
          <article class="submission">
            <div class="row">
              <span class="muted">vs. current scenario data</span>
              <span class="muted">Submitted {new Date(s.created_at).toLocaleString()}</span>
            </div>
            {#if recipe}
              <table class="diff">
                <tbody>
                  {#each diff as f (f.label)}
                    <tr class:changed={f.changed}>
                      <td class="diff-label">{f.label}</td>
                      {#if f.changed}
                        <td class="diff-old">{f.oldText}</td>
                        <td class="diff-arrow">→</td>
                        <td class="diff-new">{f.newText}</td>
                      {:else}
                        <td class="diff-same" colspan="3">{f.newText} <span class="muted">(unchanged)</span></td>
                      {/if}
                    </tr>
                  {/each}
                </tbody>
              </table>
            {:else}
              <div class="row error">Recipe data couldn't be parsed.</div>
            {/if}
            {#if !data.currentScenarios[s.scenario_name]}
              <div class="row muted">No current data for this scenario — this would be a brand new entry.</div>
            {/if}
            {#if s.submitter_id}
              <div class="row muted">Submitter: {s.submitter_id}</div>
            {/if}

            {#if actionError[s.id]}
              <p class="error">{actionError[s.id]}</p>
            {/if}
            <div class="actions">
              <button
                class="approve"
                disabled={actionBusy[s.id]}
                onclick={() => act(s.id, 'approve')}
              >
                {actionBusy[s.id] ? 'Working…' : 'Approve'}
              </button>
              <button class="deny" disabled={actionBusy[s.id]} onclick={() => act(s.id, 'deny')}>
                {actionBusy[s.id] ? 'Working…' : 'Deny'}
              </button>
            </div>
          </article>
        {/each}
      </section>
    {/each}

    {#if others.length > 0}
      <h2 class="history-title">History</h2>
      <table>
        <thead>
          <tr>
            <th>Scenario</th>
            <th>Status</th>
            <th>PR</th>
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
          {#each others as s (s.id)}
            <tr>
              <td>{s.scenario_name}</td>
              <td><span class="status status-{s.status}">{s.status}</span></td>
              <td>
                {#if s.pr_number}
                  <a href={`https://github.com/NHG-Design/balaclava/pull/${s.pr_number}`} target="_blank" rel="noopener noreferrer">#{s.pr_number}</a>
                {:else}
                  —
                {/if}
              </td>
              <td>{new Date(s.created_at).toLocaleDateString()}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    {/if}
  {/if}
</main>

<style>
  main {
    max-width: 720px;
    margin: 0 auto;
    padding: 32px 16px;
    background: oklch(14% 0.01 260);
    min-height: 100vh;
    font-family: system-ui, sans-serif;
    color: oklch(90% 0.006 95);
  }
  h1 {
    font-size: 22px;
    margin-bottom: 20px;
  }
  h2 {
    font-size: 15px;
    margin: 24px 0 8px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .badge {
    font-size: 10px;
    text-transform: uppercase;
    color: #e9a23b;
    border: 1px solid #e9a23b;
    border-radius: 4px;
    padding: 2px 6px;
  }
  .scenario-group {
    border-bottom: 1px solid oklch(27% 0.017 285);
    padding-bottom: 8px;
  }
  .submission {
    background: oklch(20% 0.008 285);
    border: 1px solid oklch(27% 0.017 285);
    border-radius: 8px;
    padding: 12px;
    margin-bottom: 10px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .row {
    font-size: 13px;
    display: flex;
    justify-content: space-between;
    gap: 8px;
    flex-wrap: wrap;
  }
  .muted {
    color: oklch(55% 0.008 285);
    font-size: 12px;
  }
  .error {
    color: #e77;
    font-size: 12px;
  }
  .actions {
    display: flex;
    gap: 8px;
    margin-top: 8px;
  }
  button {
    border: none;
    border-radius: 6px;
    padding: 6px 12px;
    font-size: 12px;
    cursor: pointer;
  }
  button:disabled {
    opacity: 0.5;
    cursor: default;
  }
  .approve {
    background: oklch(30% 0.09 155);
    color: oklch(96% 0.012 95);
  }
  .deny {
    background: oklch(28% 0.09 25);
    color: oklch(96% 0.012 95);
  }
  .diff {
    width: 100%;
    border-collapse: collapse;
    font-size: 12px;
    margin: 4px 0;
  }
  .diff td {
    padding: 3px 6px 3px 0;
    vertical-align: top;
  }
  .diff-label {
    color: oklch(58% 0.012 285);
    white-space: nowrap;
    width: 1%;
  }
  .diff-same {
    color: oklch(75% 0.006 95);
  }
  tr.changed .diff-old {
    color: #e77;
    text-decoration: line-through;
  }
  tr.changed .diff-new {
    color: #6d6;
    font-weight: 600;
  }
  .diff-arrow {
    color: oklch(50% 0.008 285);
    width: 1%;
  }
  .history-title {
    margin-top: 32px;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 12px;
  }
  th, td {
    text-align: left;
    padding: 6px 8px;
    border-bottom: 1px solid oklch(27% 0.017 285);
  }
  .status {
    text-transform: uppercase;
    font-size: 10px;
    padding: 2px 6px;
    border-radius: 4px;
  }
  .status-approved { background: oklch(28% 0.06 220 / 0.5); color: #7ac6ff; }
  .status-merged { background: oklch(30% 0.09 155 / 0.5); color: #6d6; }
  .status-denied { background: oklch(28% 0.09 25 / 0.5); color: #e77; }
  a { color: #7ac6ff; }
</style>
