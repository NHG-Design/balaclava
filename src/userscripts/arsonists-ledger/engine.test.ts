import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { CATALOG, RESOURCE } from '../../data/catalog.js';
import { SCENARIOS } from '../../data/scenarios.js';
import {
    calcNerve,
    calcMaterialCost,
    calcProfitPerNerve,
    profitBand,
    formatPpn,
    rankForScenario,
    scenarioNeedsFlamethrower,
    DEFAULT_THRESHOLDS,
    type PriceMap,
} from './engine.js';
import type { Scenario } from '../../data/scenarios.js';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function Scenario(overrides: Partial<Scenario> & Pick<Scenario, 'actions'>): Scenario {
    return {
        scenarioName: 'Test Scenario',
        payout: 100_000,
        ...overrides,
    };
}

// ---------------------------------------------------------------------------
// Catalog
// ---------------------------------------------------------------------------

describe('catalog', () => {
    it('every RESOURCE id has a CATALOG entry', () => {
        for (const id of Object.values(RESOURCE)) {
            assert.ok(CATALOG[id], `Missing catalog entry for: ${id}`);
        }
    });

    it('permanent reusable items have isTool=true (excluded from market cost)', () => {
        const permanent = [RESOURCE.FLAMETHROWER, RESOURCE.BLANKET, RESOURCE.FIRE_EXTINGUISHER];
        for (const id of permanent) {
            assert.equal(CATALOG[id].isTool, true, `Expected isTool=true for ${id}`);
        }
    });

    it('consumable igniters/dampeners have isTool=false (included in market cost)', () => {
        // Molotov and sand are physically consumed per crime
        const consumable = [RESOURCE.MOLOTOV, RESOURCE.SAND];
        for (const id of consumable) {
            assert.equal(CATALOG[id].isTool, false, `Expected isTool=false for ${id}`);
        }
    });

    it('Windproof Lighter is a permanent tool (not consumed per crime)', () => {
        assert.equal(CATALOG[RESOURCE.LIGHTER].isTool, true);
        assert.equal(CATALOG[RESOURCE.LIGHTER].tornId, 544);
        assert.equal(CATALOG[RESOURCE.LIGHTER].name, 'Windproof Lighter');
    });

    it('all catalog entries with tornId have a positive integer tornId', () => {
        for (const [id, resource] of Object.entries(CATALOG)) {
            if (resource.tornId === undefined) continue;
            assert.ok(resource.tornId > 0, `${id} tornId is not positive`);
            assert.equal(resource.tornId, Math.floor(resource.tornId), `${id} tornId is not an integer`);
        }
    });

    it('fuels and evidence have isTool=false', () => {
        const consumables = [RESOURCE.GASOLINE, RESOURCE.MAGNESIUM, RESOURCE.THERMITE,
                             RESOURCE.DIAMOND_RING, RESOURCE.GRENADE];
        for (const id of consumables) {
            assert.equal(CATALOG[id].isTool, false, `Expected isTool=false for ${id}`);
        }
    });

    it('non-tool resources have positive integer defaultPrices', () => {
        for (const [id, resource] of Object.entries(CATALOG)) {
            if (resource.isTool) continue; // tools are permanent — price 0 is expected
            assert.ok(resource.defaultPrice > 0, `${id} has non-positive defaultPrice`);
            assert.equal(resource.defaultPrice, Math.floor(resource.defaultPrice),
                `${id} defaultPrice is not an integer`);
        }
    });

    it('permanent tools have defaultPrice of 0', () => {
        const permanent = [RESOURCE.FLAMETHROWER, RESOURCE.BLANKET, RESOURCE.FIRE_EXTINGUISHER];
        for (const id of permanent) {
            assert.equal(CATALOG[id].defaultPrice, 0, `Expected defaultPrice=0 for permanent tool ${id}`);
        }
    });
});

// ---------------------------------------------------------------------------
// calcNerve
// ---------------------------------------------------------------------------

describe('calcNerve', () => {
    it('baseline is 10 (breach + ignite + collect) with no material actions', () => {
        const s = Scenario({ actions: { place: [{ resourceId: RESOURCE.GASOLINE, qty: 0 }] } });
        assert.equal(calcNerve(s), 10);
    });

    it('each place qty adds 5 nerve', () => {
        assert.equal(calcNerve(Scenario({ actions: { place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }] } })), 15);
        assert.equal(calcNerve(Scenario({ actions: { place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }] } })), 20);
        assert.equal(calcNerve(Scenario({ actions: { place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }] } })), 30);
    });

    it('evidence, stoke, dampen each add 5 nerve per qty', () => {
        const s = Scenario({
            actions: {
                evidence: [{ resourceId: RESOURCE.DIAMOND_RING, qty: 1 }],
                place:    [{ resourceId: RESOURCE.GASOLINE,     qty: 1 }],
                stoke:    [{ resourceId: RESOURCE.GASOLINE,     qty: 1 }],
                dampen:   [{ resourceId: RESOURCE.BLANKET,      qty: 1 }],
            },
        });
        // 10 + (1+1+1+1)*5 = 30
        assert.equal(calcNerve(s), 30);
    });

    it('optional items do not contribute to nerve', () => {
        const s = Scenario({
            actions: {
                place: [
                    { resourceId: RESOURCE.GASOLINE, qty: 2 },
                    { resourceId: RESOURCE.DIESEL,   qty: 1, optional: true },
                ],
            },
        });
        // 10 + 2*5 = 20 (optional diesel ignored)
        assert.equal(calcNerve(s), 20);
    });

    it('ignite slot does not add extra nerve (already in the 10 baseline)', () => {
        const withFT = Scenario({
            actions: {
                ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
                place:  [{ resourceId: RESOURCE.GASOLINE,     qty: 1 }],
            },
        });
        const withoutFT = Scenario({
            actions: {
                place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
            },
        });
        assert.equal(calcNerve(withFT), calcNerve(withoutFT));
    });
});

