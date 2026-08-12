<script lang="ts">
  import { onMount } from 'svelte'

  interface ActionItem {
    resourceId: string
    qty: number
  }
  interface Recipe {
    place: ActionItem[]
    ignite: ActionItem[]
    stoke?: ActionItem[]
    stokeTime?: string
    dampen?: ActionItem[]
    dampenTime?: string
  }
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
    score: number
    yourVote: number | null
  }

  type StatusFilter = 'default' | 'denied'

  let submissions = $state<Submission[]>([])
  let loading = $state(true)
  let loadError = $state('')
  let statusFilter = $state<StatusFilter>('default')

  let loggedIn = $state(false)
  let playerName = $state('')
  let showLogin = $state(false)
  let apiKey = $state('')
  let loginError = $state('')
  let loginLoading = $state(false)
  let pendingVote: { id: number; value: number } | null = $state(null)

  let voteBusy = $state<Record<number, boolean>>({})

  async function loadSubmissions() {
    loading = true
    loadError = ''
    try {
      const qs = statusFilter === 'denied' ? '?status=denied' : ''
      const res = await fetch(`/api/arson/recipe-submissions${qs}`)
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

  async function checkSession() {
    try {
      const res = await fetch('/api/arson/auth/me')
      const data = (await res.json()) as { loggedIn: boolean; name?: string }
      loggedIn = data.loggedIn
      playerName = data.name ?? ''
    } catch {
      loggedIn = false
    }
  }

  onMount(() => {
    void checkSession()
    void loadSubmissions()
  })

  $effect(() => {
    statusFilter
    void loadSubmissions()
  })

  function parseRecipe(raw: string): Recipe | null {
    try {
      return JSON.parse(raw) as Recipe
    } catch {
      return null
    }
  }

  function formatItems(items: ActionItem[] | undefined): string {
    if (!items || items.length === 0) return '—'
    return items.map((i) => `${i.qty}× ${i.resourceId}`).join(', ')
  }

  async function castVote(id: number, value: number) {
    if (!loggedIn) {
      pendingVote = { id, value }
      showLogin = true
      return
    }

    const current = submissions.find((s) => s.id === id)
    const nextValue = current?.yourVote === value ? 0 : value

    voteBusy = { ...voteBusy, [id]: true }
    try {
      const res = await fetch(`/api/arson/recipe-submissions/${id}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: nextValue }),
      })
      const data = (await res.json()) as { score?: number; yourVote?: number | null; error?: string }
      if (res.ok) {
        submissions = submissions.map((s) =>
          s.id === id ? { ...s, score: data.score ?? s.score, yourVote: data.yourVote ?? null } : s,
        )
      }
    } catch {
      /* transient — vote just doesn't update, no crash */
    } finally {
      voteBusy = { ...voteBusy, [id]: false }
    }
  }

  async function submitLogin(e: Event) {
    e.preventDefault()
    loginError = ''
    loginLoading = true
    try {
      const res = await fetch('/api/arson/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey }),
      })
      const data = (await res.json()) as { ok?: boolean; name?: string; error?: string }
      if (!res.ok || !data.ok) {
        loginError = data.error ?? 'Login failed'
        return
      }
      loggedIn = true
      playerName = data.name ?? ''
      showLogin = false
      apiKey = ''
      if (pendingVote) {
        const { id, value } = pendingVote
        pendingVote = null
        await castVote(id, value)
      }
    } catch {
      loginError = 'Network error'
    } finally {
      loginLoading = false
    }
  }

  async function logout() {
    await fetch('/api/arson/auth/logout', { method: 'POST' })
    loggedIn = false
    playerName = ''
  }
</script>

<svelte:head>
  <title>Recipe submissions — Arsonist's Ledger</title>
</svelte:head>

<main>
  <header>
    <h1>Community recipe submissions</h1>
    {#if loggedIn}
      <div class="session">
        <span>Logged in as {playerName}</span>
        <button class="link" onclick={logout}>Log out</button>
      </div>
    {:else}
      <button class="login-btn" onclick={() => (showLogin = true)}>Log in to vote</button>
    {/if}
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
    {#each submissions as s (s.id)}
      {@const recipe = parseRecipe(s.recipe)}
      <article class="submission">
        <div class="vote-col">
          <button
            class="vote-btn"
            class:active={s.yourVote === 1}
            disabled={voteBusy[s.id]}
            onclick={() => castVote(s.id, 1)}
            aria-label="Upvote"
          >
            ▲
          </button>
          <span class="score">{s.score}</span>
          <button
            class="vote-btn"
            class:active={s.yourVote === -1}
            disabled={voteBusy[s.id]}
            onclick={() => castVote(s.id, -1)}
            aria-label="Downvote"
          >
            ▼
          </button>
        </div>
        <div class="content">
          <div class="row">
            <strong>{s.scenario_name}</strong>
            <span class="status status-{s.status}">{s.status}</span>
          </div>
          <div class="row muted">
            Payout: {s.payout_min.toLocaleString()}–{s.payout_max.toLocaleString()}
          </div>
          {#if recipe}
            <div class="row"><span class="label">Place:</span> {formatItems(recipe.place)}</div>
            <div class="row"><span class="label">Ignite:</span> {formatItems(recipe.ignite)}</div>
            {#if recipe.stoke}
              <div class="row">
                <span class="label">Stoke:</span> {formatItems(recipe.stoke)}
                {#if recipe.stokeTime}({recipe.stokeTime}){/if}
              </div>
            {/if}
            {#if recipe.dampen}
              <div class="row">
                <span class="label">Dampen:</span> {formatItems(recipe.dampen)}
                {#if recipe.dampenTime}({recipe.dampenTime}){/if}
              </div>
            {/if}
          {/if}
          {#if s.status === 'approved' && s.pr_number}
            <div class="row muted">
              Approved — deploying via
              <a href={`https://github.com/NHG-Design/balaclava/pull/${s.pr_number}`} target="_blank" rel="noopener noreferrer">PR #{s.pr_number}</a>
            </div>
          {/if}
        </div>
      </article>
    {/each}
  {/if}
</main>

{#if showLogin}
  <div
    class="modal-backdrop"
    role="button"
    tabindex="-1"
    aria-label="Close dialog"
    onclick={() => (showLogin = false)}
    onkeydown={(e) => e.key === 'Escape' && (showLogin = false)}
  >
    <div
      class="modal-stop"
      role="dialog"
      aria-modal="true"
      aria-label="Log in with your Torn API key"
      tabindex="-1"
      onclick={(e) => e.stopPropagation()}
      onkeydown={(e) => e.stopPropagation()}
    >
      <form class="modal" onsubmit={submitLogin}>
        <h2>Log in with your Torn API key</h2>
        <p class="muted">
          Use a <strong>Public</strong> access key (Preferences → API). We only read your player ID
          and name to verify your identity — nothing else, and the key itself isn't stored.
        </p>
        <input type="password" bind:value={apiKey} placeholder="Torn API key" autocomplete="off" required />
        {#if loginError}
          <p class="error">{loginError}</p>
        {/if}
        <div class="modal-actions">
          <button type="button" class="link" onclick={() => (showLogin = false)}>Cancel</button>
          <button type="submit" disabled={loginLoading}>{loginLoading ? 'Checking…' : 'Log in'}</button>
        </div>
      </form>
    </div>
  </div>
{/if}

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
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
    margin-bottom: 16px;
  }
  h1 {
    font-size: 20px;
    margin: 0;
  }
  .session {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    color: oklch(70% 0.01 285);
  }
  .login-btn {
    background: oklch(30% 0.09 155);
    color: oklch(96% 0.012 95);
    border: none;
    border-radius: 6px;
    padding: 8px 14px;
    font-size: 13px;
    cursor: pointer;
  }
  .link {
    background: none;
    border: none;
    color: #7ac6ff;
    cursor: pointer;
    padding: 0;
    font-size: 12px;
  }
  .filters {
    display: flex;
    gap: 8px;
    margin-bottom: 16px;
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
    font-size: 13px;
  }
  .error {
    color: #e77;
    font-size: 13px;
  }
  .submission {
    display: flex;
    gap: 12px;
    background: oklch(20% 0.008 285);
    border: 1px solid oklch(27% 0.017 285);
    border-radius: 8px;
    padding: 12px;
    margin-bottom: 10px;
  }
  .vote-col {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    flex-shrink: 0;
    width: 36px;
  }
  .vote-btn {
    background: none;
    border: none;
    color: oklch(55% 0.008 285);
    cursor: pointer;
    font-size: 16px;
    line-height: 1;
    padding: 2px;
  }
  .vote-btn:disabled {
    opacity: 0.4;
    cursor: default;
  }
  .vote-btn.active {
    color: #6d6;
  }
  .score {
    font-size: 13px;
    font-weight: 600;
  }
  .content {
    flex: 1;
    min-width: 0;
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
  .label {
    color: oklch(58% 0.012 285);
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

  .modal-backdrop {
    position: fixed;
    inset: 0;
    background: oklch(0% 0 0 / 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
  }
  .modal {
    background: oklch(20% 0.008 285);
    border: 1px solid oklch(30% 0 0);
    border-radius: 10px;
    padding: 20px;
    width: 320px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .modal h2 {
    font-size: 15px;
    margin: 0;
  }
  .modal input {
    background: oklch(14.5% 0.011 285);
    border: 1px solid oklch(27% 0.017 285);
    color: oklch(90% 0.006 95);
    padding: 8px 10px;
    border-radius: 6px;
    font-size: 14px;
  }
  .modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    align-items: center;
  }
  .modal-actions button[type='submit'] {
    background: oklch(30% 0.09 155);
    color: oklch(96% 0.012 95);
    border: none;
    border-radius: 6px;
    padding: 8px 14px;
    font-size: 13px;
    cursor: pointer;
  }
  .modal-actions button:disabled {
    opacity: 0.5;
    cursor: default;
  }
</style>
