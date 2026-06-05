import { RESOURCE, type ResourceId } from "./catalog.js";

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
  stokeTime?: "early" | "late";
  dampen?: ActionItem[];
  /** When to dampen relative to ignition: immediately after ("early") or closer to target burn % ("late"). */
  dampenTime?: "early" | "late";
}

export interface ObservedPayout {
  min: number;
  max: number;
  runs: number;
}

export interface Scenario {
  /** Exact scenario name as it appears on the Torn Arson crimes page. */
  scenarioName: string;
  /** Base listed payout in Torn dollars (ignoring ±10% variance). */
  payout: number;
  /** Optional observed payout stats from the latest committed audit report. */
  observedPayout?: ObservedPayout;
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
    scenarioName: "A Black Mark",
    payout: 220_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
    },
  },

  {
    scenarioName: "Burning Ambition",
    payout: 130_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
    },
  },
  {
    scenarioName: "Burning Calories",
    payout: 100_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }],
    },
  },

  {
    scenarioName: "Child's Play",
    payout: 43_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
    },
  },

  {
    scenarioName: "Cooked and Burned",
    payout: 79_000,
    actions: {
      evidence: [{ resourceId: RESOURCE.AMMONIA, qty: 1 }],
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
    },
  },

  {
    scenarioName: "Final Cut",
    payout: 180_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
    },
  },

  {
    scenarioName: "From the Ashes",
    payout: 140_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }],
    },
  },

  {
    scenarioName: "Going Viral",
    payout: 180_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
    },
  },

  {
    scenarioName: "Green With Envy",
    payout: 130_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
    },
  },

  {
    scenarioName: "Hot Pursuit",
    payout: 43_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
    },
  },

  {
    scenarioName: "Kindling Spirits",
    payout: 92_500,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }],
    },
  },

  {
    scenarioName: "Needles to Say",
    payout: 45_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
    },
  },

  {
    scenarioName: "Off the Market",
    payout: 210_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }, { resourceId: RESOURCE.KEROSENE, qty: 1 }, { resourceId: RESOURCE.POTASSIUM_NITRATE, qty: 1 }],
    },
  },

  {
    scenarioName: "Old School",
    payout: 77_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }],
    },
  },

  {
    scenarioName: "One Rotten Apple",
    payout: 180_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
    },
  },

  {
    scenarioName: "Party Pooper",
    payout: 62_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
    },
  },

  {
    scenarioName: "Raze the Steaks",
    payout: 260_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 5 }],
    },
  },

  {
    scenarioName: "Burn the Deck",
    payout: 130_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }],
    },
  },

  {
    scenarioName: "Boom Industry",
    payout: 130_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
    },
  },

  {
    scenarioName: "Igniting Curiosity",
    payout: 260_000,
    actions: {
      evidence: [{ resourceId: RESOURCE.SUMO_DOLL, qty: 1 }],
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }],
    },
  },

  {
    scenarioName: "Burn Rubber",
    payout: 82_000,
    actions: {
      evidence: [{ resourceId: RESOURCE.MAYAN_STATUE, qty: 1 }],
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
    },
  },

  {
    scenarioName: "Hot out of the Gate",
    payout: 96_000,
    actions: {
      evidence: [{ resourceId: RESOURCE.GOLD_TOOTH, qty: 1 }],
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
    },
  },

  {
    scenarioName: "Bald Faced Destruction",
    payout: 245_000,
    actions: {
      evidence: [{ resourceId: RESOURCE.RAW_IVORY, qty: 1 }],
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
    },
  },

  {
    scenarioName: "Blaze of Glory",
    payout: 200_000,
    actions: {
      evidence: [{ resourceId: RESOURCE.TOOTHBRUSH, qty: 1 }],
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
      stoke: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
    },
  },

  {
    scenarioName: "A Treat for the Tricked",
    payout: 110_000,
    actions: {
      evidence: [{ resourceId: RESOURCE.KABUKI_MASK, qty: 1 }],
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
    },
  },

  {
    scenarioName: "Muscling In",
    payout: 200_000,
    actions: {
      evidence: [{ resourceId: RESOURCE.SYRINGE, qty: 1 }],
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }, { resourceId: RESOURCE.MAGNESIUM, qty: 1 }],
    },
  },

  {
    scenarioName: "Banking on It",
    payout: 200_000,
    actions: {
      evidence: [{ resourceId: RESOURCE.STAPLER, qty: 1 }],
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
    },
  },

  {
    scenarioName: "Planted",
    payout: 130_000,
    actions: {
      evidence: [{ resourceId: RESOURCE.PELE_CHARM, qty: 1 }],
      ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
    },
  },

  {
    scenarioName: "Flame and Fortune",
    payout: 700_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.KEROSENE, qty: 3 }],
    },
  },

  {
    scenarioName: "Cache and Burn",
    payout: 560_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.KEROSENE, qty: 4 }],
    },
  },

  {
    scenarioName: "Lock, Stock, and Barrel",
    payout: 210_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
      stoke: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
      stokeTime: "early",
    },
  },

  {
    scenarioName: "Letter of the Law",
    payout: 410_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
      stoke: [{ resourceId: RESOURCE.HYDROGEN, qty: 2 }],
      stokeTime: "early",
    },
  },

  {
    scenarioName: "Gentrifried",
    payout: 230_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
      stoke: [{ resourceId: RESOURCE.POTASSIUM_NITRATE, qty: 2 }],
    },
  },
  {
    scenarioName: "A Burnt Child Dreads the Fire",
    payout: 290_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }, { resourceId: RESOURCE.HYDROGEN, qty: 1 }],
      stoke: [{ resourceId: RESOURCE.METHANE, qty: 1 }],
      stokeTime: "late",
    },
  },

  {
    scenarioName: "A Dirty Job",
    payout: 43_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
    },
  },

  {
    scenarioName: "A Fungus Among Us",
    payout: 46_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
    },
  },

  {
    scenarioName: "A Hot Lead",
    payout: 44_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 6 }],
    },
  },

  {
    scenarioName: "A Mug's Game",
    payout: 55_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
    },
  },

  {
    scenarioName: "A Problem Shared",
    payout: 180_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }],
      stoke: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
    },
  },

  {
    scenarioName: "A Rash Decision",
    payout: 17_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
      stoke: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
      stokeTime: "late",
    },
  },

  {
    scenarioName: "All Mouth and Trousers",
    payout: 78_000,
    actions: {
      evidence: [{ resourceId: RESOURCE.DIAMOND_RING, qty: 1 }],
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
    },
  },

  {
    scenarioName: "Always Read the Label",
    payout: 170_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 5 }],
      stoke: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
    },
  },

  {
    scenarioName: "Anon Starter",
    payout: 33_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
    },
  },

  {
    scenarioName: "Apart of the Problem",
    payout: 300_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }],
    },
  },

  {
    scenarioName: "Ash or Credit?",
    payout: 180_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
      stoke: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
      stokeTime: "early",
    },
  },

  {
    scenarioName: "Ashes to Ancestors",
    payout: 90_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 5 }],
    },
  },

  {
    scenarioName: "Back, Sack, and Crack",
    payout: 300_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.HYDROGEN, qty: 2 }],
    },
  },

  {
    scenarioName: "Baewatch",
    payout: 16_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
    },
  },

  {
    scenarioName: "Bagged and Tagged",
    payout: 19_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
    },
  },

  {
    scenarioName: "Bang For Your Buck",
    payout: 50_000,
    actions: {
      evidence: [{ resourceId: RESOURCE.GRENADE, qty: 1 }],
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
    },
  },

  {
    scenarioName: "Beach Bum",
    payout: 19_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
    },
  },

  {
    scenarioName: "Beat the Odds",
    payout: 350_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
    },
  },

  {
    scenarioName: "Beggars Can't be Choosers",
    payout: 510_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }, { resourceId: RESOURCE.THERMITE, qty: 1 }],
      stoke: [{ resourceId: RESOURCE.DIESEL, qty: 1 }, { resourceId: RESOURCE.HYDROGEN, qty: 3 }],
      stokeTime: "late",
    },
  },

  {
    scenarioName: "Beyond Repair",
    payout: 93_500,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }],
      stoke: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
    },
    needsVerification: true,
  },

  {
    scenarioName: "Body of Evidence",
    payout: 120_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }, { resourceId: RESOURCE.MAGNESIUM, qty: 1 }],
    },
  },

  {
    scenarioName: "Bone of Contention",
    payout: 43_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
      dampen: [{ resourceId: RESOURCE.BLANKET, qty: 1 }],
    },
  },

    {
      scenarioName: "Boxing Clever",
      payout: 360_000,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
      },
    },

  {
    scenarioName: "Bright Spark",
    payout: 270_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
      place: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
      stoke: [{ resourceId: RESOURCE.METHANE, qty: 1 }],
      stokeTime: "late",
    },
  },

  {
    scenarioName: "Burn After Screening",
    payout: 120_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }],
    },
  },

  {
    scenarioName: "Burn Notice",
    payout: 180_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }, { resourceId: RESOURCE.THERMITE, qty: 1 }],
    },
  },

  {
    scenarioName: "Burned by Stupidity",
    payout: 32_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
      place: [{ resourceId: RESOURCE.KEROSENE, qty: 1 }],
    },
  },

  {
    scenarioName: "Burned Cookies",
    payout: 81_000,
    actions: {
      place: [
        { resourceId: RESOURCE.DIESEL, qty: 2 },
        { resourceId: RESOURCE.MAGNESIUM, qty: 2 },
      ],
      stoke: [{ resourceId: RESOURCE.DIESEL, qty: 1 }],
    },
    needsVerification: true,
  },

  {
    scenarioName: "Burning Liability",
    payout: 160_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
      place: [{ resourceId: RESOURCE.HYDROGEN, qty: 2 }],
      stoke: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
      stokeTime: "late",
    },
  },

  {
    scenarioName: "Burning Memory",
    payout: 40_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
    },
  },

  {
    scenarioName: "Burning Through Cash",
    payout: 120_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
    },
  },

  {
    scenarioName: "Burnt Ends",
    payout: 190_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 5 }],
    },
  },

  {
    scenarioName: "Burn up the Dancefloor",
    payout: 175_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
    },
  },

  {
    scenarioName: "Camera Tricks",
    payout: 120_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
      stoke: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
      stokeTime: "late",
    },
  },

  {
    scenarioName: "Carrying a Torch",
    payout: 90_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }],
    },
  },

  {
    scenarioName: "Chance of Redemption",
    payout: 82_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
    },
  },

  {
    scenarioName: "Charcoal Sketch",
    payout: 68_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
    },
  },

  {
    scenarioName: "Chasing Targets",
    payout: 37_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
    },
  },

  {
    scenarioName: "Checking Out",
    payout: 360_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }, { resourceId: RESOURCE.HYDROGEN, qty: 1 }],
      stoke: [{ resourceId: RESOURCE.METHANE, qty: 1 }],
      stokeTime: "late",
    },
  },

  {
    scenarioName: "Claim to Flame",
    payout: 43_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
    },
  },

  {
    scenarioName: "Clean Sweep",
    payout: 150_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }],
      stoke: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
    },
  },

  {
    scenarioName: "Cleansed Through Fire",
    payout: 230_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.DIESEL, qty: 2 }, { resourceId: RESOURCE.MAGNESIUM, qty: 1 }],
    },
  },

  {
    scenarioName: "Clinical Exposure",
    payout: 180_000,
    actions: {
      evidence: [{ resourceId: RESOURCE.OPIUM, qty: 1 }],
      ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
    },
  },

  {
    scenarioName: "Cold Brew Reality",
    payout: 140_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
      place: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
      stoke: [{ resourceId: RESOURCE.HYDROGEN, qty: 2 }],
      stokeTime: "late",
    },
  },

  {
    scenarioName: "Cold Feet",
    payout: 120_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }, { resourceId: RESOURCE.POTASSIUM_NITRATE, qty: 1 }],
      stoke: [{ resourceId: RESOURCE.DIESEL, qty: 1 }],
      stokeTime: "late",
    },
  },

  {
    scenarioName: "Cook it Rare",
    payout: 330_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
      place: [{ resourceId: RESOURCE.KEROSENE, qty: 3 }],
    },
  },

  {
    scenarioName: "Cooking the Books",
    payout: 38_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
    },
  },

  {
    scenarioName: "Cop Some Heat",
    payout: 63_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
    },
  },

  {
    scenarioName: "Crafty Devil",
    payout: 106_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
    },
  },

  {
    scenarioName: "Crisp Bills",
    payout: 52_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
    },
  },

  {
    scenarioName: "Curtain Call",
    payout: 79_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
    },
  },

  {
    scenarioName: "Cut Corners",
    payout: 230_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }, { resourceId: RESOURCE.HYDROGEN, qty: 1 }, { resourceId: RESOURCE.OXYGEN, qty: 1 }],
    },
  },

  {
    scenarioName: "Daddy's Girl",
    payout: 330_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
      place: [{ resourceId: RESOURCE.KEROSENE, qty: 1 }],
      stoke: [
        { resourceId: RESOURCE.METHANE, qty: 1 },
        { resourceId: RESOURCE.HYDROGEN, qty: 1 },
      ],
      stokeTime: "early",
    },
  },

  {
    scenarioName: "Damned If You Don't",
    payout: 130_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }],
    },
  },

  {
    scenarioName: "Dead Giveaway",
    payout: 29_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
      place: [{ resourceId: RESOURCE.KEROSENE, qty: 1 }],
    },
  },

  {
    scenarioName: "The Devil's in the Details",
    payout: 130_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.DIESEL, qty: 1 }],
      stoke: [{ resourceId: RESOURCE.POTASSIUM_NITRATE, qty: 1 }],
    },
    needsVerification: true,
  },

  {
    scenarioName: "Dine and Dash",
    payout: 95_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
      place: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
      stoke: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
      stokeTime: "early",
    },
  },

    {
      scenarioName: "Dirty Money",
      payout: 420_000,
      actions: {
        ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
        place: [{ resourceId: RESOURCE.KEROSENE, qty: 3 }],
      },
    },

  {
    scenarioName: "Disco Inferno",
    payout: 140_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }, { resourceId: RESOURCE.HYDROGEN, qty: 1 }, { resourceId: RESOURCE.METHANE, qty: 1 }],
    },
  },

  {
    scenarioName: "Don't Hate the Player",
    payout: 37_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
    },
  },

  {
    scenarioName: "Eight Lives",
    payout: 9_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
    },
  },

  {
    scenarioName: "Emotional Wreck",
    payout: 160_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }, { resourceId: RESOURCE.MAGNESIUM, qty: 1 }],
    },
  },

  {
    scenarioName: "End of the Line",
    payout: 150_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }],
    },
  },

  {
    scenarioName: "Faction Fiction",
    payout: 84_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }],
    },
  },

  {
    scenarioName: "Family Feud",
    payout: 22_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
    },
  },

  {
    scenarioName: "Fan the Flames",
    payout: 96_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }, { resourceId: RESOURCE.METHANE, qty: 1 }],
      stoke: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
      stokeTime: "late",
    },
  },

  {
    scenarioName: "Fight Fire With Fire",
    payout: 54_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
    },
  },

  {
    scenarioName: "Final Markdown",
    payout: 100_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }],
    },
  },
  {
    scenarioName: "Fire and Brimstone",
    payout: 140_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
    },
  },
  {
    scenarioName: "Fire Burn and Cauldron Bubble",
    payout: 180_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }],
    },
  },
  {
    scenarioName: "Fire in the Belly",
    payout: 40_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
    },
  },
    {
      scenarioName: "Fire Kills 99.9% of Bacteria",
      payout: 330_000,
      actions: {
        ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
        place: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
      },
    },
  {
    scenarioName: "Fire Sale",
    payout: 12_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
      place: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
    },
  },
  {
    scenarioName: "Follow the Leader",
    payout: 130_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.HYDROGEN, qty: 2 }],
      stoke: [{ resourceId: RESOURCE.METHANE, qty: 1 }],
      stokeTime: "late",
    },
  },
  {
    scenarioName: "For Closure",
    payout: 42_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
    },
  },
  {
    scenarioName: "Foul Play",
    payout: 140_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
    },
  },
  {
    scenarioName: "Gay Frogs",
    payout: 34_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
    },
  },
  {
    scenarioName: "Get Wrecked",
    payout: 84_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
    },
  },
  {
    scenarioName: "Gym'll Fix It",
    payout: 52_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
    },
  },

  {
    scenarioName: "Hair Today...",
    payout: 93_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
      place: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
      stoke: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
      stokeTime: "early",
    },
  },

  {
    scenarioName: "Heat the Rich",
    payout: 69_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
    },
  },

  {
    scenarioName: "Hide and Seek",
    payout: 33_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
    },
  },

  {
    scenarioName: "High Time",
    payout: 10_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
    },
  },

  {
    scenarioName: "Hire and Fire",
    payout: 73_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
    },
  },

  {
    scenarioName: "Hold Fire",
    payout: 120_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
    },
  },

  {
    scenarioName: "Holy Smokes",
    payout: 73_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
    },
  },

  {
    scenarioName: "Home and Dry",
    payout: 89_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
    },
  },

  {
    scenarioName: "Hostile Takeover",
    payout: 320_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
    },
  },

  {
    scenarioName: "Hot Dinners",
    payout: 55_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.DIESEL, qty: 1 }],
    },
  },

  {
    scenarioName: "Hot Dog",
    payout: 34_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
    },
  },

  {
    scenarioName: "Hot Gossip",
    payout: 104_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
    },
  },

  {
    scenarioName: "Hot Off the Press",
    payout: 30_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
    },
  },

  {
    scenarioName: "Hot on the Trail",
    payout: 460_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
    },
  },

  {
    scenarioName: "Hot Profit",
    payout: 100_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
    },
  },

  {
    scenarioName: "Hot Trend",
    payout: 66_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
      place: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
    },
  },

  {
    scenarioName: "House Edge",
    payout: 200_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 5 }],
    },
  },

  {
    scenarioName: "House of Cards",
    payout: 630_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
      place: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
      stoke: [{ resourceId: RESOURCE.HYDROGEN, qty: 2 }],
      stokeTime: "early",
    },
  },

  {
    scenarioName: "In Your Debt",
    payout: 46_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
      place: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
    },
  },

  {
    scenarioName: "Insert Coin to Continue",
    payout: 120_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
      place: [{ resourceId: RESOURCE.HYDROGEN, qty: 2 }],
      stoke: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
      stokeTime: "late",
    },
  },

  {
    scenarioName: "It Cuts Both Ways",
    payout: 29_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
    },
  },

  {
    scenarioName: "It's a Write Off",
    payout: 250_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
    },
  },

  {
    scenarioName: "It's Not All White",
    payout: 180_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
      stoke: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
    },
  },

  {
    scenarioName: "Landmark Decision",
    payout: 290_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }],
    },
  },

  {
    scenarioName: "Last Lyft Home",
    payout: 97_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
    },
  },

  {
    scenarioName: "Light Fingered",
    payout: 190_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
    },
  },

  {
    scenarioName: "Like for Like",
    payout: 110_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
      place: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
      stoke: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
      stokeTime: "early",
    },
  },

  {
    scenarioName: "Liquor on the Back Row",
    payout: 50_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
    },
  },

  {
    scenarioName: "Local Concerns",
    payout: 30_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
    },
  },

  {
    scenarioName: "Long Pig",
    payout: 150_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
    },
  },

  {
    scenarioName: "Loud and Clear",
    payout: 195_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
    },
  },

  {
    scenarioName: "Lover's Quarrel",
    payout: 39_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
    },
  },

  {
    scenarioName: "Low Rent",
    payout: 41_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
      place: [{ resourceId: RESOURCE.DIESEL, qty: 1 }],
    },
  },

    {
      scenarioName: "Make a Killing",
      payout: 480_000,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [
          { resourceId: RESOURCE.GASOLINE, qty: 1 },
          { resourceId: RESOURCE.KEROSENE, qty: 2 },
      ],
    },
  },

  {
    scenarioName: "Mallrats",
    payout: 410_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }],
      stoke: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
    },
  },

  {
    scenarioName: "Marked for Salvation",
    payout: 110_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }, { resourceId: RESOURCE.METHANE, qty: 1 }],
      stoke: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
      stokeTime: "late",
    },
  },

  {
    scenarioName: "Marx & Sparks",
    payout: 125_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
    },
  },

  {
    scenarioName: "Medium Rare",
    payout: 330_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
      place: [{ resourceId: RESOURCE.DIESEL, qty: 4 }],
    },
  },

  {
    scenarioName: "Mental Block",
    payout: 580_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [
        { resourceId: RESOURCE.GASOLINE, qty: 5 },
        { resourceId: RESOURCE.THERMITE, qty: 1 },
      ],
    },
    needsVerification: true,
  },

  {
    scenarioName: "Milk Milk, Lemonade",
    payout: 180_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
    },
  },

  {
    scenarioName: "Naked Aggression",
    payout: 31_500,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
      stoke: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
    },
  },

  {
    scenarioName: "Not a Leg to Stand on",
    payout: 220_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }],
    },
  },

  {
    scenarioName: "Oh God, Yes",
    payout: 41_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
    },
  },

  {
    scenarioName: "On Fire at the Box Office",
    payout: 14_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
    },
  },

  {
    scenarioName: "Open House",
    payout: 62_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
    },
  },

  {
    scenarioName: "Out in the Wash",
    payout: 235_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
    },
  },

  {
    scenarioName: "Out with a Bang",
    payout: 42_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
      dampen: [{ resourceId: RESOURCE.BLANKET, qty: 1 }],
    },
  },

  {
    scenarioName: "Pest Control",
    payout: 19_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
      place: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
    },
  },

  {
    scenarioName: "Piggy in the Middle",
    payout: 110_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
    },
  },

  {
    scenarioName: "Playing With Fire",
    payout: 240_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
    },
  },

  {
    scenarioName: "Point of No Return",
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
    scenarioName: "Political Firestorm",
    payout: 35_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
    },
  },

  {
    scenarioName: "Pyro for Pornos",
    payout: 102_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
    },
  },

  {
    scenarioName: "Raising Hell",
    payout: 170_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
      stoke: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
    },
  },

  {
    scenarioName: "Raze the Roof",
    payout: 55_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
      place: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
    },
  },

  {
    scenarioName: "Read the Room",
    payout: 150_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
    },
  },

  {
    scenarioName: "Remote Possibility",
    payout: 99_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
    },
  },

  {
    scenarioName: "Rest in Peace",
    payout: 30_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
    },
  },

  {
    scenarioName: "Ring of Fire",
    payout: 160_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
      place: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
      stoke: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
    },
  },

  {
    scenarioName: "Risky Business",
    payout: 38_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
      place: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
    },
  },

  {
    scenarioName: "Rock the Boat",
    payout: 350_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
      place: [{ resourceId: RESOURCE.DIESEL, qty: 1 }],
    },
  },

  {
    scenarioName: "Searing Irony",
    payout: 240_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }],
    },
  },

  {
    scenarioName: "Second Hand Smoke",
    payout: 100_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }, { resourceId: RESOURCE.HYDROGEN, qty: 1 }],
      stoke: [{ resourceId: RESOURCE.METHANE, qty: 1 }],
      stokeTime: "late",
    },
  },

  {
    scenarioName: "See No Evil",
    payout: 80_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 5 }],
    },
  },

  {
    scenarioName: "Set 'Em Straight",
    payout: 310_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
      place: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
      stoke: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
      stokeTime: "early",
    },
  },

  {
    scenarioName: "Shaky Investment",
    payout: 110_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }, { resourceId: RESOURCE.KEROSENE, qty: 1 }],
    },
  },

  {
    scenarioName: "Shielded from the Truth",
    payout: 24_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
    },
  },

  {
    scenarioName: "Short Shelf Life",
    payout: 440_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
    },
  },

  {
    scenarioName: "Smoke on the Water",
    payout: 10_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
    },
  },

  {
    scenarioName: "Smoke Out",
    payout: 23_000,
    actions: {
      evidence: [{ resourceId: RESOURCE.CANNABIS, qty: 1 }],
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
    },
  },

  {
    scenarioName: "Smoke Signals",
    payout: 120_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [
        { resourceId: RESOURCE.DIESEL, qty: 2 },
        { resourceId: RESOURCE.MAGNESIUM, qty: 1 },
      ],
    },
    needsVerification: true,
  },

  {
    scenarioName: "Smoke Screen",
    payout: 600_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
    },
  },

  {
    scenarioName: "Smoke Without Fire",
    payout: 220_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
    },
  },

  {
    scenarioName: "Smoldering Resentment",
    payout: 17_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
    },
  },

  {
    scenarioName: "Sofa King Cheap",
    payout: 140_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
      place: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
      stoke: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
      stokeTime: "early",
    },
  },

  {
    scenarioName: "Specter of Destruction",
    payout: 74_000,
    actions: {
      evidence: [{ resourceId: RESOURCE.ELEPHANT_STATUE, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
    },
    needsVerification: true,
  },

  {
    scenarioName: "Spirit Level",
    payout: 330_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 5 }],
    },
  },

  {
    scenarioName: "Stick to the Script",
    payout: 170_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
      place: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
      stoke: [{ resourceId: RESOURCE.HYDROGEN, qty: 2 }],
    },
  },

  {
    scenarioName: "Stink to High Heaven",
    payout: 74_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
      place: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }, { resourceId: RESOURCE.KEROSENE, qty: 1 }],
    },
  },

  {
    scenarioName: "Strike While it's Hot",
    payout: 300_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
      place: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
      stoke: [{ resourceId: RESOURCE.HYDROGEN, qty: 2 }],
      stokeTime: "early",
    },
  },

  {
    scenarioName: "Stroke of Fortune",
    payout: 120_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
      stoke: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
    },
  },

  {
    scenarioName: "Supermarket Sweep",
    payout: 265_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 5 }],
    },
  },

  {
    scenarioName: "Swansong",
    payout: 51_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
      place: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
    },
  },

  {
    scenarioName: "Taking out the Trash",
    payout: 150_000,
    actions: {
      evidence: [{ resourceId: RESOURCE.HARD_DRIVE, qty: 1 }],
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }, { resourceId: RESOURCE.KEROSENE, qty: 2 }],
    },
  },

  {
    scenarioName: "That Place Is History",
    payout: 118_500,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
    },
  },

  {
    scenarioName: "The Ashes of Empire",
    payout: 210_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
    },
  },

  {
    scenarioName: "The Bad Samaritan",
    payout: 22_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
      stoke: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
    },
  },

  {
    scenarioName: "The Declaration of Inebrience",
    payout: 140_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
    },
  },

  {
    scenarioName: "The Empyre Strikes Back",
    payout: 50_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
    },
  },

  {
    scenarioName: "The Fat is in the Fire",
    payout: 360_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 5 }],
      stoke: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      stokeTime: "late",
    },
  },

  {
    scenarioName: "The Fire Chief",
    payout: 150_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }],
    },
  },

  {
    scenarioName: "The Fried Piper",
    payout: 320_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
      place: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
    },
  },

  {
    scenarioName: "The Grass Ain't Greener",
    payout: 85_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }],
    },
  },

  {
    scenarioName: "The Male Gaze",
    payout: 120_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
    },
  },

  {
    scenarioName: "The Midnight Oil",
    payout: 104_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }],
    },
  },

  {
    scenarioName: "The Plane Truth",
    payout: 52_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
    },
  },

  {
    scenarioName: "The Savage Beast",
    payout: 190_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
    },
  },

  {
    scenarioName: "The Smoking Gun",
    payout: 470_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
      place: [{ resourceId: RESOURCE.KEROSENE, qty: 4 }],
    },
  },

  {
    scenarioName: "The Waiting Game",
    payout: 130_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
    },
  },

  {
    scenarioName: "Third-Degree Burn",
    payout: 58_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
    },
  },

  {
    scenarioName: "To the Manor Scorned",
    payout: 100_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }],
    },
  },

  {
    scenarioName: "Totally Armless",
    payout: 86_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.KEROSENE, qty: 2 }],
      stoke: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
      stokeTime: "late",
    },
  },

  {
    scenarioName: "Turn up the Heat",
    payout: 76_000,
    actions: {
      evidence: [{ resourceId: RESOURCE.COMPASS, qty: 1 }],
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
    },
  },

  {
    scenarioName: "Twisted Firestarter",
    payout: 33_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
    },
  },

  {
    scenarioName: "Uber Heats",
    payout: 59_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
    },
  },

  {
    scenarioName: "Under the Table",
    payout: 430_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }],
    },
  },

  {
    scenarioName: "Unpopular Mechanics",
    payout: 10_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
    },
  },

  {
    scenarioName: "Unspilled Beans",
    payout: 220_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
      place: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
      stoke: [{ resourceId: RESOURCE.HYDROGEN, qty: 2 }],
      stokeTime: "early",
    },
  },

  {
    scenarioName: "Visions of the Savory",
    payout: 120_000,
    actions: {
      evidence: [{ resourceId: RESOURCE.FAMILY_PHOTO, qty: 1 }],
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }],
    },
  },

  {
    scenarioName: "Waist Not, Want Not",
    payout: 260_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 5 }],
    },
  },

  {
    scenarioName: "Wedded to the Lie",
    payout: 102_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
    },
  },

    {
      scenarioName: "Wet Behind the Ears",
      payout: 250_000,
      actions: {
        ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
      },
    },

  {
    scenarioName: "Where There's a Will",
    payout: 110_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 5 }],
    },
  },

  {
    scenarioName: "Whiskey Business",
    payout: 100_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
      place: [{ resourceId: RESOURCE.METHANE, qty: 2 }],
      stoke: [{ resourceId: RESOURCE.METHANE, qty: 1 }],
      stokeTime: "late",
    },
  },

  {
    scenarioName: "Wired for War",
    payout: 430_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 8 }],
    },
  },

  {
    scenarioName: "Womb With a View",
    payout: 90_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
    },
  },

  {
    scenarioName: "Workplace Burnout",
    payout: 82_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
    },
  },
  {
    scenarioName: "You're Fired!",
    payout: 150_000,
    actions: {
      evidence: [{ resourceId: RESOURCE.LIPSTICK, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }],
    },
    needsVerification: true,
  },
  {
    scenarioName: "A Bitter Taste",
    payout: 0,
    actions: { place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }] },
    needsVerification: true,
  },
  {
    scenarioName: "Blown to High Heaven",
    payout: 0,
    actions: { place: [{ resourceId: RESOURCE.OXYGEN, qty: 1 }] },
    needsVerification: true,
  },
  {
    scenarioName: "Bugging Me",
    payout: 0,
    actions: { place: [{ resourceId: RESOURCE.OXYGEN, qty: 2 }] },
    needsVerification: true,
  },
  {
    scenarioName: "Hell Fire",
    payout: 0,
    actions: { place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }] },
    needsVerification: true,
  },
  {
    scenarioName: "Bummed Out",
    payout: 0,
    actions: { place: [{ resourceId: RESOURCE.KEROSENE, qty: 3 }] },
    needsVerification: true,
  },
  {
    scenarioName: "Finish Line",
    payout: 0,
    actions: {
      place: [{ resourceId: RESOURCE.KEROSENE, qty: 1 }],
      stoke: [{ resourceId: RESOURCE.METHANE, qty: 1 }],
    },
    needsVerification: true,
  },
  {
    scenarioName: "Cut to the Chase",
    payout: 0,
    actions: { place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }] },
    needsVerification: true,
  },
  {
    scenarioName: "Hot Under the Collar",
    payout: 0,
    actions: { place: [{ resourceId: RESOURCE.THERMITE, qty: 1 }] },
    needsVerification: true,
  },
  {
    scenarioName: "Improving the Odds",
    payout: 0,
    actions: {
      place: [{ resourceId: RESOURCE.DIESEL, qty: 1 }],
      stoke: [{ resourceId: RESOURCE.DIESEL, qty: 1 }],
    },
    needsVerification: true,
  },
  {
    scenarioName: "Cooking Time",
    payout: 0,
    actions: {
      place: [{ resourceId: RESOURCE.DIESEL, qty: 1 }],
      stoke: [{ resourceId: RESOURCE.DIESEL, qty: 1 }],
    },
    needsVerification: true,
  },
  {
    scenarioName: "Roast Beef",
    payout: 140_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.DIESEL, qty: 2 }],
      stoke: [{ resourceId: RESOURCE.DIESEL, qty: 5 }],
      stokeTime: "late",
    },
  },
  {
    scenarioName: "Stop, Drop, and Lol",
    payout: 320_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [
        { resourceId: RESOURCE.KEROSENE, qty: 2 },
        { resourceId: RESOURCE.THERMITE, qty: 2 },
      ],
      stoke: [{ resourceId: RESOURCE.POTASSIUM_NITRATE, qty: 1 }],
      stokeTime: "late",
    },
  },
  {
    scenarioName: "Shit Happens",
    payout: 23_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
    },
  },
  {
    scenarioName: "Doxing Clever",
    payout: 140_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [
        { resourceId: RESOURCE.GASOLINE, qty: 4 },
        { resourceId: RESOURCE.MAGNESIUM, qty: 1 },
      ],
      stoke: [{ resourceId: RESOURCE.DIESEL, qty: 5 }],
      stokeTime: "late",
    },
  },
  {
    scenarioName: "Plane and Simple",
    payout: 180_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [
        { resourceId: RESOURCE.METHANE, qty: 1 },
        { resourceId: RESOURCE.POTASSIUM_NITRATE, qty: 2 },
      ],
      stoke: [{ resourceId: RESOURCE.METHANE, qty: 2 }],
      stokeTime: "late",
    },
  },
  {
    scenarioName: "The Bolted Horse",
    payout: 90_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.OXYGEN, qty: 3 }],
      stoke: [{ resourceId: RESOURCE.OXYGEN, qty: 1 }],
      stokeTime: "late",
    },
  },
  {
    scenarioName: "Sky High Prices",
    payout: 59_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [
        { resourceId: RESOURCE.GASOLINE, qty: 4 },
        { resourceId: RESOURCE.POTASSIUM_NITRATE, qty: 1 },
      ],
    },
  },
];
