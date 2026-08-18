import {
  CATALOG,
  CATALOG_UPDATED,
  type ResourceId,
} from "../../data/catalog.js";
import {
  type PriceMap,
  type ProfitThresholds,
  type PayoutBasis,
} from "./engine.js";
import { fetchApiPrices } from "./api.js";
import { SEL } from "./selectors.js";
import { BAND_COLOR } from "./colors.js";
import { el, txt, svgEl, injectStyleOnce } from "../../lib/shared-ui/dom.js";
import { setIconStatus } from "../shared/status.js";
import { checkboxCss } from "../shared/checkbox.js";
import { buildButtonGroup } from "../shared/button-group.js";
import { buildNumberInput } from "../shared/number-input.js";
import { buildToggleRow, toggleRowCss } from "../shared/toggle-row.js";
import { createPopover } from "./popover.js";
import { buildSubmitTab, setPreselectedScenario } from "./submit-tab.js";
import {
  ICON_INFO,
  ICON_CHECK,
  ICON_X,
  ICON_ARROW_RIGHT,
  ICON_FLAME,
  ICON_EXTERNAL_LINK,
  ICON_RESET,
  ICON_REFRESH,
  ICON_TAB_PRICES,
  ICON_TAB_THRESHOLDS,
  ICON_TAB_VISUALS,
  ICON_TAB_API,
  ICON_TAB_SUBMIT,
} from "./icons.js";

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

export type PpnBarPosition = "left" | "right";

export interface SettingsCtx {
  getManualPrices(): PriceMap;
  getApiPrices(): PriceMap;
  getThresholds(): ProfitThresholds;
  getApiKey(): string;
  getApiLastRefresh(): number;
  getActiveTab(): string;
  getShowOptionalBadges(): boolean;
  getShowResourcePrices(): boolean;
  getShowScenarioName(): boolean;
  getStackResources(): boolean;
  getShowMaterialIcons(): boolean;
  getShowMaterialTextColor(): boolean;
  getPpnBarPosition(): PpnBarPosition;
  getPayoutBasis(): PayoutBasis;
  getShowBuildingStats(): boolean;
  getShowResponseTime(): boolean;
  getShowFlammability(): boolean;
  getShowRurality(): boolean;
  getShowUrgency(): boolean;
  getShowMaterialData(): boolean;
  getShowMaterialIntensity(): boolean;
  getShowMaterialMomentum(): boolean;
  getShowMaterialSuspicion(): boolean;
  getShowMaterialIgnitionRisk(): boolean;
  getShowMaterialStokingRisk(): boolean;

  setManualPrice(id: ResourceId, price: number): void;
  clearManualPrices(): void;
  clearManualPrice(id: ResourceId): void;
  setThresholds(t: ProfitThresholds): void;
  setApiPrices(prices: PriceMap, timestamp: number): void;
  clearApiPrices(): void;
  setApiKey(key: string): void;
  setActiveTab(tab: string): void;
  setShowOptionalBadges(show: boolean): void;
  setShowResourcePrices(show: boolean): void;
  setShowScenarioName(show: boolean): void;
  setStackResources(stack: boolean): void;
  setShowMaterialIcons(show: boolean): void;
  setShowMaterialTextColor(show: boolean): void;
  setPpnBarPosition(position: PpnBarPosition): void;
  setPayoutBasis(basis: PayoutBasis): void;
  setShowBuildingStats(show: boolean): void;
  setShowResponseTime(show: boolean): void;
  setShowFlammability(show: boolean): void;
  setShowRurality(show: boolean): void;
  setShowUrgency(show: boolean): void;
  setShowMaterialData(show: boolean): void;
  setShowMaterialIntensity(show: boolean): void;
  setShowMaterialMomentum(show: boolean): void;
  setShowMaterialSuspicion(show: boolean): void;
  setShowMaterialIgnitionRisk(show: boolean): void;
  setShowMaterialStokingRisk(show: boolean): void;
}

// ---------------------------------------------------------------------------
// Status helpers
// ---------------------------------------------------------------------------

function setOkStatus(statusEl: HTMLElement, message: string): void {
  setIconStatus(statusEl, ICON_CHECK, message);
}

