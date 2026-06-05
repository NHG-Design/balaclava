import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import ts from 'typescript';

import { CATALOG } from '../src/data/catalog.js';
import { SCENARIOS, type ActionItem, type Scenario } from '../src/data/scenarios.js';

type TriageDecision = 'apply_action' | 'apply_payout' | 'discard' | 'hold';

interface CliOptions {
    cookbookReport: string | null;
    reportDir: string;
    triageReport: string | null;
}

interface ReportStep {
    actionType: 'dampen' | 'place' | 'stoke';
    itemName: string;
    qty: number;
    resourceId: string | null;
    timing: string | null;
    unknown: boolean;
}

interface CookbookVariant {
    recipeActions: {
        dampen: ReportStep[];
        place: ReportStep[];
        stoke: ReportStep[];
    };
    reward: number;
    scenarioName: string;
}

interface CookbookMatch {
    scenarioName: string;
    variants: CookbookVariant[];
}

interface CookbookReport {
    consensusUpdateMatches: CookbookMatch[];
}

interface SelectedVariant {
    actionChanges: string[];
    actionMatch: boolean;
    actionUnknown: boolean;
    payoutDeltaPct: number;
    ppnDeltaPct: number;
    recipeActions: {
        dampen: ReportStep[];
        place: ReportStep[];
        stoke: ReportStep[];
    };
    reward: number;
    source: string;
}

interface TriageEntry {
    decision: TriageDecision;
    scenarioName: string;
    selectedVariant: SelectedVariant | null;
}

interface TriageReport {
    entries: TriageEntry[];
}

interface Replacement {
    end: number;
    scenarioName: string;
    start: number;
    text: string;
}

const DEFAULT_REPORT_DIR = path.join('reports', 'userscripts', 'arsonists-ledger');
const SCENARIOS_PATH = path.join('src', 'data', 'scenarios.ts');

function printHelp(): void {
    console.log([
        'Usage: pnpm exec tsx scripts/apply-arson-cookbook-triage.ts [options]',
        '',
        'Options:',
        '  --cookbook-report <path>   Use a specific .cookbooks.json report.',
        '  --triage-report <path>     Use a specific .cookbook-conflicts.json report.',
        `  --report-dir <path>        Directory to search for the latest cookbook + triage reports. Default: ${DEFAULT_REPORT_DIR}`,
        '  --help                     Show this message.',
    ].join('\n'));
}

function parseArgs(argv: string[]): CliOptions {
    let cookbookReport: string | null = null;
    let reportDir = DEFAULT_REPORT_DIR;
    let triageReport: string | null = null;

    for (let i = 0; i < argv.length; i++) {
        const arg = argv[i];
        if (arg === '--help') {
            printHelp();
            process.exit(0);
        }
        if (arg === '--cookbook-report') {
            cookbookReport = argv[++i] ?? null;
            if (!cookbookReport) throw new Error('`--cookbook-report` requires a path.');
            continue;
        }
        if (arg === '--triage-report') {
            triageReport = argv[++i] ?? null;
            if (!triageReport) throw new Error('`--triage-report` requires a path.');
            continue;
        }
        if (arg === '--report-dir') {
            reportDir = argv[++i] ?? '';
            if (!reportDir) throw new Error('`--report-dir` requires a path.');
            continue;
        }
        throw new Error(`Unknown argument: ${arg}`);
    }

    return { cookbookReport, reportDir, triageReport };
}

function latestReportPath(reportDir: string, suffix: string, description: string): string {
    const candidates = readdirSync(reportDir)
        .filter((name) => name.endsWith(suffix))
        .sort()
        .reverse();

    if (candidates.length === 0) {
        throw new Error(`No ${description} reports found in ${reportDir}`);
    }

    return path.join(reportDir, candidates[0]);
}

function latestCookbookReportPath(reportDir: string): string {
    return latestReportPath(reportDir, '.cookbooks.json', 'cookbook');
}

function latestTriageReportPath(reportDir: string): string {
    return latestReportPath(reportDir, '.cookbook-conflicts.json', 'triage');
}

function collectScenarioNodes(sourceFile: ts.SourceFile): Map<string, ts.ObjectLiteralExpression> {
    const result = new Map<string, ts.ObjectLiteralExpression>();

    sourceFile.forEachChild(function visit(node) {
        if (
            ts.isVariableStatement(node) &&
            node.declarationList.declarations.length === 1
        ) {
            const decl = node.declarationList.declarations[0];
            if (
                decl &&
                ts.isIdentifier(decl.name) &&
                decl.name.text === 'SCENARIOS' &&
                decl.initializer &&
                ts.isArrayLiteralExpression(decl.initializer)
            ) {
                for (const element of decl.initializer.elements) {
                    if (!ts.isObjectLiteralExpression(element)) continue;
                    const scenarioNameProp = element.properties.find((prop) =>
                        ts.isPropertyAssignment(prop) &&
                        ts.isIdentifier(prop.name) &&
                        prop.name.text === 'scenarioName' &&
                        ts.isStringLiteral(prop.initializer),
                    );
                    if (!scenarioNameProp || !ts.isPropertyAssignment(scenarioNameProp) || !ts.isStringLiteral(scenarioNameProp.initializer)) continue;
                    result.set(scenarioNameProp.initializer.text, element);
                }
            }
        }
        node.forEachChild(visit);
    });

    return result;
}

