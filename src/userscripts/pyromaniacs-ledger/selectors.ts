/**
 * DOM selector constants for Torn's Arson crimes page.
 *
 * Stable native classes/IDs are preferred. Obfuscated `class*=` prefix
 * matches are isolated here so a Torn class rename is a one-line fix.
 */
export const SEL = {
    /** Root of the arson crime widget. Stable class — scope all queries here. */
    ROOT: '.arson-root',

    /** Each active crime card (the annotatable unit). Stable class. */
    CARD: '.crime-option-sections',

    /** Stats panel containing the Skill level button. Stable ID. */
    STATS_PANEL: '#crime-stats-panel',

    /** Skill level button inside the stats panel. Stable aria-label prefix. */
    SKILL_BTN: 'button[aria-label^="Skill:"]',

    /**
     * Scenario name text element within a card.
     * No stable class — obfuscated prefix match retained.
     */
    SCENARIO: '[class*="scenario___"]',

    /**
     * crimeOptionSection wrapper that contains the title + scenario.
     * Used with .closest() from scenarioEl — single prefix match instead of
     * the previous triple-class selector.
     */
    TITLE_SECTION: '[class*="crimeOptionSection___"]',

    /**
     * Desktop-only status section (large icons). Absent on mobile/tablet layout.
     * Used to distinguish desktop cards (where the inline $ppn label fits) from
     * compact mobile cards (where it doesn't).
     */
    DESKTOP_STATUS_SECTION: '[class*="desktopStatusSection___"]',

    /**
     * Title bar at the top of the current crime panel.
     */
    TITLE_BAR: '[class*="titleBar___"]',

    /**
     * Result-counts strip (successes / fails / critical fails icons).
     * Settings gear is appended here as an additional item.
     */
    RESULT_COUNTS: '[class*="resultCounts___"]',

    /** Card that has already been committed and is waiting to be collected. */
    PENDING_COLLECT: '.pending-collect',
} as const;
