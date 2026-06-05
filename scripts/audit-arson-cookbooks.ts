import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

import { CATALOG } from '../src/data/catalog.js';
import type { ResourceId } from '../src/data/catalog.js';
import { OBSERVED_PAYOUTS } from '../src/data/scenario-observations.js';
import { calcMaterialCost, calcNerve, calcProfitPerNerve } from '../src/userscripts/arsonists-ledger/engine.js';
import { SCENARIOS, type ActionItem, type Scenario } from '../src/data/scenarios.js';

type SourceLabel = 'cookbook-1' | 'cookbook-2';
type SupportStatus = 'supported' | 'unsupported' | 'missing';
type Recommendation = 'add_missing' | 'investigate_conflict' | 'validate_consensus' | 'validate_payout_only';

interface CliOptions {
    csvPaths: string[];
    reportDir: string;
    writeReport: boolean;
}

interface CsvRow {
    Cost: string;
    Dampen: string;
    Ignite: string;
    Location: string;
    Nerve: string;
    Place: string;
    Profit: string;
    'Profit/Nerve': string;
    Reward: string;
    Stoke: string;
    Story: string;
}

interface CookbookVariant {
    cost: number;
    dampen: string;
    ignite: string;
    location: string;
    nerve: number;
    place: string;
    profit: number;
    profitPerNerve: number;
    recipeActions: ParsedRecipeActions;
    recipeSignature: string;
    reward: number;
    scenarioName: string;
    source: SourceLabel;
    stoke: string;
}

interface ParsedRecipeActions {
    dampen: ParsedCookbookStep[];
    place: ParsedCookbookStep[];
    stoke: ParsedCookbookStep[];
}

interface ParsedCookbookStep {
    actionType: 'dampen' | 'place' | 'stoke';
    itemName: string;
    qty: number;
    resourceId: ResourceId | null;
    timing: string | null;
    unknown: boolean;
}

interface CurrentScenarioSummary {
    currentBestKnownPayout: number;
    currentMaterialCost: number;
    currentObservedPayoutMax: number | null;
    currentPayout: number;
    currentPpn: number;
    currentRecipe: string[];
    currentSupportStatus: SupportStatus;
    currentTotalNerve: number;
    igniter: string;
    needsVerification: boolean;
}

interface ScenarioComparison {
    consensusRecipe: boolean;
    current: CurrentScenarioSummary;
    locations: string[];
    recommendation: Recommendation;
    scenarioName: string;
    supportStatus: SupportStatus;
    variants: CookbookVariant[];
}

interface ReportPayload {
    comparedAtUtc: string;
    csvPaths: string[];
    summary: {
        conflictMatches: number;
        consensusNoopMatches: number;
        consensusUpdateMatches: number;
        missingScenarioCandidates: number;
        totalCookbookScenarios: number;
        totalVariants: number;
        unsupportedCurrentMatches: number;
    };
    conflictMatches: ScenarioComparison[];
    consensusNoopMatches: ScenarioComparison[];
    consensusUpdateMatches: ScenarioComparison[];
    missingScenarioCandidates: ScenarioComparison[];
    unsupportedCurrentMatches: ScenarioComparison[];
}

const DEFAULT_CSVS = [
    path.join('plans', 'arson', 'scenarios', 'arson_cookbook-1.csv'),
    path.join('plans', 'arson', 'scenarios', 'arson_cookbook-2.csv'),
];
const DEFAULT_REPORT_DIR = path.join('reports', 'userscripts', 'arsonists-ledger');

const RESOURCE_BY_NAME = new Map<string, ResourceId>(
    Object.values(CATALOG).map((resource) => [normalizeName(resource.name), resource.id]),
);

function printHelp(): void {
    console.log([
        'Usage: pnpm exec tsx scripts/audit-arson-cookbooks.ts [options]',
        '',
        'Options:',
        '  --csv <path>          Add a cookbook CSV. May be specified multiple times.',
        `  --report-dir <path>   Report output directory. Default: ${DEFAULT_REPORT_DIR}`,
        '  --no-write-report     Print summary only; do not write JSON report artifact.',
        '  --help                Show this message.',
    ].join('\n'));
}

