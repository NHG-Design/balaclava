import { writeFileSync, mkdirSync } from 'fs';
import { createHash } from 'crypto';
import { CATALOG, type ResourceId } from '../src/data/catalog.js';
import {
    ACCELERANT_INFO,
    IGNITER_INFO,
    DAMPENER_INFO,
} from '../src/data/arson-information.js';

const materials = Object.values(CATALOG).map((resource) => {
    const id = resource.id as ResourceId;
    const info = ACCELERANT_INFO[id] ?? IGNITER_INFO[id] ?? DAMPENER_INFO[id];
    return info ? { ...resource, ...info } : { ...resource };
});

const json = JSON.stringify(materials);
const hash = createHash('sha1').update(json).digest('hex').slice(0, 12);

mkdirSync('static/arsonists-ledger', { recursive: true });
writeFileSync('static/arsonists-ledger/materials.json', json);
writeFileSync('src/data/materials-version.ts', `export const MATERIALS_VERSION = '${hash}';\n`);
console.log(`Wrote ${materials.length} materials to static/arsonists-ledger/materials.json (hash: ${hash})`);
