import { el } from "../../lib/shared-ui/dom.js";

export interface ButtonGroupOption<T extends string> {
  value: T;
  label: string;
}

export interface ButtonGroupHandle<T extends string> {
  wrap: HTMLElement;
  /** Re-reads the current value and updates each button's active/pressed state. */
  sync(): void;
}

export interface ButtonGroupConfig<T extends string> {
  wrapClassName: string;
  btnClassName: string;
  activeClassName?: string;
  /** Set when the group should announce itself as an ARIA `group` with `aria-pressed` buttons. */
  ariaGroup?: boolean;
  /** Called with each button + its option before it's appended, for extra attributes (e.g. `dataset`). */
  onButtonCreated?(btn: HTMLButtonElement, option: ButtonGroupOption<T>): void;
}

/**
 * Builds a row of buttons where exactly one is "active" at a time — shared shape behind both a
 * toggle group (pull: re-syncs from `getVal()` after every click) and a tab bar (push: the click
 * handler itself flips the active class, `getVal`/`onSelect` drive external state).
 */
export function buildButtonGroup<T extends string>(
  config: ButtonGroupConfig<T>,
  options: ButtonGroupOption<T>[],
  getVal: () => T,
  onSelect: (value: T) => void,
): ButtonGroupHandle<T> {
  const activeClassName = config.activeClassName ?? "active";
  const wrap = el("div", config.wrapClassName);
  if (config.ariaGroup) wrap.setAttribute("role", "group");

  const buttons = options.map((option) => {
    const btn = el("button", config.btnClassName) as HTMLButtonElement;
    btn.type = "button";
    btn.textContent = option.label;
    config.onButtonCreated?.(btn, option);
    btn.addEventListener("click", () => {
      onSelect(option.value);
      sync();
    });
    wrap.appendChild(btn);
    return { value: option.value, btn };
  });

  function sync(): void {
    const current = getVal();
    for (const { value, btn } of buttons) {
      const active = value === current;
      if (config.ariaGroup) btn.setAttribute("aria-pressed", String(active));
      btn.classList.toggle(activeClassName, active);
    }
  }

  sync();
  return { wrap, sync };
}
