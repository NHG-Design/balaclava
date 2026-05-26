import { STRATEGIES, type Strategy } from '../../data/strategies.js';
import '../balaclava-tooltip/index.js';
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
import { BAND_COLOR } from './colors.js';
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
declare const GM_xmlhttpRequest: ((options: {
    method: string; url: string;
    onload: (r: { status: number; responseText: string }) => void;
    onerror?: () => void;
}) => void) | undefined;

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
    // Check both unsafeWindow and window — @require'd scripts may run in a
    // different execution context than the main script (e.g. TornPDA), so the
    // API may be registered on a different object than the one we'd check first.
    const candidates: (typeof window)[] = [];
    if (typeof unsafeWindow !== 'undefined') candidates.push(unsafeWindow);
    if (!candidates.includes(window)) candidates.push(window);

    for (const w of candidates) {
        const api = (w as unknown as Record<string, unknown>)['BalaclavaTooltip'];
        if (api && typeof (api as BalaclavaTooltipAPI).show === 'function') {
            return api as BalaclavaTooltipAPI;
        }
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

function clearApiPrices(): void {
    setApiPrices({}, 0);
}

function setApiKey(key: string): void {
    apiKey = key;
    store_set(KEY_API_KEY, apiKey);
}

function setDebugMode(on: boolean): void {
    debugMode = on;
    store_set(KEY_DEBUG, String(debugMode));
    resetScans();
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
const KEY_STRATEGIES_CACHE = 'pyroLedger.v1.strategiesCache';
const KEY_STRATEGIES_TS    = 'pyroLedger.v1.strategiesTs';
const STRATEGIES_URL       = 'https://balaclava.app/pyromaniacs-ledger/strategies.json';
const STRATEGIES_TTL_MS    = 24 * 60 * 60 * 1000;

const strategyIndex = new Map<string, Strategy[]>();

function populateStrategyIndex(strategies: Strategy[]): void {
    strategyIndex.clear();
    for (const s of strategies) {
        const key = s.scenarioName.toLowerCase();
        const existing = strategyIndex.get(key);
        if (existing) { existing.push(s); } else { strategyIndex.set(key, [s]); }
    }
}

function loadStrategies(): void {
    populateStrategyIndex(STRATEGIES);
}

function scheduleStrategyRefresh(): void {
    if (typeof GM_xmlhttpRequest === 'undefined') return;

    const ts = parseInt(store_get(KEY_STRATEGIES_TS, '0'), 10) || 0;
    const now = Date.now();

    if (now - ts < STRATEGIES_TTL_MS) {
        try {
            const cached = JSON.parse(store_get(KEY_STRATEGIES_CACHE, '')) as Strategy[];
            if (Array.isArray(cached) && cached.length > 0) {
                populateStrategyIndex(cached);
                resetScans();
            }
        } catch { /* keep bundled */ }
        return;
    }

    GM_xmlhttpRequest({
        method: 'GET',
        url: STRATEGIES_URL,
        onload(r) {
            if (r.status !== 200) return;
            try {
                const fresh = JSON.parse(r.responseText) as Strategy[];
                if (!Array.isArray(fresh) || fresh.length === 0) return;
                store_set(KEY_STRATEGIES_CACHE, r.responseText);
                store_set(KEY_STRATEGIES_TS, String(now));
                populateStrategyIndex(fresh);
                resetScans();
            } catch { /* keep bundled */ }
        },
        onerror() { /* keep bundled */ },
    });
}

// ---------------------------------------------------------------------------
// Highlight CSS
// ---------------------------------------------------------------------------
function injectHighlightStyles(): void {
    if (document.getElementById('pyro-highlight-styles')) return;
    const style = document.createElement('style');
    style.id = 'pyro-highlight-styles';
    style.textContent = `
        .pyro-label { display: none; }

        .arson-root .pyro-band--negative { box-shadow: inset -5px 0 0 ${BAND_COLOR.negative} !important; }
        .arson-root .pyro-band--low      { box-shadow: inset -5px 0 0 ${BAND_COLOR.low}      !important; }
        .arson-root .pyro-band--good     { box-shadow: inset -5px 0 0 ${BAND_COLOR.good}     !important; }
        .arson-root .pyro-band--jackpot  { box-shadow: inset -5px 0 0 ${BAND_COLOR.jackpot}  !important; }

        .crime-image { position: relative !important; }
        .pyro-info-badge {
            position: absolute;
            bottom: 2px;
            right: 2px;
            width: 14px;
            height: 14px;
            padding: 1px;
            background: #fff;
            border-radius: 50%;
            color: #2a2a2a;
            pointer-events: none;
            user-select: none;
        }
        .pyro-info-badge svg { display: block; width: 100%; height: 100%; }
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
    const bestUnconfirmed = best ? null : (allRanked[0] ?? null);

    if (!best && !bestUnconfirmed) {
        if (debugMode && !!section.querySelector(SEL.DESKTOP_STATUS_SECTION)) {
            const label = document.createElement('span');
            label.className = 'pyro-label pyro-label--unconfirmed';
            label.textContent = '?';
            label.title = `No strategy: ${scenarioName}`;
            scenarioEl?.appendChild(label);
        }
        return;
    }

    const display = best ?? bestUnconfirmed!;
    section.classList.add(`pyro-band--${display.band}`);

    const crimeImage = section.querySelector<HTMLElement>(SEL.CRIME_IMAGE);
    const hoverTarget = crimeImage ?? section;

    if (crimeImage && !crimeImage.querySelector('.pyro-info-badge')) {
        const badge = document.createElement('span');
        badge.className = 'pyro-info-badge';
        badge.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 10.941c2.333 -3.308 .167 -7.823 -1 -8.941c0 3.395 -2.235 5.299 -3.667 6.706c-1.43 1.408 -2.333 3.294 -2.333 5.588c0 3.704 3.134 6.706 7 6.706c3.866 0 7 -3.002 7 -6.706c0 -1.712 -1.232 -4.403 -2.333 -5.588c-2.084 3.353 -3.257 3.353 -4.667 2.235"/></svg>';
        crimeImage.appendChild(badge);
    }

    wireTooltip(section, hoverTarget, allRanked);
}

function isPendingCollect(section: HTMLElement): boolean {
    return section.classList.contains('pending-collect') || !!section.closest(SEL.PENDING_COLLECT);
}

// Per-card tooltip data, updated on each resetScans so a single set of listeners
// always reflects the latest prices without accumulating stale closures.
const tooltipData = new WeakMap<HTMLElement, RankedStrategy[]>();

function wireTooltip(section: HTMLElement, hoverTarget: HTMLElement, allRanked: RankedStrategy[]): void {
    tooltipData.set(section, allRanked);
    if (section.dataset.pyroTooltipWired) return;
    section.dataset.pyroTooltipWired = 'true';

    const getContent = (): HTMLElement => {
        const ranked = tooltipData.get(section) ?? [];
        // Pending-collect + fully verified: stats only (job done, no need to re-read actions).
        // Pending-collect + any unconfirmed: full tooltip so author can compare against outcome.
        const pending = isPendingCollect(section);
        const allVerified = ranked.length > 0 && ranked.every(r => !r.strategy.needsVerification);
        const statsOnly = pending && allVerified;
        return buildTooltipContentWithStyles(ranked, statsOnly);
    };

    hoverTarget.addEventListener('mouseenter', () => {
        tryTooltip(api => api.show(hoverTarget, getContent(), { position: 'top', theme: 'dark' }));
    });
    hoverTarget.addEventListener('mouseleave', () => {
        tryTooltip(api => api.hide());
    });

    hoverTarget.addEventListener('click', e => {
        if ((e.target as HTMLElement).closest('button, a, input, select, textarea, [role="button"]')) return;

        tryTooltip(api => {
            if (visibleMobileSection === section) {
                api.hide();
                visibleMobileSection = null;
            } else {
                api.show(hoverTarget, getContent(), { position: 'top', theme: 'dark' });
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

function buildTooltipContentWithStyles(allRanked: RankedStrategy[], statsOnly = false): HTMLElement {
    const node = buildTooltipContent(allRanked, statsOnly);

    const style = document.createElement('style');
    style.textContent = buildTooltipStyles();
    node.insertBefore(style, node.firstChild);

    return node;
}

function getRoot(): Element {
    return document.querySelector(SEL.ROOT) ?? document.body;
}

function cleanupSection(section: HTMLElement): void {
    section.querySelector('.pyro-label')?.remove();
    section.querySelector('.pyro-info-badge')?.remove();
    section.classList.forEach(c => { if (c.startsWith('pyro-band--')) section.classList.remove(c); });
    delete section.dataset.pyroScanned;
    delete section.dataset.pyroTooltipWired;
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
    clearApiPrices,
    setApiKey,
    setDebugMode,
    setActiveTab,
};

// ---------------------------------------------------------------------------
// MutationObserver loop
// ---------------------------------------------------------------------------

// Debounced re-injection: Torn's React replaces the titleBar node on each
// render cycle. Injecting synchronously inside the observer fires mid-render,
// causing the button to land in the body fallback or get wiped by the next
// React batch. A 200 ms debounce lets React settle before we inject.
let reInjectTimer: ReturnType<typeof setTimeout> | null = null;

function scheduleInjectSettings(): void {
    if (reInjectTimer !== null) return;
    reInjectTimer = setTimeout(() => {
        reInjectTimer = null;
        const root = getRoot();
        const btn = document.getElementById('pyro-settings-btn');
        if (!btn || !root.contains(btn)) {
            injectSettings(root, settingsCtx);
        }
    }, 200);
}

const observer = new MutationObserver(() => {
    scanPage();
    scheduleInjectSettings();
});

function start(): void {
    loadStrategies();
    loadState();
    injectHighlightStyles();
    scanPage();
    injectSettings(getRoot(), settingsCtx);
    observer.observe(document.body, { childList: true, subtree: true });
    scheduleStrategyRefresh();
    if (debugMode) console.log('[PyroLedger] started, debug on');
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
} else {
    start();
}
