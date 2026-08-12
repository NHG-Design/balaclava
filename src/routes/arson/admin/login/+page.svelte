<script lang="ts">
  import { goto } from '$app/navigation'

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
      const data = await res.json() as { ok?: boolean; error?: string }
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

<main>
  <form onsubmit={submit}>
    <h1>Admin login</h1>
    <label>
      Username
      <input type="text" bind:value={username} autocomplete="username" required />
    </label>
    <label>
      Password
      <input type="password" bind:value={password} autocomplete="current-password" required />
    </label>
    {#if error}
      <p class="error">{error}</p>
    {/if}
    <button type="submit" disabled={loading}>{loading ? 'Signing in…' : 'Sign in'}</button>
  </form>
</main>

<style>
  main {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background: oklch(14% 0.01 260);
    font-family: system-ui, sans-serif;
  }
  form {
    display: flex;
    flex-direction: column;
    gap: 12px;
    width: 280px;
    padding: 24px;
    background: oklch(20% 0.008 285);
    border: 1px solid oklch(30% 0 0);
    border-radius: 10px;
  }
  h1 {
    font-size: 18px;
    color: oklch(96% 0.012 95);
    margin: 0 0 4px;
  }
  label {
    display: flex;
    flex-direction: column;
    gap: 4px;
    font-size: 12px;
    color: oklch(70% 0.01 285);
  }
  input {
    background: oklch(14.5% 0.011 285);
    border: 1px solid oklch(27% 0.017 285);
    color: oklch(90% 0.006 95);
    padding: 8px 10px;
    border-radius: 6px;
    font-size: 14px;
  }
  input:focus-visible {
    outline: none;
    border-color: #6d6;
  }
  button {
    margin-top: 8px;
    background: oklch(30% 0.09 155);
    border: none;
    color: oklch(96% 0.012 95);
    padding: 10px;
    border-radius: 6px;
    font-size: 14px;
    cursor: pointer;
  }
  button:disabled {
    opacity: 0.5;
    cursor: default;
  }
  .error {
    color: #e77;
    font-size: 12px;
    margin: 0;
  }
</style>