function parseArgs(argv: string[]): CliOptions {
    const csvPaths: string[] = [];
    let reportDir = DEFAULT_REPORT_DIR;
    let writeReport = true;

    for (let i = 0; i < argv.length; i++) {
        const arg = argv[i];
        if (arg === '--help') {
            printHelp();
            process.exit(0);
        }
        if (arg === '--csv') {
            const value = argv[++i];
            if (!value) throw new Error('`--csv` requires a path.');
            csvPaths.push(value);
            continue;
        }
        if (arg === '--report-dir') {
            const value = argv[++i];
            if (!value) throw new Error('`--report-dir` requires a path.');
            reportDir = value;
            continue;
        }
        if (arg === '--no-write-report') {
            writeReport = false;
            continue;
        }
        throw new Error(`Unknown argument: ${arg}`);
    }

    return {
        csvPaths: csvPaths.length > 0 ? csvPaths : DEFAULT_CSVS,
        reportDir,
        writeReport,
    };
}

function parseCsv(text: string): CsvRow[] {
    const rows: string[][] = [];
    let currentField = '';
    let currentRow: string[] = [];
    let inQuotes = false;

    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        if (inQuotes) {
            if (char === '"') {
                if (text[i + 1] === '"') {
                    currentField += '"';
                    i++;
                    continue;
                }
                inQuotes = false;
                continue;
            }
            currentField += char;
            continue;
        }

        if (char === '"') {
            inQuotes = true;
            continue;
        }
        if (char === ',') {
            currentRow.push(currentField);
            currentField = '';
            continue;
        }
        if (char === '\n') {
            currentRow.push(currentField);
            rows.push(currentRow);
            currentField = '';
            currentRow = [];
            continue;
        }
        if (char === '\r') continue;
        currentField += char;
    }

    if (currentField.length > 0 || currentRow.length > 0) {
        currentRow.push(currentField);
        rows.push(currentRow);
    }

    const [header, ...dataRows] = rows;
    if (!header) return [];

    return dataRows
        .filter((row) => row.some((field) => field.trim().length > 0))
        .map((row) => Object.fromEntries(header.map((field, idx) => [field, row[idx] ?? ''])) as CsvRow);
}

function normalizeName(value: string): string {
    return value.trim().toLowerCase().replace(/\s+/g, ' ');
}

function parseNumber(value: string): number {
    const normalized = value.replace(/,/g, '').trim();
    return normalized ? Number(normalized) : 0;
}

function parseCookbookSteps(
    rawValue: string,
    actionType: ParsedCookbookStep['actionType'],
): ParsedCookbookStep[] {
    if (!rawValue.trim()) return [];

    return normalizeCookbookSteps(rawValue
        .split(';')
        .map((token) => token.trim())
        .filter(Boolean)
        .map((token) => {
            const timingMatch = token.match(/\(([^)]+)\)\s*$/);
            const withoutTiming = timingMatch ? token.slice(0, timingMatch.index).trim() : token;
            const itemName = withoutTiming.replace(/\s+\((Fail|Crit)\)$/i, '').trim();
            const resourceId = RESOURCE_BY_NAME.get(normalizeName(itemName)) ?? null;

            return {
                actionType,
                itemName,
                qty: 1,
                resourceId,
                timing: timingMatch ? timingMatch[1].trim() : null,
                unknown: normalizeName(itemName) === 'unknown',
            } satisfies ParsedCookbookStep;
        }));
}

function normalizeCookbookSteps(steps: ParsedCookbookStep[]): ParsedCookbookStep[] {
    const merged = new Map<string, ParsedCookbookStep>();

    for (const step of steps) {
        const key = JSON.stringify({
            actionType: step.actionType,
            resourceId: step.resourceId,
            normalizedName: normalizeName(step.itemName),
            timing: step.timing ?? null,
            unknown: step.unknown,
        });
        const existing = merged.get(key);
        if (existing) {
            existing.qty += step.qty;
            continue;
        }
        merged.set(key, { ...step });
    }

    return [...merged.values()].sort((a, b) =>
        a.itemName.localeCompare(b.itemName) ||
        (a.timing ?? '').localeCompare(b.timing ?? ''),
    );
}