function setErrStatus(statusEl: HTMLElement, message: string): void {
  setIconStatus(statusEl, ICON_X, message);
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

export function injectSettingsStyles(): void {
  injectStyleOnce(
    "pyro-settings-styles",
    `
.pyro-settings-wrap {
    margin-left: 8px;
}
#pyro-settings-panel {
    --pyro-api-color: var(--shared-success);
    --pyro-manual-color: #7af;
    --pyro-db-color: var(--shared-text-muted);
}
.pyro-tab-bar { display: flex; border-bottom: 1px solid var(--shared-border); }
.pyro-tab {
    flex: 0 0 auto;
    min-width: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    background: none;
    border: none;
    border-bottom: 1px solid transparent;
    color: var(--shared-text-muted);
    cursor: pointer;
    padding: 8px 12px;
    font: inherit;
    font-size: 14px;
    transition: color 120ms ease-out;
}
.pyro-tab svg { display: none; width: 20px; height: 20px; flex-shrink: 0; }
.pyro-tab-label {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    min-width: 0;
}
@media (max-width: 480px) {
    .pyro-tab { flex: 1; padding: 8px 6px; }
    .pyro-tab svg { display: block; }
    .pyro-tab-label { display: none; }
}
@media (hover: hover) and (pointer: fine) {
    .pyro-tab:hover { color: var(--shared-text); }
}
.pyro-tab.active {
    color: var(--shared-text);
    border-bottom-color: ${BAND_COLOR.excellent};
    background: linear-gradient(0deg, color-mix(in oklch, ${BAND_COLOR.excellent} 20%, transparent 80%), transparent 55%);
}
.pyro-tab-content { padding: 10px; max-height: 380px; overflow-y: auto; scrollbar-gutter: stable; }
.pyro-tab-content>div { display: flex; flex-direction: column; gap: 14px; }
.pyro-tab-content::-webkit-scrollbar { width: 3px; }
.pyro-tab-content::-webkit-scrollbar-track { background: transparent; }
.pyro-tab-content::-webkit-scrollbar-thumb { background: var(--shared-text-muted); border-radius: 2px; }
.pyro-s-group { display: flex; flex-direction: column; gap: 8px; }
.pyro-s-group-title {
    font-size: 14px;
    text-transform: uppercase;
    color: var(--shared-text-muted);
}
.pyro-s-rows { display: flex; flex-direction: column; gap: 4px; }
.pyro-s-row { display: flex; align-items: center; gap: 6px; }
.pyro-s-label {
    flex: 1;
    font-size: 12px;
    color: var(--shared-text-muted);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    min-width: 0;
}
.pyro-s-input {
    width: 76px;
    background: var(--shared-surface);
    border: 1px solid var(--shared-surface-border);
    color: var(--shared-text);
    font-size: 12px;
    padding: 3px 5px;
    border-radius: 5px;
    text-align: right;
    -moz-appearance: textfield;
    transition: border-color 120ms ease-out;
}
.pyro-s-input::-webkit-inner-spin-button,
.pyro-s-input::-webkit-outer-spin-button { -webkit-appearance: none; }
.pyro-s-input:focus-visible { outline: none; border-color: ${BAND_COLOR.excellent}; }
.pyro-s-input.from-api   { border-color: var(--shared-success); color: var(--shared-success); }
.pyro-s-input.overridden { border-color: #48a; color: #7af; }
.pyro-s-divider { border: none; border-top: 1px solid var(--shared-border); margin: 8px 0; }
.pyro-s-key-row { display: flex; gap: 6px; margin-bottom: 6px; }
.pyro-s-key-input {
    flex: 1;
    background: var(--shared-surface);
    border: 1px solid var(--shared-surface-border);
    color: var(--shared-text);
    font-size: 12px;
    padding: 4px 6px;
    border-radius: 5px;
    min-width: 0;
    font-family: monospace;
    transition: border-color 120ms ease-out;
}
.pyro-s-key-input:focus-visible { outline: none; border-color: ${BAND_COLOR.excellent}; }
.pyro-s-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    box-sizing: border-box;
    min-height: 24px;
    background: var(--shared-surface);
    border: 1px solid var(--shared-surface-border);
    color: var(--shared-text-muted);
    cursor: pointer;
    border-radius: 5px;
    padding: 4px 9px;
    font-size: 12px;
    white-space: nowrap;
    transition: transform 100ms ease-out, background 120ms ease-out, color 120ms ease-out;
}
.pyro-s-btn svg { width: 12px; height: 12px; flex-shrink: 0; }
@media (hover: hover) and (pointer: fine) {
    .pyro-s-btn:hover:not(:disabled) { background: var(--shared-surface-hover); color: var(--shared-text); }
}
.pyro-s-btn:active:not(:disabled) { transform: scale(0.97); }
.pyro-s-btn:disabled { opacity: 0.28; cursor: default; }
.pyro-s-btn-danger {
    background: var(--shared-danger-bg);
    border-color: var(--shared-danger-border);
    color: var(--shared-danger);
}
@media (hover: hover) and (pointer: fine) {
    .pyro-s-btn-danger:hover:not(:disabled) { background: var(--shared-danger-bg-hover); color: var(--shared-danger); }
}
.pyro-s-status {
    font-size: 10px;
    min-height: 13px;
    color: var(--shared-text-muted);
    display: flex;
    align-items: center;
    gap: 2px;
    flex-wrap: nowrap;
}
.pyro-s-status.ok  { color: ${BAND_COLOR.good}; }
.pyro-s-status.err { color: var(--shared-danger); }
.pyro-s-status:empty { display: none; }
.pyro-s-refresh-row { display: flex; align-items: center; gap: 8px; }
.pyro-s-timestamp { font-size: 10px; color: var(--shared-text-muted); }
.pyro-s-check-row {
    display: flex;
    align-items: center;
    gap: 7px;
    font-size: 12px;
    color: var(--shared-text-muted);
    cursor: pointer;
    user-select: none;
}
${checkboxCss("pyro-s-checkbox", BAND_COLOR.excellent)}
${toggleRowCss(BAND_COLOR.excellent)}
.pyro-s-toggle-group {
    display: inline-flex;
    align-self: flex-start;
    border: 1px solid var(--shared-surface-border);
    border-radius: 5px;
    overflow: hidden;
}
.pyro-s-toggle-btn {
    background: var(--shared-surface);
    border: none;
    color: var(--shared-text-muted);
    font: inherit;
    font-size: 12px;
    padding: 4px 12px;
    cursor: pointer;
    transition: background 120ms ease-out, color 120ms ease-out;
}
.pyro-s-toggle-btn + .pyro-s-toggle-btn { border-left: 1px solid var(--shared-surface-border); }
@media (hover: hover) and (pointer: fine) {
    .pyro-s-toggle-btn:not(.active):hover { color: var(--shared-text); }
}
.pyro-s-toggle-btn.active {
    background: ${BAND_COLOR.excellent};
    color: oklch(18% 0 0);
}
.pyro-s-section-note { display: flex; align-items: flex-start; gap: 5px; font-size: 10px; line-height: 1.4; color: var(--shared-text-muted); margin-bottom: 6px; }
.pyro-s-section-note > svg { width: 10px; height: 10px; flex-shrink: 0; margin-top: 1px; }
.pyro-s-section-note span strong { color: var(--shared-text); font-weight: normal; }
.pyro-s-section-note a { color: ${BAND_COLOR.excellent}; text-decoration: none; display: inline-flex; align-items: center; gap: 3px; }
.pyro-s-section-note a:hover { text-decoration: underline; }
.pyro-s-section-note a svg { width: 10px; height: 10px; flex-shrink: 0; }
.pyro-s-missing-header { font-size: 10px; color: var(--shared-text-muted); margin: 8px 0 4px; }
.pyro-s-missing-list { font-size: 10px; color: var(--shared-text-muted); padding-left: 14px; margin: 0; }
`,
  );
}

// ---------------------------------------------------------------------------
// Price input helper
// ---------------------------------------------------------------------------

type PriceSource = "manual" | "api" | "db";

function applyPriceStyle(input: HTMLInputElement, source: PriceSource): void {
  input.classList.remove("overridden", "from-api");
  if (source === "manual") input.classList.add("overridden");
  else if (source === "api") input.classList.add("from-api");
}

function priceInput(id: ResourceId, ctx: SettingsCtx): HTMLInputElement {
  const input = el("input", "pyro-s-input");
  input.type = "number";
  input.min = "0";
  let initialValue = "";
  let isDirty = false;

  const refresh = () => {
    const manual = ctx.getManualPrices()[id];
    const api = ctx.getApiPrices()[id];
    const db = CATALOG[id]?.defaultPrice ?? 0;
    if (manual !== undefined) {
      input.value = String(manual);
      applyPriceStyle(input, "manual");
    } else if (api !== undefined) {
      input.value = String(api);
      applyPriceStyle(input, "api");
    } else {
      input.value = "";
      input.placeholder = String(db);
      applyPriceStyle(input, "db");
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
    if (raw === "") {
      ctx.clearManualPrice(id);
    } else {
      const val = Math.round(parseFloat(raw));
      if (!isNaN(val) && val >= 0) ctx.setManualPrice(id, val);
    }
    refresh();
  };
  input.addEventListener("focus", () => {
    initialValue = input.value;
    isDirty = false;
  });
  input.addEventListener("input", () => {
    isDirty = input.value !== initialValue;
  });
  input.addEventListener("blur", commit);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") input.blur();
  });
  return input;
}

