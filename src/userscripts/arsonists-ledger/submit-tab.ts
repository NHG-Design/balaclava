import { CATALOG, type ResourceId } from "../../data/catalog.js";
import { SCENARIOS, type ScenarioActions } from "../../data/scenarios.js";
import { el, txt, injectStyleOnce } from "../../lib/shared-ui/dom.js";
import { setIconStatus } from "../shared/status.js";
import { checkboxCss, CHECKMARK_DATA_URI } from "../shared/checkbox.js";
import {
  ICON_SEND,
  ICON_PLUS,
  ICON_TRASH,
  ICON_CHECK,
  ICON_X,
  ICON_CHEVRON_DOWN,
  ICON_EXTERNAL_LINK,
  ICON_RESET,
} from "./icons.js";
import { BAND_COLOR } from "./colors.js";
import type { SettingsCtx } from "./settings.js";

declare const GM_xmlhttpRequest:
  | ((options: {
      method: string;
      url: string;
      data?: string;
      headers?: Record<string, string>;
      onload: (r: { status: number; responseText: string }) => void;
      onerror?: () => void;
    }) => void)
  | undefined;

const SUBMIT_URL = "https://balaclava.app/api/arson/recipe-submissions";

/** Matches ScenarioActions' ActionTime: "early" | "late" | `${number}s` | `${number}%`. */
const TIME_PATTERN = /^(early|late|\d+(\.\d+)?(%|s))$/;

/** Warn in the submit status once this many (or fewer) submissions remain in the rate-limit window. */
const RATE_LIMIT_WARN_THRESHOLD = 5;

interface ActionItemDraft {
  resourceId: ResourceId | "";
  qty: number;
  optional?: boolean;
}

interface NormalizedItem {
  resourceId: string;
  qty: number;
  optional?: boolean;
}

interface NormalizedRecipe {
  payoutMin: number | null;
  payoutMax: number | null;
  place: NormalizedItem[];
  ignite: NormalizedItem[];
  stokeEnabled: boolean;
  stoke: NormalizedItem[];
  stokeTime: string;
  dampenEnabled: boolean;
  dampen: NormalizedItem[];
  dampenTime: string;
}

/** Counts field-level differences between the current draft and the known baseline, for the
 *  "N changes ready to submit" status message. */
function countRecipeChanges(
  current: NormalizedRecipe,
  baseline: NormalizedRecipe,
): number {
  let count = 0;
  if (
    current.payoutMin !== baseline.payoutMin ||
    current.payoutMax !== baseline.payoutMax
  )
    count++;
  if (JSON.stringify(current.place) !== JSON.stringify(baseline.place)) count++;
  if (JSON.stringify(current.ignite) !== JSON.stringify(baseline.ignite))
    count++;
  if (
    current.stokeEnabled !== baseline.stokeEnabled ||
    JSON.stringify(current.stoke) !== JSON.stringify(baseline.stoke)
  ) {
    count++;
  }
  if (current.stokeTime !== baseline.stokeTime) count++;
  if (
    current.dampenEnabled !== baseline.dampenEnabled ||
    JSON.stringify(current.dampen) !== JSON.stringify(baseline.dampen)
  ) {
    count++;
  }
  if (current.dampenTime !== baseline.dampenTime) count++;
  return count;
}

const scenarioByName = new Map(SCENARIOS.map((s) => [s.scenarioName, s]));

let preselectedScenario: string | null = null;

/** Called by the per-card trigger button before opening the settings panel on the Submit tab. */
export function setPreselectedScenario(name: string): void {
  preselectedScenario = name;
}

const RESOURCE_OPTIONS: Array<{ label: string; ids: ResourceId[] }> = [
  {
    label: "Liquids",
    ids: Object.values(CATALOG)
      .filter((r) => r.category === "liquid")
      .map((r) => r.id as ResourceId),
  },
  {
    label: "Solids",
    ids: Object.values(CATALOG)
      .filter((r) => r.category === "solid")
      .map((r) => r.id as ResourceId),
  },
  {
    label: "Gases",
    ids: Object.values(CATALOG)
      .filter((r) => r.category === "gaseous")
      .map((r) => r.id as ResourceId),
  },
  {
    label: "Igniters",
    ids: Object.values(CATALOG)
      .filter((r) => r.category === "igniter")
      .map((r) => r.id as ResourceId),
  },
  {
    label: "Dampeners",
    ids: Object.values(CATALOG)
      .filter((r) => r.category === "dampener")
      .map((r) => r.id as ResourceId),
  },
];

/** Place materials exclude igniters/dampeners — those aren't placeable, only used to ignite or dampen. */
const PLACE_RESOURCE_OPTIONS = RESOURCE_OPTIONS.filter(
  (group) => group.label !== "Igniters" && group.label !== "Dampeners",
);

/** Stoke materials exclude dampeners — you stoke with fuel/igniters, not dampening agents. */
const STOKE_RESOURCE_OPTIONS = RESOURCE_OPTIONS.filter(
  (group) => group.label !== "Dampeners",
);

/** Dampen materials are dampeners only. */
const DAMPEN_RESOURCE_OPTIONS = RESOURCE_OPTIONS.filter(
  (group) => group.label === "Dampeners",
);

const IGNITER_IDS = Object.values(CATALOG)
  .filter((r) => r.category === "igniter")
  .map((r) => r.id as ResourceId);

interface SubmitSuccess {
  ok: true;
  remaining?: number;
  limit?: number;
}
interface SubmitFailure {
  ok: false;
  error: string;
}

