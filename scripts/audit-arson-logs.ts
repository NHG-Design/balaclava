import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import ts from 'typescript';

import { CATALOG } from '../src/data/catalog.js';
import { calcMaterialCost, calcNerve, calcProfitPerNerve, type PriceMap } from '../src/userscripts/arsonists-ledger/engine.js';
import { RESOURCE, type ResourceId } from '../src/data/catalog.js';
import { SCENARIOS, type ActionItem, type Scenario, type ScenarioActions } from '../src/data/scenarios.js';

type ActionType = 'collect' | 'dampen' | 'evidence' | 'ignite' | 'place' | 'stoke';

interface CliOptions {
    days: number;
    updateItems: boolean;
    updatePayouts: boolean;
    writeReport: boolean;
    reportDir: string;
}

interface ParsedCrimeAction {
    actionType: ActionType;
    location: string;
    scenarioName: string;
}

interface LogEntry {
    id: string;
    timestamp: number;
    details?: {
        title?: string;
        category?: string;
    };
    data?: {
        crime_action?: string;
        money_gained?: number;
        items_used?: Record<string, number>;
    };
    _pairedAction?: ActionEvent | null;
}

interface ActionEvent extends LogEntry {
    parsed: ParsedCrimeAction;
    pairedItems: ItemUsage[];
}

interface ItemUsage {
    resourceId: ResourceId;
    qty: number;
}

interface RunStep {
    timestamp: number;
    actionType: Exclude<ActionType, 'collect'>;
    items: ItemUsage[];
}

interface SuccessfulRun {
    collectedAt: number;
    location: string;
    payout: number;
    scenarioName: string;
    steps: RunStep[];
}

interface ObservedRecipe {
    actions: Partial<Record<Exclude<ActionType, 'collect' | 'ignite'>, ItemUsage[]>>;
    completeForUpdate: boolean;
    cost: number;
    nerve: number;
    profitPerNerve: number;
}

type ItemEvidenceStatus = 'collect_only' | 'complete' | 'partial';

interface ScenarioSummary {
    scenarioName: string;
    locations: string[];
    currentPayout: number;
    currentConsumables: string[];
    currentProfitPerNerve: number;
    observedRunCount: number;
    payoutRange: {
        min: number;
        max: number;
    } | null;
    bestObservedPayout: number | null;
    bestObservedConsumables: string[] | null;
    bestObservedProfitPerNerve: number | null;
    evidenceSummary: {
        collectOnlyRuns: number;
        completeRuns: number;
        partialRuns: number;
    };
    matchedCurrentRecipe: boolean | null;
    recommendedUpdates: Array<'items' | 'none' | 'payout'>;
    supportingRuns: Array<{
        collectedAtUtc: string;
        consumables: string[];
        evidenceStatus: ItemEvidenceStatus;
        itemUpdateReason: 'better_recipe_found' | 'insufficient_evidence' | 'matches_current' | 'not_better_than_current';
        matchedCurrentRecipe: boolean | null;
        location: string;
        payout: number;
        profitPerNerve: number | null;
        recipeCompleteForUpdate: boolean;
    }>;
}

interface ReportPayload {
    generatedAtUtc: string;
    reportWindowDays: number;
    windowStartUtc: string;
    summary: {
        apiRequests: number;
        scenariosObserved: number;
        successfulRuns: number;
        totalArsonLogs: number;
        totalItemLogs: number;
    };
    scenarios: ScenarioSummary[];
}

interface ScenarioEntryMeta {
    actionsNode: ts.ObjectLiteralExpression;
    block: ts.ObjectLiteralExpression;
    hasFlamethrowerIgnite: boolean;
    payoutNode: ts.Expression;
    scenario: Scenario;
    scenarioName: string;
}

interface Replacement {
    end: number;
    start: number;
    text: string;
}

const DEFAULT_REPORT_DIR = path.join('reports', 'userscripts', 'arsonists-ledger');
const RESOURCE_CONST_BY_ID = new Map<ResourceId, string>(
    Object.entries(RESOURCE).map(([constName, resourceId]) => [resourceId, constName]),
);

