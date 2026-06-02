import { SCENARIOS_VERSION } from '../../data/scenarios-version.js';
import { SCENARIOS, type Scenario } from '../../data/scenarios.js';
import '../balaclava-tooltip/index.js';
import {
    rankForScenario,
    formatPpn,
    DEFAULT_THRESHOLDS,
    type PriceMap,
    type ProfitThresholds,
    type RankedScenario,
} from './engine.js';
import { buildTooltipContent, buildTooltipStyles } from './tooltip.js';
import { SEL } from './selectors.js';
import { BAND_COLOR } from './colors.js';
import { injectSettings, type SettingsCtx } from './settings.js';
import { el } from './dom.js';
import { ICON_INFO } from './icons.js';
import type { ResourceId } from '../../data/catalog.js';

// ---------------------------------------------------------------------------
// Storage keys
// ---------------------------------------------------------------------------
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
            console.warn('[ArsonistsLedger] BalaclavaTooltip not found — tooltips disabled.');
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
let activeTab = 'prices';
let visibleMobileSection: HTMLElement | null = null;

function effectivePrices(): PriceMap {
    return { ...apiPrices, ...manualPrices };
}

function loadState(): void {
    apiKey        = store_get(KEY_API_KEY, '');
    activeTab     = store_get(KEY_ACTIVE_TAB, 'prices');
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
// State mutation helpers
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

function setActiveTab(tab: string): void {
    activeTab = tab;
    store_set(KEY_ACTIVE_TAB, activeTab);
}

// ---------------------------------------------------------------------------
// Scenario index: scenarioName (lowercase) → Scenario
// ---------------------------------------------------------------------------
const KEY_SCENARIOS_CACHE = `pyroLedger.${SCENARIOS_VERSION}.scenariosCache`;
const KEY_SCENARIOS_TS    = `pyroLedger.${SCENARIOS_VERSION}.scenariosTs`;
const SCENARIOS_URL       = 'https://balaclava.app/arsonists-ledger/scenarios.json';
const SCENARIOS_TTL_MS    = 24 * 60 * 60 * 1000;

const scenarioIndex = new Map<string, Scenario>();

function populateScenarioIndex(scenarios: Scenario[]): void {
    scenarioIndex.clear();
    for (const s of scenarios) {
        const key = s.scenarioName.toLowerCase();
        if (!scenarioIndex.has(key)) scenarioIndex.set(key, s);
    }
}

function scheduleScenarioRefresh(): void {
    if (typeof GM_xmlhttpRequest === 'undefined') return;

    const ts = parseInt(store_get(KEY_SCENARIOS_TS, '0'), 10) || 0;
    const now = Date.now();

    if (now - ts < SCENARIOS_TTL_MS) {
        try {
            const cached = JSON.parse(store_get(KEY_SCENARIOS_CACHE, '')) as Scenario[];
            if (Array.isArray(cached) && cached.length > 0) {
                populateScenarioIndex(cached);
                resetScans();
            }
        } catch { /* no cache */ }
        return;
    }

    GM_xmlhttpRequest({
        method: 'GET',
        url: SCENARIOS_URL,
        onload(r) {
            if (r.status !== 200) return;
            try {
                const fresh = JSON.parse(r.responseText) as Scenario[];
                if (!Array.isArray(fresh) || fresh.length === 0) return;
                store_set(KEY_SCENARIOS_CACHE, r.responseText);
                store_set(KEY_SCENARIOS_TS, String(now));
                populateScenarioIndex(fresh);
                resetScans();
            } catch { /* keep empty */ }
        },
        onerror() { /* keep empty */ },
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
        .arson-root .pyro-band--excellent { box-shadow: inset -5px 0 0 ${BAND_COLOR.excellent} !important; }
        .arson-root .pyro-band--unknown  { box-shadow: inset -5px 0 0 ${BAND_COLOR.unknown}  !important; }

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
}

// ---------------------------------------------------------------------------
// Scan and annotate
// ---------------------------------------------------------------------------
function injectInfoBadge(crimeImage: HTMLElement): void {
    if (crimeImage.querySelector('.pyro-info-badge')) return;
    const badge = el('span', 'pyro-info-badge');
    badge.innerHTML = ICON_INFO;
    crimeImage.appendChild(badge);
}

function buildUnknownTooltip(): HTMLElement {
    const wrap = el('div');
    const style = el('style');
    style.textContent = buildTooltipStyles();
    wrap.appendChild(style);
    const msg = el('div');
    msg.style.cssText = 'padding:10px 12px;font-size:11px;color:#888;line-height:1.5;max-width:220px;';
    msg.textContent = "This scenario isn't covered by Arsonist's Ledger yet — no scenario data available.";
    wrap.appendChild(msg);
    return wrap;
}

function applyToSection(section: HTMLElement, ranked: RankedScenario | null): void {
    section.querySelector('.pyro-label')?.remove();
    section.classList.forEach(c => { if (c.startsWith('pyro-band--')) section.classList.remove(c); });

    const crimeImage = section.querySelector<HTMLElement>(SEL.CRIME_IMAGE);
    const hoverTarget = crimeImage ?? section;

    if (!ranked) {
        section.classList.add('pyro-band--unknown');
        if (crimeImage) injectInfoBadge(crimeImage);
        wireTooltip(section, hoverTarget, () => buildUnknownTooltip());
        return;
    }

    section.classList.add(`pyro-band--${ranked.band}`);
    if (crimeImage) injectInfoBadge(crimeImage);
    wireTooltip(section, hoverTarget, () => {
        const statsOnly = isPendingCollect(section) && !ranked.Scenario.needsVerification;
        return buildTooltipContentWithStyles(ranked, effectivePrices(), statsOnly);
    });
}

// ---------------------------------------------------------------------------
// Tooltip wiring
// ---------------------------------------------------------------------------
function isPendingCollect(section: HTMLElement): boolean {
    return section.classList.contains('pending-collect') || !!section.closest(SEL.PENDING_COLLECT);
}

const tooltipState = new WeakMap<HTMLElement, { getContent: () => HTMLElement }>();

function wireTooltip(section: HTMLElement, hoverTarget: HTMLElement, getContent: () => HTMLElement): void {
    const existing = tooltipState.get(section);
    if (existing) {
        existing.getContent = getContent;
        return;
    }
    const state = { getContent };
    tooltipState.set(section, state);

    hoverTarget.addEventListener('mouseenter', () => {
        tryTooltip(api => api.show(hoverTarget, state.getContent(), { position: 'top', theme: 'dark' }));
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
                api.show(hoverTarget, state.getContent(), { position: 'top', theme: 'dark' });
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

function buildTooltipContentWithStyles(ranked: RankedScenario | null, prices: PriceMap, statsOnly = false): HTMLElement {
    const node = buildTooltipContent(ranked, prices, statsOnly);
    const style = el('style');
    style.textContent = buildTooltipStyles();
    node.insertBefore(style, node.firstChild);
    return node;
}

function getRoot(): Element {
    return document.querySelector(SEL.ROOT) ?? document.body;
}

function isArsonPage(): boolean {
    return !!document.querySelector(SEL.ROOT);
}

function isPageActive(): boolean {
    return document.visibilityState === 'visible' && document.hasFocus();
}

function scanPage(): void {
    if (!isArsonPage() || !isPageActive()) return;
    const prices = effectivePrices();

    getRoot().querySelectorAll<HTMLElement>(SEL.CARD).forEach(section => {
        if (section.dataset.pyroScanned) return;
        section.dataset.pyroScanned = 'true';

        const scenarioEl = section.querySelector('[class*="scenario___"]');
        const rawName = scenarioEl?.textContent?.trim() ?? '';
        if (!rawName) return;

        const scenario = scenarioIndex.get(rawName.toLowerCase()) ?? null;
        const ranked = scenario ? rankForScenario(scenario, prices, thresholds) : null;
        applyToSection(section, ranked);
    });
}

export function resetScans(): void {
    getRoot().querySelectorAll<HTMLElement>(SEL.CARD).forEach(section => {
        delete section.dataset.pyroScanned;
    });
    scanPage();
}

// ---------------------------------------------------------------------------
// Settings context
// ---------------------------------------------------------------------------
const settingsCtx: SettingsCtx = {
    getManualPrices:   () => manualPrices,
    getApiPrices:      () => apiPrices,
    getThresholds:     () => thresholds,
    getApiKey:         () => apiKey,
    getApiLastRefresh: () => apiLastRefresh,
    getActiveTab:      () => activeTab,

    setManualPrice,
    clearManualPrice,
    setThresholds,
    setApiPrices,
    clearApiPrices,
    setApiKey,
    setActiveTab,
};

// ---------------------------------------------------------------------------
// MutationObserver loop
// ---------------------------------------------------------------------------
let reInjectTimer: ReturnType<typeof setTimeout> | null = null;

function scheduleInjectSettings(): void {
    if (reInjectTimer !== null) return;
    reInjectTimer = setTimeout(() => {
        reInjectTimer = null;
        if (!isArsonPage()) return;
        const root = getRoot();
        const btn = document.getElementById('pyro-settings-btn');
        if (!btn || !root.contains(btn)) {
            injectSettings(root, settingsCtx);
        }
    }, 200);
}

const observer = new MutationObserver(() => {
    if (!isPageActive()) return;
    scanPage();
    scheduleInjectSettings();
});

function handlePageActivityChange(): void {
    if (!isPageActive()) {
        visibleMobileSection = null;
        tryTooltip(api => api.hide());
        return;
    }

    resetScans();
    scheduleInjectSettings();
}

function start(): void {
    loadState();
    populateScenarioIndex(SCENARIOS);
    injectHighlightStyles();
    observer.observe(document.body, { childList: true, subtree: true });
    scheduleScenarioRefresh();
    document.addEventListener('visibilitychange', handlePageActivityChange, { passive: true });
    window.addEventListener('focus', handlePageActivityChange, { passive: true });
    window.addEventListener('blur', handlePageActivityChange, { passive: true });
    if (isArsonPage()) {
        scanPage();
        injectSettings(getRoot(), settingsCtx);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
} else {
    start();
}
