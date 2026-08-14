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
</script>

<svelte:head>
  <title>Recipe submissions — Arsonist's Ledger</title>
</svelte:head>

<main>
  <header>
    <h1>Community recipe submissions</h1>
  </header>

  <div class="filters">
    <button class:active={statusFilter === 'default'} onclick={() => (statusFilter = 'default')}>
      Pending &amp; approved
    </button>
    <button class:active={statusFilter === 'denied'} onclick={() => (statusFilter = 'denied')}>
      Denied
    </button>
  </div>

  {#if loading}
    <p class="muted">Loading…</p>
  {:else if loadError}
    <p class="error">{loadError}</p>
  {:else if submissions.length === 0}
    <p class="muted">No submissions here yet.</p>
  {:else}
    {#each [...grouped.entries()] as [scenarioName, group] (scenarioName)}
      <section class="scenario-group">
        <h2>{scenarioName}</h2>
        {#each group as s (s.id)}
          {@const recipe = parseRecipe(s.recipe)}
          {@const diff = computeDiff(s, recipe, data.currentScenarios)}
          <article
            class="submission"
            class:highlighted={highlightedId === s.id}
            id={`submission-${s.id}`}
          >
            <div class="row">
              <span class="status status-{s.status}">{s.status}</span>
              <div class="row-right">
                <span class="muted">{new Date(s.created_at).toLocaleString()}</span>
                <button class="copy-btn" onclick={() => copyLink(s.id)} aria-label="Copy share link">
                  {#if copiedId === s.id}
                    Copied!
                  {:else}
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                      <path d="M9 15l6 -6" />
                      <path d="M11 6l.463 -.536a5 5 0 0 1 7.071 7.072l-.534 .464" />
                      <path d="M13 18l-.397 .534a5.068 5.068 0 0 1 -7.127 0a4.972 4.972 0 0 1 0 -7.071l.524 -.463" />
                    </svg>
                    Copy link
                  {/if}
                </button>
              </div>
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
            {#if s.status === 'approved' && s.pr_number}
              <div class="row muted">
                Approved — deploying via
                <a href={`https://github.com/NHG-Design/balaclava/pull/${s.pr_number}`} target="_blank" rel="noopener noreferrer">PR #{s.pr_number}</a>
              </div>
            {/if}
          </article>
        {/each}
      </section>
    {/each}
  {/if}
</main>

<style>
  :global(body) {
    margin: 0;
  }
  main {
    max-width: 720px;
    margin: 0 auto;
    padding: 32px 16px 80px;
    background: oklch(14% 0.01 260);
    min-height: 100vh;
    font-family: system-ui, sans-serif;
    color: oklch(90% 0.006 95);
  }
  header {
    margin-bottom: 16px;
  }
  h1 {
    font-size: 20px;
    margin: 0;
  }
  h2 {
    font-size: 15px;
    margin: 24px 0 8px;
  }
  .filters {
    display: flex;
    gap: 8px;
    margin-bottom: 8px;
  }
  .filters button {
    background: oklch(20% 0.008 285);
    border: 1px solid oklch(27% 0.017 285);
    color: oklch(70% 0.01 285);
    border-radius: 6px;
    padding: 6px 12px;
    font-size: 12px;
    cursor: pointer;
  }
  .filters button.active {
    background: color-mix(in oklch, #6d6 22%, oklch(20% 0.008 285));
    color: oklch(96% 0.012 95);
    border-color: #6d6;
  }
  .muted {
    color: oklch(55% 0.008 285);
    font-size: 12px;
  }
  .error {
    color: #e77;
    font-size: 13px;
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
    scroll-margin-top: 24px;
    box-shadow: 0 0 0 0 transparent;
    transition: box-shadow 600ms cubic-bezier(0.23, 1, 0.32, 1), border-color 600ms cubic-bezier(0.23, 1, 0.32, 1);
  }
  .submission.highlighted {
    box-shadow: 0 0 0 2px #6d6;
    border-color: #6d6;
  }
  .row {
    font-size: 13px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }
  .row-right {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .copy-btn {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    background: none;
    border: none;
    color: oklch(58% 0.012 285);
    cursor: pointer;
    font-size: 11px;
    padding: 2px 4px;
  }
  .copy-btn:hover {
    color: #6d6;
  }
  .status {
    text-transform: uppercase;
    font-size: 10px;
    padding: 2px 6px;
    border-radius: 4px;
    flex-shrink: 0;
  }
  .status-pending { background: oklch(30% 0.09 90 / 0.4); color: #e9c23b; }
  .status-approved { background: oklch(28% 0.06 220 / 0.5); color: #7ac6ff; }
  .status-merged { background: oklch(30% 0.09 155 / 0.5); color: #6d6; }
  .status-denied { background: oklch(28% 0.09 25 / 0.5); color: #e77; }
  a { color: #7ac6ff; }

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
</style>
