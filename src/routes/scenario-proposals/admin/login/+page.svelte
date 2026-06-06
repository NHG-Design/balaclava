<script lang="ts">
  export let form:
    | {
        message?: string;
      }
    | undefined;
</script>

<svelte:head>
  <title>Scenario Admin Login | Balaclava</title>
</svelte:head>

<main style="font-family: sans-serif; padding: 2rem; max-width: 480px; margin: 0 auto;">
  <h1>Scenario Admin Login</h1>
  <p>Authenticate with the single Scenario Admin credential pair configured in Cloudflare secrets.</p>

  {#if form?.message}
    <p style="padding:0.75rem 1rem;border-radius:8px;background:#fff5f5;color:#7a1f1f;border:1px solid #efb3b3;">
      {form.message}
    </p>
  {/if}

  <form method="POST" style="display:grid; gap:1rem; margin-top:1rem;">
    <label style="display:grid; gap:0.35rem;">
      <span>Username</span>
      <input name="username" autocomplete="username" required style="padding:0.7rem;border:1px solid #bbb;border-radius:8px;" />
    </label>

    <label style="display:grid; gap:0.35rem;">
      <span>Password</span>
      <input name="password" type="password" autocomplete="current-password" required style="padding:0.7rem;border:1px solid #bbb;border-radius:8px;" />
    </label>

    <button type="submit" style="padding:0.9rem 1.2rem;border:none;border-radius:10px;background:#111;color:white;font-weight:700;cursor:pointer;">
      Sign in
    </button>
  </form>
</main>
