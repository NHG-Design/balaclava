import { writeFileSync, mkdirSync, readdirSync, readFileSync } from 'fs';
import { createHash } from 'crypto';
import path from 'path';
import { SCENARIOS } from '../src/data/scenarios.js';
import type { ObservedPayout, Scenario } from '../src/data/scenarios.js';

function assertUniqueScenarioNames(scenarios: Scenario[]): void {
    const seen = new Set<string>();
    const duplicates = new Set<string>();

    for (const scenario of scenarios) {
        if (seen.has(scenario.scenarioName)) duplicates.add(scenario.scenarioName);
        seen.add(scenario.scenarioName);
    }

    if (duplicates.size > 0) {
        throw new Error(`Duplicate scenarioName values are not allowed: ${[...duplicates].sort().join(', ')}`);
    }
}

function latestAuditReportPath(): string | null {
    const reportDir = path.join('reports', 'userscripts', 'arsonists-ledger');

    try {
        const candidates = readdirSync(reportDir)
            .filter(name => name.endsWith('.arsons.json'))
            .sort()
            .reverse();
        return candidates.length > 0 ? path.join(reportDir, candidates[0]) : null;
    } catch {
        return null;
    }
}

function readObservedPayouts(): Record<string, ObservedPayout> {
    const reportPath = latestAuditReportPath();
    if (!reportPath) return {};

    try {
        const report = JSON.parse(readFileSync(reportPath, 'utf8')) as {
            scenarios?: Array<{
                scenarioName?: string;
                observedRunCount?: number;
                payoutRange?: { min: number; max: number } | null;
            }>;
        };

        const observed: Record<string, ObservedPayout> = {};
        for (const scenario of report.scenarios ?? []) {
            if (!scenario?.scenarioName || !scenario.payoutRange) continue;
            const runs = scenario.observedRunCount ?? 0;
            if (runs <= 0) continue;
            observed[scenario.scenarioName] = {
                min: scenario.payoutRange.min,
                max: scenario.payoutRange.max,
                runs,
            };
        }
        return observed;
    } catch {
        return {};
    }
}

assertUniqueScenarioNames(SCENARIOS);
const observedPayouts = readObservedPayouts();
const scenarios = SCENARIOS.map((scenario): Scenario => {
    const observedPayout = observedPayouts[scenario.scenarioName];
    return observedPayout ? { ...scenario, observedPayout } : scenario;
});
const json = JSON.stringify(scenarios);
const hash = createHash('sha1').update(json).digest('hex').slice(0, 8);
const observationsModule = [
    "import type { ObservedPayout } from './scenarios.js';",
    '',
    `export const OBSERVED_PAYOUTS: Record<string, ObservedPayout> = ${JSON.stringify(observedPayouts, null, 4)};`,
    '',
].join('\n');

mkdirSync('static/arsonists-ledger', { recursive: true });
writeFileSync('static/arsonists-ledger/scenarios.json', json);
writeFileSync('src/data/scenario-observations.ts', observationsModule);
writeFileSync('src/data/scenarios-version.ts', `export const SCENARIOS_VERSION = '${hash}';\n`);
console.log(`Wrote ${scenarios.length} scenarios to static/arsonists-ledger/scenarios.json (hash: ${hash})`);
