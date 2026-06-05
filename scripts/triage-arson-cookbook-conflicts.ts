import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

import { SCENARIOS, type ActionItem, type Scenario } from '../src/data/scenarios.js';

type TriageDecision = 'apply_action' | 'apply_payout' | 'discard' | 'hold';

interface CliOptions {
    actionMaxPayoutDropPct: number;
    actionMinPpnLiftPct: number;
    outputDir: string;
    payoutThresholdPct: number;
    report: string | null;
    reportDir: string;
    writeReport: boolean;
}

interface ReportStep {
    actionType: 'dampen' | 'place' | 'stoke';
    qty: number;
    resourceId: string | null;
    timing: string | null;
    unknown: boolean;
}

interface ReportVariant {
    cost: number;
    nerve: number;
    profitPerNerve: number;
    recipeActions: {
        dampen: ReportStep[];
        place: ReportStep[];
        stoke: ReportStep[];
    };
    reward: number;
    scenarioName: string;
    source: string;
}

interface ConflictMatch {
    current: {
        currentPayout: number;
        currentPpn: number;
        currentRecipe: string[];
    };
    scenarioName: string;
    variants: ReportVariant[];
}

interface CookbookReport {
    comparedAtUtc: string;
    conflictMatches: ConflictMatch[];
}

interface VariantAssessment {
    actionChanges: string[];
    actionMatch: boolean;
    actionUnknown: boolean;
    payoutDeltaPct: number;
    ppnDeltaPct: number;
    reward: number;
    source: string;
    variant: ReportVariant;
}

interface TriageEntry {
    currentPayout: number;
    currentPpn: number;
    decision: TriageDecision;
    reasons: string[];
    scenarioName: string;
    selectedSource: string | null;
    selectedVariant: {
        actionChanges: string[];
        actionMatch: boolean;
        actionUnknown: boolean;
        payoutDeltaPct: number;
        ppnDeltaPct: number;
        recipeActions: ReportVariant['recipeActions'];
        reward: number;
        source: string;
    } | null;
    variants: Array<{
        actionChanges: string[];
        actionMatch: boolean;
        actionUnknown: boolean;
        payoutDeltaPct: number;
        ppnDeltaPct: number;
        reward: number;
        source: string;
    }>;
}

interface TriageReport {
    comparedAtUtc: string;
    generatedAtUtc: string;
    rules: {
        actionMaxPayoutDropPct: number;
        actionMinPpnLiftPct: number;
        payoutThresholdPct: number;
    };
    summary: {
        applyAction: number;
        applyPayout: number;
        discard: number;
        hold: number;
        total: number;
    };
    entries: TriageEntry[];
}

const DEFAULT_REPORT_DIR = path.join('reports', 'userscripts', 'arsonists-ledger');
const DEFAULT_OUTPUT_DIR = path.join('reports', 'userscripts', 'arsonists-ledger');

function printHelp(): void {
    console.log([
        'Usage: pnpm exec tsx scripts/triage-arson-cookbook-conflicts.ts [options]',
        '',
        'Options:',
        '  --report <path>                Use a specific .cookbooks.json report.',
        `  --report-dir <path>            Directory to search for the latest .cookbooks.json report. Default: ${DEFAULT_REPORT_DIR}`,
        `  --output-dir <path>            Output directory for triage report. Default: ${DEFAULT_OUTPUT_DIR}`,
        '  --payout-threshold-pct <n>     Minimum payout delta percent for payout-only updates. Default: 15',
        '  --action-max-payout-drop-pct <n>  Maximum allowed payout drop percent for action changes. Default: 15',
        '  --action-min-ppn-lift-pct <n>  Minimum PPN lift percent to justify an action change that lowers payout. Default: 10',
        '  --no-write-report              Print summary only; do not write JSON report artifact.',
        '  --help                         Show this message.',
    ].join('\n'));
}

