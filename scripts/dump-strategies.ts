import { writeFileSync, mkdirSync } from 'fs';
import { STRATEGIES } from '../src/data/strategies.js';

mkdirSync('static/pyromaniacs-ledger', { recursive: true });
writeFileSync('static/pyromaniacs-ledger/strategies.json', JSON.stringify(STRATEGIES));
console.log(`Wrote ${STRATEGIES.length} strategies to static/pyromaniacs-ledger/strategies.json`);
