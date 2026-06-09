<script lang="ts">
  import type { StoredScenarioProposal } from '../../../lib/server/scenario-proposals/types.js';

  export let data: {
    scenarioAdminUsername: string;
    proposals: StoredScenarioProposal[];
  };

  function formatJson(value: unknown) {
    return JSON.stringify(value, null, 2);
  }
</script>

<svelte:head>
  <title>Scenario Proposal Inbox | Balaclava</title>
</svelte:head>

<main style="font-family: sans-serif; padding: 2rem; max-width: 1100px; margin: 0 auto;">
  <div style="display:flex; justify-content:space-between; gap:1rem; align-items:flex-start; flex-wrap:wrap;">
    <div>
      <h1 style="margin-bottom:0.4rem;">Scenario Proposal Inbox</h1>
      <p style="margin-top:0;">Signed in as <strong>{data.scenarioAdminUsername}</strong>. This issue-13 slice shows the raw D1 inbox before grouping and PR write-back.</p>
    </div>

    <form method="POST">
      <button type="submit" name="/logout" formaction="?/logout" style="padding:0.8rem 1rem;border:1px solid #333;border-radius:10px;background:white;cursor:pointer;">
        Sign out
      </button>
    </form>
  </div>

  <p><a href="/scenario-proposals">Open submitter form</a></p>

  {#if data.proposals.length === 0}
    <p style="padding:1rem;border:1px dashed #bbb;border-radius:10px;">No proposals stored yet.</p>
  {:else}
    <div style="display:grid; gap:1rem;">
      {#each data.proposals as proposal}
        <article style="border:1px solid #ddd;border-radius:12px;padding:1rem;">
          <div style="display:flex;justify-content:space-between;gap:1rem;flex-wrap:wrap;">
            <div>
              <h2 style="margin:0 0 0.4rem;">{proposal.scenarioName}</h2>
              <p style="margin:0;"><strong>Status:</strong> {proposal.status}</p>
              <p style="margin:0;"><strong>Created:</strong> {proposal.createdAtUtc}</p>
              <p style="margin:0;"><strong>Submitter:</strong> {proposal.submitter.playerName} ({proposal.submitter.playerId})</p>
            </div>
            <p style="margin:0;"><strong>Proposal ID:</strong> <code>{proposal.id}</code></p>
          </div>

          <div style="display:grid; gap:1rem; grid-template-columns:repeat(auto-fit, minmax(300px, 1fr)); margin-top:1rem;">
            <div>
              <h3 style="margin-top:0;">Proposed canonical patch</h3>
              <pre style="margin:0;padding:0.75rem;background:#f8f8f8;border:1px solid #e2e2e2;border-radius:8px;white-space:pre-wrap;">{formatJson(proposal.proposalPatch)}</pre>
            </div>

            <div>
              <h3 style="margin-top:0;">Supporting runs</h3>
              {#each proposal.supportingRuns as supportingRun, index}
                <div style="margin-bottom:0.75rem;">
                  <p style="margin:0 0 0.35rem;"><strong>Run {index + 1}:</strong> payout ${supportingRun.observedPayout.toLocaleString()} • complete evidence {supportingRun.isCompleteEvidence ? 'yes' : 'no'}</p>
                  <pre style="margin:0;padding:0.75rem;background:#f8f8f8;border:1px solid #e2e2e2;border-radius:8px;white-space:pre-wrap;">{formatJson(supportingRun)}</pre>
                </div>
              {/each}
            </div>
          </div>
        </article>
      {/each}
    </div>
  {/if}
</main>
