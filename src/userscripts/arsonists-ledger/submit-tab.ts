import { CATALOG, type ResourceId } from "../../data/catalog.js";
import { SCENARIOS, type ScenarioActions } from "../../data/scenarios.js";
import { el, txt } from "./dom.js";
import {
  ICON_SEND,
  ICON_PLUS,
  ICON_TRASH,
  ICON_CHECK,
  ICON_X,
  ICON_CHEVRON_DOWN,
  ICON_CHECK_MASK_PATH,
  ICON_EXTERNAL_LINK,
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

const CHECKMARK_DATA_URI = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="${ICON_CHECK_MASK_PATH}"/></svg>`,
)}`;

interface ActionItemDraft {
  resourceId: ResourceId | "";
  qty: number;
}

interface NormalizedItem {
  resourceId: string;
  qty: number;
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
const STOKE_RESOURCE_OPTIONS = RESOURCE_OPTIONS.filter((group) => group.label !== "Dampeners");

/** Dampen materials are dampeners only. */
const DAMPEN_RESOURCE_OPTIONS = RESOURCE_OPTIONS.filter((group) => group.label === "Dampeners");

const IGNITER_IDS = Object.values(CATALOG)
  .filter((r) => r.category === "igniter")
  .map((r) => r.id as ResourceId);

function postSubmission(
  body: unknown,
  onDone: (result: { ok: true } | { ok: false; error: string }) => void,
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
          onDone({ ok: true });
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
        onDone({ ok: true });
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
  if (document.getElementById("pyro-submit-tab-styles")) return;
  const style = el("style");
  style.id = "pyro-submit-tab-styles";
  style.textContent = `
.pyro-rc-group { display: flex; flex-direction: column; gap: 6px; }
.pyro-rc-place-group > .pyro-rc-group-title { margin-bottom: 4px; }
.pyro-rc-group-title { font-size: 11px; text-transform: uppercase; color: oklch(58% 0.012 285); display: flex; align-items: center; justify-content: space-between; }
.pyro-rc-payout-row { display: flex; gap: 6px; align-items: center; }
.pyro-rc-input {
    background: oklch(14.5% 0.011 285);
    border: 1px solid oklch(27% 0.017 285);
    color: oklch(82% 0.007 285);
    font-size: 11px;
    padding: 4px 6px;
    border-radius: 5px;
}
.pyro-rc-input:focus-visible { outline: none; border-color: #6d6; }
.pyro-rc-input.pyro-rc-err { border-color: #c66; }
.pyro-rc-payout-row .pyro-rc-input { width: 100%; text-align: right; }
.pyro-rc-input[type=number] { -moz-appearance: textfield; }
.pyro-rc-input[type=number]::-webkit-inner-spin-button,
.pyro-rc-input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
.pyro-rc-row { display: flex; gap: 4px; align-items: center; }
.pyro-rc-row select { flex: 1; min-width: 0; }
.pyro-rc-row .pyro-rc-input[type=number] { width: 48px; text-align: right; }

.pyro-rc-select {
    appearance: base-select;
    background: oklch(14.5% 0.011 285);
    border: 1px solid oklch(27% 0.017 285);
    color: oklch(82% 0.007 285);
    font-size: 12px;
    padding: 4px 6px;
    border-radius: 5px;
    transition: border-color 120ms ease-out;
}
.pyro-rc-select:focus-visible { outline: none; border-color: #6d6; }
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
.pyro-rc-select-icon { display: flex; color: oklch(55% 0.012 285); transition: transform 120ms ease-out; flex-shrink: 0; }
.pyro-rc-select:open .pyro-rc-select-icon { transform: rotate(180deg); }
.pyro-rc-select::picker(select) {
    appearance: base-select;
    background: oklch(20% 0.008 285);
    border: 1px solid oklch(30% 0 0);
    border-radius: 6px;
    padding: 4px;
    box-shadow: 0 4px 14px oklch(12% 0.01 260 / 0.5);
    scrollbar-width: thin;
    scrollbar-color: oklch(40% 0.01 285) oklch(20% 0.008 285);
}
.pyro-rc-select::picker(select)::-webkit-scrollbar { width: 6px; }
.pyro-rc-select::picker(select)::-webkit-scrollbar-track { background: oklch(20% 0.008 285); }
.pyro-rc-select::picker(select)::-webkit-scrollbar-thumb {
    background: oklch(40% 0.01 285);
    border-radius: 3px;
}
.pyro-rc-select::picker(select)::-webkit-scrollbar-button {
    display: none;
    width: 0;
    height: 0;
    background: oklch(20% 0.008 285);
}
.pyro-rc-select::picker(select)::-webkit-scrollbar-corner { background: oklch(20% 0.008 285); }
.pyro-rc-select option {
    border-radius: 4px;
    color: oklch(82% 0.007 285);
    font-size: 12px;
    display: flex;
    align-items: center;
}
@media (hover: hover) and (pointer: fine) {
    .pyro-rc-select option:hover { background: oklch(28% 0.012 285); }
}
.pyro-rc-select option:checked {
    background: color-mix(in oklch, #6d6 22%, oklch(20% 0.008 285));
    color: oklch(96% 0.012 95);
}
.pyro-rc-select option::checkmark {
    content: "";
    display: inline-block;
    width: 16px;
    height: 16px;
    background-color: #6d6;
    -webkit-mask-image: url("${CHECKMARK_DATA_URI}");
    mask-image: url("${CHECKMARK_DATA_URI}");
    -webkit-mask-size: contain;
    mask-size: contain;
    -webkit-mask-repeat: no-repeat;
    mask-repeat: no-repeat;
}
.pyro-rc-select optgroup {
    color: oklch(50% 0.01 285);
    font-size: 10px;
    text-transform: uppercase;
}
.pyro-rc-scenario-select { width: 100%; }

.pyro-rc-icon-btn {
    background: oklch(15% 0.012 285);
    border: 1px solid oklch(28% 0.018 285);
    color: oklch(60% 0.009 285);
    cursor: pointer;
    border-radius: 5px;
    padding: 4px 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}
@media (hover: hover) and (pointer: fine) {
    .pyro-rc-icon-btn:hover:not(:disabled) { background: oklch(21% 0.016 285); color: oklch(85% 0.006 285); }
}
.pyro-rc-icon-btn:disabled { opacity: 0.28; cursor: default; }
.pyro-rc-add-btn {
    background: none;
    border: none;
    color: oklch(58% 0.012 285);
    font-size: 10px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 3px;
    padding: 0;
}
@media (hover: hover) and (pointer: fine) { .pyro-rc-add-btn:hover { color: oklch(85% 0.006 285); } }
.pyro-rc-check-row { display: flex; align-items: center; gap: 6px; font-size: 12px; color: oklch(62% 0.009 285); cursor: pointer; user-select: none; }
.pyro-rc-toggle-body { display: flex; flex-direction: column; gap: 6px; padding-left: 4px; border-left: 2px solid oklch(27% 0.017 285); }
.pyro-rc-time-row { display: flex; align-items: center; gap: 6px; }
.pyro-rc-time-row .pyro-rc-input { flex: 1; }
.pyro-rc-submit-btn {
    background: oklch(15% 0.012 285);
    border: 1px solid oklch(28% 0.018 285);
    color: oklch(85% 0.006 285);
    cursor: pointer;
    border-radius: 5px;
    padding: 6px 10px;
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
}
@media (hover: hover) and (pointer: fine) { .pyro-rc-submit-btn:hover:not(:disabled) { background: oklch(21% 0.016 285); } }
.pyro-rc-submit-btn:disabled { opacity: 0.4; cursor: default; }
.pyro-rc-status { font-size: 10px; min-height: 13px; color: oklch(38% 0.008 285); display: flex; align-items: center; gap: 2px; }
.pyro-rc-status.ok { color: #6d6; }
.pyro-rc-status.err { color: #c66; }
.pyro-rc-status.hint { color: oklch(45% 0.008 285); }
.pyro-rc-external-link { font-size: 11px; color: ${BAND_COLOR.excellent}; text-decoration: none; display: inline-flex; align-items: center; gap: 3px; align-self: flex-start; }
.pyro-rc-external-link:hover { text-decoration: underline; }
.pyro-rc-external-link svg { width: 10px; height: 10px; flex-shrink: 0; }
.pyro-rc-field-err { font-size: 10px; color: #c66; min-height: 12px; }
`;
  document.head.appendChild(style);
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
): HTMLElement {
  const rowsWrap = el("div", "pyro-rc-group");
  const rowsContainer = el("div", "pyro-rc-group");

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
  return rowsWrap;
}

function draftsFromItems(
  items: { resourceId: ResourceId; qty: number }[] | undefined,
): ActionItemDraft[] {
  if (!items || items.length === 0) return [{ resourceId: "", qty: 1 }];
  return items.map((i) => ({ resourceId: i.resourceId, qty: i.qty }));
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
} {
  const root = el("div", "pyro-rc-group");

  const checkRow = el("label", "pyro-rc-check-row");
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = enabledInitially;
  const lbl = el("span");
  lbl.textContent = label;
  checkRow.appendChild(checkbox);
  checkRow.appendChild(lbl);
  root.appendChild(checkRow);

  const body = el("div", "pyro-rc-toggle-body");
  body.style.display = enabledInitially ? "flex" : "none";
  body.appendChild(materialRowsGroup(drafts, onChange, options));
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

  return { root, isEnabled: () => checkbox.checked, itemsErr, timeErr };
}

// ---------------------------------------------------------------------------
// Form (rebuilt whenever the selected scenario changes)
// ---------------------------------------------------------------------------

function buildForm(scenarioName: string): HTMLElement {
  const form = el("div", "pyro-rc-group");
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

  // Place materials
  const placeDrafts = draftsFromItems(known?.place);
  const placeGroup = el("div", "pyro-rc-group pyro-rc-place-group");
  const placeTitle = el("div", "pyro-rc-group-title");
  placeTitle.textContent = "Materials to place";
  placeGroup.appendChild(placeTitle);
  placeGroup.appendChild(
    materialRowsGroup(placeDrafts, onChange, PLACE_RESOURCE_OPTIONS),
  );
  const placeErr = el("div", "pyro-rc-field-err");
  placeGroup.appendChild(placeErr);
  form.appendChild(placeGroup);

  // Igniter
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
  form.appendChild(igniterGroup);
  igniterSelect.addEventListener("change", onChange);

  // Stoke / dampen
  const stokeDrafts = draftsFromItems(known?.stoke);
  const stokeTime = { value: known?.stokeTime ?? "" };
  const stoke = toggleSection(
    "Stoke",
    "Stoke time (optional)",
    stokeDrafts,
    stokeTime,
    !!known?.stoke,
    onChange,
    STOKE_RESOURCE_OPTIONS,
  );
  form.appendChild(stoke.root);

  const dampenDrafts = draftsFromItems(known?.dampen);
  const dampenTime = { value: known?.dampenTime ?? "" };
  const dampen = toggleSection(
    "Dampen",
    "Dampen time (optional)",
    dampenDrafts,
    dampenTime,
    !!known?.dampen,
    onChange,
    DAMPEN_RESOURCE_OPTIONS,
  );
  form.appendChild(dampen.root);

  // Submit
  const submitBtn = el("button", "pyro-rc-submit-btn") as HTMLButtonElement;
  submitBtn.type = "button";
  submitBtn.innerHTML = `${ICON_SEND}<span>Submit</span>`;
  form.appendChild(submitBtn);

  const status = el("div", "pyro-rc-status");
  form.appendChild(status);

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
    })),
    stokeTime: known?.stokeTime ?? "",
    dampenEnabled: !!known?.dampen,
    dampen: (known?.dampen ?? []).map((i) => ({
      resourceId: i.resourceId,
      qty: i.qty,
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
    const changed = JSON.stringify(current) !== JSON.stringify(baseline);

    submitBtn.disabled = !isValid || !changed;
    if (isValid && !changed) {
      status.textContent = "No changes to submit yet.";
      status.className = "pyro-rc-status hint";
    } else if (status.className === "pyro-rc-status hint") {
      status.textContent = "";
      status.className = "pyro-rc-status";
    }
  };
  revalidate();

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
          status.innerHTML = ICON_CHECK;
          status.appendChild(txt("Submitted!"));
          status.className = "pyro-rc-status ok";
        } else {
          status.innerHTML = ICON_X;
          status.appendChild(txt(result.error));
          status.className = "pyro-rc-status err";
          revalidate();
        }
      },
    );
  });

  return form;
}