function printHelp(): void {
    console.log([
        'Usage: pnpm exec tsx scripts/audit-arson-logs.ts --days 14 [options]',
        '',
        'Options:',
        '  --days <n>            Query the last n days of arson logs.',
        '  --update-payouts      Raise canonical payouts to the highest observed payout.',
        '  --update-items        Update consumable recipes to the best observed PPN recipe.',
        '  --write-report        Write a timestamped JSON report artifact.',
        `  --report-dir <path>   Report output directory. Default: ${DEFAULT_REPORT_DIR}`,
        '  --help                Show this message.',
    ].join('\n'));
}

function parseArgs(argv: string[]): CliOptions {
    const options: CliOptions = {
        days: 14,
        updateItems: false,
        updatePayouts: false,
        writeReport: false,
        reportDir: DEFAULT_REPORT_DIR,
    };

    for (let i = 0; i < argv.length; i++) {
        const arg = argv[i];
        if (arg === '--help') {
            printHelp();
            process.exit(0);
        }
        if (arg === '--update-items') {
            options.updateItems = true;
            continue;
        }
        if (arg === '--update-payouts') {
            options.updatePayouts = true;
            continue;
        }
        if (arg === '--write-report') {
            options.writeReport = true;
            continue;
        }
        if (arg === '--days') {
            const value = Number(argv[++i]);
            if (!Number.isInteger(value) || value <= 0) throw new Error('`--days` must be a positive integer.');
            options.days = value;
            continue;
        }
        if (arg === '--report-dir') {
            const value = argv[++i];
            if (!value) throw new Error('`--report-dir` requires a value.');
            options.reportDir = value;
            continue;
        }
        throw new Error(`Unknown argument: ${arg}`);
    }

    return options;
}

function loadEnvValue(name: string): string {
    const direct = process.env[name];
    if (direct) return direct;

    const envPath = path.join(process.cwd(), '.dev.vars');
    const content = readFileSync(envPath, 'utf8');
    for (const line of content.split(/\r?\n/)) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const idx = trimmed.indexOf('=');
        if (idx === -1) continue;
        const key = trimmed.slice(0, idx).trim();
        if (key !== name) continue;
        return trimmed.slice(idx + 1);
    }

    throw new Error(`Missing ${name} in environment or .dev.vars.`);
}

function parseCrimeAction(input: string | undefined): ParsedCrimeAction | null {
    if (!input) return null;

    let match = input.match(/^collecting the reward for the (.+?) \((.+)\) Arson job$/);
    if (match) return { actionType: 'collect', location: match[1], scenarioName: match[2] };

    match = input.match(/^placing a combustible at (?:a |an )?(.+?) \((.+)\)$/);
    if (match) return { actionType: 'place', location: match[1], scenarioName: match[2] };

    match = input.match(/^placing evidence at (?:a |an )?(.+?) \((.+)\)$/);
    if (match) return { actionType: 'evidence', location: match[1], scenarioName: match[2] };

    match = input.match(/^igniting (?:a |an )?(.+?) \((.+)\)$/);
    if (match) return { actionType: 'ignite', location: match[1], scenarioName: match[2] };

    match = input.match(/^stoking (?:a |an )?(.+?) \((.+)\)$/);
    if (match) return { actionType: 'stoke', location: match[1], scenarioName: match[2] };

    match = input.match(/^dampening (?:a |an )?(.+?) \((.+)\)$/);
    if (match) return { actionType: 'dampen', location: match[1], scenarioName: match[2] };

    return null;
}

