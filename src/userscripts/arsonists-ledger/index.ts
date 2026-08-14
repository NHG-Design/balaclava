import { SCENARIOS_VERSION } from "../../data/scenarios-version.js";
import { SCENARIOS, type Scenario } from "../../data/scenarios.js";
import "../balaclava-tooltip/index.js";
import {
  rankForScenario,
  formatPpn,
  DEFAULT_THRESHOLDS,
  type PriceMap,
  type ProfitThresholds,
  type RankedScenario,
  type PayoutBasis,
} from "./engine.js";
import {
  buildTooltipContent,
  buildTooltipStyles,
  buildStatTooltip,
  buildStatTooltipGroup,
  type StatEntry,
} from "./tooltip.js";
import { SEL } from "./selectors.js";
import { BAND_COLOR } from "./colors.js";
import {
  injectSettings,
  openSettingsToSubmit,
  type SettingsCtx,
} from "./settings.js";
import { injectPopoverStyles } from "./popover.js";
import { ICON_FLAME, ICON_MATCHSTICK, ICON_SEND } from "./icons.js";
import { el, txt } from "./dom.js";
import { CATALOG_UPDATED, type ResourceId } from "../../data/catalog.js";
import {
  BUILDINGS,
  formatResponseTime,
  type Building,
} from "../../data/buildings.js";
import {
  ICON_TIMER,
  ICON_PIN,
  ICON_SIREN,
  ICON_FLAMABILITY,
  ICON_EMBER,
} from "./icons.js";
import {
  scanMaterialPopover,
  resetMaterialBadges,
  injectMaterialBadgeStyles,
  type TooltipCtx,
  type MaterialBadgeConfig,
} from "./material-badges.js";

// ---------------------------------------------------------------------------
// Storage keys
// ---------------------------------------------------------------------------
const KEY_MANUAL_PRICES = "pyroLedger.v1.manualPrices";
const KEY_API_PRICES = "pyroLedger.v1.apiPrices";
const KEY_API_KEY = "pyroLedger.v1.apiKey";
const KEY_API_REFRESH = "pyroLedger.v1.apiRefresh";
const KEY_CATALOG_UPDATED = "pyroLedger.v1.catalogUpdated";
const KEY_THRESHOLDS = "pyroLedger.v1.thresholds";
const KEY_ACTIVE_TAB = "pyroLedger.v1.activeTab";
const KEY_SHOW_OPTIONAL_BADGES = "pyroLedger.v1.showOptionalBadges";
const KEY_SHOW_RESOURCE_PRICES = "pyroLedger.v1.showResourcePrices";
const KEY_SHOW_SCENARIO_NAME = "pyroLedger.v1.showScenarioName";
const KEY_STACK_RESOURCES = "pyroLedger.v1.stackResources";
const KEY_PPN_BAR_POSITION = "pyroLedger.v1.ppnBarPosition";
const KEY_PAYOUT_BASIS = "pyroLedger.v1.payoutBasis";
const KEY_SHOW_BUILDING_STATS = "pyroLedger.v1.showBuildingStats";
const KEY_SHOW_RESPONSE_TIME = "pyroLedger.v1.showResponseTime";
const KEY_SHOW_FLAMMABILITY = "pyroLedger.v1.showFlammability";
const KEY_SHOW_RURALITY = "pyroLedger.v1.showRurality";
const KEY_SHOW_URGENCY = "pyroLedger.v1.showUrgency";
const KEY_SHOW_MATERIAL_DATA = "pyroLedger.v1.showMaterialData";
const KEY_SHOW_MATERIAL_INTENSITY = "pyroLedger.v1.showMaterialIntensity";
const KEY_SHOW_MATERIAL_MOMENTUM = "pyroLedger.v1.showMaterialMomentum";
const KEY_SHOW_MATERIAL_SUSPICION = "pyroLedger.v1.showMaterialSuspicion";
const KEY_SHOW_MATERIAL_IGNITION_RISK =
  "pyroLedger.v1.showMaterialIgnitionRisk";
const KEY_SHOW_MATERIAL_STOKING_RISK = "pyroLedger.v1.showMaterialStokingRisk";

// ---------------------------------------------------------------------------
// Minimal GM storage shim (falls back to localStorage in dev/non-GM contexts)
// ---------------------------------------------------------------------------
declare const GM_getValue: ((key: string, def?: string) => string) | undefined;
declare const GM_setValue: ((key: string, val: string) => void) | undefined;
declare const unsafeWindow: typeof window | undefined;
declare const GM_xmlhttpRequest:
  | ((options: {
      method: string;
      url: string;
      onload: (r: { status: number; responseText: string }) => void;
      onerror?: () => void;
    }) => void)
  | undefined;

