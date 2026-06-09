import { error } from '@sveltejs/kit';

import type { SupportingRunEvidence, ScenarioProposalPatch, StoredScenarioProposal } from './types.js';

interface SubmitterRow {
    submitterId: number;
    playerId: number;
    playerName: string;
}

interface ProposalRow {
    id: string;
    scenario_name: string;
    status: string;
    created_at_utc: string;
    player_id: number;
    player_name: string;
    submitter_id: number;
    proposal_patch_json: string;
}

interface SupportingRunRow {
    proposal_id: string;
    observed_payout: number;
    is_complete_evidence: number;
    actions_json: string;
    notes: string | null;
}

export async function findActiveSubmitterByToken(
    platform: App.Platform | undefined,
    submitToken: string
): Promise<SubmitterRow | null> {
    const db = requireScenarioProposalsDb(platform);
    const tokenHash = await sha256Hex(submitToken);

    const row = await db
        .prepare(
            `SELECT
                s.id AS submitterId,
                s.player_id AS playerId,
                s.player_name AS playerName
             FROM scenario_submit_tokens t
             JOIN scenario_submitters s ON s.id = t.submitter_id
             WHERE t.token_hash = ?
               AND t.revoked_at_utc IS NULL
               AND s.is_active = 1`
        )
        .bind(tokenHash)
        .first<SubmitterRow>();

    return row ?? null;
}

export async function createScenarioProposal(
    platform: App.Platform | undefined,
    input: {
        submitterId: number;
        scenarioName: string;
        submitToken: string;
        proposalPatch: ScenarioProposalPatch;
        rawSubmission: unknown;
        supportingRun: SupportingRunEvidence;
    }
): Promise<string> {
    const db = requireScenarioProposalsDb(platform);
    const proposalId = crypto.randomUUID();
    const supportingRunId = crypto.randomUUID();
    const now = new Date().toISOString();
    const tokenHash = await sha256Hex(input.submitToken);

    await db.batch([
        db.prepare(
            `INSERT INTO scenario_proposals (
                id,
                submitter_id,
                scenario_name,
                proposal_patch_json,
                raw_submission_json,
                status,
                created_at_utc
            ) VALUES (?, ?, ?, ?, ?, 'submitted', ?)`
        ).bind(
            proposalId,
            input.submitterId,
            input.scenarioName,
            JSON.stringify(input.proposalPatch),
            JSON.stringify(input.rawSubmission),
            now
        ),
        db.prepare(
            `INSERT INTO scenario_supporting_runs (
                id,
                proposal_id,
                observed_payout,
                is_complete_evidence,
                actions_json,
                notes,
                created_at_utc
            ) VALUES (?, ?, ?, ?, ?, ?, ?)`
        ).bind(
            supportingRunId,
            proposalId,
            input.supportingRun.observedPayout,
            input.supportingRun.isCompleteEvidence ? 1 : 0,
            JSON.stringify(input.supportingRun.actions),
            input.supportingRun.notes ?? null,
            now
        ),
        db.prepare(
            `UPDATE scenario_submit_tokens
             SET last_used_at_utc = ?
             WHERE token_hash = ?`
        ).bind(now, tokenHash)
    ]);

    return proposalId;
}

export async function listScenarioProposals(platform: App.Platform | undefined): Promise<StoredScenarioProposal[]> {
    const db = requireScenarioProposalsDb(platform);
    const proposalRows = await db
        .prepare(
            `SELECT
                p.id,
                p.scenario_name,
                p.status,
                p.created_at_utc,
                p.proposal_patch_json,
                s.id AS submitter_id,
                s.player_id,
                s.player_name
             FROM scenario_proposals p
             JOIN scenario_submitters s ON s.id = p.submitter_id
             ORDER BY p.created_at_utc DESC`
        )
        .all<ProposalRow>();

    const supportingRunRows = await db
        .prepare(
            `SELECT
                proposal_id,
                observed_payout,
                is_complete_evidence,
                actions_json,
                notes
             FROM scenario_supporting_runs`
        )
        .all<SupportingRunRow>();

    const runsByProposal = new Map<string, SupportingRunEvidence[]>();
    for (const row of supportingRunRows.results ?? []) {
        const existingRuns = runsByProposal.get(row.proposal_id) ?? [];
        existingRuns.push({
            observedPayout: row.observed_payout,
            isCompleteEvidence: row.is_complete_evidence === 1,
            actions: JSON.parse(row.actions_json) as SupportingRunEvidence['actions'],
            notes: row.notes ?? null
        });
        runsByProposal.set(row.proposal_id, existingRuns);
    }

    return (proposalRows.results ?? []).map((row) => ({
        id: row.id,
        scenarioName: row.scenario_name,
        status: row.status,
        createdAtUtc: row.created_at_utc,
        submitter: {
            id: row.submitter_id,
            playerId: row.player_id,
            playerName: row.player_name
        },
        proposalPatch: JSON.parse(row.proposal_patch_json) as ScenarioProposalPatch,
        supportingRuns: runsByProposal.get(row.id) ?? []
    }));
}

function requireScenarioProposalsDb(platform: App.Platform | undefined) {
    const db = platform?.env.SCENARIO_PROPOSALS_DB;
    if (!db) {
        throw error(500, 'SCENARIO_PROPOSALS_DB binding is not configured.');
    }

    return db;
}

async function sha256Hex(value: string): Promise<string> {
    const bytes = new TextEncoder().encode(value);
    const digest = await crypto.subtle.digest('SHA-256', bytes);
    return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
}
