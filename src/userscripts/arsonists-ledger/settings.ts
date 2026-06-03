import { CATALOG, CATALOG_UPDATED, type ResourceId } from '../../data/catalog.js';
import { type PriceMap, type ProfitThresholds } from './engine.js';
import { fetchApiPrices } from './api.js';
import { SEL } from './selectors.js';
import { BAND_COLOR } from './colors.js';
import { el, txt, svgEl } from './dom.js';
import {
    ICON_INFO,
    ICON_CHECK,
    ICON_X,
    ICON_ARROW_RIGHT,
    ICON_FLAME,
    ICON_EXTERNAL_LINK,
} from './icons.js';

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

export interface SettingsCtx {
    getManualPrices(): PriceMap;
    getApiPrices(): PriceMap;
    getThresholds(): ProfitThresholds;
    getApiKey(): string;
    getApiLastRefresh(): number;
    getActiveTab(): string;
    getShowObservedPayouts(): boolean;

    setManualPrice(id: ResourceId, price: number): void;
    clearManualPrices(): void;
    clearManualPrice(id: ResourceId): void;
    setThresholds(t: ProfitThresholds): void;
    setApiPrices(prices: PriceMap, timestamp: number): void;
    clearApiPrices(): void;
    setApiKey(key: string): void;
    setActiveTab(tab: string): void;
    setShowObservedPayouts(show: boolean): void;
}

// ---------------------------------------------------------------------------
// Status helpers
// ---------------------------------------------------------------------------

function setOkStatus(statusEl: HTMLElement, message: string): void {
    statusEl.innerHTML = ICON_CHECK;
    statusEl.appendChild(txt(message));
}