function variantSignature(actions: ParsedRecipeActions): string {
    const serialize = (steps: ParsedCookbookStep[]): string =>
        steps
            .map((step) => `${step.resourceId ?? normalizeName(step.itemName)}|${step.qty}|${step.timing ?? ''}`)
            .join(';');

    return JSON.stringify({
        dampen: serialize(actions.dampen),
        place: serialize(actions.place),
        stoke: serialize(actions.stoke),
    });
}

function sourceLabelFromPath(csvPath: string): SourceLabel {
    return csvPath.includes('cookbook-2') ? 'cookbook-2' : 'cookbook-1';
}

function buildCookbookVariants(csvPath: string): CookbookVariant[] {
    const content = readFileSync(csvPath, 'utf8');
    const rows = parseCsv(content);
    const source = sourceLabelFromPath(csvPath);

    return rows.map((row) => {
        const recipeActions = {
            dampen: parseCookbookSteps(row.Dampen, 'dampen'),
            place: parseCookbookSteps(row.Place, 'place'),
            stoke: parseCookbookSteps(row.Stoke, 'stoke'),
        };

        return {
            cost: parseNumber(row.Cost),
            dampen: row.Dampen.trim(),
            ignite: row.Ignite.trim(),
            location: row.Location.trim(),
            nerve: parseNumber(row.Nerve),
            place: row.Place.trim(),
            profit: parseNumber(row.Profit),
            profitPerNerve: parseNumber(row['Profit/Nerve']),
            recipeActions,
            recipeSignature: variantSignature(recipeActions),
            reward: parseNumber(row.Reward),
            scenarioName: row.Story.trim(),
            source,
            stoke: row.Stoke.trim(),
        } satisfies CookbookVariant;
    });
}

function currentIgniter(scenario: Scenario): string {
    const igniters = scenario.actions.ignite ?? [];
    if (igniters.some((item) => item.resourceId === 'flamethrower')) return 'flamethrower';
    if (igniters.some((item) => item.resourceId === 'lighter')) return 'lighter';
    if (igniters.some((item) => item.resourceId === 'molotov')) return 'molotov';
    return igniters.map((item) => item.resourceId).join(',') || 'unknown';
}

function supportStatusForScenario(scenario: Scenario | undefined): SupportStatus {
    if (!scenario) return 'missing';
    const igniter = currentIgniter(scenario);
    return igniter === 'flamethrower' || igniter === 'lighter' ? 'supported' : 'unsupported';
}

function formatActionItems(items: ActionItem[] | undefined, actionType: string): string[] {
    if (!items?.length) return [];

    return items
        .filter((item) => !item.optional)
        .map((item) => {
            const resource = CATALOG[item.resourceId];
            return actionType === 'place'
                ? `${resource.name} x${item.qty}`
                : `${resource.name} x${item.qty} [${actionType}]`;
        });
}

function currentScenarioSummary(scenario: Scenario): CurrentScenarioSummary {
    const observedMax = OBSERVED_PAYOUTS[scenario.scenarioName]?.max ?? null;

    return {
        currentBestKnownPayout: Math.max(scenario.payout, observedMax ?? 0),
        currentMaterialCost: calcMaterialCost(scenario, {}),
        currentObservedPayoutMax: observedMax,
        currentPayout: scenario.payout,
        currentPpn: Math.round(calcProfitPerNerve(scenario, {})),
        currentRecipe: [
            ...formatActionItems(scenario.actions.evidence, 'evidence'),
            ...formatActionItems(scenario.actions.place, 'place'),
            ...formatActionItems(scenario.actions.stoke, 'stoke'),
            ...formatActionItems(scenario.actions.dampen, 'dampen'),
        ],
        currentSupportStatus: supportStatusForScenario(scenario),
        currentTotalNerve: calcNerve(scenario),
        igniter: currentIgniter(scenario),
        needsVerification: scenario.needsVerification === true,
    };
}

