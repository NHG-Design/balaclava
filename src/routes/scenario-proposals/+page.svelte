<script lang="ts">
  import type { ActionBucket } from '../../lib/server/scenario-proposals/types.js';

  export let data: {
    scenarios: Array<{
      scenarioName: string;
      payout: number;
      notes: string | null;
      needsVerification: boolean;
      stokeTime: 'early' | 'late' | null;
      dampenTime: 'early' | 'late' | null;
      actions: Record<ActionBucket, string>;
    }>;
  };

  export let form:
    | {
        success?: boolean;
        message?: string;
        issues?: string[];
      }
    | undefined;

  const actionBuckets: ActionBucket[] = ['evidence', 'ignite', 'place', 'stoke', 'dampen'];
  let selectedScenarioName = data.scenarios[0]?.scenarioName ?? '';

  $: selectedScenario = data.scenarios.find((scenario) => scenario.scenarioName === selectedScenarioName) ?? null;

  function labelBucket(bucket: ActionBucket) {
    return bucket.charAt(0).toUpperCase() + bucket.slice(1);
  }
</script>

<svelte:head>
  <title>Scenario Proposal Form | Balaclava</title>
</svelte:head>

<main style="font-family: sans-serif; padding: 2rem; max-width: 1100px; margin: 0 auto;">
  <h1>Scenario Proposal Form</h1>
  <p>
    Submit proposed edits for an existing canonical <code>Scenario</code>. Git remains the source of truth; this form only writes to the
    D1-backed inbox for Yukio to review.
  </p>
  <p><a href="/scenario-proposals/admin/login">Scenario Admin inbox</a></p>

  {#if form?.message}
    <p style={`padding: 0.75rem 1rem; border-radius: 8px; ${form.success ? 'background:#e8fff1;color:#134b27;border:1px solid #9ddbb2;' : 'background:#fff5f5;color:#7a1f1f;border:1px solid #efb3b3;'}`}>
      {form.message}
    </p>
  {/if}

  {#if form?.issues?.length}
    <div style="background:#fff8e8;border:1px solid #e8c96f;border-radius:8px;padding:1rem;margin:1rem 0;">
      <strong>Submission errors</strong>
      <ul style="margin:0.75rem 0 0 1.25rem;">
        {#each form.issues as issue}
          <li>{issue}</li>
        {/each}
      </ul>
    </div>
  {/if}

  <form method="POST" style="display:grid; gap:1.5rem;">
    <section style="border:1px solid #ddd;border-radius:12px;padding:1rem;">
      <h2 style="margin-top:0;">Access</h2>
      <label style="display:grid; gap:0.35rem;">
        <span>Scenario Submit Token</span>
        <input
          name="submitToken"
          type="password"
          autocomplete="off"
          spellcheck="false"
          required
          style="padding:0.7rem;border:1px solid #bbb;border-radius:8px;"
        />
      </label>
    </section>

    <section style="border:1px solid #ddd;border-radius:12px;padding:1rem;">
      <h2 style="margin-top:0;">Canonical Scenario</h2>
      <label style="display:grid; gap:0.35rem;">
        <span>Scenario</span>
        <select bind:value={selectedScenarioName} name="scenarioName" required style="padding:0.7rem;border:1px solid #bbb;border-radius:8px;">
          {#each data.scenarios as scenario}
            <option value={scenario.scenarioName}>{scenario.scenarioName}</option>
          {/each}
        </select>
      </label>

      {#if selectedScenario}
        <div style="margin-top:1rem;background:#f8f8f8;border-radius:10px;padding:1rem;">
          <p style="margin:0 0 0.5rem;"><strong>Payout:</strong> ${selectedScenario.payout.toLocaleString()}</p>
          <p style="margin:0 0 0.5rem;"><strong>needsVerification:</strong> {selectedScenario.needsVerification ? 'true' : 'false'}</p>
          <p style="margin:0 0 0.5rem;"><strong>stokeTime:</strong> {selectedScenario.stokeTime ?? 'unset'}</p>
          <p style="margin:0 0 0.5rem;"><strong>dampenTime:</strong> {selectedScenario.dampenTime ?? 'unset'}</p>
          <p style="margin:0 0 0.5rem;"><strong>Notes:</strong> {selectedScenario.notes ?? 'none'}</p>

          <div style="display:grid; gap:0.75rem; margin-top:0.75rem;">
            {#each actionBuckets as bucket}
              <div>
                <strong>{labelBucket(bucket)}:</strong>
                <pre style="margin:0.4rem 0 0;padding:0.75rem;background:white;border:1px solid #e2e2e2;border-radius:8px;white-space:pre-wrap;">{selectedScenario.actions[bucket] || 'none'}</pre>
              </div>
            {/each}
          </div>
        </div>
      {/if}
    </section>

    <section style="border:1px solid #ddd;border-radius:12px;padding:1rem;">
      <h2 style="margin-top:0;">Proposed Canonical Changes</h2>
      <p style="margin-top:0;">Leave fields in <code>no-change</code> mode unless you intend to replace them. Action textareas use one line per item: <code>resourceId,qty</code>.</p>

      <div style="display:grid; gap:1rem; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr));">
        <label style="display:grid; gap:0.35rem;">
          <span>Proposed payout</span>
          <input name="proposalPayout" type="number" min="1" step="1" style="padding:0.7rem;border:1px solid #bbb;border-radius:8px;" />
        </label>

        <label style="display:grid; gap:0.35rem;">
          <span>needsVerification</span>
          <select name="proposalNeedsVerification" style="padding:0.7rem;border:1px solid #bbb;border-radius:8px;">
            <option value="no-change">no-change</option>
            <option value="true">true</option>
            <option value="false">false</option>
          </select>
        </label>

        <label style="display:grid; gap:0.35rem;">
          <span>stokeTime</span>
          <select name="proposalStokeTime" style="padding:0.7rem;border:1px solid #bbb;border-radius:8px;">
            <option value="no-change">no-change</option>
            <option value="early">early</option>
            <option value="late">late</option>
            <option value="clear">clear</option>
          </select>
        </label>

        <label style="display:grid; gap:0.35rem;">
          <span>dampenTime</span>
          <select name="proposalDampenTime" style="padding:0.7rem;border:1px solid #bbb;border-radius:8px;">
            <option value="no-change">no-change</option>
            <option value="early">early</option>
            <option value="late">late</option>
            <option value="clear">clear</option>
          </select>
        </label>
      </div>

      <label style="display:flex; gap:0.5rem; align-items:center; margin-top:1rem;">
        <input type="checkbox" name="proposal-notes-replace" />
        <span>Replace canonical notes</span>
      </label>
      <textarea
        name="proposalNotes"
        rows="4"
        placeholder="Leave blank with 'Replace canonical notes' checked to clear notes."
        style="width:100%;margin-top:0.5rem;padding:0.75rem;border:1px solid #bbb;border-radius:8px;"
      ></textarea>

      <div style="display:grid; gap:1rem; margin-top:1rem; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr));">
        {#each actionBuckets as bucket}
          <div style="display:grid; gap:0.5rem;">
            <label style="display:flex; gap:0.5rem; align-items:center;">
              <input type="checkbox" name={`proposal-${bucket}-replace`} />
              <span>Replace {bucket}</span>
            </label>
            <textarea
              name={`proposal-${bucket}`}
              rows="5"
              placeholder="resourceId,qty"
              style="padding:0.75rem;border:1px solid #bbb;border-radius:8px;"
            ></textarea>
          </div>
        {/each}
      </div>
    </section>

    <section style="border:1px solid #ddd;border-radius:12px;padding:1rem;">
      <h2 style="margin-top:0;">Supporting Run Evidence</h2>
      <p style="margin-top:0;">Issue #13 persists raw structured evidence in D1. Include the action buckets you actually ran and the observed payout you saw.</p>

      <div style="display:grid; gap:1rem; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr));">
        <label style="display:grid; gap:0.35rem;">
          <span>Observed payout</span>
          <input
            name="supportingRunObservedPayout"
            type="number"
            min="1"
            step="1"
            required
            style="padding:0.7rem;border:1px solid #bbb;border-radius:8px;"
          />
        </label>

        <label style="display:flex; gap:0.5rem; align-items:center;">
          <input type="checkbox" name="supportingRunIsCompleteEvidence" />
          <span>This run includes complete evidence for action-winner logic</span>
        </label>
      </div>

      <div style="display:grid; gap:1rem; margin-top:1rem; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr));">
        {#each actionBuckets as bucket}
          <label style="display:grid; gap:0.35rem;">
            <span>{labelBucket(bucket)}</span>
            <textarea
              name={`supportingRun-${bucket}`}
              rows="5"
              placeholder="resourceId,qty"
              style="padding:0.75rem;border:1px solid #bbb;border-radius:8px;"
            ></textarea>
          </label>
        {/each}
      </div>

      <label style="display:grid; gap:0.35rem; margin-top:1rem;">
        <span>Run notes</span>
        <textarea
          name="supportingRunNotes"
          rows="4"
          placeholder="Anything the Scenario Admin should know about the observed run."
          style="padding:0.75rem;border:1px solid #bbb;border-radius:8px;"
        ></textarea>
      </label>
    </section>

    <button type="submit" style="padding:0.9rem 1.2rem;border:none;border-radius:10px;background:#111;color:white;font-weight:700;cursor:pointer;">
      Submit Scenario Proposal
    </button>
  </form>
</main>