// ---------------------------------------------------------------------------
// Prices tab
// ---------------------------------------------------------------------------

const PRICE_GROUPS: Array<{ title: string; ids: ResourceId[] }> = [
  { title: "Liquids", ids: ["gasoline", "diesel", "kerosene"] },
  { title: "Solids", ids: ["magnesium", "thermite", "potassium_nitrate"] },
  { title: "Gases", ids: ["oxygen", "methane", "hydrogen"] },
  {
    title: "Evidence",
    ids: Object.values(CATALOG)
      .filter((r) => r.kind === "evidence")
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((r) => r.id as ResourceId),
  },
];

function buildPricesTab(ctx: SettingsCtx, panel: HTMLElement): HTMLElement {
  const root = el("div");
  const hasManualOverrides = Object.keys(ctx.getManualPrices()).length > 0;
  const hasApiPrices =
    ctx.getApiLastRefresh() > 0 || Object.keys(ctx.getApiPrices()).length > 0;

  const actionGroup = el("div", "pyro-s-group");
  const actionRow = el("div", "pyro-s-refresh-row");

  const resetBtn = el(
    "button",
    "pyro-s-btn pyro-s-btn-danger",
  ) as HTMLButtonElement;
  resetBtn.type = "button";
  resetBtn.innerHTML = `${ICON_RESET}<span>Reset</span>`;
  if (!hasManualOverrides && !hasApiPrices) resetBtn.disabled = true;

  const refreshBtn = el("button", "pyro-s-btn") as HTMLButtonElement;
  refreshBtn.type = "button";
  refreshBtn.innerHTML = `${ICON_REFRESH}<span>Refresh</span>`;
  if (!ctx.getApiKey()) refreshBtn.disabled = true;

  const tsEl = el("span", "pyro-s-timestamp");
  const ts = ctx.getApiLastRefresh();
  tsEl.textContent = ts
    ? `Fetched: ${formatTimestamp(ts)}`
    : `DB: ${CATALOG_UPDATED}`;

  actionRow.appendChild(resetBtn);
  actionRow.appendChild(refreshBtn);
  actionRow.appendChild(tsEl);
  actionGroup.appendChild(actionRow);

  const actionStatus = el("div", "pyro-s-status");
  actionGroup.appendChild(actionStatus);
  root.appendChild(actionGroup);

  refreshBtn.addEventListener("click", async () => {
    refreshBtn.disabled = true;
    actionStatus.textContent = "Refreshing…";
    actionStatus.className = "pyro-s-status";

    const result = await fetchApiPrices(ctx.getApiKey());
    refreshBtn.disabled = !ctx.getApiKey();

    if (result.success && result.prices) {
      ctx.setApiPrices(result.prices, Date.now());
      setOkStatus(actionStatus, `${result.updatedCount} prices updated`);
      actionStatus.className = "pyro-s-status ok";
      rerenderTab(panel, "prices", ctx);
    } else {
      setErrStatus(actionStatus, result.error ?? "Unknown error");
      actionStatus.className = "pyro-s-status err";
    }
  });

  resetBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    ctx.clearManualPrices();
    ctx.clearApiPrices();
    actionStatus.textContent = "Reset to bundled prices";
    actionStatus.className = "pyro-s-status";
    rerenderTab(panel, "prices", ctx);
  });

  for (const group of PRICE_GROUPS) {
    const g = el("div", "pyro-s-group");
    const title = el("div", "pyro-s-group-title");
    title.textContent = group.title;
    g.appendChild(title);

    const rows = el("div", "pyro-s-rows");
    for (const id of group.ids) {
      const resource = CATALOG[id];
      if (!resource) continue;
      const row = el("div", "pyro-s-row");
      const label = el("span", "pyro-s-label");
      label.textContent = resource.name;
      label.title = resource.name;
      row.appendChild(label);
      row.appendChild(priceInput(id, ctx));
      rows.appendChild(row);
    }
    g.appendChild(rows);

    if (group !== PRICE_GROUPS[0]) {
      const divider = el("hr", "pyro-s-divider");
      root.appendChild(divider);
    }

    root.appendChild(g);
  }

  const note = el("p", "pyro-s-section-note");
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
  const row = el("div", "pyro-s-row");
  const lbl = el("span", "pyro-s-label");
  const [before, after] = label.split("→");
  lbl.appendChild(txt(before.trim()));
  lbl.appendChild(svgEl(ICON_ARROW_RIGHT));
  lbl.appendChild(txt((after ?? "").trim()));
  const input = buildNumberInput(getVal, setVal, { className: "pyro-s-input" });
  row.appendChild(lbl);
  row.appendChild(input);
  return row;
}

