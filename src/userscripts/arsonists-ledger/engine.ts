import { CATALOG, type ResourceId } from '../../data/catalog.js';
import type { Scenario, ActionItem } from '../../data/scenarios.js';

export type ProfitBand = 'negative' | 'low' | 'good' | 'excellent';

export interface ProfitThresholds {
    low: number;    // <= this → 'low'
    good: number;   // <= this → 'good', else 'excellent'
}

export const DEFAULT_THRESHOLDS: ProfitThresholds = { low: 5_000, good: 10_000 };

export interface RankedScenario {
    scenario: Scenario;
    materialCost: number;
    baseNerve: number;
    profitPerNerve: number;
    band: ProfitBand;
}

export type PriceMap = Partial<Record<ResourceId, number>>;

function resolvePrice(resourceId: ResourceId, prices: PriceMap): number {
    const override = prices[resourceId];
    if (override !== undefined) return override;
    return CATALOG[resourceId]?.defaultPrice ?? 0;
}

function itemCost(items: ActionItem[] | undefined, prices: PriceMap): number {
    if (!items) return 0;
    return items.reduce((sum, item) => {
        if (item.optional) return sum;
        const resource = CATALOG[item.resourceId];
        if (!resource || resource.isTool) return sum;
        return sum + item.qty * resolvePrice(item.resourceId, prices);
    }, 0);
}

function itemActionCount(items: ActionItem[] | undefined): number {
    if (!items) return 0;
    return items.reduce((sum, item) => {
        if (item.optional) return sum;
        return sum + item.qty;
    }, 0);
}

/**
 * Full-job nerve = Breach(3) + Ignite(5) + Collect(2) + 5 per material action.
 * Each qty on Place/Stoke/Dampen/Evidence = one action = 5 nerve.
 */
export function calcNerve(scenario: Scenario): number {
    const { evidence, ignite, place, stoke, dampen } = strategy.actions;
    const items =
        itemActionCount(evidence) +
        itemActionCount(place) +
        itemActionCount(stoke) +
        itemActionCount(dampen);
    // Ignite is always exactly 1 action (5 nerve), already counted in the 10 baseline:
    // 3 (breach) + 5 (ignite) + 2 (collect) = 10
    // Custom ignite tools (molotov) are tools and don't add extra nerve — still 1 ignite action.
    void ignite;
    return 10 + items * 5;
}

export function calcMaterialCost(strategy: Strategy, prices: PriceMap): number {
    const { evidence, ignite, place, stoke, dampen } = strategy.actions;
    return (
        itemCost(evidence, prices) +
        itemCost(ignite, prices) +
        itemCost(place, prices) +
        itemCost(stoke, prices) +
        itemCost(dampen, prices)
    );
}

export function calcProfitPerNerve(strategy: Strategy, prices: PriceMap): number {
    const nerve = calcNerve(strategy);
    const cost = calcMaterialCost(strategy, prices);
    return (strategy.payout - cost) / nerve;
}

export function profitBand(ppn: number, thresholds: ProfitThresholds): ProfitBand {
    if (ppn <= 0)                   return 'negative';
    if (ppn <= thresholds.low)      return 'low';
    if (ppn <= thresholds.good)     return 'good';
    return 'excellent';
}

export function formatPpn(ppn: number): string {
    const sign = ppn < 0 ? '-' : '';
    const rounded = Math.floor(Math.abs(ppn) / 100) * 100;
    if (rounded >= 1_000) return `~$${sign}${(rounded / 1_000).toFixed(1)}k`;
    return `~$${sign}${rounded}`;
}

export function scenarioNeedsFlamethrower(s: Scenario): boolean {
    return Object.values(s.actions).flat().some(
        item => item.resourceId === ('flamethrower' as ResourceId),
    );
}

/**
 * Returns all skill-eligible strategies ranked for a scenario.
 * Confirmed strategies sort before unconfirmed; within each group: PPN desc,
 * then nerve asc, then cost asc.
 */
export function rankForScenario(
    candidates: Scenario[],
    hasFlamethrower: boolean,
    prices: PriceMap,
    thresholds: ProfitThresholds,
): RankedScenario | null {
    const eligible = candidates.filter(s => {
        if (!hasFlamethrower && scenarioNeedsFlamethrower(s)) return false;
        return true;
    });

    if (eligible.length === 0) return null;

    const ranked: RankedScenario[] = eligible.map(s => {
        const ppn = calcProfitPerNerve(s, prices);
        return {
            scenario: s,
            materialCost: calcMaterialCost(s, prices),
            baseNerve: calcNerve(s),
            profitPerNerve: ppn,
            band: profitBand(ppn, thresholds),
        };
    });

    ranked.sort((a, b) => {
        const aConf = a.strategy.needsVerification ? 0 : 1;
        const bConf = b.strategy.needsVerification ? 0 : 1;
        if (aConf !== bConf) return bConf - aConf;
        if (b.profitPerNerve !== a.profitPerNerve) return b.profitPerNerve - a.profitPerNerve;
        if (a.baseNerve !== b.baseNerve) return a.baseNerve - b.baseNerve;
        return a.materialCost - b.materialCost;
    });

    return ranked[0]!;
}
