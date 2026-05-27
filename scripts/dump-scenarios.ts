import { writeFileSync, mkdirSync } from 'fs';
import { createHash } from 'crypto';
import { SCENARIOS } from '../src/data/scenarios.js';
import type { Scenario } from '../src/data/scenarios.js';

function deduplicateScenarios(scenarios: Scenario[]): Scenario[] {
    const groups = new Map<string, Scenario[]>();
    for (const s of scenarios) {
        const key = s.scenarioName;
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key)!.push(s);
    }
    const result: Scenario[] = [];
    for (const group of groups.values()) {
        if (group.length === 1) {
            result.push(group[0]);
        } else {
            const ftVersions = group.filter(s =>
                s.actions.ignite?.some(i => i.resourceId === 'flamethrower') ?? false,
            );
            result.push(...(ftVersions.length > 0 ? ftVersions : [group[0]]));
        }
    }
    return result;
}

const scenarios = deduplicateScenarios(SCENARIOS);
const json = JSON.stringify(scenarios);
const hash = createHash('sha1').update(json).digest('hex').slice(0, 8);

mkdirSync('static/arsonists-ledger', { recursive: true });
writeFileSync('static/arsonists-ledger/scenarios.json', json);
writeFileSync('src/data/scenarios-version.ts', `export const SCENARIOS_VERSION = '${hash}';\n`);
console.log(`Wrote ${scenarios.length} scenarios (deduped from ${SCENARIOS.length}) to static/arsonists-ledger/scenarios.json (hash: ${hash})`);
