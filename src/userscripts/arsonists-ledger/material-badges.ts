import { CATALOG, type ResourceId } from "../../data/catalog.js";
import {
  ACCELERANT_INFO,
  IGNITER_INFO,
  type AccelerantInfo,
  type IgniterInfo,
} from "../../data/arson-information.js";
import { BAND_COLOR } from "./colors.js";
import { el, injectStyleOnce } from "../../lib/shared-ui/dom.js";
import { buildSegmentTrack } from "../shared/segment-bar.js";
import { SEL } from "./selectors.js";
import { buildStatTooltipGroup } from "./tooltip.js";

/** Fixed scale every badged stat is plotted against — see plans/arson/material-badges.md decision #6. */
const SCALE_MAX = 10;
/** Every bar renders as this many discrete segments. */
const SEGMENT_COUNT = 10;

/** Minimal surface of BalaclavaTooltip needed to show/hide a bar's detail popup. */
export interface TooltipCtx {
  readonly show: (
    target: HTMLElement,
    content: HTMLElement,
    options?: { position?: string },
  ) => void;
  readonly hide: () => void;
}

type BarSpec = {
  readonly key: MaterialDataPoint;
  readonly label: string;
  readonly fullLabel: string;
  readonly value: number;
  readonly direction: "good" | "bad";
};

export type MaterialDataPoint =
  | "intensity"
  | "momentum"
  | "suspicion"
  | "ignitionRisk"
  | "stokingRisk";

/** Which data points to badge — the global toggle gates all of them; each can also be toggled individually. */
export interface MaterialBadgeConfig {
  readonly enabled: boolean;
  readonly intensity: boolean;
  readonly momentum: boolean;
  readonly suspicion: boolean;
  readonly ignitionRisk: boolean;
  readonly stokingRisk: boolean;
}

/**
 * What each stat *means*, independent of any one material — shown on hover of
 * the individual data point. See plans/arson/Arson_101_The_Firestarters_Cookbook.md
 * ("The Fire Mechanics", "Firestarting", "Fire Management") for the underlying mechanics.
 */
const STAT_DESCRIPTIONS: Record<string, string> = {
  Intensity:
    "How fiercely the fire burns in the main area. Drives the destruction rate, but pushes dispatch speed and crit-failure risk up when stoking or dampening a hot fire.",
  Momentum:
    "Unburned fuel pooling on the property. Feeds future intensity gain, but stoking while momentum is already high risks a severe accident.",
  Suspicion:
    "How obvious this arson material is. Most accelerants raise it, only Methane actively lowers it. Matters most for Insurance Claim and Accidental Cause jobs.",
  "Ignition Risk":
    "Likelihood of a critical failure when this material is used to start the fire.",
  "Stoking Risk":
    "Likelihood of a critical failure or accident when this material is used to stoke an already-burning fire.",
};

const ACCELERANT_BARS: (info: AccelerantInfo) => BarSpec[] = (info) => [
  {
    key: "intensity",
    label: "INT",
    fullLabel: "Intensity",
    value: info.intensity,
    direction: "good",
  },
  {
    key: "momentum",
    label: "MOM",
    fullLabel: "Momentum",
    value: info.momentum,
    direction: "good",
  },
  {
    key: "suspicion",
    label: "SUS",
    fullLabel: "Suspicion",
    value: info.suspicion,
    direction: "bad",
  },
  {
    key: "ignitionRisk",
    label: "IGN",
    fullLabel: "Ignition Risk",
    value: info.ignitionRisk,
    direction: "bad",
  },
  {
    key: "stokingRisk",
    label: "STK",
    fullLabel: "Stoking Risk",
    value: info.stokingRisk,
    direction: "bad",
  },
];

const IGNITER_BARS: (info: IgniterInfo) => BarSpec[] = (info) => [
  {
    key: "suspicion",
    label: "SUS",
    fullLabel: "Suspicion",
    value: info.suspicion,
    direction: "bad",
  },
];

let tornIdIndex: Map<number, ResourceId> | null = null;