function setErrStatus(statusEl: HTMLElement, message: string): void {
    statusEl.innerHTML = ICON_X;
    statusEl.appendChild(txt(message));
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

export function injectSettingsStyles(): void {
    if (document.getElementById('pyro-settings-styles')) return;
    const style = el('style');
    style.id = 'pyro-settings-styles';
    style.textContent = `
.pyro-settings-wrap {
    --pyro-tooltip-bg: oklch(24% 0 0);
    --pyro-tooltip-border: oklch(30% 0 0);
    --pyro-tooltip-shadow: oklch(12% 0.01 260 / 0.55);
    --pyro-tooltip-radius: 8px;
    --pyro-tooltip-arrow-size: 12px;
    --pyro-settings-btn-size: 24px;
    position: relative;
    display: inline-flex;
    align-items: center;
    margin-left: 8px;
}
#pyro-settings-btn {
    padding: 4px 8px;
    background: color-mix(in oklch, var(--pyro-tooltip-bg) 86%, black);
    border: 1px solid var(--pyro-tooltip-border);
    color: oklch(76% 0.006 95);
    cursor: pointer;
    border-radius: var(--pyro-tooltip-radius);
    font-size: 13px;
    line-height: 1;
    user-select: none;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 100ms ease-out, background 120ms ease-out, color 120ms ease-out;
}
@media (hover: hover) and (pointer: fine) {
    #pyro-settings-btn:hover {
        background: color-mix(in oklch, var(--pyro-tooltip-bg) 94%, white 6%);
        color: oklch(96% 0.012 95);
    }
}
#pyro-settings-btn:active { transform: scale(0.94); }
#pyro-settings-panel {
    --pyro-api-color: #6d6;
    --pyro-manual-color: #7af;
    --pyro-db-color: oklch(46% 0.008 285);
    position: absolute;
    top: calc(100% + 10px);
    right: 0;
    z-index: 9999;
    background: var(--pyro-tooltip-bg);
    color: oklch(96% 0.012 95);
    border: 1px solid var(--pyro-tooltip-border);
    border-radius: var(--pyro-tooltip-radius);
    min-width: 290px;
    max-width: 360px;
    box-shadow: 0 2px 8px var(--pyro-tooltip-shadow);
    overflow: visible;
    transform-origin: calc(100% - (var(--pyro-settings-btn-size) / 2)) calc(0px - var(--pyro-tooltip-arrow-size));
    transform: scale(0.95);
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
    transition: transform 150ms ease-out, opacity 150ms ease-out, visibility 0ms linear 150ms;
}
#pyro-settings-panel::before {
    content: '';
    position: absolute;
    top: calc(var(--pyro-tooltip-arrow-size) / -2);
    right: calc((var(--pyro-settings-btn-size) / 2) - (var(--pyro-tooltip-arrow-size) / 2));
    width: var(--pyro-tooltip-arrow-size);
    height: var(--pyro-tooltip-arrow-size);
    background: var(--pyro-tooltip-bg);
    border: 1px solid var(--pyro-tooltip-border);
    transform: rotate(45deg);
    box-sizing: border-box;
    border-right: none;
    border-bottom: none;
    border-radius: 3px;
}
#pyro-settings-panel.is-open {
    transform: scale(1);
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
    transition: transform 150ms ease-out, opacity 150ms ease-out, visibility 0ms linear 0ms;
}
#pyro-settings-panel:not(.is-open) {
    transition: transform 100ms ease-out, opacity 100ms ease-out, visibility 0ms linear 100ms;
}
.pyro-tab-bar { display: flex; border-bottom: 1px solid var(--pyro-tooltip-border); }
.pyro-tab {
    flex: 1;
    background: none;
    border: none;
    border-bottom: 1px solid transparent;
    color: oklch(70% 0.008 95 / 0.8);
    cursor: pointer;
    padding: 8px 2px;
    font: inherit;
    font-size: 14px;
    transition: color 120ms ease-out;
}
@media (hover: hover) and (pointer: fine) {
    .pyro-tab:hover { color: oklch(96% 0.012 95); }
}
.pyro-tab.active {
    color: oklch(96% 0.012 95);
    border-bottom-color: ${BAND_COLOR.excellent};
    background: linear-gradient(0deg, color-mix(in oklch, ${BAND_COLOR.excellent} 20%, transparent 80%), transparent 55%);
}
.pyro-tab-content { padding: 10px; max-height: 380px; overflow-y: auto; }
.pyro-tab-content>div { display: flex; flex-direction: column; gap: 14px; }
.pyro-tab-content::-webkit-scrollbar { width: 3px; }
.pyro-tab-content::-webkit-scrollbar-track { background: transparent; }
.pyro-tab-content::-webkit-scrollbar-thumb { background: oklch(57% 0.008 285); border-radius: 2px; }
.pyro-s-group { display: flex; flex-direction: column; gap: 4px; }
.pyro-s-group-title {
    font-size: 14px;
    text-transform: uppercase;
    color: oklch(58% 0.012 285);
}
.pyro-s-row { display: flex; align-items: center; gap: 6px; }
.pyro-s-label {
    flex: 1;
    font-size: 11px;
    color: oklch(62% 0.009 285);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    min-width: 0;
}
.pyro-s-input {
    width: 76px;
    background: oklch(14.5% 0.011 285);
    border: 1px solid oklch(27% 0.017 285);
    color: oklch(82% 0.007 285);
    font-size: 11px;
    padding: 3px 5px;
    border-radius: 5px;
    text-align: right;
    -moz-appearance: textfield;
    transition: border-color 120ms ease-out;
}
.pyro-s-input::-webkit-inner-spin-button,
.pyro-s-input::-webkit-outer-spin-button { -webkit-appearance: none; }
.pyro-s-input:focus-visible { outline: none; border-color: ${BAND_COLOR.excellent}; }
.pyro-s-input.from-api   { border-color: #4a4; color: #6d6; }
.pyro-s-input.overridden { border-color: #48a; color: #7af; }
.pyro-s-divider { border: none; border-top: 1px solid var(--pyro-tooltip-border); margin: 8px 0; }
.pyro-s-key-row { display: flex; gap: 6px; margin-bottom: 6px; }
.pyro-s-key-input {
    flex: 1;
    background: oklch(14.5% 0.011 285);
    border: 1px solid oklch(27% 0.017 285);
    color: oklch(82% 0.007 285);
    font-size: 11px;
    padding: 4px 6px;
    border-radius: 5px;
    min-width: 0;
    font-family: monospace;
    transition: border-color 120ms ease-out;
}
.pyro-s-key-input:focus-visible { outline: none; border-color: ${BAND_COLOR.excellent}; }
.pyro-s-btn {
    background: oklch(15% 0.012 285);
    border: 1px solid oklch(28% 0.018 285);
    color: oklch(60% 0.009 285);
    cursor: pointer;
    border-radius: 5px;
    padding: 4px 9px;
    font-size: 11px;
    white-space: nowrap;
    transition: transform 100ms ease-out, background 120ms ease-out, color 120ms ease-out;
}
@media (hover: hover) and (pointer: fine) {
    .pyro-s-btn:hover:not(:disabled) { background: oklch(21% 0.016 285); color: oklch(85% 0.006 285); }
}
.pyro-s-btn:active:not(:disabled) { transform: scale(0.97); }
.pyro-s-btn:disabled { opacity: 0.28; cursor: default; }
.pyro-s-status {
    font-size: 10px;
    min-height: 13px;
    color: oklch(38% 0.008 285);
    display: flex;
    align-items: center;
    gap: 2px;
    flex-wrap: nowrap;
}
.pyro-s-status.ok  { color: ${BAND_COLOR.good}; }
.pyro-s-status.err { color: #c66; }
.pyro-s-refresh-row { display: flex; align-items: center; gap: 8px; }
.pyro-s-timestamp { font-size: 10px; color: oklch(57% 0.008 285); }
.pyro-s-check-row {
    display: flex;
    align-items: center;
    gap: 7px;
    margin-bottom: 7px;
    font-size: 12px;
    color: oklch(62% 0.009 285);
    cursor: pointer;
    user-select: none;
}
.pyro-s-check-row input[type=checkbox] { cursor: pointer; }
.pyro-s-section-note { display: flex; align-items: flex-start; gap: 5px; font-size: 10px; line-height: 1.4; color: oklch(57% 0.008 285); margin-bottom: 6px; }
.pyro-s-section-note > svg { width: 10px; height: 10px; flex-shrink: 0; margin-top: 1px; }
.pyro-s-section-note strong { color: oklch(64% 0.009 285); font-weight: 600; }
.pyro-s-section-note a { color: ${BAND_COLOR.excellent}; text-decoration: none; display: inline-flex; align-items: center; gap: 3px; }
.pyro-s-section-note a:hover { text-decoration: underline; }
.pyro-s-section-note a svg { width: 10px; height: 10px; flex-shrink: 0; }
.pyro-s-missing-header { font-size: 10px; color: oklch(40% 0.007 285); margin: 8px 0 4px; }
.pyro-s-missing-list { font-size: 10px; color: oklch(46% 0.008 285); padding-left: 14px; margin: 0; }
`;
    document.head.appendChild(style);
}

// ---------------------------------------------------------------------------
// Price input helper
// ---------------------------------------------------------------------------

type PriceSource = 'manual' | 'api' | 'db';

function applyPriceStyle(input: HTMLInputElement, source: PriceSource): void {
    input.classList.remove('overridden', 'from-api');
    if (source === 'manual') input.classList.add('overridden');
    else if (source === 'api') input.classList.add('from-api');
}

function priceInput(id: ResourceId, ctx: SettingsCtx): HTMLInputElement {
    const input = el('input', 'pyro-s-input');
    input.type = 'number';
    input.min = '0';
    let initialValue = '';
    let isDirty = false;

    const refresh = () => {
        const manual = ctx.getManualPrices()[id];
        const api    = ctx.getApiPrices()[id];
        const db     = CATALOG[id]?.defaultPrice ?? 0;
        if (manual !== undefined) {
            input.value = String(manual);
            applyPriceStyle(input, 'manual');
        } else if (api !== undefined) {
            input.value = String(api);
            applyPriceStyle(input, 'api');
        } else {
            input.value = '';
            input.placeholder = String(db);
            applyPriceStyle(input, 'db');
        }
        initialValue = input.value;
        isDirty = false;
    };
    refresh();

    const commit = () => {
        if (!isDirty) {
            refresh();
            return;
        }

        const raw = input.value.trim();
        if (raw === '') {
            ctx.clearManualPrice(id);
        } else {
            const val = Math.round(parseFloat(raw));
            if (!isNaN(val) && val >= 0) ctx.setManualPrice(id, val);
        }
        refresh();
    };
    input.addEventListener('focus', () => {
        initialValue = input.value;
        isDirty = false;
    });
    input.addEventListener('input', () => {
        isDirty = input.value !== initialValue;
    });
    input.addEventListener('blur', commit);
    input.addEventListener('keydown', e => { if (e.key === 'Enter') input.blur(); });
    return input;
}

// ---------------------------------------------------------------------------
// Prices tab
// ---------------------------------------------------------------------------

const PRICE_GROUPS: Array<{ title: string; ids: ResourceId[] }> = [
    { title: 'Liquids',  ids: ['gasoline', 'diesel', 'kerosene'] },
    { title: 'Solids',   ids: ['magnesium', 'thermite', 'potassium_nitrate'] },
    { title: 'Gases', ids: ['oxygen', 'methane', 'hydrogen'] },
    {
        title: 'Evidence',
        ids: Object.values(CATALOG)
            .filter(r => r.kind === 'evidence')
            .sort((a, b) => a.name.localeCompare(b.name))
            .map(r => r.id as ResourceId),
    },
];

function buildPricesTab(ctx: SettingsCtx, panel: HTMLElement): HTMLElement {
    const root = el('div');
    const hasManualOverrides = Object.keys(ctx.getManualPrices()).length > 0;
    const hasApiPrices = ctx.getApiLastRefresh() > 0 || Object.keys(ctx.getApiPrices()).length > 0;

    const actionGroup = el('div', 'pyro-s-group');
    const actionRow = el('div', 'pyro-s-refresh-row');

    const refreshBtn = el('button', 'pyro-s-btn');
    refreshBtn.textContent = 'Refresh';
    if (!ctx.getApiKey()) refreshBtn.disabled = true;

    const resetBtn = el('button', 'pyro-s-btn');
    resetBtn.textContent = 'Reset';
    if (!hasManualOverrides && !hasApiPrices) resetBtn.disabled = true;

    const tsEl = el('span', 'pyro-s-timestamp');
    const ts = ctx.getApiLastRefresh();
    tsEl.textContent = ts ? `Fetched: ${formatTimestamp(ts)}` : `DB: ${CATALOG_UPDATED}`;

    actionRow.appendChild(refreshBtn);
    actionRow.appendChild(resetBtn);
    actionRow.appendChild(tsEl);
    actionGroup.appendChild(actionRow);

    const actionStatus = el('div', 'pyro-s-status');
    actionGroup.appendChild(actionStatus);
    root.appendChild(actionGroup);

    refreshBtn.addEventListener('click', async () => {
        refreshBtn.disabled = true;
        actionStatus.textContent = 'Refreshing…';
        actionStatus.className = 'pyro-s-status';

        const result = await fetchApiPrices(ctx.getApiKey());
        refreshBtn.disabled = !ctx.getApiKey();

        if (result.success && result.prices) {
            ctx.setApiPrices(result.prices, Date.now());
            setOkStatus(actionStatus, `${result.updatedCount} prices updated`);
            actionStatus.className = 'pyro-s-status ok';
            rerenderTab(panel, 'prices', ctx);
        } else {
            setErrStatus(actionStatus, result.error ?? 'Unknown error');
            actionStatus.className = 'pyro-s-status err';
        }
    });

    resetBtn.addEventListener('click', event => {
        event.stopPropagation();
        ctx.clearManualPrices();
        ctx.clearApiPrices();
        actionStatus.textContent = 'Reset to bundled prices';
        actionStatus.className = 'pyro-s-status';
        rerenderTab(panel, 'prices', ctx);
    });

    for (const group of PRICE_GROUPS) {
        const g = el('div', 'pyro-s-group');
        const title = el('div', 'pyro-s-group-title');
        title.textContent = group.title;
        g.appendChild(title);

        for (const id of group.ids) {
            const resource = CATALOG[id];
            if (!resource) continue;
            const row = el('div', 'pyro-s-row');
            const label = el('span', 'pyro-s-label');
            label.textContent = resource.name;
            label.title = resource.name;
            row.appendChild(label);
            row.appendChild(priceInput(id, ctx));
            g.appendChild(row);
        }

        if (group !== PRICE_GROUPS[0]) {
            const divider = el('hr', 'pyro-s-divider');
            root.appendChild(divider);
        }

        root.appendChild(g);
    }

    const note = el('p', 'pyro-s-section-note');
    note.innerHTML = `${ICON_INFO}<span>Saved prices as of ${CATALOG_UPDATED}. API price active in <span style="color: var(--pyro-api-color);">green</span>. Manual override in <span style="color: var(--pyro-manual-color);">blue</span>. Clear manual price to revert to API or database <span style="color: var(--pyro-db-color);">default</span>.</span>`;
    root.appendChild(note);

    return root;
}

// ---------------------------------------------------------------------------
// Thresholds tab
// ---------------------------------------------------------------------------

function thresholdInput(
    label: string,
    getVal: () => number,
    setVal: (n: number) => void,
): HTMLElement {
    const row = el('div', 'pyro-s-row');
    const lbl = el('span', 'pyro-s-label');
    const [before, after] = label.split('→');
    lbl.appendChild(txt(before.trim()));
    lbl.appendChild(svgEl(ICON_ARROW_RIGHT));
    lbl.appendChild(txt((after ?? '').trim()));
    const input = el('input', 'pyro-s-input');
    input.type = 'number';
    input.min = '0';
    input.value = String(getVal());
    input.addEventListener('blur', () => {
        const val = Math.round(parseFloat(input.value));
        if (!isNaN(val) && val >= 0) {
            setVal(val);
            input.value = String(val);
        } else {
            input.value = String(getVal());
        }
    });
    input.addEventListener('keydown', e => { if (e.key === 'Enter') input.blur(); });
    row.appendChild(lbl);
    row.appendChild(input);
    return row;
}

function buildThresholdsTab(ctx: SettingsCtx): HTMLElement {
    const root = el('div');
    const thresholdsGroup = el('div', 'pyro-s-group');

    const bandNote = el('p', 'pyro-s-section-note');
    bandNote.innerHTML = `${ICON_INFO}<span>Cards are color-coded by profit/nerve: <span style="color:${BAND_COLOR.negative}">negative</span> (≤ 0), <span style="color:${BAND_COLOR.low}">low</span>, <span style="color:${BAND_COLOR.good}">good</span>, <span style="color:${BAND_COLOR.excellent}">excellent</span>.</span>`;
    thresholdsGroup.appendChild(bandNote);

    thresholdsGroup.appendChild(thresholdInput(
        'Low → Good ($/N)',
        () => ctx.getThresholds().low,
        val => {
            const t = ctx.getThresholds();
            ctx.setThresholds({ low: val, good: Math.max(val, t.good) });
        },
    ));
    thresholdsGroup.appendChild(thresholdInput(
        'Good → Excellent ($/N)',
        () => ctx.getThresholds().good,
        val => {
            const t = ctx.getThresholds();
            ctx.setThresholds({ low: Math.min(t.low, val), good: val });
        },
    ));
    root.appendChild(thresholdsGroup);

    const divider = el('hr', 'pyro-s-divider');
    root.appendChild(divider);

    const tooltipGroup = el('div', 'pyro-s-group');
    const tooltipTitle = el('div', 'pyro-s-group-title');
    tooltipTitle.textContent = 'Tooltip';
    tooltipGroup.appendChild(tooltipTitle);

    const observedToggle = el('label', 'pyro-s-check-row');
    const observedCheckbox = document.createElement('input');
    observedCheckbox.type = 'checkbox';
    observedCheckbox.checked = ctx.getShowObservedPayouts();
    observedCheckbox.addEventListener('change', () => {
        ctx.setShowObservedPayouts(observedCheckbox.checked);
    });
    const observedLabel = el('span');
    observedLabel.textContent = 'Show observed payout and runs';
    observedToggle.appendChild(observedCheckbox);
    observedToggle.appendChild(observedLabel);
    tooltipGroup.appendChild(observedToggle);

    root.appendChild(tooltipGroup);
    return root;
}

// ---------------------------------------------------------------------------
// API tab
// ---------------------------------------------------------------------------

function buildApiTab(ctx: SettingsCtx): HTMLElement {
    const root = el('div');
    const keyGroup = el('div', 'pyro-s-group');

    const keyNote = el('p', 'pyro-s-section-note');
    keyNote.innerHTML = `${ICON_INFO}<span><strong>Public access</strong> only, used solely to fetch item market prices. <a href="https://www.torn.com/preferences.php#tab=api?step=addNewKey&title=Arsonist%27s+Ledger&torn=items" target="_blank" rel="noopener noreferrer">Create one ${ICON_EXTERNAL_LINK}</a></span>`;
    keyGroup.appendChild(keyNote);

    const storageNote = el('p', 'pyro-s-section-note');
    storageNote.innerHTML = `${ICON_INFO}<span>Stored by your userscript manager only, <strong>never</strong> sent to any server other than Torn's API.</span>`;
    keyGroup.appendChild(storageNote);

    const keyRow = el('div', 'pyro-s-key-row');
    const keyInput = el('input', 'pyro-s-key-input');
    keyInput.type = 'password';
    keyInput.placeholder = 'Your Torn API key';
    keyInput.value = ctx.getApiKey();
    keyInput.autocomplete = 'off';
    keyInput.spellcheck = false;

    const saveBtn = el('button', 'pyro-s-btn');
    saveBtn.textContent = 'Validate & save';
    keyRow.appendChild(keyInput);
    keyRow.appendChild(saveBtn);
    keyGroup.appendChild(keyRow);

    const keyStatus = el('div', 'pyro-s-status');
    if (ctx.getApiKey()) {
        setOkStatus(keyStatus, 'Key saved');
        keyStatus.className = 'pyro-s-status ok';
    }
    keyGroup.appendChild(keyStatus);
    root.appendChild(keyGroup);

    saveBtn.addEventListener('click', async () => {
        const key = keyInput.value.trim();
        if (!key) {
            setErrStatus(keyStatus, 'Enter a key first.');
            keyStatus.className = 'pyro-s-status err';
            return;
        }

        saveBtn.disabled = true;
        keyStatus.textContent = 'Validating…';
        keyStatus.className = 'pyro-s-status';

        const result = await fetchApiPrices(key);
        saveBtn.disabled = false;

        if (result.success && result.prices) {
            ctx.setApiKey(key);
            ctx.setApiPrices(result.prices, Date.now());
            setOkStatus(keyStatus, `Valid, ${result.updatedCount} prices updated`);
            keyStatus.className = 'pyro-s-status ok';
        } else {
            setErrStatus(keyStatus, result.error ?? 'Unknown error');
            keyStatus.className = 'pyro-s-status err';
        }
    });

    return root;
}

function formatTimestamp(ts: number): string {
    return new Date(ts).toLocaleString(undefined, {
        month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit',
    });
}

// ---------------------------------------------------------------------------
// Tab switching
// ---------------------------------------------------------------------------

type TabId = 'prices' | 'thresholds' | 'api';

function buildTabBar(activeId: string, onSwitch: (id: TabId) => void): HTMLElement {
    const tabs: Array<{ id: TabId; label: string }> = [
        { id: 'prices',     label: 'Prices'     },
        { id: 'thresholds', label: 'Thresholds' },
        { id: 'api',        label: 'API'        },
    ];
    const bar = el('div', 'pyro-tab-bar');
    for (const tab of tabs) {
        const btn = el('button', tab.id === activeId ? 'pyro-tab active' : 'pyro-tab');
        btn.textContent = tab.label;
        btn.dataset.tab = tab.id;
        btn.addEventListener('click', () => {
            bar.querySelectorAll('.pyro-tab').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            onSwitch(tab.id);
        });
        bar.appendChild(btn);
    }
    return bar;
}

function rerenderTab(panel: HTMLElement, tabId: string, ctx: SettingsCtx): void {
    const content = panel.querySelector<HTMLElement>('.pyro-tab-content');
    if (!content) return;
    content.innerHTML = '';
    content.appendChild(buildTabContent(tabId, ctx, panel));
}

function buildTabContent(tabId: string, ctx: SettingsCtx, panel: HTMLElement): HTMLElement {
    switch (tabId) {
        case 'prices':     return buildPricesTab(ctx, panel);
        case 'thresholds': return buildThresholdsTab(ctx);
        case 'api':        return buildApiTab(ctx);
        default:           return buildPricesTab(ctx, panel);
    }
}

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------

export function injectSettings(root: Element, ctx: SettingsCtx): void {
    const existing = document.getElementById('pyro-settings-btn');
    if (existing) {
        if (root.contains(existing)) return;
        existing.closest('.pyro-settings-wrap')?.remove();
    }

    injectSettingsStyles();

    const anchor = root.querySelector(SEL.RESULT_COUNTS) ?? root.querySelector(SEL.TITLE_BAR) ?? root;

    const wrap = el('div', 'pyro-settings-wrap');

    const btn = el('button');
    btn.id = 'pyro-settings-btn';
    btn.setAttribute('aria-label', "Arsonist's Ledger settings");
    btn.setAttribute('aria-expanded', 'false');
    btn.innerHTML = ICON_FLAME;

    const panel = el('div');
    panel.id = 'pyro-settings-panel';

    const activeTabId = ctx.getActiveTab() || 'prices';
    panel.appendChild(buildTabBar(activeTabId, tabId => {
        ctx.setActiveTab(tabId);
        rerenderTab(panel, tabId, ctx);
    }));

    const content = el('div', 'pyro-tab-content');
    content.appendChild(buildTabContent(activeTabId, ctx, panel));
    panel.appendChild(content);

    wrap.appendChild(btn);
    wrap.appendChild(panel);
    anchor.appendChild(wrap);

    btn.addEventListener('click', e => {
        e.stopPropagation();
        const isOpen = panel.classList.contains('is-open');
        panel.classList.toggle('is-open', !isOpen);
        btn.setAttribute('aria-expanded', String(!isOpen));
    });

    panel.addEventListener('click', e => {
        e.stopPropagation();
    });

    document.addEventListener('click', e => {
        const path = typeof e.composedPath === 'function' ? e.composedPath() : [];
        const clickedInside = path.length > 0 ? path.includes(wrap) : wrap.contains(e.target as Node);
        if (!clickedInside) {
            panel.classList.remove('is-open');
            btn.setAttribute('aria-expanded', 'false');
        }
    }, { passive: true });
}
