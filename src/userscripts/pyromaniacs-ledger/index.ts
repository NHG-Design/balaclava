import { STRATEGIES, type Strategy } from '../../data/strategies.js';
import {
    rankForScenario,
    formatPpn,
    DEFAULT_THRESHOLDS,
    type PriceMap,
    type ProfitThresholds,
    type RankedStrategy,
} from './engine.js';
import { buildTooltipContent, buildTooltipStyles } from './tooltip.js';
import { SEL } from './selectors.js';
import { injectSettings, type SettingsCtx } from './settings.js';
import type { ResourceId } from '../../data/catalog.js';

// ---------------------------------------------------------------------------
// Storage keys
// ---------------------------------------------------------------------------
const KEY_DEBUG          = 'pyroLedger.v1.debug';
const KEY_MANUAL_PRICES  = 'pyroLedger.v1.manualPrices';
const KEY_API_PRICES     = 'pyroLedger.v1.apiPrices';
const KEY_API_KEY        = 'pyroLedger.v1.apiKey';
const KEY_API_REFRESH    = 'pyroLedger.v1.apiRefresh';
const KEY_THRESHOLDS     = 'pyroLedger.v1.thresholds';
const KEY_ACTIVE_TAB     = 'pyroLedger.v1.activeTab';

// ---------------------------------------------------------------------------
// Minimal GM storage shim (falls back to localStorage in dev/non-GM contexts)
// ---------------------------------------------------------------------------
declare const GM_getValue: ((key: string, def?: string) => string) | undefined;
declare const GM_setValue: ((key: string, val: string) => void) | undefined;
declare const unsafeWindow: typeof window | undefined;

function store_get(key: string, def = ''): string {
    if (typeof GM_getValue !== 'undefined') return GM_getValue(key, def);
    return localStorage.getItem(key) ?? def;
}

function store_set(key: string, val: string): void {
    if (typeof GM_setValue !== 'undefined') { GM_setValue(key, val); return; }
    localStorage.setItem(key, val);
}

// ---------------------------------------------------------------------------
// BalaclavaTooltip API detection
// ---------------------------------------------------------------------------
interface BalaclavaTooltipAPI {
    show: (target: HTMLElement, content: string | Node, options?: { position?: string; theme?: string }) => void;
    hide: () => void;
}

function getTooltipAPI(): BalaclavaTooltipAPI | null {
    const w = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;
    const api = (w as unknown as Record<string, unknown>)['BalaclavaTooltip'];
    if (api && typeof (api as BalaclavaTooltipAPI).show === 'function') {
        return api as BalaclavaTooltipAPI;
    }
    return null;
}

let tooltipWarned = false;

function tryTooltip(callback: (api: BalaclavaTooltipAPI) => void): void {
    const api = getTooltipAPI();
    if (!api) {
        if (!tooltipWarned) {
            console.warn('[PyroLedger] BalaclavaTooltip not found — tooltips disabled.');
            tooltipWarned = true;
        }
        return;
    }
    callback(api);
}

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------
let manualPrices: PriceMap = {};
let apiPrices: PriceMap = {};
let apiKey = '';
let apiLastRefresh = 0;
let thresholds: ProfitThresholds = { ...DEFAULT_THRESHOLDS };
let debugMode = false;
let activeTab = 'prices';
let visibleMobileSection: HTMLElement | null = null;
const missingScenarios = new Set<string>();

function effectivePrices(): PriceMap {
    return { ...apiPrices, ...manualPrices };
}

function loadState(): void {
    debugMode = store_get(KEY_DEBUG) === 'true';
    apiKey = store_get(KEY_API_KEY, '');
    activeTab = store_get(KEY_ACTIVE_TAB, 'prices');
    apiLastRefresh = parseInt(store_get(KEY_API_REFRESH, '0'), 10) || 0;

    try { manualPrices = JSON.parse(store_get(KEY_MANUAL_PRICES, '{}')) as PriceMap; }
    catch { manualPrices = {}; }

    try { apiPrices = JSON.parse(store_get(KEY_API_PRICES, '{}')) as PriceMap; }
    catch { apiPrices = {}; }

    try {
        const saved = JSON.parse(store_get(KEY_THRESHOLDS, '{}')) as Partial<ProfitThresholds>;
        if (typeof saved.low === 'number' && typeof saved.good === 'number') {
            thresholds = { low: saved.low, good: saved.good };
        }
    } catch { /* use defaults */ }
}

// ---------------------------------------------------------------------------
// State mutation helpers — persist + trigger re-scan where needed
// ---------------------------------------------------------------------------
function setManualPrice(id: ResourceId, price: number): void {
    manualPrices = { ...manualPrices, [id]: price };
    store_set(KEY_MANUAL_PRICES, JSON.stringify(manualPrices));
    resetScans();
}