function store_get(key: string, def = ""): string {
  if (typeof GM_getValue !== "undefined") return GM_getValue(key, def);
  return localStorage.getItem(key) ?? def;
}

function store_set(key: string, val: string): void {
  if (typeof GM_setValue !== "undefined") {
    GM_setValue(key, val);
    return;
  }
  localStorage.setItem(key, val);
}

// ---------------------------------------------------------------------------
// BalaclavaTooltip API detection
// ---------------------------------------------------------------------------
interface BalaclavaTooltipAPI {
  show: (
    target: HTMLElement,
    content: string | Node,
    options?: { position?: string },
  ) => void;
  hide: () => void;
}

function getTooltipAPI(): BalaclavaTooltipAPI | null {
  const candidates: (typeof window)[] = [];
  if (typeof unsafeWindow !== "undefined") candidates.push(unsafeWindow);
  if (!candidates.includes(window)) candidates.push(window);
  for (const w of candidates) {
    const api = (w as unknown as Record<string, unknown>)["BalaclavaTooltip"];
    if (api && typeof (api as BalaclavaTooltipAPI).show === "function") {
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
      console.warn(
        "[ArsonistsLedger] BalaclavaTooltip not found — tooltips disabled.",
      );
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
let apiKey = "";
let apiLastRefresh = 0;
let thresholds: ProfitThresholds = { ...DEFAULT_THRESHOLDS };
let activeTab = "prices";
let showOptionalBadges = true;
let showResourcePrices = true;
let showScenarioName = true;
let stackResources = true;
let ppnBarPosition: "left" | "right" = "right";
let payoutBasis: PayoutBasis = "average";
let showBuildingStats = false;
let showResponseTime = true;
let showFlammability = true;
let showRurality = true;
let showUrgency = true;
let showMaterialData = false;
let showMaterialIntensity = true;
let showMaterialMomentum = true;
let showMaterialSuspicion = true;
let showMaterialIgnitionRisk = true;
let showMaterialStokingRisk = true;
let visibleMobileSection: HTMLElement | null = null;
const IOS_USER_AGENT_RE = /iPad|iPhone|iPod/i;

function isIosDevice(): boolean {
  const platform = navigator.platform || "";
  const userAgent = navigator.userAgent || "";
  const maxTouchPoints = navigator.maxTouchPoints || 0;

  return (
    IOS_USER_AGENT_RE.test(userAgent) ||
    (platform === "MacIntel" && maxTouchPoints > 1)
  );
}

function effectivePrices(): PriceMap {
  return { ...apiPrices, ...manualPrices };
}

function loadState(): void {
  apiKey = store_get(KEY_API_KEY, "");
  activeTab = store_get(KEY_ACTIVE_TAB, "prices");
  apiLastRefresh = parseInt(store_get(KEY_API_REFRESH, "0"), 10) || 0;
  showOptionalBadges = store_get(KEY_SHOW_OPTIONAL_BADGES, "1") !== "0";
  showResourcePrices = store_get(KEY_SHOW_RESOURCE_PRICES, "1") !== "0";
  showScenarioName = store_get(KEY_SHOW_SCENARIO_NAME, "1") !== "0";
  stackResources = store_get(KEY_STACK_RESOURCES, "1") !== "0";
  ppnBarPosition =
    store_get(KEY_PPN_BAR_POSITION, "right") === "left" ? "left" : "right";
  payoutBasis =
    store_get(KEY_PAYOUT_BASIS, "average") === "max" ? "max" : "average";
  showBuildingStats = store_get(KEY_SHOW_BUILDING_STATS, "0") !== "0";
  showResponseTime = store_get(KEY_SHOW_RESPONSE_TIME, "1") !== "0";
  showFlammability = store_get(KEY_SHOW_FLAMMABILITY, "1") !== "0";
  showRurality = store_get(KEY_SHOW_RURALITY, "1") !== "0";
  showUrgency = store_get(KEY_SHOW_URGENCY, "1") !== "0";
  showMaterialData = store_get(KEY_SHOW_MATERIAL_DATA, "0") !== "0";
  showMaterialIntensity = store_get(KEY_SHOW_MATERIAL_INTENSITY, "1") !== "0";
  showMaterialMomentum = store_get(KEY_SHOW_MATERIAL_MOMENTUM, "1") !== "0";
  showMaterialSuspicion = store_get(KEY_SHOW_MATERIAL_SUSPICION, "1") !== "0";
  showMaterialIgnitionRisk =
    store_get(KEY_SHOW_MATERIAL_IGNITION_RISK, "1") !== "0";
  showMaterialStokingRisk =
    store_get(KEY_SHOW_MATERIAL_STOKING_RISK, "1") !== "0";

  try {
    manualPrices = JSON.parse(store_get(KEY_MANUAL_PRICES, "{}")) as PriceMap;
  } catch {
    manualPrices = {};
  }

  try {
    apiPrices = JSON.parse(store_get(KEY_API_PRICES, "{}")) as PriceMap;
  } catch {
    apiPrices = {};
  }

  try {
    const saved = JSON.parse(
      store_get(KEY_THRESHOLDS, "{}"),
    ) as Partial<ProfitThresholds>;
    if (typeof saved.low === "number" && typeof saved.good === "number") {
      thresholds = { low: saved.low, good: saved.good };
    }
  } catch {
    /* use defaults */
  }

  syncStoredPricesToCatalog();
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

function setShowOptionalBadgesEnabled(show: boolean): void {
  showOptionalBadges = show;
  store_set(KEY_SHOW_OPTIONAL_BADGES, show ? "1" : "0");
  resetScans();
}

function setShowResourcePricesEnabled(show: boolean): void {
  showResourcePrices = show;
  store_set(KEY_SHOW_RESOURCE_PRICES, show ? "1" : "0");
  resetScans();
}

function setShowScenarioNameEnabled(show: boolean): void {
  showScenarioName = show;
  store_set(KEY_SHOW_SCENARIO_NAME, show ? "1" : "0");
  resetScans();
}

function setStackResourcesEnabled(stack: boolean): void {
  stackResources = stack;
  store_set(KEY_STACK_RESOURCES, stack ? "1" : "0");
  resetScans();
}

function applyPpnBarPosition(): void {
  document.documentElement.setAttribute(
    "data-pyro-bar-position",
    ppnBarPosition,
  );
}

function setPpnBarPosition(position: "left" | "right"): void {
  ppnBarPosition = position;
  store_set(KEY_PPN_BAR_POSITION, position);
  applyPpnBarPosition();
}

function setPayoutBasis(basis: PayoutBasis): void {
  payoutBasis = basis;
  store_set(KEY_PAYOUT_BASIS, basis);
  resetScans();
}

function setShowBuildingStatsEnabled(show: boolean): void {
  showBuildingStats = show;
  store_set(KEY_SHOW_BUILDING_STATS, show ? "1" : "0");
  resetScans();
}

function setShowResponseTimeEnabled(show: boolean): void {
  showResponseTime = show;
  store_set(KEY_SHOW_RESPONSE_TIME, show ? "1" : "0");
  resetScans();
}

function setShowFlammabilityEnabled(show: boolean): void {
  showFlammability = show;
  store_set(KEY_SHOW_FLAMMABILITY, show ? "1" : "0");
  resetScans();
}

function setShowRuralityEnabled(show: boolean): void {
  showRurality = show;
  store_set(KEY_SHOW_RURALITY, show ? "1" : "0");
  resetScans();
}

function setShowUrgencyEnabled(show: boolean): void {
  showUrgency = show;
  store_set(KEY_SHOW_URGENCY, show ? "1" : "0");
  resetScans();
}

function materialBadgeConfig(): MaterialBadgeConfig {
  return {
    enabled: showMaterialData,
    intensity: showMaterialIntensity,
    momentum: showMaterialMomentum,
    suspicion: showMaterialSuspicion,
    ignitionRisk: showMaterialIgnitionRisk,
    stokingRisk: showMaterialStokingRisk,
  };
}

function resetMaterialScans(): void {
  resetMaterialBadges();
  scanMaterialPopover(materialBadgeTooltipCtx, materialBadgeConfig());
}

function setShowMaterialDataEnabled(show: boolean): void {
  showMaterialData = show;
  store_set(KEY_SHOW_MATERIAL_DATA, show ? "1" : "0");
  resetMaterialScans();
}

function setShowMaterialIntensityEnabled(show: boolean): void {
  showMaterialIntensity = show;
  store_set(KEY_SHOW_MATERIAL_INTENSITY, show ? "1" : "0");
  resetMaterialScans();
}

function setShowMaterialMomentumEnabled(show: boolean): void {
  showMaterialMomentum = show;
  store_set(KEY_SHOW_MATERIAL_MOMENTUM, show ? "1" : "0");
  resetMaterialScans();
}

function setShowMaterialSuspicionEnabled(show: boolean): void {
  showMaterialSuspicion = show;
  store_set(KEY_SHOW_MATERIAL_SUSPICION, show ? "1" : "0");
  resetMaterialScans();
}

function setShowMaterialIgnitionRiskEnabled(show: boolean): void {
  showMaterialIgnitionRisk = show;
  store_set(KEY_SHOW_MATERIAL_IGNITION_RISK, show ? "1" : "0");
  resetMaterialScans();
}

function setShowMaterialStokingRiskEnabled(show: boolean): void {
  showMaterialStokingRisk = show;
  store_set(KEY_SHOW_MATERIAL_STOKING_RISK, show ? "1" : "0");
  resetMaterialScans();
}

function setApiPrices(prices: PriceMap, timestamp: number): void {
  apiPrices = prices;
  apiLastRefresh = timestamp;
  store_set(KEY_API_PRICES, JSON.stringify(apiPrices));
  store_set(KEY_API_REFRESH, String(apiLastRefresh));
  store_set(KEY_CATALOG_UPDATED, CATALOG_UPDATED);
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

function clearManualPrices(): void {
  manualPrices = {};
  store_set(KEY_MANUAL_PRICES, JSON.stringify(manualPrices));
  resetScans();
}

function catalogUpdatedTimestamp(): number {
  return Date.parse(`${CATALOG_UPDATED}T00:00:00Z`);
}

function syncStoredPricesToCatalog(): void {
  const storedCatalogUpdated = store_get(KEY_CATALOG_UPDATED, "");
  if (storedCatalogUpdated === CATALOG_UPDATED) return;

  if (
    Object.keys(apiPrices).length > 0 &&
    apiLastRefresh < catalogUpdatedTimestamp()
  ) {
    apiPrices = {};
    apiLastRefresh = 0;
    store_set(KEY_API_PRICES, JSON.stringify(apiPrices));
    store_set(KEY_API_REFRESH, "0");
  }

  store_set(KEY_CATALOG_UPDATED, CATALOG_UPDATED);
}

// ---------------------------------------------------------------------------
// Scenario index: scenarioName (lowercase) → Scenario
// ---------------------------------------------------------------------------
const KEY_SCENARIOS_CACHE = `pyroLedger.${SCENARIOS_VERSION}.scenariosCache`;
const KEY_SCENARIOS_TS = `pyroLedger.${SCENARIOS_VERSION}.scenariosTs`;
const SCENARIOS_URL = "https://balaclava.app/arsonists-ledger/scenarios.json";
const SCENARIOS_TTL_MS = 24 * 60 * 60 * 1000;

const scenarioIndex = new Map<string, Scenario>();

function populateScenarioIndex(scenarios: Scenario[]): void {
  scenarioIndex.clear();
  for (const s of scenarios) {
    const key = s.scenarioName.toLowerCase();
    if (!scenarioIndex.has(key)) scenarioIndex.set(key, s);
  }
}

function scheduleScenarioRefresh(): void {
  if (typeof GM_xmlhttpRequest === "undefined") return;

  const ts = parseInt(store_get(KEY_SCENARIOS_TS, "0"), 10) || 0;
  const now = Date.now();

  if (now - ts < SCENARIOS_TTL_MS) {
    try {
      const cached = JSON.parse(
        store_get(KEY_SCENARIOS_CACHE, ""),
      ) as Scenario[];
      if (Array.isArray(cached) && cached.length > 0) {
        populateScenarioIndex(cached);
        resetScans();
      }
    } catch {
      /* no cache */
    }
    return;
  }

  GM_xmlhttpRequest({
    method: "GET",
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
      } catch {
        /* keep empty */
      }
    },
    onerror() {
      /* keep empty */
    },
  });
}

// ---------------------------------------------------------------------------
// Highlight CSS
// ---------------------------------------------------------------------------
function injectHighlightStyles(): void {
  if (document.getElementById("pyro-highlight-styles")) return;
  const style = document.createElement("style");
  style.id = "pyro-highlight-styles";
  style.textContent = `
        .pyro-label { display: none; }

        :root { --pyro-bar-x: -5px; }
        :root[data-pyro-bar-position="left"] { --pyro-bar-x: 5px; }

        .arson-root ${SEL.CARD} { position: relative; }
        .arson-root ${SEL.CARD}::after {
            content: "";
            position: absolute;
            inset: 0;
            pointer-events: none;
        }
        .arson-root .pyro-band--negative::after { box-shadow: inset var(--pyro-bar-x) 0 0 ${BAND_COLOR.negative} !important; }
        .arson-root .pyro-band--low::after      { box-shadow: inset var(--pyro-bar-x) 0 0 ${BAND_COLOR.low}      !important; }
        .arson-root .pyro-band--good::after     { box-shadow: inset var(--pyro-bar-x) 0 0 ${BAND_COLOR.good}     !important; }
        .arson-root .pyro-band--excellent::after { box-shadow: inset var(--pyro-bar-x) 0 0 ${BAND_COLOR.excellent} !important; }
        .arson-root .pyro-band--unknown::after  { box-shadow: inset var(--pyro-bar-x) 0 0 ${BAND_COLOR.unknown}  !important; }

        ${SEL.FIRE_METER},
        .crime-image,
        ${SEL.BUILDING_RESPONDER_ICONS} { position: relative !important; }
        .pyro-value-pill {
            position: absolute;
            top: 3px;
            right: 3px;
            padding: 2px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            background: var(--crimes-crimeOption-bgColor, #222);
            border: 1px solid var(--crimes-outcomeDivider-color, #444);
            border-radius: 3px;
            color: var(--crimes-subText-color, #eee);
            font-size: 10px;
            letter-spacing: 0.04em;
            line-height: 1;
            pointer-events: none;
            user-select: none;
            white-space: nowrap;
            z-index: 10;
        }
        .pyro-building-badges {
            position: absolute;
            inset: 0;
            display: flex;
            flex-wrap: wrap;
            align-items: flex-start;
            align-content: flex-start;
            gap: 2px;
            pointer-events: none;
            user-select: none;
            z-index: 10;
            padding: 2px;
        }
        .pyro-building-badge {
            display: inline-flex;
            align-items: center;
            gap: 2px;
            padding: 1px 3px;
            background: var(--crimes-crimeOption-bgColor, #222);
            border: 1px solid var(--crimes-outcomeDivider-color, #444);
            border-radius: 3px;
            color: var(--crimes-subText-color, #eee);
            font-size: 10px;
            letter-spacing: 0.02em;
            line-height: 1;
            white-space: nowrap;
            pointer-events: auto;
        }
        .pyro-building-badge svg {
            width: 12px;
            height: 12px;
            flex-shrink: 0;
        }
        .pyro-mobile-stat-badge {
            display: block;
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            padding: 0;
            margin: 0;
            border: 0;
            border-radius: 0;
            background: transparent;
            box-shadow: none;
            appearance: none;
            -webkit-appearance: none;
            cursor: pointer;
        }
        .pyro-mobile-stat-badge-icon {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 14px;
            height: 14px;
            border: 1px solid #444;
            border-radius: 50%;
            background: #333;
            position: absolute;
            right: -3px;
            top: -5px;
            pointer-events: none;
        }
        @media screen and (max-width: 386px) {
          .pyro-mobile-stat-badge-icon {
            right: 1px;
          }
        }
        .pyro-mobile-stat-badge-icon svg {
            width: 14px;
            height: 14px;
            padding: 0;
            box-sizing: border-box;
            border-radius: 50%;
            background: #333;
            color: #ff8a3d;
            filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.5));
        }
    `;
  document.head.appendChild(style);
}

// ---------------------------------------------------------------------------
// Scan and annotate
// ---------------------------------------------------------------------------
function getPillText(ranked: RankedScenario | null): string {
  if (!ranked) return "?";

  switch (ranked.band) {
    case "excellent":
      return "$$$";
    case "good":
      return "$$";
    case "low":
      return "$";
    case "negative":
      return "-";
    default:
      return "?";
  }
}

function ensureValuePill(
  target: HTMLElement,
  ranked: RankedScenario | null,
): void {
  let pill = target.querySelector<HTMLElement>(".pyro-value-pill");
  if (!pill) {
    pill = el("span", "pyro-value-pill");
    pill.setAttribute("aria-hidden", "true");
    target.appendChild(pill);
  }
  pill.textContent = getPillText(ranked);
}

function buildingBadgeRow(
  icon: string,
  value: string,
  tooltipContent: HTMLElement,
): HTMLElement {
  const row = el("span", "pyro-building-badge");
  row.innerHTML = icon;
  row.appendChild(txt(value));
  row.addEventListener("mouseenter", () => {
    tryTooltip((api) => api.show(row, tooltipContent, { position: "top" }));
  });
  row.addEventListener("mouseleave", () => {
    tryTooltip((api) => api.hide());
  });
  return row;
}

interface BuildingStat {
  icon: string;
  value: string;
  entry: StatEntry;
}

function collectBuildingStats(building: Building): BuildingStat[] {
  const stats: BuildingStat[] = [];
  if (!showBuildingStats) return stats;

  if (showResponseTime && building.responseTime > 0) {
    const value = formatResponseTime(building.responseTime);
    stats.push({
      icon: ICON_TIMER,
      value,
      entry: {
        title: "Response Time",
        description: "How long firefighters take to arrive once dispatched.",
        value,
      },
    });
  }
  if (showFlammability && building.flammability >= 0) {
    const value = String(building.flammability);
    stats.push({
      icon: ICON_FLAMABILITY,
      value,
      entry: {
        title: "Flammability",
        description:
          "How fast the fire's intensity scales, and its max destruction speed.",
        value,
        bar: {
          value: building.flammability,
          min: 1,
          max: 5,
          lowLabel: "Fire-resistant",
          highLabel: "Highly flammable",
          invert: true,
        },
      },
    });
  }
  if (showRurality && building.rurality >= 0) {
    const value = String(building.rurality);
    stats.push({
      icon: ICON_PIN,
      value,
      entry: {
        title: "Rurality",
        description:
          "How isolated the location is — drives dispatch delay and response time.",
        value,
        bar: {
          value: building.rurality,
          min: 1,
          max: 5,
          lowLabel: "Urban",
          highLabel: "Remote",
          invert: true,
        },
      },
    });
  }
  if (showUrgency && building.urgency !== null) {
    const value = String(building.urgency);
    stats.push({
      icon: ICON_SIREN,
      value,
      entry: {
        title: "Urgency",
        description:
          "How fast the danger alert escalates through response tiers.",
        value,
        bar: {
          value: building.urgency,
          min: 1,
          max: 6,
          lowLabel: "Gradual",
          highLabel: "Rapid",
        },
      },
    });
  }

  return stats;
}

function ensureBuildingBadges(
  target: HTMLElement,
  building: Building | null,
): void {
  let wrap = target.querySelector<HTMLElement>(".pyro-building-badges");
  const stats = building ? collectBuildingStats(building) : [];
  if (stats.length === 0) {
    wrap?.remove();
    return;
  }
  if (!wrap) {
    wrap = el("div", "pyro-building-badges");
    wrap.setAttribute("aria-hidden", "true");
    target.appendChild(wrap);
  }
  wrap.innerHTML = "";

  for (const stat of stats) {
    wrap.appendChild(
      buildingBadgeRow(
        stat.icon,
        stat.value,
        buildStatTooltip(
          stat.entry.title,
          stat.entry.description,
          stat.entry.bar,
        ),
      ),
    );
  }
}

let visibleMobileStatsBadge: HTMLElement | null = null;
const mobileStatsState = new WeakMap<HTMLElement, { entries: StatEntry[] }>();

function ensureMobileStatsBadge(
  section: HTMLElement,
  building: Building | null,
): void {
  const iconsRow = section.querySelector<HTMLElement>(
    SEL.BUILDING_RESPONDER_ICONS,
  );
  let badge = iconsRow?.querySelector<HTMLElement>(".pyro-mobile-stat-badge");
  const stats = building ? collectBuildingStats(building) : [];

  if (!iconsRow || stats.length === 0) {
    badge?.remove();
    return;
  }

  const entries = stats.map((s) => s.entry);
  const existing = badge ? mobileStatsState.get(badge) : undefined;
  if (existing) {
    existing.entries = entries;
  } else {
    const state = { entries };
    badge = el("button", "pyro-mobile-stat-badge");
    badge.setAttribute("type", "button");
    badge.setAttribute("aria-label", "Building stats");
    const badgeIcon = el("span", "pyro-mobile-stat-badge-icon");
    badgeIcon.innerHTML = ICON_EMBER;
    badge.appendChild(badgeIcon);
    mobileStatsState.set(badge, state);
    iconsRow.appendChild(badge);

    const badgeEl = badge;
    badgeEl.addEventListener("click", (e) => {
      e.stopPropagation();
      tryTooltip((api) => {
        if (visibleMobileStatsBadge === badgeEl) {
          api.hide();
          visibleMobileStatsBadge = null;
        } else {
          api.show(badgeEl, buildStatTooltipGroup(state.entries), {
            position: "top",
          });
          visibleMobileStatsBadge = badgeEl;
        }
      });
    });
    document.addEventListener(
      "click",
      (e) => {
        if (
          visibleMobileStatsBadge === badgeEl &&
          !badgeEl.contains(e.target as Node)
        ) {
          tryTooltip((api) => api.hide());
          visibleMobileStatsBadge = null;
        }
      },
      { passive: true },
    );
  }
}

function buildUnknownTooltip(): HTMLElement {
  const wrap = el("div");
  const style = el("style");
  style.textContent = buildTooltipStyles();
  wrap.appendChild(style);
  const msg = el("div");
  msg.style.cssText =
    "padding:10px 12px;font-size:11px;color:#888;line-height:1.5;max-width:220px;";
  msg.textContent =
    "This scenario isn't covered by Arsonist's Ledger yet — no scenario data available.";
  wrap.appendChild(msg);
  return wrap;
}

function attachRecipeSubmitTrigger(
  wrapperEl: HTMLElement,
  scenarioName: string,
): void {
  if (wrapperEl.querySelector(".pyro-submit-trigger-btn")) return;
  injectPopoverStyles();

  const btn = el("button", "pyro-popover-btn pyro-submit-trigger-btn");
  btn.type = "button";
  btn.setAttribute("aria-label", "Submit a recipe for this scenario");
  btn.innerHTML = ICON_FLAME;
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    openSettingsToSubmit(scenarioName);
  });
  wrapperEl.appendChild(btn);
}

function applyToSection(
  section: HTMLElement,
  ranked: RankedScenario | null,
  building: Building | null,
): void {
  section.querySelector(".pyro-label")?.remove();
  section.classList.forEach((c) => {
    if (c.startsWith("pyro-band--")) section.classList.remove(c);
  });

  const fireMeter = section.querySelector<HTMLElement>(SEL.FIRE_METER);
  const crimeImage = section.querySelector<HTMLElement>(SEL.CRIME_IMAGE);
  const hoverTarget = fireMeter ?? crimeImage ?? section;

  const isMobileLayout = !!section.querySelector(SEL.BUILDING_RESPONDER_ICONS);
  if (crimeImage) {
    ensureBuildingBadges(crimeImage, isMobileLayout ? null : building);
  }
  ensureMobileStatsBadge(section, building);

  if (!ranked) {
    section.classList.add("pyro-band--unknown");
    if (hoverTarget !== section) ensureValuePill(hoverTarget, ranked);
    wireTooltip(section, hoverTarget, () => buildUnknownTooltip());
    return;
  }

  section.classList.add(`pyro-band--${ranked.band}`);
  if (hoverTarget !== section) ensureValuePill(hoverTarget, ranked);

  const abandonWrapper = section.querySelector<HTMLElement>(
    SEL.ABANDON_BUTTON_WRAPPER,
  );
  if (abandonWrapper) {
    attachRecipeSubmitTrigger(abandonWrapper, ranked.Scenario.scenarioName);
  }

  wireTooltip(section, hoverTarget, () => {
    const statsOnly =
      isPendingCollect(section) && !ranked.Scenario.needsVerification;
    return buildTooltipContentWithStyles(
      ranked,
      effectivePrices(),
      statsOnly,
      showOptionalBadges,
      showResourcePrices,
      showScenarioName,
      stackResources,
    );
  });
}

// ---------------------------------------------------------------------------
// Tooltip wiring
// ---------------------------------------------------------------------------
function isPendingCollect(section: HTMLElement): boolean {
  return (
    section.classList.contains("pending-collect") ||
    !!section.closest(SEL.PENDING_COLLECT)
  );
}

const tooltipState = new WeakMap<
  HTMLElement,
  { getContent: () => HTMLElement }
>();

function wireTooltip(
  section: HTMLElement,
  hoverTarget: HTMLElement,
  getContent: () => HTMLElement,
): void {
  const existing = tooltipState.get(section);
  if (existing) {
    existing.getContent = getContent;
    return;
  }
  const state = { getContent };
  tooltipState.set(section, state);
  const useTapOnlyTooltip = isIosDevice();

  if (!useTapOnlyTooltip) {
    hoverTarget.addEventListener("mouseenter", () => {
      tryTooltip((api) =>
        api.show(hoverTarget, state.getContent(), { position: "top" }),
      );
    });
    hoverTarget.addEventListener("mouseleave", () => {
      tryTooltip((api) => api.hide());
    });
  }

  hoverTarget.addEventListener("click", (e) => {
    if (
      (e.target as HTMLElement).closest(
        'button, a, input, select, textarea, [role="button"]',
      )
    )
      return;
    tryTooltip((api) => {
      if (visibleMobileSection === section) {
        api.hide();
        visibleMobileSection = null;
      } else {
        api.show(hoverTarget, state.getContent(), { position: "top" });
        visibleMobileSection = section;
      }
    });
  });
  document.addEventListener(
    "click",
    (e) => {
      if (
        visibleMobileSection === section &&
        !section.contains(e.target as Node)
      ) {
        tryTooltip((api) => api.hide());
        visibleMobileSection = null;
      }
    },
    { passive: true },
  );
}

function buildTooltipContentWithStyles(
  ranked: RankedScenario | null,
  prices: PriceMap,
  statsOnly = false,
  showOptionalBadges = true,
  showResourcePrices = true,
  showScenarioName = true,
  stackResources = true,
): HTMLElement {
  const node = buildTooltipContent(ranked, prices, statsOnly, {
    showOptionalBadges,
    showResourcePrices,
    showScenarioName,
    stackResources,
  });
  const style = el("style");
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

function scanPage(): void {
  if (!isArsonPage()) return;
  const prices = effectivePrices();

  getRoot()
    .querySelectorAll<HTMLElement>(SEL.CARD)
    .forEach((section) => {
      if (section.dataset.pyroScanned) return;
      section.dataset.pyroScanned = "true";

      const scenarioEl = section.querySelector('[class*="scenario___"]');
      const rawName = scenarioEl?.textContent?.trim() ?? "";
      if (!rawName) return;

      const scenario = scenarioIndex.get(rawName.toLowerCase()) ?? null;
      const ranked = scenario
        ? rankForScenario(scenario, prices, thresholds, payoutBasis)
        : null;

      const buildingName =
        scenarioEl?.previousElementSibling?.textContent?.trim() ?? "";
      const building = BUILDINGS[buildingName] ?? null;

      applyToSection(section, ranked, building);
    });
}

export function resetScans(): void {
  getRoot()
    .querySelectorAll<HTMLElement>(SEL.CARD)
    .forEach((section) => {
      delete section.dataset.pyroScanned;
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
  getActiveTab: () => activeTab,
  getShowOptionalBadges: () => showOptionalBadges,
  getShowResourcePrices: () => showResourcePrices,
  getShowScenarioName: () => showScenarioName,
  getStackResources: () => stackResources,
  getPpnBarPosition: () => ppnBarPosition,
  getPayoutBasis: () => payoutBasis,
  getShowBuildingStats: () => showBuildingStats,
  getShowResponseTime: () => showResponseTime,
  getShowFlammability: () => showFlammability,
  getShowRurality: () => showRurality,
  getShowUrgency: () => showUrgency,
  getShowMaterialData: () => showMaterialData,
  getShowMaterialIntensity: () => showMaterialIntensity,
  getShowMaterialMomentum: () => showMaterialMomentum,
  getShowMaterialSuspicion: () => showMaterialSuspicion,
  getShowMaterialIgnitionRisk: () => showMaterialIgnitionRisk,
  getShowMaterialStokingRisk: () => showMaterialStokingRisk,

  setManualPrice,
  clearManualPrices,
  clearManualPrice,
  setThresholds,
  setApiPrices,
  clearApiPrices,
  setApiKey,
  setActiveTab,
  setShowOptionalBadges: setShowOptionalBadgesEnabled,
  setShowResourcePrices: setShowResourcePricesEnabled,
  setShowScenarioName: setShowScenarioNameEnabled,
  setStackResources: setStackResourcesEnabled,
  setPpnBarPosition,
  setPayoutBasis,
  setShowBuildingStats: setShowBuildingStatsEnabled,
  setShowResponseTime: setShowResponseTimeEnabled,
  setShowFlammability: setShowFlammabilityEnabled,
  setShowRurality: setShowRuralityEnabled,
  setShowUrgency: setShowUrgencyEnabled,
  setShowMaterialData: setShowMaterialDataEnabled,
  setShowMaterialIntensity: setShowMaterialIntensityEnabled,
  setShowMaterialMomentum: setShowMaterialMomentumEnabled,
  setShowMaterialSuspicion: setShowMaterialSuspicionEnabled,
  setShowMaterialIgnitionRisk: setShowMaterialIgnitionRiskEnabled,
  setShowMaterialStokingRisk: setShowMaterialStokingRiskEnabled,
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
    const btn = document.getElementById("pyro-settings-btn");
    if (!btn || !root.contains(btn)) {
      injectSettings(root, settingsCtx);
    }
  }, 200);
}

const materialBadgeTooltipCtx: TooltipCtx = {
  show: (target, content, options) =>
    tryTooltip((api) => api.show(target, content, options)),
  hide: () => tryTooltip((api) => api.hide()),
};

const observer = new MutationObserver(() => {
  scanPage();
  scanMaterialPopover(materialBadgeTooltipCtx, materialBadgeConfig());
  scheduleInjectSettings();
});

function start(): void {
  loadState();
  populateScenarioIndex(SCENARIOS);
  injectHighlightStyles();
  injectMaterialBadgeStyles();
  applyPpnBarPosition();
  observer.observe(document.body, { childList: true, subtree: true });
  scheduleScenarioRefresh();
  if (isArsonPage()) {
    scanPage();
    injectSettings(getRoot(), settingsCtx);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", start, { once: true });
} else {
  start();
}