function resourceConst(resourceId: string): string {
    const entry = Object.values(CATALOG).find((resource) => resource.id === resourceId);
    if (!entry) throw new Error(`Unknown resourceId: ${resourceId}`);
    return entry.id.toUpperCase();
}

function renderCurrentActionItem(item: ActionItem): string {
    const parts = [
        `resourceId: RESOURCE.${resourceConst(item.resourceId)}`,
        `qty: ${item.qty}`,
    ];

    if (item.optional) parts.push('optional: true');
    if (item.optionalLabel) parts.push(`optionalLabel: ${JSON.stringify(item.optionalLabel)}`);

    return `{ ${parts.join(', ')} }`;
}

function renderCurrentActionItems(items: ActionItem[] | undefined): string | null {
    if (!items?.length) return null;
    return `[${items.map((item) => renderCurrentActionItem(item)).join(', ')}]`;
}

function mergeSteps(steps: ReportStep[]): ReportStep[] {
    const merged = new Map<string, ReportStep>();

    for (const step of steps) {
        if (!step.resourceId || step.unknown) {
            throw new Error(`Cannot apply cookbook step "${step.itemName}" because it is unknown.`);
        }

        const key = `${step.actionType}:${step.resourceId}`;
        const existing = merged.get(key);
        if (existing) {
            existing.qty += step.qty;
            continue;
        }

        merged.set(key, { ...step, timing: null });
    }

    return [...merged.values()].sort((a, b) => a.resourceId!.localeCompare(b.resourceId!));
}

function renderCookbookItems(steps: ReportStep[]): string | null {
    if (steps.length === 0) return null;

    return `[${steps
        .map((step) => `{ resourceId: RESOURCE.${resourceConst(step.resourceId!)}, qty: ${step.qty} }`)
        .join(', ')}]`;
}

function indent(text: string, prefix: string): string {
    return text.split('\n').map((line) => `${prefix}${line}`).join('\n');
}

function renderUpdatedActions(
    scenario: Scenario,
    recipeActions: {
        dampen: ReportStep[];
        place: ReportStep[];
        stoke: ReportStep[];
    },
): string {
    const lines: string[] = [];
    const evidence = renderCurrentActionItems(scenario.actions.evidence);
    const ignite = renderCurrentActionItems(scenario.actions.ignite);
    const place = renderCookbookItems(mergeSteps(recipeActions.place));
    const stoke = renderCookbookItems(mergeSteps(recipeActions.stoke));
    const dampen = renderCookbookItems(mergeSteps(recipeActions.dampen));

    if (!place) {
        throw new Error(`Scenario "${scenario.scenarioName}" cannot be applied because the selected cookbook variant has no place actions.`);
    }

    if (evidence) lines.push(`evidence: ${evidence},`);
    if (ignite) lines.push(`ignite: ${ignite},`);
    lines.push(`place: ${place},`);

    if (stoke) {
        lines.push(`stoke: ${stoke},`);
        if (recipeActions.stoke.some((step) => step.timing)) lines.push('stokeTime: "late",');
    }

    if (dampen) {
        lines.push(`dampen: ${dampen},`);
        if (recipeActions.dampen.some((step) => step.timing)) lines.push('dampenTime: "late",');
    }

    return `{\n${indent(lines.join('\n'), '      ')}\n    }`;
}

function bestCookbookVariant(variants: CookbookVariant[]): CookbookVariant {
    return variants[0]!;
}

function buildConsensusReplacements(
    sourceText: string,
    sourceFile: ts.SourceFile,
    report: CookbookReport,
): { replacements: Replacement[]; updatedCount: number } {
    const scenarioNodes = collectScenarioNodes(sourceFile);
    const currentByName = new Map(SCENARIOS.map((scenario) => [scenario.scenarioName, scenario]));
    const replacements: Replacement[] = [];

    for (const match of report.consensusUpdateMatches) {
        const current = currentByName.get(match.scenarioName);
        const node = scenarioNodes.get(match.scenarioName);
        if (!current || !node) continue;

        const original = sourceText.slice(node.getStart(sourceFile), node.getEnd());
        const updatedPayout = bestCookbookVariant(match.variants).reward.toLocaleString('en-US').replace(/,/g, '_');
        const payoutMatch = original.match(/payout:\s*[0-9_]+,/);
        const actionsMatch = original.match(/actions:\s*\{[\s\S]*?\n    \}/);
        if (!payoutMatch || !actionsMatch) {
            throw new Error(`Could not locate payout/actions block for consensus scenario "${match.scenarioName}".`);
        }

        let next = original.replace(payoutMatch[0], `payout: ${updatedPayout},`);
        next = next.replace(actionsMatch[0], `actions: ${renderUpdatedActions(current, bestCookbookVariant(match.variants).recipeActions)}`);
        next = next.replace(/\n\s*needsVerification:\s*true,/, '');

        replacements.push({
            end: node.getEnd(),
            scenarioName: match.scenarioName,
            start: node.getStart(sourceFile),
            text: next,
        });
    }

    return { replacements, updatedCount: replacements.length };
}

