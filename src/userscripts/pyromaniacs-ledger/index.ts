// ==UserScript==
// @name        Torn Pyromaniac's Ledger
// @namespace   https://github.com/NHG-Design/balaclava
// @version     0.1.0
// @description Arson profit-per-nerve calculator and strategy guide for Torn's Crimes page
// @icon        https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @author      Balaclava
// @match       https://www.torn.com/page.php?sid=crimes*
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       unsafeWindow
// @require     https://raw.githubusercontent.com/NHG-Design/balaclava/main/dist/balaclava-tooltip.user.js
// @run-at      document-idle
// ==/UserScript==

import { STRATEGIES, type Strategy } from '../../data/strategies.js';
import {
    rankForScenario,
    formatPpn,
    DEFAULT_THRESHOLDS,
    type PriceMap,
    type RankedStrategy,
} from './engine.js';
import { buildTooltipContent, buildTooltipStyles } from './tooltip.js';
import { SEL } from './selectors.js';

// ---------------------------------------------------------------------------
// Storage keys — all under the pyroLedger.v1 namespace
// ---------------------------------------------------------------------------
const KEY_DEBUG   = 'pyroLedger.v1.debug';
const KEY_PRICES  = 'pyroLedger.v1.prices';

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
let prices: PriceMap = {};
let debugMode = false;
let visibleMobileSection: HTMLElement | null = null;

function loadState(): void {
    debugMode = store_get(KEY_DEBUG) === 'true';
    try {
        const saved = store_get(KEY_PRICES, '{}');
        prices = JSON.parse(saved) as PriceMap;
    } catch {
        prices = {};
    }
}

// ---------------------------------------------------------------------------
// Skill detection (CS >= 80 = has flamethrower)
// ---------------------------------------------------------------------------
function getSkillValue(): number {
    // Prefer scoped lookup; fall back to document-wide in case panel moves.
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

    // Inject tooltip content styles into the BalaclavaTooltip shadow when it initialises
    injectTooltipContentStyles();
}

function injectTooltipContentStyles(): void {
    // BalaclavaTooltip uses a shadow DOM; we inject .pyro-tt-* styles into the
    // regular document so they're available when BalaclavaTooltip clones our
    // content node into its shadow (cloneNode does not carry shadow styles, but
    // BalaclavaTooltip's content div is in the shadow while .pyro-tt fills it —
    // so we need the styles in the light DOM stylesheet that the shadow inherits
    // via inherited CSS custom properties, OR we inline them here).
    if (document.getElementById('pyro-tt-styles')) return;
    const style = document.createElement('style');
    style.id = 'pyro-tt-styles';
    // BalaclavaTooltip clones our node into its shadow root. The shadow inherits
    // nothing from the document stylesheet. We therefore inline the pyro-tt
    // styles as a <style> inside the content node itself when we build it.
    // This placeholder is kept here for any future light-DOM usage.
    style.textContent = '';
    document.head.appendChild(style);
}

// ---------------------------------------------------------------------------
// Scan and annotate
// ---------------------------------------------------------------------------
function applyToSection(section: HTMLElement, allRanked: RankedStrategy[], scenarioName: string): void {
    // Remove any previous pyro annotations
    section.querySelector('.pyro-label')?.remove();
    section.classList.forEach(c => { if (c.startsWith('pyro-band--')) section.classList.remove(c); });

    const scenarioEl = section.querySelector<HTMLElement>(SEL.SCENARIO);
    const titleSection = scenarioEl?.closest<HTMLElement>(SEL.TITLE_SECTION) ?? null;

    // Best confirmed strategy drives the inline label and band
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

    // Lazy getter so content is fresh after price/settings resets
    const getContent = (): HTMLElement => buildTooltipContentWithStyles(allRanked);

    // Desktop hover
    hoverTarget.addEventListener('mouseenter', () => {
        tryTooltip(api => api.show(hoverTarget, getContent(), { position: 'top', theme: 'dark' }));
    });
    hoverTarget.addEventListener('mouseleave', () => {
        tryTooltip(api => api.hide());
    });

    // Mobile tap toggle
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

    // Outside tap closes
    document.addEventListener('click', e => {
        if (visibleMobileSection === section && !section.contains(e.target as Node)) {
            tryTooltip(api => api.hide());
            visibleMobileSection = null;
        }
    }, { passive: true });
}

function buildTooltipContentWithStyles(allRanked: RankedStrategy[]): HTMLElement {
    const node = buildTooltipContent(allRanked);

    // Embed .pyro-tt-* styles inline so they survive shadow DOM cloning
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

    getRoot().querySelectorAll<HTMLElement>(SEL.CARD).forEach(section => {
        if (section.dataset.pyroScanned) return;
        section.dataset.pyroScanned = 'true';

        const scenarioEl = section.querySelector('[class*="scenario___"]');
        const rawName = scenarioEl?.textContent?.trim() ?? '';
        if (!rawName) return;

        const candidates = strategyIndex.get(rawName.toLowerCase()) ?? [];
        const allRanked = rankForScenario(candidates, hasFlamethrower, prices, DEFAULT_THRESHOLDS);

        applyToSection(section, allRanked, rawName);
    });
}

/** Re-annotate all cards with current prices/settings. Called by settings UI on any change. */
export function resetScans(): void {
    getRoot().querySelectorAll<HTMLElement>(SEL.CARD).forEach(section => {
        delete section.dataset.pyroScanned;
    });
    scanPage();
}

// ---------------------------------------------------------------------------
// MutationObserver loop
// ---------------------------------------------------------------------------
const observer = new MutationObserver(() => {
    scanPage();
});

function start(): void {
    loadState();
    injectHighlightStyles();
    scanPage();
    observer.observe(document.body, { childList: true, subtree: true });
    if (debugMode) console.log('[PyroLedger] started, debug on');
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
} else {
    start();
}