function postSubmission(
  body: unknown,
  onDone: (result: SubmitSuccess | SubmitFailure) => void,
): void {
  const payload = JSON.stringify(body);

  if (typeof GM_xmlhttpRequest !== "undefined") {
    GM_xmlhttpRequest({
      method: "POST",
      url: SUBMIT_URL,
      data: payload,
      headers: { "Content-Type": "application/json" },
      onload(r) {
        if (r.status >= 200 && r.status < 300) {
          try {
            const parsed = JSON.parse(r.responseText) as {
              remaining?: number;
              limit?: number;
            };
            onDone({
              ok: true,
              remaining: parsed.remaining,
              limit: parsed.limit,
            });
          } catch {
            onDone({ ok: true });
          }
          return;
        }
        try {
          const parsed = JSON.parse(r.responseText) as { error?: string };
          onDone({ ok: false, error: parsed.error ?? `HTTP ${r.status}` });
        } catch {
          onDone({ ok: false, error: `HTTP ${r.status}` });
        }
      },
      onerror() {
        onDone({ ok: false, error: "Network error" });
      },
    });
    return;
  }

  fetch(SUBMIT_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: payload,
  })
    .then(async (r) => {
      if (r.ok) {
        try {
          const parsed = (await r.json()) as {
            remaining?: number;
            limit?: number;
          };
          onDone({
            ok: true,
            remaining: parsed.remaining,
            limit: parsed.limit,
          });
        } catch {
          onDone({ ok: true });
        }
        return;
      }
      try {
        const parsed = (await r.json()) as { error?: string };
        onDone({ ok: false, error: parsed.error ?? `HTTP ${r.status}` });
      } catch {
        onDone({ ok: false, error: `HTTP ${r.status}` });
      }
    })
    .catch(() => onDone({ ok: false, error: "Network error" }));
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

