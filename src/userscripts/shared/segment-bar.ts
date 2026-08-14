import { el } from "../../lib/shared-ui/dom.js";

/**
 * Builds a row of `count` `<span>` segments inside a `<div class={trackClassName}>`, coloring the
 * first `filled` of them with `color` via `seg.style.background` and (optionally) an extra
 * "filled" modifier class.
 */
export function buildSegmentTrack(
  trackClassName: string,
  segClassName: string,
  count: number,
  filled: number,
  color: string,
  filledClassName?: string,
): HTMLElement {
  const track = el("div", trackClassName);
  for (let i = 0; i < count; i++) {
    const seg = el("span", segClassName);
    if (i < filled) {
      if (filledClassName) seg.classList.add(filledClassName);
      seg.style.background = color;
    }
    track.appendChild(seg);
  }
  return track;
}
