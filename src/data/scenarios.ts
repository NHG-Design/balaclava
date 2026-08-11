import { RESOURCE, type ResourceId } from "./catalog.js";

export interface ActionItem {
  resourceId: ResourceId;
  qty: number;
  /** Optional items are excluded from base cost/nerve; shown in tooltip with context. */
  optional?: boolean;
  optionalLabel?: string;
}

/** When to perform the action relative to ignition: immediately after ("early") or closer to target burn % ("late"). */
export type ActionTime =
  | "early"
  | "late"
  | `${number}s`
  | `${number}%`
  | undefined;

export interface ScenarioActions {
  evidence?: ActionItem[];
  ignite?: ActionItem[];
  place: ActionItem[];
  stoke?: ActionItem[];
  stokeTime?: ActionTime;
  dampen?: ActionItem[];
  dampenTime?: ActionTime;
}

export interface Scenario {
  /** Exact scenario name as it appears on the Torn Arson crimes page. */
  scenarioName: string;
  /** Low end of the observed payout range in Torn dollars, for the scenario's canonical recipe (see `actions`). */
  payoutMin: number;
  /** High end of the observed payout range in Torn dollars, for the scenario's canonical recipe. Drives the tooltip's payout range and the "optimist" PPN calculation basis. */
  payoutMax: number;
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
    payoutMin: 210_000,
    payoutMax: 220_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
      stoke: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1, optional: true }],
      stokeTime: "late",
    },
  },
  {
    scenarioName: "A Thong of Lice and Fire",
    payoutMin: 220_000,
    payoutMax: 220_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
      stoke: [{ resourceId: RESOURCE.METHANE, qty: 1 }],
      stokeTime: "early",
    },
  },
  {
    scenarioName: "Burning Ambition",
    payoutMin: 46_000,
    payoutMax: 130_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
    },
  },
  {
    scenarioName: "Burning Calories",
    payoutMin: 100_000,
    payoutMax: 100_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }],
    },
  },

  {
    scenarioName: "Child's Play",
    payoutMin: 23_000,
    payoutMax: 43_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
    },
  },

  {
    scenarioName: "Cooked and Burned",
    payoutMin: 73_000,
    payoutMax: 79_000,
    actions: {
      evidence: [{ resourceId: RESOURCE.AMMONIA, qty: 1 }],
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
    },
  },

  {
    scenarioName: "Final Cut",
    payoutMin: 140_000,
    payoutMax: 180_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
      stoke: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1, optional: true }],
      stokeTime: "98%",
    },
  },

  {
    scenarioName: "From the Ashes",
    payoutMin: 120_000,
    payoutMax: 170_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }],
    },
  },

  {
    scenarioName: "Going Viral",
    payoutMin: 190_000,
    payoutMax: 190_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
    },
  },

  {
    scenarioName: "Green With Envy",
    payoutMin: 120_000,
    payoutMax: 130_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
    },
  },

  {
    scenarioName: "Hot Pursuit",
    payoutMin: 14_000,
    payoutMax: 50_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
    },
  },

  {
    scenarioName: "Kindling Spirits",
    payoutMin: 92_500,
    payoutMax: 92_500,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }],
    },
  },

  {
    scenarioName: "Needles to Say",
    payoutMin: 39_000,
    payoutMax: 45_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
    },
  },

  {
    scenarioName: "Off the Market",
    payoutMin: 155_000,
    payoutMax: 210_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
      stoke: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
      stokeTime: "early",
    },
  },

  {
    scenarioName: "Old School",
    payoutMin: 62_500,
    payoutMax: 77_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }],
    },
  },

  {
    scenarioName: "One Rotten Apple",
    payoutMin: 180_000,
    payoutMax: 190_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
    },
  },

  {
    scenarioName: "Party Pooper",
    payoutMin: 62_000,
    payoutMax: 62_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
    },
  },

  {
    scenarioName: "Raze the Steaks",
    payoutMin: 250_000,
    payoutMax: 260_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 5 }],
    },
  },

  {
    scenarioName: "Burn the Deck",
    payoutMin: 96_000,
    payoutMax: 130_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }],
    },
  },

  {
    scenarioName: "Boom Industry",
    payoutMin: 100_000,
    payoutMax: 130_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
    },
  },

  {
    scenarioName: "Igniting Curiosity",
    payoutMin: 250_000,
    payoutMax: 280_000,
    actions: {
      evidence: [{ resourceId: RESOURCE.SUMO_DOLL, qty: 1 }],
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }],
    },
  },

  {
    scenarioName: "Burn Rubber",
    payoutMin: 67_000,
    payoutMax: 82_000,
    actions: {
      evidence: [{ resourceId: RESOURCE.MAYAN_STATUE, qty: 1 }],
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
    },
  },

  {
    scenarioName: "Hot out of the Gate",
    payoutMin: 91_000,
    payoutMax: 96_000,
    actions: {
      evidence: [{ resourceId: RESOURCE.GOLD_TOOTH, qty: 1 }],
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
    },
  },

  {
    scenarioName: "Bald Faced Destruction",
    payoutMin: 245_000,
    payoutMax: 270_000,
    actions: {
      evidence: [{ resourceId: RESOURCE.RAW_IVORY, qty: 1 }],
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
    },
  },

  {
    scenarioName: "Blaze of Glory",
    payoutMin: 180_000,
    payoutMax: 200_000,
    actions: {
      evidence: [{ resourceId: RESOURCE.TOOTHBRUSH, qty: 1 }],
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
      stoke: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 2 }],
      stokeTime: "late",
    },
  },

  {
    scenarioName: "A Treat for the Tricked",
    payoutMin: 71_000,
    payoutMax: 110_000,
    actions: {
      evidence: [{ resourceId: RESOURCE.KABUKI_MASK, qty: 1 }],
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
    },
  },

  {
    scenarioName: "Muscling In",
    payoutMin: 90_500,
    payoutMax: 200_000,
    actions: {
      evidence: [{ resourceId: RESOURCE.SYRINGE, qty: 1 }],
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [
        { resourceId: RESOURCE.GASOLINE, qty: 2 },
        { resourceId: RESOURCE.MAGNESIUM, qty: 1 },
      ],
    },
  },

  {
    scenarioName: "Banking on It",
    payoutMin: 180_000,
    payoutMax: 220_000,
    actions: {
      evidence: [{ resourceId: RESOURCE.STAPLER, qty: 1 }],
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
    },
  },

  {
    scenarioName: "Planted",
    payoutMin: 120_000,
    payoutMax: 130_000,
    actions: {
      evidence: [{ resourceId: RESOURCE.PELE_CHARM, qty: 1 }],
      ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
    },
  },

  {
    scenarioName: "Flame and Fortune",
    payoutMin: 680_000,
    payoutMax: 700_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.KEROSENE, qty: 3 }],
    },
  },

  {
    scenarioName: "Cache and Burn",
    payoutMin: 490_000,
    payoutMax: 510_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.KEROSENE, qty: 4 }],
    },
  },

  {
    scenarioName: "Lock, Stock, and Barrel",
    payoutMin: 220_000,
    payoutMax: 240_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
      stoke: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
      stokeTime: "early",
    },
  },

  {
    scenarioName: "Letter of the Law",
    payoutMin: 360_000,
    payoutMax: 410_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
      stoke: [{ resourceId: RESOURCE.HYDROGEN, qty: 2 }],
      stokeTime: "early",
    },
  },

  {
    scenarioName: "Gentrifried",
    payoutMin: 230_000,
    payoutMax: 230_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
      stoke: [{ resourceId: RESOURCE.POTASSIUM_NITRATE, qty: 2 }],
    },
  },
  {
    scenarioName: "A Burnt Child Dreads the Fire",
    payoutMin: 235_000,
    payoutMax: 290_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
      stoke: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
      stokeTime: "late",
    },
  },

  {
    scenarioName: "A Dirty Job",
    payoutMin: 32_000,
    payoutMax: 43_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
    },
  },

  {
    scenarioName: "A Fungus Among Us",
    payoutMin: 34_000,
    payoutMax: 46_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
    },
  },

  {
    scenarioName: "A Hot Lead",
    payoutMin: 22_000,
    payoutMax: 44_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 6 }],
    },
  },

  {
    scenarioName: "A Mug's Game",
    payoutMin: 55_000,
    payoutMax: 55_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
    },
  },

  {
    scenarioName: "A Problem Shared",
    payoutMin: 180_000,
    payoutMax: 180_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }],
      stoke: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
    },
  },

  {
    scenarioName: "A Rash Decision",
    payoutMin: 11_000,
    payoutMax: 17_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
      stoke: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
      stokeTime: "late",
    },
  },

  {
    scenarioName: "All Mouth and Trousers",
    payoutMin: 56_000,
    payoutMax: 78_000,
    actions: {
      evidence: [{ resourceId: RESOURCE.DIAMOND_RING, qty: 1 }],
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
    },
  },

  {
    scenarioName: "Always Read the Label",
    payoutMin: 170_000,
    payoutMax: 170_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 5 }],
      stoke: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
    },
  },

  {
    scenarioName: "Anon Starter",
    payoutMin: 31_000,
    payoutMax: 33_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
    },
  },

  {
    scenarioName: "Apart of the Problem",
    payoutMin: 240_000,
    payoutMax: 300_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }],
      stoke: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      stokeTime: "late",
    },
  },

  {
    scenarioName: "Ash or Credit?",
    payoutMin: 180_000,
    payoutMax: 230_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
      stoke: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
      stokeTime: "early",
    },
  },

  {
    scenarioName: "Ashes to Ancestors",
    payoutMin: 90_000,
    payoutMax: 90_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 5 }],
    },
  },

  {
    scenarioName: "Back, Sack, and Crack",
    payoutMin: 300_000,
    payoutMax: 320_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.HYDROGEN, qty: 2 }],
    },
  },

  {
    scenarioName: "Baewatch",
    payoutMin: 13_000,
    payoutMax: 16_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
    },
  },

  {
    scenarioName: "Bagged and Tagged",
    payoutMin: 1_600,
    payoutMax: 19_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
    },
  },

  {
    scenarioName: "Bang For Your Buck",
    payoutMin: 44_000,
    payoutMax: 50_000,
    actions: {
      evidence: [{ resourceId: RESOURCE.GRENADE, qty: 1 }],
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
    },
  },

  {
    scenarioName: "Beach Bum",
    payoutMin: 18_000,
    payoutMax: 20_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
    },
  },

  {
    scenarioName: "Beat the Odds",
    payoutMin: 330_000,
    payoutMax: 350_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }],
    },
  },

  {
    scenarioName: "Beggars Can't be Choosers",
    payoutMin: 480_000,
    payoutMax: 510_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [
        { resourceId: RESOURCE.GASOLINE, qty: 5 },
        { resourceId: RESOURCE.THERMITE, qty: 1 },
        { resourceId: RESOURCE.MAGNESIUM, qty: 1 },
      ],
    },
  },

  {
    scenarioName: "Beyond Repair",
    payoutMin: 93_500,
    payoutMax: 93_500,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }],
      stoke: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
    },
    needsVerification: true,
  },

  {
    scenarioName: "Body of Evidence",
    payoutMin: 105_000,
    payoutMax: 105_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }],
      stoke: [{ resourceId: RESOURCE.POTASSIUM_NITRATE, qty: 1 }],
    },
  },

  {
    scenarioName: "Bone of Contention",
    payoutMin: 13_000,
    payoutMax: 43_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
      dampen: [{ resourceId: RESOURCE.BLANKET, qty: 1 }],
    },
  },

  {
    scenarioName: "Boxing Clever",
    payoutMin: 325_000,
    payoutMax: 360_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
    },
  },

  {
    scenarioName: "Bright Spark",
    payoutMin: 275_000,
    payoutMax: 275_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
      place: [{ resourceId: RESOURCE.HYDROGEN, qty: 2 }],
      stoke: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
      stokeTime: "early",
    },
  },

  {
    scenarioName: "Burn After Screening",
    payoutMin: 100_000,
    payoutMax: 120_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }],
    },
  },

  {
    scenarioName: "Burn Notice",
    payoutMin: 175_000,
    payoutMax: 180_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [
        { resourceId: RESOURCE.GASOLINE, qty: 2 },
        { resourceId: RESOURCE.THERMITE, qty: 1 },
      ],
    },
  },

  {
    scenarioName: "Burned by Stupidity",
    payoutMin: 25_000,
    payoutMax: 33_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
      place: [{ resourceId: RESOURCE.KEROSENE, qty: 1 }],
    },
  },

  {
    scenarioName: "Burned Cookies",
    payoutMin: 81_000,
    payoutMax: 310_000,
    actions: {
      place: [{ resourceId: RESOURCE.DIESEL, qty: 8 }],
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      stoke: [{ resourceId: RESOURCE.OXYGEN, qty: 1 }],
      stokeTime: "early",
    },
  },

  {
    scenarioName: "Burning Liability",
    payoutMin: 160_000,
    payoutMax: 160_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
      place: [{ resourceId: RESOURCE.HYDROGEN, qty: 2 }],
      stoke: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
      stokeTime: "late",
    },
  },

  {
    scenarioName: "Burning Memory",
    payoutMin: 32_000,
    payoutMax: 40_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
    },
  },

  {
    scenarioName: "Burning Through Cash",
    payoutMin: 105_000,
    payoutMax: 120_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
    },
  },

  {
    scenarioName: "Burnt Ends",
    payoutMin: 170_000,
    payoutMax: 190_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }],
      stoke: [{ resourceId: RESOURCE.LIGHTER, qty: 1, optional: true }],
      stokeTime: "late",
    },
  },

  {
    scenarioName: "Burn up the Dancefloor",
    payoutMin: 175_000,
    payoutMax: 190_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
    },
  },

  {
    scenarioName: "Camera Tricks",
    payoutMin: 115_000,
    payoutMax: 120_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
      stoke: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
      stokeTime: "late",
    },
  },

  {
    scenarioName: "Carrying a Torch",
    payoutMin: 44_500,
    payoutMax: 90_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }],
    },
  },

  {
    scenarioName: "Chance of Redemption",
    payoutMin: 59_000,
    payoutMax: 82_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
    },
  },

  {
    scenarioName: "Charcoal Sketch",
    payoutMin: 39_000,
    payoutMax: 68_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
    },
  },

  {
    scenarioName: "Chasing Targets",
    payoutMin: 24_000,
    payoutMax: 37_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
    },
  },

  {
    scenarioName: "Checking Out",
    payoutMin: 280_000,
    payoutMax: 360_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
      place: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
      stoke: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
      stokeTime: "early",
    },
  },

  {
    scenarioName: "Claim to Flame",
    payoutMin: 33_500,
    payoutMax: 43_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
    },
  },

  {
    scenarioName: "Clean Sweep",
    payoutMin: 150_000,
    payoutMax: 150_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [
        { resourceId: RESOURCE.GASOLINE, qty: 4 },
        { resourceId: RESOURCE.THERMITE, qty: 1 },
      ],
      stoke: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
    },
  },

  {
    scenarioName: "Cleansed Through Fire",
    payoutMin: 46_000,
    payoutMax: 230_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [
        { resourceId: RESOURCE.DIESEL, qty: 2 },
        { resourceId: RESOURCE.MAGNESIUM, qty: 1 },
      ],
    },
  },

  {
    scenarioName: "Clinical Exposure",
    payoutMin: 165_000,
    payoutMax: 180_000,
    actions: {
      evidence: [{ resourceId: RESOURCE.OPIUM, qty: 1 }],
      ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
    },
  },

  {
    scenarioName: "Cold Brew Reality",
    payoutMin: 150_000,
    payoutMax: 150_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
      place: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
      stoke: [{ resourceId: RESOURCE.HYDROGEN, qty: 2 }],
      stokeTime: "late",
    },
  },

  {
    scenarioName: "Cold Feet",
    payoutMin: 120_000,
    payoutMax: 120_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [
        { resourceId: RESOURCE.GASOLINE, qty: 2 },
        { resourceId: RESOURCE.POTASSIUM_NITRATE, qty: 1 },
      ],
      stoke: [{ resourceId: RESOURCE.DIESEL, qty: 1 }],
      stokeTime: "late",
    },
  },

  {
    scenarioName: "Cook it Rare",
    payoutMin: 330_000,
    payoutMax: 380_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
      place: [{ resourceId: RESOURCE.KEROSENE, qty: 3 }],
    },
  },

  {
    scenarioName: "Cooking the Books",
    payoutMin: 25_000,
    payoutMax: 38_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
    },
  },

  {
    scenarioName: "Cop Some Heat",
    payoutMin: 19_000,
    payoutMax: 63_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
    },
  },

  {
    scenarioName: "Crafty Devil",
    payoutMin: 100_000,
    payoutMax: 106_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
    },
  },

  {
    scenarioName: "Crisp Bills",
    payoutMin: 39_000,
    payoutMax: 52_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
    },
  },

  {
    scenarioName: "Curtain Call",
    payoutMin: 57_000,
    payoutMax: 79_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
      place: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
    },
    needsVerification: true,
  },

  {
    scenarioName: "Cut Corners",
    payoutMin: 200_000,
    payoutMax: 230_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
      place: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
      stoke: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
    },
  },

  {
    scenarioName: "Daddy's Girl",
    payoutMin: 330_000,
    payoutMax: 330_000,
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
    payoutMin: 74_000,
    payoutMax: 150_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
    },
  },

  {
    scenarioName: "Dead Giveaway",
    payoutMin: 29_000,
    payoutMax: 29_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
      place: [{ resourceId: RESOURCE.KEROSENE, qty: 1 }],
    },
  },

  {
    scenarioName: "The Devil's in the Details",
    payoutMin: 130_000,
    payoutMax: 130_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.DIESEL, qty: 1 }],
      stoke: [{ resourceId: RESOURCE.POTASSIUM_NITRATE, qty: 1 }],
    },
  },

  {
    scenarioName: "Dine and Dash",
    payoutMin: 95_000,
    payoutMax: 95_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
      place: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
      stoke: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
      stokeTime: "early",
    },
  },

  {
    scenarioName: "Dirty Money",
    payoutMin: 360_000,
    payoutMax: 420_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
      place: [{ resourceId: RESOURCE.KEROSENE, qty: 3 }],
    },
  },

  {
    scenarioName: "Disco Inferno",
    payoutMin: 48_000,
    payoutMax: 140_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
      place: [
        { resourceId: RESOURCE.GASOLINE, qty: 1 },
        { resourceId: RESOURCE.HYDROGEN, qty: 1 },
        { resourceId: RESOURCE.METHANE, qty: 1 },
      ],
    },
  },

  {
    scenarioName: "Don't Hate the Player",
    payoutMin: 32_000,
    payoutMax: 37_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
    },
  },

  {
    scenarioName: "Eight Lives",
    payoutMin: 6_000,
    payoutMax: 9_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
    },
  },

  {
    scenarioName: "Emotional Wreck",
    payoutMin: 140_000,
    payoutMax: 160_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [
        { resourceId: RESOURCE.GASOLINE, qty: 3 },
        { resourceId: RESOURCE.MAGNESIUM, qty: 1 },
      ],
    },
  },

  {
    scenarioName: "End of the Line",
    payoutMin: 78_000,
    payoutMax: 150_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }],
    },
  },

  {
    scenarioName: "Faction Fiction",
    payoutMin: 64_500,
    payoutMax: 84_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }],
    },
  },

  {
    scenarioName: "Family Feud",
    payoutMin: 20_000,
    payoutMax: 22_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
    },
  },

  {
    scenarioName: "Fan the Flames",
    payoutMin: 33_000,
    payoutMax: 96_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
      place: [
        { resourceId: RESOURCE.GASOLINE, qty: 1 },
        { resourceId: RESOURCE.METHANE, qty: 1 },
      ],
      stoke: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
      stokeTime: "late",
    },
  },

  {
    scenarioName: "Fight Fire With Fire",
    payoutMin: 37_000,
    payoutMax: 81_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
    },
  },

  {
    scenarioName: "Final Markdown",
    payoutMin: 49_000,
    payoutMax: 100_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }],
    },
  },
  {
    scenarioName: "Fire and Brimstone",
    payoutMin: 125_000,
    payoutMax: 140_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
    },
  },
  {
    scenarioName: "Fire Burn and Cauldron Bubble",
    payoutMin: 170_000,
    payoutMax: 180_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }],
    },
  },
  {
    scenarioName: "Fire in the Belly",
    payoutMin: 17_000,
    payoutMax: 40_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
    },
  },
  {
    scenarioName: "Fire Kills 99.9% of Bacteria",
    payoutMin: 305_000,
    payoutMax: 330_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
      place: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
    },
  },
  {
    scenarioName: "Fire Sale",
    payoutMin: 10_000,
    payoutMax: 12_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
      place: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
    },
  },
  {
    scenarioName: "Follow the Leader",
    payoutMin: 69_000,
    payoutMax: 130_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.HYDROGEN, qty: 2 }],
      stoke: [{ resourceId: RESOURCE.METHANE, qty: 1 }],
      stokeTime: "late",
    },
  },
  {
    scenarioName: "For Closure",
    payoutMin: 16_000,
    payoutMax: 42_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
    },
  },
  {
    scenarioName: "Foul Play",
    payoutMin: 120_000,
    payoutMax: 140_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
    },
  },
  {
    scenarioName: "Gay Frogs",
    payoutMin: 23_000,
    payoutMax: 34_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
    },
  },
  {
    scenarioName: "Get Wrecked",
    payoutMin: 84_000,
    payoutMax: 96_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
    },
  },
  {
    scenarioName: "Gym'll Fix It",
    payoutMin: 52_000,
    payoutMax: 52_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
    },
  },

  {
    scenarioName: "Hair Today...",
    payoutMin: 93_000,
    payoutMax: 93_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
      place: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
      stoke: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
      stokeTime: "early",
    },
  },

  {
    scenarioName: "Heat the Rich",
    payoutMin: 40_000,
    payoutMax: 69_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
    },
  },

  {
    scenarioName: "Hide and Seek",
    payoutMin: 33_000,
    payoutMax: 33_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
    },
  },

  {
    scenarioName: "High Time",
    payoutMin: 10_000,
    payoutMax: 11_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
    },
  },

  {
    scenarioName: "Hire and Fire",
    payoutMin: 57_000,
    payoutMax: 73_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
    },
  },

  {
    scenarioName: "Hold Fire",
    payoutMin: 110_000,
    payoutMax: 120_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
    },
  },

  {
    scenarioName: "Holy Smokes",
    payoutMin: 56_500,
    payoutMax: 73_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
    },
  },

  {
    scenarioName: "Home and Dry",
    payoutMin: 49_000,
    payoutMax: 89_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
    },
  },

  {
    scenarioName: "Hostile Takeover",
    payoutMin: 300_000,
    payoutMax: 320_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
    },
  },

  {
    scenarioName: "Hot Dinners",
    payoutMin: 55_000,
    payoutMax: 55_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.DIESEL, qty: 1 }],
    },
  },

  {
    scenarioName: "Hot Dog",
    payoutMin: 30_500,
    payoutMax: 34_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
    },
  },

  {
    scenarioName: "Hot Gossip",
    payoutMin: 62_000,
    payoutMax: 104_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
    },
  },

  {
    scenarioName: "Hot Off the Press",
    payoutMin: 18_000,
    payoutMax: 30_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
    },
  },

  {
    scenarioName: "Hot on the Trail",
    payoutMin: 390_000,
    payoutMax: 460_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
    },
  },

  {
    scenarioName: "Hot Profit",
    payoutMin: 57_500,
    payoutMax: 100_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
    },
  },

  {
    scenarioName: "Hot Trend",
    payoutMin: 54_000,
    payoutMax: 66_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
      place: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
    },
  },

  {
    scenarioName: "House Edge",
    payoutMin: 135_000,
    payoutMax: 220_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }],
    },
  },

  {
    scenarioName: "House of Cards",
    payoutMin: 610_000,
    payoutMax: 630_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
      place: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
      stoke: [{ resourceId: RESOURCE.HYDROGEN, qty: 2 }],
      stokeTime: "early",
    },
  },

  {
    scenarioName: "In Your Debt",
    payoutMin: 33_000,
    payoutMax: 46_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
      place: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
    },
  },

  {
    scenarioName: "Insert Coin to Continue",
    payoutMin: 120_000,
    payoutMax: 120_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
      place: [{ resourceId: RESOURCE.HYDROGEN, qty: 2 }],
      stoke: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
      stokeTime: "late",
    },
  },

  {
    scenarioName: "It Cuts Both Ways",
    payoutMin: 20_500,
    payoutMax: 29_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
    },
  },

  {
    scenarioName: "It's a Write Off",
    payoutMin: 210_000,
    payoutMax: 250_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
      stoke: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1, optional: true }],
      stokeTime: "late",
    },
  },

  {
    scenarioName: "It's Not All White",
    payoutMin: 140_000,
    payoutMax: 180_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
      stoke: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
    },
  },

  {
    scenarioName: "Landmark Decision",
    payoutMin: 280_000,
    payoutMax: 290_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 5 }],
      stoke: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1, optional: true }],
      stokeTime: "late",
    },
  },

  {
    scenarioName: "Last Lyft Home",
    payoutMin: 52_000,
    payoutMax: 97_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
    },
  },

  {
    scenarioName: "Light Fingered",
    payoutMin: 165_000,
    payoutMax: 190_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
    },
  },

  {
    scenarioName: "Like for Like",
    payoutMin: 95_000,
    payoutMax: 110_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
      place: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
      stoke: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
      stokeTime: "early",
    },
  },

  {
    scenarioName: "Liquor on the Back Row",
    payoutMin: 50_000,
    payoutMax: 50_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
    },
  },

  {
    scenarioName: "Local Concerns",
    payoutMin: 10_500,
    payoutMax: 44_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
    },
  },

  {
    scenarioName: "Long Pig",
    payoutMin: 130_000,
    payoutMax: 150_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
      dampen: [{ resourceId: RESOURCE.BLANKET, qty: 2 }],
    },
  },

  {
    scenarioName: "Loud and Clear",
    payoutMin: 195_000,
    payoutMax: 210_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
    },
  },

  {
    scenarioName: "Lover's Quarrel",
    payoutMin: 20_000,
    payoutMax: 39_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
    },
  },

  {
    scenarioName: "Low Rent",
    payoutMin: 42_000,
    payoutMax: 200_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
      stoke: [{ resourceId: RESOURCE.METHANE, qty: 2 }],
      stokeTime: "early",
    },
  },

  {
    scenarioName: "Make a Killing",
    payoutMin: 390_000,
    payoutMax: 480_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
      place: [{ resourceId: RESOURCE.KEROSENE, qty: 3 }],
    },
  },

  {
    scenarioName: "Mallrats",
    payoutMin: 410_000,
    payoutMax: 410_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }],
      stoke: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
    },
  },

  {
    scenarioName: "Marked for Salvation",
    payoutMin: 80_000,
    payoutMax: 110_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [
        { resourceId: RESOURCE.GASOLINE, qty: 1 },
        { resourceId: RESOURCE.METHANE, qty: 1 },
      ],
      stoke: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
      stokeTime: "late",
    },
  },

  {
    scenarioName: "Marx & Sparks",
    payoutMin: 125_000,
    payoutMax: 125_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
    },
  },

  {
    scenarioName: "Medium Rare",
    payoutMin: 330_000,
    payoutMax: 330_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
      place: [{ resourceId: RESOURCE.DIESEL, qty: 4 }],
    },
  },

  {
    scenarioName: "Mental Block",
    payoutMin: 580_000,
    payoutMax: 580_000,
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
    payoutMin: 155_000,
    payoutMax: 180_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
    },
  },

  {
    scenarioName: "Naked Aggression",
    payoutMin: 31_500,
    payoutMax: 31_500,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
      stoke: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
    },
  },

  {
    scenarioName: "Not a Leg to Stand on",
    payoutMin: 125_000,
    payoutMax: 220_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }],
    },
  },

  {
    scenarioName: "Oh God, Yes",
    payoutMin: 17_500,
    payoutMax: 41_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
    },
  },

  {
    scenarioName: "On Fire at the Box Office",
    payoutMin: 10_000,
    payoutMax: 33_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
    },
  },

  {
    scenarioName: "Open House",
    payoutMin: 50_000,
    payoutMax: 64_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
    },
  },

  {
    scenarioName: "Out in the Wash",
    payoutMin: 235_000,
    payoutMax: 260_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
    },
  },

  {
    scenarioName: "Out with a Bang",
    payoutMin: 35_000,
    payoutMax: 42_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
      dampen: [{ resourceId: RESOURCE.BLANKET, qty: 1 }],
    },
  },

  {
    scenarioName: "Pest Control",
    payoutMin: 16_000,
    payoutMax: 19_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
      place: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
    },
  },

  {
    scenarioName: "Piggy in the Middle",
    payoutMin: 104_000,
    payoutMax: 110_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
    },
  },

  {
    scenarioName: "Playing With Fire",
    payoutMin: 210_000,
    payoutMax: 240_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
    },
  },

  {
    scenarioName: "Point of No Return",
    payoutMin: 90_000,
    payoutMax: 160_000,
    actions: {
      place: [
        { resourceId: RESOURCE.GASOLINE, qty: 3 },
        { resourceId: RESOURCE.THERMITE, qty: 1 },
      ],
      ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
    },
  },

  {
    scenarioName: "Political Firestorm",
    payoutMin: 11_000,
    payoutMax: 40_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
    },
  },

  {
    scenarioName: "Pyro for Pornos",
    payoutMin: 65_000,
    payoutMax: 102_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
    },
  },

  {
    scenarioName: "Raising Hell",
    payoutMin: 170_000,
    payoutMax: 170_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
      stoke: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      stokeTime: "late",
    },
  },

  {
    scenarioName: "Raze the Roof",
    payoutMin: 54_000,
    payoutMax: 55_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
      place: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
    },
  },

  {
    scenarioName: "Read the Room",
    payoutMin: 125_000,
    payoutMax: 150_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
    },
  },

  {
    scenarioName: "Remote Possibility",
    payoutMin: 93_000,
    payoutMax: 102_500,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
    },
  },

  {
    scenarioName: "Rest in Peace",
    payoutMin: 20_500,
    payoutMax: 30_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
    },
  },

  {
    scenarioName: "Ring of Fire",
    payoutMin: 110_000,
    payoutMax: 160_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
      place: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
      stoke: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
    },
  },

  {
    scenarioName: "Risky Business",
    payoutMin: 35_000,
    payoutMax: 50_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
      place: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
    },
  },

  {
    scenarioName: "Rock the Boat",
    payoutMin: 325_000,
    payoutMax: 350_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
      place: [{ resourceId: RESOURCE.DIESEL, qty: 1 }],
    },
  },

  {
    scenarioName: "Searing Irony",
    payoutMin: 250_000,
    payoutMax: 280_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }],
    },
  },

  {
    scenarioName: "Second Hand Smoke",
    payoutMin: 180_000,
    payoutMax: 210_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
      stoke: [{ resourceId: RESOURCE.METHANE, qty: 2 }],
      stokeTime: "early",
    },
  },

  {
    scenarioName: "See No Evil",
    payoutMin: 71_000,
    payoutMax: 80_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 5 }],
    },
  },

  {
    scenarioName: "Set 'Em Straight",
    payoutMin: 310_000,
    payoutMax: 350_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
      place: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
      stoke: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
      stokeTime: "early",
    },
  },

  {
    scenarioName: "Shaky Investment",
    payoutMin: 80_000,
    payoutMax: 110_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [
        { resourceId: RESOURCE.HYDROGEN, qty: 1 },
        { resourceId: RESOURCE.KEROSENE, qty: 1 },
      ],
    },
  },

  {
    scenarioName: "Shielded from the Truth",
    payoutMin: 16_000,
    payoutMax: 24_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
    },
  },

  {
    scenarioName: "Short Shelf Life",
    payoutMin: 395_000,
    payoutMax: 440_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
    },
  },

  {
    scenarioName: "Smoke on the Water",
    payoutMin: 8_600,
    payoutMax: 10_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
    },
  },

  {
    scenarioName: "Smoke Out",
    payoutMin: 21_000,
    payoutMax: 23_000,
    actions: {
      evidence: [{ resourceId: RESOURCE.CANNABIS, qty: 1 }],
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
    },
  },

  {
    scenarioName: "Smoke Signals",
    payoutMin: 120_000,
    payoutMax: 120_000,
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
    payoutMin: 535_000,
    payoutMax: 550_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
      stoke: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1, optional: true }],
      stokeTime: "late",
    },
  },

  {
    scenarioName: "Smoke Without Fire",
    payoutMin: 200_000,
    payoutMax: 220_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
    },
  },

  {
    scenarioName: "Smoldering Resentment",
    payoutMin: 10_000,
    payoutMax: 17_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
    },
  },

  {
    scenarioName: "Sofa King Cheap",
    payoutMin: 120_000,
    payoutMax: 140_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
      place: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
      stoke: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
      stokeTime: "early",
    },
  },

  {
    scenarioName: "Specter of Destruction",
    payoutMin: 62_000,
    payoutMax: 76_000,
    actions: {
      evidence: [{ resourceId: RESOURCE.ELEPHANT_STATUE, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
    },
    needsVerification: true,
  },

  {
    scenarioName: "Spirit Level",
    payoutMin: 280_000,
    payoutMax: 330_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
    },
  },

  {
    scenarioName: "Stick to the Script",
    payoutMin: 160_000,
    payoutMax: 170_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
      place: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
      stoke: [{ resourceId: RESOURCE.HYDROGEN, qty: 2 }],
    },
  },

  {
    scenarioName: "Stink to High Heaven",
    payoutMin: 41_000,
    payoutMax: 74_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
      place: [{ resourceId: RESOURCE.KEROSENE, qty: 1 }],
    },
  },

  {
    scenarioName: "Strike While it's Hot",
    payoutMin: 265_000,
    payoutMax: 300_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
      place: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
      stoke: [{ resourceId: RESOURCE.HYDROGEN, qty: 2 }],
      stokeTime: "early",
    },
  },

  {
    scenarioName: "Stroke of Fortune",
    payoutMin: 120_000,
    payoutMax: 120_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
      stoke: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
    },
  },

  {
    scenarioName: "Supermarket Sweep",
    payoutMin: 290_000,
    payoutMax: 290_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 5 }],
    },
  },

  {
    scenarioName: "Swansong",
    payoutMin: 27_000,
    payoutMax: 51_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
      place: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
    },
  },

  {
    scenarioName: "Taking out the Trash",
    payoutMin: 110_000,
    payoutMax: 150_000,
    actions: {
      evidence: [{ resourceId: RESOURCE.HARD_DRIVE, qty: 1 }],
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [
        { resourceId: RESOURCE.GASOLINE, qty: 2 },
        { resourceId: RESOURCE.KEROSENE, qty: 2 },
      ],
    },
  },

  {
    scenarioName: "That Place Is History",
    payoutMin: 120_000,
    payoutMax: 120_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
    },
  },

  {
    scenarioName: "The Ashes of Empire",
    payoutMin: 175_000,
    payoutMax: 200_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
    },
  },

  {
    scenarioName: "The Bad Samaritan",
    payoutMin: 22_000,
    payoutMax: 22_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
      stoke: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
    },
  },

  {
    scenarioName: "The Declaration of Inebrience",
    payoutMin: 115_000,
    payoutMax: 140_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
    },
  },

  {
    scenarioName: "The Empyre Strikes Back",
    payoutMin: 49_000,
    payoutMax: 50_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
    },
  },

  {
    scenarioName: "The Fat is in the Fire",
    payoutMin: 300_000,
    payoutMax: 340_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 6 }],
      stoke: [
        { resourceId: RESOURCE.FLAMETHROWER, qty: 3 },
        { resourceId: RESOURCE.OXYGEN, qty: 1 },
      ],
      stokeTime: "late",
    },
  },

  {
    scenarioName: "The Fire Chief",
    payoutMin: 140_000,
    payoutMax: 150_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }],
    },
  },

  {
    scenarioName: "The Fried Piper",
    payoutMin: 270_000,
    payoutMax: 320_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
      place: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
    },
  },

  {
    scenarioName: "The Grass Ain't Greener",
    payoutMin: 60_000,
    payoutMax: 91_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }],
    },
  },

  {
    scenarioName: "The Male Gaze",
    payoutMin: 110_000,
    payoutMax: 120_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
    },
  },

  {
    scenarioName: "The Midnight Oil",
    payoutMin: 75_000,
    payoutMax: 104_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }],
    },
  },

  {
    scenarioName: "The Plane Truth",
    payoutMin: 25_000,
    payoutMax: 52_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
    },
  },

  {
    scenarioName: "The Savage Beast",
    payoutMin: 170_000,
    payoutMax: 190_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
      stoke: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      stokeTime: "late",
    },
  },

  {
    scenarioName: "The Smoking Gun",
    payoutMin: 430_000,
    payoutMax: 490_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
      place: [{ resourceId: RESOURCE.KEROSENE, qty: 4 }],
    },
  },

  {
    scenarioName: "The Waiting Game",
    payoutMin: 100_000,
    payoutMax: 130_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
    },
  },

  {
    scenarioName: "Third-Degree Burn",
    payoutMin: 29_000,
    payoutMax: 58_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
    },
  },

  {
    scenarioName: "To the Manor Scorned",
    payoutMin: 75_500,
    payoutMax: 100_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }],
    },
  },

  {
    scenarioName: "Totally Armless",
    payoutMin: 35_000,
    payoutMax: 86_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.KEROSENE, qty: 2 }],
      stoke: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
      stokeTime: "late",
    },
  },

  {
    scenarioName: "Turn up the Heat",
    payoutMin: 76_000,
    payoutMax: 76_000,
    actions: {
      evidence: [{ resourceId: RESOURCE.COMPASS, qty: 1 }],
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
    },
  },

  {
    scenarioName: "Twisted Firestarter",
    payoutMin: 23_000,
    payoutMax: 33_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
    },
  },

  {
    scenarioName: "Uber Heats",
    payoutMin: 40_000,
    payoutMax: 54_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
    },
  },

  {
    scenarioName: "Under the Table",
    payoutMin: 400_000,
    payoutMax: 430_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
      stoke: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      stokeTime: "24s",
    },
  },

  {
    scenarioName: "Unpopular Mechanics",
    payoutMin: 8_600,
    payoutMax: 10_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
    },
  },

  {
    scenarioName: "Unspilled Beans",
    payoutMin: 220_000,
    payoutMax: 220_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
      place: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
      stoke: [{ resourceId: RESOURCE.HYDROGEN, qty: 2 }],
      stokeTime: "early",
    },
  },

  {
    scenarioName: "Visions of the Savory",
    payoutMin: 110_000,
    payoutMax: 120_000,
    actions: {
      evidence: [{ resourceId: RESOURCE.FAMILY_PHOTO, qty: 1 }],
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }],
    },
  },

  {
    scenarioName: "Waist Not, Want Not",
    payoutMin: 210_000,
    payoutMax: 260_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 5 }],
    },
  },

  {
    scenarioName: "Wedded to the Lie",
    payoutMin: 69_000,
    payoutMax: 102_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
    },
  },

  {
    scenarioName: "Wet Behind the Ears",
    payoutMin: 200_000,
    payoutMax: 250_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
      place: [{ resourceId: RESOURCE.KEROSENE, qty: 1 }],
    },
  },

  {
    scenarioName: "Where There's a Will",
    payoutMin: 52_000,
    payoutMax: 110_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 5 }],
    },
  },

  {
    scenarioName: "Whiskey Business",
    payoutMin: 90_000,
    payoutMax: 100_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
      place: [{ resourceId: RESOURCE.METHANE, qty: 2 }],
      stoke: [{ resourceId: RESOURCE.METHANE, qty: 1 }],
      stokeTime: "late",
    },
  },

  {
    scenarioName: "Wired for War",
    payoutMin: 480_000,
    payoutMax: 490_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 8 }],
    },
  },

  {
    scenarioName: "Womb With a View",
    payoutMin: 78_500,
    payoutMax: 90_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
    },
  },

  {
    scenarioName: "Workplace Burnout",
    payoutMin: 73_000,
    payoutMax: 82_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
    },
  },
  {
    scenarioName: "You're Fired!",
    payoutMin: 150_000,
    payoutMax: 170_000,
    actions: {
      evidence: [{ resourceId: RESOURCE.LIPSTICK, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }],
    },
    needsVerification: true,
  },
  {
    scenarioName: "A Bitter Taste",
    payoutMin: 40_000,
    payoutMax: 55_000,
    actions: { place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }] },
    needsVerification: true,
  },
  {
    scenarioName: "Blown to High Heaven",
    payoutMin: 16_000,
    payoutMax: 94_000,
    actions: { place: [{ resourceId: RESOURCE.OXYGEN, qty: 1 }] },
    needsVerification: true,
  },
  {
    scenarioName: "Bugging Me",
    payoutMin: 0,
    payoutMax: 0,
    actions: { place: [{ resourceId: RESOURCE.OXYGEN, qty: 2 }] },
    needsVerification: true,
  },
  {
    scenarioName: "Hell Fire",
    payoutMin: 0,
    payoutMax: 0,
    actions: { place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }] },
    needsVerification: true,
  },
  {
    scenarioName: "Bummed Out",
    payoutMin: 0,
    payoutMax: 0,
    actions: { place: [{ resourceId: RESOURCE.KEROSENE, qty: 3 }] },
    needsVerification: true,
  },
  {
    scenarioName: "Finish Line",
    payoutMin: 0,
    payoutMax: 0,
    actions: {
      place: [{ resourceId: RESOURCE.KEROSENE, qty: 1 }],
      stoke: [{ resourceId: RESOURCE.METHANE, qty: 1 }],
    },
    needsVerification: true,
  },
  {
    scenarioName: "Cut to the Chase",
    payoutMin: 0,
    payoutMax: 0,
    actions: { place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }] },
    needsVerification: true,
  },
  {
    scenarioName: "Hot Under the Collar",
    payoutMin: 0,
    payoutMax: 0,
    actions: { place: [{ resourceId: RESOURCE.THERMITE, qty: 1 }] },
    needsVerification: true,
  },
  {
    scenarioName: "Improving the Odds",
    payoutMin: 0,
    payoutMax: 0,
    actions: {
      place: [{ resourceId: RESOURCE.DIESEL, qty: 1 }],
      stoke: [{ resourceId: RESOURCE.DIESEL, qty: 1 }],
    },
    needsVerification: true,
  },
  {
    scenarioName: "Cooking Time",
    payoutMin: 0,
    payoutMax: 0,
    actions: {
      place: [{ resourceId: RESOURCE.DIESEL, qty: 1 }],
      stoke: [{ resourceId: RESOURCE.DIESEL, qty: 1 }],
    },
    needsVerification: true,
  },
  {
    scenarioName: "Roast Beef",
    payoutMin: 140_000,
    payoutMax: 140_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.DIESEL, qty: 2 }],
      stoke: [{ resourceId: RESOURCE.DIESEL, qty: 5 }],
      stokeTime: "late",
    },
  },
  {
    scenarioName: "Stop, Drop, and Lol",
    payoutMin: 320_000,
    payoutMax: 320_000,
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
    payoutMin: 23_000,
    payoutMax: 23_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
    },
  },
  {
    scenarioName: "Doxing Clever",
    payoutMin: 140_000,
    payoutMax: 140_000,
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
    payoutMin: 180_000,
    payoutMax: 180_000,
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
    payoutMin: 90_000,
    payoutMax: 90_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [{ resourceId: RESOURCE.OXYGEN, qty: 3 }],
      stoke: [{ resourceId: RESOURCE.OXYGEN, qty: 1 }],
      stokeTime: "late",
    },
  },
  {
    scenarioName: "Sky High Prices",
    payoutMin: 59_000,
    payoutMax: 59_000,
    actions: {
      ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
      place: [
        { resourceId: RESOURCE.GASOLINE, qty: 4 },
        { resourceId: RESOURCE.POTASSIUM_NITRATE, qty: 1 },
      ],
    },
  },
];