function injectSubmitTabStyles(): void {
  injectStyleOnce("pyro-submit-tab-styles", `
.pyro-rc-groups { display: flex; flex-direction: column; gap: 16px; }
.pyro-rc-group { display: flex; flex-direction: column; gap: 8px; }
.pyro-rc-steps { display: flex; flex-direction: column; gap: 4px; }
.pyro-rc-group-title { font-size: 12px; text-transform: uppercase; color: var(--shared-text-muted); display: flex; align-items: center; justify-content: space-between; }
.pyro-rc-payout-row { display: flex; gap: 6px; align-items: center; }
.pyro-rc-divider { border: none; height: 1px; background: var(--shared-border); margin: 0; }
.pyro-rc-input {
    box-sizing: border-box;
    min-height: 24px;
    background: var(--shared-surface);
    border: 1px solid var(--shared-surface-border);
    color: var(--shared-text);
    font-size: 12px;
    padding: 4px 6px;
    border-radius: 5px;
}
.pyro-rc-input:focus-visible { outline: none; border-color: var(--shared-success); }
.pyro-rc-input.pyro-rc-err { border-color: var(--shared-danger); }
.pyro-rc-payout-row .pyro-rc-input { width: 100%; text-align: right; }
.pyro-rc-input[type=number] { -moz-appearance: textfield; }
.pyro-rc-input[type=number]::-webkit-inner-spin-button,
.pyro-rc-input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
.pyro-rc-row { display: flex; gap: 6px; align-items: center; }
.pyro-rc-row select { flex: 1; min-width: 0; }
.pyro-rc-row .pyro-rc-input[type=number] { width: 48px; text-align: right; }

.pyro-rc-select {
    box-sizing: border-box;
    min-height: 24px;
    appearance: base-select;
    background: var(--shared-surface);
    border: 1px solid var(--shared-surface-border);
    color: var(--shared-text);
    font-size: 12px;
    padding: 4px 6px;
    border-radius: 5px;
    transition: border-color 120ms ease-out;
}
.pyro-rc-select:focus-visible { outline: none; border-color: var(--shared-success); }
.pyro-rc-select::picker-icon { display: none; }
.pyro-rc-select button {
    all: unset;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 6px;
    width: 100%;
    box-sizing: border-box;
    cursor: pointer;
}
.pyro-rc-select-icon { display: flex; color: var(--shared-text-muted); transition: transform 120ms ease-out; flex-shrink: 0; }
.pyro-rc-select:open .pyro-rc-select-icon { transform: rotate(180deg); }
.pyro-rc-select::picker(select) {
    appearance: base-select;
    background: var(--shared-surface);
    border: 1px solid var(--shared-surface-border);
    border-radius: 6px;
    padding: 4px;
    box-shadow: 0 4px 14px oklch(12% 0.01 260 / 0.5);
    scrollbar-width: thin;
    scrollbar-color: var(--shared-text-muted) var(--shared-surface);
}
.pyro-rc-select::picker(select)::-webkit-scrollbar { width: 6px; }
.pyro-rc-select::picker(select)::-webkit-scrollbar-track { background: var(--shared-surface); }
.pyro-rc-select::picker(select)::-webkit-scrollbar-thumb {
    background: var(--shared-text-muted);
    border-radius: 3px;
}
.pyro-rc-select::picker(select)::-webkit-scrollbar-button {
    display: none;
    width: 0;
    height: 0;
    background: var(--shared-surface);
}
.pyro-rc-select::picker(select)::-webkit-scrollbar-corner { background: var(--shared-surface); }
.pyro-rc-select option {
    border-radius: 4px;
    color: var(--shared-text);
    font-size: 12px;
    display: flex;
    align-items: center;
}
@media (hover: hover) and (pointer: fine) {
    .pyro-rc-select option:hover { background: var(--shared-surface-hover); }
}
.pyro-rc-select option:checked {
    background: color-mix(in oklch, var(--shared-success) 22%, var(--shared-surface));
    color: var(--shared-text);
}
.pyro-rc-select option::checkmark {
    content: "";
    display: inline-block;
    width: 16px;
    height: 16px;
    background-color: var(--shared-success);
    -webkit-mask-image: url("${CHECKMARK_DATA_URI}");
    mask-image: url("${CHECKMARK_DATA_URI}");
    -webkit-mask-size: contain;
    mask-size: contain;
    -webkit-mask-repeat: no-repeat;
    mask-repeat: no-repeat;
}
.pyro-rc-select optgroup {
    color: var(--shared-text-muted);
    font-size: 11px;
    text-transform: uppercase;
}
.pyro-rc-combobox { position: relative; width: 100%; }
.pyro-rc-combobox-input { width: 100%; box-sizing: border-box; }
.pyro-rc-combobox-list {
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    right: 0;
    z-index: 20;
    max-height: 180px;
    overflow-y: auto;
    flex-direction: column;
    background: var(--shared-surface);
    border: 1px solid var(--shared-surface-border);
    border-radius: 6px;
    padding: 4px;
    box-shadow: 0 4px 14px oklch(12% 0.01 260 / 0.5);
    scrollbar-width: thin;
    scrollbar-color: var(--shared-text-muted) var(--shared-surface);
}
.pyro-rc-combobox-list::-webkit-scrollbar { width: 6px; }
.pyro-rc-combobox-list::-webkit-scrollbar-track { background: var(--shared-surface); }
.pyro-rc-combobox-list::-webkit-scrollbar-thumb { background: var(--shared-text-muted); border-radius: 3px; }
.pyro-rc-combobox-item {
    all: unset;
    box-sizing: border-box;
    width: 100%;
    min-height: 24px;
    display: flex;
    align-items: center;
    padding: 5px 8px;
    border-radius: 4px;
    font-size: 12px;
    color: var(--shared-text);
    cursor: pointer;
}
.pyro-rc-combobox-item.highlighted,
.pyro-rc-combobox-item:hover {
    background: var(--shared-surface-hover);
}
.pyro-rc-combobox-item.selected {
    background: color-mix(in oklch, var(--shared-success) 22%, var(--shared-surface));
    color: var(--shared-text);
}
.pyro-rc-combobox-empty {
    padding: 6px 8px;
    font-size: 12px;
    color: var(--shared-text-muted);
}

.pyro-rc-icon-btn {
    box-sizing: border-box;
    min-height: 24px;
    min-width: 24px;
    background: var(--shared-danger-bg);
    border: 1px solid var(--shared-danger-border);
    color: var(--shared-danger);
    cursor: pointer;
    border-radius: 5px;
    padding: 4px 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}
@media (hover: hover) and (pointer: fine) {
    .pyro-rc-icon-btn:hover:not(:disabled) { background: var(--shared-danger-bg-hover); color: var(--shared-danger); }
}
.pyro-rc-icon-btn:disabled { opacity: 0.28; cursor: default; }
.pyro-rc-add-btn {
    box-sizing: border-box;
    min-height: 24px;
    background: none;
    border: none;
    color: var(--shared-text-muted);
    font-size: 11px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 3px;
    padding: 0;
}
@media (hover: hover) and (pointer: fine) { .pyro-rc-add-btn:hover { color: var(--shared-text); } }
.pyro-rc-check-row { box-sizing: border-box; min-height: 24px; display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--shared-text-muted); cursor: pointer; user-select: none; }
.pyro-rc-toggle-body { display: flex; flex-direction: column; gap: 8px; padding-left: 4px; border-left: 2px solid var(--shared-surface-border); }
.pyro-rc-time-row { display: flex; align-items: center; gap: 6px; }
.pyro-rc-time-row .pyro-rc-input { flex: 1; }
${checkboxCss("pyro-rc-checkbox", BAND_COLOR.excellent)}
.pyro-rc-actions-row { display: flex; gap: 8px; }
.pyro-rc-submit-btn {
    box-sizing: border-box;
    min-height: 24px;
    flex: 1;
    background: var(--shared-surface);
    border: 1px solid var(--shared-surface-border);
    color: var(--shared-text);
    cursor: pointer;
    border-radius: 5px;
    padding: 6px 10px;
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
}
@media (hover: hover) and (pointer: fine) { .pyro-rc-submit-btn:hover:not(:disabled) { background: var(--shared-surface-hover); } }
.pyro-rc-submit-btn:disabled { opacity: 0.4; cursor: default; }
.pyro-rc-reset-btn {
    box-sizing: border-box;
    min-height: 24px;
    background: var(--shared-danger-bg);
    border: 1px solid var(--shared-danger-border);
    color: var(--shared-danger);
    cursor: pointer;
    border-radius: 5px;
    padding: 6px 10px;
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
}
@media (hover: hover) and (pointer: fine) { .pyro-rc-reset-btn:hover:not(:disabled) { background: var(--shared-danger-bg-hover); color: var(--shared-danger); } }
.pyro-rc-reset-btn:disabled { opacity: 0.35; cursor: default; }
.pyro-rc-reset-btn svg { width: 12px; height: 12px; flex-shrink: 0; }
.pyro-rc-status { font-size: 11px; min-height: 14px; color: var(--shared-text-muted); display: flex; align-items: center; gap: 2px; }
.pyro-rc-status.ok { color: var(--shared-success); }
.pyro-rc-status.err { color: var(--shared-danger); }
.pyro-rc-status.hint { color: var(--shared-text-muted); }
.pyro-rc-status-warn { color: #e9a23b; margin-left: 3px; }
.pyro-rc-external-link { box-sizing: border-box; min-height: 24px; font-size: 12px; color: ${BAND_COLOR.excellent}; text-decoration: none; display: inline-flex; align-items: center; gap: 3px; align-self: flex-start; }
.pyro-rc-external-link:hover { text-decoration: underline; }
.pyro-rc-external-link svg { width: 10px; height: 10px; flex-shrink: 0; }
.pyro-rc-field-err { font-size: 11px; color: var(--shared-danger); min-height: 13px; margin-top: -4px; }
.pyro-rc-field-err:empty { display: none; margin-top: 0; }
.pyro-rc-optional-check { box-sizing: border-box; min-height: 24px; display: flex; align-items: center; gap: 4px; font-size: 11px; color: var(--shared-text-muted); flex-shrink: 0; cursor: pointer; user-select: none; white-space: nowrap; }
`);
}

