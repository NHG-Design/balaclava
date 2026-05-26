// ==UserScript==
// @name        Torn Arsonist's Ledger
// @namespace   https://github.com/NHG-Design/balaclava
// @version     0.4.10
// @description Arson profit-per-nerve calculator and scenario guide for Torn's Crimes page
// @icon        https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @author      Yukio [906148]
// @license     MIT
// @supportURL  https://github.com/NHG-Design/balaclava/issues
// @updateURL   https://raw.githubusercontent.com/NHG-Design/balaclava/main/dist/arsonists-ledger.meta.js
// @downloadURL https://raw.githubusercontent.com/NHG-Design/balaclava/main/dist/arsonists-ledger.user.js
// @match       https://www.torn.com/page.php?sid=crimes*
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       unsafeWindow
// @grant       GM_xmlhttpRequest
// @connect     balaclava.app
// @run-at      document-idle
// ==/UserScript==

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
      payout: 18e4,
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
      },
      needsVerification: true
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
      payout: 17e4,
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
      payout: 15e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
        place: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
        stoke: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
        stokeTime: "early"
      },
      needsVerification: true
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
      payout: 1e5,
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
      payout: 74e3,
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
      payout: 125e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 1 }]
      }
    },
    {
      scenarioName: "Fire Burn and Cauldron Bubble",
      payout: 17e4,
      actions: {
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 5 }]
      }
    },
    {
      scenarioName: "Fire Burn and Cauldron Bubble",
      payout: 17e4,
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
      payout: 3e5,
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
      payout: 21e4,
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
      payout: 265e3,
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
      payout: 9e4,
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
      payout: 175e3,
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
      payout: 3e5,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 5 }],
        stoke: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }]
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
      payout: 17e4,
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

  // src/data/scenarios-version.ts
  var SCENARIOS_VERSION = "84c1d860";

  // src/userscripts/balaclava-tooltip/index.ts
  var API_NAME = "BalaclavaTooltip";
  var HOST_ID = "balaclava-tooltip-host";
  var SAFEZONE = 8;
  var ARROW_OFFSET_MIN = 10;
  var ARROW_OFFSET_MAX = 90;
  var ARROW_OFFSET_DEFAULT = 50;
  var VERSION = "1.0.2";
  var VALID_POSITIONS = /* @__PURE__ */ new Set(["top", "bottom", "left", "right"]);
  var VALID_THEMES = /* @__PURE__ */ new Set(["system", "dark", "light", "custom"]);
  var CUSTOM_THEME_KEYS = /* @__PURE__ */ new Set(["bgColor", "textColor", "borderColor", "shadowColor"]);
  var THEME_TOKENS = Object.freeze({
    dark: Object.freeze({
      bgColor: "oklch(18% 0.012 260)",
      textColor: "oklch(96% 0.012 95)",
      borderColor: "oklch(96% 0.012 95 / 0.16)",
      shadowColor: "oklch(12% 0.01 260 / 0.55)"
    }),
    light: Object.freeze({
      bgColor: "oklch(98% 0.008 95)",
      textColor: "oklch(24% 0.014 260)",
      borderColor: "oklch(24% 0.014 260 / 0.14)",
      shadowColor: "oklch(24% 0.014 260 / 0.3)"
    })
  });
  var rootWindow = typeof unsafeWindow !== "undefined" ? unsafeWindow : window;
  if (!rootWindow[API_NAME]?.version) {
    let init = function() {
      ensureHost();
      setupGlobalListeners();
      scanAll();
      setupMutationObserver();
    }, ensureHost = function() {
      if (host) return;
      host = document.createElement("div");
      host.id = HOST_ID;
      host.style.position = "fixed";
      host.style.top = "0";
      host.style.left = "0";
      host.style.width = "0";
      host.style.height = "0";
      host.style.overflow = "visible";
      host.style.pointerEvents = "none";
      host.style.zIndex = String(config.zIndex);
      if (!host.isConnected) {
        (document.body || document.documentElement).appendChild(host);
      }
      shadow = host.attachShadow({ mode: "closed" });
      styleEl = document.createElement("style");
      styleEl.textContent = buildStylesheet();
      shadow.appendChild(styleEl);
    }, buildStylesheet = function() {
      const visualConfig = getVisualConfig();
      return `
      .balaclava-tooltip {
        --balaclava-tooltip-bg: ${THEME_TOKENS.dark.bgColor};
        --balaclava-tooltip-text: ${THEME_TOKENS.dark.textColor};
        --balaclava-tooltip-border: ${THEME_TOKENS.dark.borderColor};
        --balaclava-tooltip-shadow: ${THEME_TOKENS.dark.shadowColor};
        --balaclava-tooltip-border-size: ${visualConfig.borderSize};
        --balaclava-tooltip-border-radius: ${visualConfig.borderRadius};
        --balaclava-tooltip-arrow-size: ${visualConfig.arrowSize};
        --balaclava-tooltip-arrow-border-size: ${visualConfig.arrowBorderSize};
        --balaclava-tooltip-arrow-border-color: ${visualConfig.arrowBorderColor};
        --balaclava-tooltip-arrow-border-radius: ${visualConfig.arrowBorderRadius};
        position: fixed;
        top: 0;
        left: 0;
        z-index: ${config.zIndex};
        box-sizing: border-box;
        max-width: ${visualConfig.maxWidth};
        color: var(--balaclava-tooltip-text);
        color-scheme: dark;
        font-family: ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        font-size: ${visualConfig.fontSize};
        line-height: 1.4;
        letter-spacing: 0;
        overflow-wrap: anywhere;
        pointer-events: none;
        opacity: 1;
        border: var(--balaclava-tooltip-border-size) solid var(--balaclava-tooltip-border);
        border-radius: var(--balaclava-tooltip-border-radius);
        filter: drop-shadow(0 2px 8px var(--balaclava-tooltip-shadow));
        transform: scale(1);
        transition:
          opacity ${visualConfig.animationDuration} ease-out,
          transform ${visualConfig.animationDuration} ease-out;
      }

      .balaclava-tooltip-content {
        position: relative;
        z-index: 1;
        box-sizing: border-box;
        padding: ${visualConfig.padding};
        color: var(--balaclava-tooltip-text);
        background: var(--balaclava-tooltip-bg);
        border-radius: var(--balaclava-tooltip-border-radius);
      }

      .balaclava-tooltip-arrow {
        position: absolute;
        z-index: 0;
        box-sizing: border-box;
        width: var(--balaclava-tooltip-arrow-size);
        height: var(--balaclava-tooltip-arrow-size);
        background: var(--balaclava-tooltip-bg);
        border-color: var(--balaclava-tooltip-arrow-border-color);
        border-style: solid;
        border-width: var(--balaclava-tooltip-arrow-border-size);
        border-radius: var(--balaclava-tooltip-arrow-border-radius);
      }

      .balaclava-tooltip.is-theme-system,
      .balaclava-tooltip.is-theme-dark {
        --balaclava-tooltip-bg: ${THEME_TOKENS.dark.bgColor};
        --balaclava-tooltip-text: ${THEME_TOKENS.dark.textColor};
        --balaclava-tooltip-border: ${THEME_TOKENS.dark.borderColor};
        --balaclava-tooltip-shadow: ${THEME_TOKENS.dark.shadowColor};
        color-scheme: dark;
      }

      .balaclava-tooltip.is-theme-light {
        --balaclava-tooltip-bg: ${THEME_TOKENS.light.bgColor};
        --balaclava-tooltip-text: ${THEME_TOKENS.light.textColor};
        --balaclava-tooltip-border: ${THEME_TOKENS.light.borderColor};
        --balaclava-tooltip-shadow: ${THEME_TOKENS.light.shadowColor};
        color-scheme: light;
      }

      .balaclava-tooltip.is-theme-custom {
        --balaclava-tooltip-bg: ${config.bgColor};
        --balaclava-tooltip-text: ${config.textColor};
        --balaclava-tooltip-border: ${config.borderColor};
        --balaclava-tooltip-shadow: ${config.shadowColor};
      }

      .balaclava-tooltip.is-top .balaclava-tooltip-arrow {
        bottom: calc(var(--balaclava-tooltip-arrow-size) / -2);
        left: var(--arrow-offset, 50%);
        transform: translateX(-50%) rotate(45deg);
        border-top: none;
        border-left: none;
      }

      .balaclava-tooltip.is-bottom .balaclava-tooltip-arrow {
        top: calc(var(--balaclava-tooltip-arrow-size) / -2);
        left: var(--arrow-offset, 50%);
        transform: translateX(-50%) rotate(45deg);
        border-right: none;
        border-bottom: none;
      }

      .balaclava-tooltip.is-left .balaclava-tooltip-arrow {
        right: calc(var(--balaclava-tooltip-arrow-size) / -2);
        top: var(--arrow-offset, 50%);
        transform: translateY(-50%) rotate(45deg);
        border-bottom: none;
        border-left: none;
      }

      .balaclava-tooltip.is-right .balaclava-tooltip-arrow {
        left: calc(var(--balaclava-tooltip-arrow-size) / -2);
        top: var(--arrow-offset, 50%);
        transform: translateY(-50%) rotate(45deg);
        border-top: none;
        border-right: none;
      }

      .balaclava-tooltip.is-top {
        transform-origin: var(--arrow-offset, 50%) calc(100% + var(--balaclava-tooltip-arrow-size));
      }

      .balaclava-tooltip.is-bottom {
        transform-origin: var(--arrow-offset, 50%) calc(0px - var(--balaclava-tooltip-arrow-size));
      }

      .balaclava-tooltip.is-left {
        transform-origin: calc(100% + var(--balaclava-tooltip-arrow-size)) var(--arrow-offset, 50%);
      }

      .balaclava-tooltip.is-right {
        transform-origin: calc(0px - var(--balaclava-tooltip-arrow-size)) var(--arrow-offset, 50%);
      }

      .balaclava-tooltip.is-entering {
        opacity: 0;
        transform: scale(0.97);
      }

      .balaclava-tooltip.is-exiting {
        opacity: 0;
        transform: scale(0.97);
      }

      @media (prefers-color-scheme: light) {
        .balaclava-tooltip.is-theme-system {
          --balaclava-tooltip-bg: ${THEME_TOKENS.light.bgColor};
          --balaclava-tooltip-text: ${THEME_TOKENS.light.textColor};
          --balaclava-tooltip-border: ${THEME_TOKENS.light.borderColor};
          --balaclava-tooltip-shadow: ${THEME_TOKENS.light.shadowColor};
          color-scheme: light;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .balaclava-tooltip {
          transition-duration: 1ms;
        }
      }
    `;
    }, getVisualConfig = function() {
      return {
        ...config,
        arrowBorderSize: config.arrowBorderSize ?? config.borderSize,
        arrowBorderColor: config.arrowBorderColor ?? "var(--balaclava-tooltip-border)",
        arrowBorderRadius: config.arrowBorderRadius ?? "3px"
      };
    }, exposeApi = function() {
      const api = {
        version: VERSION,
        show: showTooltip,
        hide: hideTooltip,
        configure,
        attach: attachTooltip,
        rescan: scanAll,
        destroy
      };
      rootWindow[API_NAME] = api;
      if (window !== rootWindow) {
        window[API_NAME] = api;
      }
    }, setupGlobalListeners = function() {
      if (globalListenersController) return;
      globalListenersController = new AbortController();
      const { signal } = globalListenersController;
      window.addEventListener("resize", updateVisibleTooltip, { passive: true, signal });
      window.addEventListener("scroll", scheduleScrollUpdate, { capture: true, passive: true, signal });
      window.addEventListener("keydown", handleKeydown, { passive: true, signal });
    }, handleKeydown = function(event) {
      if (event.key === "Escape" && isVisible) {
        hideTooltip();
      }
    }, scheduleScrollUpdate = function() {
      if (!isVisible) return;
      hideTooltip();
    }, updateVisibleTooltip = function() {
      if (!isVisible || !targetElement) return;
      if (!targetElement.isConnected) {
        hideTooltip();
        return;
      }
      targetRect = targetElement.getBoundingClientRect();
      updateTooltipPosition();
    }, showTooltip = function(target, content, options = {}) {
      if (!isElement(target)) {
        throw new TypeError("BalaclavaTooltip.show target must be an HTMLElement.");
      }
      ensureHost();
      cleanupTooltip();
      targetElement = target;
      targetRect = target.getBoundingClientRect();
      requestedPosition = normalizePosition(options.position);
      preferredPosition = requestedPosition;
      tooltipThemeOverride = normalizeOptionalTheme(options.theme);
      activeTheme = tooltipThemeOverride || config.theme;
      showArrow = options.showArrow !== false;
      arrowOffset = ARROW_OFFSET_DEFAULT;
      isVisible = true;
      target.setAttribute("aria-describedby", tooltipId);
      renderTooltip(content);
      setupIntersectionObserver();
      requestAnimationFrame(() => {
        updateVisibleTooltip();
        trackTargetPosition();
      });
    }, hideTooltip = function() {
      tooltipCooldownEnd = Date.now() + 600;
      cleanupTooltip();
    }, configure = function(userConfig = {}) {
      const nextConfig = { ...config };
      let hasCustomThemeOverride = false;
      for (const [key, value] of Object.entries(userConfig)) {
        if (value === void 0 || value === null) continue;
        if (key === "theme") {
          nextConfig.theme = normalizeTheme(value, nextConfig.theme);
          continue;
        }
        if (isConfigKey(key)) {
          nextConfig[key] = value;
          hasCustomThemeOverride = hasCustomThemeOverride || CUSTOM_THEME_KEYS.has(key);
        }
      }
      if (hasCustomThemeOverride && userConfig.theme === void 0) {
        nextConfig.theme = "custom";
      }
      config = nextConfig;
      if (styleEl) {
        styleEl.textContent = buildStylesheet();
      }
      if (host) {
        host.style.zIndex = String(config.zIndex);
      }
      if (isVisible && !tooltipThemeOverride) {
        activeTheme = config.theme;
        refreshTooltipClassName();
      }
      updateVisibleTooltip();
    }, attachTooltip = function(element, content, options = {}) {
      if (!isElement(element)) {
        throw new TypeError("BalaclavaTooltip.attach element must be an HTMLElement.");
      }
      const controller = new AbortController();
      const { signal } = controller;
      let detached = false;
      let hoverTimer = null;
      const doShow = () => showTooltip(element, resolveContent(content, element), options);
      const onMouseEnter = () => {
        if (Date.now() < tooltipCooldownEnd) {
          nextShowInstant = true;
          doShow();
          nextShowInstant = false;
        } else {
          hoverTimer = setTimeout(() => {
            hoverTimer = null;
            doShow();
          }, 200);
        }
      };
      const onMouseLeave = () => {
        if (hoverTimer !== null) {
          clearTimeout(hoverTimer);
          hoverTimer = null;
        }
        if (targetElement === element) hideTooltip();
      };
      element.addEventListener("mouseenter", onMouseEnter, { signal });
      element.addEventListener("mouseleave", onMouseLeave, { signal });
      element.addEventListener("focus", doShow, { signal });
      element.addEventListener("blur", () => {
        if (targetElement === element) hideTooltip();
      }, { signal });
      const detach = function detach2() {
        if (detached) return;
        detached = true;
        if (hoverTimer !== null) {
          clearTimeout(hoverTimer);
          hoverTimer = null;
        }
        controller.abort();
        attachmentDetachers.delete(detach2);
        if (targetElement === element) {
          hideTooltip();
        }
      };
      attachmentDetachers.add(detach);
      return detach;
    }, resolveContent = function(content, element) {
      return typeof content === "function" ? content(element) : content;
    }, scanAll = function(root = document) {
      root.querySelectorAll?.("[data-balaclava-tooltip]").forEach(scanElement);
    }, scanElement = function(element) {
      if (!isElement(element) || attachedElements.has(element)) return;
      const text = element.getAttribute("data-balaclava-tooltip");
      if (!text) return;
      const position = normalizePosition(element.getAttribute("data-balaclava-tooltip-position"));
      const arrow = element.getAttribute("data-balaclava-tooltip-arrow") !== "false";
      const theme = normalizeOptionalTheme(element.getAttribute("data-balaclava-tooltip-theme"));
      const options = { position, showArrow: arrow };
      if (theme) {
        options.theme = theme;
      }
      const detach = attachTooltip(element, text, options);
      attachedElements.set(element, detach);
    }, setupMutationObserver = function() {
      const observerRoot = document.body || document.documentElement;
      if (mutationObserver || !observerRoot) return;
      mutationObserver = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          if (mutation.type === "childList") {
            mutation.addedNodes.forEach(scanAddedNode);
            mutation.removedNodes.forEach(cleanupRemovedNode);
          }
          if (mutation.type === "attributes") {
            refreshElement(mutation.target);
          }
        }
      });
      mutationObserver.observe(observerRoot, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: [
          "data-balaclava-tooltip",
          "data-balaclava-tooltip-position",
          "data-balaclava-tooltip-arrow",
          "data-balaclava-tooltip-theme"
        ]
      });
    }, scanAddedNode = function(node) {
      if (!isElement(node)) return;
      if (node.hasAttribute("data-balaclava-tooltip")) {
        scanElement(node);
      }
      scanAll(node);
    }, cleanupRemovedNode = function(node) {
      if (!isElement(node)) return;
      cleanupAttachedElement(node);
      node.querySelectorAll?.("[data-balaclava-tooltip]").forEach(cleanupAttachedElement);
      if (targetElement && (node === targetElement || node.contains(targetElement))) {
        hideTooltip();
      }
    }, cleanupAttachedElement = function(element) {
      if (!isElement(element)) return;
      const detach = attachedElements.get(element);
      if (detach) {
        detach();
        attachedElements.delete(element);
      }
    }, refreshElement = function(target) {
      if (!isElement(target)) return;
      cleanupAttachedElement(target);
      if (target.hasAttribute("data-balaclava-tooltip")) {
        scanElement(target);
      }
    }, renderTooltip = function(content) {
      if (!shadow) return;
      if (tooltipEl) {
        tooltipEl.remove();
      }
      tooltipEl = document.createElement("div");
      tooltipEl.id = tooltipId;
      tooltipEl.className = nextShowInstant ? getTooltipClassName() : `${getTooltipClassName()} is-entering`;
      if (nextShowInstant) tooltipEl.setAttribute("data-instant", "");
      tooltipEl.setAttribute("role", "tooltip");
      tooltipEl.setAttribute("aria-live", "polite");
      tooltipEl.style.setProperty("--arrow-offset", `${arrowOffset}%`);
      const contentEl = document.createElement("div");
      contentEl.className = "balaclava-tooltip-content";
      if (isNode(content)) {
        const clone = content.cloneNode(true);
        contentEl.appendChild(clone);
        tooltipEl.setAttribute("aria-label", clone.textContent?.trim() || "Tooltip");
      } else {
        const text = content == null ? "" : String(content);
        contentEl.textContent = text;
        tooltipEl.setAttribute("aria-label", text);
      }
      tooltipEl.appendChild(contentEl);
      if (showArrow) {
        const arrowEl = document.createElement("span");
        arrowEl.className = "balaclava-tooltip-arrow";
        arrowEl.setAttribute("aria-hidden", "true");
        tooltipEl.appendChild(arrowEl);
      }
      shadow.appendChild(tooltipEl);
      if (!nextShowInstant) {
        requestAnimationFrame(() => {
          if (tooltipEl) {
            tooltipEl.classList.remove("is-entering");
          }
        });
      }
    }, setupIntersectionObserver = function() {
      cleanupIntersectionObserver();
      if (!targetElement || typeof IntersectionObserver === "undefined") return;
      intersectionObserver = new IntersectionObserver((entries) => {
        if (entries.some((entry) => !entry.isIntersecting)) {
          hideTooltip();
        }
      });
      intersectionObserver.observe(targetElement);
    }, cleanupIntersectionObserver = function() {
      if (intersectionObserver) {
        intersectionObserver.disconnect();
        intersectionObserver = null;
      }
    }, cleanupTooltip = function() {
      if (targetElement) {
        targetElement.removeAttribute("aria-describedby");
      }
      if (positionTrackingId !== null) {
        cancelAnimationFrame(positionTrackingId);
        positionTrackingId = null;
      }
      if (tooltipEl) {
        const exiting = tooltipEl;
        tooltipEl = null;
        exiting.removeAttribute("id");
        exiting.classList.add("is-exiting");
        const remove = () => {
          if (exiting.isConnected) exiting.remove();
        };
        exiting.addEventListener("transitionend", remove, { once: true });
        setTimeout(remove, 200);
      }
      cleanupIntersectionObserver();
      isVisible = false;
      targetElement = null;
      targetRect = null;
      preferredPosition = requestedPosition;
      tooltipThemeOverride = null;
      activeTheme = config.theme;
      arrowOffset = ARROW_OFFSET_DEFAULT;
    }, destroy = function() {
      if (readyController) {
        readyController.abort();
        readyController = null;
      }
      if (globalListenersController) {
        globalListenersController.abort();
        globalListenersController = null;
      }
      Array.from(attachmentDetachers).forEach((detach) => detach());
      attachmentDetachers.clear();
      attachedElements = /* @__PURE__ */ new WeakMap();
      cleanupTooltip();
      if (mutationObserver) {
        mutationObserver.disconnect();
        mutationObserver = null;
      }
      if (host) {
        host.remove();
      }
      host = null;
      shadow = null;
      styleEl = null;
      if (rootWindow[API_NAME]?.version === VERSION) {
        try {
          delete rootWindow[API_NAME];
        } catch {
          rootWindow[API_NAME] = void 0;
        }
      }
      const pageWindow = window;
      if (window !== rootWindow && pageWindow[API_NAME]?.version === VERSION) {
        try {
          delete pageWindow[API_NAME];
        } catch {
          pageWindow[API_NAME] = void 0;
        }
      }
    }, trackTargetPosition = function() {
      if (!isVisible || !targetElement) return;
      if (!targetElement.isConnected) {
        hideTooltip();
        return;
      }
      const newRect = targetElement.getBoundingClientRect();
      if (!sameRect(targetRect, newRect)) {
        targetRect = newRect;
        updateTooltipPosition();
      }
      positionTrackingId = requestAnimationFrame(trackTargetPosition);
    }, updateTooltipPosition = function() {
      if (!targetRect || !tooltipEl) return;
      preferredPosition = requestedPosition;
      arrowOffset = ARROW_OFFSET_DEFAULT;
      const rect = tooltipEl.getBoundingClientRect();
      const tooltipWidth = rect.width;
      const tooltipHeight = rect.height;
      const position = getInitialPosition(tooltipWidth, tooltipHeight);
      applyFallback(position, tooltipWidth, tooltipHeight);
      clampToViewport(position, tooltipWidth, tooltipHeight);
      tooltipEl.style.top = `${Math.round(position.top)}px`;
      tooltipEl.style.left = `${Math.round(position.left)}px`;
      tooltipEl.style.setProperty("--arrow-offset", `${arrowOffset}%`);
      refreshTooltipClassName();
    }, getInitialPosition = function(tooltipWidth, tooltipHeight) {
      if (!targetRect) return { top: SAFEZONE, left: SAFEZONE };
      const targetCenterX = targetRect.left + targetRect.width / 2;
      const targetCenterY = targetRect.top + targetRect.height / 2;
      switch (preferredPosition) {
        case "top":
          return {
            top: targetRect.top - tooltipHeight - config.offset,
            left: targetCenterX - tooltipWidth / 2
          };
        case "left":
          return {
            top: targetCenterY - tooltipHeight / 2,
            left: targetRect.left - tooltipWidth - config.offset
          };
        case "right":
          return {
            top: targetCenterY - tooltipHeight / 2,
            left: targetRect.right + config.offset
          };
        case "bottom":
        default:
          return {
            top: targetRect.bottom + config.offset,
            left: targetCenterX - tooltipWidth / 2
          };
      }
    }, applyFallback = function(position, tooltipWidth, tooltipHeight) {
      if (!targetRect) return;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      switch (preferredPosition) {
        case "bottom": {
          const alternateTop = targetRect.top - tooltipHeight - config.offset;
          if (position.top + tooltipHeight > viewportHeight - SAFEZONE && alternateTop >= SAFEZONE) {
            position.top = alternateTop;
            preferredPosition = "top";
          }
          break;
        }
        case "top": {
          const alternateTop = targetRect.bottom + config.offset;
          if (position.top < SAFEZONE && alternateTop + tooltipHeight <= viewportHeight - SAFEZONE) {
            position.top = alternateTop;
            preferredPosition = "bottom";
          }
          break;
        }
        case "left": {
          const alternateLeft = targetRect.right + config.offset;
          if (position.left < SAFEZONE && alternateLeft + tooltipWidth <= viewportWidth - SAFEZONE) {
            position.left = alternateLeft;
            preferredPosition = "right";
          }
          break;
        }
        case "right": {
          const alternateLeft = targetRect.left - tooltipWidth - config.offset;
          if (position.left + tooltipWidth > viewportWidth - SAFEZONE && alternateLeft >= SAFEZONE) {
            position.left = alternateLeft;
            preferredPosition = "left";
          }
          break;
        }
      }
    }, clampToViewport = function(position, tooltipWidth, tooltipHeight) {
      const original = { top: position.top, left: position.left };
      const maxTop = Math.max(SAFEZONE, window.innerHeight - tooltipHeight - SAFEZONE);
      const maxLeft = Math.max(SAFEZONE, window.innerWidth - tooltipWidth - SAFEZONE);
      position.top = Math.max(SAFEZONE, Math.min(position.top, maxTop));
      position.left = Math.max(SAFEZONE, Math.min(position.left, maxLeft));
      if (showArrow) {
        updateArrowOffset(original, position, tooltipWidth, tooltipHeight);
      }
    }, updateArrowOffset = function(original, clamped, tooltipWidth, tooltipHeight) {
      if (!targetRect) return;
      arrowOffset = ARROW_OFFSET_DEFAULT;
      if (preferredPosition === "top" || preferredPosition === "bottom") {
        if (original.left !== clamped.left) {
          const targetCenterX = targetRect.left + targetRect.width / 2;
          const offset = targetCenterX - clamped.left;
          arrowOffset = calculatePercentageOffset(offset, tooltipWidth);
        }
        return;
      }
      if (original.top !== clamped.top) {
        const targetCenterY = targetRect.top + targetRect.height / 2;
        const offset = targetCenterY - clamped.top;
        arrowOffset = calculatePercentageOffset(offset, tooltipHeight);
      }
    }, calculatePercentageOffset = function(offset, dimension) {
      if (!dimension) return ARROW_OFFSET_DEFAULT;
      const percentage = offset / dimension * 100;
      return Math.max(ARROW_OFFSET_MIN, Math.min(ARROW_OFFSET_MAX, percentage));
    }, sameRect = function(left, right) {
      if (!left || !right) return false;
      return left.top === right.top && left.right === right.right && left.bottom === right.bottom && left.left === right.left && left.width === right.width && left.height === right.height;
    }, normalizePosition = function(value) {
      return typeof value === "string" && VALID_POSITIONS.has(value) ? value : "bottom";
    }, normalizeTheme = function(value, fallback = "system") {
      return normalizeOptionalTheme(value) || fallback;
    }, normalizeOptionalTheme = function(value) {
      const theme = typeof value === "string" ? value.toLowerCase() : value;
      return VALID_THEMES.has(theme) ? theme : null;
    }, getTooltipClassName = function() {
      return `balaclava-tooltip is-${preferredPosition} is-theme-${activeTheme}`;
    }, refreshTooltipClassName = function() {
      if (!tooltipEl) return;
      const isEntering = tooltipEl.classList.contains("is-entering");
      tooltipEl.className = `${getTooltipClassName()}${isEntering ? " is-entering" : ""}`;
    }, isConfigKey = function(value) {
      return Object.prototype.hasOwnProperty.call(DEFAULT_CONFIG, value);
    }, isElement = function(value) {
      return Boolean(
        value && typeof value === "object" && value.nodeType === Node.ELEMENT_NODE && typeof value.getBoundingClientRect === "function"
      );
    }, isNode = function(value) {
      return Boolean(
        value && typeof value === "object" && typeof value.nodeType === "number" && typeof value.cloneNode === "function"
      );
    };
    init2 = init, ensureHost2 = ensureHost, buildStylesheet2 = buildStylesheet, getVisualConfig2 = getVisualConfig, exposeApi2 = exposeApi, setupGlobalListeners2 = setupGlobalListeners, handleKeydown2 = handleKeydown, scheduleScrollUpdate2 = scheduleScrollUpdate, updateVisibleTooltip2 = updateVisibleTooltip, showTooltip2 = showTooltip, hideTooltip2 = hideTooltip, configure2 = configure, attachTooltip2 = attachTooltip, resolveContent2 = resolveContent, scanAll2 = scanAll, scanElement2 = scanElement, setupMutationObserver2 = setupMutationObserver, scanAddedNode2 = scanAddedNode, cleanupRemovedNode2 = cleanupRemovedNode, cleanupAttachedElement2 = cleanupAttachedElement, refreshElement2 = refreshElement, renderTooltip2 = renderTooltip, setupIntersectionObserver2 = setupIntersectionObserver, cleanupIntersectionObserver2 = cleanupIntersectionObserver, cleanupTooltip2 = cleanupTooltip, destroy2 = destroy, trackTargetPosition2 = trackTargetPosition, updateTooltipPosition2 = updateTooltipPosition, getInitialPosition2 = getInitialPosition, applyFallback2 = applyFallback, clampToViewport2 = clampToViewport, updateArrowOffset2 = updateArrowOffset, calculatePercentageOffset2 = calculatePercentageOffset, sameRect2 = sameRect, normalizePosition2 = normalizePosition, normalizeTheme2 = normalizeTheme, normalizeOptionalTheme2 = normalizeOptionalTheme, getTooltipClassName2 = getTooltipClassName, refreshTooltipClassName2 = refreshTooltipClassName, isConfigKey2 = isConfigKey, isElement2 = isElement, isNode2 = isNode;
    const DEFAULT_CONFIG = Object.freeze({
      theme: "system",
      bgColor: THEME_TOKENS.dark.bgColor,
      textColor: THEME_TOKENS.dark.textColor,
      borderColor: THEME_TOKENS.dark.borderColor,
      shadowColor: THEME_TOKENS.dark.shadowColor,
      borderSize: "0",
      borderRadius: "8px",
      padding: "8px 12px",
      maxWidth: "250px",
      arrowSize: "12px",
      arrowBorderSize: null,
      arrowBorderColor: null,
      arrowBorderRadius: null,
      zIndex: 2147483647,
      animationDuration: "150ms",
      fontSize: "13px",
      offset: 8
    });
    let config = { ...DEFAULT_CONFIG };
    let host = null;
    let shadow = null;
    let styleEl = null;
    let tooltipEl = null;
    let targetElement = null;
    let targetRect = null;
    let preferredPosition = "bottom";
    let requestedPosition = "bottom";
    let activeTheme = DEFAULT_CONFIG.theme;
    let tooltipThemeOverride = null;
    let showArrow = true;
    let arrowOffset = ARROW_OFFSET_DEFAULT;
    let positionTrackingId = null;
    let intersectionObserver = null;
    let mutationObserver = null;
    let isVisible = false;
    let globalListenersController = null;
    let readyController = null;
    let tooltipCooldownEnd = 0;
    let nextShowInstant = false;
    const tooltipId = `balaclava-tt-${Math.random().toString(36).slice(2, 11)}`;
    let attachedElements = /* @__PURE__ */ new WeakMap();
    const attachmentDetachers = /* @__PURE__ */ new Set();
    exposeApi();
    if (document.readyState === "loading") {
      readyController = new AbortController();
      document.addEventListener(
        "DOMContentLoaded",
        () => {
          readyController = null;
          init();
        },
        { once: true, signal: readyController.signal }
      );
    } else {
      init();
    }
  }
  var init2;
  var ensureHost2;
  var buildStylesheet2;
  var getVisualConfig2;
  var exposeApi2;
  var setupGlobalListeners2;
  var handleKeydown2;
  var scheduleScrollUpdate2;
  var updateVisibleTooltip2;
  var showTooltip2;
  var hideTooltip2;
  var configure2;
  var attachTooltip2;
  var resolveContent2;
  var scanAll2;
  var scanElement2;
  var setupMutationObserver2;
  var scanAddedNode2;
  var cleanupRemovedNode2;
  var cleanupAttachedElement2;
  var refreshElement2;
  var renderTooltip2;
  var setupIntersectionObserver2;
  var cleanupIntersectionObserver2;
  var cleanupTooltip2;
  var destroy2;
  var trackTargetPosition2;
  var updateTooltipPosition2;
  var getInitialPosition2;
  var applyFallback2;
  var clampToViewport2;
  var updateArrowOffset2;
  var calculatePercentageOffset2;
  var sameRect2;
  var normalizePosition2;
  var normalizeTheme2;
  var normalizeOptionalTheme2;
  var getTooltipClassName2;
  var refreshTooltipClassName2;
  var isConfigKey2;
  var isElement2;
  var isNode2;

  // src/userscripts/arsonists-ledger/engine.ts
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
  function calcNerve(scenario) {
    const { evidence, ignite, place, stoke, dampen } = strategy.actions;
    const items = itemActionCount(evidence) + itemActionCount(place) + itemActionCount(stoke) + itemActionCount(dampen);
    void ignite;
    return 10 + items * 5;
  }
  function calcMaterialCost(strategy2, prices) {
    const { evidence, ignite, place, stoke, dampen } = strategy2.actions;
    return itemCost(evidence, prices) + itemCost(ignite, prices) + itemCost(place, prices) + itemCost(stoke, prices) + itemCost(dampen, prices);
  }
  function calcProfitPerNerve(strategy2, prices) {
    const nerve = calcNerve(strategy2);
    const cost = calcMaterialCost(strategy2, prices);
    return (strategy2.payout - cost) / nerve;
  }
  function profitBand(ppn, thresholds2) {
    if (ppn <= 0) return "negative";
    if (ppn <= thresholds2.low) return "low";
    if (ppn <= thresholds2.good) return "good";
    return "excellent";
  }
  function formatPpn(ppn) {
    const sign = ppn < 0 ? "-" : "";
    const rounded = Math.floor(Math.abs(ppn) / 100) * 100;
    if (rounded >= 1e3) return `~$${sign}${(rounded / 1e3).toFixed(1)}k`;
    return `~$${sign}${rounded}`;
  }
  function scenarioNeedsFlamethrower(s) {
    return Object.values(s.actions).flat().some(
      (item) => item.resourceId === "flamethrower"
    );
  }
  function rankForScenario(candidates, hasFlamethrower, prices, thresholds2) {
    const eligible = candidates.filter((s) => {
      if (!hasFlamethrower && scenarioNeedsFlamethrower(s)) return false;
      return true;
    });
    if (eligible.length === 0) return null;
    const ranked = eligible.map((s) => {
      const ppn = calcProfitPerNerve(s, prices);
      return {
        scenario: s,
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
    return ranked[0];
  }

  // src/userscripts/arsonists-ledger/colors.ts
  var BAND_COLOR = {
    negative: "#f66",
    low: "#fa0",
    good: "#3c9",
    excellent: "#c9f"
  };

  // src/userscripts/arsonists-ledger/tooltip.ts
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
  function itemCost2(item, prices) {
    const resource = CATALOG[item.resourceId];
    if (!resource || resource.isTool) return null;
    const unitPrice = prices[item.resourceId] ?? resource.defaultPrice;
    const total = item.qty * unitPrice;
    return total > 0 ? total : null;
  }
  function formatCost(total) {
    if (total >= 1e3) return `$${(total / 1e3).toFixed(1)}k`;
    return `$${total}`;
  }
  function actionSection(label, items, prices, timing) {
    if (!items || items.length === 0) return null;
    const div = el("div", "pyro-tt-action");
    const labelEl = el("span", "pyro-tt-action-label");
    if (timing) {
      labelEl.innerHTML = `${label} <span class="pyro-tt-timing">${timing}</span>`;
    } else {
      labelEl.textContent = label;
    }
    const valueEl = el("span", "pyro-tt-action-value");
    items.forEach((item, i) => {
      if (i > 0) valueEl.appendChild(document.createTextNode(", "));
      const name = CATALOG[item.resourceId]?.name ?? item.resourceId;
      const prefix = item.optional ? "~" : "";
      valueEl.appendChild(document.createTextNode(`${prefix}${item.qty}\xD7 ${name}`));
      const cost = itemCost2(item, prices);
      if (cost !== null) {
        const costEl = el("span", "pyro-tt-item-cost");
        costEl.textContent = ` (${formatCost(cost)})`;
        valueEl.appendChild(costEl);
      }
    });
    div.appendChild(labelEl);
    div.appendChild(valueEl);
    return div;
  }
  function buildPrimaryBlock(ranked, prices, statsOnly = false) {
    const frag = document.createDocumentFragment();
    const { Scenario, profitPerNerve, materialCost, baseNerve } = ranked;
    const header = el("div", "pyro-tt-header");
    const title = el("span", "pyro-tt-title");
    title.textContent = "Profit";
    header.appendChild(title);
    const ppnEl = el("span", `pyro-tt-ppn pyro-tt-band--${ranked.band}`);
    ppnEl.textContent = formatPpn(profitPerNerve);
    header.appendChild(ppnEl);
    if (Scenario.needsVerification) {
      const badge = el("span", "pyro-tt-unconfirmed");
      badge.textContent = "unconfirmed";
      header.appendChild(badge);
    }
    frag.appendChild(header);
    const stats = el("div", "pyro-tt-stats");
    stats.appendChild(row("Payout", `~$${(Scenario.payout / 1e3).toFixed(0)}k`));
    stats.appendChild(row("Cost", `~$${(materialCost / 1e3).toFixed(1)}k`));
    stats.appendChild(row("Nerve", String(baseNerve)));
    frag.appendChild(stats);
    if (statsOnly) return frag;
    frag.appendChild(el("hr", "pyro-tt-divider"));
    const { evidence, place, stoke, stokeTime, dampen, dampenTime } = Scenario.actions;
    const ignite = Scenario.actions.ignite ?? [{ resourceId: RESOURCE.LIGHTER, qty: 1 }];
    const actionOrder = [
      ["Evidence", evidence, void 0],
      ["Place", place, void 0],
      ["Ignite", ignite, void 0],
      ["Stoke", stoke, stokeTime],
      ["Dampen", dampen, dampenTime]
    ];
    for (const [label, items, timing] of actionOrder) {
      const s = actionSection(label, items, prices, timing);
      if (s) frag.appendChild(s);
    }
    if (Scenario.notes) {
      const note = el("div", "pyro-tt-notes");
      note.textContent = Scenario.notes;
      frag.appendChild(note);
    }
    return frag;
  }
  function buildTooltipContent(ranked, prices, statsOnly = false) {
    const root = el("div", "pyro-tt");
    if (!ranked) return root;
    root.appendChild(buildPrimaryBlock(ranked, prices, statsOnly));
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
.pyro-tt-title {
    font-weight: bold;
    font-size: 14px;
}
.pyro-tt-ppn {
    font-weight: bold;
    font-size: 14px;
}
.pyro-tt-band--negative { color: ${BAND_COLOR.negative}; }
.pyro-tt-band--low      { color: ${BAND_COLOR.low};      }
.pyro-tt-band--good     { color: ${BAND_COLOR.good};     }
.pyro-tt-band--excellent  { color: ${BAND_COLOR.excellent};  }
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
}
.pyro-tt-row {
    display: flex;
    flex-direction: column;
    font-size: 11px;
}
.pyro-tt-label {
    color: oklch(66% 0 0);
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
    color: oklch(66% 0 0);
    font-size: 11px;
}
.pyro-tt-timing {
    font-size: 9px;
    opacity: 0.55;
    margin-left: 4px;
}
.pyro-tt-action-value {
    font-size: 11px;
    font-weight: bold;
}
.pyro-tt-item-cost {
    color: oklch(66% 0 0);
    font-size: 10px;
    font-weight: normal;
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

.balaclava-tooltip.is-theme-dark {
    --balaclava-tooltip-bg: oklch(24% 0 0);
    --balaclava-tooltip-border-size: 1px;
    --balaclava-tooltip-border: oklch(30% 0 0);
}
`;
  }

  // src/userscripts/arsonists-ledger/selectors.ts
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
    PENDING_COLLECT: ".pending-collect",
    /** Crime image thumbnail — used as the mobile tooltip anchor. */
    CRIME_IMAGE: ".crime-image"
  };

  // src/userscripts/arsonists-ledger/api.ts
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

  // src/userscripts/arsonists-ledger/settings.ts
  function el2(tag, className) {
    const e = document.createElement(tag);
    if (className) e.className = className;
    return e;
  }
  function txt(content) {
    return document.createTextNode(content);
  }
  function checkIcon() {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "16");
    svg.setAttribute("height", "16");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-width", "2");
    svg.setAttribute("stroke-linecap", "round");
    svg.setAttribute("stroke-linejoin", "round");
    svg.style.verticalAlign = "middle";
    svg.style.marginRight = "4px";
    const blank = document.createElementNS("http://www.w3.org/2000/svg", "path");
    blank.setAttribute("stroke", "none");
    blank.setAttribute("d", "M0 0h24v24H0z");
    blank.setAttribute("fill", "none");
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "path");
    circle.setAttribute("d", "M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0");
    const tick = document.createElementNS("http://www.w3.org/2000/svg", "path");
    tick.setAttribute("d", "M9 12l2 2l4 -4");
    svg.appendChild(blank);
    svg.appendChild(circle);
    svg.appendChild(tick);
    return svg;
  }
  function setOkStatus(el3, message) {
    el3.textContent = "";
    el3.appendChild(checkIcon());
    el3.appendChild(txt(message));
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
    padding: 3px 7px;
    font-size: 13px;
    line-height: 1;
    user-select: none;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 100ms ease-out;
}
#pyro-settings-btn:hover { background: rgba(255,255,255,0.08); color: #fff; }
#pyro-settings-btn:active { transform: scale(0.94); }
#pyro-settings-panel {
    --pyro-api-color: #6d6;
    --pyro-manual-color: #7af;
    --pyro-db-color: #aaa;
    position: absolute;
    top: calc(100% + 6px);
    right: 0;
    z-index: 9999;
    background: #1c1c1c;
    border: 1px solid #3a3a3a;
    border-radius: 6px;
    min-width: 290px;
    max-width: 360px;
    box-shadow: 0 8px 28px oklch(6% 0.01 260 / 0.6);
    overflow: hidden;
    transform-origin: top right;
    transform: scale(0.95);
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
    transition: transform 150ms ease-out, opacity 150ms ease-out, visibility 0ms linear 150ms;
}
#pyro-settings-panel.is-open {
    transform: scale(1);
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
    transition: transform 150ms ease-out, opacity 150ms ease-out, visibility 0ms linear 0ms;
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
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.04em;
}
.pyro-tab:hover { color: #bbb; }
.pyro-tab.active { color: #fff; border-bottom-color: ${BAND_COLOR.excellent}; }
.pyro-tab-content {
    padding: 10px;
    max-height: 380px;
    overflow-y: auto;
}
.pyro-s-group { margin-bottom: 10px; }
.pyro-s-group:last-child { margin-bottom: 0; }
.pyro-s-group-title {
    font-size: 10px;
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
.pyro-s-input:focus { outline: none; border-color: ${BAND_COLOR.excellent}; }
.pyro-s-input.from-api   { border-color: #4a4; color: #6d6; }
.pyro-s-input.overridden { border-color: #48a; color: #7af; }
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
.pyro-s-key-input:focus { outline: none; border-color: ${BAND_COLOR.excellent}; }
.pyro-s-btn {
    background: #252525;
    border: 1px solid #484848;
    color: #bbb;
    cursor: pointer;
    border-radius: 3px;
    padding: 4px 9px;
    font-size: 11px;
    white-space: nowrap;
    transition: transform 100ms ease-out;
}
.pyro-s-btn:hover:not(:disabled) { background: #303030; color: #fff; }
.pyro-s-btn:active:not(:disabled) { transform: scale(0.97); }
.pyro-s-btn:disabled { opacity: 0.35; cursor: default; }
.pyro-s-status {
    font-size: 10px;
    margin-bottom: 8px;
    min-height: 13px;
    color: #666;
    display: flex;
    align-items: center;
    gap: 2px;
    flex-wrap: nowrap;
}
.pyro-s-status.ok  { color: ${BAND_COLOR.good}; }
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
.pyro-s-section-note { display: flex; align-items: flex-start; gap: 5px; font-size: 10px; line-height: 1.4; color: #555; margin-bottom: 6px; }
.pyro-s-section-note > svg { width: 10px; height: 10px; flex-shrink: 0; margin-top: 1px; }
.pyro-s-section-note strong { color: #999; font-weight: 600; }
.pyro-s-section-note a { color: ${BAND_COLOR.excellent}; text-decoration: none; display: inline-flex; align-items: center; gap: 3px; }
.pyro-s-section-note a:hover { text-decoration: underline; }
.pyro-s-section-note a svg { width: 10px; height: 10px; flex-shrink: 0; }
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
      ids: ["magnesium", "thermite", "potassium_nitrate"]
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
  function buildPricesTab(ctx, panel) {
    const root = el2("div");
    const actionGroup = el2("div", "pyro-s-group");
    const actionRow = el2("div", "pyro-s-refresh-row");
    const refreshBtn = el2("button", "pyro-s-btn");
    refreshBtn.textContent = "Refresh";
    if (!ctx.getApiKey()) refreshBtn.disabled = true;
    const resetBtn = el2("button", "pyro-s-btn");
    resetBtn.textContent = "Reset";
    if (!ctx.getApiLastRefresh()) resetBtn.disabled = true;
    const tsEl = el2("span", "pyro-s-timestamp");
    const ts = ctx.getApiLastRefresh();
    tsEl.textContent = ts ? `Fetched: ${formatTimestamp(ts)}` : `DB: ${CATALOG_UPDATED}`;
    actionRow.appendChild(refreshBtn);
    actionRow.appendChild(resetBtn);
    actionRow.appendChild(tsEl);
    actionGroup.appendChild(actionRow);
    const actionStatus = el2("div", "pyro-s-status");
    actionGroup.appendChild(actionStatus);
    root.appendChild(actionGroup);
    refreshBtn.addEventListener("click", async () => {
      refreshBtn.disabled = true;
      actionStatus.textContent = "Refreshing\u2026";
      actionStatus.className = "pyro-s-status";
      const result = await fetchApiPrices(ctx.getApiKey());
      refreshBtn.disabled = !ctx.getApiKey();
      if (result.success && result.prices) {
        ctx.setApiPrices(result.prices, Date.now());
        setOkStatus(actionStatus, `${result.updatedCount} prices updated`);
        actionStatus.className = "pyro-s-status ok";
        rerenderTab(panel, "prices", ctx);
      } else {
        actionStatus.textContent = `\u2717 ${result.error ?? "Unknown error"}`;
        actionStatus.className = "pyro-s-status err";
      }
    });
    resetBtn.addEventListener("click", () => {
      ctx.clearApiPrices();
      rerenderTab(panel, "prices", ctx);
    });
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
    note.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0"/><path d="M12 9h.01"/><path d="M11 12h1v4h1"/></svg><span>Saved prices as of ${CATALOG_UPDATED}. API price active in <span style="color: var(--pyro-api-color);">green</span>. Manual override in <span style="color: var(--pyro-manual-color);">blue</span>. Clear manual price to revert to API or database <span style="color: var(--pyro-db-color);">default</span>.</span>`;
    root.appendChild(note);
    return root;
  }
  function arrowIcon() {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "12");
    svg.setAttribute("height", "12");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-width", "2");
    svg.setAttribute("stroke-linecap", "round");
    svg.setAttribute("stroke-linejoin", "round");
    svg.style.verticalAlign = "middle";
    svg.style.margin = "0 2px";
    const blank = document.createElementNS("http://www.w3.org/2000/svg", "path");
    blank.setAttribute("stroke", "none");
    blank.setAttribute("d", "M0 0h24v24H0z");
    blank.setAttribute("fill", "none");
    const line = document.createElementNS("http://www.w3.org/2000/svg", "path");
    line.setAttribute("d", "M5 12l14 0");
    const upper = document.createElementNS("http://www.w3.org/2000/svg", "path");
    upper.setAttribute("d", "M15 16l4 -4");
    const lower = document.createElementNS("http://www.w3.org/2000/svg", "path");
    lower.setAttribute("d", "M15 8l4 4");
    svg.appendChild(blank);
    svg.appendChild(line);
    svg.appendChild(upper);
    svg.appendChild(lower);
    return svg;
  }
  function thresholdInput(label, getVal, setVal, ctx) {
    const row2 = el2("div", "pyro-s-row");
    const lbl = el2("span", "pyro-s-label");
    const [before, after] = label.split("\u2192");
    lbl.appendChild(txt(before.trim()));
    lbl.appendChild(arrowIcon());
    lbl.appendChild(txt((after ?? "").trim()));
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
  function buildThresholdsTab(ctx) {
    const root = el2("div");
    const g = el2("div", "pyro-s-group");
    const bandNote = el2("p", "pyro-s-section-note");
    bandNote.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0"/><path d="M12 9h.01"/><path d="M11 12h1v4h1"/></svg><span>Cards are color-coded by profit/nerve: <span style="color:${BAND_COLOR.negative}">negative</span> (\u2264 0), <span style="color:${BAND_COLOR.low}">low</span>, <span style="color:${BAND_COLOR.good}">good</span>, <span style="color:${BAND_COLOR.excellent}">excellent</span>.</span>`;
    g.appendChild(bandNote);
    g.appendChild(thresholdInput(
      "Low \u2192 Good ($/N)",
      () => ctx.getThresholds().low,
      (val) => {
        const t = ctx.getThresholds();
        ctx.setThresholds({ low: val, good: Math.max(val, t.good) });
      },
      ctx
    ));
    g.appendChild(thresholdInput(
      "Good \u2192 Excellent ($/N)",
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
  function buildApiTab(ctx) {
    const root = el2("div");
    const keyGroup = el2("div", "pyro-s-group");
    const keyNote = el2("p", "pyro-s-section-note");
    keyNote.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0"/><path d="M12 9h.01"/><path d="M11 12h1v4h1"/></svg><span><strong>Public access</strong> only, used solely to fetch item market prices. <a href="https://www.torn.com/preferences.php#tab=api?step=addNewKey&title=Pyromaniac%27s+Ledger&torn=items" target="_blank" rel="noopener noreferrer">Create one <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 6h-6a2 2 0 0 0 -2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-6"/><path d="M11 13l9 -9"/><path d="M15 4h5v5"/></svg></a></span>`;
    keyGroup.appendChild(keyNote);
    const storageNote = el2("p", "pyro-s-section-note");
    storageNote.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0"/><path d="M12 9h.01"/><path d="M11 12h1v4h1"/></svg><span>Stored by your userscript manager only, <strong>never</strong> sent to any server other than Torn's API.</span>`;
    keyGroup.appendChild(storageNote);
    const keyRow = el2("div", "pyro-s-key-row");
    const keyInput = el2("input", "pyro-s-key-input");
    keyInput.type = "password";
    keyInput.placeholder = "Your Torn API key";
    keyInput.value = ctx.getApiKey();
    keyInput.autocomplete = "off";
    keyInput.spellcheck = false;
    const saveBtn = el2("button", "pyro-s-btn");
    saveBtn.textContent = "Validate & save";
    keyRow.appendChild(keyInput);
    keyRow.appendChild(saveBtn);
    keyGroup.appendChild(keyRow);
    const keyStatus = el2("div", "pyro-s-status");
    if (ctx.getApiKey()) {
      setOkStatus(keyStatus, "Key saved");
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
        setOkStatus(keyStatus, `Valid, ${result.updatedCount} prices updated`);
        keyStatus.className = "pyro-s-status ok";
      } else {
        keyStatus.textContent = `\u2717 ${result.error ?? "Unknown error"}`;
        keyStatus.className = "pyro-s-status err";
      }
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
    header.textContent = missing.length ? `Missing scenarios observed this session (${missing.length}):` : "No Missing scenarios observed this session.";
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
    { id: "thresholds", label: "Thresholds" },
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
        return buildPricesTab(ctx, panel);
      case "thresholds":
        return buildThresholdsTab(ctx);
      case "api":
        return buildApiTab(ctx);
      case "debug":
        return buildDebugTab(ctx);
      default:
        return buildPricesTab(ctx, panel);
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
    btn.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>';
    const panel = el2("div");
    panel.id = "pyro-settings-panel";
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
      const isOpen = panel.classList.contains("is-open");
      panel.classList.toggle("is-open", !isOpen);
      btn.setAttribute("aria-expanded", String(!isOpen));
      if (!isOpen && (ctx.getActiveTab() || "prices") === "debug") {
        rerenderTab(panel, "debug", ctx);
      }
    });
    document.addEventListener("click", (e) => {
      if (!wrap.contains(e.target)) {
        panel.classList.remove("is-open");
        btn.setAttribute("aria-expanded", "false");
      }
    }, { passive: true });
  }

  // src/userscripts/arsonists-ledger/index.ts
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
    const candidates = [];
    if (typeof unsafeWindow !== "undefined") candidates.push(unsafeWindow);
    if (!candidates.includes(window)) candidates.push(window);
    for (const w of candidates) {
      const api = w["BalaclavaTooltip"];
      if (api && typeof api.show === "function") {
        return api;
      }
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
    resetScans();
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
  var KEY_SCENARIOS_CACHE = `pyroLedger.${SCENARIOS_VERSION}.scenariosCache`;
  var KEY_SCENARIOS_TS = `pyroLedger.${SCENARIOS_VERSION}.scenariosTs`;
  var SCENARIOS_URL = "https://balaclava.app/arsonists-ledger/scenarios.json";
  var STRATEGIES_TTL_MS = 24 * 60 * 60 * 1e3;
  var scenarioIndex = /* @__PURE__ */ new Map();
  function populatescenarioIndex(SCENARIOS2) {
    scenarioIndex.clear();
    for (const s of SCENARIOS2) {
      const key = s.scenarioName.toLowerCase();
      const existing = scenarioIndex.get(key);
      if (existing) {
        existing.push(s);
      } else {
        scenarioIndex.set(key, [s]);
      }
    }
  }
  function loadStrategies() {
    populatescenarioIndex(SCENARIOS);
  }
  function scheduleStrategyRefresh() {
    if (typeof GM_xmlhttpRequest === "undefined") return;
    const ts = parseInt(store_get(KEY_SCENARIOS_TS, "0"), 10) || 0;
    const now = Date.now();
    if (now - ts < STRATEGIES_TTL_MS) {
      try {
        const cached = JSON.parse(store_get(KEY_SCENARIOS_CACHE, ""));
        if (Array.isArray(cached) && cached.length > 0) {
          populatescenarioIndex(cached);
          resetScans();
        }
      } catch {
      }
      return;
    }
    GM_xmlhttpRequest({
      method: "GET",
      url: SCENARIOS_URL,
      onload(r) {
        if (r.status !== 200) return;
        try {
          const fresh = JSON.parse(r.responseText);
          if (!Array.isArray(fresh) || fresh.length === 0) return;
          store_set(KEY_SCENARIOS_CACHE, r.responseText);
          store_set(KEY_SCENARIOS_TS, String(now));
          populatescenarioIndex(fresh);
          resetScans();
        } catch {
        }
      },
      onerror() {
      }
    });
  }
  function injectHighlightStyles() {
    if (document.getElementById("pyro-highlight-styles")) return;
    const style = document.createElement("style");
    style.id = "pyro-highlight-styles";
    style.textContent = `
        .pyro-label { display: none; }

        .arson-root .pyro-band--negative { box-shadow: inset -5px 0 0 ${BAND_COLOR.negative} !important; }
        .arson-root .pyro-band--low      { box-shadow: inset -5px 0 0 ${BAND_COLOR.low}      !important; }
        .arson-root .pyro-band--good     { box-shadow: inset -5px 0 0 ${BAND_COLOR.good}     !important; }
        .arson-root .pyro-band--excellent  { box-shadow: inset -5px 0 0 ${BAND_COLOR.excellent}  !important; }

        .crime-image { position: relative !important; }
        .pyro-info-badge {
            position: absolute;
            bottom: 2px;
            right: 2px;
            width: 14px;
            height: 14px;
            padding: 1px;
            background: #fff;
            border-radius: 50%;
            color: #2a2a2a;
            pointer-events: none;
            user-select: none;
        }
        .pyro-info-badge svg { display: block; width: 100%; height: 100%; }
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
  function applyToSection(section, ranked, scenarioName) {
    section.querySelector(".pyro-label")?.remove();
    section.classList.forEach((c) => {
      if (c.startsWith("pyro-band--")) section.classList.remove(c);
    });
    const scenarioEl = section.querySelector(SEL.SCENARIO);
    if (!ranked) {
      if (debugMode && !!section.querySelector(SEL.DESKTOP_STATUS_SECTION)) {
        const label = document.createElement("span");
        label.className = "pyro-label pyro-label--unconfirmed";
        label.textContent = "?";
        label.title = `No Scenario: ${scenarioName}`;
        scenarioEl?.appendChild(label);
      }
      return;
    }
    section.classList.add(`pyro-band--${ranked.band}`);
    const crimeImage = section.querySelector(SEL.CRIME_IMAGE);
    const hoverTarget = crimeImage ?? section;
    if (crimeImage && !crimeImage.querySelector(".pyro-info-badge")) {
      const badge = document.createElement("span");
      badge.className = "pyro-info-badge";
      badge.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0"/><path d="M12 9h.01"/><path d="M11 12h1v4h1"/></svg>';
      crimeImage.appendChild(badge);
    }
    wireTooltip(section, hoverTarget, ranked);
  }
  function isPendingCollect(section) {
    return section.classList.contains("pending-collect") || !!section.closest(SEL.PENDING_COLLECT);
  }
  var tooltipData = /* @__PURE__ */ new WeakMap();
  function wireTooltip(section, hoverTarget, ranked) {
    tooltipData.set(section, ranked);
    if (section.dataset.pyroTooltipWired) return;
    section.dataset.pyroTooltipWired = "true";
    const getContent = () => {
      const r = tooltipData.get(section) ?? null;
      const statsOnly = isPendingCollect(section) && !!r && !r.Scenario.needsVerification;
      return buildTooltipContentWithStyles(r, effectivePrices(), statsOnly);
    };
    hoverTarget.addEventListener("mouseenter", () => {
      tryTooltip((api) => api.show(hoverTarget, getContent(), { position: "top", theme: "dark" }));
    });
    hoverTarget.addEventListener("mouseleave", () => {
      tryTooltip((api) => api.hide());
    });
    hoverTarget.addEventListener("click", (e) => {
      if (e.target.closest('button, a, input, select, textarea, [role="button"]')) return;
      tryTooltip((api) => {
        if (visibleMobileSection === section) {
          api.hide();
          visibleMobileSection = null;
        } else {
          api.show(hoverTarget, getContent(), { position: "top", theme: "dark" });
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
  function buildTooltipContentWithStyles(ranked, prices, statsOnly = false) {
    const node = buildTooltipContent(ranked, prices, statsOnly);
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
      const candidates = scenarioIndex.get(rawName.toLowerCase()) ?? [];
      if (candidates.length === 0 && debugMode) {
        missingScenarios.add(rawName);
      }
      const ranked = rankForScenario(candidates, hasFlamethrower, prices, thresholds);
      applyToSection(section, ranked, rawName);
    });
  }
  function resetScans() {
    getRoot().querySelectorAll(SEL.CARD).forEach((section) => {
      delete section.dataset.pyroScanned;
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
    loadStrategies();
    loadState();
    injectHighlightStyles();
    scanPage();
    injectSettings(getRoot(), settingsCtx);
    observer.observe(document.body, { childList: true, subtree: true });
    scheduleStrategyRefresh();
    if (debugMode) console.log("[PyroLedger] started, debug on");
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