async function fetchLogWindow(days: number): Promise<{ logs: LogEntry[]; requestCount: number }> {
    const key = loadEnvValue('TORN_FULL_API_KEY');
    const cutoff = Math.floor(Date.now() / 1000) - days * 24 * 60 * 60;
    let url = `https://api.torn.com/v2/user/log?limit=100&sort=desc&key=${encodeURIComponent(key)}`;
    const logs: LogEntry[] = [];
    let requestCount = 0;

    for (let page = 0; page < 250 && url; page++) {
        requestCount += 1;
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Torn log request failed: HTTP ${response.status}`);

        const payload = await response.json() as {
            _metadata?: { links?: { prev?: string | null } };
            error?: { error?: string };
            log?: LogEntry[];
        };
        if (payload.error?.error) throw new Error(payload.error.error);

        const pageLogs = Array.isArray(payload.log) ? payload.log : [];
        logs.push(...pageLogs);
        const oldest = pageLogs.at(-1)?.timestamp ?? 0;
        if (oldest < cutoff) break;
        const prev = payload._metadata?.links?.prev;
        url = prev ? `${prev}&key=${encodeURIComponent(key)}` : '';
    }

    return {
        logs: logs.filter((log) => log.timestamp >= cutoff),
        requestCount,
    };
}

function buildActionEvents(logs: LogEntry[]): { actionEvents: ActionEvent[]; itemLogs: LogEntry[] } {
    const actionEvents: ActionEvent[] = [];
    const itemLogs: LogEntry[] = [];

    for (const log of logs) {
        if (log.details?.title === 'Crime use items for arson') {
            itemLogs.push(log);
            continue;
        }

        const parsed = parseCrimeAction(log.data?.crime_action);
        if (!parsed) continue;

        actionEvents.push({
            ...log,
            pairedItems: [],
            parsed,
        });
    }

    for (const itemLog of itemLogs) {
        const candidates = actionEvents
            .filter((event) => event.parsed.actionType !== 'collect' && Math.abs(event.timestamp - itemLog.timestamp) <= 2)
            .sort((a, b) =>
                Math.abs(a.timestamp - itemLog.timestamp) - Math.abs(b.timestamp - itemLog.timestamp) ||
                b.timestamp - a.timestamp,
            );
        const paired = candidates[0] ?? null;
        itemLog._pairedAction = paired;
        if (!paired) continue;

        const itemsUsed = itemLog.data?.items_used ?? {};
        for (const [tornIdRaw, qty] of Object.entries(itemsUsed)) {
            const tornId = Number(tornIdRaw);
            const resource = Object.values(CATALOG).find((entry) => entry.tornId === tornId);
            if (!resource) continue;
            paired.pairedItems.push({ qty: Number(qty), resourceId: resource.id as ResourceId });
        }
    }

    return { actionEvents, itemLogs };
}

function buildSuccessfulRuns(actionEvents: ActionEvent[]): SuccessfulRun[] {
    const events = [...actionEvents].sort((a, b) => a.timestamp - b.timestamp || a.id.localeCompare(b.id));
    const pendingByScenario = new Map<string, RunStep[]>();
    const runs: SuccessfulRun[] = [];

    for (const event of events) {
        const key = event.parsed.scenarioName;
        if (event.parsed.actionType === 'collect') {
            const payout = event.data?.money_gained;
            if (typeof payout === 'number') {
                runs.push({
                    collectedAt: event.timestamp,
                    location: event.parsed.location,
                    payout,
                    scenarioName: event.parsed.scenarioName,
                    steps: pendingByScenario.get(key) ?? [],
                });
            }
            pendingByScenario.delete(key);
            continue;
        }

        const steps = pendingByScenario.get(key) ?? [];
        steps.push({
            actionType: event.parsed.actionType,
            items: event.pairedItems,
            timestamp: event.timestamp,
        });
        pendingByScenario.set(key, steps);
    }

    return runs;
}

function groupConsumablesByAction(steps: RunStep[]): Partial<Record<Exclude<ActionType, 'collect' | 'ignite'>, ItemUsage[]>> {
    const grouped = new Map<Exclude<ActionType, 'collect' | 'ignite'>, Map<ResourceId, number>>();
    for (const step of steps) {
        if (step.actionType === 'ignite') continue;
        for (const item of step.items) {
            const resource = CATALOG[item.resourceId];
            if (!resource || resource.isTool) continue;
            const actionMap = grouped.get(step.actionType) ?? new Map<ResourceId, number>();
            actionMap.set(item.resourceId, (actionMap.get(item.resourceId) ?? 0) + item.qty);
            grouped.set(step.actionType, actionMap);
        }
    }

    const result: Partial<Record<Exclude<ActionType, 'collect' | 'ignite'>, ItemUsage[]>> = {};
    for (const [actionType, items] of grouped.entries()) {
        result[actionType] = [...items.entries()]
            .sort((a, b) => a[0].localeCompare(b[0]))
            .map(([resourceId, qty]) => ({ qty, resourceId }));
    }
    return result;
}

function isRecipeCompleteForUpdate(steps: RunStep[]): boolean {
    const requiredCounts = { evidence: 0, place: 0, stoke: 0 };
    const observedCounts = { evidence: 0, place: 0, stoke: 0 };

    for (const step of steps) {
        if (step.actionType === 'evidence' || step.actionType === 'place' || step.actionType === 'stoke') {
            requiredCounts[step.actionType] += 1;
            if (step.items.some((item) => !CATALOG[item.resourceId].isTool)) observedCounts[step.actionType] += 1;
        }
    }

    return (
        requiredCounts.evidence === observedCounts.evidence &&
        requiredCounts.place === observedCounts.place &&
        requiredCounts.stoke === observedCounts.stoke
    );
}

function pricesFromCatalog(): PriceMap {
    const prices: PriceMap = {};
    for (const resource of Object.values(CATALOG)) prices[resource.id as ResourceId] = resource.defaultPrice;
    return prices;
}

function observedRecipeForRun(run: SuccessfulRun): ObservedRecipe | null {
    const actions = groupConsumablesByAction(run.steps);
    const hasConsumables = Object.values(actions).some((items) => Array.isArray(items) && items.length > 0);
    if (!hasConsumables) return null;

    const observedScenario: Scenario = {
        scenarioName: run.scenarioName,
        payout: run.payout,
        actions: {
            evidence: actions.evidence,
            place: actions.place ?? [],
            stoke: actions.stoke,
            dampen: actions.dampen,
        },
    };

    return {
        actions,
        completeForUpdate: isRecipeCompleteForUpdate(run.steps),
        cost: calcMaterialCost(observedScenario, pricesFromCatalog()),
        nerve: calcNerve(observedScenario),
        profitPerNerve: calcProfitPerNerve(observedScenario, pricesFromCatalog()),
    };
}

function consumableLines(actions: ScenarioActions): string[] {
    const entries: string[] = [];
    for (const actionType of ['evidence', 'ignite', 'place', 'stoke', 'dampen'] as const) {
        const items = actions[actionType];
        if (!items) continue;
        for (const item of items) {
            const resource = CATALOG[item.resourceId];
            if (!resource || resource.isTool) continue;
            entries.push(`${resource.name} x${item.qty} (${actionType})`);
        }
    }
    return entries.sort();
}

function observedConsumableLines(actions: Partial<Record<Exclude<ActionType, 'collect' | 'ignite'>, ItemUsage[]>>): string[] {
    const entries: string[] = [];
    for (const actionType of ['evidence', 'place', 'stoke', 'dampen'] as const) {
        const items = actions[actionType];
        if (!items) continue;
        for (const item of items) {
            const resource = CATALOG[item.resourceId];
            if (!resource || resource.isTool) continue;
            entries.push(`${resource.name} x${item.qty} (${actionType})`);
        }
    }
    return entries.sort();
}

function classifyEvidenceStatus(run: SuccessfulRun): ItemEvidenceStatus {
    const recipe = observedRecipeForRun(run);
    if (!recipe) return 'collect_only';
    return recipe.completeForUpdate ? 'complete' : 'partial';
}

function arraysEqual(a: string[], b: string[]): boolean {
    if (a.length !== b.length) return false;
    return a.every((value, index) => value === b[index]);
}

function summarizeScenarioRuns(runs: SuccessfulRun[]): Map<string, ScenarioSummary> {
    const deduped = deduplicateScenarios(SCENARIOS);
    const scenarioMap = new Map(deduped.map((scenario) => [scenario.scenarioName, scenario]));
    const grouped = new Map<string, SuccessfulRun[]>();

    for (const run of runs) {
        const bucket = grouped.get(run.scenarioName) ?? [];
        bucket.push(run);
        grouped.set(run.scenarioName, bucket);
    }

    const summaries = new Map<string, ScenarioSummary>();
    for (const [scenarioName, scenarioRuns] of grouped.entries()) {
        const current = scenarioMap.get(scenarioName);
        if (!current) continue;

        let bestObservedRecipe: ObservedRecipe | null = null;
        let payoutMin = Number.POSITIVE_INFINITY;
        let payoutMax = Number.NEGATIVE_INFINITY;
        let collectOnlyRuns = 0;
        let partialRuns = 0;
        let completeRuns = 0;
        let matchedCurrentRecipe: boolean | null = null;
        const currentConsumables = consumableLines(current.actions);
        const currentPpn = calcProfitPerNerve(current, pricesFromCatalog());

        for (const run of scenarioRuns) {
            payoutMin = Math.min(payoutMin, run.payout);
            payoutMax = Math.max(payoutMax, run.payout);

            const recipe = observedRecipeForRun(run);
            const evidenceStatus = classifyEvidenceStatus(run);
            if (evidenceStatus === 'collect_only') collectOnlyRuns += 1;
            if (evidenceStatus === 'partial') partialRuns += 1;
            if (evidenceStatus === 'complete') completeRuns += 1;

            if (recipe?.completeForUpdate) {
                const observedLines = observedConsumableLines(recipe.actions);
                if (arraysEqual(observedLines, currentConsumables)) matchedCurrentRecipe = true;
                else if (matchedCurrentRecipe === null) matchedCurrentRecipe = false;
            }

            if (!recipe || !recipe.completeForUpdate) continue;
            if (!bestObservedRecipe || recipe.profitPerNerve > bestObservedRecipe.profitPerNerve) {
                bestObservedRecipe = recipe;
            }
        }

        const recommendations: Array<'items' | 'none' | 'payout'> = [];
        if (payoutMax > current.payout) recommendations.push('payout');
        if (bestObservedRecipe && bestObservedRecipe.profitPerNerve > currentPpn) recommendations.push('items');
        if (!recommendations.length) recommendations.push('none');

        summaries.set(scenarioName, {
            bestObservedConsumables: bestObservedRecipe ? consumableLines({
                place: bestObservedRecipe.actions.place ?? [],
                evidence: bestObservedRecipe.actions.evidence,
                stoke: bestObservedRecipe.actions.stoke,
                dampen: bestObservedRecipe.actions.dampen,
            }) : null,
            bestObservedPayout: payoutMax,
            bestObservedProfitPerNerve: bestObservedRecipe?.profitPerNerve ?? null,
            currentConsumables,
            currentPayout: current.payout,
            currentProfitPerNerve: currentPpn,
            evidenceSummary: {
                collectOnlyRuns,
                completeRuns,
                partialRuns,
            },
            locations: [...new Set(scenarioRuns.map((run) => run.location))].sort(),
            matchedCurrentRecipe,
            observedRunCount: scenarioRuns.length,
            payoutRange: Number.isFinite(payoutMin) && Number.isFinite(payoutMax) ? { max: payoutMax, min: payoutMin } : null,
            recommendedUpdates: recommendations.sort(),
            scenarioName,
            supportingRuns: scenarioRuns
                .slice()
                .sort((a, b) => b.collectedAt - a.collectedAt)
                .map((run) => {
                    const recipe = observedRecipeForRun(run);
                    const evidenceStatus = classifyEvidenceStatus(run);
                    const observedLines = recipe ? observedConsumableLines(recipe.actions) : [];
                    const runMatchesCurrent = recipe?.completeForUpdate ? arraysEqual(observedLines, currentConsumables) : null;
                    const itemUpdateReason =
                        evidenceStatus === 'collect_only' || evidenceStatus === 'partial'
                            ? 'insufficient_evidence'
                            : runMatchesCurrent
                                ? 'matches_current'
                                : recipe && recipe.profitPerNerve > currentPpn
                                    ? 'better_recipe_found'
                                    : 'not_better_than_current';
                    return {
                        collectedAtUtc: new Date(run.collectedAt * 1000).toISOString(),
                        consumables: observedLines,
                        evidenceStatus,
                        itemUpdateReason,
                        location: run.location,
                        matchedCurrentRecipe: runMatchesCurrent,
                        payout: run.payout,
                        profitPerNerve: recipe?.profitPerNerve ?? null,
                        recipeCompleteForUpdate: recipe?.completeForUpdate ?? false,
                    };
                }),
        });
    }

    return summaries;
}

function deduplicateScenarios(scenarios: Scenario[]): Scenario[] {
    const groups = new Map<string, Scenario[]>();
    for (const scenario of scenarios) {
        const bucket = groups.get(scenario.scenarioName) ?? [];
        bucket.push(scenario);
        groups.set(scenario.scenarioName, bucket);
    }

    const deduped: Scenario[] = [];
    for (const group of groups.values()) {
        if (group.length === 1) {
            deduped.push(group[0]);
            continue;
        }
        const flamethrowerVersions = group.filter((scenario) =>
            scenario.actions.ignite?.some((item) => item.resourceId === RESOURCE.FLAMETHROWER) ?? false,
        );
        deduped.push(...(flamethrowerVersions.length > 0 ? flamethrowerVersions : [group[0]]));
    }
    return deduped;
}

function highestObservedPayoutByScenario(runs: SuccessfulRun[]): Map<string, number> {
    const result = new Map<string, number>();
    for (const run of runs) {
        result.set(run.scenarioName, Math.max(result.get(run.scenarioName) ?? 0, run.payout));
    }
    return result;
}

function bestObservedRecipeByScenario(runs: SuccessfulRun[]): Map<string, ObservedRecipe> {
    const currentByScenario = new Map(deduplicateScenarios(SCENARIOS).map((scenario) => [scenario.scenarioName, scenario]));
    const result = new Map<string, ObservedRecipe>();

    for (const run of runs) {
        const current = currentByScenario.get(run.scenarioName);
        if (!current) continue;
        const recipe = observedRecipeForRun(run);
        if (!recipe || !recipe.completeForUpdate) continue;
        const currentPpn = calcProfitPerNerve(current, pricesFromCatalog());
        if (recipe.profitPerNerve <= currentPpn) continue;

        const existing = result.get(run.scenarioName);
        if (!existing || recipe.profitPerNerve > existing.profitPerNerve) result.set(run.scenarioName, recipe);
    }

    return result;
}

function formatNumberLiteral(value: number): string {
    return Math.trunc(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '_');
}

function formatActionItem(item: ActionItem): string {
    const constName = RESOURCE_CONST_BY_ID.get(item.resourceId);
    if (!constName) throw new Error(`No RESOURCE constant found for ${item.resourceId}.`);

    const parts = [`resourceId: RESOURCE.${constName}`, `qty: ${item.qty}`];
    if (item.optional) parts.push('optional: true');
    if (item.optionalLabel) parts.push(`optionalLabel: '${item.optionalLabel.replace(/'/g, "\\'")}'`);
    return `{ ${parts.join(', ')} }`;
}

