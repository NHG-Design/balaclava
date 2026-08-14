import { el } from "../../lib/shared-ui/dom.js";

export interface NumberInputOptions {
  className?: string;
  min?: number;
}

/**
 * A number `<input>` that commits on blur (or Enter → blur): parses + rounds the value, reverts
 * to `getVal()` if it doesn't parse or falls below `min`, and calls `setVal()` on a valid commit.
 */
export function buildNumberInput(
  getVal: () => number,
  setVal: (n: number) => void,
  options: NumberInputOptions = {},
): HTMLInputElement {
  const min = options.min ?? 0;
  const input = el("input", options.className ?? "") as HTMLInputElement;
  input.type = "number";
  input.min = String(min);
  input.value = String(getVal());

  input.addEventListener("blur", () => {
    const val = Math.round(parseFloat(input.value));
    if (!isNaN(val) && val >= min) {
      setVal(val);
      input.value = String(val);
    } else {
      input.value = String(getVal());
    }
  });
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") input.blur();
  });

  return input;
}