/**
 * Best-effort extraction of the logged-in player's Torn ID + display name from the
 * top-nav user-information block (`<a href="/profiles.php?XID=<id>">Name</a>`, confirmed
 * live: `.user-information___* a.menu-value___*`). Returns nulls (not thrown) if the
 * pattern can't be found — submission still succeeds without them.
 */
function getPlayerInfoSafe(): { id: string | null; name: string | null } {
  try {
    const link = document.querySelector<HTMLAnchorElement>(
      '[class*="user-information"] a[href*="profiles.php?XID="]',
    );
    if (!link) return { id: null, name: null };
    const match = /XID=(\d+)/.exec(link.href);
    const name = link.textContent?.trim() || null;
    return { id: match ? match[1] : null, name };
  } catch {
    return { id: null, name: null };
  }
}

// ---------------------------------------------------------------------------
// Tab entry point
// ---------------------------------------------------------------------------

export function buildSubmitTab(ctx: SettingsCtx): HTMLElement {
  injectSubmitTabStyles();

  const root = el("div", "pyro-rc-group");

  const submissionsLink = el("a", "pyro-rc-external-link") as HTMLAnchorElement;
  submissionsLink.href = "https://balaclava.app/arson/submissions";
  submissionsLink.target = "_blank";
  submissionsLink.rel = "noopener noreferrer";
  submissionsLink.innerHTML = `View submitted recipes ${ICON_EXTERNAL_LINK}`;
  root.appendChild(submissionsLink);

  const visibleNames = ctx.getVisibleScenarioNames();
  const initialSelection =
    preselectedScenario && visibleNames.includes(preselectedScenario)
      ? preselectedScenario
      : (visibleNames[0] ?? "");
  preselectedScenario = null;

  const scenarioGroup = el("div", "pyro-rc-group");
  const scenarioTitle = el("div", "pyro-rc-group-title");
  scenarioTitle.textContent = "Scenario";
  scenarioGroup.appendChild(scenarioTitle);

  const scenarioSelect = el(
    "select",
    "pyro-rc-select pyro-rc-scenario-select",
  ) as HTMLSelectElement;
  if (visibleNames.length === 0) {
    const opt = document.createElement("option");
    opt.value = "";
    opt.textContent = "No scenarios visible on this page";
    scenarioSelect.appendChild(opt);
    scenarioSelect.disabled = true;
  } else {
    for (const name of visibleNames) {
      const opt = document.createElement("option");
      opt.value = name;
      opt.textContent = name;
      scenarioSelect.appendChild(opt);
    }
    scenarioSelect.value = initialSelection;
  }
  addSelectChrome(scenarioSelect);
  scenarioGroup.appendChild(scenarioSelect);
  root.appendChild(scenarioGroup);

  const formSlot = el("div");
  if (initialSelection) formSlot.appendChild(buildForm(initialSelection));
  root.appendChild(formSlot);

  scenarioSelect.addEventListener("change", () => {
    formSlot.innerHTML = "";
    if (scenarioSelect.value)
      formSlot.appendChild(buildForm(scenarioSelect.value));
  });

  return root;
}