function formatActionList(items: ActionItem[], indent: string): string {
    if (!items.length) return '[]';
    return [
        '[',
        ...items.map((item) => `${indent}    ${formatActionItem(item)},`),
        `${indent}]`,
    ].join('\n');
}

function formatActions(actions: ScenarioActions): string {
    const lines: string[] = ['{'];
    const indent = '            ';

    for (const actionType of ['evidence', 'ignite', 'place', 'stoke', 'dampen'] as const) {
        const items = actions[actionType];
        if (!items || items.length === 0) continue;
        lines.push(`${indent}${actionType}: ${formatActionList(items, indent) },`);
        if (actionType === 'stoke' && actions.stokeTime) lines.push(`${indent}stokeTime: '${actions.stokeTime}',`);
        if (actionType === 'dampen' && actions.dampenTime) lines.push(`${indent}dampenTime: '${actions.dampenTime}',`);
    }

    if (!actions.stoke?.length && actions.stokeTime) lines.push(`${indent}stokeTime: '${actions.stokeTime}',`);
    if (!actions.dampen?.length && actions.dampenTime) lines.push(`${indent}dampenTime: '${actions.dampenTime}',`);

    lines.push('        }');
    return lines.join('\n');
}

function mergedActions(current: ScenarioActions, observed: ObservedRecipe): ScenarioActions {
    const next: ScenarioActions = {
        ...current,
        place: [...current.place],
    };

    for (const actionType of ['evidence', 'place', 'stoke', 'dampen'] as const) {
        const existing = [...(current[actionType] ?? [])];
        const preserved = existing.filter((item) => CATALOG[item.resourceId].isTool);
        const observedItems = observed.actions[actionType]?.map((item) => ({ ...item })) ?? [];
        const replacement = [...preserved, ...observedItems];

        if (replacement.length > 0 || actionType === 'place') {
            next[actionType] = replacement;
        } else {
            delete next[actionType];
        }
    }

    return next;
}