// ---------------------------------------------------------------------------
// Custom select chrome (Customizable Select API)
// ---------------------------------------------------------------------------

/**
 * Prepends a custom `<button>` face (selected value + our own chevron) as
 * the select's first child, per the Customizable Select spec — this is what
 * replaces the browser's default picker button/icon. No-op visually in
 * browsers that don't support the API; the select still works natively.
 */
function addSelectChrome(select: HTMLSelectElement): void {
  const button = document.createElement("button");
  button.type = "button";
  const selectedContent = document.createElement("selectedcontent");
  button.appendChild(selectedContent);
  const chevron = document.createElement("span");
  chevron.className = "pyro-rc-select-icon";
  chevron.innerHTML = ICON_CHEVRON_DOWN;
  button.appendChild(chevron);
  select.insertBefore(button, select.firstChild);
}

// ---------------------------------------------------------------------------
// Material row widget
// ---------------------------------------------------------------------------

function materialSelect(
  draft: ActionItemDraft,
  onChange: () => void,
  options: Array<{ label: string; ids: ResourceId[] }>,
): HTMLSelectElement {
  const select = el("select", "pyro-rc-select");
  const blank = document.createElement("option");
  blank.value = "";
  blank.textContent = "Select material…";
  select.appendChild(blank);
  for (const group of options) {
    if (group.ids.length === 0) continue;
    const optgroup = document.createElement("optgroup");
    optgroup.label = group.label;
    for (const id of group.ids) {
      const opt = document.createElement("option");
      opt.value = id;
      opt.textContent = CATALOG[id].name;
      optgroup.appendChild(opt);
    }
    select.appendChild(optgroup);
  }
  select.value = draft.resourceId;
  select.addEventListener("change", () => {
    draft.resourceId = select.value as ResourceId | "";
    onChange();
  });
  addSelectChrome(select);
  return select;
}

function materialRow(
  draft: ActionItemDraft,
  onRemove: () => void,
  canRemove: () => boolean,
  onChange: () => void,
  options: Array<{ label: string; ids: ResourceId[] }>,
  allowOptional: boolean,
): HTMLElement {
  const row = el("div", "pyro-rc-row");
  row.appendChild(materialSelect(draft, onChange, options));

  const qty = el("input", "pyro-rc-input") as HTMLInputElement;
  qty.type = "number";
  qty.min = "1";
  qty.value = String(draft.qty);
  qty.addEventListener("input", () => {
    const val = parseInt(qty.value, 10);
    draft.qty = Number.isFinite(val) && val > 0 ? val : 1;
    onChange();
  });
  row.appendChild(qty);

  if (allowOptional) {
    const optionalLbl = el("label", "pyro-rc-optional-check");
    const optionalCheckbox = el(
      "input",
      "pyro-rc-checkbox",
    ) as HTMLInputElement;
    optionalCheckbox.type = "checkbox";
    optionalCheckbox.checked = !!draft.optional;
    optionalCheckbox.addEventListener("change", () => {
      draft.optional = optionalCheckbox.checked;
      onChange();
    });
    optionalLbl.appendChild(optionalCheckbox);
    optionalLbl.appendChild(txt("Optional"));
    row.appendChild(optionalLbl);
  }

  const removeBtn = el("button", "pyro-rc-icon-btn") as HTMLButtonElement;
  removeBtn.type = "button";
  removeBtn.innerHTML = ICON_TRASH;
  removeBtn.setAttribute("aria-label", "Remove material");
  removeBtn.disabled = !canRemove();
  removeBtn.addEventListener("click", onRemove);
  row.appendChild(removeBtn);

  return row;
}

function materialRowsGroup(
  drafts: ActionItemDraft[],
  onChange: () => void,
  options: Array<{ label: string; ids: ResourceId[] }> = RESOURCE_OPTIONS,
  allowOptional = false,
): { root: HTMLElement; setItems: (items: ActionItemDraft[]) => void } {
  const rowsWrap = el("div", "pyro-rc-steps");
  const rowsContainer = el("div", "pyro-rc-steps");

  function render(): void {
    rowsContainer.innerHTML = "";
    drafts.forEach((draft, i) => {
      rowsContainer.appendChild(
        materialRow(
          draft,
          () => {
            drafts.splice(i, 1);
            render();
            onChange();
          },
          () => drafts.length > 1,
          onChange,
          options,
          allowOptional,
        ),
      );
    });
  }
  render();

  const addBtn = el("button", "pyro-rc-add-btn") as HTMLButtonElement;
  addBtn.type = "button";
  addBtn.innerHTML = `${ICON_PLUS}<span>Add step</span>`;
  addBtn.addEventListener("click", () => {
    drafts.push({ resourceId: "", qty: 1 });
    render();
    onChange();
  });

  rowsWrap.appendChild(rowsContainer);
  rowsWrap.appendChild(addBtn);

  function setItems(items: ActionItemDraft[]): void {
    drafts.length = 0;
    drafts.push(...items);
    render();
  }

  return { root: rowsWrap, setItems };
}

function draftsFromItems(
  items:
    | { resourceId: ResourceId; qty: number; optional?: boolean }[]
    | undefined,
): ActionItemDraft[] {
  if (!items || items.length === 0) return [{ resourceId: "", qty: 1 }];
  return items.map((i) => ({
    resourceId: i.resourceId,
    qty: i.qty,
    optional: i.optional,
  }));
}

