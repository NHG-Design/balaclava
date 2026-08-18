"use strict";
(() => {
  // src/data/catalog.ts
  var CATALOG_UPDATED = "2026-08-18";
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
    [RESOURCE.GASOLINE]: { id: RESOURCE.GASOLINE, name: "Gasoline", kind: "fuel", category: "liquid", isTool: false, defaultPrice: 492, tornId: 172 },
    [RESOURCE.DIESEL]: { id: RESOURCE.DIESEL, name: "Diesel", kind: "fuel", category: "liquid", isTool: false, defaultPrice: 4951, tornId: 1458 },
    [RESOURCE.KEROSENE]: { id: RESOURCE.KEROSENE, name: "Kerosene", kind: "fuel", category: "liquid", isTool: false, defaultPrice: 21598, tornId: 1457 },
    // Solids
    [RESOURCE.MAGNESIUM]: { id: RESOURCE.MAGNESIUM, name: "Magnesium Shavings", kind: "fuel", category: "solid", isTool: false, defaultPrice: 64401, tornId: 1462 },
    [RESOURCE.THERMITE]: { id: RESOURCE.THERMITE, name: "Thermite", kind: "fuel", category: "solid", isTool: false, defaultPrice: 104139, tornId: 1461 },
    [RESOURCE.POTASSIUM_NITRATE]: { id: RESOURCE.POTASSIUM_NITRATE, name: "Potassium Nitrate", kind: "fuel", category: "solid", isTool: false, defaultPrice: 53308, tornId: 1264 },
    // Gases
    [RESOURCE.OXYGEN]: { id: RESOURCE.OXYGEN, name: "Oxygen Tank", kind: "fuel", category: "gaseous", isTool: false, defaultPrice: 30111, tornId: 1219 },
    [RESOURCE.METHANE]: { id: RESOURCE.METHANE, name: "Methane Tank", kind: "fuel", category: "gaseous", isTool: false, defaultPrice: 22100, tornId: 1460 },
    [RESOURCE.HYDROGEN]: { id: RESOURCE.HYDROGEN, name: "Hydrogen Tank", kind: "fuel", category: "gaseous", isTool: false, defaultPrice: 22088, tornId: 1459 },
    // Igniters
    [RESOURCE.LIGHTER]: { id: RESOURCE.LIGHTER, name: "Windproof Lighter", kind: "tool", category: "igniter", isTool: true, defaultPrice: 2634, tornId: 544 },
    [RESOURCE.MOLOTOV]: { id: RESOURCE.MOLOTOV, name: "Molotov Cocktail", kind: "tool", category: "igniter", isTool: false, defaultPrice: 77824, tornId: 742 },
    [RESOURCE.FLAMETHROWER]: { id: RESOURCE.FLAMETHROWER, name: "Flamethrower", kind: "tool", category: "igniter", isTool: true, defaultPrice: 2530546, tornId: 255 },
    // Dampeners
    [RESOURCE.BLANKET]: { id: RESOURCE.BLANKET, name: "Blanket", kind: "tool", category: "dampener", isTool: true, defaultPrice: 6675, tornId: 1235 },
    [RESOURCE.SAND]: { id: RESOURCE.SAND, name: "Sand", kind: "tool", category: "dampener", isTool: false, defaultPrice: 24374, tornId: 833 },
    [RESOURCE.FIRE_EXTINGUISHER]: { id: RESOURCE.FIRE_EXTINGUISHER, name: "Fire Extinguisher", kind: "tool", category: "dampener", isTool: false, defaultPrice: 90897, tornId: 1463 },
    // Evidence
    [RESOURCE.AMMONIA]: { id: RESOURCE.AMMONIA, name: "Ammonia", kind: "evidence", category: "misc", isTool: false, defaultPrice: 2329, tornId: 1248 },
    [RESOURCE.CANNABIS]: { id: RESOURCE.CANNABIS, name: "Cannabis", kind: "evidence", category: "misc", isTool: false, defaultPrice: 6214, tornId: 196 },
    [RESOURCE.COMPASS]: { id: RESOURCE.COMPASS, name: "Compass", kind: "evidence", category: "misc", isTool: false, defaultPrice: 14007, tornId: 407 },
    [RESOURCE.DIAMOND_RING]: { id: RESOURCE.DIAMOND_RING, name: "Diamond Ring", kind: "evidence", category: "misc", isTool: false, defaultPrice: 2648, tornId: 54 },
    [RESOURCE.ELEPHANT_STATUE]: { id: RESOURCE.ELEPHANT_STATUE, name: "Elephant Statue", kind: "evidence", category: "misc", isTool: false, defaultPrice: 3998, tornId: 280 },
    [RESOURCE.FAMILY_PHOTO]: { id: RESOURCE.FAMILY_PHOTO, name: "Family Photo", kind: "evidence", category: "misc", isTool: false, defaultPrice: 579, tornId: 1089 },
    [RESOURCE.GLITTER_BOMB]: { id: RESOURCE.GLITTER_BOMB, name: "Glitter Bomb", kind: "evidence", category: "misc", isTool: false, defaultPrice: 463935, tornId: 1294 },
    [RESOURCE.GOLD_TOOTH]: { id: RESOURCE.GOLD_TOOTH, name: "Gold Tooth", kind: "evidence", category: "misc", isTool: false, defaultPrice: 13721, tornId: 1282 },
    [RESOURCE.GRENADE]: { id: RESOURCE.GRENADE, name: "Grenade", kind: "evidence", category: "misc", isTool: false, defaultPrice: 6977, tornId: 220 },
    [RESOURCE.HARD_DRIVE]: { id: RESOURCE.HARD_DRIVE, name: "Hard Drive", kind: "evidence", category: "misc", isTool: false, defaultPrice: 307, tornId: 45 },
    [RESOURCE.JADE_BUDDHA]: { id: RESOURCE.JADE_BUDDHA, name: "Jade Buddha", kind: "evidence", category: "misc", isTool: false, defaultPrice: 10970, tornId: 275 },
    [RESOURCE.KABUKI_MASK]: { id: RESOURCE.KABUKI_MASK, name: "Kabuki Mask", kind: "evidence", category: "misc", isTool: false, defaultPrice: 30747, tornId: 278 },
    [RESOURCE.LIPSTICK]: { id: RESOURCE.LIPSTICK, name: "Lipstick", kind: "evidence", category: "misc", isTool: false, defaultPrice: 205, tornId: 1085 },
    [RESOURCE.MAYAN_STATUE]: { id: RESOURCE.MAYAN_STATUE, name: "Mayan Statue", kind: "evidence", category: "misc", isTool: false, defaultPrice: 2767, tornId: 259 },
    [RESOURCE.OPIUM]: { id: RESOURCE.OPIUM, name: "Opium", kind: "evidence", category: "misc", isTool: false, defaultPrice: 24362, tornId: 200 },
    [RESOURCE.PCP]: { id: RESOURCE.PCP, name: "PCP", kind: "evidence", category: "misc", isTool: false, defaultPrice: 2804, tornId: 201 },
    [RESOURCE.PELE_CHARM]: { id: RESOURCE.PELE_CHARM, name: "Pele Charm", kind: "evidence", category: "misc", isTool: false, defaultPrice: 2970, tornId: 265 },
    [RESOURCE.RAW_IVORY]: { id: RESOURCE.RAW_IVORY, name: "Raw Ivory", kind: "evidence", category: "misc", isTool: false, defaultPrice: 70217, tornId: 358 },
    [RESOURCE.STAPLER]: { id: RESOURCE.STAPLER, name: "Stapler", kind: "evidence", category: "misc", isTool: false, defaultPrice: 7082, tornId: 1286 },
    [RESOURCE.STICK_GRENADE]: { id: RESOURCE.STICK_GRENADE, name: "Stick Grenade", kind: "evidence", category: "misc", isTool: false, defaultPrice: 14024, tornId: 221 },
    [RESOURCE.SUMO_DOLL]: { id: RESOURCE.SUMO_DOLL, name: "Sumo Doll", kind: "evidence", category: "misc", isTool: false, defaultPrice: 10071, tornId: 427 },
    [RESOURCE.SYRINGE]: { id: RESOURCE.SYRINGE, name: "Syringe", kind: "evidence", category: "misc", isTool: false, defaultPrice: 469, tornId: 1094 },
    [RESOURCE.TOOTHBRUSH]: { id: RESOURCE.TOOTHBRUSH, name: "Toothbrush", kind: "evidence", category: "misc", isTool: false, defaultPrice: 3366, tornId: 1272 }
  };

  // src/data/scenarios.ts
  var SCENARIOS = [
    {
      scenarioName: "A Black Mark",
      payoutMin: 21e4,
      payoutMax: 22e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
        stoke: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1, optional: true }],
        stokeTime: "late"
      }
    },
    {
      scenarioName: "A Thong of Lice and Fire",
      payoutMin: 22e4,
      payoutMax: 22e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
        stoke: [{ resourceId: RESOURCE.METHANE, qty: 1 }],
        stokeTime: "early"
      }
    },
    {
      scenarioName: "Burning Ambition",
      payoutMin: 46e3,
      payoutMax: 13e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }]
      }
    },
    {
      scenarioName: "Burning Calories",
      payoutMin: 1e5,
      payoutMax: 1e5,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }]
      }
    },
    {
      scenarioName: "Child's Play",
      payoutMin: 23e3,
      payoutMax: 43e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }]
      }
    },
    {
      scenarioName: "Cooked and Burned",
      payoutMin: 73e3,
      payoutMax: 79e3,
      actions: {
        evidence: [{ resourceId: RESOURCE.AMMONIA, qty: 1 }],
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }]
      }
    },
    {
      scenarioName: "Final Cut",
      payoutMin: 14e4,
      payoutMax: 18e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
        stoke: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1, optional: true }],
        stokeTime: "98%"
      }
    },
    {
      scenarioName: "From the Ashes",
      payoutMin: 12e4,
      payoutMax: 17e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }]
      }
    },
    {
      scenarioName: "Going Viral",
      payoutMin: 16e4,
      payoutMax: 19e4,
      actions: {
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }]
      }
    },
    {
      scenarioName: "Green With Envy",
      payoutMin: 12e4,
      payoutMax: 13e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }]
      }
    },
    {
      scenarioName: "Hot Pursuit",
      payoutMin: 14e3,
      payoutMax: 5e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }]
      }
    },
    {
      scenarioName: "Kindling Spirits",
      payoutMin: 92500,
      payoutMax: 92500,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }]
      }
    },
    {
      scenarioName: "Needles to Say",
      payoutMin: 39e3,
      payoutMax: 45e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }]
      }
    },
    {
      scenarioName: "Off the Market",
      payoutMin: 155e3,
      payoutMax: 21e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
        stoke: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
        stokeTime: "early"
      }
    },
    {
      scenarioName: "Old School",
      payoutMin: 62500,
      payoutMax: 77e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }]
      }
    },
    {
      scenarioName: "One Rotten Apple",
      payoutMin: 18e4,
      payoutMax: 19e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }]
      }
    },
    {
      scenarioName: "Party Pooper",
      payoutMin: 62e3,
      payoutMax: 62e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }]
      }
    },
    {
      scenarioName: "Raze the Steaks",
      payoutMin: 25e4,
      payoutMax: 26e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 5 }]
      }
    },
    {
      scenarioName: "Burn the Deck",
      payoutMin: 96e3,
      payoutMax: 13e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }]
      }
    },
    {
      scenarioName: "Boom Industry",
      payoutMin: 1e5,
      payoutMax: 13e4,
      actions: {
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
        ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }]
      }
    },
    {
      scenarioName: "Igniting Curiosity",
      payoutMin: 25e4,
      payoutMax: 28e4,
      actions: {
        evidence: [{ resourceId: RESOURCE.SUMO_DOLL, qty: 1 }],
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }]
      }
    },
    {
      scenarioName: "Burn Rubber",
      payoutMin: 67e3,
      payoutMax: 82e3,
      actions: {
        evidence: [{ resourceId: RESOURCE.MAYAN_STATUE, qty: 1 }],
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }]
      }
    },
    {
      scenarioName: "Hot out of the Gate",
      payoutMin: 91e3,
      payoutMax: 96e3,
      actions: {
        evidence: [{ resourceId: RESOURCE.GOLD_TOOTH, qty: 1 }],
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }]
      }
    },
    {
      scenarioName: "Bald Faced Destruction",
      payoutMin: 245e3,
      payoutMax: 27e4,
      actions: {
        evidence: [{ resourceId: RESOURCE.RAW_IVORY, qty: 1 }],
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }]
      }
    },
    {
      scenarioName: "Blaze of Glory",
      payoutMin: 18e4,
      payoutMax: 2e5,
      actions: {
        evidence: [{ resourceId: RESOURCE.TOOTHBRUSH, qty: 1 }],
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
        stoke: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 2 }],
        stokeTime: "late"
      }
    },
    {
      scenarioName: "A Treat for the Tricked",
      payoutMin: 71e3,
      payoutMax: 11e4,
      actions: {
        evidence: [{ resourceId: RESOURCE.KABUKI_MASK, qty: 1 }],
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }]
      }
    },
    {
      scenarioName: "Muscling In",
      payoutMin: 90500,
      payoutMax: 2e5,
      actions: {
        evidence: [{ resourceId: RESOURCE.SYRINGE, qty: 1 }],
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [
          { resourceId: RESOURCE.GASOLINE, qty: 2 },
          { resourceId: RESOURCE.MAGNESIUM, qty: 1 }
        ]
      }
    },
    {
      scenarioName: "Banking on It",
      payoutMin: 18e4,
      payoutMax: 22e4,
      actions: {
        evidence: [{ resourceId: RESOURCE.STAPLER, qty: 1 }],
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }]
      }
    },
    {
      scenarioName: "Planted",
      payoutMin: 12e4,
      payoutMax: 13e4,
      actions: {
        evidence: [{ resourceId: RESOURCE.PELE_CHARM, qty: 1 }],
        ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }]
      }
    },
    {
      scenarioName: "Flame and Fortune",
      payoutMin: 58e4,
      payoutMax: 7e5,
      actions: {
        place: [{ resourceId: RESOURCE.KEROSENE, qty: 3 }],
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }]
      }
    },
    {
      scenarioName: "Cache and Burn",
      payoutMin: 49e4,
      payoutMax: 51e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.KEROSENE, qty: 4 }]
      }
    },
    {
      scenarioName: "Lock, Stock, and Barrel",
      payoutMin: 22e4,
      payoutMax: 24e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
        stoke: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
        stokeTime: "early"
      }
    },
    {
      scenarioName: "Letter of the Law",
      payoutMin: 36e4,
      payoutMax: 41e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
        stoke: [{ resourceId: RESOURCE.HYDROGEN, qty: 2 }],
        stokeTime: "early"
      }
    },
    {
      scenarioName: "Gentrifried",
      payoutMin: 23e4,
      payoutMax: 23e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
        stoke: [{ resourceId: RESOURCE.POTASSIUM_NITRATE, qty: 2 }]
      }
    },
    {
      scenarioName: "A Burnt Child Dreads the Fire",
      payoutMin: 2e5,
      payoutMax: 29e4,
      actions: {
        place: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        stoke: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
        stokeTime: "late"
      }
    },
    {
      scenarioName: "A Dirty Job",
      payoutMin: 32e3,
      payoutMax: 43e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }]
      }
    },
    {
      scenarioName: "A Fungus Among Us",
      payoutMin: 34e3,
      payoutMax: 46e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }]
      }
    },
    {
      scenarioName: "A Hot Lead",
      payoutMin: 22e3,
      payoutMax: 44e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 6 }]
      }
    },
    {
      scenarioName: "A Mug's Game",
      payoutMin: 55e3,
      payoutMax: 55e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }]
      }
    },
    {
      scenarioName: "A Problem Shared",
      payoutMin: 18e4,
      payoutMax: 18e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }],
        stoke: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }]
      }
    },
    {
      scenarioName: "A Rash Decision",
      payoutMin: 11e3,
      payoutMax: 17e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
        stoke: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
        stokeTime: "late"
      }
    },
    {
      scenarioName: "All Mouth and Trousers",
      payoutMin: 56e3,
      payoutMax: 78e3,
      actions: {
        evidence: [{ resourceId: RESOURCE.DIAMOND_RING, qty: 1 }],
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }]
      }
    },
    {
      scenarioName: "Always Read the Label",
      payoutMin: 17e4,
      payoutMax: 17e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 5 }],
        stoke: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }]
      }
    },
    {
      scenarioName: "Anon Starter",
      payoutMin: 31e3,
      payoutMax: 33e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }]
      }
    },
    {
      scenarioName: "Apart of the Problem",
      payoutMin: 24e4,
      payoutMax: 3e5,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }],
        stoke: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        stokeTime: "late"
      }
    },
    {
      scenarioName: "Ash or Credit?",
      payoutMin: 18e4,
      payoutMax: 23e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
        stoke: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
        stokeTime: "early"
      }
    },
    {
      scenarioName: "Ashes to Ancestors",
      payoutMin: 9e4,
      payoutMax: 9e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 5 }]
      }
    },
    {
      scenarioName: "Back, Sack, and Crack",
      payoutMin: 3e5,
      payoutMax: 32e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.HYDROGEN, qty: 2 }]
      }
    },
    {
      scenarioName: "Baewatch",
      payoutMin: 13e3,
      payoutMax: 16e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }]
      }
    },
    {
      scenarioName: "Bagged and Tagged",
      payoutMin: 1600,
      payoutMax: 19e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }]
      }
    },
    {
      scenarioName: "Bang For Your Buck",
      payoutMin: 44e3,
      payoutMax: 5e4,
      actions: {
        evidence: [{ resourceId: RESOURCE.GRENADE, qty: 1 }],
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }]
      }
    },
    {
      scenarioName: "Beach Bum",
      payoutMin: 18e3,
      payoutMax: 2e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }]
      }
    },
    {
      scenarioName: "Beat the Odds",
      payoutMin: 33e4,
      payoutMax: 35e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }]
      }
    },
    {
      scenarioName: "Beggars Can't be Choosers",
      payoutMin: 48e4,
      payoutMax: 57e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [
          { resourceId: RESOURCE.GASOLINE, qty: 5 },
          { resourceId: RESOURCE.THERMITE, qty: 1 },
          { resourceId: RESOURCE.MAGNESIUM, qty: 1 }
        ]
      }
    },
    {
      scenarioName: "Beyond Repair",
      payoutMin: 93500,
      payoutMax: 93500,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }],
        stoke: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }]
      },
      needsVerification: true
    },
    {
      scenarioName: "Body of Evidence",
      payoutMin: 105e3,
      payoutMax: 105e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }],
        stoke: [{ resourceId: RESOURCE.POTASSIUM_NITRATE, qty: 1 }]
      }
    },
    {
      scenarioName: "Bone of Contention",
      payoutMin: 13e3,
      payoutMax: 43e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
        dampen: [{ resourceId: RESOURCE.BLANKET, qty: 1 }]
      }
    },
    {
      scenarioName: "Boxing Clever",
      payoutMin: 3e5,
      payoutMax: 36e4,
      actions: {
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }]
      }
    },
    {
      scenarioName: "Bright Spark",
      payoutMin: 275e3,
      payoutMax: 275e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
        place: [{ resourceId: RESOURCE.HYDROGEN, qty: 2 }],
        stoke: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
        stokeTime: "early"
      }
    },
    {
      scenarioName: "Burn After Screening",
      payoutMin: 1e5,
      payoutMax: 12e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }]
      }
    },
    {
      scenarioName: "Burn Notice",
      payoutMin: 175e3,
      payoutMax: 18e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [
          { resourceId: RESOURCE.GASOLINE, qty: 2 },
          { resourceId: RESOURCE.THERMITE, qty: 1 }
        ]
      }
    },
    {
      scenarioName: "Burned by Stupidity",
      payoutMin: 25e3,
      payoutMax: 33e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
        place: [{ resourceId: RESOURCE.KEROSENE, qty: 1 }]
      }
    },
    {
      scenarioName: "Burned Cookies",
      payoutMin: 81e3,
      payoutMax: 31e4,
      actions: {
        place: [{ resourceId: RESOURCE.DIESEL, qty: 8 }],
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        stoke: [{ resourceId: RESOURCE.OXYGEN, qty: 1 }],
        stokeTime: "early"
      }
    },
    {
      scenarioName: "Burning Liability",
      payoutMin: 16e4,
      payoutMax: 16e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
        place: [{ resourceId: RESOURCE.HYDROGEN, qty: 2 }],
        stoke: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
        stokeTime: "late"
      }
    },
    {
      scenarioName: "Burning Memory",
      payoutMin: 32e3,
      payoutMax: 4e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }]
      }
    },
    {
      scenarioName: "Burning Through Cash",
      payoutMin: 105e3,
      payoutMax: 12e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }]
      }
    },
    {
      scenarioName: "Burnt Ends",
      payoutMin: 17e4,
      payoutMax: 19e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }],
        stoke: [{ resourceId: RESOURCE.LIGHTER, qty: 1, optional: true }],
        stokeTime: "late"
      }
    },
    {
      scenarioName: "Burn up the Dancefloor",
      payoutMin: 175e3,
      payoutMax: 19e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }]
      }
    },
    {
      scenarioName: "Camera Tricks",
      payoutMin: 115e3,
      payoutMax: 12e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
        stoke: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
        stokeTime: "late"
      }
    },
    {
      scenarioName: "Carrying a Torch",
      payoutMin: 44500,
      payoutMax: 9e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }]
      }
    },
    {
      scenarioName: "Chance of Redemption",
      payoutMin: 59e3,
      payoutMax: 82e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }]
      }
    },
    {
      scenarioName: "Charcoal Sketch",
      payoutMin: 39e3,
      payoutMax: 68e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }]
      }
    },
    {
      scenarioName: "Chasing Targets",
      payoutMin: 24e3,
      payoutMax: 37e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }]
      }
    },
    {
      scenarioName: "Checking Out",
      payoutMin: 23e4,
      payoutMax: 36e4,
      actions: {
        place: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
        ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
        stoke: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
        stokeTime: "early"
      }
    },
    {
      scenarioName: "Claim to Flame",
      payoutMin: 33500,
      payoutMax: 43e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }]
      }
    },
    {
      scenarioName: "Clean Sweep",
      payoutMin: 15e4,
      payoutMax: 15e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [
          { resourceId: RESOURCE.GASOLINE, qty: 2 },
          { resourceId: RESOURCE.POTASSIUM_NITRATE, qty: 1 }
        ],
        stoke: [
          { resourceId: RESOURCE.DIESEL, qty: 1 },
          { resourceId: RESOURCE.DIESEL, qty: 2, optional: true }
        ],
        stokeTime: "late"
      }
    },
    {
      scenarioName: "Cleansed Through Fire",
      payoutMin: 46e3,
      payoutMax: 23e4,
      actions: {
        place: [{ resourceId: RESOURCE.DIESEL, qty: 1 }, { resourceId: RESOURCE.KEROSENE, qty: 1 }],
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }]
      }
    },
    {
      scenarioName: "Clinical Exposure",
      payoutMin: 165e3,
      payoutMax: 18e4,
      actions: {
        evidence: [{ resourceId: RESOURCE.OPIUM, qty: 1 }],
        ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }]
      }
    },
    {
      scenarioName: "Cold Brew Reality",
      payoutMin: 14e4,
      payoutMax: 17e4,
      actions: {
        place: [{ resourceId: RESOURCE.KEROSENE, qty: 2 }],
        ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
        stoke: [{ resourceId: RESOURCE.METHANE, qty: 1 }],
        stokeTime: "early"
      }
    },
    {
      scenarioName: "Cold Feet",
      payoutMin: 12e4,
      payoutMax: 12e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [
          { resourceId: RESOURCE.GASOLINE, qty: 2 },
          { resourceId: RESOURCE.POTASSIUM_NITRATE, qty: 1 }
        ],
        stoke: [{ resourceId: RESOURCE.DIESEL, qty: 1 }],
        stokeTime: "late"
      }
    },
    {
      scenarioName: "Cook it Rare",
      payoutMin: 33e4,
      payoutMax: 38e4,
      actions: {
        place: [{ resourceId: RESOURCE.KEROSENE, qty: 3 }],
        ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
        stoke: [{ resourceId: RESOURCE.METHANE, qty: 2 }],
        stokeTime: "early"
      }
    },
    {
      scenarioName: "Cooking the Books",
      payoutMin: 25e3,
      payoutMax: 38e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }]
      }
    },
    {
      scenarioName: "Cop Some Heat",
      payoutMin: 19e3,
      payoutMax: 63e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }]
      }
    },
    {
      scenarioName: "Crafty Devil",
      payoutMin: 1e5,
      payoutMax: 106e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }]
      }
    },
    {
      scenarioName: "Crisp Bills",
      payoutMin: 39e3,
      payoutMax: 52e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }]
      }
    },
    {
      scenarioName: "Curtain Call",
      payoutMin: 57e3,
      payoutMax: 79e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
        place: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }]
      }
    },
    {
      scenarioName: "Cut Corners",
      payoutMin: 2e5,
      payoutMax: 23e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
        place: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
        stoke: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }]
      }
    },
    {
      scenarioName: "Daddy's Girl",
      payoutMin: 33e4,
      payoutMax: 33e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
        place: [{ resourceId: RESOURCE.KEROSENE, qty: 1 }],
        stoke: [
          { resourceId: RESOURCE.METHANE, qty: 1 },
          { resourceId: RESOURCE.HYDROGEN, qty: 1 }
        ],
        stokeTime: "early"
      }
    },
    {
      scenarioName: "Damned If You Don't",
      payoutMin: 74e3,
      payoutMax: 15e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }]
      }
    },
    {
      scenarioName: "Dead Giveaway",
      payoutMin: 29e3,
      payoutMax: 29e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
        place: [{ resourceId: RESOURCE.KEROSENE, qty: 1 }]
      }
    },
    {
      scenarioName: "The Devil's in the Details",
      payoutMin: 13e4,
      payoutMax: 13e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.DIESEL, qty: 1 }],
        stoke: [{ resourceId: RESOURCE.POTASSIUM_NITRATE, qty: 1 }]
      }
    },
    {
      scenarioName: "Dine and Dash",
      payoutMin: 95e3,
      payoutMax: 95e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
        place: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
        stoke: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
        stokeTime: "early"
      }
    },
    {
      scenarioName: "Dirty Money",
      payoutMin: 36e4,
      payoutMax: 42e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
        place: [{ resourceId: RESOURCE.KEROSENE, qty: 3 }]
      }
    },
    {
      scenarioName: "Disco Inferno",
      payoutMin: 48e3,
      payoutMax: 14e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
        place: [
          { resourceId: RESOURCE.GASOLINE, qty: 1 },
          { resourceId: RESOURCE.HYDROGEN, qty: 1 },
          { resourceId: RESOURCE.METHANE, qty: 1 }
        ]
      }
    },
    {
      scenarioName: "Don't Hate the Player",
      payoutMin: 32e3,
      payoutMax: 37e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }]
      }
    },
    {
      scenarioName: "Eight Lives",
      payoutMin: 6e3,
      payoutMax: 9e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }]
      }
    },
    {
      scenarioName: "Emotional Wreck",
      payoutMin: 14e4,
      payoutMax: 16e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [
          { resourceId: RESOURCE.GASOLINE, qty: 3 },
          { resourceId: RESOURCE.MAGNESIUM, qty: 1 }
        ]
      }
    },
    {
      scenarioName: "End of the Line",
      payoutMin: 78e3,
      payoutMax: 15e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }]
      }
    },
    {
      scenarioName: "Faction Fiction",
      payoutMin: 64500,
      payoutMax: 84e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }]
      }
    },
    {
      scenarioName: "Family Feud",
      payoutMin: 2e4,
      payoutMax: 22e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }]
      }
    },
    {
      scenarioName: "Fan the Flames",
      payoutMin: 33e3,
      payoutMax: 96e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
        place: [
          { resourceId: RESOURCE.GASOLINE, qty: 1 },
          { resourceId: RESOURCE.METHANE, qty: 1 }
        ],
        stoke: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
        stokeTime: "late"
      }
    },
    {
      scenarioName: "Fight Fire With Fire",
      payoutMin: 37e3,
      payoutMax: 81e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }]
      }
    },
    {
      scenarioName: "Final Markdown",
      payoutMin: 49e3,
      payoutMax: 1e5,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }]
      }
    },
    {
      scenarioName: "Fire and Brimstone",
      payoutMin: 125e3,
      payoutMax: 14e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }]
      }
    },
    {
      scenarioName: "Fire Burn and Cauldron Bubble",
      payoutMin: 17e4,
      payoutMax: 18e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }]
      }
    },
    {
      scenarioName: "Fire in the Belly",
      payoutMin: 17e3,
      payoutMax: 4e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }]
      }
    },
    {
      scenarioName: "Fire Kills 99.9% of Bacteria",
      payoutMin: 305e3,
      payoutMax: 33e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
        place: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }]
      }
    },
    {
      scenarioName: "Fire Sale",
      payoutMin: 1e4,
      payoutMax: 12e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
        place: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }]
      }
    },
    {
      scenarioName: "Follow the Leader",
      payoutMin: 69e3,
      payoutMax: 13e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.HYDROGEN, qty: 2 }],
        stoke: [{ resourceId: RESOURCE.METHANE, qty: 1 }],
        stokeTime: "late"
      }
    },
    {
      scenarioName: "For Closure",
      payoutMin: 16e3,
      payoutMax: 42e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }]
      }
    },
    {
      scenarioName: "Foul Play",
      payoutMin: 12e4,
      payoutMax: 14e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }]
      }
    },
    {
      scenarioName: "Gay Frogs",
      payoutMin: 23e3,
      payoutMax: 34e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }]
      }
    },
    {
      scenarioName: "Get Wrecked",
      payoutMin: 84e3,
      payoutMax: 96e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }]
      }
    },
    {
      scenarioName: "Gym'll Fix It",
      payoutMin: 52e3,
      payoutMax: 52e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }]
      }
    },
    {
      scenarioName: "Hair Today...",
      payoutMin: 93e3,
      payoutMax: 93e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
        place: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
        stoke: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
        stokeTime: "early"
      }
    },
    {
      scenarioName: "Heat the Rich",
      payoutMin: 4e4,
      payoutMax: 69e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }]
      }
    },
    {
      scenarioName: "Hide and Seek",
      payoutMin: 33e3,
      payoutMax: 33e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }]
      }
    },
    {
      scenarioName: "High Time",
      payoutMin: 1e4,
      payoutMax: 11e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }]
      }
    },
    {
      scenarioName: "Hire and Fire",
      payoutMin: 57e3,
      payoutMax: 73e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }]
      }
    },
    {
      scenarioName: "Hold Fire",
      payoutMin: 11e4,
      payoutMax: 12e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }]
      }
    },
    {
      scenarioName: "Holy Smokes",
      payoutMin: 56500,
      payoutMax: 73e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }]
      }
    },
    {
      scenarioName: "Home and Dry",
      payoutMin: 49e3,
      payoutMax: 89e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }]
      }
    },
    {
      scenarioName: "Hostile Takeover",
      payoutMin: 3e5,
      payoutMax: 32e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }]
      }
    },
    {
      scenarioName: "Hot Dinners",
      payoutMin: 55e3,
      payoutMax: 55e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.DIESEL, qty: 1 }]
      }
    },
    {
      scenarioName: "Hot Dog",
      payoutMin: 30500,
      payoutMax: 34e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }]
      }
    },
    {
      scenarioName: "Hot Gossip",
      payoutMin: 62e3,
      payoutMax: 104e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }]
      }
    },
    {
      scenarioName: "Hot Off the Press",
      payoutMin: 18e3,
      payoutMax: 3e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }]
      }
    },
    {
      scenarioName: "Hot on the Trail",
      payoutMin: 39e4,
      payoutMax: 46e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }]
      }
    },
    {
      scenarioName: "Hot Profit",
      payoutMin: 57500,
      payoutMax: 1e5,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }]
      }
    },
    {
      scenarioName: "Hot Trend",
      payoutMin: 57e3,
      payoutMax: 21e4,
      actions: {
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        stoke: [{ resourceId: RESOURCE.METHANE, qty: 2 }],
        stokeTime: "early"
      }
    },
    {
      scenarioName: "House Edge",
      payoutMin: 135e3,
      payoutMax: 22e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }]
      }
    },
    {
      scenarioName: "House of Cards",
      payoutMin: 61e4,
      payoutMax: 63e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
        place: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
        stoke: [{ resourceId: RESOURCE.HYDROGEN, qty: 2 }],
        stokeTime: "early"
      }
    },
    {
      scenarioName: "In Your Debt",
      payoutMin: 33e3,
      payoutMax: 46e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
        place: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }]
      }
    },
    {
      scenarioName: "Insert Coin to Continue",
      payoutMin: 12e4,
      payoutMax: 12e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
        place: [{ resourceId: RESOURCE.HYDROGEN, qty: 2 }],
        stoke: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
        stokeTime: "late"
      }
    },
    {
      scenarioName: "It Cuts Both Ways",
      payoutMin: 20500,
      payoutMax: 29e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }]
      }
    },
    {
      scenarioName: "It's a Write Off",
      payoutMin: 21e4,
      payoutMax: 25e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
        stoke: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1, optional: true }],
        stokeTime: "late"
      }
    },
    {
      scenarioName: "It's Not All White",
      payoutMin: 14e4,
      payoutMax: 18e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
        stoke: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }]
      }
    },
    {
      scenarioName: "Landmark Decision",
      payoutMin: 28e4,
      payoutMax: 29e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 5 }],
        stoke: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1, optional: true }],
        stokeTime: "late"
      }
    },
    {
      scenarioName: "Last Lyft Home",
      payoutMin: 52e3,
      payoutMax: 97e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }]
      }
    },
    {
      scenarioName: "Light Fingered",
      payoutMin: 165e3,
      payoutMax: 19e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }]
      }
    },
    {
      scenarioName: "Like for Like",
      payoutMin: 95e3,
      payoutMax: 11e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
        place: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
        stoke: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
        stokeTime: "early"
      }
    },
    {
      scenarioName: "Liquor on the Back Row",
      payoutMin: 5e4,
      payoutMax: 5e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }]
      }
    },
    {
      scenarioName: "Local Concerns",
      payoutMin: 10500,
      payoutMax: 44e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }]
      }
    },
    {
      scenarioName: "Long Pig",
      payoutMin: 13e4,
      payoutMax: 15e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
        dampen: [{ resourceId: RESOURCE.BLANKET, qty: 2 }]
      }
    },
    {
      scenarioName: "Loud and Clear",
      payoutMin: 195e3,
      payoutMax: 21e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }]
      }
    },
    {
      scenarioName: "Lover's Quarrel",
      payoutMin: 2e4,
      payoutMax: 39e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }]
      }
    },
    {
      scenarioName: "Low Rent",
      payoutMin: 41e3,
      payoutMax: 21e4,
      actions: {
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        stoke: [{ resourceId: RESOURCE.METHANE, qty: 2 }],
        stokeTime: "early"
      }
    },
    {
      scenarioName: "Make a Killing",
      payoutMin: 34e4,
      payoutMax: 48e4,
      actions: {
        place: [{ resourceId: RESOURCE.KEROSENE, qty: 3 }],
        ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }]
      }
    },
    {
      scenarioName: "Mallrats",
      payoutMin: 41e4,
      payoutMax: 44e4,
      actions: {
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }],
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        stoke: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }]
      }
    },
    {
      scenarioName: "Marked for Salvation",
      payoutMin: 8e4,
      payoutMax: 11e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [
          { resourceId: RESOURCE.GASOLINE, qty: 1 },
          { resourceId: RESOURCE.METHANE, qty: 1 }
        ],
        stoke: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
        stokeTime: "late"
      }
    },
    {
      scenarioName: "Marx & Sparks",
      payoutMin: 125e3,
      payoutMax: 125e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }]
      }
    },
    {
      scenarioName: "Medium Rare",
      payoutMin: 33e4,
      payoutMax: 33e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
        place: [{ resourceId: RESOURCE.DIESEL, qty: 4 }]
      }
    },
    {
      scenarioName: "Mental Block",
      payoutMin: 58e4,
      payoutMax: 58e4,
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
      payoutMin: 155e3,
      payoutMax: 18e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }]
      }
    },
    {
      scenarioName: "Naked Aggression",
      payoutMin: 31500,
      payoutMax: 31500,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
        stoke: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }]
      }
    },
    {
      scenarioName: "Not a Leg to Stand on",
      payoutMin: 125e3,
      payoutMax: 22e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }]
      }
    },
    {
      scenarioName: "Oh God, Yes",
      payoutMin: 17500,
      payoutMax: 41e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }]
      }
    },
    {
      scenarioName: "On Fire at the Box Office",
      payoutMin: 1e4,
      payoutMax: 33e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }]
      }
    },
    {
      scenarioName: "Open House",
      payoutMin: 5e4,
      payoutMax: 64e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }]
      }
    },
    {
      scenarioName: "Out in the Wash",
      payoutMin: 235e3,
      payoutMax: 26e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }]
      }
    },
    {
      scenarioName: "Out with a Bang",
      payoutMin: 35e3,
      payoutMax: 42e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
        dampen: [{ resourceId: RESOURCE.BLANKET, qty: 1 }]
      }
    },
    {
      scenarioName: "Pest Control",
      payoutMin: 16e3,
      payoutMax: 19e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
        place: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }]
      }
    },
    {
      scenarioName: "Piggy in the Middle",
      payoutMin: 104e3,
      payoutMax: 11e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }]
      }
    },
    {
      scenarioName: "Playing With Fire",
      payoutMin: 21e4,
      payoutMax: 24e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }]
      }
    },
    {
      scenarioName: "Point of No Return",
      payoutMin: 9e4,
      payoutMax: 16e4,
      actions: {
        place: [
          { resourceId: RESOURCE.GASOLINE, qty: 3 },
          { resourceId: RESOURCE.THERMITE, qty: 1 }
        ],
        ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }]
      }
    },
    {
      scenarioName: "Political Firestorm",
      payoutMin: 11e3,
      payoutMax: 4e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }]
      }
    },
    {
      scenarioName: "Pyro for Pornos",
      payoutMin: 65e3,
      payoutMax: 102e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }]
      }
    },
    {
      scenarioName: "Raising Hell",
      payoutMin: 17e4,
      payoutMax: 17e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
        stoke: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        stokeTime: "late"
      }
    },
    {
      scenarioName: "Raze the Roof",
      payoutMin: 54e3,
      payoutMax: 55e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
        place: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }]
      }
    },
    {
      scenarioName: "Read the Room",
      payoutMin: 125e3,
      payoutMax: 15e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }]
      }
    },
    {
      scenarioName: "Remote Possibility",
      payoutMin: 93e3,
      payoutMax: 102500,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }]
      }
    },
    {
      scenarioName: "Rest in Peace",
      payoutMin: 20500,
      payoutMax: 3e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }]
      }
    },
    {
      scenarioName: "Ring of Fire",
      payoutMin: 11e4,
      payoutMax: 16e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
        place: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
        stoke: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }]
      }
    },
    {
      scenarioName: "Risky Business",
      payoutMin: 35e3,
      payoutMax: 5e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
        place: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }]
      }
    },
    {
      scenarioName: "Rock the Boat",
      payoutMin: 325e3,
      payoutMax: 35e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
        place: [{ resourceId: RESOURCE.DIESEL, qty: 1 }]
      }
    },
    {
      scenarioName: "Searing Irony",
      payoutMin: 25e4,
      payoutMax: 28e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }]
      }
    },
    {
      scenarioName: "Second Hand Smoke",
      payoutMin: 12e4,
      payoutMax: 22e4,
      actions: {
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        stoke: [{ resourceId: RESOURCE.METHANE, qty: 2 }],
        stokeTime: "early"
      }
    },
    {
      scenarioName: "See No Evil",
      payoutMin: 71e3,
      payoutMax: 8e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 5 }]
      }
    },
    {
      scenarioName: "Set 'Em Straight",
      payoutMin: 31e4,
      payoutMax: 35e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
        place: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
        stoke: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
        stokeTime: "early"
      }
    },
    {
      scenarioName: "Shaky Investment",
      payoutMin: 8e4,
      payoutMax: 11e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [
          { resourceId: RESOURCE.HYDROGEN, qty: 1 },
          { resourceId: RESOURCE.KEROSENE, qty: 1 }
        ]
      }
    },
    {
      scenarioName: "Shielded from the Truth",
      payoutMin: 16e3,
      payoutMax: 24e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }]
      }
    },
    {
      scenarioName: "Short Shelf Life",
      payoutMin: 395e3,
      payoutMax: 44e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }]
      }
    },
    {
      scenarioName: "Smoke on the Water",
      payoutMin: 8600,
      payoutMax: 1e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }]
      }
    },
    {
      scenarioName: "Smoke Out",
      payoutMin: 21e3,
      payoutMax: 23e3,
      actions: {
        evidence: [{ resourceId: RESOURCE.CANNABIS, qty: 1 }],
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }]
      }
    },
    {
      scenarioName: "Smoke Signals",
      payoutMin: 11e4,
      payoutMax: 12e4,
      actions: {
        place: [{ resourceId: RESOURCE.DIESEL, qty: 3 }],
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }]
      }
    },
    {
      scenarioName: "Smoke Screen",
      payoutMin: 535e3,
      payoutMax: 55e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
        stoke: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1, optional: true }],
        stokeTime: "late"
      }
    },
    {
      scenarioName: "Smoke Without Fire",
      payoutMin: 2e5,
      payoutMax: 22e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }]
      }
    },
    {
      scenarioName: "Smoldering Resentment",
      payoutMin: 1e4,
      payoutMax: 17e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }]
      }
    },
    {
      scenarioName: "Sofa King Cheap",
      payoutMin: 12e4,
      payoutMax: 14e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
        place: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
        stoke: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
        stokeTime: "early"
      }
    },
    {
      scenarioName: "Specter of Destruction",
      payoutMin: 62e3,
      payoutMax: 76e3,
      actions: {
        evidence: [{ resourceId: RESOURCE.ELEPHANT_STATUE, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }]
      },
      needsVerification: true
    },
    {
      scenarioName: "Spirit Level",
      payoutMin: 28e4,
      payoutMax: 33e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }]
      }
    },
    {
      scenarioName: "Stick to the Script",
      payoutMin: 16e4,
      payoutMax: 17e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
        place: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
        stoke: [{ resourceId: RESOURCE.HYDROGEN, qty: 2 }]
      }
    },
    {
      scenarioName: "Stink to High Heaven",
      payoutMin: 41e3,
      payoutMax: 74e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
        place: [{ resourceId: RESOURCE.KEROSENE, qty: 1 }]
      }
    },
    {
      scenarioName: "Strike While it's Hot",
      payoutMin: 265e3,
      payoutMax: 3e5,
      actions: {
        ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
        place: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
        stoke: [{ resourceId: RESOURCE.HYDROGEN, qty: 2 }],
        stokeTime: "early"
      }
    },
    {
      scenarioName: "Stroke of Fortune",
      payoutMin: 12e4,
      payoutMax: 12e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }],
        stoke: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }]
      }
    },
    {
      scenarioName: "Supermarket Sweep",
      payoutMin: 29e4,
      payoutMax: 29e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 5 }]
      }
    },
    {
      scenarioName: "Swansong",
      payoutMin: 27e3,
      payoutMax: 51e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
        place: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }]
      }
    },
    {
      scenarioName: "Taking out the Trash",
      payoutMin: 11e4,
      payoutMax: 15e4,
      actions: {
        evidence: [{ resourceId: RESOURCE.HARD_DRIVE, qty: 1 }],
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [
          { resourceId: RESOURCE.GASOLINE, qty: 2 },
          { resourceId: RESOURCE.KEROSENE, qty: 2 }
        ]
      }
    },
    {
      scenarioName: "That Place Is History",
      payoutMin: 12e4,
      payoutMax: 12e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }]
      }
    },
    {
      scenarioName: "The Ashes of Empire",
      payoutMin: 175e3,
      payoutMax: 2e5,
      actions: {
        ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }]
      }
    },
    {
      scenarioName: "The Bad Samaritan",
      payoutMin: 22e3,
      payoutMax: 22e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
        stoke: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }]
      }
    },
    {
      scenarioName: "The Declaration of Inebrience",
      payoutMin: 115e3,
      payoutMax: 14e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }]
      }
    },
    {
      scenarioName: "The Empyre Strikes Back",
      payoutMin: 49e3,
      payoutMax: 5e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }]
      }
    },
    {
      scenarioName: "The Fat is in the Fire",
      payoutMin: 3e5,
      payoutMax: 34e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 6 }],
        stoke: [
          { resourceId: RESOURCE.FLAMETHROWER, qty: 3 },
          { resourceId: RESOURCE.OXYGEN, qty: 1 }
        ],
        stokeTime: "late"
      }
    },
    {
      scenarioName: "The Fire Chief",
      payoutMin: 14e4,
      payoutMax: 15e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }]
      }
    },
    {
      scenarioName: "The Fried Piper",
      payoutMin: 27e4,
      payoutMax: 32e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
        place: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }]
      }
    },
    {
      scenarioName: "The Grass Ain't Greener",
      payoutMin: 6e4,
      payoutMax: 91e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }]
      }
    },
    {
      scenarioName: "The Male Gaze",
      payoutMin: 11e4,
      payoutMax: 12e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }]
      }
    },
    {
      scenarioName: "The Midnight Oil",
      payoutMin: 75e3,
      payoutMax: 104e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }]
      }
    },
    {
      scenarioName: "The Plane Truth",
      payoutMin: 25e3,
      payoutMax: 52e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }]
      }
    },
    {
      scenarioName: "The Savage Beast",
      payoutMin: 17e4,
      payoutMax: 19e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
        stoke: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        stokeTime: "late"
      }
    },
    {
      scenarioName: "The Smoking Gun",
      payoutMin: 43e4,
      payoutMax: 49e4,
      actions: {
        place: [{ resourceId: RESOURCE.KEROSENE, qty: 5 }],
        ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }]
      }
    },
    {
      scenarioName: "The Waiting Game",
      payoutMin: 1e5,
      payoutMax: 13e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }]
      }
    },
    {
      scenarioName: "Third-Degree Burn",
      payoutMin: 29e3,
      payoutMax: 58e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }]
      }
    },
    {
      scenarioName: "To the Manor Scorned",
      payoutMin: 75500,
      payoutMax: 1e5,
      actions: {
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }],
        ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }]
      }
    },
    {
      scenarioName: "Totally Armless",
      payoutMin: 35e3,
      payoutMax: 86e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.KEROSENE, qty: 2 }],
        stoke: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
        stokeTime: "late"
      }
    },
    {
      scenarioName: "Turn up the Heat",
      payoutMin: 76e3,
      payoutMax: 76e3,
      actions: {
        evidence: [{ resourceId: RESOURCE.COMPASS, qty: 1 }],
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }]
      }
    },
    {
      scenarioName: "Twisted Firestarter",
      payoutMin: 23e3,
      payoutMax: 33e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }]
      }
    },
    {
      scenarioName: "Uber Heats",
      payoutMin: 4e4,
      payoutMax: 54e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }]
      }
    },
    {
      scenarioName: "Under the Table",
      payoutMin: 4e5,
      payoutMax: 43e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }],
        stoke: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        stokeTime: "24s"
      }
    },
    {
      scenarioName: "Unpopular Mechanics",
      payoutMin: 8600,
      payoutMax: 1e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }]
      }
    },
    {
      scenarioName: "Unspilled Beans",
      payoutMin: 22e4,
      payoutMax: 22e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
        place: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
        stoke: [{ resourceId: RESOURCE.HYDROGEN, qty: 2 }],
        stokeTime: "early"
      }
    },
    {
      scenarioName: "Visions of the Savory",
      payoutMin: 11e4,
      payoutMax: 12e4,
      actions: {
        evidence: [{ resourceId: RESOURCE.FAMILY_PHOTO, qty: 1 }],
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }]
      }
    },
    {
      scenarioName: "Waist Not, Want Not",
      payoutMin: 21e4,
      payoutMax: 26e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 5 }]
      }
    },
    {
      scenarioName: "Wedded to the Lie",
      payoutMin: 69e3,
      payoutMax: 102e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }]
      }
    },
    {
      scenarioName: "Wet Behind the Ears",
      payoutMin: 2e5,
      payoutMax: 25e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
        place: [{ resourceId: RESOURCE.KEROSENE, qty: 1 }]
      }
    },
    {
      scenarioName: "Where There's a Will",
      payoutMin: 52e3,
      payoutMax: 11e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 5 }]
      }
    },
    {
      scenarioName: "Whiskey Business",
      payoutMin: 9e4,
      payoutMax: 1e5,
      actions: {
        ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
        place: [{ resourceId: RESOURCE.METHANE, qty: 2 }],
        stoke: [{ resourceId: RESOURCE.METHANE, qty: 1 }],
        stokeTime: "late"
      }
    },
    {
      scenarioName: "Wired for War",
      payoutMin: 48e4,
      payoutMax: 49e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 8 }]
      }
    },
    {
      scenarioName: "Womb With a View",
      payoutMin: 78500,
      payoutMax: 9e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }]
      }
    },
    {
      scenarioName: "Workplace Burnout",
      payoutMin: 73e3,
      payoutMax: 82e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }]
      }
    },
    {
      scenarioName: "You're Fired!",
      payoutMin: 15e4,
      payoutMax: 17e4,
      actions: {
        evidence: [{ resourceId: RESOURCE.LIPSTICK, qty: 1 }],
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }]
      },
      needsVerification: true
    },
    {
      scenarioName: "A Bitter Taste",
      payoutMin: 4e4,
      payoutMax: 55e3,
      actions: {
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }]
      }
    },
    {
      scenarioName: "Blown to High Heaven",
      payoutMin: 16e3,
      payoutMax: 94e3,
      actions: {
        place: [{ resourceId: RESOURCE.OXYGEN, qty: 1 }],
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }]
      }
    },
    {
      scenarioName: "Bugging Me",
      payoutMin: 0,
      payoutMax: 0,
      actions: { place: [{ resourceId: RESOURCE.OXYGEN, qty: 2 }] },
      needsVerification: true
    },
    {
      scenarioName: "Hell Fire",
      payoutMin: 0,
      payoutMax: 0,
      actions: { place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }] },
      needsVerification: true
    },
    {
      scenarioName: "Bummed Out",
      payoutMin: 0,
      payoutMax: 0,
      actions: { place: [{ resourceId: RESOURCE.KEROSENE, qty: 3 }] },
      needsVerification: true
    },
    {
      scenarioName: "Finish Line",
      payoutMin: 0,
      payoutMax: 0,
      actions: {
        place: [{ resourceId: RESOURCE.KEROSENE, qty: 1 }],
        stoke: [{ resourceId: RESOURCE.METHANE, qty: 1 }]
      },
      needsVerification: true
    },
    {
      scenarioName: "Cut to the Chase",
      payoutMin: 0,
      payoutMax: 0,
      actions: { place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }] },
      needsVerification: true
    },
    {
      scenarioName: "Hot Under the Collar",
      payoutMin: 0,
      payoutMax: 0,
      actions: { place: [{ resourceId: RESOURCE.THERMITE, qty: 1 }] },
      needsVerification: true
    },
    {
      scenarioName: "Improving the Odds",
      payoutMin: 0,
      payoutMax: 0,
      actions: {
        place: [{ resourceId: RESOURCE.DIESEL, qty: 1 }],
        stoke: [{ resourceId: RESOURCE.DIESEL, qty: 1 }]
      },
      needsVerification: true
    },
    {
      scenarioName: "Cooking Time",
      payoutMin: 0,
      payoutMax: 0,
      actions: {
        place: [{ resourceId: RESOURCE.DIESEL, qty: 1 }],
        stoke: [{ resourceId: RESOURCE.DIESEL, qty: 1 }]
      },
      needsVerification: true
    },
    {
      scenarioName: "Roast Beef",
      payoutMin: 14e4,
      payoutMax: 14e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.DIESEL, qty: 2 }],
        stoke: [{ resourceId: RESOURCE.DIESEL, qty: 5 }],
        stokeTime: "late"
      }
    },
    {
      scenarioName: "Stop, Drop, and Lol",
      payoutMin: 32e4,
      payoutMax: 32e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [
          { resourceId: RESOURCE.KEROSENE, qty: 2 },
          { resourceId: RESOURCE.THERMITE, qty: 2 }
        ],
        stoke: [{ resourceId: RESOURCE.POTASSIUM_NITRATE, qty: 1 }],
        stokeTime: "late"
      }
    },
    {
      scenarioName: "Shit Happens",
      payoutMin: 23e3,
      payoutMax: 23e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }]
      }
    },
    {
      scenarioName: "Doxing Clever",
      payoutMin: 14e4,
      payoutMax: 19e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [
          { resourceId: RESOURCE.GASOLINE, qty: 3 },
          { resourceId: RESOURCE.THERMITE, qty: 1 },
          { resourceId: RESOURCE.GASOLINE, qty: 2 }
        ]
      }
    },
    {
      scenarioName: "Plane and Simple",
      payoutMin: 18e4,
      payoutMax: 18e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [
          { resourceId: RESOURCE.METHANE, qty: 1 },
          { resourceId: RESOURCE.POTASSIUM_NITRATE, qty: 2 }
        ],
        stoke: [{ resourceId: RESOURCE.METHANE, qty: 2 }],
        stokeTime: "late"
      }
    },
    {
      scenarioName: "The Bolted Horse",
      payoutMin: 9e4,
      payoutMax: 9e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.OXYGEN, qty: 3 }],
        stoke: [{ resourceId: RESOURCE.OXYGEN, qty: 1 }],
        stokeTime: "late"
      }
    },
    {
      scenarioName: "Sky High Prices",
      payoutMin: 59e3,
      payoutMax: 59e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [
          { resourceId: RESOURCE.GASOLINE, qty: 4 },
          { resourceId: RESOURCE.POTASSIUM_NITRATE, qty: 1 }
        ]
      }
    }
  ];

  // src/userscripts/arsonists-ledger/scenarios.ts
  var root = typeof unsafeWindow !== "undefined" ? unsafeWindow : window;
  if (!root["BalaclavaScenarios"]) {
    root["BalaclavaScenarios"] = { SCENARIOS, CATALOG, CATALOG_UPDATED };
  }
})();
