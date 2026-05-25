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
    {
        scenarioName: 'A Burnt Child Dreads the Fire',
        payout: 190_000,
        actions: {
            place: [
                { resourceId: RESOURCE.KEROSENE, qty: 2 },
            ],
            stoke: [{ resourceId: RESOURCE.METHANE, qty: 1 }],
        },
    },
    {
        scenarioName: 'A Burnt Child Dreads the Fire',
        payout: 235_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
            stoke:  [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'A Dirty Job',
        payout: 30_000,
        actions: {
            place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
        },
    },
    {
        scenarioName: 'A Dirty Job',
        payout: 32_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'A Fungus Among Us',
        payout: 38_000,
        actions: {
            place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
        },
    },
    {
        scenarioName: 'A Fungus Among Us',
        payout: 34_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'A Hot Lead',
        payout: 22_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: "A Mug's Game",
        payout: 55_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.MOLOTOV, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
        },
    },
    {
        scenarioName: "A Mug's Game",
        payout: 55_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'A Problem Shared',
        payout: 180_000,
        actions: {
            place: [{ resourceId: RESOURCE.GASOLINE, qty: 6 }],
            stoke: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
        },
    },
    {
        scenarioName: 'A Problem Shared',
        payout: 180_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 4 }],
            stoke:  [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'A Rash Decision',
        payout: 11_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
        },
    },

    {
        scenarioName: 'All Mouth and Trousers',
        payout: 51_000,
        actions: {
            evidence: [{ resourceId: RESOURCE.DIAMOND_RING, qty: 1 }],
            place:    [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
        },
    },
    {
        scenarioName: 'All Mouth and Trousers',
        payout: 56_000,
        actions: {
            evidence: [{ resourceId: RESOURCE.DIAMOND_RING, qty: 1 }],
            ignite:   [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:    [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'Always Read the Label',
        payout: 170_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 5 }],
            stoke:  [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'Anon Starter',
        payout: 1_200,
        actions: {
            place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
        },
    },
    {
        scenarioName: 'Anon Starter',
        payout: 31_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'Apart of the Problem',
        payout: 265_000,
        actions: {
            place: [{ resourceId: RESOURCE.GASOLINE, qty: 6 }],
        },
    },
    {
        scenarioName: 'Apart of the Problem',
        payout: 265_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 4 }],
            stoke:  [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'Ash or Credit?',
        payout: 180_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
            stoke:  [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'Ashes to Ancestors',
        payout: 90_000,
        actions: {
            place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }],
            stoke: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
        },
    },
    {
        scenarioName: 'Ashes to Ancestors',
        payout: 90_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 5 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'Back, Sack, and Crack',
        payout: 300_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.HYDROGEN, qty: 2 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'Baewatch',
        payout: 13_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'Bagged and Tagged',
        payout: 1_600,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'Bald Faced Destruction',
        payout: 230_000,
        actions: {
            evidence: [{ resourceId: RESOURCE.RAW_IVORY,  qty: 1 }],
            place:    [{ resourceId: RESOURCE.GASOLINE,   qty: 4 }],
        },
    },

    {
        scenarioName: 'Bang For Your Buck',
        payout: 21_000,
        actions: {
            evidence: [{ resourceId: RESOURCE.GRENADE,  qty: 1 }],
            place:    [{ resourceId: RESOURCE.GASOLINE,  qty: 2 }],
        },
    },
    {
        scenarioName: 'Bang For Your Buck',
        payout: 44_000,
        actions: {
            evidence: [{ resourceId: RESOURCE.GRENADE,      qty: 1 }],
            ignite:   [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:    [{ resourceId: RESOURCE.GASOLINE,     qty: 1 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'Banking on It',
        payout: 120_000,
        actions: {
            evidence: [{ resourceId: RESOURCE.STAPLER,  qty: 1 }],
            place:    [{ resourceId: RESOURCE.GASOLINE,  qty: 3 }],
        },
    },

    {
        scenarioName: 'Beach Bum',
        payout: 20_000,
        actions: {
            place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
            stoke: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
        },
    },
    {
        scenarioName: 'Beach Bum',
        payout: 19_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'Beat the Odds',
        payout: 330_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 4 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: "Beggars Can't be Choosers",
        payout: 480_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [
                { resourceId: RESOURCE.GASOLINE, qty: 5 },
                { resourceId: RESOURCE.THERMITE, qty: 2 },
            ],
        },
        requiresFlamethrower: true,
        needsVerification: true,
    },

    {
        scenarioName: 'Beyond Repair',
        payout: 93_500,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 4 }],
            stoke:  [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        },
        requiresFlamethrower: true,
        needsVerification: true,
    },

    {
        scenarioName: 'Body of Evidence',
        payout: 105_000,
        actions: {
            place: [{ resourceId: RESOURCE.GASOLINE, qty: 6 }],
        },
    },
    {
        scenarioName: 'Body of Evidence',
        payout: 105_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 5 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'Bone of Contention',
        payout: 43_000,
        actions: {
            ignite:  [{ resourceId: RESOURCE.LIGHTER,  qty: 1 }],
            place:   [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
            dampen:  [{ resourceId: RESOURCE.BLANKET,  qty: 1 }],
        },
    },

    {
        scenarioName: 'Boxing Clever',
        payout: 325_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'Bright Spark',
        payout: 275_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.LIGHTER,   qty: 1 }],
            place:  [{ resourceId: RESOURCE.HYDROGEN,  qty: 1 }],
            stoke:  [{ resourceId: RESOURCE.HYDROGEN,  qty: 2 }],
        },
    },

    {
        scenarioName: 'Burn After Screening',
        payout: 99_000,
        actions: {
            place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
        },
    },
    {
        scenarioName: 'Burn After Screening',
        payout: 100_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'Burn Notice',
        payout: 175_000,
        actions: {
            place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }],
            stoke: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
        },
    },
    {
        scenarioName: 'Burn Notice',
        payout: 175_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 5 }],
        },
        requiresFlamethrower: true,
        needsVerification: true,
    },

    {
        scenarioName: 'Burn Rubber',
        payout: 50_000,
        actions: {
            evidence: [{ resourceId: RESOURCE.MAYAN_STATUE, qty: 1 }],
            place:    [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
        },
    },

    {
        scenarioName: 'Burn the Deck',
        payout: 57_000,
        actions: {
            place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
        },
    },

    {
        scenarioName: 'Burned by Stupidity',
        payout: 32_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.LIGHTER,   qty: 1 }],
            place:  [{ resourceId: RESOURCE.KEROSENE,  qty: 1 }],
        },
    },

    {
        scenarioName: 'Burned Cookies',
        payout: 81_000,
        actions: {
            place: [
                { resourceId: RESOURCE.DIESEL,    qty: 2 },
                { resourceId: RESOURCE.MAGNESIUM, qty: 2 },
            ],
            stoke: [{ resourceId: RESOURCE.DIESEL, qty: 1 }],
        },
        needsVerification: true,
    },

    {
        scenarioName: 'Burning Liability',
        payout: 160_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.LIGHTER,  qty: 1 }],
            place:  [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
            stoke:  [{ resourceId: RESOURCE.HYDROGEN, qty: 2 }],
        },
    },

    {
        scenarioName: 'Burning Memory',
        payout: 32_000,
        actions: {
            place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
        },
    },
    {
        scenarioName: 'Burning Memory',
        payout: 32_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'Burning Through Cash',
        payout: 58_000,
        actions: {
            place: [{ resourceId: RESOURCE.OXYGEN, qty: 1 }],
        },
    },
    {
        scenarioName: 'Burning Through Cash',
        payout: 105_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'Burnt Ends',
        payout: 170_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 4 }],
        },
        requiresFlamethrower: true,
        needsVerification: true,
    },

    {
        scenarioName: 'Burn up the Dancefloor',
        payout: 150_000,
        actions: {
            place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
        },
    },
    {
        scenarioName: 'Burn up the Dancefloor',
        payout: 175_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'Camera Tricks',
        payout: 115_000,
        actions: {
            place: [{ resourceId: RESOURCE.GASOLINE, qty: 5 }],
            stoke: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
        },
    },
    {
        scenarioName: 'Camera Tricks',
        payout: 115_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 4 }],
            stoke:  [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'Carrying a Torch',
        payout: 44_500,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'Chance of Redemption',
        payout: 90_000,
        actions: {
            place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }],
        },
    },
    {
        scenarioName: 'Chance of Redemption',
        payout: 59_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'Charcoal Sketch',
        payout: 49_000,
        actions: {
            place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
        },
    },
    {
        scenarioName: 'Charcoal Sketch',
        payout: 39_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'Chasing Targets',
        payout: 24_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'Checking Out',
        payout: 280_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.LIGHTER,  qty: 1 }],
            place:  [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
            stoke:  [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
        },
    },

    {
        scenarioName: 'Claim to Flame',
        payout: 33_500,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'Clean Sweep',
        payout: 150_000,
        actions: {
            place: [{ resourceId: RESOURCE.GASOLINE, qty: 5 }],
            stoke: [{ resourceId: RESOURCE.DIESEL,   qty: 1 }],
        },
    },
    {
        scenarioName: 'Clean Sweep',
        payout: 150_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 4 }],
            stoke:  [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'Cleansed Through Fire',
        payout: 46_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.DIESEL, qty: 1 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'Clinical Exposure',
        payout: 165_000,
        actions: {
            evidence: [{ resourceId: RESOURCE.OPIUM,    qty: 1 }],
            ignite:   [{ resourceId: RESOURCE.LIGHTER,  qty: 1 }],
            place:    [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
        },
    },

    {
        scenarioName: 'Cold Brew Reality',
        payout: 150_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.LIGHTER,  qty: 1 }],
            place:  [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
            stoke:  [{ resourceId: RESOURCE.HYDROGEN, qty: 2 }],
        },
        needsVerification: true,
    },

    {
        scenarioName: 'Cold Feet',
        payout: 100_000,
        actions: {
            place: [{ resourceId: RESOURCE.GASOLINE, qty: 6 }],
            stoke: [{ resourceId: RESOURCE.DIESEL,   qty: 1 }],
        },
    },
    {
        scenarioName: 'Cold Feet',
        payout: 120_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 5 }],
            stoke:  [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        },
        requiresFlamethrower: true,
        needsVerification: true,
    },

    {
        scenarioName: 'Cook it Rare',
        payout: 330_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.LIGHTER,  qty: 1 }],
            place:  [{ resourceId: RESOURCE.KEROSENE, qty: 3 }],
        },
    },

    {
        scenarioName: 'Cooked and Burned',
        payout: 70_000,
        actions: {
            evidence: [{ resourceId: RESOURCE.AMMONIA,  qty: 1 }],
            place:    [{ resourceId: RESOURCE.GASOLINE,  qty: 3 }],
        },
    },

    {
        scenarioName: 'Cooking the Books',
        payout: 22_000,
        actions: {
            place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
        },
    },
    {
        scenarioName: 'Cooking the Books',
        payout: 25_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'Cop Some Heat',
        payout: 19_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'Crafty Devil',
        payout: 100_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.LIGHTER,  qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
        },
    },

    {
        scenarioName: 'Crisp Bills',
        payout: 35_000,
        actions: {
            place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
        },
    },
    {
        scenarioName: 'Crisp Bills',
        payout: 39_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'Curtain Call',
        payout: 57_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.LIGHTER,  qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
        },
    },

    {
        scenarioName: 'Cut Corners',
        payout: 200_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.LIGHTER,  qty: 1 }],
            place:  [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
            stoke:  [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
        },
    },

    {
        scenarioName: "Daddy's Girl",
        payout: 330_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.LIGHTER,  qty: 1 }],
            place:  [{ resourceId: RESOURCE.KEROSENE, qty: 1 }],
            stoke:  [
                { resourceId: RESOURCE.METHANE,   qty: 1 },
                { resourceId: RESOURCE.HYDROGEN,  qty: 1 },
            ],
        },
    },

    {
        scenarioName: "Damned If You Don't",
        payout: 74_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'Dead Giveaway',
        payout: 29_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.LIGHTER,  qty: 1 }],
            place:  [{ resourceId: RESOURCE.KEROSENE, qty: 1 }],
        },
    },

    {
        scenarioName: 'The Devil\'s in the Details',
        payout: 73_000,
        actions: {
            place: [{ resourceId: RESOURCE.DIESEL, qty: 3 }],
        },
    },
    {
        scenarioName: 'The Devil\'s in the Details',
        payout: 130_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER,    qty: 1 }],
            place:  [{ resourceId: RESOURCE.DIESEL,           qty: 1 }],
            stoke:  [{ resourceId: RESOURCE.POTASSIUM_NITRATE, qty: 1 }],
        },
        requiresFlamethrower: true,
        needsVerification: true,
    },

    {
        scenarioName: 'Dine and Dash',
        payout: 95_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.LIGHTER,  qty: 1 }],
            place:  [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
            stoke:  [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
        },
    },

    {
        scenarioName: 'Dirty Money',
        payout: 360_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.LIGHTER,  qty: 1 }],
            place:  [{ resourceId: RESOURCE.KEROSENE, qty: 3 }],
        },
    },

    {
        scenarioName: 'Disco Inferno',
        payout: 48_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.LIGHTER,  qty: 1 }],
            place:  [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
        },
    },

    {
        scenarioName: "Don't Hate the Player",
        payout: 20_000,
        actions: {
            place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
        },
    },
    {
        scenarioName: "Don't Hate the Player",
        payout: 32_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'Eight Lives',
        payout: 4_200,
        actions: {
            place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
        },
    },
    {
        scenarioName: 'Eight Lives',
        payout: 6_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'Emotional Wreck',
        payout: 140_000,
        actions: {
            place: [{ resourceId: RESOURCE.GASOLINE, qty: 6 }],
        },
    },
    {
        scenarioName: 'Emotional Wreck',
        payout: 140_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 4 }],
            stoke:  [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'End of the Line',
        payout: 100_000,
        actions: {
            place: [{ resourceId: RESOURCE.GASOLINE, qty: 5 }],
        },
    },
    {
        scenarioName: 'End of the Line',
        payout: 78_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'Faction Fiction',
        payout: 64_500,
        actions: {
            place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }],
        },
    },
    {
        scenarioName: 'Faction Fiction',
        payout: 64_500,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'Family Feud',
        payout: 8_000,
        actions: {
            place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
        },
    },
    {
        scenarioName: 'Family Feud',
        payout: 20_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'Fan the Flames',
        payout: 33_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.LIGHTER,  qty: 1 }],
            place:  [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
        },
    },

    {
        scenarioName: 'Fight Fire With Fire',
        payout: 81_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.LIGHTER,  qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
        },
    },

    {
        scenarioName: 'Final Cut',
        payout: 150_000,
        actions: {
            place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }],
        },
    },

    {
        scenarioName: 'Final Markdown',
        payout: 49_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'Fire and Brimstone',
        payout: 125_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.LIGHTER,  qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
        },
    },

    {
        scenarioName: 'Fire Burn and Cauldron Bubble',
        payout: 170_000,
        actions: {
            place: [{ resourceId: RESOURCE.GASOLINE, qty: 5 }],
        },
    },
    {
        scenarioName: 'Fire Burn and Cauldron Bubble',
        payout: 170_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 4 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'Fire in the Belly',
        payout: 17_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'Fire Kills 99.9% of Bacteria',
        payout: 305_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.LIGHTER,  qty: 1 }],
            place:  [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
        },
    },

    {
        scenarioName: 'Fire Sale',
        payout: 10_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.LIGHTER,  qty: 1 }],
            place:  [{ resourceId: RESOURCE.KEROSENE, qty: 1 }],
        },
    },

    {
        scenarioName: 'Follow the Leader',
        payout: 69_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'For Closure',
        payout: 22_000,
        actions: {
            place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
        },
    },
    {
        scenarioName: 'For Closure',
        payout: 16_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'Foul Play',
        payout: 120_000,
        actions: {
            place: [{ resourceId: RESOURCE.GASOLINE, qty: 5 }],
        },
    },
    {
        scenarioName: 'Foul Play',
        payout: 120_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 4 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'From the Ashes',
        payout: 120_000,
        actions: {
            place: [{ resourceId: RESOURCE.GASOLINE, qty: 5 }],
        },
    },

    {
        scenarioName: 'Gay Frogs',
        payout: 41_000,
        actions: {
            place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }],
        },
    },
    {
        scenarioName: 'Gay Frogs',
        payout: 34_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'Get Wrecked',
        payout: 90_000,
        actions: {
            place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }],
        },
    },
    {
        scenarioName: 'Get Wrecked',
        payout: 84_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'Green With Envy',
        payout: 120_000,
        actions: {
            place: [{ resourceId: RESOURCE.GASOLINE, qty: 6 }],
        },
    },

    {
        scenarioName: "Gym'll Fix It",
        payout: 62_000,
        actions: {
            place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }],
        },
    },
    {
        scenarioName: "Gym'll Fix It",
        payout: 52_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'Hair Today...',
        payout: 93_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.LIGHTER,  qty: 1 }],
            place:  [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
            stoke:  [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
        },
    },

    {
        scenarioName: 'Heat the Rich',
        payout: 34_000,
        actions: {
            place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
        },
    },
    {
        scenarioName: 'Heat the Rich',
        payout: 40_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'Hide and Seek',
        payout: 33_000,
        actions: {
            place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }],
        },
    },
    {
        scenarioName: 'Hide and Seek',
        payout: 33_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'High Time',
        payout: 4_300,
        actions: {
            place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
        },
    },
    {
        scenarioName: 'High Time',
        payout: 10_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'Hire and Fire',
        payout: 49_000,
        actions: {
            place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
        },
    },
    {
        scenarioName: 'Hire and Fire',
        payout: 57_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'Hold Fire',
        payout: 110_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.LIGHTER,  qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
        },
    },

    {
        scenarioName: 'Holy Smokes',
        payout: 56_500,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'Home and Dry',
        payout: 35_000,
        actions: {
            place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
        },
    },
    {
        scenarioName: 'Home and Dry',
        payout: 49_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'Hostile Takeover',
        payout: 300_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'Hot Dinners',
        payout: 55_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.DIESEL, qty: 1 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'Hot Dog',
        payout: 38_000,
        actions: {
            place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
        },
    },
    {
        scenarioName: 'Hot Dog',
        payout: 30_500,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'Hot Gossip',
        payout: 62_000,
        actions: {
            place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
        },
    },
    {
        scenarioName: 'Hot Gossip',
        payout: 62_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'Hot Off the Press',
        payout: 18_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'Hot on the Trail',
        payout: 390_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.LIGHTER,  qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
        },
    },

    {
        scenarioName: 'Hot out of the Gate',
        payout: 53_000,
        actions: {
            evidence: [{ resourceId: RESOURCE.GOLD_TOOTH, qty: 1 }],
            place:    [{ resourceId: RESOURCE.GASOLINE,   qty: 2 }],
        },
    },

    {
        scenarioName: 'Hot Profit',
        payout: 84_000,
        actions: {
            place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }],
        },
    },
    {
        scenarioName: 'Hot Profit',
        payout: 57_500,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'Hot Trend',
        payout: 54_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.LIGHTER,  qty: 1 }],
            place:  [{ resourceId: RESOURCE.KEROSENE, qty: 1 }],
        },
    },

    {
        scenarioName: 'House Edge',
        payout: 190_000,
        actions: {
            place: [{ resourceId: RESOURCE.GASOLINE, qty: 5 }],
        },
    },
    {
        scenarioName: 'House Edge',
        payout: 135_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'House of Cards',
        payout: 610_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.LIGHTER,  qty: 1 }],
            place:  [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
            stoke:  [{ resourceId: RESOURCE.HYDROGEN, qty: 2 }],
        },
    },

    {
        scenarioName: 'In Your Debt',
        payout: 33_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.LIGHTER,  qty: 1 }],
            place:  [{ resourceId: RESOURCE.KEROSENE, qty: 1 }],
        },
    },

    {
        scenarioName: 'Insert Coin to Continue',
        payout: 120_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.LIGHTER,  qty: 1 }],
            place:  [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
            stoke:  [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
        },
    },

    {
        scenarioName: "It Cuts Both Ways",
        payout: 19_000,
        actions: {
            place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
        },
    },
    {
        scenarioName: "It Cuts Both Ways",
        payout: 20_500,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: "It's a Write Off",
        payout: 225_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.LIGHTER,  qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
        },
    },

    {
        scenarioName: "It's Not All White",
        payout: 140_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
            stoke:  [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'Kindling Spirits',
        payout: 64_000,
        actions: {
            place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }],
        },
    },

    {
        scenarioName: 'Landmark Decision',
        payout: 280_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 5 }],
        },
        requiresFlamethrower: true,
        needsVerification: true,
    },

    {
        scenarioName: 'Last Lyft Home',
        payout: 52_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'Letter of the Law',
        payout: 1_000,
        actions: {
            place: [{ resourceId: RESOURCE.KEROSENE, qty: 1 }],
        },
    },

    {
        scenarioName: 'Light Fingered',
        payout: 165_000,
        actions: {
            place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }],
        },
    },
    {
        scenarioName: 'Light Fingered',
        payout: 165_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'Like for Like',
        payout: 110_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.LIGHTER,  qty: 1 }],
            place:  [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
            stoke:  [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
        },
    },

    {
        scenarioName: 'Liquor on the Back Row',
        payout: 37_000,
        actions: {
            place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
        },
    },
    {
        scenarioName: 'Liquor on the Back Row',
        payout: 50_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'Local Concerns',
        payout: 20_000,
        actions: {
            place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
        },
    },
    {
        scenarioName: 'Local Concerns',
        payout: 30_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'Long Pig',
        payout: 130_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.LIGHTER,  qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
        },
    },

    {
        scenarioName: 'Loud and Clear',
        payout: 195_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.LIGHTER,  qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
        },
    },

    {
        scenarioName: "Lover's Quarrel",
        payout: 39_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'Low Rent',
        payout: 120_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.LIGHTER,  qty: 1 }],
            place:  [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
            stoke:  [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
        },
    },

    {
        scenarioName: 'Make a Killing',
        payout: 260_000,
        actions: {
            place: [
                { resourceId: RESOURCE.GASOLINE, qty: 1 },
                { resourceId: RESOURCE.KEROSENE, qty: 2 },
            ],
        },
    },
    {
        scenarioName: 'Make a Killing',
        payout: 390_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [
                { resourceId: RESOURCE.GASOLINE, qty: 1 },
                { resourceId: RESOURCE.KEROSENE, qty: 2 },
            ],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'Mallrats',
        payout: 410_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 4 }],
            stoke:  [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'Marked for Salvation',
        payout: 30_000,
        actions: {
            place: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
        },
    },
    {
        scenarioName: 'Marked for Salvation',
        payout: 80_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.KEROSENE, qty: 1 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'Marx & Sparks',
        payout: 140_000,
        actions: {
            place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }],
        },
    },
    {
        scenarioName: 'Marx & Sparks',
        payout: 125_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'Medium Rare',
        payout: 330_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.DIESEL,  qty: 4 }],
        },
    },

    {
        scenarioName: 'Mental Block',
        payout: 580_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [
                { resourceId: RESOURCE.GASOLINE, qty: 5 },
                { resourceId: RESOURCE.THERMITE, qty: 1 },
            ],
        },
        requiresFlamethrower: true,
        needsVerification: true,
    },

    {
        scenarioName: 'Milk Milk, Lemonade',
        payout: 155_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.LIGHTER,  qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
        },
    },

    {
        scenarioName: 'Naked Aggression',
        payout: 31_500,
        actions: {
            place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }],
        },
    },
    {
        scenarioName: 'Naked Aggression',
        payout: 31_500,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
            stoke:  [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'Needles to Say',
        payout: 23_000,
        actions: {
            place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
        },
    },

    {
        scenarioName: 'Not a Leg to Stand on',
        payout: 150_000,
        actions: {
            place: [{ resourceId: RESOURCE.GASOLINE, qty: 6 }],
        },
    },
    {
        scenarioName: 'Not a Leg to Stand on',
        payout: 125_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'Off the Market',
        payout: 30_000,
        actions: {
            place: [{ resourceId: RESOURCE.KEROSENE, qty: 1 }],
        },
    },

    {
        scenarioName: 'Oh God, Yes',
        payout: 17_500,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'On Fire at the Box Office',
        payout: 10_000,
        actions: {
            place: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
        },
    },
    {
        scenarioName: 'On Fire at the Box Office',
        payout: 14_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'Open House',
        payout: 64_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.LIGHTER,  qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
        },
    },

    {
        scenarioName: 'Out in the Wash',
        payout: 235_000,
        actions: {
            place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
        },
    },
    {
        scenarioName: 'Out in the Wash',
        payout: 235_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'Out with a Bang',
        payout: 42_000,
        actions: {
            ignite:  [{ resourceId: RESOURCE.LIGHTER,  qty: 1 }],
            place:   [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
            dampen:  [{ resourceId: RESOURCE.BLANKET,  qty: 1 }],
        },
    },

    {
        scenarioName: 'Pest Control',
        payout: 16_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.LIGHTER,  qty: 1 }],
            place:  [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
        },
    },

    {
        scenarioName: 'Piggy in the Middle',
        payout: 73_000,
        actions: {
            place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
        },
    },
    {
        scenarioName: 'Piggy in the Middle',
        payout: 104_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'Playing With Fire',
        payout: 210_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.LIGHTER,  qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
        },
    },

    {
        scenarioName: 'Point of No Return',
        payout: 90_000,
        actions: {
            place: [
                { resourceId: RESOURCE.GASOLINE, qty: 1 },
                { resourceId: RESOURCE.THERMITE, qty: 1 },
            ],
            stoke: [{ resourceId: RESOURCE.MAGNESIUM, qty: 2 }],
        },
        needsVerification: true,
    },

    {
        scenarioName: 'Political Firestorm',
        payout: 22_000,
        actions: {
            place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
        },
    },
    {
        scenarioName: 'Political Firestorm',
        payout: 40_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'Pyro for Pornos',
        payout: 65_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'Raising Hell',
        payout: 170_000,
        actions: {
            place: [{ resourceId: RESOURCE.GASOLINE, qty: 6 }],
        },
    },
    {
        scenarioName: 'Raising Hell',
        payout: 170_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
            stoke:  [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'Raze the Roof',
        payout: 90_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.LIGHTER,  qty: 1 }],
            place:  [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
            stoke:  [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
        },
    },

    {
        scenarioName: 'Read the Room',
        payout: 125_000,
        actions: {
            place: [{ resourceId: RESOURCE.GASOLINE, qty: 5 }],
        },
    },
    {
        scenarioName: 'Read the Room',
        payout: 125_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 4 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'Remote Possibility',
        payout: 102_500,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'Rest in Peace',
        payout: 20_500,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'Ring of Fire',
        payout: 160_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.LIGHTER,  qty: 1 }],
            place:  [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
            stoke:  [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
        },
    },

    {
        scenarioName: 'Risky Business',
        payout: 50_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.LIGHTER,  qty: 1 }],
            place:  [{ resourceId: RESOURCE.KEROSENE, qty: 1 }],
        },
    },

    {
        scenarioName: 'Rock the Boat',
        payout: 325_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.DIESEL,  qty: 1 }],
        },
    },

    {
        scenarioName: 'Searing Irony',
        payout: 240_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 4 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'Second Hand Smoke',
        payout: 37_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.LIGHTER,  qty: 1 }],
            place:  [{ resourceId: RESOURCE.KEROSENE, qty: 1 }],
        },
    },

    {
        scenarioName: 'See No Evil',
        payout: 52_000,
        actions: {
            place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
        },
    },
    {
        scenarioName: 'See No Evil',
        payout: 71_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: "Set 'Em Straight",
        payout: 310_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.LIGHTER,  qty: 1 }],
            place:  [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
            stoke:  [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
        },
    },

    {
        scenarioName: 'Shaky Investment',
        payout: 80_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'Shielded from the Truth',
        payout: 8_900,
        actions: {
            place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
        },
    },
    {
        scenarioName: 'Shielded from the Truth',
        payout: 16_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'Short Shelf Life',
        payout: 395_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'Smoke on the Water',
        payout: 4_200,
        actions: {
            place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
        },
    },
    {
        scenarioName: 'Smoke on the Water',
        payout: 8_600,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'Smoke Out',
        payout: 10_000,
        actions: {
            evidence: [{ resourceId: RESOURCE.CANNABIS, qty: 1 }],
            place:    [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
        },
    },
    {
        scenarioName: 'Smoke Out',
        payout: 21_000,
        actions: {
            evidence: [{ resourceId: RESOURCE.CANNABIS,     qty: 1 }],
            ignite:   [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:    [{ resourceId: RESOURCE.GASOLINE,     qty: 1 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'Smoke Signals',
        payout: 120_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [
                { resourceId: RESOURCE.DIESEL,    qty: 2 },
                { resourceId: RESOURCE.MAGNESIUM, qty: 1 },
            ],
        },
        requiresFlamethrower: true,
        needsVerification: true,
    },

    {
        scenarioName: 'Smoke Screen',
        payout: 535_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
        },
        requiresFlamethrower: true,
        needsVerification: true,
    },

    {
        scenarioName: 'Smoke Without Fire',
        payout: 200_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.LIGHTER,  qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
        },
    },

    {
        scenarioName: 'Smoldering Resentment',
        payout: 10_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'Sofa King Cheap',
        payout: 120_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.LIGHTER,  qty: 1 }],
            place:  [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
            stoke:  [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
        },
    },

    {
        scenarioName: 'Specter of Destruction',
        payout: 74_000,
        actions: {
            evidence: [{ resourceId: RESOURCE.ELEPHANT_STATUE, qty: 1 }],
            place:    [{ resourceId: RESOURCE.GASOLINE,         qty: 1 }],
        },
        needsVerification: true,
    },

    {
        scenarioName: 'Spirit Level',
        payout: 280_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'Stick to the Script',
        payout: 160_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.LIGHTER,  qty: 1 }],
            place:  [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
            stoke:  [{ resourceId: RESOURCE.HYDROGEN, qty: 2 }],
        },
    },

    {
        scenarioName: 'Stink to High Heaven',
        payout: 41_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.LIGHTER,  qty: 1 }],
            place:  [{ resourceId: RESOURCE.KEROSENE, qty: 1 }],
        },
    },

    {
        scenarioName: 'Strike While it\'s Hot',
        payout: 265_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.LIGHTER,  qty: 1 }],
            place:  [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
            stoke:  [{ resourceId: RESOURCE.HYDROGEN, qty: 2 }],
        },
    },

    {
        scenarioName: 'Stroke of Fortune',
        payout: 120_000,
        actions: {
            place: [{ resourceId: RESOURCE.GASOLINE, qty: 6 }],
        },
    },
    {
        scenarioName: 'Stroke of Fortune',
        payout: 120_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
            stoke:  [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'Supermarket Sweep',
        payout: 265_000,
        actions: {
            place: [{ resourceId: RESOURCE.GASOLINE, qty: 5 }],
            stoke: [{ resourceId: RESOURCE.LIGHTER,  qty: 1 }],
        },
    },
    {
        scenarioName: 'Supermarket Sweep',
        payout: 265_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 5 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'Swansong',
        payout: 27_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.LIGHTER,  qty: 1 }],
            place:  [{ resourceId: RESOURCE.KEROSENE, qty: 1 }],
        },
    },

    {
        scenarioName: 'Taking out the Trash',
        payout: 110_000,
        actions: {
            evidence: [{ resourceId: RESOURCE.HARD_DRIVE,   qty: 1 }],
            ignite:   [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:    [{ resourceId: RESOURCE.GASOLINE,     qty: 3 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'That Place Is History',
        payout: 90_000,
        actions: {
            place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }],
        },
    },
    {
        scenarioName: 'That Place Is History',
        payout: 118_500,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'The Ashes of Empire',
        payout: 175_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.LIGHTER,  qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
        },
    },

    {
        scenarioName: 'The Bad Samaritan',
        payout: 22_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
            stoke:  [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'The Declaration of Inebrience',
        payout: 115_000,
        actions: {
            place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
        },
    },
    {
        scenarioName: 'The Declaration of Inebrience',
        payout: 115_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'The Empyre Strikes Back',
        payout: 49_000,
        actions: {
            place: [{ resourceId: RESOURCE.GASOLINE, qty: 5 }],
        },
    },
    {
        scenarioName: 'The Empyre Strikes Back',
        payout: 49_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'The Fat is in the Fire',
        payout: 300_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 5 }],
            stoke:  [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'The Fire Chief',
        payout: 130_000,
        actions: {
            place: [{ resourceId: RESOURCE.GASOLINE, qty: 6 }],
        },
    },
    {
        scenarioName: 'The Fire Chief',
        payout: 140_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
            stoke:  [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'The Fried Piper',
        payout: 270_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.LIGHTER,  qty: 1 }],
            place:  [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
        },
    },

    {
        scenarioName: "The Grass Ain't Greener",
        payout: 85_000,
        actions: {
            place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }],
            stoke: [{ resourceId: RESOURCE.DIESEL,   qty: 1 }],
        },
    },
    {
        scenarioName: "The Grass Ain't Greener",
        payout: 85_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 4 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'The Male Gaze',
        payout: 130_000,
        actions: {
            place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }],
        },
    },
    {
        scenarioName: 'The Male Gaze',
        payout: 110_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'The Midnight Oil',
        payout: 63_000,
        actions: {
            place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }],
        },
    },
    {
        scenarioName: 'The Midnight Oil',
        payout: 75_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'The Plane Truth',
        payout: 38_000,
        actions: {
            place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
        },
    },
    {
        scenarioName: 'The Plane Truth',
        payout: 25_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'The Savage Beast',
        payout: 170_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.LIGHTER,  qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
        },
    },

    {
        scenarioName: 'The Smoking Gun',
        payout: 470_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.LIGHTER,  qty: 1 }],
            place:  [{ resourceId: RESOURCE.KEROSENE, qty: 4 }],
        },
    },

    {
        scenarioName: 'The Waiting Game',
        payout: 120_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.LIGHTER,  qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
        },
    },

    {
        scenarioName: 'Third-Degree Burn',
        payout: 25_500,
        actions: {
            place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
        },
    },
    {
        scenarioName: 'Third-Degree Burn',
        payout: 29_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'To the Manor Scorned',
        payout: 75_500,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'Totally Armless',
        payout: 44_000,
        actions: {
            place: [{ resourceId: RESOURCE.KEROSENE, qty: 2 }],
        },
    },
    {
        scenarioName: 'Totally Armless',
        payout: 35_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'Turn up the Heat',
        payout: 90_000,
        actions: {
            evidence: [{ resourceId: RESOURCE.COMPASS,  qty: 1 }],
            place:    [{ resourceId: RESOURCE.GASOLINE, qty: 4 }],
        },
    },
    {
        scenarioName: 'Turn up the Heat',
        payout: 76_000,
        actions: {
            evidence: [{ resourceId: RESOURCE.COMPASS,      qty: 1 }],
            ignite:   [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:    [{ resourceId: RESOURCE.GASOLINE,     qty: 2 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'Twisted Firestarter',
        payout: 32_000,
        actions: {
            place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
        },
    },
    {
        scenarioName: 'Twisted Firestarter',
        payout: 23_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'Uber Heats',
        payout: 78_000,
        actions: {
            place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }],
        },
    },
    {
        scenarioName: 'Uber Heats',
        payout: 59_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'Under the Table',
        payout: 400_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
        },
        requiresFlamethrower: true,
        needsVerification: true,
    },

    {
        scenarioName: 'Unpopular Mechanics',
        payout: 4_500,
        actions: {
            place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
        },
    },
    {
        scenarioName: 'Unpopular Mechanics',
        payout: 8_600,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'Unspilled Beans',
        payout: 220_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.LIGHTER,  qty: 1 }],
            place:  [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
            stoke:  [{ resourceId: RESOURCE.HYDROGEN, qty: 2 }],
        },
    },

    {
        scenarioName: 'Visions of the Savory',
        payout: 70_000,
        actions: {
            evidence: [{ resourceId: RESOURCE.FAMILY_PHOTO, qty: 1 }],
            place:    [{ resourceId: RESOURCE.GASOLINE,     qty: 3 }],
        },
    },
    {
        scenarioName: 'Visions of the Savory',
        payout: 110_000,
        actions: {
            evidence: [{ resourceId: RESOURCE.FAMILY_PHOTO, qty: 1 }],
            ignite:   [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:    [{ resourceId: RESOURCE.GASOLINE,     qty: 3 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'Waist Not, Want Not',
        payout: 210_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 4 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'Wedded to the Lie',
        payout: 81_000,
        actions: {
            place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }],
        },
    },
    {
        scenarioName: 'Wedded to the Lie',
        payout: 69_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'Wet Behind the Ears',
        payout: 240_000,
        actions: {
            place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
        },
    },
    {
        scenarioName: 'Wet Behind the Ears',
        payout: 200_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: "Where There's a Will",
        payout: 23_000,
        actions: {
            place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
        },
    },
    {
        scenarioName: "Where There's a Will",
        payout: 52_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'Whiskey Business',
        payout: 90_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.LIGHTER,  qty: 1 }],
            place:  [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
            stoke:  [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
        },
    },

    {
        scenarioName: 'Wired for War',
        payout: 430_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 8 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'Womb With a View',
        payout: 95_000,
        actions: {
            place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }],
        },
    },
    {
        scenarioName: 'Womb With a View',
        payout: 78_500,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: 'Workplace Burnout',
        payout: 100_000,
        actions: {
            place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }],
        },
    },
    {
        scenarioName: 'Workplace Burnout',
        payout: 73_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
        },
        requiresFlamethrower: true,
    },

    {
        scenarioName: "You're Fired!",
        payout: 150_000,
        actions: {
            evidence: [{ resourceId: RESOURCE.LIPSTICK, qty: 1 }],
            place:    [{ resourceId: RESOURCE.GASOLINE, qty: 4 }],
        },
        needsVerification: true,
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
