import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';

execSync(
    'pnpm exec esbuild src/userscripts/pyromaniacs-ledger/index.ts' +
    ' --bundle --format=iife --target=es2020 --tree-shaking=true' +
    ' --outfile=dist/pyromaniacs-ledger.user.js --log-level=info',
    { stdio: 'inherit' }
);

// Extract the @UserScript header from the entrypoint source and prepend it
const src = readFileSync('src/userscripts/pyromaniacs-ledger/index.ts', 'utf8');
const headerMatch = src.match(/\/\/ ==UserScript==([\s\S]*?)\/\/ ==\/UserScript==/);

if (headerMatch) {
    const header = `${headerMatch[0]}\n\n`;
    const bundle = readFileSync('dist/pyromaniacs-ledger.user.js', 'utf8');
    writeFileSync('dist/pyromaniacs-ledger.user.js', header + bundle);
    console.log('Prepended userscript header.');
}