// ---------------------------------------------------------------------------
// calcMaterialCost
// ---------------------------------------------------------------------------

describe('calcMaterialCost', () => {
    it('uses defaultPrice from catalog', () => {
        const s = Scenario({ actions: { place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }] } });
        assert.equal(calcMaterialCost(s, {}), CATALOG[RESOURCE.GASOLINE].defaultPrice * 2);
    });

    it('price override in PriceMap wins over defaultPrice', () => {
        const prices: PriceMap = { [RESOURCE.GASOLINE]: 9_999 };
        const s = Scenario({ actions: { place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }] } });
        assert.equal(calcMaterialCost(s, prices), 9_999 * 2);
    });

    it('tools are excluded from cost', () => {
        const s = Scenario({
            actions: {
                ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
                place:  [{ resourceId: RESOURCE.GASOLINE,     qty: 1 }],
            },
        });
        assert.equal(calcMaterialCost(s, {}), CATALOG[RESOURCE.GASOLINE].defaultPrice);
    });

    it('optional items are excluded from cost', () => {
        const s = Scenario({
            actions: {
                place: [
                    { resourceId: RESOURCE.GASOLINE, qty: 2 },
                    { resourceId: RESOURCE.DIESEL,   qty: 1, optional: true },
                ],
            },
        });
        assert.equal(calcMaterialCost(s, {}), CATALOG[RESOURCE.GASOLINE].defaultPrice * 2);
    });

    it('sums across all action slots', () => {
        const s = Scenario({
            actions: {
                evidence: [{ resourceId: RESOURCE.DIAMOND_RING, qty: 1 }],
                place:    [{ resourceId: RESOURCE.GASOLINE,     qty: 2 }],
                stoke:    [{ resourceId: RESOURCE.DIESEL,       qty: 1 }],
            },
        });
        const expected =
            CATALOG[RESOURCE.DIAMOND_RING].defaultPrice * 1 +
            CATALOG[RESOURCE.GASOLINE].defaultPrice * 2 +
            CATALOG[RESOURCE.DIESEL].defaultPrice * 1;
        assert.equal(calcMaterialCost(s, {}), expected);
    });
});

// ---------------------------------------------------------------------------
// calcProfitPerNerve
// ---------------------------------------------------------------------------

describe('calcProfitPerNerve', () => {
    it('equals (payout - cost) / nerve', () => {
        const s = Scenario({
            payout: 100_000,
            actions: { place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }] },
        });
        const cost  = CATALOG[RESOURCE.GASOLINE].defaultPrice * 2;
        const nerve = 10 + 2 * 5;
        assert.equal(calcProfitPerNerve(s, {}), (100_000 - cost) / nerve);
    });

    it('returns negative when cost exceeds payout', () => {
        const s = Scenario({
            payout: 1,
            actions: { place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }] },
        });
        assert.ok(calcProfitPerNerve(s, {}) < 0);
    });
});

// ---------------------------------------------------------------------------
// profitBand
// ---------------------------------------------------------------------------

describe('profitBand', () => {
    const t = DEFAULT_THRESHOLDS; // { low: 5000, good: 10000 }

    it('negative at 0', ()  => assert.equal(profitBand(0,      t), 'negative'));
    it('negative below 0',  () => assert.equal(profitBand(-1,   t), 'negative'));
    it('low at threshold',  () => assert.equal(profitBand(5_000, t), 'low'));
    it('low just above 0',  () => assert.equal(profitBand(1,    t), 'low'));
    it('good at threshold', () => assert.equal(profitBand(10_000, t), 'good'));
    it('good just above low threshold', () => assert.equal(profitBand(5_001, t), 'good'));
    it('excellent above good threshold',  () => assert.equal(profitBand(10_001, t), 'excellent'));
    it('excellent at large value',        () => assert.equal(profitBand(50_000, t), 'excellent'));
});

// ---------------------------------------------------------------------------
// formatPpn
// ---------------------------------------------------------------------------