// ---------------------------------------------------------------------------
// Toggleable stoke/dampen section
// ---------------------------------------------------------------------------

function toggleSection(
  label: string,
  timeLabel: string,
  drafts: ActionItemDraft[],
  timeState: { value: string },
  enabledInitially: boolean,
  onChange: () => void,
  options: Array<{ label: string; ids: ResourceId[] }>,
): {
  root: HTMLElement;
  isEnabled: () => boolean;
  itemsErr: HTMLElement;
  timeErr: HTMLElement;
  reset: (enabled: boolean, items: ActionItemDraft[], time: string) => void;
} {
  const root = el("div", "pyro-rc-group");

  const checkRow = el("label", "pyro-rc-check-row");
  const checkbox = el("input", "pyro-rc-checkbox") as HTMLInputElement;
  checkbox.type = "checkbox";
  checkbox.checked = enabledInitially;
  const lbl = el("span");
  lbl.textContent = label;
  checkRow.appendChild(checkbox);
  checkRow.appendChild(lbl);
  root.appendChild(checkRow);

  const body = el("div", "pyro-rc-toggle-body");
  body.style.display = enabledInitially ? "flex" : "none";
  const rows = materialRowsGroup(drafts, onChange, options, true);
  body.appendChild(rows.root);
  const itemsErr = el("div", "pyro-rc-field-err");
  body.appendChild(itemsErr);

  const timeRow = el("div", "pyro-rc-time-row");
  const timeInputLbl = el("span", "pyro-rc-group-title");
  timeInputLbl.textContent = timeLabel;
  const timeInput = el("input", "pyro-rc-input") as HTMLInputElement;
  timeInput.type = "text";
  timeInput.placeholder = "e.g. early, late, 98%, 30s";
  timeInput.value = timeState.value;
  timeInput.addEventListener("input", () => {
    timeState.value = timeInput.value;
    onChange();
  });
  timeRow.appendChild(timeInputLbl);
  timeRow.appendChild(timeInput);
  body.appendChild(timeRow);

  const timeErr = el("div", "pyro-rc-field-err");
  body.appendChild(timeErr);

  root.appendChild(body);

  checkbox.addEventListener("change", () => {
    body.style.display = checkbox.checked ? "flex" : "none";
    onChange();
  });

  function reset(
    enabled: boolean,
    items: ActionItemDraft[],
    time: string,
  ): void {
    checkbox.checked = enabled;
    body.style.display = enabled ? "flex" : "none";
    rows.setItems(items);
    timeState.value = time;
    timeInput.value = time;
  }

  return { root, isEnabled: () => checkbox.checked, itemsErr, timeErr, reset };
}

// ---------------------------------------------------------------------------
// Form (rebuilt whenever the selected scenario changes)
// ---------------------------------------------------------------------------