function clearManualPrice(id: ResourceId): void {
    const next = { ...manualPrices };
    delete next[id];
    manualPrices = next;
    store_set(KEY_MANUAL_PRICES, JSON.stringify(manualPrices));
    resetScans();
}

function setThresholds(t: ProfitThresholds): void {
    thresholds = t;
    store_set(KEY_THRESHOLDS, JSON.stringify(thresholds));
    resetScans();
}

function setApiPrices(prices: PriceMap, timestamp: number): void {
    apiPrices = prices;
    apiLastRefresh = timestamp;
    store_set(KEY_API_PRICES, JSON.stringify(apiPrices));
    store_set(KEY_API_REFRESH, String(apiLastRefresh));
    resetScans();
}

function setApiKey(key: string): void {
    apiKey = key;
    store_set(KEY_API_KEY, apiKey);
}

function setDebugMode(on: boolean): void {
    debugMode = on;
    store_set(KEY_DEBUG, String(debugMode));
}

function setActiveTab(tab: string): void {
    activeTab = tab;
    store_set(KEY_ACTIVE_TAB, activeTab);
}

// ---------------------------------------------------------------------------
// Skill detection (CS >= 80 = has flamethrower)
// ---------------------------------------------------------------------------
function getSkillValue(): number {
    const btn = document.querySelector(`${SEL.STATS_PANEL} ${SEL.SKILL_BTN}`)
             ?? document.querySelector(SEL.SKILL_BTN);
    if (!btn) return 0;
    const m = btn.getAttribute('aria-label')?.match(/Skill:\s*([\d.]+)/);
    return m ? parseFloat(m[1]) : 0;
}

// ---------------------------------------------------------------------------
// Strategy index: scenarioName → Strategy[]
// ---------------------------------------------------------------------------
const strategyIndex = new Map<string, Strategy[]>();
for (const s of STRATEGIES) {
    const key = s.scenarioName.toLowerCase();
    const existing = strategyIndex.get(key);
    if (existing) {
        existing.push(s);
    } else {
        strategyIndex.set(key, [s]);
    }
}

// ---------------------------------------------------------------------------
// Highlight CSS
// ---------------------------------------------------------------------------
function injectHighlightStyles(): void {
    if (document.getElementById('pyro-highlight-styles')) return;
    const style = document.createElement('style');
    style.id = 'pyro-highlight-styles';
    style.textContent = `
        .pyro-label {
            display: inline-block;
            margin-left: 6px;
            font-size: 11px;
            font-weight: bold;
            padding: 1px 5px;
            border-radius: 3px;
            vertical-align: middle;
            pointer-events: none;
        }
        .pyro-label--unconfirmed { opacity: 0.55; }

        .pyro-band--negative .pyro-label { color: #c44; }
        .pyro-band--low      .pyro-label { color: #b90; }
        .pyro-band--good     .pyro-label { color: #4a4; }
        .pyro-band--jackpot  .pyro-label { color: #0cc; }

        .arson-root .pyro-band--negative [class*="titleSection___"] { background: rgba(120,40,40,0.25) !important; }
        .arson-root .pyro-band--low      [class*="titleSection___"] { background: rgba(180,140,0,0.15) !important; }
        .arson-root .pyro-band--good     [class*="titleSection___"] { background: rgba(40,140,60,0.15) !important; }
        .arson-root .pyro-band--jackpot  [class*="titleSection___"] { background: rgba(0,200,200,0.15) !important; }
    `;
    document.head.appendChild(style);

    injectTooltipContentStyles();
}

function injectTooltipContentStyles(): void {
    if (document.getElementById('pyro-tt-styles')) return;
    const style = document.createElement('style');
    style.id = 'pyro-tt-styles';
    style.textContent = '';
    document.head.appendChild(style);
}

// ---------------------------------------------------------------------------
// Scan and annotate
// ---------------------------------------------------------------------------
function applyToSection(section: HTMLElement, allRanked: RankedStrategy[], scenarioName: string): void {
    section.querySelector('.pyro-label')?.remove();
    section.classList.forEach(c => { if (c.startsWith('pyro-band--')) section.classList.remove(c); });

    const scenarioEl = section.querySelector<HTMLElement>(SEL.SCENARIO);
    const titleSection = scenarioEl?.closest<HTMLElement>(SEL.TITLE_SECTION) ?? null;

    const best = allRanked.find(r => !r.strategy.needsVerification) ?? null;

    if (!best) {
        if (debugMode) {
            const label = document.createElement('span');
            label.className = 'pyro-label pyro-label--unconfirmed';
            label.textContent = '?';
            label.title = `No strategy: ${scenarioName}`;
            scenarioEl?.appendChild(label);
        }
        return;
    }

    section.classList.add(`pyro-band--${best.band}`);

    if (scenarioEl) {
        const label = document.createElement('span');
        label.className = 'pyro-label';
        label.textContent = formatPpn(best.profitPerNerve);
        scenarioEl.appendChild(label);
    }

    const hoverTarget = titleSection ?? section;
    wireTooltip(section, hoverTarget, allRanked);
}

