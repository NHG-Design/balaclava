import { CATALOG, RESOURCE } from '../../data/catalog.js';
import type { ActionItem, Strategy } from '../../data/strategies.js';
import { type RankedStrategy, type PriceMap, formatPpn, calcNerve } from './engine.js';
import { BAND_COLOR } from './colors.js';

function el(tag: string, className?: string): HTMLElement {
    const e = document.createElement(tag);
    if (className) e.className = className;
    return e;
}

function row(label: string, value: string, highlight?: boolean): HTMLElement {
    const div = el('div', 'pyro-tt-row');
    const l = el('span', 'pyro-tt-label');
    l.textContent = label;
    const v = el('span', highlight ? 'pyro-tt-value pyro-tt-value--highlight' : 'pyro-tt-value');
    v.textContent = value;
    div.appendChild(l);
    div.appendChild(v);
    return div;
}

function itemCost(item: ActionItem, prices: PriceMap): number | null {
    const resource = CATALOG[item.resourceId];
    if (!resource || resource.isTool) return null;
    const unitPrice = prices[item.resourceId] ?? resource.defaultPrice;
    const total = item.qty * unitPrice;
    return total > 0 ? total : null;
}

function formatCost(total: number): string {
    if (total >= 1_000) return `$${(total / 1_000).toFixed(1)}k`;
    return `$${total}`;
}

function actionSection(label: string, items: ActionItem[] | undefined, prices: PriceMap, timing?: 'early' | 'late'): HTMLElement | null {
    if (!items || items.length === 0) return null;
    const div = el('div', 'pyro-tt-action');
    const labelEl = el('span', 'pyro-tt-action-label');
    if (timing) {
        labelEl.innerHTML = `${label} <span class="pyro-tt-timing">${timing}</span>`;
    } else {
        labelEl.textContent = label;
    }
    const valueEl = el('span', 'pyro-tt-action-value');

    items.forEach((item, i) => {
        if (i > 0) valueEl.appendChild(document.createTextNode(', '));
        const name = CATALOG[item.resourceId]?.name ?? item.resourceId;
        const prefix = item.optional ? '~' : '';
        valueEl.appendChild(document.createTextNode(`${prefix}${item.qty}× ${name}`));
        const cost = itemCost(item, prices);
        if (cost !== null) {
            const costEl = el('span', 'pyro-tt-item-cost');
            costEl.textContent = ` (${formatCost(cost)})`;
            valueEl.appendChild(costEl);
        }
    });

    div.appendChild(labelEl);
    div.appendChild(valueEl);
    return div;
}

function buildPrimaryBlock(ranked: RankedStrategy, prices: PriceMap, statsOnly = false): DocumentFragment {
    const frag = document.createDocumentFragment();
    const { strategy, profitPerNerve, materialCost, baseNerve } = ranked;

    const header = el('div', 'pyro-tt-header');
    const title = el('span', 'pyro-tt-title');
    title.textContent = 'Profit';
    header.appendChild(title);
    const ppnEl = el('span', `pyro-tt-ppn pyro-tt-band--${ranked.band}`);
    ppnEl.textContent = formatPpn(profitPerNerve);
    header.appendChild(ppnEl);
    if (strategy.needsVerification) {
        const badge = el('span', 'pyro-tt-unconfirmed');
        badge.textContent = 'unconfirmed';
        header.appendChild(badge);
    }
    frag.appendChild(header);

    const stats = el('div', 'pyro-tt-stats');
    stats.appendChild(row('Payout', `~$${(strategy.payout / 1000).toFixed(0)}k`));
    stats.appendChild(row('Cost',   `~$${(materialCost / 1000).toFixed(1)}k`));
    stats.appendChild(row('Nerve',  String(baseNerve)));
    frag.appendChild(stats);

    if (statsOnly) return frag;

    frag.appendChild(el('hr', 'pyro-tt-divider'));

    const { evidence, place, stoke, stokeTime, dampen, dampenTime } = strategy.actions;
    const ignite = strategy.actions.ignite ?? [{ resourceId: RESOURCE.LIGHTER, qty: 1 }];
    const actionOrder: [string, ActionItem[] | undefined, 'early' | 'late' | undefined][] = [
        ['Evidence', evidence,  undefined],
        ['Place',    place,     undefined],
        ['Ignite',   ignite,    undefined],
        ['Stoke',    stoke,     stokeTime],
        ['Dampen',   dampen,    dampenTime],
    ];
    for (const [label, items, timing] of actionOrder) {
        const s = actionSection(label, items, prices, timing);
        if (s) frag.appendChild(s);
    }

    if (strategy.notes) {
        const note = el('div', 'pyro-tt-notes');
        note.textContent = strategy.notes;
        frag.appendChild(note);
    }

    return frag;
}

export function buildTooltipContent(ranked: RankedStrategy | null, prices: PriceMap, statsOnly = false): HTMLElement {
    const root = el('div', 'pyro-tt');
    if (!ranked) return root;
    root.appendChild(buildPrimaryBlock(ranked, prices, statsOnly));
    return root;
}

export function buildTooltipStyles(): string {
    return `
.pyro-tt {
    font-size: 12px;
    line-height: 1.5;
    min-width: 180px;
    max-width: 240px;
}
.pyro-tt-header {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 6px;
}
.pyro-tt-title {
    font-weight: bold;
    font-size: 14px;
}
.pyro-tt-ppn {
    font-weight: bold;
    font-size: 14px;
}
.pyro-tt-band--negative { color: ${BAND_COLOR.negative}; }
.pyro-tt-band--low      { color: ${BAND_COLOR.low};      }
.pyro-tt-band--good     { color: ${BAND_COLOR.good};     }
.pyro-tt-band--excellent  { color: ${BAND_COLOR.excellent};  }
.pyro-tt-unconfirmed {
    font-size: 10px;
    opacity: 0.7;
    border: 1px solid currentColor;
    border-radius: 3px;
    padding: 0 4px;
}
.pyro-tt-stats {
    display: flex;
    gap: 10px;
    margin-bottom: 6px;
}
.pyro-tt-row {
    display: flex;
    flex-direction: column;
    font-size: 11px;
}
.pyro-tt-label {
    color: oklch(66% 0 0);
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.03em;
}
.pyro-tt-divider {
    border: none;
    border-top: 1px solid currentColor;
    opacity: 0.15;
    margin: 4px 0;
}
.pyro-tt-action {
    display: flex;
    gap: 6px;
    margin: 2px 0;
}
.pyro-tt-action-label {
    min-width: 56px;
    color: oklch(66% 0 0);
    font-size: 11px;
}
.pyro-tt-timing {
    font-size: 9px;
    opacity: 0.55;
    margin-left: 4px;
}
.pyro-tt-action-value {
    font-size: 11px;
    font-weight: bold;
}
.pyro-tt-item-cost {
    color: oklch(66% 0 0);
    font-size: 10px;
    font-weight: normal;
}
.pyro-tt-notes {
    margin-top: 5px;
    opacity: 0.7;
    font-size: 11px;
    font-style: italic;
}
.pyro-tt-req {
    margin-top: 5px;
    opacity: 0.55;
    font-size: 10px;
}

.balaclava-tooltip.is-theme-dark {
    --balaclava-tooltip-bg: oklch(24% 0 0);
    --balaclava-tooltip-border-size: 1px;
    --balaclava-tooltip-border: oklch(30% 0 0);
}
`;
}