function getTornIdIndex(): Map<number, ResourceId> {
  if (tornIdIndex) return tornIdIndex;
  tornIdIndex = new Map();
  for (const resource of Object.values(CATALOG)) {
    if (resource.tornId !== undefined) {
      tornIdIndex.set(resource.tornId, resource.id as ResourceId);
    }
  }
  return tornIdIndex;
}

function resourceIdFromImage(img: HTMLImageElement): ResourceId | null {
  const match = /\/images\/items\/(\d+)\//.exec(img.src || img.srcset || "");
  if (!match) return null;
  const tornId = Number(match[1]);
  return getTornIdIndex().get(tornId) ?? null;
}

/** Blends a `#rrggbb`/`#rgb` color toward neutral gray, `t=1` being the color at full strength. */
function blendSeverity(hex: string, t: number): string {
  const clamped = Math.min(1, Math.max(0, t));
  const full =
    hex.length === 4
      ? hex
          .slice(1)
          .split("")
          .map((c) => c + c)
          .join("")
      : hex.slice(1);
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  const neutral = 170;
  const mix = (channel: number) =>
    Math.round(neutral + (channel - neutral) * clamped);
  return `rgb(${mix(r)}, ${mix(g)}, ${mix(b)})`;
}

/** The row/wrap currently showing a tap-toggled tooltip, if any — only one can be open at a time. */
let openTooltipTarget: HTMLElement | null = null;
let documentTapCloseBound = false;

/** Mobile has no hover — wires a tap-to-toggle fallback alongside the existing mouseenter/mouseleave. */
function bindTapToggle(
  target: HTMLElement,
  buildContent: () => HTMLElement,
  tooltip: TooltipCtx,
): void {
  if (!documentTapCloseBound) {
    documentTapCloseBound = true;
    document.addEventListener(
      "click",
      (e) => {
        if (
          openTooltipTarget &&
          !openTooltipTarget.contains(e.target as Node)
        ) {
          tooltip.hide();
          openTooltipTarget = null;
        }
      },
      { passive: true },
    );
  }

  target.addEventListener("click", (e) => {
    e.stopPropagation();
    if (openTooltipTarget === target) {
      tooltip.hide();
      openTooltipTarget = null;
      return;
    }
    tooltip.show(target, buildContent(), { position: "top" });
    openTooltipTarget = target;
  });
}

function buildBarRow(bar: BarSpec, tooltip: TooltipCtx): HTMLElement {
  const fraction = Math.min(1, Math.max(0, bar.value) / SCALE_MAX);
  const filledCount = Math.round(fraction * SEGMENT_COUNT);
  const color =
    bar.direction === "good" ? BAND_COLOR.good : BAND_COLOR.negative;

  const row = el("div", "pyro-mat-bar");

  const label = el("span", "pyro-mat-bar-label");
  label.textContent = bar.label;
  row.appendChild(label);

  const track = buildSegmentTrack(
    "pyro-mat-bar-track",
    "pyro-mat-bar-seg",
    SEGMENT_COUNT,
    filledCount,
    color,
  );
  row.appendChild(track);

  const value = el("span", "pyro-mat-bar-value");
  value.textContent = String(bar.value);
  value.style.color = blendSeverity(color, fraction);
  row.appendChild(value);

  const buildContent = () =>
    buildStatTooltipGroup([
      {
        title: bar.fullLabel,
        description: STAT_DESCRIPTIONS[bar.fullLabel] ?? "",
        value: String(bar.value),
      },
    ]);

  row.addEventListener("mouseenter", () => {
    tooltip.show(row, buildContent(), { position: "top" });
  });
  row.addEventListener("mouseleave", () => {
    tooltip.hide();
  });
  bindTapToggle(row, buildContent, tooltip);

  return row;
}

function bindMaterialTooltip(
  wrap: HTMLElement,
  name: string,
  advice: string,
  tooltip: TooltipCtx,
): void {
  wrap.addEventListener("mouseenter", () => {
    const content = buildStatTooltipGroup([
      { title: name, description: advice },
    ]);
    tooltip.show(wrap, content, { position: "top" });
  });
  wrap.addEventListener("mouseleave", () => {
    tooltip.hide();
  });
}