function compareVariants(a: CookbookVariant, b: CookbookVariant): number {
    if (b.profitPerNerve !== a.profitPerNerve) return b.profitPerNerve - a.profitPerNerve;
    if (b.reward !== a.reward) return b.reward - a.reward;
    return a.cost - b.cost;
}

function bestVariant(variants: CookbookVariant[]): CookbookVariant {
    const [best] = [...variants].sort(compareVariants);
    return best;
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

function normalizeCookbookBucket(steps: ParsedCookbookStep[]): Array<{ qty: number; resourceId: string | null; unknown: boolean }> {
    return steps
        .map((step) => ({ qty: step.qty, resourceId: step.resourceId, unknown: step.unknown }))
        .sort((a, b) => (a.resourceId ?? '').localeCompare(b.resourceId ?? '') || Number(a.unknown) - Number(b.unknown));
}

function semanticallyMatchesCurrent(currentScenario: Scenario, variant: CookbookVariant): boolean {
    if (variant.reward !== currentScenario.payout) return false;

    const currentPlace = normalizeActionItems(currentScenario.actions.place);
    const currentStoke = normalizeActionItems(currentScenario.actions.stoke);
    const currentDampen = normalizeActionItems(currentScenario.actions.dampen);
    const currentEvidence = normalizeActionItems(currentScenario.actions.evidence);

    const cookbookPlace = normalizeCookbookBucket(variant.recipeActions.place);
    const cookbookStoke = normalizeCookbookBucket(variant.recipeActions.stoke);
    const cookbookDampen = normalizeCookbookBucket(variant.recipeActions.dampen);

    if (currentEvidence.length > 0) return false;
    if (cookbookPlace.some((step) => step.unknown) || cookbookStoke.some((step) => step.unknown) || cookbookDampen.some((step) => step.unknown)) {
        return false;
    }

    return JSON.stringify(currentPlace) === JSON.stringify(cookbookPlace) &&
        JSON.stringify(currentStoke) === JSON.stringify(cookbookStoke) &&
        JSON.stringify(currentDampen) === JSON.stringify(cookbookDampen);
}

function recommendationFor(
    supportStatus: SupportStatus,
    consensusRecipe: boolean,
    current: CurrentScenarioSummary | null,
    variants: CookbookVariant[],
): Recommendation {
    if (supportStatus === 'missing') return 'add_missing';
    if (!current) return 'investigate_conflict';

    const best = bestVariant(variants);
    const payoutOnly = consensusRecipe && best.recipeSignature === '' && best.reward > current.currentPayout;
    if (payoutOnly) return 'validate_payout_only';
    return consensusRecipe ? 'validate_consensus' : 'investigate_conflict';
}

function buildComparisonReport(options: CliOptions): ReportPayload {
    const scenarioMap = new Map(SCENARIOS.map((scenario) => [scenario.scenarioName, scenario]));
    const grouped = new Map<string, CookbookVariant[]>();
    let totalVariants = 0;

    for (const csvPath of options.csvPaths) {
        const variants = buildCookbookVariants(csvPath);
        totalVariants += variants.length;
        for (const variant of variants) {
            const bucket = grouped.get(variant.scenarioName) ?? [];
            bucket.push(variant);
            grouped.set(variant.scenarioName, bucket);
        }
    }

    const consensusNoopMatches: ScenarioComparison[] = [];
    const consensusUpdateMatches: ScenarioComparison[] = [];
    const conflictMatches: ScenarioComparison[] = [];
    const missingScenarioCandidates: ScenarioComparison[] = [];
    const unsupportedCurrentMatches: ScenarioComparison[] = [];

    for (const [scenarioName, variants] of grouped.entries()) {
        const scenario = scenarioMap.get(scenarioName);
        const supportStatus = supportStatusForScenario(scenario);
        const current = scenario ? currentScenarioSummary(scenario) : null;
        const consensusRecipe = new Set(variants.map((variant) => variant.recipeSignature)).size === 1;
        const comparison: ScenarioComparison = {
            consensusRecipe,
            current: current ?? {
                currentBestKnownPayout: 0,
                currentMaterialCost: 0,
                currentObservedPayoutMax: null,
                currentPayout: 0,
                currentPpn: 0,
                currentRecipe: [],
                currentSupportStatus: 'missing',
                currentTotalNerve: 0,
                igniter: 'unknown',
                needsVerification: false,
            },
            locations: [...new Set(variants.map((variant) => variant.location))].sort(),
            recommendation: recommendationFor(supportStatus, consensusRecipe, current, variants),
            scenarioName,
            supportStatus,
            variants: [...variants].sort(compareVariants),
        };

        if (supportStatus === 'missing') {
            missingScenarioCandidates.push(comparison);
            continue;
        }

        if (supportStatus === 'unsupported') {
            unsupportedCurrentMatches.push(comparison);
            continue;
        }

        if (!current || !scenario) continue;
        if (!consensusRecipe) {
            conflictMatches.push(comparison);
            continue;
        }

        if (semanticallyMatchesCurrent(scenario, bestVariant(variants))) {
            consensusNoopMatches.push(comparison);
            continue;
        }

        consensusUpdateMatches.push(comparison);
    }

    consensusNoopMatches.sort((a, b) => compareVariants(a.variants[0], b.variants[0]));
    consensusUpdateMatches.sort((a, b) => compareVariants(a.variants[0], b.variants[0]));
    conflictMatches.sort((a, b) => compareVariants(a.variants[0], b.variants[0]));
    missingScenarioCandidates.sort((a, b) => compareVariants(a.variants[0], b.variants[0]));
    unsupportedCurrentMatches.sort((a, b) => compareVariants(a.variants[0], b.variants[0]));

    return {
        comparedAtUtc: new Date().toISOString(),
        csvPaths: options.csvPaths,
        summary: {
            conflictMatches: conflictMatches.length,
            consensusNoopMatches: consensusNoopMatches.length,
            consensusUpdateMatches: consensusUpdateMatches.length,
            missingScenarioCandidates: missingScenarioCandidates.length,
            totalCookbookScenarios: grouped.size,
            totalVariants,
            unsupportedCurrentMatches: unsupportedCurrentMatches.length,
        },
        conflictMatches,
        consensusNoopMatches,
        consensusUpdateMatches,
        missingScenarioCandidates,
        unsupportedCurrentMatches,
    };
}

function printSummary(report: ReportPayload): void {
    console.log([
        `Cookbook scenarios compared: ${report.summary.totalCookbookScenarios}`,
        `Cookbook variants parsed: ${report.summary.totalVariants}`,
        `Consensus no-op matches: ${report.summary.consensusNoopMatches}`,
        `Consensus update matches: ${report.summary.consensusUpdateMatches}`,
        `Conflict matches: ${report.summary.conflictMatches}`,
        `Missing scenario candidates: ${report.summary.missingScenarioCandidates}`,
        `Unsupported current matches excluded: ${report.summary.unsupportedCurrentMatches}`,
    ].join('\n'));

    const preview = report.consensusUpdateMatches.slice(0, 5);
    if (preview.length > 0) {
        console.log('\nTop consensus update candidates:');
        for (const match of preview) {
            const best = bestVariant(match.variants);
            console.log(`- ${match.scenarioName}: current best-known $${match.current.currentBestKnownPayout.toLocaleString()} -> cookbook $${best.reward.toLocaleString()} (${best.profitPerNerve.toLocaleString()} PPN)`);
        }
    }
}

function writeReport(reportDir: string, report: ReportPayload): string {
    mkdirSync(reportDir, { recursive: true });
    const stamp = report.comparedAtUtc.replace(/[:.]/g, '-');
    const reportPath = path.join(reportDir, `${stamp}.cookbooks.json`);
    writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
    return reportPath;
}

const options = parseArgs(process.argv.slice(2));
const report = buildComparisonReport(options);
printSummary(report);

if (options.writeReport) {
    const reportPath = writeReport(options.reportDir, report);
    console.log(`\nWrote report: ${reportPath}`);
}
