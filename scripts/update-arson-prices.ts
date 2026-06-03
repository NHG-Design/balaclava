import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

import { CATALOG } from '../src/data/catalog.js';

function printHelp(): void {
    console.log([
        'Usage: pnpm exec tsx scripts/update-arson-prices.ts',
        '',
        'Refreshes default consumable prices in src/data/catalog.ts from the Torn items endpoint',
        'using TORN_PUBLIC_API_KEY from the environment or .dev.vars.',
    ].join('\n'));
}

function loadEnvValue(name: string): string {
    const direct = process.env[name];
    if (direct) return direct;

    const envPath = path.join(process.cwd(), '.dev.vars');
    const content = readFileSync(envPath, 'utf8');
    for (const line of content.split(/\r?\n/)) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const idx = trimmed.indexOf('=');
        if (idx === -1) continue;
        if (trimmed.slice(0, idx).trim() !== name) continue;
        return trimmed.slice(idx + 1);
    }

    throw new Error(`Missing ${name} in environment or .dev.vars.`);
}

function formatNumberLiteral(value: number): string {
    return Math.trunc(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '_');
}

async function main(): Promise<void> {
    if (process.argv.includes('--help')) {
        printHelp();
        return;
    }

    const apiKey = loadEnvValue('TORN_PUBLIC_API_KEY');
    const response = await fetch(`https://api.torn.com/v2/torn/items?cat=All&sort=ASC&key=${encodeURIComponent(apiKey)}`);
    if (!response.ok) throw new Error(`Torn items request failed: HTTP ${response.status}`);

    const payload = await response.json() as {
        error?: { error?: string };
        items?: Array<{ id: number; value?: { market_price?: number } }>;
    };
    if (payload.error?.error) throw new Error(payload.error.error);
    if (!Array.isArray(payload.items)) throw new Error('Unexpected Torn items response.');

    const priceByTornId = new Map<number, number>();
    for (const item of payload.items) {
        const price = item.value?.market_price;
        if (typeof price === 'number' && price > 0) priceByTornId.set(item.id, price);
    }

    const sourcePath = path.join(process.cwd(), 'src', 'data', 'catalog.ts');
    let source = readFileSync(sourcePath, 'utf8');
    const updatedIds: string[] = [];

    source = source.replace(
        /export const CATALOG_UPDATED = '\d{4}-\d{2}-\d{2}';/,
        `export const CATALOG_UPDATED = '${new Date().toISOString().slice(0, 10)}';`,
    );

    for (const resource of Object.values(CATALOG)) {
        if (resource.isTool || resource.tornId === undefined) continue;
        const nextPrice = priceByTornId.get(resource.tornId);
        if (!nextPrice) continue;

        const escapedId = resource.id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const pattern = new RegExp(`(\\[RESOURCE\\.[^\\]]+\\]:\\s*\\{[^\\n]*id:\\s*RESOURCE\\.[^,]+,[^\\n]*defaultPrice:\\s*)([\\d_]+)(,\\s*tornId:\\s*${resource.tornId}\\s*\\})`);
        const next = source.replace(pattern, `$1${formatNumberLiteral(nextPrice)}$3`);
        if (next !== source) {
            source = next;
            updatedIds.push(escapedId);
        }
    }

    writeFileSync(sourcePath, source);
    console.log(JSON.stringify({
        updatedConsumables: updatedIds.length,
        updatedOnUtc: new Date().toISOString(),
    }, null, 2));
}

main().catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
});
