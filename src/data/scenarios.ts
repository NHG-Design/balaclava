import { RESOURCE, type ResourceId } from './catalog.js';

export interface ActionItem {
    resourceId: ResourceId;
    qty: number;
    /** Optional items are excluded from base cost/nerve; shown in tooltip with context. */
    optional?: boolean;
    optionalLabel?: string;
}

export interface ScenarioActions {
    evidence?: ActionItem[];
    ignite?: ActionItem[];
    place: ActionItem[];
    stoke?: ActionItem[];
    /** When to stoke relative to ignition: immediately after ("early") or closer to target burn % ("late"). */
    stokeTime?: 'early' | 'late';
    dampen?: ActionItem[];
    /** When to dampen relative to ignition: immediately after ("early") or closer to target burn % ("late"). */
    dampenTime?: 'early' | 'late';
}

export interface Scenario {
    /** Exact scenario name as it appears on the Torn Arson crimes page. */
    scenarioName: string;
    /** Base listed payout in Torn dollars (ignoring ±10% variance). */
    payout: number;
    actions: ScenarioActions;
    notes?: string;
    /**
     * Marked when recipe details are uncertain.
     * Excluded from profit ranking; tooltip shows an unconfirmed indicator.
     */
    needsVerification?: boolean;
}

export const SCENARIOS: Scenario[] = [
    {
        scenarioName: 'A Black Mark',
        payout: 180_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE,     qty: 1 }],
        },
    },

    {
        scenarioName: 'Burning Ambition',
        payout: 46_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE,     qty: 2 }],
        },
    },
    {
        scenarioName: 'Burning Calories',
        payout: 100_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE,     qty: 4 }],
        },
    },

    {
        scenarioName: 'Child\'s Play',
        payout: 23_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE,     qty: 1 }],
        },
    },

    {
        scenarioName: 'Cooked and Burned',
        payout: 73_000,
        actions: {
            evidence: [{ resourceId: RESOURCE.AMMONIA,    qty: 1 }],
            ignite:   [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:    [{ resourceId: RESOURCE.GASOLINE,   qty: 2 }],
        },
    },

    {
        scenarioName: 'Final Cut',
        payout: 150_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE,     qty: 4 }],
        },
    },

    {
        scenarioName: 'From the Ashes',
        payout: 170_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE,     qty: 4 }],
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
    },

    {
        scenarioName: 'Green With Envy',
        payout: 120_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE,     qty: 4 }],
        },
    },

    {
        scenarioName: 'Hot Pursuit',
        payout: 50_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE,     qty: 2 }],
        },
    },

    {
        scenarioName: 'Kindling Spirits',
        payout: 92_500,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE,     qty: 4 }],
        },
    },

    {
        scenarioName: 'Needles to Say',
        payout: 39_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE,     qty: 1 }],
        },
    },

    {
        scenarioName: 'Off the Market',
        payout: 155_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.HYDROGEN,     qty: 1 }],
            stoke:  [{ resourceId: RESOURCE.HYDROGEN,     qty: 1 }],
        },
    },

    {
        scenarioName: 'Old School',
        payout: 62_500,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE,     qty: 3 }],
        },
    },

    {
        scenarioName: 'One Rotten Apple',
        payout: 180_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE,     qty: 2 }],
        },
    },

    {
        scenarioName: 'Party Pooper',
        payout: 62_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE,     qty: 2 }],
        },
    },

    {
        scenarioName: 'Raze the Steaks',
        payout: 250_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE,     qty: 5 }],
        },
    },

    {
        scenarioName: 'Burn the Deck',
        payout: 96_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE,     qty: 3 }],
        },
    },

    {
        scenarioName: 'Boom Industry',
        payout: 100_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE,     qty: 3 }],
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
    },

    {
        scenarioName: 'Burn Rubber',
        payout: 67_000,
        actions: {
            evidence: [{ resourceId: RESOURCE.MAYAN_STATUE, qty: 1 }],
            ignite:   [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:    [{ resourceId: RESOURCE.GASOLINE,     qty: 2 }],
        },
    },

    {
        scenarioName: 'Hot out of the Gate',
        payout: 96_000,
        actions: {
            evidence: [{ resourceId: RESOURCE.GOLD_TOOTH,   qty: 1 }],
            ignite:   [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:    [{ resourceId: RESOURCE.GASOLINE,     qty: 2 }],
        },
    },

    {
        scenarioName: 'Bald Faced Destruction',
        payout: 245_000,
        actions: {
            evidence: [{ resourceId: RESOURCE.RAW_IVORY,    qty: 1 }],
            ignite:   [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:    [{ resourceId: RESOURCE.GASOLINE,     qty: 3 }],
        },
    },

    {
        scenarioName: 'Blaze of Glory',
        payout: 200_000,
        actions: {
            evidence: [{ resourceId: RESOURCE.TOOTHBRUSH,   qty: 1 }],
            ignite:   [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:    [{ resourceId: RESOURCE.GASOLINE,     qty: 2 }],
            stoke:    [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        },
    },

    {
        scenarioName: 'A Treat for the Tricked',
        payout: 71_000,
        actions: {
            evidence: [{ resourceId: RESOURCE.KABUKI_MASK,  qty: 1 }],
            ignite:   [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:    [{ resourceId: RESOURCE.GASOLINE,     qty: 1 }],
        },
    },

    {
        scenarioName: 'Muscling In',
        payout: 90_500,
        actions: {
            evidence: [{ resourceId: RESOURCE.SYRINGE,      qty: 1 }],
            ignite:   [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:    [{ resourceId: RESOURCE.GASOLINE,     qty: 2 }],
        },
    },

    {
        scenarioName: 'Banking on It',
        payout: 200_000,
        actions: {
            evidence: [{ resourceId: RESOURCE.STAPLER,      qty: 1 }],
            ignite:   [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:    [{ resourceId: RESOURCE.GASOLINE,     qty: 3 }],
        },
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
    },

    {
        scenarioName: 'Cache and Burn',
        payout: 560_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.KEROSENE,     qty: 4 }],
        },
    },

    {
        scenarioName: 'Lock, Stock, and Barrel',
        payout: 210_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.HYDROGEN,     qty: 1 }],
            stoke:  [{ resourceId: RESOURCE.HYDROGEN,     qty: 1 }],
        },
    },

    {
        scenarioName: 'Letter of the Law',
        payout: 410_000,
        actions: {
            ignite: [
                { resourceId: RESOURCE.FLAMETHROWER, qty: 1 },
            ],
            place: [
                { resourceId: RESOURCE.HYDROGEN, qty: 1 },
            ],
            stoke: [
                { resourceId: RESOURCE.HYDROGEN, qty: 2 },
            ],
        },
    },

    {
        scenarioName: 'Gentrifried',
        payout: 230_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER,    qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE,        qty: 2 }],
            stoke:  [{ resourceId: RESOURCE.POTASSIUM_NITRATE, qty: 2 }],
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
    },

    {
        scenarioName: 'A Dirty Job',
        payout: 32_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
        },
    },

    {
        scenarioName: 'A Fungus Among Us',
        payout: 34_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
        },
    },

    {
        scenarioName: 'A Hot Lead',
        payout: 22_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
        },
    },

    {
        scenarioName: "A Mug's Game",
        payout: 55_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
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
        payout: 56_000,
        actions: {
            evidence: [{ resourceId: RESOURCE.DIAMOND_RING, qty: 1 }],
            ignite:   [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:    [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
        },
    },

    {
        scenarioName: 'Always Read the Label',
        payout: 170_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 5 }],
            stoke:  [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        },
    },

    {
        scenarioName: 'Anon Starter',
        payout: 31_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
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
    },

    {
        scenarioName: 'Ash or Credit?',
        payout: 180_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
            stoke:  [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
        },
    },

    {
        scenarioName: 'Ashes to Ancestors',
        payout: 90_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 5 }],
        },
    },

    {
        scenarioName: 'Back, Sack, and Crack',
        payout: 300_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.HYDROGEN, qty: 2 }],
        },
    },

    {
        scenarioName: 'Baewatch',
        payout: 13_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
        },
    },

    {
        scenarioName: 'Bagged and Tagged',
        payout: 1_600,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
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
    },

    {
        scenarioName: 'Beach Bum',
        payout: 19_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
        },
    },

    {
        scenarioName: 'Beat the Odds',
        payout: 330_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 4 }],
        },
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
    },

    {
        scenarioName: 'Beyond Repair',
        payout: 93_500,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 4 }],
            stoke:  [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        },
        needsVerification: true,
    },

    {
        scenarioName: 'Body of Evidence',
        payout: 105_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 5 }],
        },
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
        payout: 100_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
        },
    },

    {
        scenarioName: 'Burn Notice',
        payout: 175_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 5 }],
        },
        needsVerification: true,
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
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
        },
    },

    {
        scenarioName: 'Burning Through Cash',
        payout: 105_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
        },
    },

    {
        scenarioName: 'Burnt Ends',
        payout: 180_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 4 }],
        },
        needsVerification: true,
    },

    {
        scenarioName: 'Burn up the Dancefloor',
        payout: 175_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
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
    },

    {
        scenarioName: 'Carrying a Torch',
        payout: 44_500,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
        },
    },

    {
        scenarioName: 'Chance of Redemption',
        payout: 59_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
        },
    },

    {
        scenarioName: 'Charcoal Sketch',
        payout: 39_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
        },
    },

    {
        scenarioName: 'Chasing Targets',
        payout: 24_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
        },
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
    },

    {
        scenarioName: 'Clean Sweep',
        payout: 150_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 4 }],
            stoke:  [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        },
    },

    {
        scenarioName: 'Cleansed Through Fire',
        payout: 46_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.DIESEL, qty: 1 }],
        },
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
        payout: 90_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.LIGHTER,  qty: 1 }],
            place:  [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
            stoke:  [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
            stokeTime: 'early',
        }
    },

    {
        scenarioName: 'Cold Feet',
        payout: 120_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 5 }],
            stoke:  [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        },
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
        scenarioName: 'Cooking the Books',
        payout: 25_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
        },
    },

    {
        scenarioName: 'Cop Some Heat',
        payout: 19_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
        },
    },

    {
        scenarioName: 'Crafty Devil',
        payout: 106_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.LIGHTER,  qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
        },
    },

    {
        scenarioName: 'Crisp Bills',
        payout: 39_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
        },
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
        payout: 44_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
        },
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
        payout: 130_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER,    qty: 1 }],
            place:  [{ resourceId: RESOURCE.DIESEL,           qty: 1 }],
            stoke:  [{ resourceId: RESOURCE.POTASSIUM_NITRATE, qty: 1 }],
        },
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
        payout: 32_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
        },
    },

    {
        scenarioName: 'Eight Lives',
        payout: 6_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
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
    },

    {
        scenarioName: 'End of the Line',
        payout: 78_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
        },
    },

    {
        scenarioName: 'Faction Fiction',
        payout: 64_500,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
        },
    },

    {
        scenarioName: 'Family Feud',
        payout: 20_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
        },
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
        scenarioName: 'Final Markdown',
        payout: 49_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
        },
    },
    {
        scenarioName: 'Fire and Brimstone',
        payout: 140_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.LIGHTER,  qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
        },
    },
    {
        scenarioName: 'Fire Burn and Cauldron Bubble',
        payout: 180_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 4 }],
        },
    },
    {
        scenarioName: 'Fire in the Belly',
        payout: 17_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
        },
    },
    {
        scenarioName: 'Fire Kills 99.9% of Bacteria',
        payout: 310_000,
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
    },
    {
        scenarioName: 'For Closure',
        payout: 16_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
        },
    },
    {
        scenarioName: 'Foul Play',
        payout: 120_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 4 }],
        },
    },
    {
        scenarioName: 'Gay Frogs',
        payout: 34_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
        },
    },
    {
        scenarioName: 'Get Wrecked',
        payout: 84_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
        },
    },
    {
        scenarioName: "Gym'll Fix It",
        payout: 52_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
        },
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
        payout: 40_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
        },
    },

    {
        scenarioName: 'Hide and Seek',
        payout: 33_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
        },
    },

    {
        scenarioName: 'High Time',
        payout: 10_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
        },
    },

    {
        scenarioName: 'Hire and Fire',
        payout: 57_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
        },
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
    },

    {
        scenarioName: 'Home and Dry',
        payout: 49_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
        },
    },

    {
        scenarioName: 'Hostile Takeover',
        payout: 290_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
        },
    },

    {
        scenarioName: 'Hot Dinners',
        payout: 55_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.DIESEL, qty: 1 }],
        },
    },

    {
        scenarioName: 'Hot Dog',
        payout: 30_500,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
        },
    },

    {
        scenarioName: 'Hot Gossip',
        payout: 62_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
        },
    },

    {
        scenarioName: 'Hot Off the Press',
        payout: 18_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
        },
    },

    {
        scenarioName: 'Hot on the Trail',
        payout: 430_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.LIGHTER,  qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
        },
    },

    {
        scenarioName: 'Hot Profit',
        payout: 57_500,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
        },
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
        payout: 160_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
        },
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
        payout: 20_500,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
        },
    },

    {
        scenarioName: "It's a Write Off",
        payout: 230_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.LIGHTER,  qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
        },
    },

    {
        scenarioName: "It's Not All White",
        payout: 180_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
            stoke:  [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
        },
    },

    {
        scenarioName: 'Landmark Decision',
        payout: 300_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 5 }],
        },
        needsVerification: true,
    },

    {
        scenarioName: 'Last Lyft Home',
        payout: 52_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
        },
    },

    {
        scenarioName: 'Light Fingered',
        payout: 165_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
        },
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
        payout: 50_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
        },
    },

    {
        scenarioName: 'Local Concerns',
        payout: 30_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
        },
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
        payout: 390_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [
                { resourceId: RESOURCE.GASOLINE, qty: 1 },
                { resourceId: RESOURCE.KEROSENE, qty: 2 },
            ],
        },
    },

    {
        scenarioName: 'Mallrats',
        payout: 410_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 4 }],
            stoke:  [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        },
    },

    {
        scenarioName: 'Marked for Salvation',
        payout: 80_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.KEROSENE, qty: 1 }],
        },
    },

    {
        scenarioName: 'Marx & Sparks',
        payout: 125_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
        },
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
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
            stoke:  [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        },
    },

    {
        scenarioName: 'Not a Leg to Stand on',
        payout: 125_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
        },
    },

    {
        scenarioName: 'Oh God, Yes',
        payout: 17_500,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
        },
    },

    {
        scenarioName: 'On Fire at the Box Office',
        payout: 14_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
        },
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
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
        },
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
        payout: 104_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
        },
    },

    {
        scenarioName: 'Playing With Fire',
        payout: 200_000,
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
        payout: 40_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
        },
    },

    {
        scenarioName: 'Pyro for Pornos',
        payout: 65_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
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
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 4 }],
        },
    },

    {
        scenarioName: 'Remote Possibility',
        payout: 102_500,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
        },
    },

    {
        scenarioName: 'Rest in Peace',
        payout: 20_500,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
        },
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
        payout: 71_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
        },
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
    },

    {
        scenarioName: 'Shielded from the Truth',
        payout: 16_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
        },
    },

    {
        scenarioName: 'Short Shelf Life',
        payout: 400_000,
        actions: {
            ignite: [
                { resourceId: RESOURCE.FLAMETHROWER, qty: 1 },
            ],
            place: [
                { resourceId: RESOURCE.GASOLINE, qty: 2 },
            ],
        },
    },

    {
        scenarioName: 'Smoke on the Water',
        payout: 8_600,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
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
        needsVerification: true,
    },

    {
        scenarioName: 'Smoke Screen',
        payout: 535_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
        },
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
    },

    {
        scenarioName: 'Stick to the Script',
        payout: 170_000,
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
        payout: 250_000,
        actions: {
            ignite:    [{ resourceId: RESOURCE.LIGHTER,  qty: 1 }],
            place:     [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
            stoke:     [{ resourceId: RESOURCE.HYDROGEN, qty: 2 }],
            stokeTime: 'early',
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
    },

    {
        scenarioName: 'Supermarket Sweep',
        payout: 265_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 5 }],
        },
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
    },

    {
        scenarioName: 'That Place Is History',
        payout: 118_500,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
        },
    },

    {
        scenarioName: 'The Ashes of Empire',
        payout: 190_000,
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
    },

    {
        scenarioName: 'The Declaration of Inebrience',
        payout: 115_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
        },
    },

    {
        scenarioName: 'The Empyre Strikes Back',
        payout: 49_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
        },
    },

    {
        scenarioName: 'The Fat is in the Fire',
        payout: 360_000,
        actions: {
            ignite:   [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:    [{ resourceId: RESOURCE.GASOLINE, qty: 5 }],
            stoke:    [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            stokeTime: 'late',
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
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 4 }],
        },
    },

    {
        scenarioName: 'The Male Gaze',
        payout: 110_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
        },
    },

    {
        scenarioName: 'The Midnight Oil',
        payout: 75_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
        },
    },

    {
        scenarioName: 'The Plane Truth',
        payout: 25_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
        },
    },

    {
        scenarioName: 'The Savage Beast',
        payout: 190_000,
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
        payout: 29_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
        },
    },

    {
        scenarioName: 'To the Manor Scorned',
        payout: 75_500,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
        },
    },

    {
        scenarioName: 'Totally Armless',
        payout: 35_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
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
    },

    {
        scenarioName: 'Twisted Firestarter',
        payout: 23_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
        },
    },

    {
        scenarioName: 'Uber Heats',
        payout: 59_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
        },
    },

    {
        scenarioName: 'Under the Table',
        payout: 400_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
        },
        needsVerification: true,
    },

    {
        scenarioName: 'Unpopular Mechanics',
        payout: 8_600,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
        },
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
        payout: 110_000,
        actions: {
            evidence: [{ resourceId: RESOURCE.FAMILY_PHOTO, qty: 1 }],
            ignite:   [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:    [{ resourceId: RESOURCE.GASOLINE,     qty: 3 }],
        },
    },

    {
        scenarioName: 'Waist Not, Want Not',
        payout: 240_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 4 }],
        },
    },

    {
        scenarioName: 'Wedded to the Lie',
        payout: 69_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
        },
    },

    {
        scenarioName: 'Wet Behind the Ears',
        payout: 200_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
        },
    },

    {
        scenarioName: "Where There's a Will",
        payout: 52_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
        },
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
    },

    {
        scenarioName: 'Womb With a View',
        payout: 78_500,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
        },
    },

    {
        scenarioName: 'Workplace Burnout',
        payout: 73_000,
        actions: {
            ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
            place:  [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
        },
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
