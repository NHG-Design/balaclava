import { CATALOG, RESOURCE } from '../../data/catalog.js';
import { type ActionItem, type Strategy } from '../../data/strategies.js';
import { type RankedStrategy, formatPpn, calcNerve } from './engine.js';

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

function formatItems(items: ActionItem[]): string {
    const parts: string[] = [];
    for (const item of items) {
        const name = CATALOG[item.resourceId]?.name ?? item.resourceId;
        const prefix = item.optional ? '~' : '';
        parts.push(`${prefix}${item.qty}× ${name}`);
    }
    return parts.join(', ');
}

function actionSection(label: string, items: ActionItem[] | undefined): HTMLElement | null {
    if (!items || items.length === 0) return null;
    const div = el('div', 'pyro-tt-action');
    const labelEl = el('span', 'pyro-tt-action-label');
    labelEl.textContent = label;
    const valueEl = el('span', 'pyro-tt-action-value');
    valueEl.textContent = formatItems(items);
    div.appendChild(labelEl);
    div.appendChild(valueEl);
    return div;
}

function buildPrimaryBlock(ranked: RankedStrategy): DocumentFragment {
    const frag = document.createDocumentFragment();
    const { strategy, profitPerNerve, materialCost, baseNerve } = ranked;

    const header = el('div', 'pyro-tt-header');
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
    stats.appendChild(row('Payout', `$${(strategy.payout / 1000).toFixed(0)}k`));
    stats.appendChild(row('Cost',   `$${(materialCost / 1000).toFixed(1)}k`));
    stats.appendChild(row('Nerve',  String(baseNerve)));
    frag.appendChild(stats);

    frag.appendChild(el('hr', 'pyro-tt-divider'));

    const { evidence, place, stoke, dampen } = strategy.actions;
    const ignite = strategy.actions.ignite ?? [{ resourceId: RESOURCE.LIGHTER, qty: 1 }];
    const actionOrder: [string, ActionItem[] | undefined][] = [
        ['Evidence', evidence],
        ['Ignite',   ignite],
        ['Place',    place],
        ['Stoke',    stoke],
        ['Dampen',   dampen],
    ];
    for (const [label, items] of actionOrder) {
        const s = actionSection(label, items);
        if (s) frag.appendChild(s);
    }

    if (strategy.notes) {
        const note = el('div', 'pyro-tt-notes');
        note.textContent = strategy.notes;
        frag.appendChild(note);
    }

    return frag;
}

function buildAltRow(ranked: RankedStrategy): HTMLElement {
    const div = el('div', 'pyro-tt-alt-row');
    const ppn = el('span', `pyro-tt-alt-ppn pyro-tt-band--${ranked.band}`);
    ppn.textContent = formatPpn(ranked.profitPerNerve);
    const meta = el('span', 'pyro-tt-alt-meta');
    const ftTag = ranked.strategy.requiresFlamethrower ? ' · FT' : '';
    const unconfTag = ranked.strategy.needsVerification ? ' · ?' : '';
    meta.textContent = `${ranked.baseNerve}N · $${(ranked.materialCost / 1000).toFixed(1)}k${ftTag}${unconfTag}`;
    div.appendChild(ppn);
    div.appendChild(meta);
    return div;
}

/**
 * Builds the structured DOM node passed to BalaclavaTooltip.show().
 * allRanked[0] is the best strategy; the rest are shown as compact alternatives.
 */
export function buildTooltipContent(allRanked: RankedStrategy[]): HTMLElement {
    const root = el('div', 'pyro-tt');

    if (allRanked.length === 0) return root;

    root.appendChild(buildPrimaryBlock(allRanked[0]!));

    const alts = allRanked.slice(1);
    if (alts.length > 0) {
        root.appendChild(el('hr', 'pyro-tt-divider'));
        const altHeader = el('div', 'pyro-tt-alt-header');
        altHeader.textContent = 'Also viable';
        root.appendChild(altHeader);
        for (const alt of alts) {
            root.appendChild(buildAltRow(alt));
        }
    }

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
.pyro-tt-ppn {
    font-weight: bold;
    font-size: 14px;
}
.pyro-tt-band--negative { color: #f66; }
.pyro-tt-band--low      { color: #fc6; }
.pyro-tt-band--good     { color: #6c6; }
.pyro-tt-band--jackpot  { color: #4ef; }
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
    opacity: 0.85;
}
.pyro-tt-row {
    display: flex;
    flex-direction: column;
    font-size: 11px;
}
.pyro-tt-label {
    opacity: 0.6;
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
    opacity: 0.6;
    font-size: 11px;
}
.pyro-tt-action-value {
    font-size: 11px;
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
.pyro-tt-alt-header {
    margin-top: 2px;
    margin-bottom: 3px;
    opacity: 0.5;
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
}
.pyro-tt-alt-row {
    display: flex;
    align-items: baseline;
    gap: 6px;
    margin: 2px 0;
}
.pyro-tt-alt-ppn {
    font-size: 11px;
    font-weight: bold;
    min-width: 60px;
}
.pyro-tt-alt-meta {
    font-size: 10px;
    opacity: 0.65;
}
`;
}