function buildBarStrip(bars: BarSpec[], tooltip: TooltipCtx): HTMLElement {
  const strip = el("div", "pyro-mat-badges");
  for (const bar of bars) {
    strip.appendChild(buildBarRow(bar, tooltip));
  }
  return strip;
}

/** Injects a single sibling badge strip under each unbadged material cell in an open popover. */
export function scanMaterialPopover(
  tooltip: TooltipCtx,
  config: MaterialBadgeConfig,
): void {
  document
    .querySelectorAll<HTMLElement>(SEL.ITEM_SELECTOR)
    .forEach((popover) => {
      popover
        .querySelectorAll<HTMLElement>(SEL.ITEM_CELL_WRAP)
        .forEach((wrap) => {
          if (wrap.dataset.pyroBadged) return;

          const img = wrap.querySelector<HTMLImageElement>(SEL.ITEM_IMAGE);
          if (!img) return;
          const resourceId = resourceIdFromImage(img);
          if (!resourceId) return;

          const accelerant = ACCELERANT_INFO[resourceId];
          const igniter = IGNITER_INFO[resourceId];
          if (!accelerant && !igniter) {
            wrap.dataset.pyroBadged = "true";
            return;
          }

          if (!config.enabled) {
            wrap.dataset.pyroBadged = "true";
            return;
          }

          const info = accelerant ?? (igniter as IgniterInfo);
          const name = CATALOG[resourceId]?.name ?? resourceId;
          bindMaterialTooltip(wrap, name, info.advice, tooltip);

          const bars = (
            accelerant
              ? ACCELERANT_BARS(accelerant)
              : IGNITER_BARS(igniter as IgniterInfo)
          ).filter((bar) => config[bar.key]);
          if (bars.length > 0) {
            wrap.after(buildBarStrip(bars, tooltip));
          }
          wrap.dataset.pyroBadged = "true";
        });
    });
}

/** Clears the badged marker (and any injected strip) on currently-open popovers so the next scan rebuilds them. */
export function resetMaterialBadges(): void {
  document
    .querySelectorAll<HTMLElement>(SEL.ITEM_SELECTOR)
    .forEach((popover) => {
      popover
        .querySelectorAll<HTMLElement>(SEL.ITEM_CELL_WRAP)
        .forEach((wrap) => {
          delete wrap.dataset.pyroBadged;
          const strip = wrap.nextElementSibling;
          if (strip?.classList.contains("pyro-mat-badges")) strip.remove();
        });
    });
}

export function injectMaterialBadgeStyles(): void {
  injectStyleOnce("pyro-mat-badge-styles", `
        .pyro-mat-badges {
            display: flex;
            flex-direction: column;
            gap: 1px;
            padding: 0 10px;
            align-self: stretch;
        }
        .pyro-mat-bar {
            display: grid;
            align-items: center;
            grid-template-columns: 1fr auto;
        }
        .pyro-mat-bar-label {
            font-size: 9px;
            letter-spacing: 0.05em;
            line-height: 1;
            color: var(--crimes-baseText-color, #666);
            font-family: monospace;
        }
        .pyro-mat-bar-track {
            display: flex;
            gap: 1px;
            height: 3px;
            flex: 1;
        }
        .pyro-mat-bar-seg {
            flex: 1;
            height: 100%;
            background: var(--crimes-subtleSubText-color, #999);
            border-radius: 1px;
            aspect-ratio: 1;
        }
        .pyro-mat-bar-value {
            display: none;
            font-size: 9px;
            letter-spacing: 0.05em;
            line-height: 1;
            font-family: monospace;
            font-weight: bold;
            text-align: right;
        }

        @media (max-width: 780px) {
            .pyro-mat-bar-track {
                display: none;
            }
            .pyro-mat-bar-value {
                display: block;
            }
        }
    `);
}
