import { CATALOG, CATALOG_UPDATED, type ResourceId } from '../../data/catalog.js';
import { type PriceMap, type ProfitThresholds } from './engine.js';
import { fetchApiPrices } from './api.js';
import { SEL } from './selectors.js';

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

export interface SettingsCtx {
    getManualPrices(): PriceMap;
    getApiPrices(): PriceMap;
    getThresholds(): ProfitThresholds;
    getApiKey(): string;
    getApiLastRefresh(): number;
    getDebugMode(): boolean;
    getActiveTab(): string;
    getMissingScenarios(): string[];

    setManualPrice(id: ResourceId, price: number): void;
    clearManualPrice(id: ResourceId): void;
    setThresholds(t: ProfitThresholds): void;
    setApiPrices(prices: PriceMap, timestamp: number): void;
    clearApiPrices(): void;
    setApiKey(key: string): void;
    setDebugMode(on: boolean): void;
    setActiveTab(tab: string): void;
}

// ---------------------------------------------------------------------------
// DOM helpers
// ---------------------------------------------------------------------------

function el<K extends keyof HTMLElementTagNameMap>(
    tag: K,
    className?: string,
): HTMLElementTagNameMap[K] {
    const e = document.createElement(tag);
    if (className) e.className = className;
    return e;
}