function buildThresholdsTab(ctx: SettingsCtx): HTMLElement {
  const root = el("div");
  const thresholdsGroup = el("div", "pyro-s-group");

  const bandNote = el("p", "pyro-s-section-note");
  bandNote.innerHTML = `${ICON_INFO}<span>Cards are color-coded by profit/nerve: <span style="color:${BAND_COLOR.negative}">negative</span> (≤ 0), <span style="color:${BAND_COLOR.low}">low</span>, <span style="color:${BAND_COLOR.good}">good</span>, <span style="color:${BAND_COLOR.excellent}">excellent</span>.</span>`;
  thresholdsGroup.appendChild(bandNote);

  const thresholdRows = el("div", "pyro-s-rows");
  thresholdRows.appendChild(
    thresholdInput(
      "Low → Good ($/N)",
      () => ctx.getThresholds().low,
      (val) => {
        const t = ctx.getThresholds();
        ctx.setThresholds({ low: val, good: Math.max(val, t.good) });
      },
    ),
  );
  thresholdRows.appendChild(
    thresholdInput(
      "Good → Excellent ($/N)",
      () => ctx.getThresholds().good,
      (val) => {
        const t = ctx.getThresholds();
        ctx.setThresholds({ low: Math.min(t.low, val), good: val });
      },
    ),
  );
  thresholdsGroup.appendChild(thresholdRows);
  root.appendChild(thresholdsGroup);

  const basisGroup = el("div", "pyro-s-group");
  const basisTitle = el("div", "pyro-s-group-title");
  basisTitle.textContent = "Payout basis";
  basisGroup.appendChild(basisTitle);

  const basisNote = el("p", "pyro-s-section-note");
  basisNote.innerHTML = `${ICON_INFO}<span>Which payout figure drives PPN math (and card banding): the realistic <strong>average</strong> of the observed range, or the optimistic <strong>max</strong>.</span>`;
  basisGroup.appendChild(basisNote);

  basisGroup.appendChild(
    toggleGroupRow(
      "payout-basis",
      "PPN calculation basis",
      [
        { value: "average", label: "Average" },
        { value: "max", label: "Max" },
      ],
      ctx.getPayoutBasis,
      ctx.setPayoutBasis,
    ),
  );
  root.appendChild(basisGroup);

  return root;
}

