import { CATALOG, RESOURCE } from "../../data/catalog.js";
import type { ActionItem, ActionTime } from "../../data/scenarios.js";
import { type RankedScenario, type PriceMap, formatPpn } from "./engine.js";
import { BAND_COLOR } from "./colors.js";
import { el } from "./dom.js";

function row(label: string, value: string, highlight?: boolean): HTMLElement {
  const div = el("div", "pyro-tt-row");
  const l = el("span", "pyro-tt-label");
  l.textContent = label;
  const v = el(
    "span",
    highlight ? "pyro-tt-value pyro-tt-value--highlight" : "pyro-tt-value",
  );
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

function formatPayoutValue(amount: number): string {
  return `$${(amount / 1000).toFixed(0)}k`;
}

function actionSection(
  label: string,
  items: ActionItem[] | undefined,
  prices: PriceMap,
  timing?: ActionTime,
  showOptionalBadges = true,
  showResourcePrices = true,
  stackResources = true,
): HTMLElement | null {
  if (!items || items.length === 0) return null;
  const div = el("div", "pyro-tt-action");
  const labelEl = el("span", "pyro-tt-action-label");
  if (timing) {
    labelEl.innerHTML = `${label} <span class="pyro-tt-timing">${timing}</span>`;
  } else {
    labelEl.textContent = label;
  }
  const valueEl = el("span", "pyro-tt-action-value");

  items.forEach((item, i) => {
    const itemEl = el("span", "pyro-tt-item");
    const name = CATALOG[item.resourceId]?.name ?? item.resourceId;
    const nameEl = el(
      "span",
      item.optional
        ? "pyro-tt-item-name pyro-tt-item-name--optional"
        : "pyro-tt-item-name",
    );
    nameEl.textContent = `${item.qty}× ${name}`;
    itemEl.appendChild(nameEl);
    const cost = showResourcePrices ? itemCost(item, prices) : null;
    if (cost !== null) {
      const costEl = el("span", "pyro-tt-item-cost");
      costEl.textContent = ` (${formatCost(cost)})`;
      itemEl.appendChild(costEl);
    }
    if (item.optional && showOptionalBadges) {
      const badge = el("span", "pyro-tt-optional-badge");
      badge.textContent = "optional";
      itemEl.appendChild(badge);
    }
    if (i > 0 && !stackResources) {
      valueEl.appendChild(document.createTextNode(", "));
    }
    valueEl.appendChild(itemEl);
    if (i < items.length - 1 && stackResources) valueEl.appendChild(el("br"));
  });

  div.appendChild(labelEl);
  div.appendChild(valueEl);
  return div;
}

function buildPrimaryBlock(
  ranked: RankedScenario,
  prices: PriceMap,
  statsOnly = false,
  options?: {
    showOptionalBadges?: boolean;
    showResourcePrices?: boolean;
    showScenarioName?: boolean;
    stackResources?: boolean;
  },
): DocumentFragment {
  const frag = document.createDocumentFragment();
  const { Scenario, profitPerNerve, materialCost, baseNerve } = ranked;

  if (options?.showScenarioName !== false) {
    const nameEl = el("div", "pyro-tt-name");
    nameEl.textContent = Scenario.scenarioName;
    frag.appendChild(nameEl);
  }

  const header = el("div", "pyro-tt-header");
  const title = el("span", "pyro-tt-title");
  title.textContent = "Per nerve";
  header.appendChild(title);
  const ppnEl = el("span", `pyro-tt-ppn pyro-tt-band--${ranked.band}`);
  ppnEl.textContent = formatPpn(profitPerNerve);
  header.appendChild(ppnEl);
  if (Scenario.needsVerification) {
    const badge = el("span", "pyro-tt-unconfirmed");
    badge.textContent = "unconfirmed";
    header.appendChild(badge);
  }
  frag.appendChild(header);

  const stats = el("div", "pyro-tt-stats");
  const payoutLabel =
    Scenario.payoutMax > Scenario.payoutMin
      ? `${formatPayoutValue(Scenario.payoutMin)}–${formatPayoutValue(Scenario.payoutMax)}`
      : formatPayoutValue(Scenario.payoutMin);
  stats.appendChild(row("Payout", payoutLabel));
  stats.appendChild(row("Cost", `~$${(materialCost / 1000).toFixed(1)}k`));
  stats.appendChild(row("Nerve", String(baseNerve)));
  frag.appendChild(stats);

  if (statsOnly) return frag;

  frag.appendChild(el("hr", "pyro-tt-divider"));

  const { evidence, place, stoke, stokeTime, dampen, dampenTime } =
    Scenario.actions;
  const ignite = Scenario.actions.ignite ?? [
    { resourceId: RESOURCE.LIGHTER, qty: 1 },
  ];
  const actionOrder: [string, ActionItem[] | undefined, ActionTime][] = [
    ["Evidence", evidence, undefined],
    ["Place", place, undefined],
    ["Ignite", ignite, undefined],
    ["Stoke", stoke, stokeTime],
    ["Dampen", dampen, dampenTime],
  ];
  const showOptionalBadges = options?.showOptionalBadges !== false;
  const showResourcePrices = options?.showResourcePrices !== false;
  const stackResources = options?.stackResources !== false;
  for (const [label, items, timing] of actionOrder) {
    const s = actionSection(
      label,
      items,
      prices,
      timing,
      showOptionalBadges,
      showResourcePrices,
      stackResources,
    );
    if (s) frag.appendChild(s);
  }

  if (Scenario.notes) {
    const note = el("div", "pyro-tt-notes");
    note.textContent = Scenario.notes;
    frag.appendChild(note);
  }

  return frag;
}

export function buildTooltipContent(
  ranked: RankedScenario | null,
  prices: PriceMap,
  statsOnly = false,
  options?: {
    showOptionalBadges?: boolean;
    showResourcePrices?: boolean;
    showScenarioName?: boolean;
    stackResources?: boolean;
  },
): HTMLElement {
  const root = el("div", "pyro-tt");
  if (!ranked) return root;
  root.appendChild(buildPrimaryBlock(ranked, prices, statsOnly, options));
  return root;
}

export interface StatBar {
  value: number;
  min: number;
  max: number;
  lowLabel: string;
  highLabel: string;
}

function barColor(ratio: number): string {
  if (ratio <= 1 / 3) return BAND_COLOR.good;
  if (ratio <= 2 / 3) return BAND_COLOR.low;
  return BAND_COLOR.negative;
}

function buildStatBar(bar: StatBar): HTMLElement {
  const wrap = el("div", "pyro-stat-bar");
  const segCount = bar.max - bar.min + 1;
  const filled = bar.value - bar.min + 1;
  const ratio = (bar.value - bar.min) / (bar.max - bar.min);
  const color = barColor(ratio);

  const track = el("div", "pyro-stat-bar-track");
  for (let i = 0; i < segCount; i++) {
    const seg = el("span", "pyro-stat-bar-seg");
    if (i < filled) {
      seg.classList.add("pyro-stat-bar-seg--filled");
      seg.style.background = color;
    }
    track.appendChild(seg);
  }
  wrap.appendChild(track);

  const labels = el("div", "pyro-stat-bar-labels");
  const low = el("span", "pyro-stat-bar-label");
  low.textContent = bar.lowLabel;
  const high = el("span", "pyro-stat-bar-label");
  high.textContent = bar.highLabel;
  labels.appendChild(low);
  labels.appendChild(high);
  wrap.appendChild(labels);

  return wrap;
}

export interface StatEntry {
  title: string;
  description: string;
  value?: string;
  bar?: StatBar;
}

function buildStatBlock(entry: StatEntry): HTMLElement {
  const block = el("div", "pyro-stat-block");

  const header = el("div", "pyro-stat-tt-header");
  const titleEl = el("span", "pyro-stat-tt-title");
  titleEl.textContent = entry.title;
  header.appendChild(titleEl);
  if (entry.value !== undefined) {
    const valueEl = el("span", "pyro-stat-tt-value");
    valueEl.textContent = entry.value;
    header.appendChild(valueEl);
  }
  block.appendChild(header);

  const descEl = el("div", "pyro-stat-tt-desc");
  descEl.textContent = entry.description;
  block.appendChild(descEl);

  if (entry.bar) block.appendChild(buildStatBar(entry.bar));

  return block;
}

export function buildStatTooltip(
  title: string,
  description: string,
  bar?: StatBar,
): HTMLElement {
  return buildStatTooltipGroup([{ title, description, bar }]);
}

export function buildStatTooltipGroup(entries: StatEntry[]): HTMLElement {
  const root = el("div", "pyro-stat-tt");
  const style = el("style");
  style.textContent = buildStatTooltipStyles();
  root.appendChild(style);

  entries.forEach((entry, i) => {
    if (i > 0) root.appendChild(el("hr", "pyro-stat-divider"));
    root.appendChild(buildStatBlock(entry));
  });

  return root;
}

function buildStatTooltipStyles(): string {
  return `
.pyro-stat-tt {
    min-width: 140px;
    max-width: 200px;
}
.pyro-stat-tt-header {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 8px;
}
.pyro-stat-tt-title {
    font-size: 13px;
}
.pyro-stat-tt-value {
    font-size: 14px;
    color: oklch(76% 0.14 55);
    white-space: nowrap;
}
.pyro-stat-tt-desc {
    margin-top: 2px;
    font-size: 10px;
    opacity: 0.7;
}
.pyro-stat-bar {
    margin-top: 6px;
}
.pyro-stat-bar-track {
    display: flex;
    gap: 2px;
}
.pyro-stat-bar-seg {
    flex: 1;
    height: 5px;
    border-radius: 2px;
    background: oklch(40% 0 0);
}
.pyro-stat-bar-labels {
    display: flex;
    justify-content: space-between;
    margin-top: 3px;
    font-size: 9px;
    opacity: 0.55;
    text-transform: uppercase;
    letter-spacing: 0.02em;
}
.pyro-stat-divider {
    border: none;
    border-top: 1px solid currentColor;
    opacity: 0.15;
    margin: 6px 0;
}
`;
}

export function buildTooltipStyles(): string {
  return `
.pyro-tt {
    min-width: 180px;
}
.pyro-tt-name {
    font-size: 12px;
    margin-bottom: 2px;
    color: oklch(76% 0 0);
}
.pyro-tt-header {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 6px;
}
.pyro-tt-title {
    font: inherit;
    font-size: 14px;
}
.pyro-tt-ppn {
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
    margin-left: 4px;
    background-color: oklch(0.9 0 0);
    color: oklch(0.23 0 0);
    padding: 0 2px;
    border-radius: 2px;
}
.pyro-tt-action-value {
    font-size: 11px;
}
.pyro-tt-item-cost {
    color: oklch(66% 0 0);
    font-size: 10px;
    font-weight: normal;
}
.pyro-tt-item-name--optional {
    text-decoration: underline wavy oklch(66% 0 0);
    text-underline-offset: 1px;
    text-decoration-thickness: 1px;
}
.pyro-tt-optional-badge {
    font-size: 9px;
    margin-left: 4px;
    background-color: oklch(0.9 0 0);
    color: oklch(0.23 0 0);
    padding: 0 2px;
    border-radius: 2px;
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
`;
}
