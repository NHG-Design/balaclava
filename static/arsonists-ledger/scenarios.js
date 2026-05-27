"use strict";
(() => {
  // src/data/catalog.ts
  var CATALOG_UPDATED = "2026-05-25";
  var RESOURCE = {
    // Liquids
    GASOLINE: "gasoline",
    DIESEL: "diesel",
    KEROSENE: "kerosene",
    // Solids
    MAGNESIUM: "magnesium",
    THERMITE: "thermite",
    POTASSIUM_NITRATE: "potassium_nitrate",
    // Gases
    OXYGEN: "oxygen",
    METHANE: "methane",
    HYDROGEN: "hydrogen",
    // Igniters
    LIGHTER: "lighter",
    MOLOTOV: "molotov",
    FLAMETHROWER: "flamethrower",
    // Dampeners
    BLANKET: "blanket",
    SAND: "sand",
    FIRE_EXTINGUISHER: "fire_extinguisher",
    // Evidence
    AMMONIA: "ammonia",
    CANNABIS: "cannabis",
    COMPASS: "compass",
    DIAMOND_RING: "diamond_ring",
    ELEPHANT_STATUE: "elephant_statue",
    FAMILY_PHOTO: "family_photo",
    GLITTER_BOMB: "glitter_bomb",
    GOLD_TOOTH: "gold_tooth",
    GRENADE: "grenade",
    HARD_DRIVE: "hard_drive",
    JADE_BUDDHA: "jade_buddha",
    KABUKI_MASK: "kabuki_mask",
    LIPSTICK: "lipstick",
    MAYAN_STATUE: "mayan_statue",
    OPIUM: "opium",
    PCP: "pcp",
    PELE_CHARM: "pele_charm",
    RAW_IVORY: "raw_ivory",
    STAPLER: "stapler",
    STICK_GRENADE: "stick_grenade",
    SUMO_DOLL: "sumo_doll",
    SYRINGE: "syringe",
    TOOTHBRUSH: "toothbrush"
  };
  var CATALOG = {
    // Liquids
    [RESOURCE.GASOLINE]: { id: RESOURCE.GASOLINE, name: "Gasoline", kind: "fuel", category: "liquid", isTool: false, defaultPrice: 1500, tornId: 172 },
    [RESOURCE.DIESEL]: { id: RESOURCE.DIESEL, name: "Diesel", kind: "fuel", category: "liquid", isTool: false, defaultPrice: 2500, tornId: 1458 },
    [RESOURCE.KEROSENE]: { id: RESOURCE.KEROSENE, name: "Kerosene", kind: "fuel", category: "liquid", isTool: false, defaultPrice: 4e3, tornId: 1457 },
    // Solids
    [RESOURCE.MAGNESIUM]: { id: RESOURCE.MAGNESIUM, name: "Magnesium Shavings", kind: "fuel", category: "solid", isTool: false, defaultPrice: 5e3, tornId: 1462 },
    [RESOURCE.THERMITE]: { id: RESOURCE.THERMITE, name: "Thermite", kind: "fuel", category: "solid", isTool: false, defaultPrice: 8e4, tornId: 1461 },
    [RESOURCE.POTASSIUM_NITRATE]: { id: RESOURCE.POTASSIUM_NITRATE, name: "Potassium Nitrate", kind: "fuel", category: "solid", isTool: false, defaultPrice: 5e3, tornId: 1264 },
    // Gases
    [RESOURCE.OXYGEN]: { id: RESOURCE.OXYGEN, name: "Oxygen Tank", kind: "fuel", category: "gaseous", isTool: false, defaultPrice: 3e3, tornId: 1219 },
    [RESOURCE.METHANE]: { id: RESOURCE.METHANE, name: "Methane Tank", kind: "fuel", category: "gaseous", isTool: false, defaultPrice: 8e3, tornId: 1460 },
    [RESOURCE.HYDROGEN]: { id: RESOURCE.HYDROGEN, name: "Hydrogen Tank", kind: "fuel", category: "gaseous", isTool: false, defaultPrice: 15e3, tornId: 1459 },
    // Igniters
    [RESOURCE.LIGHTER]: { id: RESOURCE.LIGHTER, name: "Windproof Lighter", kind: "tool", category: "igniter", isTool: true, defaultPrice: 0, tornId: 544 },
    [RESOURCE.MOLOTOV]: { id: RESOURCE.MOLOTOV, name: "Molotov Cocktail", kind: "tool", category: "igniter", isTool: false, defaultPrice: 3e3, tornId: 742 },
    [RESOURCE.FLAMETHROWER]: { id: RESOURCE.FLAMETHROWER, name: "Flamethrower", kind: "tool", category: "igniter", isTool: true, defaultPrice: 0 },
    // Dampeners
    [RESOURCE.BLANKET]: { id: RESOURCE.BLANKET, name: "Blanket", kind: "tool", category: "dampener", isTool: true, defaultPrice: 0 },
    [RESOURCE.SAND]: { id: RESOURCE.SAND, name: "Sand", kind: "tool", category: "dampener", isTool: false, defaultPrice: 1e3, tornId: 833 },
    [RESOURCE.FIRE_EXTINGUISHER]: { id: RESOURCE.FIRE_EXTINGUISHER, name: "Fire Extinguisher", kind: "tool", category: "dampener", isTool: true, defaultPrice: 0, tornId: 1463 },
    // Evidence
    [RESOURCE.AMMONIA]: { id: RESOURCE.AMMONIA, name: "Ammonia", kind: "evidence", category: "misc", isTool: false, defaultPrice: 2e3, tornId: 1248 },
    [RESOURCE.CANNABIS]: { id: RESOURCE.CANNABIS, name: "Cannabis", kind: "evidence", category: "misc", isTool: false, defaultPrice: 1500, tornId: 196 },
    [RESOURCE.COMPASS]: { id: RESOURCE.COMPASS, name: "Compass", kind: "evidence", category: "misc", isTool: false, defaultPrice: 2e3, tornId: 407 },
    [RESOURCE.DIAMOND_RING]: { id: RESOURCE.DIAMOND_RING, name: "Diamond Ring", kind: "evidence", category: "misc", isTool: false, defaultPrice: 5e4, tornId: 54 },
    [RESOURCE.ELEPHANT_STATUE]: { id: RESOURCE.ELEPHANT_STATUE, name: "Elephant Statue", kind: "evidence", category: "misc", isTool: false, defaultPrice: 25e3, tornId: 280 },
    [RESOURCE.FAMILY_PHOTO]: { id: RESOURCE.FAMILY_PHOTO, name: "Family Photo", kind: "evidence", category: "misc", isTool: false, defaultPrice: 500, tornId: 1089 },
    [RESOURCE.GLITTER_BOMB]: { id: RESOURCE.GLITTER_BOMB, name: "Glitter Bomb", kind: "evidence", category: "misc", isTool: false, defaultPrice: 1e4, tornId: 1294 },
    [RESOURCE.GOLD_TOOTH]: { id: RESOURCE.GOLD_TOOTH, name: "Gold Tooth", kind: "evidence", category: "misc", isTool: false, defaultPrice: 15e3, tornId: 1282 },
    [RESOURCE.GRENADE]: { id: RESOURCE.GRENADE, name: "Grenade", kind: "evidence", category: "misc", isTool: false, defaultPrice: 1e4, tornId: 220 },
    [RESOURCE.HARD_DRIVE]: { id: RESOURCE.HARD_DRIVE, name: "Hard Drive", kind: "evidence", category: "misc", isTool: false, defaultPrice: 3e3, tornId: 45 },
    [RESOURCE.JADE_BUDDHA]: { id: RESOURCE.JADE_BUDDHA, name: "Jade Buddha", kind: "evidence", category: "misc", isTool: false, defaultPrice: 3e4, tornId: 275 },
    [RESOURCE.KABUKI_MASK]: { id: RESOURCE.KABUKI_MASK, name: "Kabuki Mask", kind: "evidence", category: "misc", isTool: false, defaultPrice: 2e4, tornId: 278 },
    [RESOURCE.LIPSTICK]: { id: RESOURCE.LIPSTICK, name: "Lipstick", kind: "evidence", category: "misc", isTool: false, defaultPrice: 500, tornId: 1085 },
    [RESOURCE.MAYAN_STATUE]: { id: RESOURCE.MAYAN_STATUE, name: "Mayan Statue", kind: "evidence", category: "misc", isTool: false, defaultPrice: 2e4, tornId: 259 },
    [RESOURCE.OPIUM]: { id: RESOURCE.OPIUM, name: "Opium", kind: "evidence", category: "misc", isTool: false, defaultPrice: 1e5, tornId: 200 },
    [RESOURCE.PCP]: { id: RESOURCE.PCP, name: "PCP", kind: "evidence", category: "misc", isTool: false, defaultPrice: 2e3, tornId: 201 },
    [RESOURCE.PELE_CHARM]: { id: RESOURCE.PELE_CHARM, name: "Pele Charm", kind: "evidence", category: "misc", isTool: false, defaultPrice: 5e4, tornId: 265 },
    [RESOURCE.RAW_IVORY]: { id: RESOURCE.RAW_IVORY, name: "Raw Ivory", kind: "evidence", category: "misc", isTool: false, defaultPrice: 8e4, tornId: 358 },
    [RESOURCE.STAPLER]: { id: RESOURCE.STAPLER, name: "Stapler", kind: "evidence", category: "misc", isTool: false, defaultPrice: 1e3, tornId: 1286 },
    [RESOURCE.STICK_GRENADE]: { id: RESOURCE.STICK_GRENADE, name: "Stick Grenade", kind: "evidence", category: "misc", isTool: false, defaultPrice: 5e3, tornId: 221 },
    [RESOURCE.SUMO_DOLL]: { id: RESOURCE.SUMO_DOLL, name: "Sumo Doll", kind: "evidence", category: "misc", isTool: false, defaultPrice: 3e4, tornId: 427 },
    [RESOURCE.SYRINGE]: { id: RESOURCE.SYRINGE, name: "Syringe", kind: "evidence", category: "misc", isTool: false, defaultPrice: 5e3, tornId: 1094 },
    [RESOURCE.TOOTHBRUSH]: { id: RESOURCE.TOOTHBRUSH, name: "Toothbrush", kind: "evidence", category: "misc", isTool: false, defaultPrice: 500, tornId: 1272 }
  };

  // src/data/scenarios.ts
  var SCENARIOS = [
    {
      scenarioName: "A Black Mark",
      payout: 18e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }]
      }
    },
    {
      scenarioName: "Burning Ambition",
      payout: 46e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }]
      }
    },
    {
      scenarioName: "Burning Calories",
      payout: 1e5,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }]
      }
    },
    {
      scenarioName: "Child's Play",
      payout: 23e3,
      actions: {
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }]
      }
    },
    {
      scenarioName: "Child's Play",
      payout: 23e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }]
      }
    },
    {
      scenarioName: "Cooked and Burned",
      payout: 73e3,
      actions: {
        evidence: [{ resourceId: RESOURCE.AMMONIA, qty: 1 }],
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }]
      }
    },
    {
      scenarioName: "Final Cut",
      payout: 15e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }]
      }
    },
    {
      scenarioName: "From the Ashes",
      payout: 17e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }]
      }
    },
    {
      scenarioName: "Going Viral",
      payout: 19e4,
      actions: {
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }]
      }
    },
    {
      scenarioName: "Going Viral",
      payout: 19e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
        stoke: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1, optional: true, optionalLabel: "if needed" }]
      }
    },
    {
      scenarioName: "Green With Envy",
      payout: 12e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }]
      }
    },
    {
      scenarioName: "Hot Pursuit",
      payout: 28e3,
      actions: {
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }]
      }
    },
    {
      scenarioName: "Hot Pursuit",
      payout: 5e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }]
      }
    },
    {
      scenarioName: "Kindling Spirits",
      payout: 92500,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }]
      }
    },
    {
      scenarioName: "Needles to Say",
      payout: 39e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }]
      }
    },
    {
      scenarioName: "Off the Market",
      payout: 155e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
        stoke: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }]
      }
    },
    {
      scenarioName: "Old School",
      payout: 62e3,
      actions: {
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }]
      }
    },
    {
      scenarioName: "Old School",
      payout: 62500,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }]
      }
    },
    {
      scenarioName: "One Rotten Apple",
      payout: 18e4,
      actions: {
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }]
      }
    },
    {
      scenarioName: "One Rotten Apple",
      payout: 18e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }]
      }
    },
    {
      scenarioName: "Party Pooper",
      payout: 58e3,
      actions: {
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }]
      }
    },
    {
      scenarioName: "Party Pooper",
      payout: 62e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }]
      }
    },
    {
      scenarioName: "Raze the Steaks",
      payout: 25e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 5 }]
      }
    },
    {
      scenarioName: "Burn the Deck",
      payout: 96e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }]
      }
    },
    {
      scenarioName: "Boom Industry",
      payout: 13e4,
      actions: {
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 5 }]
      }
    },
    {
      scenarioName: "Boom Industry",
      payout: 1e5,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }]
      }
    },
    {
      scenarioName: "Igniting Curiosity",
      payout: 1e5,
      actions: {
        evidence: [{ resourceId: RESOURCE.SUMO_DOLL, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }]
      }
    },
    {
      scenarioName: "Igniting Curiosity",
      payout: 26e4,
      actions: {
        evidence: [{ resourceId: RESOURCE.SUMO_DOLL, qty: 1 }],
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }]
      }
    },
    {
      scenarioName: "Burn Rubber",
      payout: 67e3,
      actions: {
        evidence: [{ resourceId: RESOURCE.MAYAN_STATUE, qty: 1 }],
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }]
      }
    },
    {
      scenarioName: "Hot out of the Gate",
      payout: 96e3,
      actions: {
        evidence: [{ resourceId: RESOURCE.GOLD_TOOTH, qty: 1 }],
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }]
      }
    },
    {
      scenarioName: "Bald Faced Destruction",
      payout: 245e3,
      actions: {
        evidence: [{ resourceId: RESOURCE.RAW_IVORY, qty: 1 }],
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }]
      }
    },
    {
      scenarioName: "Blaze of Glory",
      payout: 16e4,
      actions: {
        evidence: [{ resourceId: RESOURCE.TOOTHBRUSH, qty: 1 }],
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
        stoke: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }]
      }
    },
    {
      scenarioName: "A Treat for the Tricked",
      payout: 71e3,
      actions: {
        evidence: [{ resourceId: RESOURCE.KABUKI_MASK, qty: 1 }],
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }]
      }
    },
    {
      scenarioName: "Muscling In",
      payout: 90500,
      actions: {
        evidence: [{ resourceId: RESOURCE.SYRINGE, qty: 1 }],
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }]
      }
    },
    {
      scenarioName: "Banking on It",
      payout: 2e5,
      actions: {
        evidence: [{ resourceId: RESOURCE.STAPLER, qty: 1 }],
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }]
      }
    },
    {
      scenarioName: "Planted",
      payout: 12e4,
      actions: {
        evidence: [{ resourceId: RESOURCE.PELE_CHARM, qty: 1 }],
        ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }]
      }
    },
    {
      scenarioName: "Flame and Fortune",
      payout: 68e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.KEROSENE, qty: 3 }]
      }
    },
    {
      scenarioName: "Cache and Burn",
      payout: 49e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.KEROSENE, qty: 4 }]
      }
    },
    {
      scenarioName: "Lock, Stock, and Barrel",
      payout: 21e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
        stoke: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }]
      }
    },
    {
      scenarioName: "Letter of the Law",
      payout: 36e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
        stoke: [{ resourceId: RESOURCE.HYDROGEN, qty: 2 }]
      }
    },
    {
      scenarioName: "Gentrifried",
      payout: 23e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
        stoke: [{ resourceId: RESOURCE.POTASSIUM_NITRATE, qty: 2 }]
      }
    },
    {
      scenarioName: "A Burnt Child Dreads the Fire",
      payout: 19e4,
      actions: {
        place: [
          { resourceId: RESOURCE.KEROSENE, qty: 2 }
        ],
        stoke: [{ resourceId: RESOURCE.METHANE, qty: 1 }]
      }
    },
    {
      scenarioName: "A Burnt Child Dreads the Fire",
      payout: 235e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
        stoke: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }]
      }
    },
    {
      scenarioName: "A Dirty Job",
      payout: 3e4,
      actions: {
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }]
      }
    },
    {
      scenarioName: "A Dirty Job",
      payout: 32e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }]
      }
    },
    {
      scenarioName: "A Fungus Among Us",
      payout: 38e3,
      actions: {
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }]
      }
    },
    {
      scenarioName: "A Fungus Among Us",
      payout: 34e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }]
      }
    },
    {
      scenarioName: "A Hot Lead",
      payout: 22e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }]
      }
    },
    {
      scenarioName: "A Mug's Game",
      payout: 55e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.MOLOTOV, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }]
      }
    },
    {
      scenarioName: "A Mug's Game",
      payout: 55e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }]
      }
    },
    {
      scenarioName: "A Problem Shared",
      payout: 18e4,
      actions: {
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 6 }],
        stoke: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }]
      }
    },
    {
      scenarioName: "A Problem Shared",
      payout: 18e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }],
        stoke: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }]
      }
    },
    {
      scenarioName: "A Rash Decision",
      payout: 11e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }]
      }
    },
    {
      scenarioName: "All Mouth and Trousers",
      payout: 51e3,
      actions: {
        evidence: [{ resourceId: RESOURCE.DIAMOND_RING, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }]
      }
    },
    {
      scenarioName: "All Mouth and Trousers",
      payout: 56e3,
      actions: {
        evidence: [{ resourceId: RESOURCE.DIAMOND_RING, qty: 1 }],
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }]
      }
    },
    {
      scenarioName: "Always Read the Label",
      payout: 17e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 5 }],
        stoke: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }]
      }
    },
    {
      scenarioName: "Anon Starter",
      payout: 1200,
      actions: {
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }]
      }
    },
    {
      scenarioName: "Anon Starter",
      payout: 31e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }]
      }
    },
    {
      scenarioName: "Apart of the Problem",
      payout: 265e3,
      actions: {
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 6 }]
      }
    },
    {
      scenarioName: "Apart of the Problem",
      payout: 265e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }],
        stoke: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }]
      }
    },
    {
      scenarioName: "Ash or Credit?",
      payout: 18e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
        stoke: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }]
      }
    },
    {
      scenarioName: "Ashes to Ancestors",
      payout: 9e4,
      actions: {
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }],
        stoke: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }]
      }
    },
    {
      scenarioName: "Ashes to Ancestors",
      payout: 9e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 5 }]
      }
    },
    {
      scenarioName: "Back, Sack, and Crack",
      payout: 3e5,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.HYDROGEN, qty: 2 }]
      }
    },
    {
      scenarioName: "Baewatch",
      payout: 13e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }]
      }
    },
    {
      scenarioName: "Bagged and Tagged",
      payout: 1600,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }]
      }
    },
    {
      scenarioName: "Bald Faced Destruction",
      payout: 23e4,
      actions: {
        evidence: [{ resourceId: RESOURCE.RAW_IVORY, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }]
      }
    },
    {
      scenarioName: "Bang For Your Buck",
      payout: 21e3,
      actions: {
        evidence: [{ resourceId: RESOURCE.GRENADE, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }]
      }
    },
    {
      scenarioName: "Bang For Your Buck",
      payout: 44e3,
      actions: {
        evidence: [{ resourceId: RESOURCE.GRENADE, qty: 1 }],
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }]
      }
    },
    {
      scenarioName: "Banking on It",
      payout: 12e4,
      actions: {
        evidence: [{ resourceId: RESOURCE.STAPLER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }]
      }
    },
    {
      scenarioName: "Beach Bum",
      payout: 2e4,
      actions: {
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
        stoke: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }]
      }
    },
    {
      scenarioName: "Beach Bum",
      payout: 19e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }]
      }
    },
    {
      scenarioName: "Beat the Odds",
      payout: 33e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }]
      }
    },
    {
      scenarioName: "Beggars Can't be Choosers",
      payout: 48e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [
          { resourceId: RESOURCE.GASOLINE, qty: 5 },
          { resourceId: RESOURCE.THERMITE, qty: 2 }
        ]
      }
    },
    {
      scenarioName: "Beyond Repair",
      payout: 93500,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }],
        stoke: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }]
      },
      needsVerification: true
    },
    {
      scenarioName: "Body of Evidence",
      payout: 105e3,
      actions: {
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 6 }]
      }
    },
    {
      scenarioName: "Body of Evidence",
      payout: 105e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 5 }]
      }
    },
    {
      scenarioName: "Bone of Contention",
      payout: 43e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
        dampen: [{ resourceId: RESOURCE.BLANKET, qty: 1 }]
      }
    },
    {
      scenarioName: "Boxing Clever",
      payout: 325e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }]
      }
    },
    {
      scenarioName: "Bright Spark",
      payout: 275e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
        place: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
        stoke: [{ resourceId: RESOURCE.HYDROGEN, qty: 2 }]
      }
    },
    {
      scenarioName: "Burn After Screening",
      payout: 99e3,
      actions: {
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }]
      }
    },
    {
      scenarioName: "Burn After Screening",
      payout: 1e5,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }]
      }
    },
    {
      scenarioName: "Burn Notice",
      payout: 175e3,
      actions: {
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }],
        stoke: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }]
      }
    },
    {
      scenarioName: "Burn Notice",
      payout: 175e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 5 }]
      },
      needsVerification: true
    },
    {
      scenarioName: "Burn Rubber",
      payout: 5e4,
      actions: {
        evidence: [{ resourceId: RESOURCE.MAYAN_STATUE, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }]
      }
    },
    {
      scenarioName: "Burn the Deck",
      payout: 57e3,
      actions: {
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }]
      }
    },
    {
      scenarioName: "Burned by Stupidity",
      payout: 32e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
        place: [{ resourceId: RESOURCE.KEROSENE, qty: 1 }]
      }
    },
    {
      scenarioName: "Burned Cookies",
      payout: 81e3,
      actions: {
        place: [
          { resourceId: RESOURCE.DIESEL, qty: 2 },
          { resourceId: RESOURCE.MAGNESIUM, qty: 2 }
        ],
        stoke: [{ resourceId: RESOURCE.DIESEL, qty: 1 }]
      },
      needsVerification: true
    },
    {
      scenarioName: "Burning Liability",
      payout: 16e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
        place: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
        stoke: [{ resourceId: RESOURCE.HYDROGEN, qty: 2 }]
      }
    },
    {
      scenarioName: "Burning Memory",
      payout: 32e3,
      actions: {
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }]
      }
    },
    {
      scenarioName: "Burning Memory",
      payout: 32e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }]
      }
    },
    {
      scenarioName: "Burning Through Cash",
      payout: 58e3,
      actions: {
        place: [{ resourceId: RESOURCE.OXYGEN, qty: 1 }]
      }
    },
    {
      scenarioName: "Burning Through Cash",
      payout: 105e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }]
      }
    },
    {
      scenarioName: "Burnt Ends",
      payout: 18e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }]
      },
      needsVerification: true
    },
    {
      scenarioName: "Burn up the Dancefloor",
      payout: 15e4,
      actions: {
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }]
      }
    },
    {
      scenarioName: "Burn up the Dancefloor",
      payout: 175e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }]
      }
    },
    {
      scenarioName: "Camera Tricks",
      payout: 115e3,
      actions: {
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 5 }],
        stoke: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }]
      }
    },
    {
      scenarioName: "Camera Tricks",
      payout: 115e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }],
        stoke: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }]
      }
    },
    {
      scenarioName: "Carrying a Torch",
      payout: 44500,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }]
      }
    },
    {
      scenarioName: "Chance of Redemption",
      payout: 9e4,
      actions: {
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }]
      }
    },
    {
      scenarioName: "Chance of Redemption",
      payout: 59e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }]
      }
    },
    {
      scenarioName: "Charcoal Sketch",
      payout: 49e3,
      actions: {
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }]
      }
    },
    {
      scenarioName: "Charcoal Sketch",
      payout: 39e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }]
      }
    },
    {
      scenarioName: "Chasing Targets",
      payout: 24e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }]
      }
    },
    {
      scenarioName: "Checking Out",
      payout: 28e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
        place: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
        stoke: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }]
      }
    },
    {
      scenarioName: "Claim to Flame",
      payout: 33500,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }]
      }
    },
    {
      scenarioName: "Clean Sweep",
      payout: 15e4,
      actions: {
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 5 }],
        stoke: [{ resourceId: RESOURCE.DIESEL, qty: 1 }]
      }
    },
    {
      scenarioName: "Clean Sweep",
      payout: 15e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }],
        stoke: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }]
      }
    },
    {
      scenarioName: "Cleansed Through Fire",
      payout: 46e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.DIESEL, qty: 1 }]
      }
    },
    {
      scenarioName: "Clinical Exposure",
      payout: 165e3,
      actions: {
        evidence: [{ resourceId: RESOURCE.OPIUM, qty: 1 }],
        ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }]
      }
    },
    {
      scenarioName: "Cold Brew Reality",
      payout: 9e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
        place: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
        stoke: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
        stokeTime: "early"
      }
    },
    {
      scenarioName: "Cold Feet",
      payout: 1e5,
      actions: {
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 6 }],
        stoke: [{ resourceId: RESOURCE.DIESEL, qty: 1 }]
      }
    },
    {
      scenarioName: "Cold Feet",
      payout: 12e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 5 }],
        stoke: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }]
      },
      needsVerification: true
    },
    {
      scenarioName: "Cook it Rare",
      payout: 33e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
        place: [{ resourceId: RESOURCE.KEROSENE, qty: 3 }]
      }
    },
    {
      scenarioName: "Cooked and Burned",
      payout: 7e4,
      actions: {
        evidence: [{ resourceId: RESOURCE.AMMONIA, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }]
      }
    },
    {
      scenarioName: "Cooking the Books",
      payout: 22e3,
      actions: {
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }]
      }
    },
    {
      scenarioName: "Cooking the Books",
      payout: 25e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }]
      }
    },
    {
      scenarioName: "Cop Some Heat",
      payout: 19e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }]
      }
    },
    {
      scenarioName: "Crafty Devil",
      payout: 106e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }]
      }
    },
    {
      scenarioName: "Crisp Bills",
      payout: 35e3,
      actions: {
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }]
      }
    },
    {
      scenarioName: "Crisp Bills",
      payout: 39e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }]
      }
    },
    {
      scenarioName: "Curtain Call",
      payout: 57e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }]
      }
    },
    {
      scenarioName: "Cut Corners",
      payout: 2e5,
      actions: {
        ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
        place: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
        stoke: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }]
      }
    },
    {
      scenarioName: "Daddy's Girl",
      payout: 33e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
        place: [{ resourceId: RESOURCE.KEROSENE, qty: 1 }],
        stoke: [
          { resourceId: RESOURCE.METHANE, qty: 1 },
          { resourceId: RESOURCE.HYDROGEN, qty: 1 }
        ]
      }
    },
    {
      scenarioName: "Damned If You Don't",
      payout: 44e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }]
      }
    },
    {
      scenarioName: "Dead Giveaway",
      payout: 29e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
        place: [{ resourceId: RESOURCE.KEROSENE, qty: 1 }]
      }
    },
    {
      scenarioName: "The Devil's in the Details",
      payout: 73e3,
      actions: {
        place: [{ resourceId: RESOURCE.DIESEL, qty: 3 }]
      }
    },
    {
      scenarioName: "The Devil's in the Details",
      payout: 13e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.DIESEL, qty: 1 }],
        stoke: [{ resourceId: RESOURCE.POTASSIUM_NITRATE, qty: 1 }]
      },
      needsVerification: true
    },
    {
      scenarioName: "Dine and Dash",
      payout: 95e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
        place: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
        stoke: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }]
      }
    },
    {
      scenarioName: "Dirty Money",
      payout: 36e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
        place: [{ resourceId: RESOURCE.KEROSENE, qty: 3 }]
      }
    },
    {
      scenarioName: "Disco Inferno",
      payout: 48e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
        place: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }]
      }
    },
    {
      scenarioName: "Don't Hate the Player",
      payout: 2e4,
      actions: {
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }]
      }
    },
    {
      scenarioName: "Don't Hate the Player",
      payout: 32e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }]
      }
    },
    {
      scenarioName: "Eight Lives",
      payout: 4200,
      actions: {
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }]
      }
    },
    {
      scenarioName: "Eight Lives",
      payout: 6e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }]
      }
    },
    {
      scenarioName: "Emotional Wreck",
      payout: 14e4,
      actions: {
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 6 }]
      }
    },
    {
      scenarioName: "Emotional Wreck",
      payout: 14e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }],
        stoke: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }]
      }
    },
    {
      scenarioName: "End of the Line",
      payout: 1e5,
      actions: {
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 5 }]
      }
    },
    {
      scenarioName: "End of the Line",
      payout: 78e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }]
      }
    },
    {
      scenarioName: "Faction Fiction",
      payout: 64500,
      actions: {
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }]
      }
    },
    {
      scenarioName: "Faction Fiction",
      payout: 64500,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }]
      }
    },
    {
      scenarioName: "Family Feud",
      payout: 8e3,
      actions: {
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }]
      }
    },
    {
      scenarioName: "Family Feud",
      payout: 2e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }]
      }
    },
    {
      scenarioName: "Fan the Flames",
      payout: 33e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
        place: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }]
      }
    },
    {
      scenarioName: "Fight Fire With Fire",
      payout: 81e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }]
      }
    },
    {
      scenarioName: "Final Cut",
      payout: 15e4,
      actions: {
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }]
      }
    },
    {
      scenarioName: "Final Markdown",
      payout: 49e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }]
      }
    },
    {
      scenarioName: "Fire and Brimstone",
      payout: 14e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }]
      }
    },
    {
      scenarioName: "Fire Burn and Cauldron Bubble",
      payout: 18e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }]
      }
    },
    {
      scenarioName: "Fire in the Belly",
      payout: 17e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }]
      }
    },
    {
      scenarioName: "Fire Kills 99.9% of Bacteria",
      payout: 305e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
        place: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }]
      }
    },
    {
      scenarioName: "Fire Sale",
      payout: 1e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
        place: [{ resourceId: RESOURCE.KEROSENE, qty: 1 }]
      }
    },
    {
      scenarioName: "Follow the Leader",
      payout: 69e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }]
      }
    },
    {
      scenarioName: "For Closure",
      payout: 22e3,
      actions: {
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }]
      }
    },
    {
      scenarioName: "For Closure",
      payout: 16e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }]
      }
    },
    {
      scenarioName: "Foul Play",
      payout: 12e4,
      actions: {
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 5 }]
      }
    },
    {
      scenarioName: "Foul Play",
      payout: 12e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }]
      }
    },
    {
      scenarioName: "From the Ashes",
      payout: 12e4,
      actions: {
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 5 }]
      }
    },
    {
      scenarioName: "Gay Frogs",
      payout: 41e3,
      actions: {
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }]
      }
    },
    {
      scenarioName: "Gay Frogs",
      payout: 34e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }]
      }
    },
    {
      scenarioName: "Get Wrecked",
      payout: 9e4,
      actions: {
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }]
      }
    },
    {
      scenarioName: "Get Wrecked",
      payout: 84e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }]
      }
    },
    {
      scenarioName: "Green With Envy",
      payout: 12e4,
      actions: {
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 6 }]
      }
    },
    {
      scenarioName: "Gym'll Fix It",
      payout: 62e3,
      actions: {
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }]
      }
    },
    {
      scenarioName: "Gym'll Fix It",
      payout: 52e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }]
      }
    },
    {
      scenarioName: "Hair Today...",
      payout: 93e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
        place: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
        stoke: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }]
      }
    },
    {
      scenarioName: "Heat the Rich",
      payout: 34e3,
      actions: {
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }]
      }
    },
    {
      scenarioName: "Heat the Rich",
      payout: 4e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }]
      }
    },
    {
      scenarioName: "Hide and Seek",
      payout: 33e3,
      actions: {
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }]
      }
    },
    {
      scenarioName: "Hide and Seek",
      payout: 33e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }]
      }
    },
    {
      scenarioName: "High Time",
      payout: 4300,
      actions: {
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }]
      }
    },
    {
      scenarioName: "High Time",
      payout: 1e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }]
      }
    },
    {
      scenarioName: "Hire and Fire",
      payout: 49e3,
      actions: {
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }]
      }
    },
    {
      scenarioName: "Hire and Fire",
      payout: 57e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }]
      }
    },
    {
      scenarioName: "Hold Fire",
      payout: 11e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }]
      }
    },
    {
      scenarioName: "Holy Smokes",
      payout: 56500,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }]
      }
    },
    {
      scenarioName: "Home and Dry",
      payout: 35e3,
      actions: {
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }]
      }
    },
    {
      scenarioName: "Home and Dry",
      payout: 49e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }]
      }
    },
    {
      scenarioName: "Hostile Takeover",
      payout: 29e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }]
      }
    },
    {
      scenarioName: "Hot Dinners",
      payout: 55e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.DIESEL, qty: 1 }]
      }
    },
    {
      scenarioName: "Hot Dog",
      payout: 38e3,
      actions: {
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }]
      }
    },
    {
      scenarioName: "Hot Dog",
      payout: 30500,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }]
      }
    },
    {
      scenarioName: "Hot Gossip",
      payout: 62e3,
      actions: {
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }]
      }
    },
    {
      scenarioName: "Hot Gossip",
      payout: 62e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }]
      }
    },
    {
      scenarioName: "Hot Off the Press",
      payout: 18e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }]
      }
    },
    {
      scenarioName: "Hot on the Trail",
      payout: 39e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }]
      }
    },
    {
      scenarioName: "Hot out of the Gate",
      payout: 53e3,
      actions: {
        evidence: [{ resourceId: RESOURCE.GOLD_TOOTH, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }]
      }
    },
    {
      scenarioName: "Hot Profit",
      payout: 84e3,
      actions: {
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }]
      }
    },
    {
      scenarioName: "Hot Profit",
      payout: 57500,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }]
      }
    },
    {
      scenarioName: "Hot Trend",
      payout: 54e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
        place: [{ resourceId: RESOURCE.KEROSENE, qty: 1 }]
      }
    },
    {
      scenarioName: "House Edge",
      payout: 19e4,
      actions: {
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 5 }]
      }
    },
    {
      scenarioName: "House Edge",
      payout: 135e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }]
      }
    },
    {
      scenarioName: "House of Cards",
      payout: 61e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
        place: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
        stoke: [{ resourceId: RESOURCE.HYDROGEN, qty: 2 }]
      }
    },
    {
      scenarioName: "In Your Debt",
      payout: 33e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
        place: [{ resourceId: RESOURCE.KEROSENE, qty: 1 }]
      }
    },
    {
      scenarioName: "Insert Coin to Continue",
      payout: 12e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
        place: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
        stoke: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }]
      }
    },
    {
      scenarioName: "It Cuts Both Ways",
      payout: 19e3,
      actions: {
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }]
      }
    },
    {
      scenarioName: "It Cuts Both Ways",
      payout: 20500,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }]
      }
    },
    {
      scenarioName: "It's a Write Off",
      payout: 225e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }]
      }
    },
    {
      scenarioName: "It's Not All White",
      payout: 14e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
        stoke: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }]
      }
    },
    {
      scenarioName: "Kindling Spirits",
      payout: 64e3,
      actions: {
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }]
      }
    },
    {
      scenarioName: "Landmark Decision",
      payout: 28e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 5 }]
      },
      needsVerification: true
    },
    {
      scenarioName: "Last Lyft Home",
      payout: 52e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }]
      }
    },
    {
      scenarioName: "Letter of the Law",
      payout: 1e3,
      actions: {
        place: [{ resourceId: RESOURCE.KEROSENE, qty: 1 }]
      }
    },
    {
      scenarioName: "Light Fingered",
      payout: 165e3,
      actions: {
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }]
      }
    },
    {
      scenarioName: "Light Fingered",
      payout: 165e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }]
      }
    },
    {
      scenarioName: "Like for Like",
      payout: 11e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
        place: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
        stoke: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }]
      }
    },
    {
      scenarioName: "Liquor on the Back Row",
      payout: 37e3,
      actions: {
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }]
      }
    },
    {
      scenarioName: "Liquor on the Back Row",
      payout: 5e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }]
      }
    },
    {
      scenarioName: "Local Concerns",
      payout: 2e4,
      actions: {
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }]
      }
    },
    {
      scenarioName: "Local Concerns",
      payout: 3e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }]
      }
    },
    {
      scenarioName: "Long Pig",
      payout: 13e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }]
      }
    },
    {
      scenarioName: "Loud and Clear",
      payout: 195e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }]
      }
    },
    {
      scenarioName: "Lover's Quarrel",
      payout: 39e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }]
      }
    },
    {
      scenarioName: "Low Rent",
      payout: 12e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
        place: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
        stoke: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }]
      }
    },
    {
      scenarioName: "Make a Killing",
      payout: 26e4,
      actions: {
        place: [
          { resourceId: RESOURCE.GASOLINE, qty: 1 },
          { resourceId: RESOURCE.KEROSENE, qty: 2 }
        ]
      }
    },
    {
      scenarioName: "Make a Killing",
      payout: 39e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [
          { resourceId: RESOURCE.GASOLINE, qty: 1 },
          { resourceId: RESOURCE.KEROSENE, qty: 2 }
        ]
      }
    },
    {
      scenarioName: "Mallrats",
      payout: 41e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }],
        stoke: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }]
      }
    },
    {
      scenarioName: "Marked for Salvation",
      payout: 3e4,
      actions: {
        place: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }]
      }
    },
    {
      scenarioName: "Marked for Salvation",
      payout: 8e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.KEROSENE, qty: 1 }]
      }
    },
    {
      scenarioName: "Marx & Sparks",
      payout: 14e4,
      actions: {
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }]
      }
    },
    {
      scenarioName: "Marx & Sparks",
      payout: 125e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }]
      }
    },
    {
      scenarioName: "Medium Rare",
      payout: 33e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
        place: [{ resourceId: RESOURCE.DIESEL, qty: 4 }]
      }
    },
    {
      scenarioName: "Mental Block",
      payout: 58e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [
          { resourceId: RESOURCE.GASOLINE, qty: 5 },
          { resourceId: RESOURCE.THERMITE, qty: 1 }
        ]
      },
      needsVerification: true
    },
    {
      scenarioName: "Milk Milk, Lemonade",
      payout: 155e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }]
      }
    },
    {
      scenarioName: "Naked Aggression",
      payout: 31500,
      actions: {
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }]
      }
    },
    {
      scenarioName: "Naked Aggression",
      payout: 31500,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
        stoke: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }]
      }
    },
    {
      scenarioName: "Needles to Say",
      payout: 23e3,
      actions: {
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }]
      }
    },
    {
      scenarioName: "Not a Leg to Stand on",
      payout: 15e4,
      actions: {
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 6 }]
      }
    },
    {
      scenarioName: "Not a Leg to Stand on",
      payout: 125e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }]
      }
    },
    {
      scenarioName: "Off the Market",
      payout: 3e4,
      actions: {
        place: [{ resourceId: RESOURCE.KEROSENE, qty: 1 }]
      }
    },
    {
      scenarioName: "Oh God, Yes",
      payout: 17500,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }]
      }
    },
    {
      scenarioName: "On Fire at the Box Office",
      payout: 1e4,
      actions: {
        place: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }]
      }
    },
    {
      scenarioName: "On Fire at the Box Office",
      payout: 14e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }]
      }
    },
    {
      scenarioName: "Open House",
      payout: 64e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }]
      }
    },
    {
      scenarioName: "Out in the Wash",
      payout: 235e3,
      actions: {
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }]
      }
    },
    {
      scenarioName: "Out in the Wash",
      payout: 235e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }]
      }
    },
    {
      scenarioName: "Out with a Bang",
      payout: 42e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
        dampen: [{ resourceId: RESOURCE.BLANKET, qty: 1 }]
      }
    },
    {
      scenarioName: "Pest Control",
      payout: 16e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
        place: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }]
      }
    },
    {
      scenarioName: "Piggy in the Middle",
      payout: 73e3,
      actions: {
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }]
      }
    },
    {
      scenarioName: "Piggy in the Middle",
      payout: 104e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }]
      }
    },
    {
      scenarioName: "Playing With Fire",
      payout: 2e5,
      actions: {
        ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }]
      }
    },
    {
      scenarioName: "Point of No Return",
      payout: 9e4,
      actions: {
        place: [
          { resourceId: RESOURCE.GASOLINE, qty: 1 },
          { resourceId: RESOURCE.THERMITE, qty: 1 }
        ],
        stoke: [{ resourceId: RESOURCE.MAGNESIUM, qty: 2 }]
      },
      needsVerification: true
    },
    {
      scenarioName: "Political Firestorm",
      payout: 22e3,
      actions: {
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }]
      }
    },
    {
      scenarioName: "Political Firestorm",
      payout: 4e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }]
      }
    },
    {
      scenarioName: "Pyro for Pornos",
      payout: 65e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }]
      }
    },
    {
      scenarioName: "Raising Hell",
      payout: 17e4,
      actions: {
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 6 }]
      }
    },
    {
      scenarioName: "Raising Hell",
      payout: 17e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
        stoke: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }]
      }
    },
    {
      scenarioName: "Raze the Roof",
      payout: 9e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
        place: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
        stoke: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }]
      }
    },
    {
      scenarioName: "Read the Room",
      payout: 125e3,
      actions: {
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 5 }]
      }
    },
    {
      scenarioName: "Read the Room",
      payout: 125e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }]
      }
    },
    {
      scenarioName: "Remote Possibility",
      payout: 102500,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }]
      }
    },
    {
      scenarioName: "Rest in Peace",
      payout: 20500,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }]
      }
    },
    {
      scenarioName: "Ring of Fire",
      payout: 16e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
        place: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
        stoke: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }]
      }
    },
    {
      scenarioName: "Risky Business",
      payout: 5e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
        place: [{ resourceId: RESOURCE.KEROSENE, qty: 1 }]
      }
    },
    {
      scenarioName: "Rock the Boat",
      payout: 325e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
        place: [{ resourceId: RESOURCE.DIESEL, qty: 1 }]
      }
    },
    {
      scenarioName: "Searing Irony",
      payout: 24e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }]
      }
    },
    {
      scenarioName: "Second Hand Smoke",
      payout: 37e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
        place: [{ resourceId: RESOURCE.KEROSENE, qty: 1 }]
      }
    },
    {
      scenarioName: "See No Evil",
      payout: 52e3,
      actions: {
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }]
      }
    },
    {
      scenarioName: "See No Evil",
      payout: 71e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }]
      }
    },
    {
      scenarioName: "Set 'Em Straight",
      payout: 31e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
        place: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
        stoke: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }]
      }
    },
    {
      scenarioName: "Shaky Investment",
      payout: 8e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }]
      }
    },
    {
      scenarioName: "Shielded from the Truth",
      payout: 8900,
      actions: {
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }]
      }
    },
    {
      scenarioName: "Shielded from the Truth",
      payout: 16e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }]
      }
    },
    {
      scenarioName: "Short Shelf Life",
      payout: 395e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }]
      }
    },
    {
      scenarioName: "Smoke on the Water",
      payout: 4200,
      actions: {
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }]
      }
    },
    {
      scenarioName: "Smoke on the Water",
      payout: 8600,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }]
      }
    },
    {
      scenarioName: "Smoke Out",
      payout: 1e4,
      actions: {
        evidence: [{ resourceId: RESOURCE.CANNABIS, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }]
      }
    },
    {
      scenarioName: "Smoke Out",
      payout: 21e3,
      actions: {
        evidence: [{ resourceId: RESOURCE.CANNABIS, qty: 1 }],
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }]
      }
    },
    {
      scenarioName: "Smoke Signals",
      payout: 12e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [
          { resourceId: RESOURCE.DIESEL, qty: 2 },
          { resourceId: RESOURCE.MAGNESIUM, qty: 1 }
        ]
      },
      needsVerification: true
    },
    {
      scenarioName: "Smoke Screen",
      payout: 535e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }]
      },
      needsVerification: true
    },
    {
      scenarioName: "Smoke Without Fire",
      payout: 2e5,
      actions: {
        ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }]
      }
    },
    {
      scenarioName: "Smoldering Resentment",
      payout: 1e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }]
      }
    },
    {
      scenarioName: "Sofa King Cheap",
      payout: 12e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
        place: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
        stoke: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }]
      }
    },
    {
      scenarioName: "Specter of Destruction",
      payout: 74e3,
      actions: {
        evidence: [{ resourceId: RESOURCE.ELEPHANT_STATUE, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }]
      },
      needsVerification: true
    },
    {
      scenarioName: "Spirit Level",
      payout: 28e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }]
      }
    },
    {
      scenarioName: "Stick to the Script",
      payout: 16e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
        place: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
        stoke: [{ resourceId: RESOURCE.HYDROGEN, qty: 2 }]
      }
    },
    {
      scenarioName: "Stink to High Heaven",
      payout: 41e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
        place: [{ resourceId: RESOURCE.KEROSENE, qty: 1 }]
      }
    },
    {
      scenarioName: "Strike While it's Hot",
      payout: 25e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
        place: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
        stoke: [{ resourceId: RESOURCE.HYDROGEN, qty: 2 }],
        stokeTime: "early"
      }
    },
    {
      scenarioName: "Stroke of Fortune",
      payout: 12e4,
      actions: {
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 6 }]
      }
    },
    {
      scenarioName: "Stroke of Fortune",
      payout: 12e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
        stoke: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }]
      }
    },
    {
      scenarioName: "Supermarket Sweep",
      payout: 265e3,
      actions: {
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 5 }],
        stoke: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }]
      }
    },
    {
      scenarioName: "Supermarket Sweep",
      payout: 265e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 5 }]
      }
    },
    {
      scenarioName: "Swansong",
      payout: 27e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
        place: [{ resourceId: RESOURCE.KEROSENE, qty: 1 }]
      }
    },
    {
      scenarioName: "Taking out the Trash",
      payout: 11e4,
      actions: {
        evidence: [{ resourceId: RESOURCE.HARD_DRIVE, qty: 1 }],
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }]
      }
    },
    {
      scenarioName: "That Place Is History",
      payout: 1e5,
      actions: {
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }]
      }
    },
    {
      scenarioName: "That Place Is History",
      payout: 118500,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }]
      }
    },
    {
      scenarioName: "The Ashes of Empire",
      payout: 19e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }]
      }
    },
    {
      scenarioName: "The Bad Samaritan",
      payout: 22e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
        stoke: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }]
      }
    },
    {
      scenarioName: "The Declaration of Inebrience",
      payout: 115e3,
      actions: {
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }]
      }
    },
    {
      scenarioName: "The Declaration of Inebrience",
      payout: 115e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }]
      }
    },
    {
      scenarioName: "The Empyre Strikes Back",
      payout: 49e3,
      actions: {
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 5 }]
      }
    },
    {
      scenarioName: "The Empyre Strikes Back",
      payout: 49e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }]
      }
    },
    {
      scenarioName: "The Fat is in the Fire",
      payout: 33e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 5 }],
        stoke: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        stokeTime: "late"
      }
    },
    {
      scenarioName: "The Fire Chief",
      payout: 13e4,
      actions: {
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 6 }]
      }
    },
    {
      scenarioName: "The Fire Chief",
      payout: 14e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
        stoke: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }]
      }
    },
    {
      scenarioName: "The Fried Piper",
      payout: 27e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
        place: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }]
      }
    },
    {
      scenarioName: "The Grass Ain't Greener",
      payout: 85e3,
      actions: {
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }],
        stoke: [{ resourceId: RESOURCE.DIESEL, qty: 1 }]
      }
    },
    {
      scenarioName: "The Grass Ain't Greener",
      payout: 85e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }]
      }
    },
    {
      scenarioName: "The Male Gaze",
      payout: 13e4,
      actions: {
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }]
      }
    },
    {
      scenarioName: "The Male Gaze",
      payout: 11e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }]
      }
    },
    {
      scenarioName: "The Midnight Oil",
      payout: 63e3,
      actions: {
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }]
      }
    },
    {
      scenarioName: "The Midnight Oil",
      payout: 75e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }]
      }
    },
    {
      scenarioName: "The Plane Truth",
      payout: 38e3,
      actions: {
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }]
      }
    },
    {
      scenarioName: "The Plane Truth",
      payout: 25e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }]
      }
    },
    {
      scenarioName: "The Savage Beast",
      payout: 16e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }]
      }
    },
    {
      scenarioName: "The Smoking Gun",
      payout: 47e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
        place: [{ resourceId: RESOURCE.KEROSENE, qty: 4 }]
      }
    },
    {
      scenarioName: "The Waiting Game",
      payout: 12e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }]
      }
    },
    {
      scenarioName: "Third-Degree Burn",
      payout: 25500,
      actions: {
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }]
      }
    },
    {
      scenarioName: "Third-Degree Burn",
      payout: 29e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }]
      }
    },
    {
      scenarioName: "To the Manor Scorned",
      payout: 75500,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }]
      }
    },
    {
      scenarioName: "Totally Armless",
      payout: 44e3,
      actions: {
        place: [{ resourceId: RESOURCE.KEROSENE, qty: 2 }]
      }
    },
    {
      scenarioName: "Totally Armless",
      payout: 35e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }]
      }
    },
    {
      scenarioName: "Turn up the Heat",
      payout: 9e4,
      actions: {
        evidence: [{ resourceId: RESOURCE.COMPASS, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }]
      }
    },
    {
      scenarioName: "Turn up the Heat",
      payout: 76e3,
      actions: {
        evidence: [{ resourceId: RESOURCE.COMPASS, qty: 1 }],
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }]
      }
    },
    {
      scenarioName: "Twisted Firestarter",
      payout: 32e3,
      actions: {
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }]
      }
    },
    {
      scenarioName: "Twisted Firestarter",
      payout: 23e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }]
      }
    },
    {
      scenarioName: "Uber Heats",
      payout: 78e3,
      actions: {
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }]
      }
    },
    {
      scenarioName: "Uber Heats",
      payout: 59e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }]
      }
    },
    {
      scenarioName: "Under the Table",
      payout: 4e5,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }]
      },
      needsVerification: true
    },
    {
      scenarioName: "Unpopular Mechanics",
      payout: 4500,
      actions: {
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }]
      }
    },
    {
      scenarioName: "Unpopular Mechanics",
      payout: 8600,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }]
      }
    },
    {
      scenarioName: "Unspilled Beans",
      payout: 22e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
        place: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
        stoke: [{ resourceId: RESOURCE.HYDROGEN, qty: 2 }]
      }
    },
    {
      scenarioName: "Visions of the Savory",
      payout: 7e4,
      actions: {
        evidence: [{ resourceId: RESOURCE.FAMILY_PHOTO, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }]
      }
    },
    {
      scenarioName: "Visions of the Savory",
      payout: 11e4,
      actions: {
        evidence: [{ resourceId: RESOURCE.FAMILY_PHOTO, qty: 1 }],
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }]
      }
    },
    {
      scenarioName: "Waist Not, Want Not",
      payout: 21e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }]
      }
    },
    {
      scenarioName: "Wedded to the Lie",
      payout: 81e3,
      actions: {
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }]
      }
    },
    {
      scenarioName: "Wedded to the Lie",
      payout: 69e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }]
      }
    },
    {
      scenarioName: "Wet Behind the Ears",
      payout: 24e4,
      actions: {
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }]
      }
    },
    {
      scenarioName: "Wet Behind the Ears",
      payout: 2e5,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }]
      }
    },
    {
      scenarioName: "Where There's a Will",
      payout: 23e3,
      actions: {
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }]
      }
    },
    {
      scenarioName: "Where There's a Will",
      payout: 52e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }]
      }
    },
    {
      scenarioName: "Whiskey Business",
      payout: 9e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
        place: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
        stoke: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }]
      }
    },
    {
      scenarioName: "Wired for War",
      payout: 43e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 8 }]
      }
    },
    {
      scenarioName: "Womb With a View",
      payout: 95e3,
      actions: {
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }]
      }
    },
    {
      scenarioName: "Womb With a View",
      payout: 78500,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }]
      }
    },
    {
      scenarioName: "Workplace Burnout",
      payout: 1e5,
      actions: {
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }]
      }
    },
    {
      scenarioName: "Workplace Burnout",
      payout: 73e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }]
      }
    },
    {
      scenarioName: "You're Fired!",
      payout: 15e4,
      actions: {
        evidence: [{ resourceId: RESOURCE.LIPSTICK, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }]
      },
      needsVerification: true
    },
    {
      scenarioName: "A Bitter Taste",
      payout: 0,
      actions: { place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }] },
      needsVerification: true
    },
    {
      scenarioName: "Blown to High Heaven",
      payout: 0,
      actions: { place: [{ resourceId: RESOURCE.OXYGEN, qty: 1 }] },
      needsVerification: true
    },
    {
      scenarioName: "Bugging Me",
      payout: 0,
      actions: { place: [{ resourceId: RESOURCE.OXYGEN, qty: 2 }] },
      needsVerification: true
    },
    {
      scenarioName: "Hell Fire",
      payout: 0,
      actions: { place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }] },
      needsVerification: true
    },
    {
      scenarioName: "Bummed Out",
      payout: 0,
      actions: { place: [{ resourceId: RESOURCE.KEROSENE, qty: 3 }] },
      needsVerification: true
    },
    {
      scenarioName: "Finish Line",
      payout: 0,
      actions: { place: [{ resourceId: RESOURCE.KEROSENE, qty: 1 }], stoke: [{ resourceId: RESOURCE.METHANE, qty: 1 }] },
      needsVerification: true
    },
    {
      scenarioName: "Cut to the Chase",
      payout: 0,
      actions: { place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }] },
      needsVerification: true
    },
    {
      scenarioName: "Hot Under the Collar",
      payout: 0,
      actions: { place: [{ resourceId: RESOURCE.THERMITE, qty: 1 }] },
      needsVerification: true
    },
    {
      scenarioName: "Improving the Odds",
      payout: 0,
      actions: { place: [{ resourceId: RESOURCE.DIESEL, qty: 1 }], stoke: [{ resourceId: RESOURCE.DIESEL, qty: 1 }] },
      needsVerification: true
    },
    {
      scenarioName: "Cooking Time",
      payout: 0,
      actions: { place: [{ resourceId: RESOURCE.DIESEL, qty: 1 }], stoke: [{ resourceId: RESOURCE.DIESEL, qty: 1 }] },
      needsVerification: true
    }
  ];

  // src/userscripts/arsonists-ledger/scenarios.ts
  var root = typeof unsafeWindow !== "undefined" ? unsafeWindow : window;
  if (!root["BalaclavaScenarios"]) {
    root["BalaclavaScenarios"] = { SCENARIOS, CATALOG, CATALOG_UPDATED };
  }
})();
