import type { ActionItem, ScenarioActions } from '../../../data/scenarios.js';

export const ACTION_BUCKETS = ['evidence', 'ignite', 'place', 'stoke', 'dampen'] as const;

export type ActionBucket = (typeof ACTION_BUCKETS)[number];
export type TimingValue = NonNullable<ScenarioActions['stokeTime']>;

export interface ScenarioProposalPatch {
    payout?: number;
    actions?: Partial<Record<ActionBucket, ActionItem[]>>;
    stokeTime?: TimingValue | null;
    dampenTime?: TimingValue | null;
    needsVerification?: boolean;
    notes?: string | null;
}

export interface SupportingRunEvidence {
    observedPayout: number;
    isCompleteEvidence: boolean;
    actions: Partial<Record<ActionBucket, ActionItem[]>>;
    notes?: string | null;
}

export interface ParsedScenarioProposalSubmission {
    scenarioName: string;
    submitToken: string;
    proposalPatch: ScenarioProposalPatch;
    supportingRun: SupportingRunEvidence;
    rawSubmission: {
        scenarioName: string;
        proposalPatch: ScenarioProposalPatch;
        supportingRun: SupportingRunEvidence;
    };
}

export interface StoredScenarioProposal {
    id: string;
    scenarioName: string;
    status: string;
    createdAtUtc: string;
    submitter: {
        id: number;
        playerId: number;
        playerName: string;
    };
    proposalPatch: ScenarioProposalPatch;
    supportingRuns: SupportingRunEvidence[];
}