function parseArgs(argv: string[]): CliOptions {
    let report: string | null = null;
    let reportDir = DEFAULT_REPORT_DIR;
    let outputDir = DEFAULT_OUTPUT_DIR;
    let payoutThresholdPct = 15;
    let actionMaxPayoutDropPct = 15;
    let actionMinPpnLiftPct = 10;
    let writeReport = true;

    for (let i = 0; i < argv.length; i++) {
        const arg = argv[i];
        if (arg === '--help') {
            printHelp();
            process.exit(0);
        }
        if (arg === '--report') {
            report = argv[++i] ?? null;
            if (!report) throw new Error('`--report` requires a path.');
            continue;
        }
        if (arg === '--report-dir') {
            reportDir = argv[++i] ?? '';
            if (!reportDir) throw new Error('`--report-dir` requires a path.');
            continue;
        }
        if (arg === '--output-dir') {
            outputDir = argv[++i] ?? '';
            if (!outputDir) throw new Error('`--output-dir` requires a path.');
            continue;
        }
        if (arg === '--payout-threshold-pct') {
            payoutThresholdPct = Number(argv[++i]);
            continue;
        }
        if (arg === '--action-max-payout-drop-pct') {
            actionMaxPayoutDropPct = Number(argv[++i]);
            continue;
        }
        if (arg === '--action-min-ppn-lift-pct') {
            actionMinPpnLiftPct = Number(argv[++i]);
            continue;
        }
        if (arg === '--no-write-report') {
            writeReport = false;
            continue;
        }
        throw new Error(`Unknown argument: ${arg}`);
    }

    return {
        actionMaxPayoutDropPct,
        actionMinPpnLiftPct,
        outputDir,
        payoutThresholdPct,
        report,
        reportDir,
        writeReport,
    };
}

function latestCookbookReportPath(reportDir: string): string {
    const candidates = readdirSync(reportDir)
        .filter((name) => name.endsWith('.cookbooks.json'))
        .sort()
        .reverse();

    if (candidates.length === 0) {
        throw new Error(`No cookbook reports found in ${reportDir}`);
    }

    return path.join(reportDir, candidates[0]);
}

function normalizeActionItems(items: ActionItem[] | undefined): Array<{ qty: number; resourceId: string }> {
    const merged = new Map<string, number>();

    for (const item of items ?? []) {
        if (item.optional) continue;
        merged.set(item.resourceId, (merged.get(item.resourceId) ?? 0) + item.qty);
    }

    return [...merged.entries()]
        .map(([resourceId, qty]) => ({ qty, resourceId }))
        .sort((a, b) => a.resourceId.localeCompare(b.resourceId));
}

function normalizeVariantSteps(steps: ReportStep[]): { items: Array<{ qty: number; resourceId: string }>; unknown: boolean } {
    const merged = new Map<string, number>();
    let unknown = false;

    for (const step of steps) {
        if (!step.resourceId || step.unknown) {
            unknown = true;
            continue;
        }
        merged.set(step.resourceId, (merged.get(step.resourceId) ?? 0) + step.qty);
    }

    return {
        items: [...merged.entries()]
            .map(([resourceId, qty]) => ({ qty, resourceId }))
            .sort((a, b) => a.resourceId.localeCompare(b.resourceId)),
        unknown,
    };
}

function actionChangesForScenario(current: Scenario, variant: ReportVariant): string[] {
    const currentBuckets = {
        place: normalizeActionItems(current.actions.place),
        stoke: normalizeActionItems(current.actions.stoke),
        dampen: normalizeActionItems(current.actions.dampen),
    };
    const variantBuckets = {
        place: normalizeVariantSteps(variant.recipeActions.place),
        stoke: normalizeVariantSteps(variant.recipeActions.stoke),
        dampen: normalizeVariantSteps(variant.recipeActions.dampen),
    };

    const changes: string[] = [];
    for (const key of ['place', 'stoke', 'dampen'] as const) {
        if (variantBuckets[key].unknown) {
            changes.push(`${key}:unknown`);
            continue;
        }
        if (JSON.stringify(currentBuckets[key]) !== JSON.stringify(variantBuckets[key].items)) {
            changes.push(key);
        }
    }
    return changes;
}

