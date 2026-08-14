import { txt } from "../../lib/shared-ui/dom.js";

/** Sets `el`'s content to an inline icon (raw SVG markup) followed by a text node. */
export function setIconStatus(el: HTMLElement, icon: string, message: string): void {
  el.innerHTML = icon;
  el.appendChild(txt(message));
}