function buildForm(scenarioName: string): HTMLElement {
  const form = el("div", "pyro-rc-groups");
  const knownScenario = scenarioByName.get(scenarioName);
  const known: ScenarioActions | undefined = knownScenario?.actions;

  let revalidate: () => void = () => {};
  const onChange = () => revalidate();

  // Payout
  const payoutGroup = el("div", "pyro-rc-group");
  const payoutTitle = el("div", "pyro-rc-group-title");
  payoutTitle.textContent = "Payout range ($)";
  payoutGroup.appendChild(payoutTitle);
  const payoutRow = el("div", "pyro-rc-payout-row");
  const payoutMinInput = el("input", "pyro-rc-input") as HTMLInputElement;
  payoutMinInput.type = "number";
  payoutMinInput.min = "0";
  payoutMinInput.placeholder = "Min";
  if (knownScenario) payoutMinInput.value = String(knownScenario.payoutMin);
  const payoutMaxInput = el("input", "pyro-rc-input") as HTMLInputElement;
  payoutMaxInput.type = "number";
  payoutMaxInput.min = "0";
  payoutMaxInput.placeholder = "Max";
  if (knownScenario) payoutMaxInput.value = String(knownScenario.payoutMax);
  payoutRow.appendChild(payoutMinInput);
  payoutRow.appendChild(payoutMaxInput);
  payoutGroup.appendChild(payoutRow);
  const payoutErr = el("div", "pyro-rc-field-err");
  payoutGroup.appendChild(payoutErr);
  form.appendChild(payoutGroup);
  payoutMinInput.addEventListener("input", onChange);
  payoutMaxInput.addEventListener("input", onChange);

  // Materials + igniter
  const materialsIgniterGroup = el("div", "pyro-rc-group");

  const placeDrafts = draftsFromItems(known?.place);
  const placeGroup = el("div", "pyro-rc-group pyro-rc-place-group");
  const placeTitle = el("div", "pyro-rc-group-title");
  placeTitle.textContent = "Materials to place";
  placeGroup.appendChild(placeTitle);
  const placeRows = materialRowsGroup(
    placeDrafts,
    onChange,
    PLACE_RESOURCE_OPTIONS,
  );
  placeGroup.appendChild(placeRows.root);
  const placeErr = el("div", "pyro-rc-field-err");
  placeGroup.appendChild(placeErr);
  materialsIgniterGroup.appendChild(placeGroup);

  const igniterGroup = el("div", "pyro-rc-group");
  const igniterTitle = el("div", "pyro-rc-group-title");
  igniterTitle.textContent = "Igniter";
  igniterGroup.appendChild(igniterTitle);
  const igniterSelect = el("select", "pyro-rc-select") as HTMLSelectElement;
  const igniterBlank = document.createElement("option");
  igniterBlank.value = "";
  igniterBlank.textContent = "Select igniter…";
  igniterSelect.appendChild(igniterBlank);
  for (const id of IGNITER_IDS) {
    const opt = document.createElement("option");
    opt.value = id;
    opt.textContent = CATALOG[id].name;
    igniterSelect.appendChild(opt);
  }
  const knownIgniter = known?.ignite?.[0]?.resourceId;
  if (knownIgniter) igniterSelect.value = knownIgniter;
  addSelectChrome(igniterSelect);
  igniterGroup.appendChild(igniterSelect);
  const igniterErr = el("div", "pyro-rc-field-err");
  igniterGroup.appendChild(igniterErr);
  materialsIgniterGroup.appendChild(igniterGroup);
  igniterSelect.addEventListener("change", onChange);

  form.appendChild(materialsIgniterGroup);

  // Stoke / dampen
  const stokeDampenGroup = el("div", "pyro-rc-group");
  const stokeDampenTitle = el("div", "pyro-rc-group-title");
  stokeDampenTitle.textContent = "Stoke/Dampen";
  stokeDampenGroup.appendChild(stokeDampenTitle);

  const stokeDrafts = draftsFromItems(known?.stoke);
  const stokeTime = { value: known?.stokeTime ?? "" };
  const stoke = toggleSection(
    "Stoke",
    "Stoke time",
    stokeDrafts,
    stokeTime,
    !!known?.stoke,
    onChange,
    STOKE_RESOURCE_OPTIONS,
  );
  stokeDampenGroup.appendChild(stoke.root);

  const dampenDrafts = draftsFromItems(known?.dampen);
  const dampenTime = { value: known?.dampenTime ?? "" };
  const dampen = toggleSection(
    "Dampen",
    "Dampen time",
    dampenDrafts,
    dampenTime,
    !!known?.dampen,
    onChange,
    DAMPEN_RESOURCE_OPTIONS,
  );
  stokeDampenGroup.appendChild(dampen.root);

  form.appendChild(stokeDampenGroup);

  // Divider
  form.appendChild(el("hr", "pyro-rc-divider"));

  // Submit + reset + feedback
  const actionsGroup = el("div", "pyro-rc-group");
  const actionsRow = el("div", "pyro-rc-actions-row");
  const resetBtn = el("button", "pyro-rc-reset-btn") as HTMLButtonElement;
  resetBtn.type = "button";
  resetBtn.innerHTML = `${ICON_RESET}<span>Reset changes</span>`;
  actionsRow.appendChild(resetBtn);
  const submitBtn = el("button", "pyro-rc-submit-btn") as HTMLButtonElement;
  submitBtn.type = "button";
  submitBtn.innerHTML = `${ICON_SEND}<span>Submit</span>`;
  actionsRow.appendChild(submitBtn);
  actionsGroup.appendChild(actionsRow);

  const status = el("div", "pyro-rc-status");
  actionsGroup.appendChild(status);
  form.appendChild(actionsGroup);

  function clearFieldErrors(): void {
    payoutErr.textContent = "";
    placeErr.textContent = "";
    igniterErr.textContent = "";
    stoke.itemsErr.textContent = "";
    stoke.timeErr.textContent = "";
    dampen.itemsErr.textContent = "";
    dampen.timeErr.textContent = "";
    payoutMinInput.classList.remove("pyro-rc-err");
    payoutMaxInput.classList.remove("pyro-rc-err");
  }

  function validItems(drafts: ActionItemDraft[]): NormalizedItem[] | null {
    const items = drafts.filter((d) => d.resourceId !== "");
    if (items.length === 0) return null;
    return items.map((d) => ({
      resourceId: d.resourceId as ResourceId,
      qty: d.qty,
      ...(d.optional ? { optional: true } : {}),
    }));
  }

  const baseline: NormalizedRecipe = {
    payoutMin: knownScenario?.payoutMin ?? null,
    payoutMax: knownScenario?.payoutMax ?? null,
    place: (known?.place ?? []).map((i) => ({
      resourceId: i.resourceId,
      qty: i.qty,
    })),
    ignite: (known?.ignite ?? []).map((i) => ({
      resourceId: i.resourceId,
      qty: i.qty,
    })),
    stokeEnabled: !!known?.stoke,
    stoke: (known?.stoke ?? []).map((i) => ({
      resourceId: i.resourceId,
      qty: i.qty,
      ...(i.optional ? { optional: true } : {}),
    })),
    stokeTime: known?.stokeTime ?? "",
    dampenEnabled: !!known?.dampen,
    dampen: (known?.dampen ?? []).map((i) => ({
      resourceId: i.resourceId,
      qty: i.qty,
      ...(i.optional ? { optional: true } : {}),
    })),
    dampenTime: known?.dampenTime ?? "",
  };

  revalidate = () => {
    clearFieldErrors();

    const payoutMin = parseFloat(payoutMinInput.value);
    const payoutMax = parseFloat(payoutMaxInput.value);
    let isValid = true;

    if (
      payoutMinInput.value.trim() === "" ||
      payoutMaxInput.value.trim() === "" ||
      !Number.isFinite(payoutMin) ||
      !Number.isFinite(payoutMax) ||
      payoutMin < 0 ||
      payoutMax < 0
    ) {
      payoutErr.textContent = "Enter a valid payout range.";
      payoutMinInput.classList.add("pyro-rc-err");
      payoutMaxInput.classList.add("pyro-rc-err");
      isValid = false;
    } else if (payoutMax < payoutMin) {
      payoutErr.textContent = "Max must be ≥ min.";
      payoutMaxInput.classList.add("pyro-rc-err");
      isValid = false;
    }

    const place = validItems(placeDrafts);
    if (!place) {
      placeErr.textContent = "Add at least one material.";
      isValid = false;
    }

    if (!igniterSelect.value) {
      igniterErr.textContent = "Select an igniter.";
      isValid = false;
    }

    let stokeItems: NormalizedItem[] | null = null;
    if (stoke.isEnabled()) {
      stokeItems = validItems(stokeDrafts);
      if (!stokeItems) {
        stoke.itemsErr.textContent =
          "Add at least one material, or disable Stoke.";
        isValid = false;
      }
      if (
        stokeTime.value.trim() &&
        !TIME_PATTERN.test(stokeTime.value.trim())
      ) {
        stoke.timeErr.textContent = "Use early, late, <number>%, or <number>s.";
        isValid = false;
      }
    }

    let dampenItems: NormalizedItem[] | null = null;
    if (dampen.isEnabled()) {
      dampenItems = validItems(dampenDrafts);
      if (!dampenItems) {
        dampen.itemsErr.textContent =
          "Add at least one material, or disable Dampen.";
        isValid = false;
      }
      if (
        dampenTime.value.trim() &&
        !TIME_PATTERN.test(dampenTime.value.trim())
      ) {
        dampen.timeErr.textContent =
          "Use early, late, <number>%, or <number>s.";
        isValid = false;
      }
    }

    const current: NormalizedRecipe = {
      payoutMin: Number.isFinite(payoutMin) ? payoutMin : null,
      payoutMax: Number.isFinite(payoutMax) ? payoutMax : null,
      place: place ?? [],
      ignite: igniterSelect.value
        ? [{ resourceId: igniterSelect.value, qty: 1 }]
        : [],
      stokeEnabled: stoke.isEnabled(),
      stoke: stoke.isEnabled() ? (stokeItems ?? []) : [],
      stokeTime: stoke.isEnabled() ? stokeTime.value.trim() : "",
      dampenEnabled: dampen.isEnabled(),
      dampen: dampen.isEnabled() ? (dampenItems ?? []) : [],
      dampenTime: dampen.isEnabled() ? dampenTime.value.trim() : "",
    };
    const changeCount = countRecipeChanges(current, baseline);
    const changed = changeCount > 0;

    submitBtn.disabled = !isValid || !changed;
    resetBtn.disabled = !changed;
    if (isValid && !changed) {
      status.textContent = "No changes to submit yet.";
      status.className = "pyro-rc-status hint";
    } else if (isValid && changed) {
      status.textContent = `${changeCount} change${changeCount === 1 ? "" : "s"} ready to submit.`;
      status.className = "pyro-rc-status hint";
    } else if (status.className === "pyro-rc-status hint") {
      status.textContent = "";
      status.className = "pyro-rc-status";
    }
  };
  revalidate();

  resetBtn.addEventListener("click", () => {
    payoutMinInput.value = knownScenario ? String(knownScenario.payoutMin) : "";
    payoutMaxInput.value = knownScenario ? String(knownScenario.payoutMax) : "";
    placeRows.setItems(draftsFromItems(known?.place));
    igniterSelect.value = knownIgniter ?? "";
    stoke.reset(
      !!known?.stoke,
      draftsFromItems(known?.stoke),
      known?.stokeTime ?? "",
    );
    dampen.reset(
      !!known?.dampen,
      draftsFromItems(known?.dampen),
      known?.dampenTime ?? "",
    );
    revalidate();
  });

  submitBtn.addEventListener("click", () => {
    revalidate();
    if (submitBtn.disabled) return;

    const payoutMin = parseFloat(payoutMinInput.value);
    const payoutMax = parseFloat(payoutMaxInput.value);
    const place = validItems(placeDrafts);

    submitBtn.disabled = true;
    status.textContent = "Submitting…";
    status.className = "pyro-rc-status";

    const recipe: Record<string, unknown> = {
      place,
      ignite: [{ resourceId: igniterSelect.value, qty: 1 }],
    };
    if (stoke.isEnabled()) {
      const items = validItems(stokeDrafts);
      if (items) recipe.stoke = items;
      if (stokeTime.value.trim()) recipe.stokeTime = stokeTime.value.trim();
    }
    if (dampen.isEnabled()) {
      const items = validItems(dampenDrafts);
      if (items) recipe.dampen = items;
      if (dampenTime.value.trim()) recipe.dampenTime = dampenTime.value.trim();
    }

    const playerInfo = getPlayerInfoSafe();
    postSubmission(
      {
        scenarioName,
        payoutMin,
        payoutMax,
        submitterId: playerInfo.id,
        submitterName: playerInfo.name,
        recipe,
      },
      (result) => {
        if (result.ok) {
          setIconStatus(status, ICON_CHECK, "Submitted!");
          status.className = "pyro-rc-status ok";
          if (
            result.remaining !== undefined &&
            result.remaining <= RATE_LIMIT_WARN_THRESHOLD
          ) {
            const warn = el("span", "pyro-rc-status-warn");
            warn.textContent =
              result.remaining === 0
                ? " — that was your last submission this hour."
                : ` — ${result.remaining} submission${result.remaining === 1 ? "" : "s"} left this hour.`;
            status.appendChild(warn);
          }
        } else {
          setIconStatus(status, ICON_X, result.error);
          status.className = "pyro-rc-status err";
          revalidate();
        }
      },
    );
  });

  return form;
}

