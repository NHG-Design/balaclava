/** Raw Torn theme custom properties this bridge reads from a `.crimes-app` (or similar) source element. */
export const TORN_THEME_VAR_NAMES = [
    "--crimes-crimeOption-bgColor",
    "--crimes-outcomeDivider-color",
    "--crimes-baseText-color",
    "--crimes-subtleSubText-color",
    "--crimes-stats-successes-color",
    "--crimes-stats-criticalFails-color",
    "--tooltip-bg-color",
    "--mini-profile-border",
    "--mini-profile-box-shadow",
] as const;

/**
 * Forwards Torn's raw theme vars as inline custom properties on `target`, for contexts (e.g. a
 * shadow-DOM host appended outside `.crimes-app`) that can't inherit them naturally through the
 * CSS cascade.
 */
export function syncTornThemeVars(target: HTMLElement, sourceSelector = ".crimes-app"): void {
    const source = document.querySelector<HTMLElement>(sourceSelector);
    if (!source) return;
    const computed = getComputedStyle(source);
    for (const name of TORN_THEME_VAR_NAMES) {
        const value = computed.getPropertyValue(name).trim();
        if (value) target.style.setProperty(name, value);
    }
}
