import { writeFileSync, mkdirSync } from 'fs';
import { createHash } from 'crypto';
import { SCENARIOS } from '../src/data/scenarios.js';

const json = JSON.stringify(SCENARIOS);
const hash = createHash('sha1').update(json).digest('hex').slice(0, 8);

mkdirSync('static/pyromaniacs-ledger', { recursive: true });
writeFileSync('static/pyromaniacs-ledger/scenarios.json', json);
writeFileSync('src/data/scenarios-version.ts', `export const SCENARIOS_VERSION = '${hash}';\n`);
console.log(`Wrote ${SCENARIOS.length} scenarios to static/pyromaniacs-ledger/scenarios.json (hash: ${hash})`);
