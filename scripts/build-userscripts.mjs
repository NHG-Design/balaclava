import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'fs';

const DIST_BASE = 'https://raw.githubusercontent.com/NHG-Design/balaclava/main/dist';
const BALACLAVA_BASE = 'https://balaclava.app';

const COMMON_METADATA = {
    namespace: 'https://github.com/NHG-Design/balaclava',
    author: 'Yukio [906148]',
    supportURL: 'https://github.com/NHG-Design/balaclava/issues',
    license: 'MIT',
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
            description: 'Universal tooltip injection for userscript managers',
            updateURL: `${DIST_BASE}/balaclava-tooltip.meta.js`,
            downloadURL: `${DIST_BASE}/balaclava-tooltip.user.js`,
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
            version: '0.4.2',
            description: "Arson profit-per-nerve calculator and strategy guide for Torn's Crimes page",
            icon: 'https://www.google.com/s2/favicons?sz=64&domain=torn.com',
            updateURL: `${DIST_BASE}/pyromaniacs-ledger.meta.js`,
            downloadURL: `${DIST_BASE}/pyromaniacs-ledger.user.js`,
            match: 'https://www.torn.com/page.php?sid=crimes*',
            grant: ['GM_setValue', 'GM_getValue', 'unsafeWindow', 'GM_xmlhttpRequest'],
            require: `${DIST_BASE}/balaclava-tooltip.user.js`,
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
    ['license', '@license'],
    ['supportURL', '@supportURL'],
    ['updateURL', '@updateURL'],
    ['downloadURL', '@downloadURL'],
    ['match', '@match'],
    ['grant', '@grant'],
    ['require', '@require'],
    ['resource', '@resource'],
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

execSync('pnpm exec tsx scripts/dump-strategies.ts', { stdio: 'inherit' });

for (const userscript of USERSCRIPTS) {
    execSync(
        `pnpm exec esbuild ${userscript.entry}` +
        ' --bundle --format=iife --target=es2020 --tree-shaking=true' +
        ` --outfile=${userscript.outfile} --log-level=info`,
        { stdio: 'inherit' }
    );

    const header = createUserscriptHeader(userscript.metadata);
    const bundle = readFileSync(userscript.outfile, 'utf8');
    writeFileSync(userscript.outfile, `${header}\n\n${bundle}`);

    const metaFile = userscript.outfile.replace('.user.js', '.meta.js');
    writeFileSync(metaFile, `${header}\n`);

    console.log(`Built ${userscript.outfile}.`);
}