// ---------------------------------------------------------------------------
// Visuals tab
// ---------------------------------------------------------------------------

function checkboxRow(
  label: string,
  getVal: () => boolean,
  setVal: (v: boolean) => void,
): HTMLElement {
  const toggle = el("label", "pyro-s-check-row");
  const checkbox = el("input", "pyro-s-checkbox") as HTMLInputElement;
  checkbox.type = "checkbox";
  checkbox.checked = getVal();
  checkbox.addEventListener("change", () => {
    setVal(checkbox.checked);
  });
  const lbl = el("span");
  lbl.textContent = label;
  toggle.appendChild(checkbox);
  toggle.appendChild(lbl);
  return toggle;
}

function toggleGroupRow<T extends string>(
  idSlug: string,
  label: string,
  options: { value: T; label: string }[],
  getVal: () => T,
  setVal: (v: T) => void,
): HTMLElement {
  const row = el("div", "pyro-s-row");

  const labelId = `pyro-s-toggle-label-${idSlug}`;

  const { wrap } = buildButtonGroup(
    {
      wrapClassName: "pyro-s-toggle-group",
      btnClassName: "pyro-s-toggle-btn",
      ariaGroup: true,
    },
    options,
    getVal,
    setVal,
  );
  wrap.setAttribute("aria-labelledby", labelId);
  row.appendChild(wrap);

  const lbl = el("span", "pyro-s-label");
  lbl.textContent = label;
  lbl.id = labelId;
  row.appendChild(lbl);

  return row;
}

