<svelte:head>
  <title>Balaclava Spike</title>
</svelte:head>

<main style="font-family: sans-serif; padding: 2rem;">
  <h1>Balaclava — SvelteKit + Cloudflare Workers Spike</h1>
  <p>
    Image endpoint: <a href="/api/sig">/api/sig</a>
  </p>
  <img
    src="/api/sig"
    alt="Live signature"
    width="600"
    height="100"
    style="display: block; margin-top: 1.5rem; border-radius: 8px;"
  />
</main>
