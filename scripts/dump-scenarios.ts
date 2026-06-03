import { writeFileSync, mkdirSync } from 'fs';
import { createHash } from 'crypto';
import { SCENARIOS } from '../src/data/scenarios.js';
import type { Scenario } from '../src/data/scenarios.js';

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

assertUniqueScenarioNames(SCENARIOS);
const scenarios = SCENARIOS;
const json = JSON.stringify(scenarios);
const hash = createHash('sha1').update(json).digest('hex').slice(0, 8);

mkdirSync('static/arsonists-ledger', { recursive: true });
writeFileSync('static/arsonists-ledger/scenarios.json', json);
writeFileSync('src/data/scenarios-version.ts', `export const SCENARIOS_VERSION = '${hash}';\n`);
console.log(`Wrote ${scenarios.length} scenarios to static/arsonists-ledger/scenarios.json (hash: ${hash})`);
