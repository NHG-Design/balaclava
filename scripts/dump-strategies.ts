import { writeFileSync, mkdirSync } from 'fs';
import { createHash } from 'crypto';
import { STRATEGIES } from '../src/data/strategies.js';

const json = JSON.stringify(STRATEGIES);
const hash = createHash('sha1').update(json).digest('hex').slice(0, 8);

mkdirSync('static/pyromaniacs-ledger', { recursive: true });
writeFileSync('static/pyromaniacs-ledger/strategies.json', json);
writeFileSync('src/data/strategies-version.ts', `export const STRATEGIES_VERSION = '${hash}';\n`);
console.log(`Wrote ${STRATEGIES.length} strategies to static/pyromaniacs-ledger/strategies.json (hash: ${hash})`);
