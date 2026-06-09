import { CATALOG, type ResourceId } from '../../../data/catalog.js';
import { SCENARIOS, type ActionItem, type Scenario } from '../../../data/scenarios.js';
import {
    ACTION_BUCKETS,
    type ActionBucket,
    type ParsedScenarioProposalSubmission,
    type ScenarioProposalPatch,
    type SupportingRunEvidence,
    type TimingValue
} from './types.js';

export class ScenarioProposalFormError extends Error {
    readonly issues: string[];

    constructor(issues: string[]) {
        super('Scenario proposal validation failed.');
        this.issues = issues;
    }
}

export function formatActionItems(items?: ActionItem[]): string {
    return (items ?? []).map((item) => `${item.resourceId},${item.qty}`).join('\n');
}

export function parseScenarioProposalSubmission(formData: FormData): ParsedScenarioProposalSubmission {
    const issues: string[] = [];
    const scenarioName = getTrimmedString(formData, 'scenarioName');
    const submitToken = getTrimmedString(formData, 'submitToken');

    if (!scenarioName) {
        issues.push('Scenario is required.');
    } else if (!SCENARIOS.some((scenario) => scenario.scenarioName === scenarioName)) {
        issues.push(`Scenario "${scenarioName}" does not exist in the canonical Scenario Dataset.`);
    }

    if (!submitToken) {
        issues.push('Scenario Submit Token is required.');
    }

    const proposalPatch = parseProposalPatch(formData, issues);
    const supportingRun = parseSupportingRun(formData, issues);

    if (issues.length > 0) {
        throw new ScenarioProposalFormError(issues);
    }

    return {
        scenarioName,
        submitToken,
        proposalPatch,
        supportingRun,
        rawSubmission: {
            scenarioName,
            proposalPatch,
            supportingRun
        }
    };
}

export function buildScenarioFormCatalog() {
    return SCENARIOS.map((scenario) => ({
        scenarioName: scenario.scenarioName,
        payout: scenario.payout,
        notes: scenario.notes ?? null,
        needsVerification: scenario.needsVerification ?? false,
        stokeTime: scenario.actions.stokeTime ?? null,
        dampenTime: scenario.actions.dampenTime ?? null,
        actions: {
            evidence: formatActionItems(scenario.actions.evidence),
            ignite: formatActionItems(scenario.actions.ignite),
            place: formatActionItems(scenario.actions.place),
            stoke: formatActionItems(scenario.actions.stoke),
            dampen: formatActionItems(scenario.actions.dampen)
        }
    }));
}

function parseProposalPatch(formData: FormData, issues: string[]): ScenarioProposalPatch {
    const proposalPatch: ScenarioProposalPatch = {};
    const proposalActions: Partial<Record<ActionBucket, ActionItem[]>> = {};

    const payoutInput = getTrimmedString(formData, 'proposalPayout');
    if (payoutInput) {
        const payout = Number.parseInt(payoutInput, 10);
        if (!Number.isInteger(payout) || payout <= 0) {
            issues.push('Proposed payout must be a positive whole number.');
        } else {
            proposalPatch.payout = payout;
        }
    }

    for (const bucket of ACTION_BUCKETS) {
        if (formData.get(`proposal-${bucket}-replace`) !== 'on') continue;
        proposalActions[bucket] = parseActionItems(getTrimmedString(formData, `proposal-${bucket}`), `proposal ${bucket}`, issues);
    }

    if (Object.keys(proposalActions).length > 0) {
        proposalPatch.actions = proposalActions;
    }

    const stokeTime = parseTimingField(getTrimmedString(formData, 'proposalStokeTime'), 'stokeTime', issues);
    if (stokeTime !== undefined) proposalPatch.stokeTime = stokeTime;

    const dampenTime = parseTimingField(getTrimmedString(formData, 'proposalDampenTime'), 'dampenTime', issues);
    if (dampenTime !== undefined) proposalPatch.dampenTime = dampenTime;

    const needsVerification = getTrimmedString(formData, 'proposalNeedsVerification');
    if (needsVerification === 'true') proposalPatch.needsVerification = true;
    else if (needsVerification === 'false') proposalPatch.needsVerification = false;
    else if (needsVerification && needsVerification !== 'no-change') issues.push('needsVerification must be no-change, true, or false.');

    if (formData.get('proposal-notes-replace') === 'on') {
        proposalPatch.notes = getTrimmedString(formData, 'proposalNotes') || null;
    }

    if (Object.keys(proposalPatch).length === 0) {
        issues.push('Proposal must include at least one canonical field change.');
    }

    return proposalPatch;
}

function parseSupportingRun(formData: FormData, issues: string[]): SupportingRunEvidence {
    const observedPayoutInput = getTrimmedString(formData, 'supportingRunObservedPayout');
    const observedPayout = Number.parseInt(observedPayoutInput, 10);
    if (!observedPayoutInput || !Number.isInteger(observedPayout) || observedPayout <= 0) {
        issues.push('Supporting run observed payout must be a positive whole number.');
    }

    const actions: Partial<Record<ActionBucket, ActionItem[]>> = {};
    for (const bucket of ACTION_BUCKETS) {
        const items = parseActionItems(getTrimmedString(formData, `supportingRun-${bucket}`), `supporting run ${bucket}`, issues);
        if (items.length > 0) {
            actions[bucket] = items;
        }
    }

    if (Object.keys(actions).length === 0) {
        issues.push('Supporting run evidence must include at least one action bucket.');
    }

    return {
        observedPayout: Number.isInteger(observedPayout) && observedPayout > 0 ? observedPayout : 0,
        isCompleteEvidence: formData.get('supportingRunIsCompleteEvidence') === 'on',
        actions,
        notes: getTrimmedString(formData, 'supportingRunNotes') || null
    };
}

function parseActionItems(value: string, label: string, issues: string[]): ActionItem[] {
    if (!value) return [];

    const lines = value
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean);

    const items: ActionItem[] = [];

    for (const line of lines) {
        const [resourceIdRaw, qtyRaw, ...rest] = line.split(',').map((part) => part.trim());
        if (rest.length > 0 || !resourceIdRaw || !qtyRaw) {
            issues.push(`Each ${label} line must use "resourceId,qty". Invalid line: "${line}".`);
            continue;
        }

        if (!(resourceIdRaw in CATALOG)) {
            issues.push(`Unknown resourceId "${resourceIdRaw}" in ${label}.`);
            continue;
        }

        const qty = Number.parseInt(qtyRaw, 10);
        if (!Number.isInteger(qty) || qty <= 0) {
            issues.push(`Quantity for ${label} must be a positive whole number. Invalid line: "${line}".`);
            continue;
        }

        items.push({
            resourceId: resourceIdRaw as ResourceId,
            qty
        });
    }

    return items;
}

function parseTimingField(value: string, label: string, issues: string[]): TimingValue | null | undefined {
    if (!value || value === 'no-change') return undefined;
    if (value === 'clear') return null;
    if (value === 'early' || value === 'late') return value;
    issues.push(`${label} must be no-change, early, late, or clear.`);
    return undefined;
}

function getTrimmedString(formData: FormData, key: string): string {
    const value = formData.get(key);
    return typeof value === 'string' ? value.trim() : '';
}
