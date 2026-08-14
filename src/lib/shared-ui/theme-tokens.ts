/** Fallback values used when Torn's raw vars aren't available (e.g. non-Torn pages). */
const FALLBACK = {
    outcomeDivider: 'oklch(30% 0 0)',
    baseText: 'oklch(82% 0.007 285)',
    subtleSubText: 'oklch(58% 0.012 285)',
    successes: '#6d6',
    criticalFails: '#c66',
    tooltipBg: 'oklch(24% 0 0)',
};

/**
 * Derived `--shared-*` color vocabulary (border/text/surface/success/danger), computed via
 * `color-mix` from Torn's raw `--crimes-*`/`--tooltip-bg-color` custom properties. Embed this CSS
 * text inside any selector's declaration block that needs themed colors — it declares the tokens
 * as local custom properties, so no separate injection step is required as long as the raw Torn
 * vars are reachable (naturally inherited if the element is inside `.crimes-app`; forwarded via
 * `syncTornThemeVars` from `theme-bridge.ts` otherwise, e.g. for a detached shadow-DOM host).
 */
export const SHARED_THEME_TOKENS_CSS = `
    --shared-border: color-mix(in oklch, var(--crimes-outcomeDivider-color, ${FALLBACK.outcomeDivider}) 75%, black 25%);
    --shared-text: var(--crimes-baseText-color, ${FALLBACK.baseText});
    --shared-text-muted: color-mix(in oklch, var(--crimes-subtleSubText-color, ${FALLBACK.subtleSubText}) 55%, var(--crimes-baseText-color, ${FALLBACK.baseText}) 45%);
    --shared-success: var(--crimes-stats-successes-color, ${FALLBACK.successes});
    --shared-danger: var(--crimes-stats-criticalFails-color, ${FALLBACK.criticalFails});
    --shared-bg: var(--tooltip-bg-color, ${FALLBACK.tooltipBg});
    --shared-surface: color-mix(in oklch, var(--tooltip-bg-color, ${FALLBACK.tooltipBg}) 85%, black 15%);
    --shared-surface-hover: color-mix(in oklch, var(--shared-surface) 78%, white 22%);
    --shared-surface-border: color-mix(in oklch, var(--shared-surface) 55%, white 45%);
    --shared-danger-bg: color-mix(in oklch, var(--shared-danger) 16%, var(--shared-surface));
    --shared-danger-border: color-mix(in oklch, var(--shared-danger) 45%, var(--shared-surface));
    --shared-danger-bg-hover: color-mix(in oklch, var(--shared-danger) 26%, var(--shared-surface));
`;
