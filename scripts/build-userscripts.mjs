import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'fs';
import { build } from 'esbuild';

const versions = JSON.parse(readFileSync('versions.json', 'utf8'));

const DIST_BASE = 'https://raw.githubusercontent.com/NHG-Design/balaclava/main/dist';
const BALACLAVA_BASE = 'https://balaclava.app';

const COMMON_METADATA = {
    namespace: 'https://github.com/NHG-Design/balaclava',
    author: 'Yukio [906148]',
    supportURL: 'https://github.com/NHG-Design/balaclava/issues',
    license: 'MIT',
    runAt: 'document-idle',
};

// Static modules: built as clean IIFEs served from Cloudflare Pages.
// When TornPDA ships @require support (https://github.com/Manuito83/torn-pda/pull/452),
// add `require` entries to the relevant USERSCRIPTS metadata and remove inline imports.
const STATIC_MODULES = [
    {
        entry: 'src/userscripts/balaclava-tooltip/index.ts',
        outfile: 'static/balaclava-tooltip.js',
    },
    {
        entry: 'src/userscripts/arsonists-ledger/scenarios.ts',
        outfile: 'static/pyromaniacs-ledger/scenarios.js',
    },
];

const USERSCRIPTS = [
    {
        entry: 'src/userscripts/balaclava-tooltip/index.ts',
        outfile: 'dist/balaclava-tooltip.user.js',
        metadata: {
            ...COMMON_METADATA,
            name: 'Balaclava Tooltip',
            version: versions['balaclava-tooltip'],
            description: 'Universal tooltip injection for userscript managers',
            updateURL: `${DIST_BASE}/balaclava-tooltip.meta.js`,
            downloadURL: `${DIST_BASE}/balaclava-tooltip.user.js`,
            match: '*://*/*',
            grant: 'unsafeWindow',
        },
    },
    {
        entry: 'src/userscripts/arsonists-ledger/index.ts',
        outfile: 'dist/arsonists-ledger.user.js',
        metadata: {
            ...COMMON_METADATA,
            name: "Torn Arsonist's Ledger",
            version: versions['arsonists-ledger'],
            description: "Arson profit-per-nerve calculator and scenario guide for Torn's Crimes page",
            icon: 'https://www.google.com/s2/favicons?sz=64&domain=torn.com',
            updateURL: `${DIST_BASE}/arsonists-ledger.meta.js`,
            downloadURL: `${DIST_BASE}/arsonists-ledger.user.js`,
            match: 'https://www.torn.com/page.php?sid=crimes*',
            grant: ['GM_setValue', 'GM_getValue', 'unsafeWindow', 'GM_xmlhttpRequest'],
            connect: 'balaclava.app',
            // TODO: uncomment + remove inline imports when TornPDA ships @require (PR #452):
            // require: [
            //     `${BALACLAVA_BASE}/balaclava-tooltip.js`,
            //     `${BALACLAVA_BASE}/pyromaniacs-ledger/scenarios.js`,
            // ],
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
    ['connect', '@connect'],
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

execSync('pnpm exec tsx scripts/dump-scenarios.ts', { stdio: 'inherit' });

for (const mod of STATIC_MODULES) {
    await build({
        entryPoints: [mod.entry],
        bundle: true,
        format: 'iife',
        target: 'es2020',
        treeShaking: true,
        outfile: mod.outfile,
        logLevel: 'info',
    });
    console.log(`Built ${mod.outfile}.`);
}

for (const userscript of USERSCRIPTS) {
    await build({
        entryPoints: [userscript.entry],
        bundle: true,
        format: 'iife',
        target: 'es2020',
        treeShaking: true,
        outfile: userscript.outfile,
        logLevel: 'info',
    });

    const header = createUserscriptHeader(userscript.metadata);
    const bundle = readFileSync(userscript.outfile, 'utf8');
    writeFileSync(userscript.outfile, `${header}\n\n${bundle}`);

    const metaFile = userscript.outfile.replace('.user.js', '.meta.js');
    writeFileSync(metaFile, `${header}\n`);

    console.log(`Built ${userscript.outfile}.`);
}