function collectScenarioEntryMeta(sourceText: string): Map<string, ScenarioEntryMeta> {
    const sourceFile = ts.createSourceFile('scenarios.ts', sourceText, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
    const entries: ScenarioEntryMeta[] = [];

    function visit(node: ts.Node): void {
        if (
            ts.isVariableDeclaration(node) &&
            ts.isIdentifier(node.name) &&
            node.name.text === 'SCENARIOS' &&
            node.initializer &&
            ts.isArrayLiteralExpression(node.initializer)
        ) {
            for (const element of node.initializer.elements) {
                if (!ts.isObjectLiteralExpression(element)) continue;
                const nameProp = element.properties.find((prop): prop is ts.PropertyAssignment =>
                    ts.isPropertyAssignment(prop) &&
                    ts.isIdentifier(prop.name) &&
                    prop.name.text === 'scenarioName' &&
                    ts.isStringLiteralLike(prop.initializer),
                );
                const payoutProp = element.properties.find((prop): prop is ts.PropertyAssignment =>
                    ts.isPropertyAssignment(prop) &&
                    ts.isIdentifier(prop.name) &&
                    prop.name.text === 'payout',
                );
                const actionsProp = element.properties.find((prop): prop is ts.PropertyAssignment =>
                    ts.isPropertyAssignment(prop) &&
                    ts.isIdentifier(prop.name) &&
                    prop.name.text === 'actions' &&
                    ts.isObjectLiteralExpression(prop.initializer),
                );
                if (!nameProp || !payoutProp || !actionsProp) continue;

                const scenarioName = nameProp.initializer.text;
                const matchingScenario = SCENARIOS.find((scenario) =>
                    scenario.scenarioName === scenarioName &&
                    scenario.payout === Number(payoutProp.initializer.getText(sourceFile).replace(/_/g, '')),
                );
                const hasFlamethrowerIgnite = actionsProp.initializer.getText(sourceFile).includes('RESOURCE.FLAMETHROWER');

                entries.push({
                    actionsNode: actionsProp.initializer,
                    block: element,
                    hasFlamethrowerIgnite,
                    payoutNode: payoutProp.initializer,
                    scenario: matchingScenario ?? SCENARIOS.find((scenario) => scenario.scenarioName === scenarioName)!,
                    scenarioName,
                });
            }
        }
        ts.forEachChild(node, visit);
    }

    visit(sourceFile);

    const grouped = new Map<string, ScenarioEntryMeta[]>();
    for (const entry of entries) {
        const bucket = grouped.get(entry.scenarioName) ?? [];
        bucket.push(entry);
        grouped.set(entry.scenarioName, bucket);
    }

    const winners = new Map<string, ScenarioEntryMeta>();
    for (const [scenarioName, bucket] of grouped.entries()) {
        const flamethrower = bucket.filter((entry) => entry.hasFlamethrowerIgnite);
        winners.set(scenarioName, flamethrower[0] ?? bucket[0]);
    }

    return winners;
}

function applyScenarioUpdates(runs: SuccessfulRun[], options: CliOptions): { changed: boolean; updatedScenarios: string[] } {
    if (!options.updateItems && !options.updatePayouts) return { changed: false, updatedScenarios: [] };

    const sourcePath = path.join(process.cwd(), 'src', 'data', 'scenarios.ts');
    const sourceText = readFileSync(sourcePath, 'utf8');
    const winners = collectScenarioEntryMeta(sourceText);
    const payoutMap = highestObservedPayoutByScenario(runs);
    const recipeMap = bestObservedRecipeByScenario(runs);
    const replacements: Replacement[] = [];
    const updatedScenarios = new Set<string>();

    for (const [scenarioName, entry] of winners.entries()) {
        if (options.updatePayouts) {
            const observedPayout = payoutMap.get(scenarioName);
            if (observedPayout && observedPayout > entry.scenario.payout) {
                replacements.push({
                    end: entry.payoutNode.end,
                    start: entry.payoutNode.getStart(),
                    text: formatNumberLiteral(observedPayout),
                });
                updatedScenarios.add(scenarioName);
            }
        }

        if (options.updateItems) {
            const observedRecipe = recipeMap.get(scenarioName);
            if (!observedRecipe) continue;
            const nextActions = mergedActions(entry.scenario.actions, observedRecipe);
            replacements.push({
                end: entry.actionsNode.end,
                start: entry.actionsNode.getStart(),
                text: formatActions(nextActions),
            });
            updatedScenarios.add(scenarioName);
        }
    }

    if (!replacements.length) return { changed: false, updatedScenarios: [] };

    let nextSource = sourceText;
    for (const replacement of replacements.sort((a, b) => b.start - a.start)) {
        nextSource = nextSource.slice(0, replacement.start) + replacement.text + nextSource.slice(replacement.end);
    }
    writeFileSync(sourcePath, nextSource);
    execFileSync('pnpm', ['exec', 'tsx', 'scripts/dump-scenarios.ts'], { cwd: process.cwd(), stdio: 'inherit' });
    return { changed: true, updatedScenarios: [...updatedScenarios].sort() };
}

function timestampForFilename(date: Date): string {
    return date.toISOString().replace(/:/g, '-').replace(/\.\d{3}Z$/, 'Z');
}

function writeReport(options: CliOptions, report: ReportPayload): string {
    mkdirSync(options.reportDir, { recursive: true });
    const filename = `${timestampForFilename(new Date())}.arsons.json`;
    const fullPath = path.join(options.reportDir, filename);
    writeFileSync(fullPath, `${JSON.stringify(report, null, 2)}\n`);
    return fullPath;
}

async function main(): Promise<void> {
    const options = parseArgs(process.argv.slice(2));
    const { logs, requestCount } = await fetchLogWindow(options.days);
    const { actionEvents, itemLogs } = buildActionEvents(logs);
    const runs = buildSuccessfulRuns(actionEvents);
    const summaries = summarizeScenarioRuns(runs);

    const report: ReportPayload = {
        generatedAtUtc: new Date().toISOString(),
        reportWindowDays: options.days,
        scenarios: [...summaries.values()].sort((a, b) => a.scenarioName.localeCompare(b.scenarioName)),
        summary: {
            apiRequests: requestCount,
            scenariosObserved: summaries.size,
            successfulRuns: runs.length,
            totalArsonLogs: actionEvents.length,
            totalItemLogs: itemLogs.length,
        },
        windowStartUtc: new Date(Date.now() - options.days * 24 * 60 * 60 * 1000).toISOString(),
    };

    const updateResult = applyScenarioUpdates(runs, options);
    const reportPath = options.writeReport ? writeReport(options, report) : null;

    console.log(JSON.stringify({
        reportPath,
        apiRequests: report.summary.apiRequests,
        scenariosObserved: report.summary.scenariosObserved,
        successfulRuns: report.summary.successfulRuns,
        totalArsonLogs: report.summary.totalArsonLogs,
        totalItemLogs: report.summary.totalItemLogs,
        updatedScenarios: updateResult.updatedScenarios,
    }, null, 2));
}

main().catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
});