function assessVariant(current: Scenario, match: ConflictMatch, variant: ReportVariant): VariantAssessment {
    const actionChanges = actionChangesForScenario(current, variant);
    const actionUnknown = actionChanges.some((change) => change.endsWith(':unknown'));
    const actionMatch = actionChanges.length === 0;
    const payoutDeltaPct = match.current.currentPayout === 0
        ? 0
        : ((variant.reward - match.current.currentPayout) / match.current.currentPayout) * 100;
    const ppnDeltaPct = match.current.currentPpn === 0
        ? 0
        : ((variant.profitPerNerve - match.current.currentPpn) / match.current.currentPpn) * 100;

    return {
        actionChanges,
        actionMatch,
        actionUnknown,
        payoutDeltaPct,
        ppnDeltaPct,
        reward: variant.reward,
        source: variant.source,
        variant,
    };
}

function chooseDecision(assessments: VariantAssessment[], options: CliOptions): { decision: TriageDecision; reasons: string[]; selected: VariantAssessment | null } {
    const reasons: string[] = [];
    const recipeMatches = assessments
        .filter((item) => item.actionMatch)
        .sort((a, b) => b.reward - a.reward || b.ppnDeltaPct - a.ppnDeltaPct);
    const payoutOnly = recipeMatches
        .filter((item) => item.payoutDeltaPct > options.payoutThresholdPct);

    const actionCandidates = assessments
        .filter((item) => !item.actionMatch && !item.actionUnknown)
        .filter((item) => item.payoutDeltaPct >= -options.actionMaxPayoutDropPct)
        .filter((item) => item.payoutDeltaPct >= 0 || item.ppnDeltaPct >= options.actionMinPpnLiftPct)
        .sort((a, b) => {
            if (b.ppnDeltaPct !== a.ppnDeltaPct) return b.ppnDeltaPct - a.ppnDeltaPct;
            return b.reward - a.reward;
        });

    if (actionCandidates.length > 0) {
        const [best, second] = actionCandidates;
        const incumbentRecipe = recipeMatches[0];
        if (incumbentRecipe && incumbentRecipe.reward >= best.reward) {
            reasons.push('current-matching cookbook variant already matches or beats the best action-change payout');
            if (incumbentRecipe.payoutDeltaPct > options.payoutThresholdPct) {
                reasons.push(`matching recipe payout exceeds ${options.payoutThresholdPct}% threshold`);
                return { decision: 'apply_payout', reasons, selected: incumbentRecipe };
            }
            return { decision: 'hold', reasons, selected: null };
        }
        if (!second) {
            reasons.push('single viable action-change candidate');
            return { decision: 'apply_action', reasons, selected: best };
        }
        if (best.ppnDeltaPct >= second.ppnDeltaPct + 10 || best.reward >= second.reward + Math.max(10_000, second.reward * 0.1)) {
            reasons.push('best action-change candidate clearly beats the next viable alternative');
            return { decision: 'apply_action', reasons, selected: best };
        }
        reasons.push('multiple viable action-change candidates remain too close to choose automatically');
        return { decision: 'hold', reasons, selected: null };
    }

    if (payoutOnly.length > 0) {
        reasons.push(`payout-only candidate exceeds ${options.payoutThresholdPct}% threshold`);
        return { decision: 'apply_payout', reasons, selected: payoutOnly[0]! };
    }

    if (assessments.every((item) => item.actionUnknown || item.payoutDeltaPct <= -options.actionMaxPayoutDropPct)) {
        reasons.push('all cookbook variants are noisy or materially worse than current');
        return { decision: 'discard', reasons, selected: null };
    }

    reasons.push('no candidate satisfies the stricter auto-apply rules');
    return { decision: 'hold', reasons, selected: null };
}