describe('formatPpn', () => {
    it('floors to nearest 100', () => {
        assert.equal(formatPpn(8_450), '$8.4k/N');
        assert.equal(formatPpn(8_499), '$8.4k/N');
        assert.equal(formatPpn(8_400), '$8.4k/N');
    });

    it('formats values >= 1000 as $Xk/N', () => {
        assert.equal(formatPpn(1_000), '$1.0k/N');
        assert.equal(formatPpn(10_000), '$10.0k/N');
        assert.equal(formatPpn(12_300), '$12.3k/N');
    });

    it('formats values < 1000 as $X/N', () => {
        assert.equal(formatPpn(900),  '$900/N');
        assert.equal(formatPpn(500),  '$500/N');
        assert.equal(formatPpn(0),    '$0/N');
    });

    it('abbreviates negative values with sign before dollar', () => {
        assert.equal(formatPpn(-850),        '$-800/N');
        assert.equal(formatPpn(-1_500),      '$-1.5k/N');
        assert.equal(formatPpn(-331_700),    '$-331.7k/N');
    });
});

// ---------------------------------------------------------------------------
// rankForScenario
// ---------------------------------------------------------------------------

describe('rankForScenario', () => {
    const noFT = false;
    const hasFT = true;
    const prices: PriceMap = {};

    const confirmed: Scenario = {
        scenarioName: 'Test',
        payout: 100_000,
        actions: { place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }] },
    };
    const confirmedFT: Scenario = {
        scenarioName: 'Test',
        payout: 120_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE,     qty: 1 }],
        },
    };
    const unconfirmed: Scenario = {
        scenarioName: 'Test',
        payout: 200_000,
        actions: { place: [{ resourceId: RESOURCE.DIESEL, qty: 1 }] },
        needsVerification: true,
    };

    it('returns null for no candidates', () => {
        assert.equal(rankForScenario([], noFT, prices, DEFAULT_THRESHOLDS), null);
    });

    it('excludes FT SCENARIOS when player lacks flamethrower', () => {
        const result = rankForScenario([confirmed, confirmedFT], noFT, prices, DEFAULT_THRESHOLDS);
        assert.equal(result?.Scenario, confirmed);
    });

    it('returns best FT Scenario when player has flamethrower', () => {
        const result = rankForScenario([confirmed, confirmedFT], hasFT, prices, DEFAULT_THRESHOLDS);
        assert.equal(result?.Scenario, confirmedFT);
    });

    it('returns confirmed Scenario over higher-PPN unconfirmed', () => {
        const result = rankForScenario([unconfirmed, confirmed], noFT, prices, DEFAULT_THRESHOLDS);
        assert.equal(result?.Scenario.needsVerification, undefined);
    });

    it('returns unconfirmed when no confirmed Scenario exists', () => {
        const result = rankForScenario([unconfirmed], noFT, prices, DEFAULT_THRESHOLDS);
        assert.equal(result?.Scenario, unconfirmed);
    });

    it('within confirmed group, returns highest PPN', () => {
        const highPayout: Scenario = { ...confirmed, payout: 500_000 };
        const result = rankForScenario([confirmed, highPayout], noFT, prices, DEFAULT_THRESHOLDS);
        assert.equal(result?.Scenario, highPayout);
    });

    it('tie-breaks by nerve asc', () => {
        const lowNerve:  Scenario = { scenarioName: 'T', payout: 100_000, actions: { place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }] } };
        const highNerve: Scenario = { scenarioName: 'T', payout: 100_000, actions: { place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }, { resourceId: RESOURCE.GASOLINE, qty: 1 }] } };
        const result = rankForScenario([highNerve, lowNerve], noFT, prices, DEFAULT_THRESHOLDS);
        assert.equal(result?.Scenario, lowNerve);
    });
});

// ---------------------------------------------------------------------------
// SCENARIOS data integrity
// ---------------------------------------------------------------------------

describe('SCENARIOS data', () => {
    it('all SCENARIOS reference valid catalog resource IDs', () => {
        const validIds = new Set(Object.values(RESOURCE));
        for (const s of SCENARIOS) {
            for (const slot of [s.actions.evidence, s.actions.ignite, s.actions.place, s.actions.stoke, s.actions.dampen]) {
                for (const item of slot ?? []) {
                    assert.ok(validIds.has(item.resourceId as never),
                        `Unknown resourceId "${item.resourceId}" in Scenario for "${s.scenarioName}"`);
                }
            }
        }
    });

    it('SCENARIOS using FLAMETHROWER are filtered out without CS>=80', () => {
        const ftStrategies = SCENARIOS.filter(s => scenarioNeedsFlamethrower(s));
        assert.ok(ftStrategies.length > 0, 'expected some FT SCENARIOS');
        for (const s of ftStrategies) {
            const hasIt = Object.values(s.actions).flat().some(i => i.resourceId === RESOURCE.FLAMETHROWER);
            assert.ok(hasIt, `scenarioNeedsFlamethrower true but no FLAMETHROWER found in "${s.scenarioName}"`);
        }
    });
});