function buildVisualsTab(ctx: SettingsCtx): HTMLElement {
  const root = el("div");
  const group = el("div", "pyro-s-group");
  const title = el("div", "pyro-s-group-title");
  title.textContent = "Tooltips";
  group.appendChild(title);

  const rows = el("div", "pyro-s-rows");
  rows.appendChild(
    checkboxRow(
      "Show scenario name",
      ctx.getShowScenarioName,
      ctx.setShowScenarioName,
    ),
  );
  rows.appendChild(
    checkboxRow(
      'Show "optional" badges',
      ctx.getShowOptionalBadges,
      ctx.setShowOptionalBadges,
    ),
  );
  rows.appendChild(
    checkboxRow(
      "Stack multiple resources on separate lines",
      ctx.getStackResources,
      ctx.setStackResources,
    ),
  );
  rows.appendChild(
    checkboxRow(
      "Show resource prices",
      ctx.getShowResourcePrices,
      ctx.setShowResourcePrices,
    ),
  );
  group.appendChild(rows);
  root.appendChild(group);

  const barGroup = el("div", "pyro-s-group");
  const barTitle = el("div", "pyro-s-group-title");
  barTitle.textContent = "Scenarios";
  barGroup.appendChild(barTitle);
  barGroup.appendChild(
    toggleGroupRow(
      "ppn-bar-position",
      "PPN bar position",
      [
        { value: "left", label: "Left" },
        { value: "right", label: "Right" },
      ],
      ctx.getPpnBarPosition,
      ctx.setPpnBarPosition,
    ),
  );
  const buildingToggle = buildToggleRow(
    "Show building data",
    ctx.getShowBuildingStats(),
    ctx.setShowBuildingStats,
  );
  barGroup.appendChild(buildingToggle.root);

  buildingToggle.body.appendChild(
    checkboxRow(
      "Show response time",
      ctx.getShowResponseTime,
      ctx.setShowResponseTime,
    ),
  );
  buildingToggle.body.appendChild(
    checkboxRow(
      "Show flammability",
      ctx.getShowFlammability,
      ctx.setShowFlammability,
    ),
  );
  buildingToggle.body.appendChild(
    checkboxRow("Show rurality", ctx.getShowRurality, ctx.setShowRurality),
  );
  buildingToggle.body.appendChild(
    checkboxRow("Show urgency", ctx.getShowUrgency, ctx.setShowUrgency),
  );

  root.appendChild(barGroup);

  const materialsGroup = el("div", "pyro-s-group");
  const materialsTitle = el("div", "pyro-s-group-title");
  materialsTitle.textContent = "Materials";
  materialsGroup.appendChild(materialsTitle);

  const materialToggle = buildToggleRow(
    "Show material data",
    ctx.getShowMaterialData(),
    ctx.setShowMaterialData,
  );
  materialsGroup.appendChild(materialToggle.root);

  materialToggle.body.appendChild(
    checkboxRow(
      "Show intensity",
      ctx.getShowMaterialIntensity,
      ctx.setShowMaterialIntensity,
    ),
  );
  materialToggle.body.appendChild(
    checkboxRow(
      "Show momentum",
      ctx.getShowMaterialMomentum,
      ctx.setShowMaterialMomentum,
    ),
  );
  materialToggle.body.appendChild(
    checkboxRow(
      "Show suspicion",
      ctx.getShowMaterialSuspicion,
      ctx.setShowMaterialSuspicion,
    ),
  );
  materialToggle.body.appendChild(
    checkboxRow(
      "Show ignition risk",
      ctx.getShowMaterialIgnitionRisk,
      ctx.setShowMaterialIgnitionRisk,
    ),
  );
  materialToggle.body.appendChild(
    checkboxRow(
      "Show stoking risk",
      ctx.getShowMaterialStokingRisk,
      ctx.setShowMaterialStokingRisk,
    ),
  );

  materialsGroup.appendChild(
    checkboxRow(
      "Show material icons",
      ctx.getShowMaterialIcons,
      ctx.setShowMaterialIcons,
    ),
  );
  materialsGroup.appendChild(
    checkboxRow(
      "Color material text",
      ctx.getShowMaterialTextColor,
      ctx.setShowMaterialTextColor,
    ),
  );

  root.appendChild(materialsGroup);

  return root;
}

