import { el, injectStyleOnce } from "../../lib/shared-ui/dom.js";
import { SHARED_THEME_TOKENS_CSS } from "../../lib/shared-ui/theme-tokens.js";

export interface PopoverHandle {
  wrap: HTMLElement;
  btn: HTMLButtonElement;
  panel: HTMLElement;
  open(): void;
  close(): void;
  toggle(): void;
}

let stylesInjected = false;

/** Shared chrome (trigger button + positioned panel with arrow, open/close transitions) for all pyro-* popovers. */
export function injectPopoverStyles(): void {
  if (stylesInjected) return;
  stylesInjected = true;
  injectStyleOnce("pyro-popover-styles", `
.pyro-popover-wrap {
    ${SHARED_THEME_TOKENS_CSS}
    --pyro-tooltip-radius: 8px;
    --pyro-tooltip-arrow-size: 12px;
    --pyro-popover-btn-size: 24px;
    position: relative;
    display: inline-flex;
    align-items: center;
}
.pyro-popover-btn {
    width: var(--pyro-popover-btn-size);
    height: var(--pyro-popover-btn-size);
    padding: 0;
    border: 1px solid #fff;
    border: var(--mini-profile-border);
    color: #ff8a3d;
    cursor: pointer;
    border-radius: var(--pyro-tooltip-radius);
    font-size: 13px;
    line-height: 1;
    user-select: none;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 100ms ease-out, background 120ms ease-out, color 120ms ease-out;
}
@media (hover: hover) and (pointer: fine) {
    .pyro-popover-btn:hover { background: color-mix(in oklch, var(--tooltip-bg-color, oklch(24% 0 0)) 94%, white 6%); color: var(--shared-text); }
}
.pyro-popover-btn:active { transform: scale(0.94); }
.pyro-popover-panel {
    position: absolute;
    top: calc(100% + 10px);
    right: 0;
    z-index: 9999;
    background: var(--tooltip-bg-color) 0 0 no-repeat;
    color: var(--shared-text);
    border: 1px solid #fff;
    border: var(--mini-profile-border);
    box-shadow: var(--mini-profile-box-shadow);
    border-radius: var(--pyro-tooltip-radius);
    min-width: 290px;
    max-width: 360px;
    overflow: visible;
    transform-origin: calc(100% - (var(--pyro-popover-btn-size) / 2)) calc(0px - var(--pyro-tooltip-arrow-size));
    transform: scale(0.95);
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
    transition: transform 150ms ease-out, opacity 150ms ease-out, visibility 0ms linear 150ms;
}
.pyro-popover-panel svg {
  filter: initial !important;
}
.pyro-popover-panel::before {
    content: '';
    position: absolute;
    top: calc(var(--pyro-tooltip-arrow-size) / -2);
    right: calc((var(--pyro-popover-btn-size) / 2) - (var(--pyro-tooltip-arrow-size) / 2));
    width: var(--pyro-tooltip-arrow-size);
    height: var(--pyro-tooltip-arrow-size);
    background: var(--tooltip-bg-color);
    border: 1px solid #fff;
    border: var(--mini-profile-border);
    transform: rotate(45deg);
    box-sizing: border-box;
    border-right: none;
    border-bottom: none;
    border-radius: 3px;
}
.pyro-popover-panel.is-open {
    transform: scale(1);
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
    transition: transform 150ms ease-out, opacity 150ms ease-out, visibility 0ms linear 0ms;
}
.pyro-popover-panel:not(.is-open) {
    transition: transform 100ms ease-out, opacity 100ms ease-out, visibility 0ms linear 100ms;
}
`);
}

/**
 * Builds a trigger button + positioned panel pair sharing the pyro-popover-* chrome:
 * click-to-toggle, click-inside-panel doesn't close, click-outside closes.
 */
export function createPopover(opts: {
  buttonAriaLabel: string;
  buttonContent: string;
  btnId?: string;
  panelId?: string;
  wrapClass?: string;
}): PopoverHandle {
  injectPopoverStyles();

  const wrap = el(
    "div",
    opts.wrapClass
      ? `pyro-popover-wrap ${opts.wrapClass}`
      : "pyro-popover-wrap",
  );
  const btn = el("button", "pyro-popover-btn") as HTMLButtonElement;
  btn.type = "button";
  if (opts.btnId) btn.id = opts.btnId;
  btn.setAttribute("aria-label", opts.buttonAriaLabel);
  btn.setAttribute("aria-expanded", "false");
  btn.innerHTML = opts.buttonContent;

  const panel = el("div", "pyro-popover-panel");
  if (opts.panelId) panel.id = opts.panelId;

  wrap.appendChild(btn);
  wrap.appendChild(panel);

  function open(): void {
    panel.classList.add("is-open");
    btn.setAttribute("aria-expanded", "true");
  }
  function close(): void {
    panel.classList.remove("is-open");
    btn.setAttribute("aria-expanded", "false");
  }
  function toggle(): void {
    if (panel.classList.contains("is-open")) close();
    else open();
  }

  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    toggle();
  });
  panel.addEventListener("click", (e) => {
    e.stopPropagation();
  });
  document.addEventListener(
    "click",
    (e) => {
      const path = typeof e.composedPath === "function" ? e.composedPath() : [];
      const clickedInside =
        path.length > 0 ? path.includes(wrap) : wrap.contains(e.target as Node);
      if (!clickedInside) close();
    },
    { passive: true },
  );

  return { wrap, btn, panel, open, close, toggle };
}
