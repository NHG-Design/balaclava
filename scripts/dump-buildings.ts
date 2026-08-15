import { writeFileSync, mkdirSync } from 'fs';
import { createHash } from 'crypto';
import { BUILDINGS } from '../src/data/buildings.js';

const json = JSON.stringify(BUILDINGS);
const hash = createHash('sha1').update(json).digest('hex').slice(0, 12);

mkdirSync('static/arsonists-ledger', { recursive: true });
writeFileSync('static/arsonists-ledger/buildings.json', json);
writeFileSync('src/data/buildings-version.ts', `export const BUILDINGS_VERSION = '${hash}';\n`);
console.log(`Wrote ${Object.keys(BUILDINGS).length} buildings to static/arsonists-ledger/buildings.json (hash: ${hash})`);
