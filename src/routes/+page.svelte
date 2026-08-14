<svelte:head>
  <title>Balaclava</title>
</svelte:head>

<main class="mx-auto max-w-2xl px-8 py-12 text-ink-100">
  <h1 class="text-2xl font-semibold">Balaclava</h1>

  <h2 class="mt-8 text-base font-semibold text-ink-100">Personal Signatures</h2>
  <p class="mt-2 text-sm">
    <a href="/api/sigs/906148" class="text-accent-500 hover:underline">/api/sigs/906148</a> (Yukio)
  </p>
  <img
    src="/api/sigs/906148"
    alt="Yukio signature"
    width="600"
    height="100"
    class="mt-4 block rounded-lg"
  />

  <p class="mt-6 text-sm">
    <a href="/api/sigs/2665568" class="text-accent-500 hover:underline">/api/sigs/2665568</a> (LeLeMiC)
  </p>
  <img
    src="/api/sigs/2665568"
    alt="LeLeMiC signature"
    width="600"
    height="100"
    class="mt-4 block rounded-lg"
  />

  <h2 class="mt-8 text-base font-semibold text-ink-100">Faction Signatures</h2>
  <p class="mt-2 text-sm">
    <code class="rounded bg-ink-800 px-1.5 py-0.5 text-xs">
      /api/faction/[id]?user=[userId]&amp;stats=attackswon,defendswon&amp;align=center&amp;rounded=true&amp;factionLogo=true&amp;daysInFaction=true
    </code>
  </p>

  <h2 class="mt-8 text-base font-semibold text-ink-100">Arsonist's Ledger</h2>
  <p class="mt-2 text-sm">
    <a href="/arson/submissions" class="text-accent-500 hover:underline">Community recipe submissions</a>
    — browse payout/material recipes other players have submitted.
  </p>
</main>
