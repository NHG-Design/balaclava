const CHECK_MASK_PATH = "M9 16.2l-3.5-3.5-1.4 1.4L9 19 20 8l-1.4-1.4z";

/** Bare checkmark glyph, base64-free data URI — usable as a `mask-image` source anywhere a checkmark is drawn via CSS. */
export const CHECKMARK_DATA_URI = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="${CHECK_MASK_PATH}"/></svg>`,
)}`;

/**
 * Custom-checkbox appearance reset + checkmark styling, parameterized by class name and accent
 * color (the "checked" fill and outline/focus color). Embed the returned CSS text at the top
 * level of an injected stylesheet.
 */
export function checkboxCss(className: string, accentColor: string): string {
  return `
.${className} {
    appearance: none;
    -webkit-appearance: none;
    box-sizing: border-box;
    width: 15px;
    height: 15px;
    margin: 0;
    flex-shrink: 0;
    border: 1px solid var(--shared-surface-border);
    border-radius: 3px;
    background: var(--shared-surface);
    accent-color: ${accentColor};
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
}
.${className}:checked {
    background: ${accentColor};
    border-color: ${accentColor};
}
.${className}:checked::after {
    content: "";
    width: 9px;
    height: 9px;
    background-color: oklch(18% 0 0);
    -webkit-mask-image: url("${CHECKMARK_DATA_URI}");
    mask-image: url("${CHECKMARK_DATA_URI}");
    -webkit-mask-size: contain;
    mask-size: contain;
    -webkit-mask-repeat: no-repeat;
    mask-repeat: no-repeat;
}
.${className}:focus-visible { outline: 2px solid ${accentColor}; outline-offset: 1px; }
`;
}