function buildTriageReport(report: CookbookReport, options: CliOptions): TriageReport {
    const currentByName = new Map(SCENARIOS.map((scenario) => [scenario.scenarioName, scenario]));
    const entries: TriageEntry[] = [];

    for (const match of report.conflictMatches) {
        const current = currentByName.get(match.scenarioName);
        if (!current) continue;

        const assessments = match.variants.map((variant) => assessVariant(current, match, variant));
        const { decision, reasons, selected } = chooseDecision(assessments, options);
        entries.push({
            currentPayout: match.current.currentPayout,
            currentPpn: match.current.currentPpn,
            decision,
            reasons,
            scenarioName: match.scenarioName,
            selectedSource: selected?.source ?? null,
            selectedVariant: selected ? {
                actionChanges: selected.actionChanges,
                actionMatch: selected.actionMatch,
                actionUnknown: selected.actionUnknown,
                payoutDeltaPct: selected.payoutDeltaPct,
                ppnDeltaPct: selected.ppnDeltaPct,
                recipeActions: selected.variant.recipeActions,
                reward: selected.reward,
                source: selected.source,
            } : null,
            variants: assessments.map((item) => ({
                actionChanges: item.actionChanges,
                actionMatch: item.actionMatch,
                actionUnknown: item.actionUnknown,
                payoutDeltaPct: item.payoutDeltaPct,
                ppnDeltaPct: item.ppnDeltaPct,
                reward: item.reward,
                source: item.source,
            })),
        });
    }

    entries.sort((a, b) => {
        const rank = (decision: TriageDecision): number => ({
            apply_action: 0,
            apply_payout: 1,
            hold: 2,
            discard: 3,
        })[decision];
        if (rank(a.decision) !== rank(b.decision)) return rank(a.decision) - rank(b.decision);
        return a.scenarioName.localeCompare(b.scenarioName);
    });

    return {
        comparedAtUtc: report.comparedAtUtc,
        generatedAtUtc: new Date().toISOString(),
        rules: {
            actionMaxPayoutDropPct: options.actionMaxPayoutDropPct,
            actionMinPpnLiftPct: options.actionMinPpnLiftPct,
            payoutThresholdPct: options.payoutThresholdPct,
        },
        summary: {
            applyAction: entries.filter((entry) => entry.decision === 'apply_action').length,
            applyPayout: entries.filter((entry) => entry.decision === 'apply_payout').length,
            discard: entries.filter((entry) => entry.decision === 'discard').length,
            hold: entries.filter((entry) => entry.decision === 'hold').length,
            total: entries.length,
        },
        entries,
    };
}

function printSummary(report: TriageReport): void {
    console.log([
        `Conflict triage total: ${report.summary.total}`,
        `Apply action: ${report.summary.applyAction}`,
        `Apply payout: ${report.summary.applyPayout}`,
        `Hold: ${report.summary.hold}`,
        `Discard: ${report.summary.discard}`,
    ].join('\n'));
}

function writeReport(outputDir: string, report: TriageReport): string {
    mkdirSync(outputDir, { recursive: true });
    const stamp = report.generatedAtUtc.replace(/[:.]/g, '-');
    const filePath = path.join(outputDir, `${stamp}.cookbook-conflicts.json`);
    writeFileSync(filePath, `${JSON.stringify(report, null, 2)}\n`);
    return filePath;
}

const options = parseArgs(process.argv.slice(2));
const reportPath = options.report ?? latestCookbookReportPath(options.reportDir);
const report = JSON.parse(readFileSync(reportPath, 'utf8')) as CookbookReport;
const triage = buildTriageReport(report, options);
printSummary(triage);

if (options.writeReport) {
    const filePath = writeReport(options.outputDir, triage);
    console.log(`\nWrote triage report: ${filePath}`);
}