/**
 * Best-effort extraction of the logged-in player's Torn ID + display name.
 * Tries the desktop-only user-information block first (`.user-information___* a.menu-value___*`,
 * has both id + name), then falls back to the top header's profile link
 * (`#topHeaderBanner a[href*="profiles.php?XID="]`, present on both desktop and mobile —
 * confirmed live via plans/arson/references/torn-header-markup.html) which yields the id but
 * has no name text. Returns nulls (not thrown) if neither pattern is found — submission still
 * succeeds without them.
 */
function getPlayerInfoSafe(): { id: string | null; name: string | null } {
  try {
    const desktopLink = document.querySelector<HTMLAnchorElement>(
      '[class*="user-information"] a[href*="profiles.php?XID="]',
    );
    if (desktopLink) {
      const match = /XID=(\d+)/.exec(desktopLink.href);
      const name = desktopLink.textContent?.trim() || null;
      if (match) return { id: match[1], name };
    }

    const headerLink = document.querySelector<HTMLAnchorElement>(
      '#topHeaderBanner a[href*="profiles.php?XID="]',
    );
    if (headerLink) {
      const match = /XID=(\d+)/.exec(headerLink.href);
      if (match) return { id: match[1], name: null };
    }

    return { id: null, name: null };
  } catch {
    return { id: null, name: null };
  }
}