// ---------------------------------------------------------------------------
// API tab
// ---------------------------------------------------------------------------

function buildApiTab(ctx: SettingsCtx): HTMLElement {
  const root = el("div");
  const keyGroup = el("div", "pyro-s-group");

  const keyNote = el("p", "pyro-s-section-note");
  keyNote.innerHTML = `${ICON_INFO}<span><strong>Public access</strong> only, used solely to fetch item market prices. <a href="https://www.torn.com/preferences.php#tab=api?step=addNewKey&title=Arsonist%27s+Ledger&torn=items" target="_blank" rel="noopener noreferrer">Create one ${ICON_EXTERNAL_LINK}</a></span>`;
  keyGroup.appendChild(keyNote);

  const storageNote = el("p", "pyro-s-section-note");
  storageNote.innerHTML = `${ICON_INFO}<span>Stored by your userscript manager only, <strong>never</strong> sent to any server other than Torn's API.</span>`;
  keyGroup.appendChild(storageNote);

  const keyRow = el("div", "pyro-s-key-row");
  const keyInput = el("input", "pyro-s-key-input");
  keyInput.type = "password";
  keyInput.placeholder = "Your Torn API key";
  keyInput.value = ctx.getApiKey();
  keyInput.autocomplete = "off";
  keyInput.spellcheck = false;

  const saveBtn = el("button", "pyro-s-btn");
  saveBtn.type = "button";
  saveBtn.textContent = "Validate & save";
  keyRow.appendChild(keyInput);
  keyRow.appendChild(saveBtn);
  keyGroup.appendChild(keyRow);

  const keyStatus = el("div", "pyro-s-status");
  if (ctx.getApiKey()) {
    setOkStatus(keyStatus, "Key saved");
    keyStatus.className = "pyro-s-status ok";
  }
  keyGroup.appendChild(keyStatus);
  root.appendChild(keyGroup);

  saveBtn.addEventListener("click", async () => {
    const key = keyInput.value.trim();
    if (!key) {
      setErrStatus(keyStatus, "Enter a key first.");
      keyStatus.className = "pyro-s-status err";
      return;
    }

    saveBtn.disabled = true;
    keyStatus.textContent = "Validating…";
    keyStatus.className = "pyro-s-status";

    const result = await fetchApiPrices(key);
    saveBtn.disabled = false;

    if (result.success && result.prices) {
      ctx.setApiKey(key);
      ctx.setApiPrices(result.prices, Date.now());
      setOkStatus(keyStatus, `Valid, ${result.updatedCount} prices updated`);
      keyStatus.className = "pyro-s-status ok";
    } else {
      setErrStatus(keyStatus, result.error ?? "Unknown error");
      keyStatus.className = "pyro-s-status err";
    }
  });

  return root;
}

