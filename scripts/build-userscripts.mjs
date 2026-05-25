import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'fs';

const COMMON_METADATA = {
    namespace: 'https://github.com/NHG-Design/balaclava',
    author: 'Balaclava',
    runAt: 'document-idle',
};

const USERSCRIPTS = [
    {
        entry: 'src/userscripts/balaclava-tooltip/index.ts',
        outfile: 'dist/balaclava-tooltip.user.js',
        metadata: {
            ...COMMON_METADATA,
            name: 'Balaclava Tooltip',
            version: '1.0.1',
            description: 'Universal tooltip injection via Tampermonkey',
            match: '*://*/*',
            grant: 'unsafeWindow',
        },
    },
    {
        entry: 'src/userscripts/pyromaniacs-ledger/index.ts',
        outfile: 'dist/pyromaniacs-ledger.user.js',
        metadata: {
            ...COMMON_METADATA,
            name: "Torn Pyromaniac's Ledger",
            version: '0.1.0',
            description: "Arson profit-per-nerve calculator and strategy guide for Torn's Crimes page",
            icon: 'https://www.google.com/s2/favicons?sz=64&domain=torn.com',
            match: 'https://www.torn.com/page.php?sid=crimes*',
            grant: ['GM_setValue', 'GM_getValue', 'unsafeWindow'],
            require: 'https://raw.githubusercontent.com/NHG-Design/balaclava/main/dist/balaclava-tooltip.user.js',
        },
    },
];

const METADATA_FIELDS = [
    ['name', '@name'],
    ['namespace', '@namespace'],
    ['version', '@version'],
    ['description', '@description'],
    ['icon', '@icon'],
    ['author', '@author'],
    ['match', '@match'],
    ['grant', '@grant'],
    ['require', '@require'],
    ['runAt', '@run-at'],
];

function createUserscriptHeader(metadata) {
    const lines = ['// ==UserScript=='];

    for (const [key, tag] of METADATA_FIELDS) {
        const rawValue = metadata[key];
        if (rawValue === undefined || rawValue === null) continue;

        const values = Array.isArray(rawValue) ? rawValue : [rawValue];
        for (const value of values) {
            lines.push(`// ${tag.padEnd(12)} ${value}`);
        }
    }

    lines.push('// ==/UserScript==');
    return lines.join('\n');
}

for (const userscript of USERSCRIPTS) {
    execSync(
        `pnpm exec esbuild ${userscript.entry}` +
        ' --bundle --format=iife --target=es2020 --tree-shaking=true' +
        ` --outfile=${userscript.outfile} --log-level=info`,
        { stdio: 'inherit' }
    );

    const header = `${createUserscriptHeader(userscript.metadata)}\n\n`;
    const bundle = readFileSync(userscript.outfile, 'utf8');
    writeFileSync(userscript.outfile, header + bundle);

    console.log(`Built ${userscript.outfile}.`);
}
