import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { SCENARIOS } from '../src/data/scenarios.js';
import { CATALOG } from '../src/data/catalog.js';
import type { Scenario, ActionItem } from '../src/data/scenarios.js';

const COOKBOOK_DIR = 'plans/arson/cookbooks';

interface CookbookRow {
    location: string;
    story: string;
    reward: number;
    place: string;
    stoke: string;
}

function parseCsvLine(line: string): string[] {
    const fields: string[] = [];
    let field = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
        const c = line[i];
        if (inQuotes) {
            if (c === '"') {
                if (line[i + 1] === '"') { field += '"'; i++; }
                else inQuotes = false;
            } else field += c;
        } else {
            if (c === '"') inQuotes = true;
            else if (c === ',') { fields.push(field); field = ''; }
            else field += c;
        }
    }
    fields.push(field);
    return fields;
}

function parseCookbook(path: string): CookbookRow[] {
    const text = readFileSync(path, 'utf-8');
    const lines = text.split(/\r?\n/).filter((l) => l.length > 0);
    const header = parseCsvLine(lines[0]);
    const idx = (name: string) => header.indexOf(name);
    const iLocation = idx('Location'), iStory = idx('Story'), iReward = idx('Reward'), iPlace = idx('Place'), iStoke = idx('Stoke');

    return lines.slice(1).map((line) => {
        const f = parseCsvLine(line);
        return {
            location: f[iLocation],
            story: f[iStory],
            reward: Number(f[iReward]),
            place: f[iPlace] ?? '',
            stoke: f[iStoke] ?? '',
        };
    });
}

/** Resource display names, e.g. "Hydrogen Tank" -> lowercased for comparison. */
const RESOURCE_NAME_BY_ID = new Map<string, string>(
    Object.values(CATALOG).map((r) => [r.id, r.name.toLowerCase()])
);

function multiset(names: string[]): string {
    return [...names].map((n) => n.toLowerCase().trim()).filter(Boolean).sort().join('|');
}

/** Expand qty into repeated names, e.g. 2x Gasoline -> ["gasoline", "gasoline"]. */
function canonicalPlaceNames(items: ActionItem[] | undefined): string[] {
    if (!items) return [];
    const names: string[] = [];
    for (const item of items) {
        if (item.optional) continue;
        const name = RESOURCE_NAME_BY_ID.get(item.resourceId) ?? item.resourceId;
        for (let i = 0; i < item.qty; i++) names.push(name);
    }
    return names;
}

function canonicalStokeNames(items: ActionItem[] | undefined): string[] {
    if (!items) return [];
    return items.filter((i) => !i.optional).map((i) => RESOURCE_NAME_BY_ID.get(i.resourceId) ?? i.resourceId);
}

/** CSV "Place"/"Stoke" cells: "Gasoline; Gasoline" or "Hydrogen Tank (3s); Hydrogen Tank (2s)". Strip timing suffixes. */
function csvCellNames(cell: string): string[] {
    return cell
        .split(';')
        .map((s) => s.replace(/\([^)]*\)/g, '').trim())
        .filter(Boolean);
}

function loadCookbookRows(): CookbookRow[] {
    const files = readdirSync(COOKBOOK_DIR).filter((f) => f.endsWith('.csv'));
    return files.flatMap((f) => parseCookbook(join(COOKBOOK_DIR, f)));
}

interface ScenarioReport {
    scenarioName: string;
    matchedCount: number;
    min: number | null;
    max: number | null;
    currentPayoutMin: number;
    currentPayoutMax: number;
    /** Was payoutMin/payoutMax already a range (not a single value) before this analysis? */
    wasRange: boolean;
    /**
     * The recommended new payoutMin/payoutMax per the established policy — null when no
     * recommendation applies (insufficient data, or already a range and left untouched).
     */
    recommended: { min: number; max: number } | null;
    mismatchedRows: CookbookRow[];
}