// ---------------------------------------------------------------------------
// Tab entry point
// ---------------------------------------------------------------------------

export function buildSubmitTab(_ctx: SettingsCtx): HTMLElement {
  injectSubmitTabStyles();

  const root = el("div", "pyro-rc-groups");

  const submissionsLink = el("a", "pyro-rc-external-link") as HTMLAnchorElement;
  submissionsLink.href = "https://balaclava.app/arson/submissions";
  submissionsLink.target = "_blank";
  submissionsLink.rel = "noopener noreferrer";
  submissionsLink.innerHTML = `View submitted recipes ${ICON_EXTERNAL_LINK}`;
  root.appendChild(submissionsLink);

  const allNames = Array.from(scenarioByName.keys()).sort((a, b) =>
    a.localeCompare(b),
  );
  const initialSelection =
    preselectedScenario && scenarioByName.has(preselectedScenario)
      ? preselectedScenario
      : (allNames[0] ?? "");
  preselectedScenario = null;

  const scenarioGroup = el("div", "pyro-rc-group");
  const scenarioTitle = el("div", "pyro-rc-group-title");
  scenarioTitle.textContent = "Scenario";
  scenarioGroup.appendChild(scenarioTitle);

  const formSlot = el("div");
  if (initialSelection) formSlot.appendChild(buildForm(initialSelection));

  const combobox = buildScenarioCombobox(allNames, initialSelection, (name) => {
    formSlot.innerHTML = "";
    formSlot.appendChild(buildForm(name));
  });
  scenarioGroup.appendChild(combobox);
  root.appendChild(scenarioGroup);
  root.appendChild(formSlot);

  return root;
}

// ---------------------------------------------------------------------------
// Scenario combobox (searchable — the full scenario list, not just what's
// currently visible on the page)
// ---------------------------------------------------------------------------

function buildScenarioCombobox(
  allNames: string[],
  initialSelection: string,
  onSelect: (name: string) => void,
): HTMLElement {
  const wrap = el("div", "pyro-rc-combobox");

  const input = el(
    "input",
    "pyro-rc-input pyro-rc-combobox-input",
  ) as HTMLInputElement;
  input.type = "text";
  input.placeholder = "Search scenarios…";
  input.autocomplete = "off";
  input.spellcheck = false;
  input.value = initialSelection;
  input.setAttribute("role", "combobox");
  input.setAttribute("aria-expanded", "false");
  input.setAttribute("aria-autocomplete", "list");

  const list = el("div", "pyro-rc-combobox-list");
  list.setAttribute("role", "listbox");
  list.style.display = "none";

  let selected = initialSelection;
  let filtered: string[] = allNames;
  let highlighted = -1;

  function filterNames(query: string): string[] {
    const q = query.trim().toLowerCase();
    if (!q) return allNames;
    return allNames.filter((n) => n.toLowerCase().includes(q));
  }

  function renderList(): void {
    list.innerHTML = "";
    if (filtered.length === 0) {
      const empty = el("div", "pyro-rc-combobox-empty");
      empty.textContent = "No matching scenarios";
      list.appendChild(empty);
      return;
    }
    filtered.forEach((name, i) => {
      const item = el("button", "pyro-rc-combobox-item") as HTMLButtonElement;
      item.type = "button";
      item.textContent = name;
      item.setAttribute("role", "option");
      if (name === selected) item.classList.add("selected");
      if (i === highlighted) item.classList.add("highlighted");
      item.addEventListener("mousedown", (e) => {
        e.preventDefault(); // fire before input blur
        choose(name);
      });
      list.appendChild(item);
    });
  }

  function openList(): void {
    list.style.display = "flex";
    input.setAttribute("aria-expanded", "true");
  }
  function closeList(): void {
    list.style.display = "none";
    input.setAttribute("aria-expanded", "false");
    highlighted = -1;
  }
  function choose(name: string): void {
    selected = name;
    input.value = name;
    closeList();
    onSelect(name);
  }

  input.addEventListener("focus", () => {
    filtered = filterNames(input.value === selected ? "" : input.value);
    highlighted = -1;
    renderList();
    openList();
  });
  input.addEventListener("input", () => {
    filtered = filterNames(input.value);
    highlighted = -1;
    renderList();
    openList();
  });
  input.addEventListener("blur", () => {
    setTimeout(() => {
      input.value = selected;
      closeList();
    }, 120);
  });
  input.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      input.value = selected;
      closeList();
      input.blur();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (list.style.display === "none") {
        filtered = filterNames("");
        openList();
      }
      highlighted = Math.min(highlighted + 1, filtered.length - 1);
      renderList();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      highlighted = Math.max(highlighted - 1, 0);
      renderList();
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlighted >= 0 && filtered[highlighted])
        choose(filtered[highlighted]);
    }
  });

  wrap.appendChild(input);
  wrap.appendChild(list);
  return wrap;
}
