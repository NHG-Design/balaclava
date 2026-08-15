import { el } from "../../lib/shared-ui/dom.js";
import { checkboxCss } from "./checkbox.js";

const ROW_CLASS = "pyro-toggle-row";
const BODY_CLASS = "pyro-toggle-body";
const CHECKBOX_CLASS = "pyro-toggle-checkbox";

export interface ToggleRowHandle {
  /** Contains the checkbox row and the (initially shown/hidden) body — append this to your layout. */
  root: HTMLElement;
  /** Quote-line indented container revealed while checked — append nested rows/controls here. */
  body: HTMLElement;
  checkbox: HTMLInputElement;
  isChecked(): boolean;
  setChecked(checked: boolean): void;
}

/**
 * CSS for the checkbox row + quote-line indented body it reveals/hides. Embed once (per accent
 * color) at the top level of an injected stylesheet — shared by every `buildToggleRow` usage.
 */
export function toggleRowCss(accentColor: string): string {
  return `
.${ROW_CLASS} { box-sizing: border-box; min-height: 24px; display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--shared-text-muted); cursor: pointer; user-select: none; }
.${BODY_CLASS} { display: flex; flex-direction: column; gap: 8px; padding-left: 4px; margin-top: 8px; border-left: 2px solid var(--shared-surface-border); }
${checkboxCss(CHECKBOX_CLASS, accentColor)}
`;
}

/**
 * A checkbox row that reveals/hides a quote-line indented body underneath it — shared shape
 * behind "Stoke"/"Dampen" (Submit tab) and "Show building data"/"Show material data" (Visuals
 * tab). Caller appends whatever nested rows/controls belong to the toggled section into `body`.
 */
export function buildToggleRow(
  label: string,
  checkedInitially: boolean,
  onToggle: (checked: boolean) => void,
): ToggleRowHandle {
  const root = el("div");

  const checkRow = el("label", ROW_CLASS);
  const checkbox = el("input", CHECKBOX_CLASS) as HTMLInputElement;
  checkbox.type = "checkbox";
  checkbox.checked = checkedInitially;
  const lbl = el("span");
  lbl.textContent = label;
  checkRow.appendChild(checkbox);
  checkRow.appendChild(lbl);
  root.appendChild(checkRow);

  const body = el("div", BODY_CLASS);
  body.style.display = checkedInitially ? "flex" : "none";
  root.appendChild(body);

  function setChecked(checked: boolean): void {
    checkbox.checked = checked;
    body.style.display = checked ? "flex" : "none";
  }

  checkbox.addEventListener("change", () => {
    body.style.display = checkbox.checked ? "flex" : "none";
    onToggle(checkbox.checked);
  });

  return { root, body, checkbox, isChecked: () => checkbox.checked, setChecked };
}