function analyze(scenarios: Scenario[], rows: CookbookRow[]): ScenarioReport[] {
    const rowsByStory = new Map<string, CookbookRow[]>();
    for (const row of rows) {
        const list = rowsByStory.get(row.story) ?? [];
        list.push(row);
        rowsByStory.set(row.story, list);
    }

    return scenarios.map((scenario) => {
        const candidateRows = rowsByStory.get(scenario.scenarioName) ?? [];
        const placeKey = multiset(canonicalPlaceNames(scenario.actions.place));
        const stokeKey = multiset(canonicalStokeNames(scenario.actions.stoke));

        const matched: CookbookRow[] = [];
        const mismatched: CookbookRow[] = [];
        for (const row of candidateRows) {
            const rowPlaceKey = multiset(csvCellNames(row.place));
            const rowStokeKey = multiset(csvCellNames(row.stoke));
            const placeOk = rowPlaceKey === placeKey;
            const stokeOk = stokeKey === '' ? true : rowStokeKey === stokeKey;
            if (placeOk && stokeOk) matched.push(row);
            else mismatched.push(row);
        }

        const rewards = matched.map((r) => r.reward);
        const min = rewards.length ? Math.min(...rewards) : null;
        const max = rewards.length ? Math.max(...rewards) : null;
        const wasRange = scenario.payoutMin !== scenario.payoutMax;

        // Policy (established 2026-08-11, see plans/arson/payout-schema-and-cookbook-data.md D6):
        //   - Insufficient data (<2 matching-recipe samples): no recommendation, keep existing values.
        //   - Already a range before this analysis: no recommendation — a prior cookbook round already
        //     set a considered range for this scenario; don't let a later, possibly noisier round
        //     overwrite it. Re-review these manually if new data looks meaningfully different.
        //   - Previously a single value: recommend the computed [min, max], but UNION with the old
        //     single value rather than replacing it outright — if the old value falls outside the
        //     computed range, extend the range to include it instead of discarding it as stale.
        let recommended: { min: number; max: number } | null = null;
        if (min !== null && max !== null && rewards.length >= 2 && !wasRange) {
            const old = scenario.payoutMin; // === payoutMax here, since !wasRange
            recommended = { min: Math.min(min, old), max: Math.max(max, old) };
        }

        return {
            scenarioName: scenario.scenarioName,
            matchedCount: matched.length,
            min,
            max,
            currentPayoutMin: scenario.payoutMin,
            currentPayoutMax: scenario.payoutMax,
            wasRange,
            recommended,
            mismatchedRows: mismatched,
        };
    });
}

const rows = loadCookbookRows();
const reports = analyze(SCENARIOS, rows);

const recommended = reports.filter((r) => r.recommended !== null);
const alreadyRange = reports.filter((r) => r.wasRange && r.matchedCount > 0);
const insufficient = reports.filter((r) => !r.wasRange && r.matchedCount < 2);

console.log(`Analyzed ${rows.length} cookbook rows across ${readdirSync(COOKBOOK_DIR).filter((f) => f.endsWith('.csv')).length} files.`);
console.log(`${recommended.length} scenarios have a recommended update (>=2 matching samples, previously a single value).`);
console.log(`${alreadyRange.length} scenarios already had a range and have matching cookbook data — left untouched, review manually.`);
console.log(`${insufficient.length} scenarios have insufficient data (<2 matching-recipe samples) and were previously a single value.\n`);

console.log('=== RECOMMENDED UPDATES ===');
for (const r of recommended) {
    const rec = r.recommended!;
    const changed = rec.min !== r.currentPayoutMin || rec.max !== r.currentPayoutMax;
    console.log(
        `${changed ? '*' : ' '} ${r.scenarioName}: n=${r.matchedCount} recommend min=${rec.min} max=${rec.max}` +
        ` (computed min=${r.min} max=${r.max}, was ${r.currentPayoutMin})`
    );
}

console.log('\n=== ALREADY A RANGE (has matching data, left untouched) ===');
for (const r of alreadyRange) {
    console.log(
        `  ${r.scenarioName}: n=${r.matchedCount} computed min=${r.min} max=${r.max}` +
        ` (kept min=${r.currentPayoutMin} max=${r.currentPayoutMax})`
    );
}

console.log('\n=== INSUFFICIENT DATA (kept as-is) ===');
for (const r of insufficient) {
    console.log(`  ${r.scenarioName}: n=${r.matchedCount} (kept min=${r.currentPayoutMin} max=${r.currentPayoutMax})`);
}

const jsonOut = process.argv.includes('--json');
if (jsonOut) {
    console.log('\n=== JSON ===');
    console.log(JSON.stringify(reports, null, 2));
}