function buildTriageReplacements(
    sourceText: string,
    sourceFile: ts.SourceFile,
    report: TriageReport,
): { applyActionCount: number; applyPayoutCount: number; replacements: Replacement[] } {
    const scenarioNodes = collectScenarioNodes(sourceFile);
    const currentByName = new Map(SCENARIOS.map((scenario) => [scenario.scenarioName, scenario]));
    const replacements: Replacement[] = [];
    let applyActionCount = 0;
    let applyPayoutCount = 0;

    for (const entry of report.entries) {
        if (entry.decision !== 'apply_action' && entry.decision !== 'apply_payout') continue;

        const current = currentByName.get(entry.scenarioName);
        const node = scenarioNodes.get(entry.scenarioName);
        if (!current || !node) continue;
        if (!entry.selectedVariant) {
            throw new Error(`Scenario "${entry.scenarioName}" is missing selectedVariant payload. Re-run triage with the updated script.`);
        }

        const original = sourceText.slice(node.getStart(sourceFile), node.getEnd());
        const updatedPayout = entry.selectedVariant.reward.toLocaleString('en-US').replace(/,/g, '_');
        const payoutMatch = original.match(/payout:\s*[0-9_]+,/);
        if (!payoutMatch) {
            throw new Error(`Could not locate payout for scenario "${entry.scenarioName}".`);
        }

        let next = original.replace(payoutMatch[0], `payout: ${updatedPayout},`);

        if (entry.decision === 'apply_action') {
            if (entry.selectedVariant.actionUnknown) {
                throw new Error(`Scenario "${entry.scenarioName}" has unknown cookbook actions and cannot be auto-applied.`);
            }

            const actionsMatch = original.match(/actions:\s*\{[\s\S]*?\n    \}/);
            if (!actionsMatch) {
                throw new Error(`Could not locate actions block for scenario "${entry.scenarioName}".`);
            }

            next = next.replace(actionsMatch[0], `actions: ${renderUpdatedActions(current, entry.selectedVariant.recipeActions)}`);
            applyActionCount++;
        } else {
            applyPayoutCount++;
        }

        next = next.replace(/\n\s*needsVerification:\s*true,/, '');

        replacements.push({
            end: node.getEnd(),
            scenarioName: entry.scenarioName,
            start: node.getStart(sourceFile),
            text: next,
        });
    }

    return { applyActionCount, applyPayoutCount, replacements };
}

function assertNoOverlap(replacements: Replacement[]): void {
    const seen = new Set<string>();
    for (const replacement of replacements) {
        if (seen.has(replacement.scenarioName)) {
            throw new Error(`Multiple cookbook replacements target scenario "${replacement.scenarioName}".`);
        }
        seen.add(replacement.scenarioName);
    }
}

const options = parseArgs(process.argv.slice(2));
const cookbookReportPath = options.cookbookReport ?? latestCookbookReportPath(options.reportDir);
const triageReportPath = options.triageReport ?? latestTriageReportPath(options.reportDir);
const cookbookReport = JSON.parse(readFileSync(cookbookReportPath, 'utf8')) as CookbookReport;
const triageReport = JSON.parse(readFileSync(triageReportPath, 'utf8')) as TriageReport;
const sourceText = readFileSync(SCENARIOS_PATH, 'utf8');
const sourceFile = ts.createSourceFile(SCENARIOS_PATH, sourceText, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
const consensus = buildConsensusReplacements(sourceText, sourceFile, cookbookReport);
const triage = buildTriageReplacements(sourceText, sourceFile, triageReport);
const replacements = [...consensus.replacements, ...triage.replacements];
assertNoOverlap(replacements);

let updated = sourceText;
for (const replacement of replacements.sort((a, b) => b.start - a.start)) {
    updated = updated.slice(0, replacement.start) + replacement.text + updated.slice(replacement.end);
}

writeFileSync(SCENARIOS_PATH, updated);
console.log(`Applied consensus updates: ${consensus.updatedCount}`);
console.log(`Applied triage action updates: ${triage.applyActionCount}`);
console.log(`Applied triage payout updates: ${triage.applyPayoutCount}`);
console.log(`Total scenarios updated: ${replacements.length}`);
