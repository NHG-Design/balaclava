// ==UserScript==
// @name        Torn Pyromaniac's Ledger
// @namespace   https://github.com/NHG-Design/balaclava
// @version     0.1.0
// @description Arson profit-per-nerve calculator and strategy guide for Torn's Crimes page
// @icon        https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @author      Balaclava
// @match       https://www.torn.com/page.php?sid=crimes*
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       unsafeWindow
// @require     https://raw.githubusercontent.com/NHG-Design/balaclava/main/dist/balaclava-tooltip.user.js
// @run-at      document-idle
// ==/UserScript==

"use strict";
(() => {
  // src/data/catalog.ts
  var CATALOG_UPDATED = "2026-05-25";
  var RESOURCE = {
    // Liquid fuels
    GASOLINE: "gasoline",
    DIESEL: "diesel",
    KEROSENE: "kerosene",
    // Solid fuels
    MAGNESIUM: "magnesium",
    THERMITE: "thermite",
    SALTPETRE: "saltpetre",
    POTASSIUM_NITRATE: "potassium_nitrate",
    // Gaseous fuels
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
    // Liquid fuels
    [RESOURCE.GASOLINE]: { id: RESOURCE.GASOLINE, name: "Gasoline", kind: "fuel", category: "liquid", isTool: false, defaultPrice: 1500, tornId: 172 },
    [RESOURCE.DIESEL]: { id: RESOURCE.DIESEL, name: "Diesel", kind: "fuel", category: "liquid", isTool: false, defaultPrice: 2500, tornId: 1458 },
    [RESOURCE.KEROSENE]: { id: RESOURCE.KEROSENE, name: "Kerosene", kind: "fuel", category: "liquid", isTool: false, defaultPrice: 4e3, tornId: 1457 },
    // Solid fuels
    [RESOURCE.MAGNESIUM]: { id: RESOURCE.MAGNESIUM, name: "Magnesium Shavings", kind: "fuel", category: "solid", isTool: false, defaultPrice: 5e3, tornId: 1462 },
    [RESOURCE.THERMITE]: { id: RESOURCE.THERMITE, name: "Thermite", kind: "fuel", category: "solid", isTool: false, defaultPrice: 8e4, tornId: 1461 },
    [RESOURCE.SALTPETRE]: { id: RESOURCE.SALTPETRE, name: "Saltpetre", kind: "fuel", category: "solid", isTool: false, defaultPrice: 2e3 },
    [RESOURCE.POTASSIUM_NITRATE]: { id: RESOURCE.POTASSIUM_NITRATE, name: "Potassium Nitrate", kind: "fuel", category: "solid", isTool: false, defaultPrice: 5e3, tornId: 1264 },
    // Gaseous fuels
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
    // Evidence (alphabetical)
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

  // src/data/strategies.ts
  var STRATEGIES = [
    // --- Flamethrower variants listed after non-FT for the same scenario ---
    {
      scenarioName: "A Black Mark",
      payout: 21e4,
      actions: {
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
        stoke: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }]
      }
    },
    {
      scenarioName: "A Black Mark",
      payout: 21e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }]
      },
      requiresFlamethrower: true
    },
    {
      scenarioName: "Burning Ambition",
      payout: 46e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }]
      },
      requiresFlamethrower: true
    },
    {
      scenarioName: "Burning Calories",
      payout: 84e3,
      actions: {
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }]
      }
    },
    {
      scenarioName: "Burning Calories",
      payout: 1e5,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }]
      },
      requiresFlamethrower: true
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
      },
      requiresFlamethrower: true
    },
    {
      scenarioName: "Cooked and Burned",
      payout: 73e3,
      actions: {
        evidence: [{ resourceId: RESOURCE.AMMONIA, qty: 1 }],
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }]
      },
      requiresFlamethrower: true
    },
    {
      scenarioName: "Final Cut",
      payout: 15e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }]
      },
      requiresFlamethrower: true
    },
    {
      scenarioName: "From the Ashes",
      payout: 17e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }]
      },
      requiresFlamethrower: true
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
      },
      requiresFlamethrower: true
    },
    {
      scenarioName: "Green With Envy",
      payout: 12e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }]
      },
      requiresFlamethrower: true
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
      },
      requiresFlamethrower: true
    },
    {
      scenarioName: "Kindling Spirits",
      payout: 92500,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 4 }]
      },
      requiresFlamethrower: true
    },
    {
      scenarioName: "Needles to Say",
      payout: 39e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }]
      },
      requiresFlamethrower: true
    },
    {
      scenarioName: "Off the Market",
      payout: 155e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
        stoke: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }]
      },
      requiresFlamethrower: true
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
      },
      requiresFlamethrower: true
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
      },
      requiresFlamethrower: true
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
      },
      requiresFlamethrower: true
    },
    {
      scenarioName: "Raze the Steaks",
      payout: 25e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 5 }]
      },
      requiresFlamethrower: true
    },
    {
      scenarioName: "Burn the Deck",
      payout: 96e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }]
      },
      requiresFlamethrower: true
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
      },
      requiresFlamethrower: true
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
      },
      requiresFlamethrower: true
    },
    {
      scenarioName: "Burn Rubber",
      payout: 67e3,
      actions: {
        evidence: [{ resourceId: RESOURCE.MAYAN_STATUE, qty: 1 }],
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }]
      },
      requiresFlamethrower: true
    },
    {
      scenarioName: "Hot out of the Gate",
      payout: 96e3,
      actions: {
        evidence: [{ resourceId: RESOURCE.GOLD_TOOTH, qty: 1 }],
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }]
      },
      requiresFlamethrower: true
    },
    {
      scenarioName: "Bald Faced Destruction",
      payout: 245e3,
      actions: {
        evidence: [{ resourceId: RESOURCE.RAW_IVORY, qty: 1 }],
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }]
      },
      requiresFlamethrower: true
    },
    {
      scenarioName: "Blaze of Glory",
      payout: 18e4,
      actions: {
        evidence: [{ resourceId: RESOURCE.TOOTHBRUSH, qty: 1 }],
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
        stoke: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }]
      },
      requiresFlamethrower: true
    },
    {
      scenarioName: "A Treat for the Tricked",
      payout: 71e3,
      actions: {
        evidence: [{ resourceId: RESOURCE.KABUKI_MASK, qty: 1 }],
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }]
      },
      requiresFlamethrower: true
    },
    {
      scenarioName: "Muscling In",
      payout: 90500,
      actions: {
        evidence: [{ resourceId: RESOURCE.SYRINGE, qty: 1 }],
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }]
      },
      requiresFlamethrower: true
    },
    {
      scenarioName: "Banking on It",
      payout: 2e5,
      actions: {
        evidence: [{ resourceId: RESOURCE.STAPLER, qty: 1 }],
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }]
      },
      requiresFlamethrower: true
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
      },
      requiresFlamethrower: true
    },
    {
      scenarioName: "Cache and Burn",
      payout: 49e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.KEROSENE, qty: 4 }]
      },
      requiresFlamethrower: true
    },
    {
      scenarioName: "Lock, Stock, and Barrel",
      payout: 21e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
        stoke: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }]
      },
      requiresFlamethrower: true
    },
    {
      scenarioName: "Letter of the Law",
      payout: 36e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
        stoke: [{ resourceId: RESOURCE.HYDROGEN, qty: 2 }]
      },
      requiresFlamethrower: true
    },
    {
      scenarioName: "Gentrifried",
      payout: 23e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
        stoke: [{ resourceId: RESOURCE.POTASSIUM_NITRATE, qty: 2 }]
      },
      requiresFlamethrower: true
    },
    // --- Needs verification ---
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

  // src/userscripts/pyromaniacs-ledger/engine.ts
  var DEFAULT_THRESHOLDS = { low: 5e3, good: 1e4 };
  function resolvePrice(resourceId, prices) {
    const override = prices[resourceId];
    if (override !== void 0) return override;
    return CATALOG[resourceId]?.defaultPrice ?? 0;
  }
  function itemCost(items, prices) {
    if (!items) return 0;
    return items.reduce((sum, item) => {
      if (item.optional) return sum;
      const resource = CATALOG[item.resourceId];
      if (!resource || resource.isTool) return sum;
      return sum + item.qty * resolvePrice(item.resourceId, prices);
    }, 0);
  }
  function itemActionCount(items) {
    if (!items) return 0;
    return items.reduce((sum, item) => {
      if (item.optional) return sum;
      return sum + item.qty;
    }, 0);
  }
  function calcNerve(strategy) {
    const { evidence, ignite, place, stoke, dampen } = strategy.actions;
    const items = itemActionCount(evidence) + itemActionCount(place) + itemActionCount(stoke) + itemActionCount(dampen);
    void ignite;
    return 10 + items * 5;
  }
  function calcMaterialCost(strategy, prices) {
    const { evidence, ignite, place, stoke, dampen } = strategy.actions;
    return itemCost(evidence, prices) + itemCost(ignite, prices) + itemCost(place, prices) + itemCost(stoke, prices) + itemCost(dampen, prices);
  }
  function calcProfitPerNerve(strategy, prices) {
    const nerve = calcNerve(strategy);
    const cost = calcMaterialCost(strategy, prices);
    return (strategy.payout - cost) / nerve;
  }
  function profitBand(ppn, thresholds2) {
    if (ppn <= 0) return "negative";
    if (ppn <= thresholds2.low) return "low";
    if (ppn <= thresholds2.good) return "good";
    return "jackpot";
  }
  function formatPpn(ppn) {
    const sign = ppn < 0 ? "-" : "";
    const rounded = Math.floor(Math.abs(ppn) / 100) * 100;
    if (rounded >= 1e3) return `$${sign}${(rounded / 1e3).toFixed(1)}k/N`;
    return `$${sign}${rounded}/N`;
  }
  function rankForScenario(candidates, hasFlamethrower, prices, thresholds2) {
    const eligible = candidates.filter((s) => {
      if (s.requiresFlamethrower && !hasFlamethrower) return false;
      return true;
    });
    if (eligible.length === 0) return [];
    const ranked = eligible.map((s) => {
      const ppn = calcProfitPerNerve(s, prices);
      return {
        strategy: s,
        materialCost: calcMaterialCost(s, prices),
        baseNerve: calcNerve(s),
        profitPerNerve: ppn,
        band: profitBand(ppn, thresholds2)
      };
    });
    ranked.sort((a, b) => {
      const aConf = a.strategy.needsVerification ? 0 : 1;
      const bConf = b.strategy.needsVerification ? 0 : 1;
      if (aConf !== bConf) return bConf - aConf;
      if (b.profitPerNerve !== a.profitPerNerve) return b.profitPerNerve - a.profitPerNerve;
      if (a.baseNerve !== b.baseNerve) return a.baseNerve - b.baseNerve;
      return a.materialCost - b.materialCost;
    });
    return ranked;
  }

  // src/userscripts/pyromaniacs-ledger/tooltip.ts
  function el(tag, className) {
    const e = document.createElement(tag);
    if (className) e.className = className;
    return e;
  }
  function row(label, value, highlight) {
    const div = el("div", "pyro-tt-row");
    const l = el("span", "pyro-tt-label");
    l.textContent = label;
    const v = el("span", highlight ? "pyro-tt-value pyro-tt-value--highlight" : "pyro-tt-value");
    v.textContent = value;
    div.appendChild(l);
    div.appendChild(v);
    return div;
  }
  function formatItems(items) {
    const parts = [];
    for (const item of items) {
      const name = CATALOG[item.resourceId]?.name ?? item.resourceId;
      const prefix = item.optional ? "~" : "";
      parts.push(`${prefix}${item.qty}\xD7 ${name}`);
    }
    return parts.join(", ");
  }
  function actionSection(label, items) {
    if (!items || items.length === 0) return null;
    const div = el("div", "pyro-tt-action");
    const labelEl = el("span", "pyro-tt-action-label");
    labelEl.textContent = label;
    const valueEl = el("span", "pyro-tt-action-value");
    valueEl.textContent = formatItems(items);
    div.appendChild(labelEl);
    div.appendChild(valueEl);
    return div;
  }
  function buildPrimaryBlock(ranked) {
    const frag = document.createDocumentFragment();
    const { strategy, profitPerNerve, materialCost, baseNerve } = ranked;
    const header = el("div", "pyro-tt-header");
    const ppnEl = el("span", `pyro-tt-ppn pyro-tt-band--${ranked.band}`);
    ppnEl.textContent = formatPpn(profitPerNerve);
    header.appendChild(ppnEl);
    if (strategy.needsVerification) {
      const badge = el("span", "pyro-tt-unconfirmed");
      badge.textContent = "unconfirmed";
      header.appendChild(badge);
    }
    frag.appendChild(header);
    const stats = el("div", "pyro-tt-stats");
    stats.appendChild(row("Payout", `$${(strategy.payout / 1e3).toFixed(0)}k`));
    stats.appendChild(row("Cost", `$${(materialCost / 1e3).toFixed(1)}k`));
    stats.appendChild(row("Nerve", String(baseNerve)));
    frag.appendChild(stats);
    frag.appendChild(el("hr", "pyro-tt-divider"));
    const { evidence, place, stoke, dampen } = strategy.actions;
    const ignite = strategy.actions.ignite ?? [{ resourceId: RESOURCE.LIGHTER, qty: 1 }];
    const actionOrder = [
      ["Evidence", evidence],
      ["Ignite", ignite],
      ["Place", place],
      ["Stoke", stoke],
      ["Dampen", dampen]
    ];
    for (const [label, items] of actionOrder) {
      const s = actionSection(label, items);
      if (s) frag.appendChild(s);
    }
    if (strategy.notes) {
      const note = el("div", "pyro-tt-notes");
      note.textContent = strategy.notes;
      frag.appendChild(note);
    }
    return frag;
  }
  function buildAltRow(ranked) {
    const div = el("div", "pyro-tt-alt-row");
    const ppn = el("span", `pyro-tt-alt-ppn pyro-tt-band--${ranked.band}`);
    ppn.textContent = formatPpn(ranked.profitPerNerve);
    const meta = el("span", "pyro-tt-alt-meta");
    const ftTag = ranked.strategy.requiresFlamethrower ? " \xB7 FT" : "";
    const unconfTag = ranked.strategy.needsVerification ? " \xB7 ?" : "";
    meta.textContent = `${ranked.baseNerve}N \xB7 $${(ranked.materialCost / 1e3).toFixed(1)}k${ftTag}${unconfTag}`;
    div.appendChild(ppn);
    div.appendChild(meta);
    return div;
  }
  function buildTooltipContent(allRanked) {
    const root = el("div", "pyro-tt");
    if (allRanked.length === 0) return root;
    root.appendChild(buildPrimaryBlock(allRanked[0]));
    const alts = allRanked.slice(1);
    if (alts.length > 0) {
      root.appendChild(el("hr", "pyro-tt-divider"));
      const altHeader = el("div", "pyro-tt-alt-header");
      altHeader.textContent = "Also viable";
      root.appendChild(altHeader);
      for (const alt of alts) {
        root.appendChild(buildAltRow(alt));
      }
    }
    return root;
  }
  function buildTooltipStyles() {
    return `
.pyro-tt {
    font-size: 12px;
    line-height: 1.5;
    min-width: 180px;
    max-width: 240px;
}
.pyro-tt-header {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 6px;
}
.pyro-tt-ppn {
    font-weight: bold;
    font-size: 14px;
}
.pyro-tt-band--negative { color: #f66; }
.pyro-tt-band--low      { color: #fc6; }
.pyro-tt-band--good     { color: #6c6; }
.pyro-tt-band--jackpot  { color: #4ef; }
.pyro-tt-unconfirmed {
    font-size: 10px;
    opacity: 0.7;
    border: 1px solid currentColor;
    border-radius: 3px;
    padding: 0 4px;
}
.pyro-tt-stats {
    display: flex;
    gap: 10px;
    margin-bottom: 6px;
    opacity: 0.85;
}
.pyro-tt-row {
    display: flex;
    flex-direction: column;
    font-size: 11px;
}
.pyro-tt-label {
    opacity: 0.6;
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.03em;
}
.pyro-tt-divider {
    border: none;
    border-top: 1px solid currentColor;
    opacity: 0.15;
    margin: 4px 0;
}
.pyro-tt-action {
    display: flex;
    gap: 6px;
    margin: 2px 0;
}
.pyro-tt-action-label {
    min-width: 56px;
    opacity: 0.6;
    font-size: 11px;
}
.pyro-tt-action-value {
    font-size: 11px;
}
.pyro-tt-notes {
    margin-top: 5px;
    opacity: 0.7;
    font-size: 11px;
    font-style: italic;
}
.pyro-tt-req {
    margin-top: 5px;
    opacity: 0.55;
    font-size: 10px;
}
.pyro-tt-alt-header {
    margin-top: 2px;
    margin-bottom: 3px;
    opacity: 0.5;
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
}
.pyro-tt-alt-row {
    display: flex;
    align-items: baseline;
    gap: 6px;
    margin: 2px 0;
}
.pyro-tt-alt-ppn {
    font-size: 11px;
    font-weight: bold;
    min-width: 60px;
}
.pyro-tt-alt-meta {
    font-size: 10px;
    opacity: 0.65;
}
`;
  }

  // src/userscripts/pyromaniacs-ledger/selectors.ts
  var SEL = {
    /** Root of the arson crime widget. Stable class — scope all queries here. */
    ROOT: ".arson-root",
    /** Each active crime card (the annotatable unit). Stable class. */
    CARD: ".crime-option-sections",
    /** Stats panel containing the Skill level button. Stable ID. */
    STATS_PANEL: "#crime-stats-panel",
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
     * Title bar at the top of the current crime panel.
     */
    TITLE_BAR: '[class*="titleBar___"]',
    /**
     * Result-counts strip (successes / fails / critical fails icons).
     * Settings gear is appended here as an additional item.
     */
    RESULT_COUNTS: '[class*="resultCounts___"]'
  };

  // src/userscripts/pyromaniacs-ledger/api.ts
  var TORN_ITEMS_URL = "https://api.torn.com/v2/torn/items?cat=All&sort=ASC&key=";
  var tornIdToResource = new Map(
    Object.values(CATALOG).filter((r) => r.tornId !== void 0).map((r) => [r.tornId, r.id])
  );
  async function fetchApiPrices(apiKey2) {
    try {
      const response = await fetch(TORN_ITEMS_URL + encodeURIComponent(apiKey2));
      if (!response.ok) return { success: false, error: `HTTP ${response.status}` };
      const data = await response.json();
      if (data.error) return { success: false, error: data.error.error };
      if (!Array.isArray(data.items)) return { success: false, error: "Unexpected response format" };
      const prices = {};
      for (const item of data.items) {
        const resourceId = tornIdToResource.get(item.id);
        if (resourceId && item.value?.market_price && item.value.market_price > 0) {
          prices[resourceId] = item.value.market_price;
        }
      }
      return { success: true, prices, updatedCount: Object.keys(prices).length };
    } catch {
      return { success: false, error: "Network error" };
    }
  }

  // src/userscripts/pyromaniacs-ledger/settings.ts
  function el2(tag, className) {
    const e = document.createElement(tag);
    if (className) e.className = className;
    return e;
  }
  function txt(content) {
    return document.createTextNode(content);
  }
  function injectSettingsStyles() {
    if (document.getElementById("pyro-settings-styles")) return;
    const style = el2("style");
    style.id = "pyro-settings-styles";
    style.textContent = `
.pyro-settings-wrap {
    position: relative;
    display: inline-flex;
    align-items: center;
    margin-left: 8px;
}
#pyro-settings-btn {
    background: none;
    border: 1px solid rgba(255,255,255,0.18);
    color: #bbb;
    cursor: pointer;
    border-radius: 4px;
    padding: 2px 7px;
    font-size: 13px;
    line-height: 1.4;
    user-select: none;
}
#pyro-settings-btn:hover { background: rgba(255,255,255,0.08); color: #fff; }
#pyro-settings-panel {
    position: absolute;
    top: calc(100% + 6px);
    right: 0;
    z-index: 9999;
    background: #1c1c1c;
    border: 1px solid #3a3a3a;
    border-radius: 6px;
    min-width: 290px;
    max-width: 360px;
    box-shadow: 0 6px 20px rgba(0,0,0,0.55);
    overflow: hidden;
}
.pyro-tab-bar {
    display: flex;
    background: #161616;
    border-bottom: 1px solid #303030;
}
.pyro-tab {
    flex: 1;
    background: none;
    border: none;
    border-bottom: 2px solid transparent;
    color: #777;
    cursor: pointer;
    padding: 7px 2px;
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.04em;
}
.pyro-tab:hover { color: #bbb; }
.pyro-tab.active { color: #fff; border-bottom-color: #4ef; }
.pyro-tab-content {
    padding: 10px;
    max-height: 380px;
    overflow-y: auto;
}
.pyro-s-group { margin-bottom: 10px; }
.pyro-s-group:last-child { margin-bottom: 0; }
.pyro-s-group-title {
    font-size: 9px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: #555;
    margin-bottom: 5px;
    padding-bottom: 3px;
    border-bottom: 1px solid #2a2a2a;
}
.pyro-s-row {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 3px;
}
.pyro-s-label {
    flex: 1;
    font-size: 11px;
    color: #aaa;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    min-width: 0;
}
.pyro-s-input {
    width: 76px;
    background: #252525;
    border: 1px solid #3a3a3a;
    color: #ddd;
    font-size: 11px;
    padding: 3px 5px;
    border-radius: 3px;
    text-align: right;
    -moz-appearance: textfield;
}
.pyro-s-input::-webkit-inner-spin-button,
.pyro-s-input::-webkit-outer-spin-button { -webkit-appearance: none; }
.pyro-s-input:focus { outline: none; border-color: #4ef; }
.pyro-s-input.from-api   { border-color: #48a; color: #7af; }
.pyro-s-input.overridden { border-color: #4a4; color: #6d6; }
.pyro-s-divider { border: none; border-top: 1px solid #2a2a2a; margin: 8px 0; }
.pyro-s-key-row { display: flex; gap: 6px; margin-bottom: 6px; }
.pyro-s-key-input {
    flex: 1;
    background: #252525;
    border: 1px solid #3a3a3a;
    color: #ddd;
    font-size: 11px;
    padding: 4px 6px;
    border-radius: 3px;
    min-width: 0;
    font-family: monospace;
}
.pyro-s-key-input:focus { outline: none; border-color: #4ef; }
.pyro-s-btn {
    background: #252525;
    border: 1px solid #484848;
    color: #bbb;
    cursor: pointer;
    border-radius: 3px;
    padding: 4px 9px;
    font-size: 11px;
    white-space: nowrap;
}
.pyro-s-btn:hover:not(:disabled) { background: #303030; color: #fff; }
.pyro-s-btn:disabled { opacity: 0.35; cursor: default; }
.pyro-s-status {
    font-size: 10px;
    margin-bottom: 8px;
    min-height: 13px;
    color: #666;
}
.pyro-s-status.ok  { color: #6c6; }
.pyro-s-status.err { color: #c66; }
.pyro-s-refresh-row { display: flex; align-items: center; gap: 8px; }
.pyro-s-timestamp { font-size: 10px; color: #555; }
.pyro-s-check-row {
    display: flex;
    align-items: center;
    gap: 7px;
    margin-bottom: 7px;
    font-size: 12px;
    color: #bbb;
    cursor: pointer;
    user-select: none;
}
.pyro-s-check-row input[type=checkbox] { cursor: pointer; }
.pyro-s-section-note { font-size: 10px; color: #555; margin-bottom: 6px; }
.pyro-s-section-note a { color: #4ef; text-decoration: none; }
.pyro-s-section-note a:hover { text-decoration: underline; }
.pyro-s-missing-header { font-size: 10px; color: #666; margin: 8px 0 4px; }
.pyro-s-missing-list { font-size: 10px; color: #777; padding-left: 14px; margin: 0; }
.pyro-s-missing-list li { margin-bottom: 2px; font-family: monospace; }
`;
    document.head.appendChild(style);
  }
  function applyPriceStyle(input, source) {
    input.classList.remove("overridden", "from-api");
    if (source === "manual") input.classList.add("overridden");
    else if (source === "api") input.classList.add("from-api");
  }
  function priceInput(id, ctx) {
    const input = el2("input", "pyro-s-input");
    input.type = "number";
    input.min = "0";
    const refresh = () => {
      const manual = ctx.getManualPrices()[id];
      const api = ctx.getApiPrices()[id];
      const db = CATALOG[id]?.defaultPrice ?? 0;
      if (manual !== void 0) {
        input.value = String(manual);
        applyPriceStyle(input, "manual");
      } else if (api !== void 0) {
        input.value = String(api);
        applyPriceStyle(input, "api");
      } else {
        input.value = "";
        input.placeholder = String(db);
        applyPriceStyle(input, "db");
      }
    };
    refresh();
    const commit = () => {
      const raw = input.value.trim();
      if (raw === "") {
        ctx.clearManualPrice(id);
      } else {
        const val = Math.round(parseFloat(raw));
        if (!isNaN(val) && val >= 0) ctx.setManualPrice(id, val);
      }
      refresh();
    };
    input.addEventListener("blur", commit);
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") input.blur();
    });
    return input;
  }
  var PRICE_GROUPS = [
    {
      title: "Liquid fuels",
      ids: ["gasoline", "diesel", "kerosene"]
    },
    {
      title: "Solid fuels",
      ids: ["magnesium", "thermite", "saltpetre", "potassium_nitrate"]
    },
    {
      title: "Gaseous fuels",
      ids: ["oxygen", "methane", "hydrogen"]
    },
    {
      title: "Evidence",
      ids: Object.values(CATALOG).filter((r) => r.kind === "evidence").sort((a, b) => a.name.localeCompare(b.name)).map((r) => r.id)
    }
  ];
  function buildPricesTab(ctx) {
    const root = el2("div");
    for (const group of PRICE_GROUPS) {
      const g = el2("div", "pyro-s-group");
      const title = el2("div", "pyro-s-group-title");
      title.textContent = group.title;
      g.appendChild(title);
      for (const id of group.ids) {
        const resource = CATALOG[id];
        if (!resource) continue;
        const row2 = el2("div", "pyro-s-row");
        const label = el2("span", "pyro-s-label");
        label.textContent = resource.name;
        label.title = resource.name;
        row2.appendChild(label);
        row2.appendChild(priceInput(id, ctx));
        g.appendChild(row2);
      }
      root.appendChild(g);
    }
    const note = el2("p", "pyro-s-section-note");
    note.textContent = `DB prices as of ${CATALOG_UPDATED}. Blue = API price active. Green = manual override. Clear a field to revert to the next tier.`;
    root.appendChild(note);
    return root;
  }
  function thresholdInput(label, getVal, setVal, ctx) {
    const row2 = el2("div", "pyro-s-row");
    const lbl = el2("span", "pyro-s-label");
    lbl.textContent = label;
    const input = el2("input", "pyro-s-input");
    input.type = "number";
    input.min = "0";
    input.value = String(getVal());
    input.addEventListener("blur", () => {
      const val = Math.round(parseFloat(input.value));
      if (!isNaN(val) && val >= 0) {
        setVal(val);
        input.value = String(val);
      } else {
        input.value = String(getVal());
      }
    });
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") input.blur();
    });
    row2.appendChild(lbl);
    row2.appendChild(input);
    return row2;
  }
  function buildHighlightsTab(ctx) {
    const root = el2("div");
    const g = el2("div", "pyro-s-group");
    const title = el2("div", "pyro-s-group-title");
    title.textContent = "Profit bands ($/nerve)";
    g.appendChild(title);
    const bandNote = el2("p", "pyro-s-section-note");
    bandNote.textContent = "negative \u2264 0 < low \u2264 X < good \u2264 Y < jackpot";
    g.appendChild(bandNote);
    g.appendChild(thresholdInput(
      "Low threshold",
      () => ctx.getThresholds().low,
      (val) => {
        const t = ctx.getThresholds();
        ctx.setThresholds({ low: val, good: Math.max(val, t.good) });
      },
      ctx
    ));
    g.appendChild(thresholdInput(
      "Good threshold",
      () => ctx.getThresholds().good,
      (val) => {
        const t = ctx.getThresholds();
        ctx.setThresholds({ low: Math.min(t.low, val), good: val });
      },
      ctx
    ));
    root.appendChild(g);
    return root;
  }
  function buildApiTab(ctx, panel) {
    const root = el2("div");
    const keyGroup = el2("div", "pyro-s-group");
    const keyTitle = el2("div", "pyro-s-group-title");
    keyTitle.textContent = "Torn API key";
    keyGroup.appendChild(keyTitle);
    const keyNote = el2("p", "pyro-s-section-note");
    keyNote.textContent = "Public access only \u2014 used solely to fetch item market prices. ";
    const keyLink = el2("a");
    keyLink.href = "https://www.torn.com/preferences.php#tab=api?step=addNewKey&title=Pyromaniac%27s+Ledger&torn=items";
    keyLink.textContent = "Create one \u2192";
    keyLink.target = "_blank";
    keyLink.rel = "noopener noreferrer";
    keyNote.appendChild(keyLink);
    keyGroup.appendChild(keyNote);
    const storageNote = el2("p", "pyro-s-section-note");
    storageNote.textContent = "Key is stored in Tampermonkey only \u2014 never sent to any server other than Torn's API.";
    keyGroup.appendChild(storageNote);
    const keyRow = el2("div", "pyro-s-key-row");
    const keyInput = el2("input", "pyro-s-key-input");
    keyInput.type = "password";
    keyInput.placeholder = "Your Torn API key";
    keyInput.value = ctx.getApiKey();
    keyInput.autocomplete = "off";
    keyInput.spellcheck = false;
    const saveBtn = el2("button", "pyro-s-btn");
    saveBtn.textContent = "Validate & Save";
    keyRow.appendChild(keyInput);
    keyRow.appendChild(saveBtn);
    keyGroup.appendChild(keyRow);
    const keyStatus = el2("div", "pyro-s-status");
    if (ctx.getApiKey()) {
      keyStatus.textContent = "\u2713 Key saved";
      keyStatus.className = "pyro-s-status ok";
    }
    keyGroup.appendChild(keyStatus);
    root.appendChild(keyGroup);
    saveBtn.addEventListener("click", async () => {
      const key = keyInput.value.trim();
      if (!key) {
        keyStatus.textContent = "Enter a key first.";
        keyStatus.className = "pyro-s-status err";
        return;
      }
      saveBtn.disabled = true;
      keyStatus.textContent = "Validating\u2026";
      keyStatus.className = "pyro-s-status";
      const result = await fetchApiPrices(key);
      saveBtn.disabled = false;
      if (result.success && result.prices) {
        ctx.setApiKey(key);
        ctx.setApiPrices(result.prices, Date.now());
        keyStatus.textContent = `\u2713 Valid \u2014 ${result.updatedCount} prices updated`;
        keyStatus.className = "pyro-s-status ok";
        rerenderTab(panel, "api", ctx);
      } else {
        keyStatus.textContent = `\u2717 ${result.error ?? "Unknown error"}`;
        keyStatus.className = "pyro-s-status err";
      }
    });
    const hr = el2("hr", "pyro-s-divider");
    root.appendChild(hr);
    const refreshGroup = el2("div", "pyro-s-group");
    const refreshTitle = el2("div", "pyro-s-group-title");
    refreshTitle.textContent = "Market prices";
    refreshGroup.appendChild(refreshTitle);
    const dbNote = el2("p", "pyro-s-section-note");
    dbNote.textContent = `Built-in DB prices: ${CATALOG_UPDATED}. An API key lets you fetch live market prices instead.`;
    refreshGroup.appendChild(dbNote);
    const refreshRow = el2("div", "pyro-s-refresh-row");
    const refreshBtn = el2("button", "pyro-s-btn");
    refreshBtn.textContent = "Refresh";
    if (!ctx.getApiKey()) refreshBtn.disabled = true;
    const resetBtn = el2("button", "pyro-s-btn");
    resetBtn.textContent = "Reset to DB";
    if (!ctx.getApiLastRefresh()) resetBtn.disabled = true;
    const ts = ctx.getApiLastRefresh();
    const tsEl = el2("span", "pyro-s-timestamp");
    tsEl.textContent = ts ? `Fetched: ${formatTimestamp(ts)}` : "";
    refreshRow.appendChild(refreshBtn);
    refreshRow.appendChild(resetBtn);
    refreshRow.appendChild(tsEl);
    refreshGroup.appendChild(refreshRow);
    const refreshStatus = el2("div", "pyro-s-status");
    refreshGroup.appendChild(refreshStatus);
    root.appendChild(refreshGroup);
    refreshBtn.addEventListener("click", async () => {
      refreshBtn.disabled = true;
      refreshStatus.textContent = "Refreshing\u2026";
      refreshStatus.className = "pyro-s-status";
      const result = await fetchApiPrices(ctx.getApiKey());
      refreshBtn.disabled = !ctx.getApiKey();
      if (result.success && result.prices) {
        ctx.setApiPrices(result.prices, Date.now());
        refreshStatus.textContent = `\u2713 ${result.updatedCount} prices updated`;
        refreshStatus.className = "pyro-s-status ok";
        tsEl.textContent = `Fetched: ${formatTimestamp(ctx.getApiLastRefresh())}`;
        resetBtn.disabled = false;
      } else {
        refreshStatus.textContent = `\u2717 ${result.error ?? "Unknown error"}`;
        refreshStatus.className = "pyro-s-status err";
      }
    });
    resetBtn.addEventListener("click", () => {
      ctx.clearApiPrices();
      tsEl.textContent = "";
      resetBtn.disabled = true;
      refreshStatus.textContent = "Restored built-in DB prices.";
      refreshStatus.className = "pyro-s-status ok";
    });
    return root;
  }
  function formatTimestamp(ts) {
    const d = new Date(ts);
    return d.toLocaleString(void 0, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  }
  function buildDebugTab(ctx) {
    const root = el2("div");
    const checkRow = el2("label", "pyro-s-check-row");
    const checkbox = el2("input");
    checkbox.type = "checkbox";
    checkbox.checked = ctx.getDebugMode();
    checkbox.addEventListener("change", () => ctx.setDebugMode(checkbox.checked));
    checkRow.appendChild(checkbox);
    checkRow.appendChild(txt("Debug mode"));
    root.appendChild(checkRow);
    const missing = ctx.getMissingScenarios();
    const header = el2("div", "pyro-s-missing-header");
    header.textContent = missing.length ? `Missing strategies observed this session (${missing.length}):` : "No missing strategies observed this session.";
    root.appendChild(header);
    if (missing.length > 0) {
      const list = el2("ul", "pyro-s-missing-list");
      for (const name of missing) {
        const li = el2("li");
        li.textContent = name;
        list.appendChild(li);
      }
      root.appendChild(list);
    }
    return root;
  }
  var TABS = [
    { id: "prices", label: "Prices" },
    { id: "highlights", label: "Highlights" },
    { id: "api", label: "API" },
    { id: "debug", label: "Debug" }
  ];
  function buildTabBar(activeId, onSwitch) {
    const bar = el2("div", "pyro-tab-bar");
    for (const tab of TABS) {
      const btn = el2("button", tab.id === activeId ? "pyro-tab active" : "pyro-tab");
      btn.textContent = tab.label;
      btn.dataset.tab = tab.id;
      btn.addEventListener("click", () => {
        bar.querySelectorAll(".pyro-tab").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        onSwitch(tab.id);
      });
      bar.appendChild(btn);
    }
    return bar;
  }
  function rerenderTab(panel, tabId, ctx) {
    const content = panel.querySelector(".pyro-tab-content");
    if (!content) return;
    content.innerHTML = "";
    content.appendChild(buildTabContent(tabId, ctx, panel));
  }
  function buildTabContent(tabId, ctx, panel) {
    switch (tabId) {
      case "prices":
        return buildPricesTab(ctx);
      case "highlights":
        return buildHighlightsTab(ctx);
      case "api":
        return buildApiTab(ctx, panel);
      case "debug":
        return buildDebugTab(ctx);
      default:
        return buildPricesTab(ctx);
    }
  }
  function injectSettings(root, ctx) {
    const existing = document.getElementById("pyro-settings-btn");
    if (existing) {
      if (root.contains(existing)) return;
      existing.closest(".pyro-settings-wrap")?.remove();
    }
    injectSettingsStyles();
    const anchor = root.querySelector(SEL.RESULT_COUNTS) ?? root.querySelector(SEL.TITLE_BAR) ?? root;
    const wrap = el2("div", "pyro-settings-wrap");
    const btn = el2("button");
    btn.id = "pyro-settings-btn";
    btn.setAttribute("aria-label", "Pyromaniac's Ledger settings");
    btn.setAttribute("aria-expanded", "false");
    btn.textContent = "\u2699";
    const panel = el2("div");
    panel.id = "pyro-settings-panel";
    panel.setAttribute("hidden", "");
    const activeTab2 = ctx.getActiveTab() || "prices";
    panel.appendChild(buildTabBar(activeTab2, (tabId) => {
      ctx.setActiveTab(tabId);
      rerenderTab(panel, tabId, ctx);
    }));
    const content = el2("div", "pyro-tab-content");
    content.appendChild(buildTabContent(activeTab2, ctx, panel));
    panel.appendChild(content);
    wrap.appendChild(btn);
    wrap.appendChild(panel);
    anchor.appendChild(wrap);
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const hidden = panel.hasAttribute("hidden");
      panel.toggleAttribute("hidden", !hidden);
      btn.setAttribute("aria-expanded", String(hidden));
    });
    document.addEventListener("click", (e) => {
      if (!wrap.contains(e.target)) {
        panel.setAttribute("hidden", "");
        btn.setAttribute("aria-expanded", "false");
      }
    }, { passive: true });
  }

  // src/userscripts/pyromaniacs-ledger/index.ts
  var KEY_DEBUG = "pyroLedger.v1.debug";
  var KEY_MANUAL_PRICES = "pyroLedger.v1.manualPrices";
  var KEY_API_PRICES = "pyroLedger.v1.apiPrices";
  var KEY_API_KEY = "pyroLedger.v1.apiKey";
  var KEY_API_REFRESH = "pyroLedger.v1.apiRefresh";
  var KEY_THRESHOLDS = "pyroLedger.v1.thresholds";
  var KEY_ACTIVE_TAB = "pyroLedger.v1.activeTab";
  function store_get(key, def = "") {
    if (typeof GM_getValue !== "undefined") return GM_getValue(key, def);
    return localStorage.getItem(key) ?? def;
  }
  function store_set(key, val) {
    if (typeof GM_setValue !== "undefined") {
      GM_setValue(key, val);
      return;
    }
    localStorage.setItem(key, val);
  }
  function getTooltipAPI() {
    const w = typeof unsafeWindow !== "undefined" ? unsafeWindow : window;
    const api = w["BalaclavaTooltip"];
    if (api && typeof api.show === "function") {
      return api;
    }
    return null;
  }
  var tooltipWarned = false;
  function tryTooltip(callback) {
    const api = getTooltipAPI();
    if (!api) {
      if (!tooltipWarned) {
        console.warn("[PyroLedger] BalaclavaTooltip not found \u2014 tooltips disabled.");
        tooltipWarned = true;
      }
      return;
    }
    callback(api);
  }
  var manualPrices = {};
  var apiPrices = {};
  var apiKey = "";
  var apiLastRefresh = 0;
  var thresholds = { ...DEFAULT_THRESHOLDS };
  var debugMode = false;
  var activeTab = "prices";
  var visibleMobileSection = null;
  var missingScenarios = /* @__PURE__ */ new Set();
  function effectivePrices() {
    return { ...apiPrices, ...manualPrices };
  }
  function loadState() {
    debugMode = store_get(KEY_DEBUG) === "true";
    apiKey = store_get(KEY_API_KEY, "");
    activeTab = store_get(KEY_ACTIVE_TAB, "prices");
    apiLastRefresh = parseInt(store_get(KEY_API_REFRESH, "0"), 10) || 0;
    try {
      manualPrices = JSON.parse(store_get(KEY_MANUAL_PRICES, "{}"));
    } catch {
      manualPrices = {};
    }
    try {
      apiPrices = JSON.parse(store_get(KEY_API_PRICES, "{}"));
    } catch {
      apiPrices = {};
    }
    try {
      const saved = JSON.parse(store_get(KEY_THRESHOLDS, "{}"));
      if (typeof saved.low === "number" && typeof saved.good === "number") {
        thresholds = { low: saved.low, good: saved.good };
      }
    } catch {
    }
  }
  function setManualPrice(id, price) {
    manualPrices = { ...manualPrices, [id]: price };
    store_set(KEY_MANUAL_PRICES, JSON.stringify(manualPrices));
    resetScans();
  }
  function clearManualPrice(id) {
    const next = { ...manualPrices };
    delete next[id];
    manualPrices = next;
    store_set(KEY_MANUAL_PRICES, JSON.stringify(manualPrices));
    resetScans();
  }
  function setThresholds(t) {
    thresholds = t;
    store_set(KEY_THRESHOLDS, JSON.stringify(thresholds));
    resetScans();
  }
  function setApiPrices(prices, timestamp) {
    apiPrices = prices;
    apiLastRefresh = timestamp;
    store_set(KEY_API_PRICES, JSON.stringify(apiPrices));
    store_set(KEY_API_REFRESH, String(apiLastRefresh));
    resetScans();
  }
  function clearApiPrices() {
    setApiPrices({}, 0);
  }
  function setApiKey(key) {
    apiKey = key;
    store_set(KEY_API_KEY, apiKey);
  }
  function setDebugMode(on) {
    debugMode = on;
    store_set(KEY_DEBUG, String(debugMode));
  }
  function setActiveTab(tab) {
    activeTab = tab;
    store_set(KEY_ACTIVE_TAB, activeTab);
  }
  function getSkillValue() {
    const btn = document.querySelector(`${SEL.STATS_PANEL} ${SEL.SKILL_BTN}`) ?? document.querySelector(SEL.SKILL_BTN);
    if (!btn) return 0;
    const m = btn.getAttribute("aria-label")?.match(/Skill:\s*([\d.]+)/);
    return m ? parseFloat(m[1]) : 0;
  }
  var strategyIndex = /* @__PURE__ */ new Map();
  for (const s of STRATEGIES) {
    const key = s.scenarioName.toLowerCase();
    const existing = strategyIndex.get(key);
    if (existing) {
      existing.push(s);
    } else {
      strategyIndex.set(key, [s]);
    }
  }
  function injectHighlightStyles() {
    if (document.getElementById("pyro-highlight-styles")) return;
    const style = document.createElement("style");
    style.id = "pyro-highlight-styles";
    style.textContent = `
        .pyro-label {
            display: inline-block;
            margin-left: 6px;
            font-size: 11px;
            font-weight: bold;
            padding: 1px 5px;
            border-radius: 3px;
            vertical-align: middle;
            pointer-events: none;
        }
        .pyro-label--unconfirmed { opacity: 0.55; }

        .pyro-band--negative .pyro-label { color: #c44; }
        .pyro-band--low      .pyro-label { color: #b90; }
        .pyro-band--good     .pyro-label { color: #4a4; }
        .pyro-band--jackpot  .pyro-label { color: #0cc; }

        .arson-root .pyro-band--negative [class*="titleSection___"] { background: rgba(120,40,40,0.25) !important; }
        .arson-root .pyro-band--low      [class*="titleSection___"] { background: rgba(180,140,0,0.15) !important; }
        .arson-root .pyro-band--good     [class*="titleSection___"] { background: rgba(40,140,60,0.15) !important; }
        .arson-root .pyro-band--jackpot  [class*="titleSection___"] { background: rgba(0,200,200,0.15) !important; }
    `;
    document.head.appendChild(style);
    injectTooltipContentStyles();
  }
  function injectTooltipContentStyles() {
    if (document.getElementById("pyro-tt-styles")) return;
    const style = document.createElement("style");
    style.id = "pyro-tt-styles";
    style.textContent = "";
    document.head.appendChild(style);
  }
  function applyToSection(section, allRanked, scenarioName) {
    section.querySelector(".pyro-label")?.remove();
    section.classList.forEach((c) => {
      if (c.startsWith("pyro-band--")) section.classList.remove(c);
    });
    const scenarioEl = section.querySelector(SEL.SCENARIO);
    const titleSection = scenarioEl?.closest(SEL.TITLE_SECTION) ?? null;
    const best = allRanked.find((r) => !r.strategy.needsVerification) ?? null;
    if (!best) {
      if (debugMode) {
        const label = document.createElement("span");
        label.className = "pyro-label pyro-label--unconfirmed";
        label.textContent = "?";
        label.title = `No strategy: ${scenarioName}`;
        scenarioEl?.appendChild(label);
      }
      return;
    }
    section.classList.add(`pyro-band--${best.band}`);
    if (scenarioEl) {
      const label = document.createElement("span");
      label.className = "pyro-label";
      label.textContent = formatPpn(best.profitPerNerve);
      scenarioEl.appendChild(label);
    }
    const hoverTarget = titleSection ?? section;
    wireTooltip(section, hoverTarget, allRanked);
  }
  function wireTooltip(section, hoverTarget, allRanked) {
    if (section.dataset.pyroTooltipWired) return;
    section.dataset.pyroTooltipWired = "true";
    const getContent = () => buildTooltipContentWithStyles(allRanked);
    hoverTarget.addEventListener("mouseenter", () => {
      tryTooltip((api) => api.show(hoverTarget, getContent(), { position: "top", theme: "dark" }));
    });
    hoverTarget.addEventListener("mouseleave", () => {
      tryTooltip((api) => api.hide());
    });
    section.addEventListener("click", (e) => {
      if (e.target.closest('button, a, input, select, textarea, [role="button"]')) return;
      tryTooltip((api) => {
        if (visibleMobileSection === section) {
          api.hide();
          visibleMobileSection = null;
        } else {
          api.show(section, getContent(), { position: "top", theme: "dark" });
          visibleMobileSection = section;
        }
      });
    });
    document.addEventListener("click", (e) => {
      if (visibleMobileSection === section && !section.contains(e.target)) {
        tryTooltip((api) => api.hide());
        visibleMobileSection = null;
      }
    }, { passive: true });
  }
  function buildTooltipContentWithStyles(allRanked) {
    const node = buildTooltipContent(allRanked);
    const style = document.createElement("style");
    style.textContent = buildTooltipStyles();
    node.insertBefore(style, node.firstChild);
    return node;
  }
  function getRoot() {
    return document.querySelector(SEL.ROOT) ?? document.body;
  }
  function scanPage() {
    const hasFlamethrower = getSkillValue() >= 80;
    const prices = effectivePrices();
    getRoot().querySelectorAll(SEL.CARD).forEach((section) => {
      if (section.dataset.pyroScanned) return;
      section.dataset.pyroScanned = "true";
      const scenarioEl = section.querySelector('[class*="scenario___"]');
      const rawName = scenarioEl?.textContent?.trim() ?? "";
      if (!rawName) return;
      const candidates = strategyIndex.get(rawName.toLowerCase()) ?? [];
      if (candidates.length === 0 && debugMode) {
        missingScenarios.add(rawName);
      }
      const allRanked = rankForScenario(candidates, hasFlamethrower, prices, thresholds);
      applyToSection(section, allRanked, rawName);
    });
  }
  function resetScans() {
    getRoot().querySelectorAll(SEL.CARD).forEach((section) => {
      delete section.dataset.pyroScanned;
      delete section.dataset.pyroTooltipWired;
    });
    scanPage();
  }
  var settingsCtx = {
    getManualPrices: () => manualPrices,
    getApiPrices: () => apiPrices,
    getThresholds: () => thresholds,
    getApiKey: () => apiKey,
    getApiLastRefresh: () => apiLastRefresh,
    getDebugMode: () => debugMode,
    getActiveTab: () => activeTab,
    getMissingScenarios: () => Array.from(missingScenarios),
    setManualPrice,
    clearManualPrice,
    setThresholds,
    setApiPrices,
    clearApiPrices,
    setApiKey,
    setDebugMode,
    setActiveTab
  };
  var reInjectTimer = null;
  function scheduleInjectSettings() {
    if (reInjectTimer !== null) return;
    reInjectTimer = setTimeout(() => {
      reInjectTimer = null;
      const root = getRoot();
      const btn = document.getElementById("pyro-settings-btn");
      if (!btn || !root.contains(btn)) {
        injectSettings(root, settingsCtx);
      }
    }, 200);
  }
  var observer = new MutationObserver(() => {
    scanPage();
    scheduleInjectSettings();
  });
  function start() {
    loadState();
    injectHighlightStyles();
    scanPage();
    injectSettings(getRoot(), settingsCtx);
    observer.observe(document.body, { childList: true, subtree: true });
    if (debugMode) console.log("[PyroLedger] started, debug on");
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
