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

    /**
     * Fire meter on the arson card.
     * Torn uses obfuscated classes here, so keep matching broad and local.
     */
    FIRE_METER: '[class*="fireMeter"]',

    /** Crime image thumbnail — retained as a fallback tooltip anchor. */
    CRIME_IMAGE: '.crime-image',

    /**
     * Mobile/tablet-only row holding the building-damage icon and the
     * responder (alarm) status icon. Absent on desktop, where those icons
     * live in DESKTOP_STATUS_SECTION instead — used as the mobile building-
     * stats badge anchor since the overlay badges don't fit on-image there.
     */
    BUILDING_RESPONDER_ICONS: '[class*="buildingAndResponderIcons___"]',

    /** Round alarm/responder status icon within BUILDING_RESPONDER_ICONS. */
    RESPONDER_STATUS: '[class*="responderStatus___"]',

    /**
     * Materials item-selector popover, opened by clicking an itemSection
     * during place/ignite/dampen. Obfuscated class — Torn native, not part
     * of `.arson-root`, so it's queried from `document` directly.
     */
    ITEM_SELECTOR: '[class*="itemSelector___"]',

    /** One material group column (igniters/liquids/solids/gases/dampeners) within ITEM_SELECTOR. */
    ITEM_GROUP: '[class*="group___"]',

    /** Wrapper for a single material's button+image within an ITEM_GROUP. */
    ITEM_CELL_WRAP: '[class*="itemCellWrap___"]',

    /** The material's item image — its `src`/`srcset` numeric id maps to a Torn item id. */
    ITEM_IMAGE: '[class*="image___"]',

    /**
     * Desktop-only wrapper around the "Abandon target" close button, inside
     * TITLE_SECTION. Absent on mobile/tablet layout. Recipe-submit trigger
     * button is injected as a sibling here.
     */
    ABANDON_BUTTON_WRAPPER: '[class*="abandonButtonWrapper___"]',

    /**
     * Torn's top-nav user info block, containing a link to the logged-in
     * player's own profile (`/profiles.php?XID=<id>`). Queried from
     * `document` directly — outside `.arson-root`.
     */
    USER_INFORMATION: '[class*="user-information"]',
} as const;
