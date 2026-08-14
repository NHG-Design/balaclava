<script lang="ts">
  import { goto } from '$app/navigation'
  import { scale } from 'svelte/transition'
  import { quintOut } from 'svelte/easing'

  let username = $state('')
  let password = $state('')
  let error = $state('')
  let loading = $state(false)

  async function submit(e: Event) {
    e.preventDefault()
    error = ''
    loading = true
    try {
      const res = await fetch('/api/arson/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      const data = (await res.json()) as { ok?: boolean; error?: string }
      if (!res.ok || !data.ok) {
        error = data.error ?? 'Login failed'
        return
      }
      await goto('/arson/admin')
    } catch {
      error = 'Network error'
    } finally {
      loading = false
    }
  }
</script>

<svelte:head>
  <title>Admin login — Arsonist's Ledger</title>
</svelte:head>

<div class="flex min-h-screen items-center justify-center bg-ink-950 px-4">
  <form
    onsubmit={submit}
    in:scale={{ start: 0.95, duration: 220, easing: quintOut }}
    class="flex w-full max-w-sm flex-col gap-4 rounded-2xl border border-ink-700 bg-ink-900 p-8"
  >
    <div>
      <p class="text-xs font-medium tracking-wide text-accent-400 uppercase">Arsonist's Ledger</p>
      <h1 class="text-lg font-semibold text-ink-100">Admin login</h1>
    </div>

    <label class="flex flex-col gap-1.5 text-xs text-ink-400">
      Username
      <input
        type="text"
        bind:value={username}
        autocomplete="username"
        required
        class="rounded-lg border border-ink-700 bg-ink-950 px-3 py-2 text-sm text-ink-100 transition-colors outline-none focus:border-accent-400"
      />
    </label>
    <label class="flex flex-col gap-1.5 text-xs text-ink-400">
      Password
      <input
        type="password"
        bind:value={password}
        autocomplete="current-password"
        required
        class="rounded-lg border border-ink-700 bg-ink-950 px-3 py-2 text-sm text-ink-100 transition-colors outline-none focus:border-accent-400"
      />
    </label>

    {#if error}
      <p class="text-xs text-rose-400">{error}</p>
    {/if}

    <button
      type="submit"
      disabled={loading}
      class="mt-1 rounded-lg bg-accent-500 py-2.5 text-sm font-medium text-ink-950 transition-colors hover:bg-accent-400 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
    >
      {loading ? 'Signing in…' : 'Sign in'}
    </button>
  </form>
</div>