function wireTooltip(section: HTMLElement, hoverTarget: HTMLElement, allRanked: RankedStrategy[]): void {
    if (section.dataset.pyroTooltipWired) return;
    section.dataset.pyroTooltipWired = 'true';

    const getContent = (): HTMLElement => buildTooltipContentWithStyles(allRanked);

    hoverTarget.addEventListener('mouseenter', () => {
        tryTooltip(api => api.show(hoverTarget, getContent(), { position: 'top', theme: 'dark' }));
    });
    hoverTarget.addEventListener('mouseleave', () => {
        tryTooltip(api => api.hide());
    });

    section.addEventListener('click', e => {
        if ((e.target as HTMLElement).closest('button, a, input, select, textarea, [role="button"]')) return;

        tryTooltip(api => {
            if (visibleMobileSection === section) {
                api.hide();
                visibleMobileSection = null;
            } else {
                api.show(section, getContent(), { position: 'top', theme: 'dark' });
                visibleMobileSection = section;
            }
        });
    });

    document.addEventListener('click', e => {
        if (visibleMobileSection === section && !section.contains(e.target as Node)) {
            tryTooltip(api => api.hide());
            visibleMobileSection = null;
        }
    }, { passive: true });
}

function buildTooltipContentWithStyles(allRanked: RankedStrategy[]): HTMLElement {
    const node = buildTooltipContent(allRanked);

    const style = document.createElement('style');
    style.textContent = buildTooltipStyles();
    node.insertBefore(style, node.firstChild);

    return node;
}

function getRoot(): Element {
    return document.querySelector(SEL.ROOT) ?? document.body;
}

function scanPage(): void {
    const hasFlamethrower = getSkillValue() >= 80;
    const prices = effectivePrices();

    getRoot().querySelectorAll<HTMLElement>(SEL.CARD).forEach(section => {
        if (section.dataset.pyroScanned) return;
        section.dataset.pyroScanned = 'true';

        const scenarioEl = section.querySelector('[class*="scenario___"]');
        const rawName = scenarioEl?.textContent?.trim() ?? '';
        if (!rawName) return;

        const candidates = strategyIndex.get(rawName.toLowerCase()) ?? [];

        if (candidates.length === 0 && debugMode) {
            missingScenarios.add(rawName);
        }

        const allRanked = rankForScenario(candidates, hasFlamethrower, prices, thresholds);
        applyToSection(section, allRanked, rawName);
    });
}

/** Re-annotate all cards with current prices/settings. Called by settings UI on any change. */
export function resetScans(): void {
    getRoot().querySelectorAll<HTMLElement>(SEL.CARD).forEach(section => {
        delete section.dataset.pyroScanned;
        delete section.dataset.pyroTooltipWired;
    });
    scanPage();
}

// ---------------------------------------------------------------------------
// Settings context
// ---------------------------------------------------------------------------
const settingsCtx: SettingsCtx = {
    getManualPrices: () => manualPrices,
    getApiPrices: () => apiPrices,
    getThresholds: () => thresholds,
    getApiKey: () => apiKey,
    getApiLastRefresh: () => apiLastRefresh,
    getDebugMode: () => debugMode,
    getActiveTab: () => activeTab,
    getMissingScenarios: () => Array.from(missingScenarios),

    setManualPrice,
    clearManualPrice,
    setThresholds,
    setApiPrices,
    setApiKey,
    setDebugMode,
    setActiveTab,
};

// ---------------------------------------------------------------------------
// MutationObserver loop
// ---------------------------------------------------------------------------
const observer = new MutationObserver(() => {
    scanPage();
    // Re-inject settings if the arson root was re-mounted
    if (!document.getElementById('pyro-settings-btn')) {
        injectSettings(getRoot(), settingsCtx);
    }
});

function start(): void {
    loadState();
    injectHighlightStyles();
    scanPage();
    injectSettings(getRoot(), settingsCtx);
    observer.observe(document.body, { childList: true, subtree: true });
    if (debugMode) console.log('[PyroLedger] started, debug on');
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
} else {
    start();
}