function formatTimestamp(ts: number): string {
  return new Date(ts).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ---------------------------------------------------------------------------
// Tab switching
// ---------------------------------------------------------------------------

type TabId = "prices" | "thresholds" | "visuals" | "api" | "submit";

function buildTabBar(
  activeId: string,
  onSwitch: (id: TabId) => void,
): HTMLElement {
  const tabs: Array<{ value: TabId; label: string; icon: string }> = [
    { value: "prices", label: "Prices", icon: ICON_TAB_PRICES },
    { value: "thresholds", label: "Thresholds", icon: ICON_TAB_THRESHOLDS },
    { value: "visuals", label: "Visuals", icon: ICON_TAB_VISUALS },
    { value: "api", label: "API", icon: ICON_TAB_API },
    { value: "submit", label: "Submit", icon: ICON_TAB_SUBMIT },
  ];
  let current = activeId as TabId;
  const { wrap } = buildButtonGroup(
    {
      wrapClassName: "pyro-tab-bar",
      btnClassName: "pyro-tab",
      onButtonCreated(btn, option) {
        btn.dataset.tab = option.value;
        const tab = tabs.find((t) => t.value === option.value);
        btn.setAttribute("aria-label", option.label);
        btn.innerHTML = `${tab?.icon ?? ""}<span class="pyro-tab-label">${option.label}</span>`;
      },
    },
    tabs,
    () => current,
    (id) => {
      current = id;
      onSwitch(id);
    },
  );
  return wrap;
}

function rerenderTab(
  panel: HTMLElement,
  tabId: string,
  ctx: SettingsCtx,
): void {
  const content = panel.querySelector<HTMLElement>(".pyro-tab-content");
  if (!content) return;
  content.innerHTML = "";
  content.appendChild(buildTabContent(tabId, ctx, panel));
}

function buildTabContent(
  tabId: string,
  ctx: SettingsCtx,
  panel: HTMLElement,
): HTMLElement {
  switch (tabId) {
    case "prices":
      return buildPricesTab(ctx, panel);
    case "thresholds":
      return buildThresholdsTab(ctx);
    case "visuals":
      return buildVisualsTab(ctx);
    case "api":
      return buildApiTab(ctx);
    case "submit":
      return buildSubmitTab(ctx);
    default:
      return buildPricesTab(ctx, panel);
  }
}

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------

let currentPanel: HTMLElement | null = null;
let currentBtn: HTMLElement | null = null;
let currentCtx: SettingsCtx | null = null;

export function injectSettings(root: Element, ctx: SettingsCtx): void {
  currentCtx = ctx;

  const existing = document.getElementById("pyro-settings-btn");
  if (existing) {
    if (root.contains(existing)) return;
    existing.closest(".pyro-settings-wrap")?.remove();
  }

  injectSettingsStyles();

  const anchor =
    root.querySelector(SEL.RESULT_COUNTS) ??
    root.querySelector(SEL.TITLE_BAR) ??
    root;

  const { wrap, btn, panel } = createPopover({
    buttonAriaLabel: "Arsonist's Ledger settings",
    buttonContent: ICON_FLAME,
    btnId: "pyro-settings-btn",
    panelId: "pyro-settings-panel",
    wrapClass: "pyro-settings-wrap",
  });
  currentPanel = panel;
  currentBtn = btn;

  const activeTabId = ctx.getActiveTab() || "prices";
  panel.appendChild(
    buildTabBar(activeTabId, (tabId) => {
      ctx.setActiveTab(tabId);
      rerenderTab(panel, tabId, ctx);
    }),
  );

  const content = el("div", "pyro-tab-content");
  content.appendChild(buildTabContent(activeTabId, ctx, panel));
  panel.appendChild(content);

  anchor.appendChild(wrap);
}

/**
 * Opens the (singleton) settings popover directly to the Submit tab with the
 * given scenario preselected. Called by the per-card recipe-submit trigger
 * button so a player can tweak an existing recipe without re-entering it.
 */
export function openSettingsToSubmit(scenarioName: string): void {
  if (!currentPanel || !currentBtn || !currentCtx) return;

  setPreselectedScenario(scenarioName);
  currentCtx.setActiveTab("submit");

  currentPanel
    .querySelectorAll(".pyro-tab")
    .forEach((b) => b.classList.remove("active"));
  currentPanel
    .querySelector<HTMLElement>('.pyro-tab[data-tab="submit"]')
    ?.classList.add("active");

  rerenderTab(currentPanel, "submit", currentCtx);
  currentPanel.classList.add("is-open");
  currentBtn.setAttribute("aria-expanded", "true");

  currentBtn.scrollIntoView({ behavior: "smooth", block: "center" });
}
