import { RESOURCE, type ResourceId } from './catalog.js';

export interface ActionItem {
    resourceId: ResourceId;
    qty: number;
    /** Optional items are excluded from base cost/nerve; shown in tooltip with context. */
    optional?: boolean;
    optionalLabel?: string;
}

export interface StrategyActions {
    evidence?: ActionItem[];
    ignite?: ActionItem[];
    place: ActionItem[];
    stoke?: ActionItem[];
    dampen?: ActionItem[];
}

export interface Strategy {
    /** Exact scenario name as it appears on the Torn Arson crimes page. */
    scenarioName: string;
    /** Base listed payout in Torn dollars (ignoring ±10% variance). */
    payout: number;
    actions: StrategyActions;
    /** Requires Crime Skill >= 80 (Flamethrower). */
    requiresFlamethrower?: boolean;
    notes?: string;
    /**
     * Marked when recipe details are uncertain.
     * Excluded from profit ranking; tooltip shows an unconfirmed indicator.
     */
    needsVerification?: boolean;
}

export const STRATEGIES: Strategy[] = [
    // --- Flamethrower variants listed after non-FT for the same scenario ---

    {
        scenarioName: 'A Black Mark',
        payout: 210_000,
        actions: {
            place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
            stoke: [{ resourceId: RESOURCE.LIGHTER,  qty: 1 }],
        },
    },
    {
        scenarioName: 'A Black Mark',
        payout: 210_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE,     qty: 1 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'Burning Ambition',
        payout: 46_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE,     qty: 2 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'Burning Calories',
        payout: 84_000,
        actions: {
            place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }],
        },
    },
    {
        scenarioName: 'Burning Calories',
        payout: 100_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE,     qty: 4 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'Child\'s Play',
        payout: 23_000,
        actions: {
            place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
        },
    },
    {
        scenarioName: 'Child\'s Play',
        payout: 23_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE,     qty: 1 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'Cooked and Burned',
        payout: 73_000,
        actions: {
            evidence: [{ resourceId: RESOURCE.AMMONIA,    qty: 1 }],
            ignite:   [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:    [{ resourceId: RESOURCE.GASOLINE,   qty: 2 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'Final Cut',
        payout: 150_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE,     qty: 4 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'From the Ashes',
        payout: 170_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE,     qty: 4 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'Going Viral',
        payout: 190_000,
        actions: {
            place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }],
        },
    },
    {
        scenarioName: 'Going Viral',
        payout: 190_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE,     qty: 3 }],
            stoke:  [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1, optional: true, optionalLabel: 'if needed' }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'Green With Envy',
        payout: 120_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE,     qty: 4 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'Hot Pursuit',
        payout: 28_000,
        actions: {
            place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
        },
    },
    {
        scenarioName: 'Hot Pursuit',
        payout: 50_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE,     qty: 2 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'Kindling Spirits',
        payout: 92_500,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE,     qty: 4 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'Needles to Say',
        payout: 39_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE,     qty: 1 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'Off the Market',
        payout: 155_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.HYDROGEN,     qty: 1 }],
            stoke:  [{ resourceId: RESOURCE.HYDROGEN,     qty: 1 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'Old School',
        payout: 62_000,
        actions: {
            place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }],
        },
    },
    {
        scenarioName: 'Old School',
        payout: 62_500,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE,     qty: 3 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'One Rotten Apple',
        payout: 180_000,
        actions: {
            place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
        },
    },
    {
        scenarioName: 'One Rotten Apple',
        payout: 180_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE,     qty: 2 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'Party Pooper',
        payout: 58_000,
        actions: {
            place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
        },
    },
    {
        scenarioName: 'Party Pooper',
        payout: 62_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE,     qty: 2 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'Raze the Steaks',
        payout: 250_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE,     qty: 5 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'Burn the Deck',
        payout: 96_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE,     qty: 3 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'Boom Industry',
        payout: 130_000,
        actions: {
            place: [{ resourceId: RESOURCE.GASOLINE, qty: 5 }],
        },
    },
    {
        scenarioName: 'Boom Industry',
        payout: 100_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE,     qty: 3 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'Igniting Curiosity',
        payout: 100_000,
        actions: {
            evidence: [{ resourceId: RESOURCE.SUMO_DOLL, qty: 1 }],
            place:    [{ resourceId: RESOURCE.GASOLINE,  qty: 3 }],
        },
    },
    {
        scenarioName: 'Igniting Curiosity',
        payout: 260_000,
        actions: {
            evidence: [{ resourceId: RESOURCE.SUMO_DOLL,    qty: 1 }],
            ignite:   [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:    [{ resourceId: RESOURCE.GASOLINE,     qty: 4 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'Burn Rubber',
        payout: 67_000,
        actions: {
            evidence: [{ resourceId: RESOURCE.MAYAN_STATUE, qty: 1 }],
            ignite:   [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:    [{ resourceId: RESOURCE.GASOLINE,     qty: 2 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'Hot out of the Gate',
        payout: 96_000,
        actions: {
            evidence: [{ resourceId: RESOURCE.GOLD_TOOTH,   qty: 1 }],
            ignite:   [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:    [{ resourceId: RESOURCE.GASOLINE,     qty: 2 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'Bald Faced Destruction',
        payout: 245_000,
        actions: {
            evidence: [{ resourceId: RESOURCE.RAW_IVORY,    qty: 1 }],
            ignite:   [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:    [{ resourceId: RESOURCE.GASOLINE,     qty: 3 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'Blaze of Glory',
        payout: 180_000,
        actions: {
            evidence: [{ resourceId: RESOURCE.TOOTHBRUSH,   qty: 1 }],
            ignite:   [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:    [{ resourceId: RESOURCE.GASOLINE,     qty: 2 }],
            stoke:    [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'A Treat for the Tricked',
        payout: 71_000,
        actions: {
            evidence: [{ resourceId: RESOURCE.KABUKI_MASK,  qty: 1 }],
            ignite:   [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:    [{ resourceId: RESOURCE.GASOLINE,     qty: 1 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'Muscling In',
        payout: 90_500,
        actions: {
            evidence: [{ resourceId: RESOURCE.SYRINGE,      qty: 1 }],
            ignite:   [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:    [{ resourceId: RESOURCE.GASOLINE,     qty: 2 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'Banking on It',
        payout: 200_000,
        actions: {
            evidence: [{ resourceId: RESOURCE.STAPLER,      qty: 1 }],
            ignite:   [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:    [{ resourceId: RESOURCE.GASOLINE,     qty: 3 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'Planted',
        payout: 120_000,
        actions: {
            evidence: [{ resourceId: RESOURCE.PELE_CHARM, qty: 1 }],
            ignite:   [{ resourceId: RESOURCE.LIGHTER,    qty: 1 }],
            place:    [{ resourceId: RESOURCE.GASOLINE,   qty: 1 }],
        },
    },

    {
        scenarioName: 'Flame and Fortune',
        payout: 680_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.KEROSENE,     qty: 3 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'Cache and Burn',
        payout: 490_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.KEROSENE,     qty: 4 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'Lock, Stock, and Barrel',
        payout: 210_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.HYDROGEN,     qty: 1 }],
            stoke:  [{ resourceId: RESOURCE.HYDROGEN,     qty: 1 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'Letter of the Law',
        payout: 360_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.HYDROGEN,     qty: 1 }],
            stoke:  [{ resourceId: RESOURCE.HYDROGEN,     qty: 2 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'Gentrifried',
        payout: 230_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER,    qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE,        qty: 2 }],
            stoke:  [{ resourceId: RESOURCE.POTASSIUM_NITRATE, qty: 2 }],
        },
        requiresFlamethrower: true,
    },

    // --- Needs verification ---

    {
        scenarioName: 'A Bitter Taste',
        payout: 0,
        actions: { place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }] },
        needsVerification: true,
    },
    {
        scenarioName: 'Blown to High Heaven',
        payout: 0,
        actions: { place: [{ resourceId: RESOURCE.OXYGEN, qty: 1 }] },
        needsVerification: true,
    },
    {
        scenarioName: 'Bugging Me',
        payout: 0,
        actions: { place: [{ resourceId: RESOURCE.OXYGEN, qty: 2 }] },
        needsVerification: true,
    },
    {
        scenarioName: 'Hell Fire',
        payout: 0,
        actions: { place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }] },
        needsVerification: true,
    },
    {
        scenarioName: 'Bummed Out',
        payout: 0,
        actions: { place: [{ resourceId: RESOURCE.KEROSENE, qty: 3 }] },
        needsVerification: true,
    },
    {
        scenarioName: 'Finish Line',
        payout: 0,
        actions: { place: [{ resourceId: RESOURCE.KEROSENE, qty: 1 }], stoke: [{ resourceId: RESOURCE.METHANE, qty: 1 }] },
        needsVerification: true,
    },
    {
        scenarioName: 'Cut to the Chase',
        payout: 0,
        actions: { place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }] },
        needsVerification: true,
    },
    {
        scenarioName: 'Hot Under the Collar',
        payout: 0,
        actions: { place: [{ resourceId: RESOURCE.THERMITE, qty: 1 }] },
        needsVerification: true,
    },
    {
        scenarioName: 'Improving the Odds',
        payout: 0,
        actions: { place: [{ resourceId: RESOURCE.DIESEL, qty: 1 }], stoke: [{ resourceId: RESOURCE.DIESEL, qty: 1 }] },
        needsVerification: true,
    },
    {
        scenarioName: 'Cooking Time',
        payout: 0,
        actions: { place: [{ resourceId: RESOURCE.DIESEL, qty: 1 }], stoke: [{ resourceId: RESOURCE.DIESEL, qty: 1 }] },
        needsVerification: true,
    },
];