function txt(content: string): Text {
    return document.createTextNode(content);
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
    position: relative;
    display: inline-flex;
    align-items: center;
    margin-left: 8px;
}
#pyro-settings-btn {
    background: none;
    border: 1px solid rgba(255,255,255,0.18);
    color: #bbb;
    cursor: pointer;
    border-radius: 4px;
    padding: 2px 7px;
    font-size: 13px;
    line-height: 1.4;
    user-select: none;
}
#pyro-settings-btn:hover { background: rgba(255,255,255,0.08); color: #fff; }
#pyro-settings-panel {
    position: absolute;
    top: calc(100% + 6px);
    right: 0;
    z-index: 9999;
    background: #1c1c1c;
    border: 1px solid #3a3a3a;
    border-radius: 6px;
    min-width: 290px;
    max-width: 360px;
    box-shadow: 0 6px 20px rgba(0,0,0,0.55);
    overflow: hidden;
}
.pyro-tab-bar {
    display: flex;
    background: #161616;
    border-bottom: 1px solid #303030;
}
.pyro-tab {
    flex: 1;
    background: none;
    border: none;
    border-bottom: 2px solid transparent;
    color: #777;
    cursor: pointer;
    padding: 7px 2px;
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.04em;
}
.pyro-tab:hover { color: #bbb; }
.pyro-tab.active { color: #fff; border-bottom-color: #4ef; }
.pyro-tab-content {
    padding: 10px;
    max-height: 380px;
    overflow-y: auto;
}
.pyro-s-group { margin-bottom: 10px; }
.pyro-s-group:last-child { margin-bottom: 0; }
.pyro-s-group-title {
    font-size: 9px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: #555;
    margin-bottom: 5px;
    padding-bottom: 3px;
    border-bottom: 1px solid #2a2a2a;
}
.pyro-s-row {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 3px;
}
.pyro-s-label {
    flex: 1;
    font-size: 11px;
    color: #aaa;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    min-width: 0;
}
.pyro-s-input {
    width: 76px;
    background: #252525;
    border: 1px solid #3a3a3a;
    color: #ddd;
    font-size: 11px;
    padding: 3px 5px;
    border-radius: 3px;
    text-align: right;
    -moz-appearance: textfield;
}
.pyro-s-input::-webkit-inner-spin-button,
.pyro-s-input::-webkit-outer-spin-button { -webkit-appearance: none; }
.pyro-s-input:focus { outline: none; border-color: #4ef; }
.pyro-s-input.from-api   { border-color: #48a; color: #7af; }
.pyro-s-input.overridden { border-color: #4a4; color: #6d6; }
.pyro-s-divider { border: none; border-top: 1px solid #2a2a2a; margin: 8px 0; }
.pyro-s-key-row { display: flex; gap: 6px; margin-bottom: 6px; }
.pyro-s-key-input {
    flex: 1;
    background: #252525;
    border: 1px solid #3a3a3a;
    color: #ddd;
    font-size: 11px;
    padding: 4px 6px;
    border-radius: 3px;
    min-width: 0;
    font-family: monospace;
}
.pyro-s-key-input:focus { outline: none; border-color: #4ef; }
.pyro-s-btn {
    background: #252525;
    border: 1px solid #484848;
    color: #bbb;
    cursor: pointer;
    border-radius: 3px;
    padding: 4px 9px;
    font-size: 11px;
    white-space: nowrap;
}
.pyro-s-btn:hover:not(:disabled) { background: #303030; color: #fff; }
.pyro-s-btn:disabled { opacity: 0.35; cursor: default; }
.pyro-s-status {
    font-size: 10px;
    margin-bottom: 8px;
    min-height: 13px;
    color: #666;
}
.pyro-s-status.ok  { color: #6c6; }
.pyro-s-status.err { color: #c66; }
.pyro-s-refresh-row { display: flex; align-items: center; gap: 8px; }
.pyro-s-timestamp { font-size: 10px; color: #555; }
.pyro-s-check-row {
    display: flex;
    align-items: center;
    gap: 7px;
    margin-bottom: 7px;
    font-size: 12px;
    color: #bbb;
    cursor: pointer;
    user-select: none;
}
.pyro-s-check-row input[type=checkbox] { cursor: pointer; }
.pyro-s-section-note { font-size: 10px; color: #555; margin-bottom: 6px; }
.pyro-s-section-note a { color: #4ef; text-decoration: none; }
.pyro-s-section-note a:hover { text-decoration: underline; }
.pyro-s-missing-header { font-size: 10px; color: #666; margin: 8px 0 4px; }
.pyro-s-missing-list { font-size: 10px; color: #777; padding-left: 14px; margin: 0; }
.pyro-s-missing-list li { margin-bottom: 2px; font-family: monospace; }
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
    };
    refresh();

    const commit = () => {
        const raw = input.value.trim();
        if (raw === '') {
            ctx.clearManualPrice(id);
        } else {
            const val = Math.round(parseFloat(raw));
            if (!isNaN(val) && val >= 0) ctx.setManualPrice(id, val);
        }
        refresh();
    };
    input.addEventListener('blur', commit);
    input.addEventListener('keydown', e => { if (e.key === 'Enter') input.blur(); });
    return input;
}

// ---------------------------------------------------------------------------
// Prices tab
// ---------------------------------------------------------------------------

const PRICE_GROUPS: Array<{ title: string; ids: ResourceId[] }> = [
    {
        title: 'Liquid fuels',
        ids: ['gasoline', 'diesel', 'kerosene'],
    },
    {
        title: 'Solid fuels',
        ids: ['magnesium', 'thermite', 'saltpetre', 'potassium_nitrate'],
    },
    {
        title: 'Gaseous fuels',
        ids: ['oxygen', 'methane', 'hydrogen'],
    },
    {
        title: 'Evidence',
        ids: Object.values(CATALOG)
            .filter(r => r.kind === 'evidence')
            .sort((a, b) => a.name.localeCompare(b.name))
            .map(r => r.id as ResourceId),
    },
];

function buildPricesTab(ctx: SettingsCtx): HTMLElement {
    const root = el('div');

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

        root.appendChild(g);
    }

    const note = el('p', 'pyro-s-section-note');
    note.textContent = `DB prices as of ${CATALOG_UPDATED}. Blue = API price active. Green = manual override. Clear a field to revert to the next tier.`;
    root.appendChild(note);

    return root;
}

// ---------------------------------------------------------------------------
// Highlights tab
// ---------------------------------------------------------------------------

function thresholdInput(
    label: string,
    getVal: () => number,
    setVal: (n: number) => void,
    ctx: SettingsCtx,
): HTMLElement {
    const row = el('div', 'pyro-s-row');
    const lbl = el('span', 'pyro-s-label');
    lbl.textContent = label;
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

function buildHighlightsTab(ctx: SettingsCtx): HTMLElement {
    const root = el('div');

    const g = el('div', 'pyro-s-group');
    const title = el('div', 'pyro-s-group-title');
    title.textContent = 'Profit bands ($/nerve)';
    g.appendChild(title);

    const bandNote = el('p', 'pyro-s-section-note');
    bandNote.textContent = 'negative ≤ 0 < low ≤ X < good ≤ Y < jackpot';
    g.appendChild(bandNote);

    g.appendChild(thresholdInput(
        'Low threshold',
        () => ctx.getThresholds().low,
        val => {
            const t = ctx.getThresholds();
            ctx.setThresholds({ low: val, good: Math.max(val, t.good) });
        },
        ctx,
    ));
    g.appendChild(thresholdInput(
        'Good threshold',
        () => ctx.getThresholds().good,
        val => {
            const t = ctx.getThresholds();
            ctx.setThresholds({ low: Math.min(t.low, val), good: val });
        },
        ctx,
    ));

    root.appendChild(g);
    return root;
}

// ---------------------------------------------------------------------------
// API tab
// ---------------------------------------------------------------------------

function buildApiTab(ctx: SettingsCtx, panel: HTMLElement): HTMLElement {
    const root = el('div');

    // Key row
    const keyGroup = el('div', 'pyro-s-group');
    const keyTitle = el('div', 'pyro-s-group-title');
    keyTitle.textContent = 'Torn API key';
    keyGroup.appendChild(keyTitle);

    const keyNote = el('p', 'pyro-s-section-note');
    keyNote.textContent = 'Public access only — used solely to fetch item market prices. ';
    const keyLink = el('a');
    keyLink.href = 'https://www.torn.com/preferences.php#tab=api?step=addNewKey&title=Pyromaniac%27s+Ledger&torn=items';
    keyLink.textContent = 'Create one →';
    keyLink.target = '_blank';
    keyLink.rel = 'noopener noreferrer';
    keyNote.appendChild(keyLink);
    keyGroup.appendChild(keyNote);

    const storageNote = el('p', 'pyro-s-section-note');
    storageNote.textContent = 'Key is stored in Tampermonkey only — never sent to any server other than Torn\'s API.';
    keyGroup.appendChild(storageNote);

    const keyRow = el('div', 'pyro-s-key-row');
    const keyInput = el('input', 'pyro-s-key-input');
    keyInput.type = 'password';
    keyInput.placeholder = 'Your Torn API key';
    keyInput.value = ctx.getApiKey();
    keyInput.autocomplete = 'off';
    keyInput.spellcheck = false;

    const saveBtn = el('button', 'pyro-s-btn');
    saveBtn.textContent = 'Validate & Save';
    keyRow.appendChild(keyInput);
    keyRow.appendChild(saveBtn);
    keyGroup.appendChild(keyRow);

    const keyStatus = el('div', 'pyro-s-status');
    if (ctx.getApiKey()) {
        keyStatus.textContent = '✓ Key saved';
        keyStatus.className = 'pyro-s-status ok';
    }
    keyGroup.appendChild(keyStatus);
    root.appendChild(keyGroup);

    saveBtn.addEventListener('click', async () => {
        const key = keyInput.value.trim();
        if (!key) { keyStatus.textContent = 'Enter a key first.'; keyStatus.className = 'pyro-s-status err'; return; }

        saveBtn.disabled = true;
        keyStatus.textContent = 'Validating…';
        keyStatus.className = 'pyro-s-status';

        const result = await fetchApiPrices(key);
        saveBtn.disabled = false;

        if (result.success && result.prices) {
            ctx.setApiKey(key);
            ctx.setApiPrices(result.prices, Date.now());
            keyStatus.textContent = `✓ Valid — ${result.updatedCount} prices updated`;
            keyStatus.className = 'pyro-s-status ok';
            rerenderTab(panel, 'api', ctx);
        } else {
            keyStatus.textContent = `✗ ${result.error ?? 'Unknown error'}`;
            keyStatus.className = 'pyro-s-status err';
        }
    });

    // Refresh row
    const hr = el('hr', 'pyro-s-divider');
    root.appendChild(hr);

    const refreshGroup = el('div', 'pyro-s-group');
    const refreshTitle = el('div', 'pyro-s-group-title');
    refreshTitle.textContent = 'Market prices';
    refreshGroup.appendChild(refreshTitle);

    const dbNote = el('p', 'pyro-s-section-note');
    dbNote.textContent = `Built-in DB prices: ${CATALOG_UPDATED}. An API key lets you fetch live market prices instead.`;
    refreshGroup.appendChild(dbNote);

    const refreshRow = el('div', 'pyro-s-refresh-row');
    const refreshBtn = el('button', 'pyro-s-btn');
    refreshBtn.textContent = 'Refresh';
    if (!ctx.getApiKey()) refreshBtn.disabled = true;

    const resetBtn = el('button', 'pyro-s-btn');
    resetBtn.textContent = 'Reset to DB';
    if (!ctx.getApiLastRefresh()) resetBtn.disabled = true;

    const ts = ctx.getApiLastRefresh();
    const tsEl = el('span', 'pyro-s-timestamp');
    tsEl.textContent = ts ? `Fetched: ${formatTimestamp(ts)}` : '';
    refreshRow.appendChild(refreshBtn);
    refreshRow.appendChild(resetBtn);
    refreshRow.appendChild(tsEl);
    refreshGroup.appendChild(refreshRow);

    const refreshStatus = el('div', 'pyro-s-status');
    refreshGroup.appendChild(refreshStatus);
    root.appendChild(refreshGroup);

    refreshBtn.addEventListener('click', async () => {
        refreshBtn.disabled = true;
        refreshStatus.textContent = 'Refreshing…';
        refreshStatus.className = 'pyro-s-status';

        const result = await fetchApiPrices(ctx.getApiKey());
        refreshBtn.disabled = !ctx.getApiKey();

        if (result.success && result.prices) {
            ctx.setApiPrices(result.prices, Date.now());
            refreshStatus.textContent = `✓ ${result.updatedCount} prices updated`;
            refreshStatus.className = 'pyro-s-status ok';
            tsEl.textContent = `Fetched: ${formatTimestamp(ctx.getApiLastRefresh())}`;
            resetBtn.disabled = false;
        } else {
            refreshStatus.textContent = `✗ ${result.error ?? 'Unknown error'}`;
            refreshStatus.className = 'pyro-s-status err';
        }
    });

    resetBtn.addEventListener('click', () => {
        ctx.clearApiPrices();
        tsEl.textContent = '';
        resetBtn.disabled = true;
        refreshStatus.textContent = 'Restored built-in DB prices.';
        refreshStatus.className = 'pyro-s-status ok';
    });

    return root;
}

function formatTimestamp(ts: number): string {
    const d = new Date(ts);
    return d.toLocaleString(undefined, {
        month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit',
    });
}

// ---------------------------------------------------------------------------
// Debug tab
// ---------------------------------------------------------------------------

function buildDebugTab(ctx: SettingsCtx): HTMLElement {
    const root = el('div');

    const checkRow = el('label', 'pyro-s-check-row');
    const checkbox = el('input');
    checkbox.type = 'checkbox';
    checkbox.checked = ctx.getDebugMode();
    checkbox.addEventListener('change', () => ctx.setDebugMode(checkbox.checked));
    checkRow.appendChild(checkbox);
    checkRow.appendChild(txt('Debug mode'));
    root.appendChild(checkRow);

    const missing = ctx.getMissingScenarios();
    const header = el('div', 'pyro-s-missing-header');
    header.textContent = missing.length
        ? `Missing strategies observed this session (${missing.length}):`
        : 'No missing strategies observed this session.';
    root.appendChild(header);

    if (missing.length > 0) {
        const list = el('ul', 'pyro-s-missing-list');
        for (const name of missing) {
            const li = el('li');
            li.textContent = name;
            list.appendChild(li);
        }
        root.appendChild(list);
    }

    return root;
}

// ---------------------------------------------------------------------------
// Tab switching
// ---------------------------------------------------------------------------

const TABS = [
    { id: 'prices',     label: 'Prices'     },
    { id: 'highlights', label: 'Highlights' },
    { id: 'api',        label: 'API'        },
    { id: 'debug',      label: 'Debug'      },
] as const;

type TabId = typeof TABS[number]['id'];

function buildTabBar(activeId: string, onSwitch: (id: TabId) => void): HTMLElement {
    const bar = el('div', 'pyro-tab-bar');
    for (const tab of TABS) {
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
        case 'prices':     return buildPricesTab(ctx);
        case 'highlights': return buildHighlightsTab(ctx);
        case 'api':        return buildApiTab(ctx, panel);
        case 'debug':      return buildDebugTab(ctx);
        default:           return buildPricesTab(ctx);
    }
}

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------

export function injectSettings(root: Element, ctx: SettingsCtx): void {
    const existing = document.getElementById('pyro-settings-btn');
    if (existing) {
        if (root.contains(existing)) return;
        // Orphaned (e.g. injected into body fallback) — remove and re-inject into correct anchor
        existing.closest('.pyro-settings-wrap')?.remove();
    }

    injectSettingsStyles();

    const anchor = root.querySelector(SEL.RESULT_COUNTS) ?? root.querySelector(SEL.TITLE_BAR) ?? root;

    const wrap = el('div', 'pyro-settings-wrap');

    const btn = el('button');
    btn.id = 'pyro-settings-btn';
    btn.setAttribute('aria-label', "Pyromaniac's Ledger settings");
    btn.setAttribute('aria-expanded', 'false');
    btn.textContent = '⚙';

    const panel = el('div');
    panel.id = 'pyro-settings-panel';
    panel.setAttribute('hidden', '');

    const activeTab = ctx.getActiveTab() || 'prices';
    panel.appendChild(buildTabBar(activeTab, tabId => {
        ctx.setActiveTab(tabId);
        rerenderTab(panel, tabId, ctx);
    }));

    const content = el('div', 'pyro-tab-content');
    content.appendChild(buildTabContent(activeTab, ctx, panel));
    panel.appendChild(content);

    wrap.appendChild(btn);
    wrap.appendChild(panel);
    anchor.appendChild(wrap);

    btn.addEventListener('click', e => {
        e.stopPropagation();
        const hidden = panel.hasAttribute('hidden');
        panel.toggleAttribute('hidden', !hidden);
        btn.setAttribute('aria-expanded', String(hidden));
    });

    document.addEventListener('click', e => {
        if (!wrap.contains(e.target as Node)) {
            panel.setAttribute('hidden', '');
            btn.setAttribute('aria-expanded', 'false');
        }
    }, { passive: true });
}
