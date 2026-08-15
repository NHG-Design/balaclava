// ==UserScript==
// @name        Torn Arsonist's Ledger
// @namespace   https://greasyfork.org/en/users/942572-yukio-mizsima
// @version     1.2.15
// @description Arson profit-per-nerve calculator and scenario guide for Torn's Crimes page
// @icon        https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @author      Yukio [906148]
// @license     MIT
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
  // src/data/scenarios-version.ts
  var SCENARIOS_VERSION = "0871885907ec";

  // src/data/catalog.ts
  var CATALOG_UPDATED = "2026-08-08";
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
    [RESOURCE.GASOLINE]: { id: RESOURCE.GASOLINE, name: "Gasoline", kind: "fuel", category: "liquid", isTool: false, defaultPrice: 495, tornId: 172 },
    [RESOURCE.DIESEL]: { id: RESOURCE.DIESEL, name: "Diesel", kind: "fuel", category: "liquid", isTool: false, defaultPrice: 4849, tornId: 1458 },
    [RESOURCE.KEROSENE]: { id: RESOURCE.KEROSENE, name: "Kerosene", kind: "fuel", category: "liquid", isTool: false, defaultPrice: 19497, tornId: 1457 },
    // Solids
    [RESOURCE.MAGNESIUM]: { id: RESOURCE.MAGNESIUM, name: "Magnesium Shavings", kind: "fuel", category: "solid", isTool: false, defaultPrice: 63370, tornId: 1462 },
    [RESOURCE.THERMITE]: { id: RESOURCE.THERMITE, name: "Thermite", kind: "fuel", category: "solid", isTool: false, defaultPrice: 110360, tornId: 1461 },
    [RESOURCE.POTASSIUM_NITRATE]: { id: RESOURCE.POTASSIUM_NITRATE, name: "Potassium Nitrate", kind: "fuel", category: "solid", isTool: false, defaultPrice: 51684, tornId: 1264 },
    // Gases
    [RESOURCE.OXYGEN]: { id: RESOURCE.OXYGEN, name: "Oxygen Tank", kind: "fuel", category: "gaseous", isTool: false, defaultPrice: 26975, tornId: 1219 },
    [RESOURCE.METHANE]: { id: RESOURCE.METHANE, name: "Methane Tank", kind: "fuel", category: "gaseous", isTool: false, defaultPrice: 19761, tornId: 1460 },
    [RESOURCE.HYDROGEN]: { id: RESOURCE.HYDROGEN, name: "Hydrogen Tank", kind: "fuel", category: "gaseous", isTool: false, defaultPrice: 19956, tornId: 1459 },
    // Igniters
    [RESOURCE.LIGHTER]: { id: RESOURCE.LIGHTER, name: "Windproof Lighter", kind: "tool", category: "igniter", isTool: true, defaultPrice: 0, tornId: 544 },
    [RESOURCE.MOLOTOV]: { id: RESOURCE.MOLOTOV, name: "Molotov Cocktail", kind: "tool", category: "igniter", isTool: false, defaultPrice: 76922, tornId: 742 },
    [RESOURCE.FLAMETHROWER]: { id: RESOURCE.FLAMETHROWER, name: "Flamethrower", kind: "tool", category: "igniter", isTool: true, defaultPrice: 0, tornId: 255 },
    // Dampeners
    [RESOURCE.BLANKET]: { id: RESOURCE.BLANKET, name: "Blanket", kind: "tool", category: "dampener", isTool: true, defaultPrice: 0 },
    [RESOURCE.SAND]: { id: RESOURCE.SAND, name: "Sand", kind: "tool", category: "dampener", isTool: false, defaultPrice: 27302, tornId: 833 },
    [RESOURCE.FIRE_EXTINGUISHER]: { id: RESOURCE.FIRE_EXTINGUISHER, name: "Fire Extinguisher", kind: "tool", category: "dampener", isTool: true, defaultPrice: 0, tornId: 1463 },
    // Evidence
    [RESOURCE.AMMONIA]: { id: RESOURCE.AMMONIA, name: "Ammonia", kind: "evidence", category: "misc", isTool: false, defaultPrice: 2101, tornId: 1248 },
    [RESOURCE.CANNABIS]: { id: RESOURCE.CANNABIS, name: "Cannabis", kind: "evidence", category: "misc", isTool: false, defaultPrice: 6134, tornId: 196 },
    [RESOURCE.COMPASS]: { id: RESOURCE.COMPASS, name: "Compass", kind: "evidence", category: "misc", isTool: false, defaultPrice: 15297, tornId: 407 },
    [RESOURCE.DIAMOND_RING]: { id: RESOURCE.DIAMOND_RING, name: "Diamond Ring", kind: "evidence", category: "misc", isTool: false, defaultPrice: 2648, tornId: 54 },
    [RESOURCE.ELEPHANT_STATUE]: { id: RESOURCE.ELEPHANT_STATUE, name: "Elephant Statue", kind: "evidence", category: "misc", isTool: false, defaultPrice: 4099, tornId: 280 },
    [RESOURCE.FAMILY_PHOTO]: { id: RESOURCE.FAMILY_PHOTO, name: "Family Photo", kind: "evidence", category: "misc", isTool: false, defaultPrice: 602, tornId: 1089 },
    [RESOURCE.GLITTER_BOMB]: { id: RESOURCE.GLITTER_BOMB, name: "Glitter Bomb", kind: "evidence", category: "misc", isTool: false, defaultPrice: 363182, tornId: 1294 },
    [RESOURCE.GOLD_TOOTH]: { id: RESOURCE.GOLD_TOOTH, name: "Gold Tooth", kind: "evidence", category: "misc", isTool: false, defaultPrice: 14015, tornId: 1282 },
    [RESOURCE.GRENADE]: { id: RESOURCE.GRENADE, name: "Grenade", kind: "evidence", category: "misc", isTool: false, defaultPrice: 6983, tornId: 220 },
    [RESOURCE.HARD_DRIVE]: { id: RESOURCE.HARD_DRIVE, name: "Hard Drive", kind: "evidence", category: "misc", isTool: false, defaultPrice: 303, tornId: 45 },
    [RESOURCE.JADE_BUDDHA]: { id: RESOURCE.JADE_BUDDHA, name: "Jade Buddha", kind: "evidence", category: "misc", isTool: false, defaultPrice: 10383, tornId: 275 },
    [RESOURCE.KABUKI_MASK]: { id: RESOURCE.KABUKI_MASK, name: "Kabuki Mask", kind: "evidence", category: "misc", isTool: false, defaultPrice: 28127, tornId: 278 },
    [RESOURCE.LIPSTICK]: { id: RESOURCE.LIPSTICK, name: "Lipstick", kind: "evidence", category: "misc", isTool: false, defaultPrice: 205, tornId: 1085 },
    [RESOURCE.MAYAN_STATUE]: { id: RESOURCE.MAYAN_STATUE, name: "Mayan Statue", kind: "evidence", category: "misc", isTool: false, defaultPrice: 2726, tornId: 259 },
    [RESOURCE.OPIUM]: { id: RESOURCE.OPIUM, name: "Opium", kind: "evidence", category: "misc", isTool: false, defaultPrice: 25242, tornId: 200 },
    [RESOURCE.PCP]: { id: RESOURCE.PCP, name: "PCP", kind: "evidence", category: "misc", isTool: false, defaultPrice: 2507, tornId: 201 },
    [RESOURCE.PELE_CHARM]: { id: RESOURCE.PELE_CHARM, name: "Pele Charm", kind: "evidence", category: "misc", isTool: false, defaultPrice: 3031, tornId: 265 },
    [RESOURCE.RAW_IVORY]: { id: RESOURCE.RAW_IVORY, name: "Raw Ivory", kind: "evidence", category: "misc", isTool: false, defaultPrice: 69699, tornId: 358 },
    [RESOURCE.STAPLER]: { id: RESOURCE.STAPLER, name: "Stapler", kind: "evidence", category: "misc", isTool: false, defaultPrice: 6583, tornId: 1286 },
    [RESOURCE.STICK_GRENADE]: { id: RESOURCE.STICK_GRENADE, name: "Stick Grenade", kind: "evidence", category: "misc", isTool: false, defaultPrice: 13605, tornId: 221 },
    [RESOURCE.SUMO_DOLL]: { id: RESOURCE.SUMO_DOLL, name: "Sumo Doll", kind: "evidence", category: "misc", isTool: false, defaultPrice: 13498, tornId: 427 },
    [RESOURCE.SYRINGE]: { id: RESOURCE.SYRINGE, name: "Syringe", kind: "evidence", category: "misc", isTool: false, defaultPrice: 484, tornId: 1094 },
    [RESOURCE.TOOTHBRUSH]: { id: RESOURCE.TOOTHBRUSH, name: "Toothbrush", kind: "evidence", category: "misc", isTool: false, defaultPrice: 3472, tornId: 1272 }
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
      payoutMin: 19e4,
      payoutMax: 19e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 3 }]
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
      payoutMin: 68e4,
      payoutMax: 7e5,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.KEROSENE, qty: 3 }]
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
      payoutMin: 235e3,
      payoutMax: 29e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
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
      payoutMin: 325e3,
      payoutMax: 36e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }]
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
      payoutMin: 28e4,
      payoutMax: 36e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
        place: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
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
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [
          { resourceId: RESOURCE.DIESEL, qty: 2 },
          { resourceId: RESOURCE.MAGNESIUM, qty: 1 }
        ]
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
      payoutMin: 15e4,
      payoutMax: 15e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
        place: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }],
        stoke: [{ resourceId: RESOURCE.HYDROGEN, qty: 2 }],
        stokeTime: "late"
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
      payoutMin: 54e3,
      payoutMax: 66e3,
      actions: {
        ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
        place: [{ resourceId: RESOURCE.HYDROGEN, qty: 1 }]
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
      payoutMin: 42e3,
      payoutMax: 21e4,
      actions: {
        place: [{ resourceId: RESOURCE.GASOLINE, qty: 2 }],
        ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
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
      payoutMin: 15e4,
      payoutMax: 21e4,
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
        ignite: [{ resourceId: RESOURCE.LIGHTER, qty: 1 }],
        place: [{ resourceId: RESOURCE.KEROSENE, qty: 4 }]
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
      payoutMax: 14e4,
      actions: {
        ignite: [{ resourceId: RESOURCE.FLAMETHROWER, qty: 1 }],
        place: [
          { resourceId: RESOURCE.GASOLINE, qty: 4 },
          { resourceId: RESOURCE.MAGNESIUM, qty: 1 }
        ],
        stoke: [{ resourceId: RESOURCE.DIESEL, qty: 5 }],
        stokeTime: "late"
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

  // src/lib/shared-ui/theme-bridge.ts
  var TORN_THEME_VAR_NAMES = [
    "--crimes-crimeOption-bgColor",
    "--crimes-outcomeDivider-color",
    "--crimes-baseText-color",
    "--crimes-subtleSubText-color",
    "--crimes-stats-successes-color",
    "--crimes-stats-criticalFails-color",
    "--tooltip-bg-color",
    "--mini-profile-border",
    "--mini-profile-box-shadow"
  ];
  function syncTornThemeVars(target, sourceSelector = ".crimes-app") {
    const source = document.querySelector(sourceSelector);
    if (!source) return;
    const computed = getComputedStyle(source);
    for (const name of TORN_THEME_VAR_NAMES) {
      const value = computed.getPropertyValue(name).trim();
      if (value) target.style.setProperty(name, value);
    }
  }

  // src/lib/shared-ui/anchor-position.ts
  var DEFAULTS = {
    offset: 8,
    safezone: 8,
    arrowOffsetMin: 10,
    arrowOffsetMax: 90,
    arrowOffsetDefault: 50,
    viewportWidth: 0,
    viewportHeight: 0
  };
  function initialPosition(targetRect, side, panelWidth, panelHeight, offset) {
    const targetCenterX = targetRect.left + targetRect.width / 2;
    const targetCenterY = targetRect.top + targetRect.height / 2;
    switch (side) {
      case "top":
        return { top: targetRect.top - panelHeight - offset, left: targetCenterX - panelWidth / 2 };
      case "left":
        return { top: targetCenterY - panelHeight / 2, left: targetRect.left - panelWidth - offset };
      case "right":
        return { top: targetCenterY - panelHeight / 2, left: targetRect.right + offset };
      case "bottom":
      default:
        return { top: targetRect.bottom + offset, left: targetCenterX - panelWidth / 2 };
    }
  }
  function applyFallback(position, side, targetRect, panelWidth, panelHeight, offset, safezone, viewportWidth, viewportHeight) {
    switch (side) {
      case "bottom": {
        const alternateTop = targetRect.top - panelHeight - offset;
        if (position.top + panelHeight > viewportHeight - safezone && alternateTop >= safezone) {
          position.top = alternateTop;
          return "top";
        }
        break;
      }
      case "top": {
        const alternateTop = targetRect.bottom + offset;
        if (position.top < safezone && alternateTop + panelHeight <= viewportHeight - safezone) {
          position.top = alternateTop;
          return "bottom";
        }
        break;
      }
      case "left": {
        const alternateLeft = targetRect.right + offset;
        if (position.left < safezone && alternateLeft + panelWidth <= viewportWidth - safezone) {
          position.left = alternateLeft;
          return "right";
        }
        break;
      }
      case "right": {
        const alternateLeft = targetRect.left - panelWidth - offset;
        if (position.left + panelWidth > viewportWidth - safezone && alternateLeft >= safezone) {
          position.left = alternateLeft;
          return "left";
        }
        break;
      }
    }
    return side;
  }
  function clampToViewport(position, panelWidth, panelHeight, safezone, viewportWidth, viewportHeight) {
    const maxTop = Math.max(safezone, viewportHeight - panelHeight - safezone);
    const maxLeft = Math.max(safezone, viewportWidth - panelWidth - safezone);
    return {
      top: Math.max(safezone, Math.min(position.top, maxTop)),
      left: Math.max(safezone, Math.min(position.left, maxLeft))
    };
  }
  function percentageOffset(offset, dimension, min, max, fallback) {
    if (!dimension) return fallback;
    const percentage = offset / dimension * 100;
    return Math.max(min, Math.min(max, percentage));
  }
  function computeAnchorPosition(targetRect, panelWidth, panelHeight, requestedSide, options = {}) {
    const opts = { ...DEFAULTS, ...options };
    const viewportWidth = opts.viewportWidth || window.innerWidth;
    const viewportHeight = opts.viewportHeight || window.innerHeight;
    const position = initialPosition(targetRect, requestedSide, panelWidth, panelHeight, opts.offset);
    const side = applyFallback(
      position,
      requestedSide,
      targetRect,
      panelWidth,
      panelHeight,
      opts.offset,
      opts.safezone,
      viewportWidth,
      viewportHeight
    );
    const original = { ...position };
    const clamped = clampToViewport(position, panelWidth, panelHeight, opts.safezone, viewportWidth, viewportHeight);
    let arrowOffsetPercent = opts.arrowOffsetDefault;
    if (side === "top" || side === "bottom") {
      if (original.left !== clamped.left) {
        const targetCenterX = targetRect.left + targetRect.width / 2;
        arrowOffsetPercent = percentageOffset(
          targetCenterX - clamped.left,
          panelWidth,
          opts.arrowOffsetMin,
          opts.arrowOffsetMax,
          opts.arrowOffsetDefault
        );
      }
    } else if (original.top !== clamped.top) {
      const targetCenterY = targetRect.top + targetRect.height / 2;
      arrowOffsetPercent = percentageOffset(
        targetCenterY - clamped.top,
        panelHeight,
        opts.arrowOffsetMin,
        opts.arrowOffsetMax,
        opts.arrowOffsetDefault
      );
    }
    return { top: clamped.top, left: clamped.left, side, arrowOffsetPercent };
  }

  // src/userscripts/balaclava-tooltip/index.ts
  var API_NAME = "BalaclavaTooltip";
  var HOST_ID = "balaclava-tooltip-host";
  var SAFEZONE = 8;
  var ARROW_OFFSET_MIN = 10;
  var ARROW_OFFSET_MAX = 90;
  var ARROW_OFFSET_DEFAULT = 50;
  var VERSION = "1.0.2";
  var VALID_POSITIONS = /* @__PURE__ */ new Set([
    "top",
    "bottom",
    "left",
    "right"
  ]);
  var VALID_THEMES = /* @__PURE__ */ new Set([
    "system",
    "dark",
    "light",
    "custom"
  ]);
  var CUSTOM_THEME_KEYS = /* @__PURE__ */ new Set([
    "bgColor",
    "textColor",
    "borderColor",
    "shadowColor"
  ]);
  var THEME_TOKENS = Object.freeze({
    dark: Object.freeze({
      bgColor: "oklch(24% 0 0)",
      textColor: "oklch(96% 0.012 95)",
      borderColor: "oklch(30% 0 0)",
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
    }, syncTornThemeVars2 = function() {
      if (!host) return;
      syncTornThemeVars(host);
    }, ensureHost = function() {
      if (host) {
        syncTornThemeVars2();
        return;
      }
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
      syncTornThemeVars2();
    }, buildStylesheet = function() {
      const visualConfig = getVisualConfig();
      return `
      .balaclava-tooltip {
        --balaclava-tooltip-bg: var(--tooltip-bg-color, ${THEME_TOKENS.dark.bgColor});
        --balaclava-tooltip-text: var(--crimes-baseText-color, ${THEME_TOKENS.dark.textColor});
        --balaclava-tooltip-border: color-mix(in oklch, var(--crimes-outcomeDivider-color, ${THEME_TOKENS.dark.borderColor}) 75%, black 25%);
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
        font-family: "Fjalla One", sans-serif;
        font-size: ${visualConfig.fontSize};
        line-height: 1.5;
        letter-spacing: 0;
        overflow-wrap: anywhere;
        pointer-events: none;
        opacity: 1;
        border: var(--balaclava-tooltip-border-size) solid var(--balaclava-tooltip-border);
        border-radius: var(--balaclava-tooltip-border-radius);
        box-shadow: 0 2px 8px var(--balaclava-tooltip-shadow);
        box-shadow: var(--mini-profile-box-shadow);
        transition:
          opacity ${visualConfig.animationDuration} ease-out;
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
      }

      .balaclava-tooltip.is-bottom {
      }

      .balaclava-tooltip.is-left {
      }

      .balaclava-tooltip.is-right {
      }

      .balaclava-tooltip.is-entering {
        opacity: 0;
      }

      .balaclava-tooltip.is-exiting {
        opacity: 0;
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
      window.addEventListener("resize", updateVisibleTooltip, {
        passive: true,
        signal
      });
      window.addEventListener("scroll", scheduleScrollUpdate, {
        capture: true,
        passive: true,
        signal
      });
      window.addEventListener("keydown", handleKeydown, {
        passive: true,
        signal
      });
    }, handleKeydown = function(event) {
      if (event.key === "Escape" && isVisible) {
        hideTooltip();
      }
    }, scheduleScrollUpdate = function() {
      if (!isVisible) return;
      updateVisibleTooltip();
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
        throw new TypeError(
          "BalaclavaTooltip.show target must be an HTMLElement."
        );
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
        throw new TypeError(
          "BalaclavaTooltip.attach element must be an HTMLElement."
        );
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
      element.addEventListener(
        "blur",
        () => {
          if (targetElement === element) hideTooltip();
        },
        { signal }
      );
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
      const position = normalizePosition(
        element.getAttribute("data-balaclava-tooltip-position")
      );
      const arrow = element.getAttribute("data-balaclava-tooltip-arrow") !== "false";
      const theme = normalizeOptionalTheme(
        element.getAttribute("data-balaclava-tooltip-theme")
      );
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
        tooltipEl.setAttribute(
          "aria-label",
          clone.textContent?.trim() || "Tooltip"
        );
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
      const rect = tooltipEl.getBoundingClientRect();
      const result = computeAnchorPosition(
        targetRect,
        rect.width,
        rect.height,
        requestedPosition,
        {
          offset: config.offset,
          safezone: SAFEZONE,
          arrowOffsetMin: ARROW_OFFSET_MIN,
          arrowOffsetMax: ARROW_OFFSET_MAX,
          arrowOffsetDefault: ARROW_OFFSET_DEFAULT
        }
      );
      preferredPosition = result.side;
      arrowOffset = showArrow ? result.arrowOffsetPercent : ARROW_OFFSET_DEFAULT;
      tooltipEl.style.top = `${Math.round(result.top)}px`;
      tooltipEl.style.left = `${Math.round(result.left)}px`;
      tooltipEl.style.setProperty("--arrow-offset", `${arrowOffset}%`);
      refreshTooltipClassName();
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
    init2 = init, syncTornThemeVars3 = syncTornThemeVars2, ensureHost2 = ensureHost, buildStylesheet2 = buildStylesheet, getVisualConfig2 = getVisualConfig, exposeApi2 = exposeApi, setupGlobalListeners2 = setupGlobalListeners, handleKeydown2 = handleKeydown, scheduleScrollUpdate2 = scheduleScrollUpdate, updateVisibleTooltip2 = updateVisibleTooltip, showTooltip2 = showTooltip, hideTooltip2 = hideTooltip, configure2 = configure, attachTooltip2 = attachTooltip, resolveContent2 = resolveContent, scanAll2 = scanAll, scanElement2 = scanElement, setupMutationObserver2 = setupMutationObserver, scanAddedNode2 = scanAddedNode, cleanupRemovedNode2 = cleanupRemovedNode, cleanupAttachedElement2 = cleanupAttachedElement, refreshElement2 = refreshElement, renderTooltip2 = renderTooltip, setupIntersectionObserver2 = setupIntersectionObserver, cleanupIntersectionObserver2 = cleanupIntersectionObserver, cleanupTooltip2 = cleanupTooltip, destroy2 = destroy, trackTargetPosition2 = trackTargetPosition, updateTooltipPosition2 = updateTooltipPosition, sameRect2 = sameRect, normalizePosition2 = normalizePosition, normalizeTheme2 = normalizeTheme, normalizeOptionalTheme2 = normalizeOptionalTheme, getTooltipClassName2 = getTooltipClassName, refreshTooltipClassName2 = refreshTooltipClassName, isConfigKey2 = isConfigKey, isElement2 = isElement, isNode2 = isNode;
    const DEFAULT_CONFIG = Object.freeze({
      theme: "dark",
      bgColor: THEME_TOKENS.dark.bgColor,
      textColor: THEME_TOKENS.dark.textColor,
      borderColor: THEME_TOKENS.dark.borderColor,
      shadowColor: THEME_TOKENS.dark.shadowColor,
      borderSize: "1px",
      borderRadius: "8px",
      padding: "8px 12px",
      maxWidth: "335px",
      arrowSize: "12px",
      arrowBorderSize: null,
      arrowBorderColor: null,
      arrowBorderRadius: null,
      zIndex: 2147483647,
      animationDuration: "150ms",
      fontSize: "12px",
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
  var syncTornThemeVars3;
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
  function effectivePayout(scenario, basis) {
    return basis === "max" ? scenario.payoutMax : (scenario.payoutMin + scenario.payoutMax) / 2;
  }
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
    const { evidence, ignite, place, stoke, dampen } = scenario.actions;
    const items = itemActionCount(evidence) + itemActionCount(place) + itemActionCount(stoke) + itemActionCount(dampen);
    void ignite;
    return 10 + items * 5;
  }
  function calcMaterialCost(scenario, prices) {
    const { evidence, ignite, place, stoke, dampen } = scenario.actions;
    return itemCost(evidence, prices) + itemCost(ignite, prices) + itemCost(place, prices) + itemCost(stoke, prices) + itemCost(dampen, prices);
  }
  function calcProfitPerNerve(scenario, prices, basis = "average") {
    const nerve = calcNerve(scenario);
    const cost = calcMaterialCost(scenario, prices);
    return (effectivePayout(scenario, basis) - cost) / nerve;
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
  function rankForScenario(scenario, prices, thresholds2, basis = "average") {
    const ppn = calcProfitPerNerve(scenario, prices, basis);
    return {
      Scenario: scenario,
      materialCost: calcMaterialCost(scenario, prices),
      baseNerve: calcNerve(scenario),
      profitPerNerve: ppn,
      band: profitBand(ppn, thresholds2)
    };
  }

  // src/userscripts/arsonists-ledger/colors.ts
  var BAND_COLOR = {
    negative: "#f66",
    low: "#fa0",
    good: "#3c9",
    excellent: "#c9f",
    unknown: "#666"
  };

  // src/lib/shared-ui/dom.ts
  function el(tag, className) {
    const e = document.createElement(tag);
    if (className) e.className = className;
    return e;
  }
  function txt(content) {
    return document.createTextNode(content);
  }
  function svgEl(html) {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.firstElementChild;
  }
  function injectStyleOnce(id, css) {
    if (document.getElementById(id)) return;
    const style = document.createElement("style");
    style.id = id;
    style.textContent = css;
    document.head.appendChild(style);
  }

  // src/userscripts/shared/segment-bar.ts
  function buildSegmentTrack(trackClassName, segClassName, count, filled, color, filledClassName) {
    const track = el("div", trackClassName);
    for (let i = 0; i < count; i++) {
      const seg = el("span", segClassName);
      if (i < filled) {
        if (filledClassName) seg.classList.add(filledClassName);
        seg.style.background = color;
      }
      track.appendChild(seg);
    }
    return track;
  }

  // src/userscripts/arsonists-ledger/tooltip.ts
  function row(label, value, highlight) {
    const div = el("div", "pyro-tt-row");
    const l = el("span", "pyro-tt-label");
    l.textContent = label;
    const v = el(
      "span",
      highlight ? "pyro-tt-value pyro-tt-value--highlight" : "pyro-tt-value"
    );
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
  function formatPayoutValue(amount) {
    return `$${(amount / 1e3).toFixed(0)}k`;
  }
  function actionSection(label, items, prices, timing, showOptionalBadges2 = true, showResourcePrices2 = true, stackResources2 = true) {
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
      const itemEl = el("span", "pyro-tt-item");
      const name = CATALOG[item.resourceId]?.name ?? item.resourceId;
      const nameEl = el(
        "span",
        item.optional ? "pyro-tt-item-name pyro-tt-item-name--optional" : "pyro-tt-item-name"
      );
      nameEl.textContent = `${item.qty}\xD7 ${name}`;
      itemEl.appendChild(nameEl);
      const cost = showResourcePrices2 ? itemCost2(item, prices) : null;
      if (cost !== null) {
        const costEl = el("span", "pyro-tt-item-cost");
        costEl.textContent = ` (${formatCost(cost)})`;
        itemEl.appendChild(costEl);
      }
      if (item.optional && showOptionalBadges2) {
        const badge = el("span", "pyro-tt-optional-badge");
        badge.textContent = "optional";
        itemEl.appendChild(badge);
      }
      if (i > 0 && !stackResources2) {
        valueEl.appendChild(document.createTextNode(", "));
      }
      valueEl.appendChild(itemEl);
      if (i < items.length - 1 && stackResources2) valueEl.appendChild(el("br"));
    });
    div.appendChild(labelEl);
    div.appendChild(valueEl);
    return div;
  }
  function buildPrimaryBlock(ranked, prices, statsOnly = false, options) {
    const frag = document.createDocumentFragment();
    const { Scenario, profitPerNerve, materialCost, baseNerve } = ranked;
    if (options?.showScenarioName !== false) {
      const nameEl = el("div", "pyro-tt-name");
      nameEl.textContent = Scenario.scenarioName;
      frag.appendChild(nameEl);
    }
    const header = el("div", "pyro-tt-header");
    const title = el("span", "pyro-tt-title");
    title.textContent = "Per nerve";
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
    const payoutLabel = Scenario.payoutMax > Scenario.payoutMin ? `${formatPayoutValue(Scenario.payoutMin)}\u2013${formatPayoutValue(Scenario.payoutMax)}` : formatPayoutValue(Scenario.payoutMin);
    stats.appendChild(row("Payout", payoutLabel));
    stats.appendChild(row("Cost", `~$${(materialCost / 1e3).toFixed(1)}k`));
    stats.appendChild(row("Nerve", String(baseNerve)));
    frag.appendChild(stats);
    if (statsOnly) return frag;
    frag.appendChild(el("hr", "pyro-tt-divider"));
    const { evidence, place, stoke, stokeTime, dampen, dampenTime } = Scenario.actions;
    const ignite = Scenario.actions.ignite ?? [
      { resourceId: RESOURCE.LIGHTER, qty: 1 }
    ];
    const actionOrder = [
      ["Evidence", evidence, void 0],
      ["Place", place, void 0],
      ["Ignite", ignite, void 0],
      ["Stoke", stoke, stokeTime],
      ["Dampen", dampen, dampenTime]
    ];
    const showOptionalBadges2 = options?.showOptionalBadges !== false;
    const showResourcePrices2 = options?.showResourcePrices !== false;
    const stackResources2 = options?.stackResources !== false;
    for (const [label, items, timing] of actionOrder) {
      const s = actionSection(
        label,
        items,
        prices,
        timing,
        showOptionalBadges2,
        showResourcePrices2,
        stackResources2
      );
      if (s) frag.appendChild(s);
    }
    if (Scenario.notes) {
      const note = el("div", "pyro-tt-notes");
      note.textContent = Scenario.notes;
      frag.appendChild(note);
    }
    return frag;
  }
  function buildTooltipContent(ranked, prices, statsOnly = false, options) {
    const root = el("div", "pyro-tt");
    if (!ranked) return root;
    root.appendChild(buildPrimaryBlock(ranked, prices, statsOnly, options));
    return root;
  }
  function barColor(ratio, invert) {
    const r = invert ? 1 - ratio : ratio;
    if (r <= 1 / 3) return BAND_COLOR.good;
    if (r <= 2 / 3) return BAND_COLOR.low;
    return BAND_COLOR.negative;
  }
  function buildStatBar(bar) {
    const wrap = el("div", "pyro-stat-bar");
    const segCount = bar.max - bar.min + 1;
    const filled = bar.value - bar.min + 1;
    const ratio = (bar.value - bar.min) / (bar.max - bar.min);
    const color = barColor(ratio, bar.invert);
    const track = buildSegmentTrack(
      "pyro-stat-bar-track",
      "pyro-stat-bar-seg",
      segCount,
      filled,
      color,
      "pyro-stat-bar-seg--filled"
    );
    wrap.appendChild(track);
    const labels = el("div", "pyro-stat-bar-labels");
    const low = el("span", "pyro-stat-bar-label");
    low.textContent = bar.lowLabel;
    const high = el("span", "pyro-stat-bar-label");
    high.textContent = bar.highLabel;
    labels.appendChild(low);
    labels.appendChild(high);
    wrap.appendChild(labels);
    return wrap;
  }
  function buildStatBlock(entry) {
    const block = el("div", "pyro-stat-block");
    const header = el("div", "pyro-stat-tt-header");
    const titleEl = el("span", "pyro-stat-tt-title");
    titleEl.textContent = entry.title;
    header.appendChild(titleEl);
    if (entry.value !== void 0) {
      const valueEl = el("span", "pyro-stat-tt-value");
      valueEl.textContent = entry.value;
      header.appendChild(valueEl);
    }
    block.appendChild(header);
    const descEl = el("div", "pyro-stat-tt-desc");
    descEl.textContent = entry.description;
    block.appendChild(descEl);
    if (entry.bar) block.appendChild(buildStatBar(entry.bar));
    return block;
  }
  function buildStatTooltip(title, description, bar) {
    return buildStatTooltipGroup([{ title, description, bar }]);
  }
  function buildStatTooltipGroup(entries) {
    const root = el("div", "pyro-stat-tt");
    const style = el("style");
    style.textContent = buildStatTooltipStyles();
    root.appendChild(style);
    entries.forEach((entry, i) => {
      if (i > 0) root.appendChild(el("hr", "pyro-stat-divider"));
      root.appendChild(buildStatBlock(entry));
    });
    return root;
  }
  function buildStatTooltipStyles() {
    return `
.pyro-stat-tt {
    min-width: 140px;
    max-width: 200px;
}
.pyro-stat-tt-header {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 8px;
}
.pyro-stat-tt-title {
    font-size: 13px;
}
.pyro-stat-tt-value {
    font-size: 14px;
    color: var(--balaclava-tooltip-bg);
    white-space: nowrap;
    background-color: var(--balaclava-tooltip-text);
    padding-inline: 6px;
    border-radius: 4px;
}
.pyro-stat-tt-desc {
    margin-top: 2px;
    font-size: 10px;
    opacity: 0.7;
}
.pyro-stat-bar {
    margin-top: 6px;
}
.pyro-stat-bar-track {
    display: flex;
    gap: 2px;
}
.pyro-stat-bar-seg {
    flex: 1;
    height: 5px;
    border-radius: 2px;
    background: color-mix(in srgb, var(--balaclava-tooltip-text) 50%, var(--balaclava-tooltip-bg) 50%);
}
.pyro-stat-bar-labels {
    display: flex;
    justify-content: space-between;
    margin-top: 3px;
    font-size: 9px;
    opacity: 0.55;
    text-transform: uppercase;
    letter-spacing: 0.02em;
}
.pyro-stat-divider {
    border: none;
    border-top: 1px solid currentColor;
    opacity: 0.15;
    margin: 6px 0;
}
`;
  }
  function buildTooltipStyles() {
    return `
.pyro-tt {
    min-width: 180px;
}
.pyro-tt-name {
    font-size: 12px;
    margin-bottom: 2px;
    color: oklch(76% 0 0);
}
.pyro-tt-header {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 6px;
}
.pyro-tt-title {
    font: inherit;
    font-size: 14px;
}
.pyro-tt-ppn {
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
    font-size: 12px;
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
    font-size: 12px;
}
.pyro-tt-timing {
    font-size: 9px;
    margin-left: 4px;
    background-color: oklch(0.9 0 0);
    color: oklch(0.23 0 0);
    padding: 0 2px;
    border-radius: 2px;
}
.pyro-tt-action-value {
    font-size: 12px;
}
.pyro-tt-item-cost {
    color: oklch(66% 0 0);
    font-size: 10px;
    font-weight: normal;
}
.pyro-tt-item-name--optional {
    text-decoration: underline wavy oklch(66% 0 0);
    text-underline-offset: 1px;
    text-decoration-thickness: 1px;
}
.pyro-tt-optional-badge {
    font-size: 9px;
    margin-left: 4px;
    background-color: oklch(0.9 0 0);
    color: oklch(0.23 0 0);
    padding: 0 2px;
    border-radius: 2px;
}
.pyro-tt-notes {
    margin-top: 5px;
    opacity: 0.7;
    font-size: 12px;
    font-style: italic;
}
.pyro-tt-req {
    margin-top: 5px;
    opacity: 0.55;
    font-size: 10px;
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
    /**
     * Fire meter on the arson card.
     * Torn uses obfuscated classes here, so keep matching broad and local.
     */
    FIRE_METER: '[class*="fireMeter"]',
    /** Crime image thumbnail — retained as a fallback tooltip anchor. */
    CRIME_IMAGE: ".crime-image",
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
    USER_INFORMATION: '[class*="user-information"]'
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

  // src/userscripts/shared/status.ts
  function setIconStatus(el2, icon, message) {
    el2.innerHTML = icon;
    el2.appendChild(txt(message));
  }

  // src/userscripts/shared/checkbox.ts
  var CHECK_MASK_PATH = "M9 16.2l-3.5-3.5-1.4 1.4L9 19 20 8l-1.4-1.4z";
  var CHECKMARK_DATA_URI = `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="${CHECK_MASK_PATH}"/></svg>`
  )}`;
  function checkboxCss(className, accentColor) {
    return `
.${className} {
    appearance: none;
    -webkit-appearance: none;
    box-sizing: border-box;
    width: 15px;
    height: 15px;
    margin: 0;
    flex-shrink: 0;
    border: 1px solid var(--shared-surface-border);
    border-radius: 3px;
    background: var(--shared-surface);
    accent-color: ${accentColor};
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
}
.${className}:checked {
    background: ${accentColor};
    border-color: ${accentColor};
}
.${className}:checked::after {
    content: "";
    width: 9px;
    height: 9px;
    background-color: oklch(18% 0 0);
    -webkit-mask-image: url("${CHECKMARK_DATA_URI}");
    mask-image: url("${CHECKMARK_DATA_URI}");
    -webkit-mask-size: contain;
    mask-size: contain;
    -webkit-mask-repeat: no-repeat;
    mask-repeat: no-repeat;
}
.${className}:focus-visible { outline: 2px solid ${accentColor}; outline-offset: 1px; }
`;
  }

  // src/userscripts/shared/button-group.ts
  function buildButtonGroup(config, options, getVal, onSelect) {
    const activeClassName = config.activeClassName ?? "active";
    const wrap = el("div", config.wrapClassName);
    if (config.ariaGroup) wrap.setAttribute("role", "group");
    const buttons = options.map((option) => {
      const btn = el("button", config.btnClassName);
      btn.type = "button";
      btn.textContent = option.label;
      config.onButtonCreated?.(btn, option);
      btn.addEventListener("click", () => {
        onSelect(option.value);
        sync();
      });
      wrap.appendChild(btn);
      return { value: option.value, btn };
    });
    function sync() {
      const current = getVal();
      for (const { value, btn } of buttons) {
        const active = value === current;
        if (config.ariaGroup) btn.setAttribute("aria-pressed", String(active));
        btn.classList.toggle(activeClassName, active);
      }
    }
    sync();
    return { wrap, sync };
  }

  // src/userscripts/shared/number-input.ts
  function buildNumberInput(getVal, setVal, options = {}) {
    const min = options.min ?? 0;
    const input = el("input", options.className ?? "");
    input.type = "number";
    input.min = String(min);
    input.value = String(getVal());
    input.addEventListener("blur", () => {
      const val = Math.round(parseFloat(input.value));
      if (!isNaN(val) && val >= min) {
        setVal(val);
        input.value = String(val);
      } else {
        input.value = String(getVal());
      }
    });
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") input.blur();
    });
    return input;
  }

  // src/lib/shared-ui/theme-tokens.ts
  var FALLBACK = {
    outcomeDivider: "oklch(30% 0 0)",
    baseText: "oklch(82% 0.007 285)",
    subtleSubText: "oklch(58% 0.012 285)",
    successes: "#6d6",
    criticalFails: "#c66",
    tooltipBg: "oklch(24% 0 0)"
  };
  var SHARED_THEME_TOKENS_CSS = `
    --shared-border: color-mix(in oklch, var(--crimes-outcomeDivider-color, ${FALLBACK.outcomeDivider}) 75%, black 25%);
    --shared-text: var(--crimes-baseText-color, ${FALLBACK.baseText});
    --shared-text-muted: color-mix(in oklch, var(--crimes-subtleSubText-color, ${FALLBACK.subtleSubText}) 55%, var(--crimes-baseText-color, ${FALLBACK.baseText}) 45%);
    --shared-success: var(--crimes-stats-successes-color, ${FALLBACK.successes});
    --shared-danger: var(--crimes-stats-criticalFails-color, ${FALLBACK.criticalFails});
    --shared-bg: var(--tooltip-bg-color, ${FALLBACK.tooltipBg});
    --shared-surface: color-mix(in oklch, var(--tooltip-bg-color, ${FALLBACK.tooltipBg}) 85%, black 15%);
    --shared-surface-hover: color-mix(in oklch, var(--shared-surface) 78%, white 22%);
    --shared-surface-border: color-mix(in oklch, var(--shared-surface) 55%, white 45%);
    --shared-danger-bg: color-mix(in oklch, var(--shared-danger) 16%, var(--shared-surface));
    --shared-danger-border: color-mix(in oklch, var(--shared-danger) 45%, var(--shared-surface));
    --shared-danger-bg-hover: color-mix(in oklch, var(--shared-danger) 26%, var(--shared-surface));
`;

  // src/userscripts/arsonists-ledger/popover.ts
  var stylesInjected = false;
  function injectPopoverStyles() {
    if (stylesInjected) return;
    stylesInjected = true;
    injectStyleOnce("pyro-popover-styles", `
.pyro-popover-wrap {
    ${SHARED_THEME_TOKENS_CSS}
    --pyro-tooltip-radius: 8px;
    --pyro-tooltip-arrow-size: 12px;
    --pyro-popover-btn-size: 24px;
    position: relative;
    display: inline-flex;
    align-items: center;
}
.pyro-popover-btn {
    width: var(--pyro-popover-btn-size);
    height: var(--pyro-popover-btn-size);
    padding: 0;
    border: 1px solid #fff;
    border: var(--mini-profile-border);
    color: #ff8a3d;
    cursor: pointer;
    border-radius: var(--pyro-tooltip-radius);
    font-size: 13px;
    line-height: 1;
    user-select: none;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 100ms ease-out, background 120ms ease-out, color 120ms ease-out;
}
@media (hover: hover) and (pointer: fine) {
    .pyro-popover-btn:hover { background: color-mix(in oklch, var(--tooltip-bg-color, oklch(24% 0 0)) 94%, white 6%); color: var(--shared-text); }
}
.pyro-popover-btn:active { transform: scale(0.94); }
.pyro-popover-panel {
    position: absolute;
    top: calc(100% + 10px);
    right: 0;
    z-index: 9999;
    background: var(--tooltip-bg-color) 0 0 no-repeat;
    color: var(--shared-text);
    border: 1px solid #fff;
    border: var(--mini-profile-border);
    box-shadow: var(--mini-profile-box-shadow);
    border-radius: var(--pyro-tooltip-radius);
    min-width: 290px;
    max-width: 360px;
    overflow: visible;
    transform-origin: calc(100% - (var(--pyro-popover-btn-size) / 2)) calc(0px - var(--pyro-tooltip-arrow-size));
    transform: scale(0.95);
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
    transition: transform 150ms ease-out, opacity 150ms ease-out, visibility 0ms linear 150ms;
}
.pyro-popover-panel svg {
  filter: initial !important;
}
.pyro-popover-panel::before {
    content: '';
    position: absolute;
    top: calc(var(--pyro-tooltip-arrow-size) / -2);
    right: calc((var(--pyro-popover-btn-size) / 2) - (var(--pyro-tooltip-arrow-size) / 2));
    width: var(--pyro-tooltip-arrow-size);
    height: var(--pyro-tooltip-arrow-size);
    background: var(--tooltip-bg-color);
    border: 1px solid #fff;
    border: var(--mini-profile-border);
    transform: rotate(45deg);
    box-sizing: border-box;
    border-right: none;
    border-bottom: none;
    border-radius: 3px;
}
.pyro-popover-panel.is-open {
    transform: scale(1);
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
    transition: transform 150ms ease-out, opacity 150ms ease-out, visibility 0ms linear 0ms;
}
.pyro-popover-panel:not(.is-open) {
    transition: transform 100ms ease-out, opacity 100ms ease-out, visibility 0ms linear 100ms;
}
`);
  }
  function createPopover(opts) {
    injectPopoverStyles();
    const wrap = el(
      "div",
      opts.wrapClass ? `pyro-popover-wrap ${opts.wrapClass}` : "pyro-popover-wrap"
    );
    const btn = el("button", "pyro-popover-btn");
    btn.type = "button";
    if (opts.btnId) btn.id = opts.btnId;
    btn.setAttribute("aria-label", opts.buttonAriaLabel);
    btn.setAttribute("aria-expanded", "false");
    btn.innerHTML = opts.buttonContent;
    const panel = el("div", "pyro-popover-panel");
    if (opts.panelId) panel.id = opts.panelId;
    wrap.appendChild(btn);
    wrap.appendChild(panel);
    function open() {
      panel.classList.add("is-open");
      btn.setAttribute("aria-expanded", "true");
    }
    function close() {
      panel.classList.remove("is-open");
      btn.setAttribute("aria-expanded", "false");
    }
    function toggle() {
      if (panel.classList.contains("is-open")) close();
      else open();
    }
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      toggle();
    });
    panel.addEventListener("click", (e) => {
      e.stopPropagation();
    });
    document.addEventListener(
      "click",
      (e) => {
        const path = typeof e.composedPath === "function" ? e.composedPath() : [];
        const clickedInside = path.length > 0 ? path.includes(wrap) : wrap.contains(e.target);
        if (!clickedInside) close();
      },
      { passive: true }
    );
    return { wrap, btn, panel, open, close, toggle };
  }

  // src/userscripts/arsonists-ledger/icons.ts
  var S = 'xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';
  var BLANK = '<path stroke="none" d="M0 0h24v24H0z" fill="none"/>';
  var CIRCLE = '<path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0"/>';
  var ICON_INFO = `<svg ${S}>${BLANK}${CIRCLE}<path d="M12 9h.01"/><path d="M11 12h1v4h1"/></svg>`;
  var ICON_CHECK = `<svg ${S} width="16" height="16" style="vertical-align:middle;margin-right:4px">${BLANK}<path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"/><path d="M9 12l2 2l4 -4"/></svg>`;
  var ICON_X = `<svg ${S} width="16" height="16" style="vertical-align:middle;margin-right:4px">${BLANK}${CIRCLE}<path d="M10 10l4 4m0 -4l-4 4"/></svg>`;
  var ICON_ARROW_RIGHT = `<svg ${S} width="12" height="12" style="vertical-align:middle;margin:0 2px">${BLANK}<path d="M5 12l14 0"/><path d="M15 16l4 -4"/><path d="M15 8l4 4"/></svg>`;
  var ICON_FLAME = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 10.941c2.333 -3.308 .167 -7.823 -1 -8.941c0 3.395 -2.235 5.299 -3.667 6.706c-1.43 1.408 -2.333 3.294 -2.333 5.588c0 3.704 3.134 6.706 7 6.706c3.866 0 7 -3.002 7 -6.706c0 -1.712 -1.232 -4.403 -2.333 -5.588c-2.084 3.353 -3.257 3.353 -4.667 2.235"/></svg>`;
  var ICON_EXTERNAL_LINK = `<svg ${S}>${BLANK}<path d="M12 6h-6a2 2 0 0 0 -2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-6"/><path d="M11 13l9 -9"/><path d="M15 4h5v5"/></svg>`;
  var ICON_FLAMABILITY = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" fill="currentColor"><path d="M500.5 320.5L499.8 318.6C465.8 224.8 410 140.5 337.1 72.5L333.8 69.5C330.1 66 325.1 64 320 64C314.9 64 309.9 66 306.2 69.5L302.9 72.5C230 140.5 174.2 224.8 140.2 318.6L139.5 320.5C131.9 341.3 128 363.4 128 385.6C128 490.7 214.8 576 320 576C425.2 576 512 490.7 512 385.6C512 363.4 508.1 341.4 500.5 320.5zM409.7 370C413.8 379.3 415.9 389.4 415.9 399.5C415.9 452.5 372.9 496 319.9 496C266.9 496 223.9 452.5 223.9 399.5C223.9 389.4 226 379.2 230.1 370L232 365.7C247.8 330.3 269.9 298 297.3 270.6L306.2 261.7C309.8 258.1 314.7 256.1 319.8 256.1C324.9 256.1 329.8 258.1 333.4 261.7L342.3 270.6C369.7 298 391.9 330.3 407.6 365.7L409.5 370z"/></svg>`;
  var ICON_TIMER = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" fill="currentColor"><path d="M320 64C302.3 64 288 78.3 288 96L288 160C288 177.7 302.3 192 320 192C337.7 192 352 177.7 352 160L352 130.7C442.8 145.9 512 224.9 512 320C512 426 426 512 320 512C214 512 128 426 128 320C128 266.3 150 217.7 185.6 182.9C198.2 170.5 198.4 150.3 186.1 137.6C173.8 124.9 153.5 124.8 140.8 137.1C93.5 183.6 64 248.4 64 320C64 461.4 178.6 576 320 576C461.4 576 576 461.4 576 320C576 178.6 461.4 64 320 64zM257 223C247.6 213.6 232.4 213.6 223.1 223C213.8 232.4 213.7 247.6 223.1 256.9L303.1 336.9C312.5 346.3 327.7 346.3 337 336.9C346.3 327.5 346.4 312.3 337 303L257 223z"/></svg>`;
  var ICON_PIN = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" fill="currentColor"><path d="M128 252.6C128 148.4 214 64 320 64C426 64 512 148.4 512 252.6C512 371.9 391.8 514.9 341.6 569.4C329.8 582.2 310.1 582.2 298.3 569.4C248.1 514.9 127.9 371.9 127.9 252.6zM320 320C355.3 320 384 291.3 384 256C384 220.7 355.3 192 320 192C284.7 192 256 220.7 256 256C256 291.3 284.7 320 320 320z"/></svg>`;
  var ICON_SIREN = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" fill="currentColor"><path d="M69.3 100L117.3 132C128.3 139.4 131.3 154.3 124 165.3C116.7 176.3 101.7 179.3 90.7 172L42.7 140C31.7 132.6 28.7 117.7 36 106.7C43.3 95.7 58.3 92.7 69.3 100zM597.3 140L549.3 172C538.3 179.4 523.4 176.4 516 165.3C508.6 154.2 511.6 139.4 522.7 132L570.7 100C581.7 92.6 596.6 95.6 604 106.7C611.4 117.8 608.4 132.6 597.3 140zM24 256L88 256C101.3 256 112 266.7 112 280C112 293.3 101.3 304 88 304L24 304C10.7 304 0 293.3 0 280C0 266.7 10.7 256 24 256zM552 256L616 256C629.3 256 640 266.7 640 280C640 293.3 629.3 304 616 304L552 304C538.7 304 528 293.3 528 280C528 266.7 538.7 256 552 256zM144 368L169.4 152.5C173.1 120.3 200.5 96 232.9 96L407.1 96C439.6 96 466.9 120.3 470.7 152.5L496 368L258.3 368L271.9 218.2C273.1 205 263.4 193.3 250.2 192.1C237 190.9 225.3 200.6 224.1 213.8L210.1 368L144 368zM96 448C96 430.3 110.3 416 128 416L512 416C529.7 416 544 430.3 544 448L544 512C544 529.7 529.7 544 512 544L128 544C110.3 544 96 529.7 96 512L96 448z"/></svg>`;
  var ICON_EMBER = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" fill="currentColor"><path d="M281.6 93.9L297.6 72.6C301.6 67.2 308 64 314.7 64C326.4 64 336 73.6 336 85.3L336 107.4C336 120.5 341.4 133.1 350.9 142.1L435.6 223C484.4 269.6 512 334.2 512 401.7C512 498 434 576 337.7 576L320 576C214 576 128 490 128 384L128 380.2C128 331.4 147.4 284.6 181.9 250.1L185.4 246.6C189.6 242.4 195.4 240 201.4 240C213.9 240 224 250.1 224 262.6L224 352C224 387.3 252.7 416 288 416C323.3 416 352 387.3 352 352L352 348.1C352 330.1 344.8 312.8 332.1 300.1L293.5 261.5C269.5 237.5 256 204.8 256 170.8C256 143.1 265 116 281.6 93.9z"/></svg>`;
  var ICON_PLUS = `<svg ${S} width="12" height="12" style="vertical-align:middle">${BLANK}<path d="M12 5l0 14"/><path d="M5 12l14 0"/></svg>`;
  var ICON_TRASH = `<svg ${S} width="12" height="12" style="vertical-align:middle">${BLANK}<path d="M4 7l16 0"/><path d="M10 11l0 6"/><path d="M14 11l0 6"/><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12"/><path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3"/></svg>`;
  var ICON_SEND = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10 14l11 -11"/><path d="M21 3l-6.5 18a0.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a0.55 .55 0 0 1 0 -1l18 -6.5"/></svg>`;
  var ICON_CHEVRON_DOWN = `<svg ${S} width="16" height="16" aria-hidden="true">${BLANK}<path d="M6 9l6 6l6 -6"/></svg>`;
  var ICON_RESET = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M3.06 13a9 9 0 1 0 .49 -4.087" /><path d="M3 4.001v5h5" /><path d="M11 12a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /></svg>`;
  var ICON_REFRESH = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4" /><path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4" /></svg>`;

  // src/userscripts/arsonists-ledger/submit-tab.ts
  var SUBMIT_URL = "https://balaclava.app/api/arson/recipe-submissions";
  var TIME_PATTERN = /^(early|late|\d+(\.\d+)?(%|s))$/;
  var RATE_LIMIT_WARN_THRESHOLD = 5;
  function countRecipeChanges(current, baseline) {
    let count = 0;
    if (current.payoutMin !== baseline.payoutMin || current.payoutMax !== baseline.payoutMax)
      count++;
    if (JSON.stringify(current.place) !== JSON.stringify(baseline.place)) count++;
    if (JSON.stringify(current.ignite) !== JSON.stringify(baseline.ignite))
      count++;
    if (current.stokeEnabled !== baseline.stokeEnabled || JSON.stringify(current.stoke) !== JSON.stringify(baseline.stoke)) {
      count++;
    }
    if (current.stokeTime !== baseline.stokeTime) count++;
    if (current.dampenEnabled !== baseline.dampenEnabled || JSON.stringify(current.dampen) !== JSON.stringify(baseline.dampen)) {
      count++;
    }
    if (current.dampenTime !== baseline.dampenTime) count++;
    return count;
  }
  var scenarioByName = new Map(SCENARIOS.map((s) => [s.scenarioName, s]));
  var preselectedScenario = null;
  function setPreselectedScenario(name) {
    preselectedScenario = name;
  }
  var RESOURCE_OPTIONS = [
    {
      label: "Liquids",
      ids: Object.values(CATALOG).filter((r) => r.category === "liquid").map((r) => r.id)
    },
    {
      label: "Solids",
      ids: Object.values(CATALOG).filter((r) => r.category === "solid").map((r) => r.id)
    },
    {
      label: "Gases",
      ids: Object.values(CATALOG).filter((r) => r.category === "gaseous").map((r) => r.id)
    },
    {
      label: "Igniters",
      ids: Object.values(CATALOG).filter((r) => r.category === "igniter").map((r) => r.id)
    },
    {
      label: "Dampeners",
      ids: Object.values(CATALOG).filter((r) => r.category === "dampener").map((r) => r.id)
    }
  ];
  var PLACE_RESOURCE_OPTIONS = RESOURCE_OPTIONS.filter(
    (group) => group.label !== "Igniters" && group.label !== "Dampeners"
  );
  var STOKE_RESOURCE_OPTIONS = RESOURCE_OPTIONS.filter(
    (group) => group.label !== "Dampeners"
  );
  var DAMPEN_RESOURCE_OPTIONS = RESOURCE_OPTIONS.filter(
    (group) => group.label === "Dampeners"
  );
  var IGNITER_IDS = Object.values(CATALOG).filter((r) => r.category === "igniter").map((r) => r.id);
  function postSubmission(body, onDone) {
    const payload = JSON.stringify(body);
    if (typeof GM_xmlhttpRequest !== "undefined") {
      GM_xmlhttpRequest({
        method: "POST",
        url: SUBMIT_URL,
        data: payload,
        headers: { "Content-Type": "application/json" },
        onload(r) {
          if (r.status >= 200 && r.status < 300) {
            try {
              const parsed = JSON.parse(r.responseText);
              onDone({
                ok: true,
                remaining: parsed.remaining,
                limit: parsed.limit
              });
            } catch {
              onDone({ ok: true });
            }
            return;
          }
          try {
            const parsed = JSON.parse(r.responseText);
            onDone({ ok: false, error: parsed.error ?? `HTTP ${r.status}` });
          } catch {
            onDone({ ok: false, error: `HTTP ${r.status}` });
          }
        },
        onerror() {
          onDone({ ok: false, error: "Network error" });
        }
      });
      return;
    }
    fetch(SUBMIT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload
    }).then(async (r) => {
      if (r.ok) {
        try {
          const parsed = await r.json();
          onDone({
            ok: true,
            remaining: parsed.remaining,
            limit: parsed.limit
          });
        } catch {
          onDone({ ok: true });
        }
        return;
      }
      try {
        const parsed = await r.json();
        onDone({ ok: false, error: parsed.error ?? `HTTP ${r.status}` });
      } catch {
        onDone({ ok: false, error: `HTTP ${r.status}` });
      }
    }).catch(() => onDone({ ok: false, error: "Network error" }));
  }
  function injectSubmitTabStyles() {
    injectStyleOnce("pyro-submit-tab-styles", `
.pyro-rc-groups { display: flex; flex-direction: column; gap: 16px; }
.pyro-rc-group { display: flex; flex-direction: column; gap: 8px; }
.pyro-rc-steps { display: flex; flex-direction: column; gap: 4px; }
.pyro-rc-group-title { font-size: 12px; text-transform: uppercase; color: var(--shared-text-muted); display: flex; align-items: center; justify-content: space-between; }
.pyro-rc-payout-row { display: flex; gap: 6px; align-items: center; }
.pyro-rc-divider { border: none; height: 1px; background: var(--shared-border); margin: 0; }
.pyro-rc-input {
    box-sizing: border-box;
    min-height: 24px;
    background: var(--shared-surface);
    border: 1px solid var(--shared-surface-border);
    color: var(--shared-text);
    font-size: 12px;
    padding: 4px 6px;
    border-radius: 5px;
}
.pyro-rc-input:focus-visible { outline: none; border-color: var(--shared-success); }
.pyro-rc-input.pyro-rc-err { border-color: var(--shared-danger); }
.pyro-rc-payout-row .pyro-rc-input { width: 100%; text-align: right; }
.pyro-rc-input[type=number] { -moz-appearance: textfield; }
.pyro-rc-input[type=number]::-webkit-inner-spin-button,
.pyro-rc-input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
.pyro-rc-row { display: flex; gap: 6px; align-items: center; }
.pyro-rc-row select { flex: 1; min-width: 0; }
.pyro-rc-row .pyro-rc-input[type=number] { width: 48px; text-align: right; }

.pyro-rc-select {
    box-sizing: border-box;
    min-height: 24px;
    appearance: base-select;
    background: var(--shared-surface);
    border: 1px solid var(--shared-surface-border);
    color: var(--shared-text);
    font-size: 12px;
    padding: 4px 6px;
    border-radius: 5px;
    transition: border-color 120ms ease-out;
}
.pyro-rc-select:focus-visible { outline: none; border-color: var(--shared-success); }
.pyro-rc-select::picker-icon { display: none; }
.pyro-rc-select button {
    all: unset;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 6px;
    width: 100%;
    box-sizing: border-box;
    cursor: pointer;
}
.pyro-rc-select-icon { display: flex; color: var(--shared-text-muted); transition: transform 120ms ease-out; flex-shrink: 0; }
.pyro-rc-select:open .pyro-rc-select-icon { transform: rotate(180deg); }
.pyro-rc-select::picker(select) {
    appearance: base-select;
    background: var(--shared-surface);
    border: 1px solid var(--shared-surface-border);
    border-radius: 6px;
    padding: 4px;
    box-shadow: 0 4px 14px oklch(12% 0.01 260 / 0.5);
    scrollbar-width: thin;
    scrollbar-color: var(--shared-text-muted) var(--shared-surface);
}
.pyro-rc-select::picker(select)::-webkit-scrollbar { width: 6px; }
.pyro-rc-select::picker(select)::-webkit-scrollbar-track { background: var(--shared-surface); }
.pyro-rc-select::picker(select)::-webkit-scrollbar-thumb {
    background: var(--shared-text-muted);
    border-radius: 3px;
}
.pyro-rc-select::picker(select)::-webkit-scrollbar-button {
    display: none;
    width: 0;
    height: 0;
    background: var(--shared-surface);
}
.pyro-rc-select::picker(select)::-webkit-scrollbar-corner { background: var(--shared-surface); }
.pyro-rc-select option {
    border-radius: 4px;
    color: var(--shared-text);
    font-size: 12px;
    display: flex;
    align-items: center;
}
@media (hover: hover) and (pointer: fine) {
    .pyro-rc-select option:hover { background: var(--shared-surface-hover); }
}
.pyro-rc-select option:checked {
    background: color-mix(in oklch, var(--shared-success) 22%, var(--shared-surface));
    color: var(--shared-text);
}
.pyro-rc-select option::checkmark {
    content: "";
    display: inline-block;
    width: 16px;
    height: 16px;
    background-color: var(--shared-success);
    -webkit-mask-image: url("${CHECKMARK_DATA_URI}");
    mask-image: url("${CHECKMARK_DATA_URI}");
    -webkit-mask-size: contain;
    mask-size: contain;
    -webkit-mask-repeat: no-repeat;
    mask-repeat: no-repeat;
}
.pyro-rc-select optgroup {
    color: var(--shared-text-muted);
    font-size: 11px;
    text-transform: uppercase;
}
.pyro-rc-combobox { position: relative; width: 100%; }
.pyro-rc-combobox-input { width: 100%; box-sizing: border-box; }
.pyro-rc-combobox-list {
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    right: 0;
    z-index: 20;
    max-height: 180px;
    overflow-y: auto;
    flex-direction: column;
    background: var(--shared-surface);
    border: 1px solid var(--shared-surface-border);
    border-radius: 6px;
    padding: 4px;
    box-shadow: 0 4px 14px oklch(12% 0.01 260 / 0.5);
    scrollbar-width: thin;
    scrollbar-color: var(--shared-text-muted) var(--shared-surface);
}
.pyro-rc-combobox-list::-webkit-scrollbar { width: 6px; }
.pyro-rc-combobox-list::-webkit-scrollbar-track { background: var(--shared-surface); }
.pyro-rc-combobox-list::-webkit-scrollbar-thumb { background: var(--shared-text-muted); border-radius: 3px; }
.pyro-rc-combobox-item {
    all: unset;
    box-sizing: border-box;
    width: 100%;
    min-height: 24px;
    display: flex;
    align-items: center;
    padding: 5px 8px;
    border-radius: 4px;
    font-size: 12px;
    color: var(--shared-text);
    cursor: pointer;
}
.pyro-rc-combobox-item.highlighted,
.pyro-rc-combobox-item:hover {
    background: var(--shared-surface-hover);
}
.pyro-rc-combobox-item.selected {
    background: color-mix(in oklch, var(--shared-success) 22%, var(--shared-surface));
    color: var(--shared-text);
}
.pyro-rc-combobox-empty {
    padding: 6px 8px;
    font-size: 12px;
    color: var(--shared-text-muted);
}

.pyro-rc-icon-btn {
    box-sizing: border-box;
    min-height: 24px;
    min-width: 24px;
    background: var(--shared-danger-bg);
    border: 1px solid var(--shared-danger-border);
    color: var(--shared-danger);
    cursor: pointer;
    border-radius: 5px;
    padding: 4px 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}
@media (hover: hover) and (pointer: fine) {
    .pyro-rc-icon-btn:hover:not(:disabled) { background: var(--shared-danger-bg-hover); color: var(--shared-danger); }
}
.pyro-rc-icon-btn:disabled { opacity: 0.28; cursor: default; }
.pyro-rc-add-btn {
    box-sizing: border-box;
    min-height: 24px;
    background: none;
    border: none;
    color: var(--shared-text-muted);
    font-size: 11px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 3px;
    padding: 0;
}
@media (hover: hover) and (pointer: fine) { .pyro-rc-add-btn:hover { color: var(--shared-text); } }
.pyro-rc-check-row { box-sizing: border-box; min-height: 24px; display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--shared-text-muted); cursor: pointer; user-select: none; }
.pyro-rc-toggle-body { display: flex; flex-direction: column; gap: 8px; padding-left: 4px; border-left: 2px solid var(--shared-surface-border); }
.pyro-rc-time-row { display: flex; align-items: center; gap: 6px; }
.pyro-rc-time-row .pyro-rc-input { flex: 1; }
${checkboxCss("pyro-rc-checkbox", BAND_COLOR.excellent)}
.pyro-rc-actions-row { display: flex; gap: 8px; }
.pyro-rc-submit-btn {
    box-sizing: border-box;
    min-height: 24px;
    flex: 1;
    background: var(--shared-surface);
    border: 1px solid var(--shared-surface-border);
    color: var(--shared-text);
    cursor: pointer;
    border-radius: 5px;
    padding: 6px 10px;
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
}
@media (hover: hover) and (pointer: fine) { .pyro-rc-submit-btn:hover:not(:disabled) { background: var(--shared-surface-hover); } }
.pyro-rc-submit-btn:disabled { opacity: 0.4; cursor: default; }
.pyro-rc-reset-btn {
    box-sizing: border-box;
    min-height: 24px;
    background: var(--shared-danger-bg);
    border: 1px solid var(--shared-danger-border);
    color: var(--shared-danger);
    cursor: pointer;
    border-radius: 5px;
    padding: 6px 10px;
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
}
@media (hover: hover) and (pointer: fine) { .pyro-rc-reset-btn:hover:not(:disabled) { background: var(--shared-danger-bg-hover); color: var(--shared-danger); } }
.pyro-rc-reset-btn:disabled { opacity: 0.35; cursor: default; }
.pyro-rc-reset-btn svg { width: 12px; height: 12px; flex-shrink: 0; }
.pyro-rc-status { font-size: 11px; min-height: 14px; color: var(--shared-text-muted); display: flex; align-items: center; gap: 2px; }
.pyro-rc-status.ok { color: var(--shared-success); }
.pyro-rc-status.err { color: var(--shared-danger); }
.pyro-rc-status.hint { color: var(--shared-text-muted); }
.pyro-rc-status-warn { color: #e9a23b; margin-left: 3px; }
.pyro-rc-external-link { box-sizing: border-box; min-height: 24px; font-size: 12px; color: ${BAND_COLOR.excellent}; text-decoration: none; display: inline-flex; align-items: center; gap: 3px; align-self: flex-start; }
.pyro-rc-external-link:hover { text-decoration: underline; }
.pyro-rc-external-link svg { width: 10px; height: 10px; flex-shrink: 0; }
.pyro-rc-field-err { font-size: 11px; color: var(--shared-danger); min-height: 13px; margin-top: -4px; }
.pyro-rc-field-err:empty { display: none; margin-top: 0; }
.pyro-rc-optional-check { box-sizing: border-box; min-height: 24px; display: flex; align-items: center; gap: 4px; font-size: 11px; color: var(--shared-text-muted); flex-shrink: 0; cursor: pointer; user-select: none; white-space: nowrap; }
`);
  }
  function addSelectChrome(select) {
    const button = document.createElement("button");
    button.type = "button";
    const selectedContent = document.createElement("selectedcontent");
    button.appendChild(selectedContent);
    const chevron = document.createElement("span");
    chevron.className = "pyro-rc-select-icon";
    chevron.innerHTML = ICON_CHEVRON_DOWN;
    button.appendChild(chevron);
    select.insertBefore(button, select.firstChild);
  }
  function materialSelect(draft, onChange, options) {
    const select = el("select", "pyro-rc-select");
    const blank = document.createElement("option");
    blank.value = "";
    blank.textContent = "Select material\u2026";
    select.appendChild(blank);
    for (const group of options) {
      if (group.ids.length === 0) continue;
      const optgroup = document.createElement("optgroup");
      optgroup.label = group.label;
      for (const id of group.ids) {
        const opt = document.createElement("option");
        opt.value = id;
        opt.textContent = CATALOG[id].name;
        optgroup.appendChild(opt);
      }
      select.appendChild(optgroup);
    }
    select.value = draft.resourceId;
    select.addEventListener("change", () => {
      draft.resourceId = select.value;
      onChange();
    });
    addSelectChrome(select);
    return select;
  }
  function materialRow(draft, onRemove, canRemove, onChange, options, allowOptional) {
    const row2 = el("div", "pyro-rc-row");
    row2.appendChild(materialSelect(draft, onChange, options));
    const qty = el("input", "pyro-rc-input");
    qty.type = "number";
    qty.min = "1";
    qty.value = String(draft.qty);
    qty.addEventListener("input", () => {
      const val = parseInt(qty.value, 10);
      draft.qty = Number.isFinite(val) && val > 0 ? val : 1;
      onChange();
    });
    row2.appendChild(qty);
    if (allowOptional) {
      const optionalLbl = el("label", "pyro-rc-optional-check");
      const optionalCheckbox = el(
        "input",
        "pyro-rc-checkbox"
      );
      optionalCheckbox.type = "checkbox";
      optionalCheckbox.checked = !!draft.optional;
      optionalCheckbox.addEventListener("change", () => {
        draft.optional = optionalCheckbox.checked;
        onChange();
      });
      optionalLbl.appendChild(optionalCheckbox);
      optionalLbl.appendChild(txt("Optional"));
      row2.appendChild(optionalLbl);
    }
    const removeBtn = el("button", "pyro-rc-icon-btn");
    removeBtn.type = "button";
    removeBtn.innerHTML = ICON_TRASH;
    removeBtn.setAttribute("aria-label", "Remove material");
    removeBtn.disabled = !canRemove();
    removeBtn.addEventListener("click", onRemove);
    row2.appendChild(removeBtn);
    return row2;
  }
  function materialRowsGroup(drafts, onChange, options = RESOURCE_OPTIONS, allowOptional = false) {
    const rowsWrap = el("div", "pyro-rc-steps");
    const rowsContainer = el("div", "pyro-rc-steps");
    function render() {
      rowsContainer.innerHTML = "";
      drafts.forEach((draft, i) => {
        rowsContainer.appendChild(
          materialRow(
            draft,
            () => {
              drafts.splice(i, 1);
              render();
              onChange();
            },
            () => drafts.length > 1,
            onChange,
            options,
            allowOptional
          )
        );
      });
    }
    render();
    const addBtn = el("button", "pyro-rc-add-btn");
    addBtn.type = "button";
    addBtn.innerHTML = `${ICON_PLUS}<span>Add step</span>`;
    addBtn.addEventListener("click", () => {
      drafts.push({ resourceId: "", qty: 1 });
      render();
      onChange();
    });
    rowsWrap.appendChild(rowsContainer);
    rowsWrap.appendChild(addBtn);
    function setItems(items) {
      drafts.length = 0;
      drafts.push(...items);
      render();
    }
    return { root: rowsWrap, setItems };
  }
  function draftsFromItems(items) {
    if (!items || items.length === 0) return [{ resourceId: "", qty: 1 }];
    return items.map((i) => ({
      resourceId: i.resourceId,
      qty: i.qty,
      optional: i.optional
    }));
  }
  function toggleSection(label, timeLabel, drafts, timeState, enabledInitially, onChange, options) {
    const root = el("div", "pyro-rc-group");
    const checkRow = el("label", "pyro-rc-check-row");
    const checkbox = el("input", "pyro-rc-checkbox");
    checkbox.type = "checkbox";
    checkbox.checked = enabledInitially;
    const lbl = el("span");
    lbl.textContent = label;
    checkRow.appendChild(checkbox);
    checkRow.appendChild(lbl);
    root.appendChild(checkRow);
    const body = el("div", "pyro-rc-toggle-body");
    body.style.display = enabledInitially ? "flex" : "none";
    const rows = materialRowsGroup(drafts, onChange, options, true);
    body.appendChild(rows.root);
    const itemsErr = el("div", "pyro-rc-field-err");
    body.appendChild(itemsErr);
    const timeRow = el("div", "pyro-rc-time-row");
    const timeInputLbl = el("span", "pyro-rc-group-title");
    timeInputLbl.textContent = timeLabel;
    const timeInput = el("input", "pyro-rc-input");
    timeInput.type = "text";
    timeInput.placeholder = "e.g. early, late, 98%, 30s";
    timeInput.value = timeState.value;
    timeInput.addEventListener("input", () => {
      timeState.value = timeInput.value;
      onChange();
    });
    timeRow.appendChild(timeInputLbl);
    timeRow.appendChild(timeInput);
    body.appendChild(timeRow);
    const timeErr = el("div", "pyro-rc-field-err");
    body.appendChild(timeErr);
    root.appendChild(body);
    checkbox.addEventListener("change", () => {
      body.style.display = checkbox.checked ? "flex" : "none";
      onChange();
    });
    function reset(enabled, items, time) {
      checkbox.checked = enabled;
      body.style.display = enabled ? "flex" : "none";
      rows.setItems(items);
      timeState.value = time;
      timeInput.value = time;
    }
    return { root, isEnabled: () => checkbox.checked, itemsErr, timeErr, reset };
  }
  function buildForm(scenarioName) {
    const form = el("div", "pyro-rc-groups");
    const knownScenario = scenarioByName.get(scenarioName);
    const known = knownScenario?.actions;
    let revalidate = () => {
    };
    const onChange = () => revalidate();
    const payoutGroup = el("div", "pyro-rc-group");
    const payoutTitle = el("div", "pyro-rc-group-title");
    payoutTitle.textContent = "Payout range ($)";
    payoutGroup.appendChild(payoutTitle);
    const payoutRow = el("div", "pyro-rc-payout-row");
    const payoutMinInput = el("input", "pyro-rc-input");
    payoutMinInput.type = "number";
    payoutMinInput.min = "0";
    payoutMinInput.placeholder = "Min";
    if (knownScenario) payoutMinInput.value = String(knownScenario.payoutMin);
    const payoutMaxInput = el("input", "pyro-rc-input");
    payoutMaxInput.type = "number";
    payoutMaxInput.min = "0";
    payoutMaxInput.placeholder = "Max";
    if (knownScenario) payoutMaxInput.value = String(knownScenario.payoutMax);
    payoutRow.appendChild(payoutMinInput);
    payoutRow.appendChild(payoutMaxInput);
    payoutGroup.appendChild(payoutRow);
    const payoutErr = el("div", "pyro-rc-field-err");
    payoutGroup.appendChild(payoutErr);
    form.appendChild(payoutGroup);
    payoutMinInput.addEventListener("input", onChange);
    payoutMaxInput.addEventListener("input", onChange);
    const materialsIgniterGroup = el("div", "pyro-rc-group");
    const placeDrafts = draftsFromItems(known?.place);
    const placeGroup = el("div", "pyro-rc-group pyro-rc-place-group");
    const placeTitle = el("div", "pyro-rc-group-title");
    placeTitle.textContent = "Materials to place";
    placeGroup.appendChild(placeTitle);
    const placeRows = materialRowsGroup(
      placeDrafts,
      onChange,
      PLACE_RESOURCE_OPTIONS
    );
    placeGroup.appendChild(placeRows.root);
    const placeErr = el("div", "pyro-rc-field-err");
    placeGroup.appendChild(placeErr);
    materialsIgniterGroup.appendChild(placeGroup);
    const igniterGroup = el("div", "pyro-rc-group");
    const igniterTitle = el("div", "pyro-rc-group-title");
    igniterTitle.textContent = "Igniter";
    igniterGroup.appendChild(igniterTitle);
    const igniterSelect = el("select", "pyro-rc-select");
    const igniterBlank = document.createElement("option");
    igniterBlank.value = "";
    igniterBlank.textContent = "Select igniter\u2026";
    igniterSelect.appendChild(igniterBlank);
    for (const id of IGNITER_IDS) {
      const opt = document.createElement("option");
      opt.value = id;
      opt.textContent = CATALOG[id].name;
      igniterSelect.appendChild(opt);
    }
    const knownIgniter = known?.ignite?.[0]?.resourceId;
    if (knownIgniter) igniterSelect.value = knownIgniter;
    addSelectChrome(igniterSelect);
    igniterGroup.appendChild(igniterSelect);
    const igniterErr = el("div", "pyro-rc-field-err");
    igniterGroup.appendChild(igniterErr);
    materialsIgniterGroup.appendChild(igniterGroup);
    igniterSelect.addEventListener("change", onChange);
    form.appendChild(materialsIgniterGroup);
    const stokeDampenGroup = el("div", "pyro-rc-group");
    const stokeDampenTitle = el("div", "pyro-rc-group-title");
    stokeDampenTitle.textContent = "Stoke/Dampen";
    stokeDampenGroup.appendChild(stokeDampenTitle);
    const stokeDrafts = draftsFromItems(known?.stoke);
    const stokeTime = { value: known?.stokeTime ?? "" };
    const stoke = toggleSection(
      "Stoke",
      "Stoke time",
      stokeDrafts,
      stokeTime,
      !!known?.stoke,
      onChange,
      STOKE_RESOURCE_OPTIONS
    );
    stokeDampenGroup.appendChild(stoke.root);
    const dampenDrafts = draftsFromItems(known?.dampen);
    const dampenTime = { value: known?.dampenTime ?? "" };
    const dampen = toggleSection(
      "Dampen",
      "Dampen time",
      dampenDrafts,
      dampenTime,
      !!known?.dampen,
      onChange,
      DAMPEN_RESOURCE_OPTIONS
    );
    stokeDampenGroup.appendChild(dampen.root);
    form.appendChild(stokeDampenGroup);
    form.appendChild(el("hr", "pyro-rc-divider"));
    const actionsGroup = el("div", "pyro-rc-group");
    const actionsRow = el("div", "pyro-rc-actions-row");
    const resetBtn = el("button", "pyro-rc-reset-btn");
    resetBtn.type = "button";
    resetBtn.innerHTML = `${ICON_RESET}<span>Reset changes</span>`;
    actionsRow.appendChild(resetBtn);
    const submitBtn = el("button", "pyro-rc-submit-btn");
    submitBtn.type = "button";
    submitBtn.innerHTML = `${ICON_SEND}<span>Submit</span>`;
    actionsRow.appendChild(submitBtn);
    actionsGroup.appendChild(actionsRow);
    const status = el("div", "pyro-rc-status");
    actionsGroup.appendChild(status);
    form.appendChild(actionsGroup);
    function clearFieldErrors() {
      payoutErr.textContent = "";
      placeErr.textContent = "";
      igniterErr.textContent = "";
      stoke.itemsErr.textContent = "";
      stoke.timeErr.textContent = "";
      dampen.itemsErr.textContent = "";
      dampen.timeErr.textContent = "";
      payoutMinInput.classList.remove("pyro-rc-err");
      payoutMaxInput.classList.remove("pyro-rc-err");
    }
    function validItems(drafts) {
      const items = drafts.filter((d) => d.resourceId !== "");
      if (items.length === 0) return null;
      return items.map((d) => ({
        resourceId: d.resourceId,
        qty: d.qty,
        ...d.optional ? { optional: true } : {}
      }));
    }
    const baseline = {
      payoutMin: knownScenario?.payoutMin ?? null,
      payoutMax: knownScenario?.payoutMax ?? null,
      place: (known?.place ?? []).map((i) => ({
        resourceId: i.resourceId,
        qty: i.qty
      })),
      ignite: (known?.ignite ?? []).map((i) => ({
        resourceId: i.resourceId,
        qty: i.qty
      })),
      stokeEnabled: !!known?.stoke,
      stoke: (known?.stoke ?? []).map((i) => ({
        resourceId: i.resourceId,
        qty: i.qty,
        ...i.optional ? { optional: true } : {}
      })),
      stokeTime: known?.stokeTime ?? "",
      dampenEnabled: !!known?.dampen,
      dampen: (known?.dampen ?? []).map((i) => ({
        resourceId: i.resourceId,
        qty: i.qty,
        ...i.optional ? { optional: true } : {}
      })),
      dampenTime: known?.dampenTime ?? ""
    };
    revalidate = () => {
      clearFieldErrors();
      const payoutMin = parseFloat(payoutMinInput.value);
      const payoutMax = parseFloat(payoutMaxInput.value);
      let isValid = true;
      if (payoutMinInput.value.trim() === "" || payoutMaxInput.value.trim() === "" || !Number.isFinite(payoutMin) || !Number.isFinite(payoutMax) || payoutMin < 0 || payoutMax < 0) {
        payoutErr.textContent = "Enter a valid payout range.";
        payoutMinInput.classList.add("pyro-rc-err");
        payoutMaxInput.classList.add("pyro-rc-err");
        isValid = false;
      } else if (payoutMax < payoutMin) {
        payoutErr.textContent = "Max must be \u2265 min.";
        payoutMaxInput.classList.add("pyro-rc-err");
        isValid = false;
      }
      const place = validItems(placeDrafts);
      if (!place) {
        placeErr.textContent = "Add at least one material.";
        isValid = false;
      } else if (placeDrafts.some((d) => d.resourceId === "")) {
        placeErr.textContent = "Select a material for every added row, or remove the empty one.";
        isValid = false;
      }
      if (!igniterSelect.value) {
        igniterErr.textContent = "Select an igniter.";
        isValid = false;
      }
      let stokeItems = null;
      if (stoke.isEnabled()) {
        stokeItems = validItems(stokeDrafts);
        if (!stokeItems) {
          stoke.itemsErr.textContent = "Add at least one material, or disable Stoke.";
          isValid = false;
        } else if (stokeDrafts.some((d) => d.resourceId === "")) {
          stoke.itemsErr.textContent = "Select a material for every added row, or remove the empty one.";
          isValid = false;
        }
        if (stokeTime.value.trim() && !TIME_PATTERN.test(stokeTime.value.trim())) {
          stoke.timeErr.textContent = "Use early, late, <number>%, or <number>s.";
          isValid = false;
        }
      }
      let dampenItems = null;
      if (dampen.isEnabled()) {
        dampenItems = validItems(dampenDrafts);
        if (!dampenItems) {
          dampen.itemsErr.textContent = "Add at least one material, or disable Dampen.";
          isValid = false;
        } else if (dampenDrafts.some((d) => d.resourceId === "")) {
          dampen.itemsErr.textContent = "Select a material for every added row, or remove the empty one.";
          isValid = false;
        }
        if (dampenTime.value.trim() && !TIME_PATTERN.test(dampenTime.value.trim())) {
          dampen.timeErr.textContent = "Use early, late, <number>%, or <number>s.";
          isValid = false;
        }
      }
      const current = {
        payoutMin: Number.isFinite(payoutMin) ? payoutMin : null,
        payoutMax: Number.isFinite(payoutMax) ? payoutMax : null,
        place: place ?? [],
        ignite: igniterSelect.value ? [{ resourceId: igniterSelect.value, qty: 1 }] : [],
        stokeEnabled: stoke.isEnabled(),
        stoke: stoke.isEnabled() ? stokeItems ?? [] : [],
        stokeTime: stoke.isEnabled() ? stokeTime.value.trim() : "",
        dampenEnabled: dampen.isEnabled(),
        dampen: dampen.isEnabled() ? dampenItems ?? [] : [],
        dampenTime: dampen.isEnabled() ? dampenTime.value.trim() : ""
      };
      const changeCount = countRecipeChanges(current, baseline);
      const changed = changeCount > 0;
      submitBtn.disabled = !isValid || !changed;
      resetBtn.disabled = !changed;
      if (isValid && !changed) {
        status.textContent = "No changes to submit yet.";
        status.className = "pyro-rc-status hint";
      } else if (isValid && changed) {
        status.textContent = `${changeCount} change${changeCount === 1 ? "" : "s"} ready to submit.`;
        status.className = "pyro-rc-status hint";
      } else if (status.className === "pyro-rc-status hint") {
        status.textContent = "";
        status.className = "pyro-rc-status";
      }
    };
    revalidate();
    resetBtn.addEventListener("click", () => {
      payoutMinInput.value = knownScenario ? String(knownScenario.payoutMin) : "";
      payoutMaxInput.value = knownScenario ? String(knownScenario.payoutMax) : "";
      placeRows.setItems(draftsFromItems(known?.place));
      igniterSelect.value = knownIgniter ?? "";
      stoke.reset(
        !!known?.stoke,
        draftsFromItems(known?.stoke),
        known?.stokeTime ?? ""
      );
      dampen.reset(
        !!known?.dampen,
        draftsFromItems(known?.dampen),
        known?.dampenTime ?? ""
      );
      revalidate();
    });
    submitBtn.addEventListener("click", () => {
      revalidate();
      if (submitBtn.disabled) return;
      const payoutMin = parseFloat(payoutMinInput.value);
      const payoutMax = parseFloat(payoutMaxInput.value);
      const place = validItems(placeDrafts);
      submitBtn.disabled = true;
      status.textContent = "Submitting\u2026";
      status.className = "pyro-rc-status";
      const recipe = {
        place,
        ignite: [{ resourceId: igniterSelect.value, qty: 1 }]
      };
      if (stoke.isEnabled()) {
        const items = validItems(stokeDrafts);
        if (items) recipe.stoke = items;
        if (stokeTime.value.trim()) recipe.stokeTime = stokeTime.value.trim();
      }
      if (dampen.isEnabled()) {
        const items = validItems(dampenDrafts);
        if (items) recipe.dampen = items;
        if (dampenTime.value.trim()) recipe.dampenTime = dampenTime.value.trim();
      }
      const playerInfo = getPlayerInfoSafe();
      postSubmission(
        {
          scenarioName,
          payoutMin,
          payoutMax,
          submitterId: playerInfo.id,
          submitterName: playerInfo.name,
          recipe
        },
        (result) => {
          if (result.ok) {
            setIconStatus(status, ICON_CHECK, "Submitted!");
            status.className = "pyro-rc-status ok";
            if (result.remaining !== void 0 && result.remaining <= RATE_LIMIT_WARN_THRESHOLD) {
              const warn = el("span", "pyro-rc-status-warn");
              warn.textContent = result.remaining === 0 ? " \u2014 that was your last submission this hour." : ` \u2014 ${result.remaining} submission${result.remaining === 1 ? "" : "s"} left this hour.`;
              status.appendChild(warn);
            }
          } else {
            setIconStatus(status, ICON_X, result.error);
            status.className = "pyro-rc-status err";
            revalidate();
          }
        }
      );
    });
    return form;
  }
  function getPlayerInfoSafe() {
    try {
      const desktopLink = document.querySelector(
        '[class*="user-information"] a[href*="profiles.php?XID="]'
      );
      if (desktopLink) {
        const match = /XID=(\d+)/.exec(desktopLink.href);
        const name = desktopLink.textContent?.trim() || null;
        if (match) return { id: match[1], name };
      }
      const headerLink = document.querySelector(
        '#topHeaderBanner a[href*="profiles.php?XID="]'
      );
      if (headerLink) {
        const match = /XID=(\d+)/.exec(headerLink.href);
        if (match) return { id: match[1], name: null };
      }
      return { id: null, name: null };
    } catch {
      return { id: null, name: null };
    }
  }
  function buildSubmitTab(_ctx) {
    injectSubmitTabStyles();
    const root = el("div", "pyro-rc-groups");
    const submissionsLink = el("a", "pyro-rc-external-link");
    submissionsLink.href = "https://balaclava.app/arson/submissions";
    submissionsLink.target = "_blank";
    submissionsLink.rel = "noopener noreferrer";
    submissionsLink.innerHTML = `View submitted recipes ${ICON_EXTERNAL_LINK}`;
    root.appendChild(submissionsLink);
    const allNames = Array.from(scenarioByName.keys()).sort(
      (a, b) => a.localeCompare(b)
    );
    const initialSelection = preselectedScenario && scenarioByName.has(preselectedScenario) ? preselectedScenario : allNames[0] ?? "";
    preselectedScenario = null;
    const scenarioGroup = el("div", "pyro-rc-group");
    const scenarioTitle = el("div", "pyro-rc-group-title");
    scenarioTitle.textContent = "Scenario";
    scenarioGroup.appendChild(scenarioTitle);
    const formSlot = el("div");
    if (initialSelection) formSlot.appendChild(buildForm(initialSelection));
    const combobox = buildScenarioCombobox(allNames, initialSelection, (name) => {
      formSlot.innerHTML = "";
      formSlot.appendChild(buildForm(name));
    });
    scenarioGroup.appendChild(combobox);
    root.appendChild(scenarioGroup);
    root.appendChild(formSlot);
    return root;
  }
  function buildScenarioCombobox(allNames, initialSelection, onSelect) {
    const wrap = el("div", "pyro-rc-combobox");
    const input = el(
      "input",
      "pyro-rc-input pyro-rc-combobox-input"
    );
    input.type = "text";
    input.placeholder = "Search scenarios\u2026";
    input.autocomplete = "off";
    input.spellcheck = false;
    input.value = initialSelection;
    input.setAttribute("role", "combobox");
    input.setAttribute("aria-expanded", "false");
    input.setAttribute("aria-autocomplete", "list");
    const list = el("div", "pyro-rc-combobox-list");
    list.setAttribute("role", "listbox");
    list.style.display = "none";
    let selected = initialSelection;
    let filtered = allNames;
    let highlighted = -1;
    function filterNames(query) {
      const q = query.trim().toLowerCase();
      if (!q) return allNames;
      return allNames.filter((n) => n.toLowerCase().includes(q));
    }
    function renderList() {
      list.innerHTML = "";
      if (filtered.length === 0) {
        const empty = el("div", "pyro-rc-combobox-empty");
        empty.textContent = "No matching scenarios";
        list.appendChild(empty);
        return;
      }
      filtered.forEach((name, i) => {
        const item = el("button", "pyro-rc-combobox-item");
        item.type = "button";
        item.textContent = name;
        item.setAttribute("role", "option");
        if (name === selected) item.classList.add("selected");
        if (i === highlighted) item.classList.add("highlighted");
        item.addEventListener("mousedown", (e) => {
          e.preventDefault();
          choose(name);
        });
        list.appendChild(item);
      });
    }
    function openList() {
      list.style.display = "flex";
      input.setAttribute("aria-expanded", "true");
    }
    function closeList() {
      list.style.display = "none";
      input.setAttribute("aria-expanded", "false");
      highlighted = -1;
    }
    function choose(name) {
      selected = name;
      input.value = name;
      closeList();
      onSelect(name);
    }
    input.addEventListener("focus", () => {
      filtered = filterNames(input.value === selected ? "" : input.value);
      highlighted = -1;
      renderList();
      openList();
    });
    input.addEventListener("input", () => {
      filtered = filterNames(input.value);
      highlighted = -1;
      renderList();
      openList();
    });
    input.addEventListener("blur", () => {
      setTimeout(() => {
        input.value = selected;
        closeList();
      }, 120);
    });
    input.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        input.value = selected;
        closeList();
        input.blur();
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        if (list.style.display === "none") {
          filtered = filterNames("");
          openList();
        }
        highlighted = Math.min(highlighted + 1, filtered.length - 1);
        renderList();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        highlighted = Math.max(highlighted - 1, 0);
        renderList();
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (highlighted >= 0 && filtered[highlighted])
          choose(filtered[highlighted]);
      }
    });
    wrap.appendChild(input);
    wrap.appendChild(list);
    return wrap;
  }

  // src/userscripts/arsonists-ledger/settings.ts
  function setOkStatus(statusEl, message) {
    setIconStatus(statusEl, ICON_CHECK, message);
  }
  function setErrStatus(statusEl, message) {
    setIconStatus(statusEl, ICON_X, message);
  }
  function injectSettingsStyles() {
    injectStyleOnce("pyro-settings-styles", `
.pyro-settings-wrap {
    margin-left: 8px;
}
#pyro-settings-panel {
    --pyro-api-color: var(--shared-success);
    --pyro-manual-color: #7af;
    --pyro-db-color: var(--shared-text-muted);
}
.pyro-tab-bar { display: flex; border-bottom: 1px solid var(--shared-border); }
.pyro-tab {
    flex: 1;
    background: none;
    border: none;
    border-bottom: 1px solid transparent;
    color: var(--shared-text-muted);
    cursor: pointer;
    padding: 8px 16px;
    font: inherit;
    font-size: 14px;
    transition: color 120ms ease-out;
}
@media (hover: hover) and (pointer: fine) {
    .pyro-tab:hover { color: var(--shared-text); }
}
.pyro-tab.active {
    color: var(--shared-text);
    border-bottom-color: ${BAND_COLOR.excellent};
    background: linear-gradient(0deg, color-mix(in oklch, ${BAND_COLOR.excellent} 20%, transparent 80%), transparent 55%);
}
.pyro-tab-content { padding: 10px; max-height: 380px; overflow-y: auto; scrollbar-gutter: stable; }
.pyro-tab-content>div { display: flex; flex-direction: column; gap: 14px; }
.pyro-tab-content::-webkit-scrollbar { width: 3px; }
.pyro-tab-content::-webkit-scrollbar-track { background: transparent; }
.pyro-tab-content::-webkit-scrollbar-thumb { background: var(--shared-text-muted); border-radius: 2px; }
.pyro-s-group { display: flex; flex-direction: column; gap: 8px; }
.pyro-s-group-title {
    font-size: 14px;
    text-transform: uppercase;
    color: var(--shared-text-muted);
}
.pyro-s-rows { display: flex; flex-direction: column; gap: 4px; }
.pyro-s-row { display: flex; align-items: center; gap: 6px; }
.pyro-s-label {
    flex: 1;
    font-size: 12px;
    color: var(--shared-text-muted);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    min-width: 0;
}
.pyro-s-input {
    width: 76px;
    background: var(--shared-surface);
    border: 1px solid var(--shared-surface-border);
    color: var(--shared-text);
    font-size: 12px;
    padding: 3px 5px;
    border-radius: 5px;
    text-align: right;
    -moz-appearance: textfield;
    transition: border-color 120ms ease-out;
}
.pyro-s-input::-webkit-inner-spin-button,
.pyro-s-input::-webkit-outer-spin-button { -webkit-appearance: none; }
.pyro-s-input:focus-visible { outline: none; border-color: ${BAND_COLOR.excellent}; }
.pyro-s-input.from-api   { border-color: var(--shared-success); color: var(--shared-success); }
.pyro-s-input.overridden { border-color: #48a; color: #7af; }
.pyro-s-divider { border: none; border-top: 1px solid var(--shared-border); margin: 8px 0; }
.pyro-s-key-row { display: flex; gap: 6px; margin-bottom: 6px; }
.pyro-s-key-input {
    flex: 1;
    background: var(--shared-surface);
    border: 1px solid var(--shared-surface-border);
    color: var(--shared-text);
    font-size: 12px;
    padding: 4px 6px;
    border-radius: 5px;
    min-width: 0;
    font-family: monospace;
    transition: border-color 120ms ease-out;
}
.pyro-s-key-input:focus-visible { outline: none; border-color: ${BAND_COLOR.excellent}; }
.pyro-s-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    box-sizing: border-box;
    min-height: 24px;
    background: var(--shared-surface);
    border: 1px solid var(--shared-surface-border);
    color: var(--shared-text-muted);
    cursor: pointer;
    border-radius: 5px;
    padding: 4px 9px;
    font-size: 12px;
    white-space: nowrap;
    transition: transform 100ms ease-out, background 120ms ease-out, color 120ms ease-out;
}
.pyro-s-btn svg { width: 12px; height: 12px; flex-shrink: 0; }
@media (hover: hover) and (pointer: fine) {
    .pyro-s-btn:hover:not(:disabled) { background: var(--shared-surface-hover); color: var(--shared-text); }
}
.pyro-s-btn:active:not(:disabled) { transform: scale(0.97); }
.pyro-s-btn:disabled { opacity: 0.28; cursor: default; }
.pyro-s-btn-danger {
    background: var(--shared-danger-bg);
    border-color: var(--shared-danger-border);
    color: var(--shared-danger);
}
@media (hover: hover) and (pointer: fine) {
    .pyro-s-btn-danger:hover:not(:disabled) { background: var(--shared-danger-bg-hover); color: var(--shared-danger); }
}
.pyro-s-status {
    font-size: 10px;
    min-height: 13px;
    color: var(--shared-text-muted);
    display: flex;
    align-items: center;
    gap: 2px;
    flex-wrap: nowrap;
}
.pyro-s-status.ok  { color: ${BAND_COLOR.good}; }
.pyro-s-status.err { color: var(--shared-danger); }
.pyro-s-status:empty { display: none; }
.pyro-s-refresh-row { display: flex; align-items: center; gap: 8px; }
.pyro-s-timestamp { font-size: 10px; color: var(--shared-text-muted); }
.pyro-s-check-row {
    display: flex;
    align-items: center;
    gap: 7px;
    font-size: 12px;
    color: var(--shared-text-muted);
    cursor: pointer;
    user-select: none;
}
.pyro-s-check-row--disabled {
    opacity: 0.4;
    cursor: not-allowed;
}
${checkboxCss("pyro-s-checkbox", BAND_COLOR.excellent)}
.pyro-s-checkbox:disabled, .pyro-s-check-row--disabled .pyro-s-checkbox { cursor: not-allowed; }
.pyro-s-toggle-group {
    display: inline-flex;
    align-self: flex-start;
    border: 1px solid var(--shared-surface-border);
    border-radius: 5px;
    overflow: hidden;
}
.pyro-s-toggle-btn {
    background: var(--shared-surface);
    border: none;
    color: var(--shared-text-muted);
    font: inherit;
    font-size: 12px;
    padding: 4px 12px;
    cursor: pointer;
    transition: background 120ms ease-out, color 120ms ease-out;
}
.pyro-s-toggle-btn + .pyro-s-toggle-btn { border-left: 1px solid var(--shared-surface-border); }
@media (hover: hover) and (pointer: fine) {
    .pyro-s-toggle-btn:not(.active):hover { color: var(--shared-text); }
}
.pyro-s-toggle-btn.active {
    background: ${BAND_COLOR.excellent};
    color: oklch(18% 0 0);
}
.pyro-s-section-note { display: flex; align-items: flex-start; gap: 5px; font-size: 10px; line-height: 1.4; color: var(--shared-text-muted); margin-bottom: 6px; }
.pyro-s-section-note > svg { width: 10px; height: 10px; flex-shrink: 0; margin-top: 1px; }
.pyro-s-section-note span strong { color: var(--shared-text); font-weight: normal; }
.pyro-s-section-note a { color: ${BAND_COLOR.excellent}; text-decoration: none; display: inline-flex; align-items: center; gap: 3px; }
.pyro-s-section-note a:hover { text-decoration: underline; }
.pyro-s-section-note a svg { width: 10px; height: 10px; flex-shrink: 0; }
.pyro-s-missing-header { font-size: 10px; color: var(--shared-text-muted); margin: 8px 0 4px; }
.pyro-s-missing-list { font-size: 10px; color: var(--shared-text-muted); padding-left: 14px; margin: 0; }
`);
  }
  function applyPriceStyle(input, source) {
    input.classList.remove("overridden", "from-api");
    if (source === "manual") input.classList.add("overridden");
    else if (source === "api") input.classList.add("from-api");
  }
  function priceInput(id, ctx) {
    const input = el("input", "pyro-s-input");
    input.type = "number";
    input.min = "0";
    let initialValue = "";
    let isDirty = false;
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
      initialValue = input.value;
      isDirty = false;
    };
    refresh();
    const commit = () => {
      if (!isDirty) {
        refresh();
        return;
      }
      const raw = input.value.trim();
      if (raw === "") {
        ctx.clearManualPrice(id);
      } else {
        const val = Math.round(parseFloat(raw));
        if (!isNaN(val) && val >= 0) ctx.setManualPrice(id, val);
      }
      refresh();
    };
    input.addEventListener("focus", () => {
      initialValue = input.value;
      isDirty = false;
    });
    input.addEventListener("input", () => {
      isDirty = input.value !== initialValue;
    });
    input.addEventListener("blur", commit);
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") input.blur();
    });
    return input;
  }
  var PRICE_GROUPS = [
    { title: "Liquids", ids: ["gasoline", "diesel", "kerosene"] },
    { title: "Solids", ids: ["magnesium", "thermite", "potassium_nitrate"] },
    { title: "Gases", ids: ["oxygen", "methane", "hydrogen"] },
    {
      title: "Evidence",
      ids: Object.values(CATALOG).filter((r) => r.kind === "evidence").sort((a, b) => a.name.localeCompare(b.name)).map((r) => r.id)
    }
  ];
  function buildPricesTab(ctx, panel) {
    const root = el("div");
    const hasManualOverrides = Object.keys(ctx.getManualPrices()).length > 0;
    const hasApiPrices = ctx.getApiLastRefresh() > 0 || Object.keys(ctx.getApiPrices()).length > 0;
    const actionGroup = el("div", "pyro-s-group");
    const actionRow = el("div", "pyro-s-refresh-row");
    const resetBtn = el(
      "button",
      "pyro-s-btn pyro-s-btn-danger"
    );
    resetBtn.type = "button";
    resetBtn.innerHTML = `${ICON_RESET}<span>Reset</span>`;
    if (!hasManualOverrides && !hasApiPrices) resetBtn.disabled = true;
    const refreshBtn = el("button", "pyro-s-btn");
    refreshBtn.type = "button";
    refreshBtn.innerHTML = `${ICON_REFRESH}<span>Refresh</span>`;
    if (!ctx.getApiKey()) refreshBtn.disabled = true;
    const tsEl = el("span", "pyro-s-timestamp");
    const ts = ctx.getApiLastRefresh();
    tsEl.textContent = ts ? `Fetched: ${formatTimestamp(ts)}` : `DB: ${CATALOG_UPDATED}`;
    actionRow.appendChild(resetBtn);
    actionRow.appendChild(refreshBtn);
    actionRow.appendChild(tsEl);
    actionGroup.appendChild(actionRow);
    const actionStatus = el("div", "pyro-s-status");
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
        setErrStatus(actionStatus, result.error ?? "Unknown error");
        actionStatus.className = "pyro-s-status err";
      }
    });
    resetBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      ctx.clearManualPrices();
      ctx.clearApiPrices();
      actionStatus.textContent = "Reset to bundled prices";
      actionStatus.className = "pyro-s-status";
      rerenderTab(panel, "prices", ctx);
    });
    for (const group of PRICE_GROUPS) {
      const g = el("div", "pyro-s-group");
      const title = el("div", "pyro-s-group-title");
      title.textContent = group.title;
      g.appendChild(title);
      const rows = el("div", "pyro-s-rows");
      for (const id of group.ids) {
        const resource = CATALOG[id];
        if (!resource) continue;
        const row2 = el("div", "pyro-s-row");
        const label = el("span", "pyro-s-label");
        label.textContent = resource.name;
        label.title = resource.name;
        row2.appendChild(label);
        row2.appendChild(priceInput(id, ctx));
        rows.appendChild(row2);
      }
      g.appendChild(rows);
      if (group !== PRICE_GROUPS[0]) {
        const divider = el("hr", "pyro-s-divider");
        root.appendChild(divider);
      }
      root.appendChild(g);
    }
    const note = el("p", "pyro-s-section-note");
    note.innerHTML = `${ICON_INFO}<span>Saved prices as of ${CATALOG_UPDATED}. API price active in <span style="color: var(--pyro-api-color);">green</span>. Manual override in <span style="color: var(--pyro-manual-color);">blue</span>. Clear manual price to revert to API or database <span style="color: var(--pyro-db-color);">default</span>.</span>`;
    root.appendChild(note);
    return root;
  }
  function thresholdInput(label, getVal, setVal) {
    const row2 = el("div", "pyro-s-row");
    const lbl = el("span", "pyro-s-label");
    const [before, after] = label.split("\u2192");
    lbl.appendChild(txt(before.trim()));
    lbl.appendChild(svgEl(ICON_ARROW_RIGHT));
    lbl.appendChild(txt((after ?? "").trim()));
    const input = buildNumberInput(getVal, setVal, { className: "pyro-s-input" });
    row2.appendChild(lbl);
    row2.appendChild(input);
    return row2;
  }
  function buildThresholdsTab(ctx) {
    const root = el("div");
    const thresholdsGroup = el("div", "pyro-s-group");
    const bandNote = el("p", "pyro-s-section-note");
    bandNote.innerHTML = `${ICON_INFO}<span>Cards are color-coded by profit/nerve: <span style="color:${BAND_COLOR.negative}">negative</span> (\u2264 0), <span style="color:${BAND_COLOR.low}">low</span>, <span style="color:${BAND_COLOR.good}">good</span>, <span style="color:${BAND_COLOR.excellent}">excellent</span>.</span>`;
    thresholdsGroup.appendChild(bandNote);
    const thresholdRows = el("div", "pyro-s-rows");
    thresholdRows.appendChild(
      thresholdInput(
        "Low \u2192 Good ($/N)",
        () => ctx.getThresholds().low,
        (val) => {
          const t = ctx.getThresholds();
          ctx.setThresholds({ low: val, good: Math.max(val, t.good) });
        }
      )
    );
    thresholdRows.appendChild(
      thresholdInput(
        "Good \u2192 Excellent ($/N)",
        () => ctx.getThresholds().good,
        (val) => {
          const t = ctx.getThresholds();
          ctx.setThresholds({ low: Math.min(t.low, val), good: val });
        }
      )
    );
    thresholdsGroup.appendChild(thresholdRows);
    root.appendChild(thresholdsGroup);
    const basisGroup = el("div", "pyro-s-group");
    const basisTitle = el("div", "pyro-s-group-title");
    basisTitle.textContent = "Payout basis";
    basisGroup.appendChild(basisTitle);
    const basisNote = el("p", "pyro-s-section-note");
    basisNote.innerHTML = `${ICON_INFO}<span>Which payout figure drives PPN math (and card banding): the realistic <strong>average</strong> of the observed range, or the optimistic <strong>max</strong>.</span>`;
    basisGroup.appendChild(basisNote);
    basisGroup.appendChild(
      toggleGroupRow(
        "payout-basis",
        "PPN calculation basis",
        [
          { value: "average", label: "Average" },
          { value: "max", label: "Max" }
        ],
        ctx.getPayoutBasis,
        ctx.setPayoutBasis
      )
    );
    root.appendChild(basisGroup);
    return root;
  }
  function checkboxRow(label, getVal, setVal) {
    const toggle = el("label", "pyro-s-check-row");
    const checkbox = el("input", "pyro-s-checkbox");
    checkbox.type = "checkbox";
    checkbox.checked = getVal();
    checkbox.addEventListener("change", () => {
      setVal(checkbox.checked);
    });
    const lbl = el("span");
    lbl.textContent = label;
    toggle.appendChild(checkbox);
    toggle.appendChild(lbl);
    return toggle;
  }
  function toggleGroupRow(idSlug, label, options, getVal, setVal) {
    const row2 = el("div", "pyro-s-row");
    const labelId = `pyro-s-toggle-label-${idSlug}`;
    const { wrap } = buildButtonGroup(
      {
        wrapClassName: "pyro-s-toggle-group",
        btnClassName: "pyro-s-toggle-btn",
        ariaGroup: true
      },
      options,
      getVal,
      setVal
    );
    wrap.setAttribute("aria-labelledby", labelId);
    row2.appendChild(wrap);
    const lbl = el("span", "pyro-s-label");
    lbl.textContent = label;
    lbl.id = labelId;
    row2.appendChild(lbl);
    return row2;
  }
  function buildVisualsTab(ctx) {
    const root = el("div");
    const group = el("div", "pyro-s-group");
    const title = el("div", "pyro-s-group-title");
    title.textContent = "Tooltips";
    group.appendChild(title);
    const rows = el("div", "pyro-s-rows");
    rows.appendChild(
      checkboxRow(
        "Show scenario name",
        ctx.getShowScenarioName,
        ctx.setShowScenarioName
      )
    );
    rows.appendChild(
      checkboxRow(
        'Show "optional" badges',
        ctx.getShowOptionalBadges,
        ctx.setShowOptionalBadges
      )
    );
    rows.appendChild(
      checkboxRow(
        "Stack multiple resources on separate lines",
        ctx.getStackResources,
        ctx.setStackResources
      )
    );
    rows.appendChild(
      checkboxRow(
        "Show resource prices",
        ctx.getShowResourcePrices,
        ctx.setShowResourcePrices
      )
    );
    group.appendChild(rows);
    root.appendChild(group);
    const barGroup = el("div", "pyro-s-group");
    const barTitle = el("div", "pyro-s-group-title");
    barTitle.textContent = "Scenarios";
    barGroup.appendChild(barTitle);
    barGroup.appendChild(
      toggleGroupRow(
        "ppn-bar-position",
        "PPN bar position",
        [
          { value: "left", label: "Left" },
          { value: "right", label: "Right" }
        ],
        ctx.getPpnBarPosition,
        ctx.setPpnBarPosition
      )
    );
    const buildingInfoRow = checkboxRow(
      "Show building data",
      ctx.getShowBuildingStats,
      ctx.setShowBuildingStats
    );
    barGroup.appendChild(buildingInfoRow);
    const buildingStatRows = [
      checkboxRow(
        "Show response time",
        ctx.getShowResponseTime,
        ctx.setShowResponseTime
      ),
      checkboxRow(
        "Show flammability",
        ctx.getShowFlammability,
        ctx.setShowFlammability
      ),
      checkboxRow("Show rurality", ctx.getShowRurality, ctx.setShowRurality),
      checkboxRow("Show urgency", ctx.getShowUrgency, ctx.setShowUrgency)
    ];
    const buildingStatCheckboxes = buildingStatRows.map(
      (row2) => row2.querySelector("input")
    );
    function syncBuildingStatRows() {
      const enabled = ctx.getShowBuildingStats();
      buildingStatRows.forEach((row2, i) => {
        buildingStatCheckboxes[i].disabled = !enabled;
        row2.classList.toggle("pyro-s-check-row--disabled", !enabled);
      });
    }
    buildingInfoRow.querySelector("input").addEventListener("change", syncBuildingStatRows);
    syncBuildingStatRows();
    buildingStatRows.forEach((row2) => barGroup.appendChild(row2));
    root.appendChild(barGroup);
    const materialsGroup = el("div", "pyro-s-group");
    const materialsTitle = el("div", "pyro-s-group-title");
    materialsTitle.textContent = "Materials";
    materialsGroup.appendChild(materialsTitle);
    const materialDataRow = checkboxRow(
      "Show material data",
      ctx.getShowMaterialData,
      ctx.setShowMaterialData
    );
    materialsGroup.appendChild(materialDataRow);
    const materialStatRows = [
      checkboxRow(
        "Show intensity",
        ctx.getShowMaterialIntensity,
        ctx.setShowMaterialIntensity
      ),
      checkboxRow(
        "Show momentum",
        ctx.getShowMaterialMomentum,
        ctx.setShowMaterialMomentum
      ),
      checkboxRow(
        "Show suspicion",
        ctx.getShowMaterialSuspicion,
        ctx.setShowMaterialSuspicion
      ),
      checkboxRow(
        "Show ignition risk",
        ctx.getShowMaterialIgnitionRisk,
        ctx.setShowMaterialIgnitionRisk
      ),
      checkboxRow(
        "Show stoking risk",
        ctx.getShowMaterialStokingRisk,
        ctx.setShowMaterialStokingRisk
      )
    ];
    const materialStatCheckboxes = materialStatRows.map(
      (row2) => row2.querySelector("input")
    );
    function syncMaterialStatRows() {
      const enabled = ctx.getShowMaterialData();
      materialStatRows.forEach((row2, i) => {
        materialStatCheckboxes[i].disabled = !enabled;
        row2.classList.toggle("pyro-s-check-row--disabled", !enabled);
      });
    }
    materialDataRow.querySelector("input").addEventListener("change", syncMaterialStatRows);
    syncMaterialStatRows();
    materialStatRows.forEach((row2) => materialsGroup.appendChild(row2));
    root.appendChild(materialsGroup);
    return root;
  }
  function buildApiTab(ctx) {
    const root = el("div");
    const keyGroup = el("div", "pyro-s-group");
    const keyNote = el("p", "pyro-s-section-note");
    keyNote.innerHTML = `${ICON_INFO}<span><strong>Public access</strong> only, used solely to fetch item market prices. <a href="https://www.torn.com/preferences.php#tab=api?step=addNewKey&title=Arsonist%27s+Ledger&torn=items" target="_blank" rel="noopener noreferrer">Create one ${ICON_EXTERNAL_LINK}</a></span>`;
    keyGroup.appendChild(keyNote);
    const storageNote = el("p", "pyro-s-section-note");
    storageNote.innerHTML = `${ICON_INFO}<span>Stored by your userscript manager only, <strong>never</strong> sent to any server other than Torn's API.</span>`;
    keyGroup.appendChild(storageNote);
    const keyRow = el("div", "pyro-s-key-row");
    const keyInput = el("input", "pyro-s-key-input");
    keyInput.type = "password";
    keyInput.placeholder = "Your Torn API key";
    keyInput.value = ctx.getApiKey();
    keyInput.autocomplete = "off";
    keyInput.spellcheck = false;
    const saveBtn = el("button", "pyro-s-btn");
    saveBtn.type = "button";
    saveBtn.textContent = "Validate & save";
    keyRow.appendChild(keyInput);
    keyRow.appendChild(saveBtn);
    keyGroup.appendChild(keyRow);
    const keyStatus = el("div", "pyro-s-status");
    if (ctx.getApiKey()) {
      setOkStatus(keyStatus, "Key saved");
      keyStatus.className = "pyro-s-status ok";
    }
    keyGroup.appendChild(keyStatus);
    root.appendChild(keyGroup);
    saveBtn.addEventListener("click", async () => {
      const key = keyInput.value.trim();
      if (!key) {
        setErrStatus(keyStatus, "Enter a key first.");
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
        setErrStatus(keyStatus, result.error ?? "Unknown error");
        keyStatus.className = "pyro-s-status err";
      }
    });
    return root;
  }
  function formatTimestamp(ts) {
    return new Date(ts).toLocaleString(void 0, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  }
  function buildTabBar(activeId, onSwitch) {
    const tabs = [
      { value: "prices", label: "Prices" },
      { value: "thresholds", label: "Thresholds" },
      { value: "visuals", label: "Visuals" },
      { value: "api", label: "API" },
      { value: "submit", label: "Submit" }
    ];
    let current = activeId;
    const { wrap } = buildButtonGroup(
      {
        wrapClassName: "pyro-tab-bar",
        btnClassName: "pyro-tab",
        onButtonCreated(btn, option) {
          btn.dataset.tab = option.value;
        }
      },
      tabs,
      () => current,
      (id) => {
        current = id;
        onSwitch(id);
      }
    );
    return wrap;
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
      case "visuals":
        return buildVisualsTab(ctx);
      case "api":
        return buildApiTab(ctx);
      case "submit":
        return buildSubmitTab(ctx);
      default:
        return buildPricesTab(ctx, panel);
    }
  }
  var currentPanel = null;
  var currentBtn = null;
  var currentCtx = null;
  function injectSettings(root, ctx) {
    currentCtx = ctx;
    const existing = document.getElementById("pyro-settings-btn");
    if (existing) {
      if (root.contains(existing)) return;
      existing.closest(".pyro-settings-wrap")?.remove();
    }
    injectSettingsStyles();
    const anchor = root.querySelector(SEL.RESULT_COUNTS) ?? root.querySelector(SEL.TITLE_BAR) ?? root;
    const { wrap, btn, panel } = createPopover({
      buttonAriaLabel: "Arsonist's Ledger settings",
      buttonContent: ICON_FLAME,
      btnId: "pyro-settings-btn",
      panelId: "pyro-settings-panel",
      wrapClass: "pyro-settings-wrap"
    });
    currentPanel = panel;
    currentBtn = btn;
    const activeTabId = ctx.getActiveTab() || "prices";
    panel.appendChild(
      buildTabBar(activeTabId, (tabId) => {
        ctx.setActiveTab(tabId);
        rerenderTab(panel, tabId, ctx);
      })
    );
    const content = el("div", "pyro-tab-content");
    content.appendChild(buildTabContent(activeTabId, ctx, panel));
    panel.appendChild(content);
    anchor.appendChild(wrap);
  }
  function openSettingsToSubmit(scenarioName) {
    if (!currentPanel || !currentBtn || !currentCtx) return;
    setPreselectedScenario(scenarioName);
    currentCtx.setActiveTab("submit");
    currentPanel.querySelectorAll(".pyro-tab").forEach((b) => b.classList.remove("active"));
    currentPanel.querySelector('.pyro-tab[data-tab="submit"]')?.classList.add("active");
    rerenderTab(currentPanel, "submit", currentCtx);
    currentPanel.classList.add("is-open");
    currentBtn.setAttribute("aria-expanded", "true");
    currentBtn.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  // src/data/buildings.ts
  var BUILDINGS = {
    "Bazaar": { areas: 1, responseTime: 60, rurality: 2, dps: "1.6/s", flammability: 4, urgency: 4 },
    "Beach Hut": { areas: 1, responseTime: 120, rurality: 3, dps: "2/s", flammability: 5, urgency: 1 },
    "Firework Store": { areas: 1, responseTime: 60, rurality: 2, dps: null, flammability: -1, urgency: null },
    "Fishing Hut": { areas: 1, responseTime: 480, rurality: 5, dps: "2/s", flammability: 5, urgency: 1 },
    "Forgery Workshop": { areas: 1, responseTime: 480, rurality: 5, dps: "1.2/s", flammability: 3, urgency: 1 },
    "Hunting Lodge": { areas: 1, responseTime: 480, rurality: 5, dps: "1.6/s", flammability: 4, urgency: 1 },
    "Lifeguard Hut": { areas: 1, responseTime: 120, rurality: 3, dps: "1.6/s", flammability: 4, urgency: 2 },
    "Mobile Home": { areas: 1, responseTime: 120, rurality: 3, dps: "1.6/s", flammability: 4, urgency: 2 },
    "Restroom": { areas: 1, responseTime: 120, rurality: 3, dps: "0.4/s", flammability: 1, urgency: 6 },
    "Self Storage Container": { areas: 1, responseTime: 240, rurality: 4, dps: "1.2/s", flammability: 3, urgency: 1 },
    "Shack": { areas: 1, responseTime: 240, rurality: 4, dps: "2/s", flammability: 5, urgency: 1 },
    "Tool Shed": { areas: 1, responseTime: 120, rurality: 3, dps: "2/s", flammability: 5, urgency: 1 },
    "Yurt": { areas: 1, responseTime: 120, rurality: 3, dps: "2/s", flammability: 5, urgency: 1 },
    "Adult Store": { areas: 2, responseTime: 60, rurality: 2, dps: "1.2/s", flammability: 3, urgency: 5 },
    "Apartment": { areas: 2, responseTime: 30, rurality: 1, dps: "1.2/s", flammability: 3, urgency: 5 },
    "Arcade": { areas: 2, responseTime: 60, rurality: 2, dps: "1.6/s", flammability: 4, urgency: 4 },
    "Barbershop": { areas: 2, responseTime: 60, rurality: 2, dps: "0.8/s", flammability: 2, urgency: 6 },
    "Bookies": { areas: 2, responseTime: 30, rurality: 1, dps: "1.6/s", flammability: 4, urgency: 5 },
    "Bordello": { areas: 2, responseTime: 120, rurality: 3, dps: "1.6/s", flammability: 4, urgency: 2 },
    "Bungalow": { areas: 2, responseTime: 120, rurality: 3, dps: "1.2/s", flammability: 3, urgency: 2 },
    "Cafe": { areas: 2, responseTime: 120, rurality: 3, dps: "1.6/s", flammability: 4, urgency: 2 },
    "Candle Shop": { areas: 2, responseTime: 60, rurality: 2, dps: "2/s", flammability: 5, urgency: 3 },
    "Chiropractors Office": { areas: 2, responseTime: 60, rurality: 2, dps: "0.8/s", flammability: 2, urgency: 6 },
    "Cleaning Agency": { areas: 2, responseTime: 120, rurality: 3, dps: "1.2/s", flammability: 3, urgency: 2 },
    "Clock Tower": { areas: 2, responseTime: 30, rurality: 1, dps: "1.6/s", flammability: 4, urgency: 5 },
    "Clothing Store": { areas: 2, responseTime: 30, rurality: 1, dps: "1.6/s", flammability: 4, urgency: 5 },
    "Community Center": { areas: 2, responseTime: 30, rurality: 1, dps: "1.6/s", flammability: 4, urgency: 5 },
    "Cottage": { areas: 2, responseTime: 240, rurality: 4, dps: "1.6/s", flammability: 4, urgency: 1 },
    "Cyber Cafe": { areas: 2, responseTime: 30, rurality: 1, dps: "0.8/s", flammability: 2, urgency: 6 },
    "Dental Surgery": { areas: 2, responseTime: 60, rurality: 2, dps: null, flammability: -1, urgency: null },
    "Detective Agency": { areas: 2, responseTime: 60, rurality: 2, dps: "1.2/s", flammability: 3, urgency: 5 },
    "Diner": { areas: 2, responseTime: 240, rurality: 4, dps: "1.2/s", flammability: 3, urgency: 1 },
    "Drugs Lab": { areas: 2, responseTime: 120, rurality: 3, dps: "1.6/s", flammability: 4, urgency: 2 },
    "Flower Shop": { areas: 2, responseTime: 60, rurality: 2, dps: "1.2/s", flammability: 3, urgency: 5 },
    "Funeral Parlor": { areas: 2, responseTime: 120, rurality: 3, dps: "1.6/s", flammability: 4, urgency: 2 },
    "Game Shop": { areas: 2, responseTime: 60, rurality: 2, dps: "0.8/s", flammability: 2, urgency: 6 },
    "Gas Station": { areas: 2, responseTime: 60, rurality: 2, dps: "2/s", flammability: 5, urgency: 3 },
    "Hair Salon": { areas: 2, responseTime: 60, rurality: 2, dps: "0.8/s", flammability: 2, urgency: 6 },
    "Hardware Store": { areas: 2, responseTime: 120, rurality: 3, dps: "1.6/s", flammability: 4, urgency: 2 },
    "Homeless Camp": { areas: 2, responseTime: 60, rurality: 2, dps: "1.6/s", flammability: 4, urgency: 4 },
    "Jewelry Store": { areas: 2, responseTime: 60, rurality: 2, dps: "1.2/s", flammability: 3, urgency: 5 },
    "Lingerie Store": { areas: 2, responseTime: 60, rurality: 2, dps: "1.2/s", flammability: 3, urgency: 5 },
    "Liquor Store": { areas: 2, responseTime: 60, rurality: 2, dps: "1.6/s", flammability: 4, urgency: 4 },
    "Loanshark Office": { areas: 2, responseTime: 60, rurality: 2, dps: "1.2/s", flammability: 3, urgency: 5 },
    "Mechanic Shop": { areas: 2, responseTime: 120, rurality: 3, dps: "1.6/s", flammability: 4, urgency: 2 },
    "Music Store": { areas: 2, responseTime: 60, rurality: 2, dps: "1.2/s", flammability: 3, urgency: 5 },
    "Pharmacy": { areas: 2, responseTime: 60, rurality: 2, dps: "1.2/s", flammability: 3, urgency: 5 },
    "Police Safehouse": { areas: 2, responseTime: 60, rurality: 2, dps: "1.2/s", flammability: 3, urgency: 5 },
    "Printing Store": { areas: 2, responseTime: 60, rurality: 2, dps: "2/s", flammability: 5, urgency: 3 },
    "Suburban Home": { areas: 2, responseTime: 120, rurality: 3, dps: "1.2/s", flammability: 3, urgency: 2 },
    "Tattoo Parlor": { areas: 2, responseTime: 60, rurality: 2, dps: "1.6/s", flammability: 4, urgency: 4 },
    "Toy Shop": { areas: 2, responseTime: 60, rurality: 2, dps: "1.6/s", flammability: 4, urgency: 4 },
    "Travel Agent": { areas: 2, responseTime: 30, rurality: 1, dps: "1.2/s", flammability: 3, urgency: 5 },
    "Art Gallery": { areas: 3, responseTime: 60, rurality: 2, dps: "1.6/s", flammability: 4, urgency: 4 },
    "Bank": { areas: 3, responseTime: 30, rurality: 1, dps: "0.8/s", flammability: 2, urgency: 6 },
    "Barn": { areas: 3, responseTime: 0, rurality: -1, dps: null, flammability: -1, urgency: null },
    "Bowling Alley": { areas: 3, responseTime: 30, rurality: 1, dps: "1.6/s", flammability: 4, urgency: 5 },
    "Car Showroom": { areas: 3, responseTime: 60, rurality: 2, dps: "1.6/s", flammability: 4, urgency: 4 },
    "Car Wash": { areas: 3, responseTime: 120, rurality: 3, dps: "0.8/s", flammability: 2, urgency: 4 },
    "Cinema": { areas: 3, responseTime: 30, rurality: 1, dps: "2/s", flammability: 5, urgency: 5 },
    "Distillery": { areas: 3, responseTime: 240, rurality: 4, dps: "2/s", flammability: 5, urgency: 1 },
    "Farmhouse": { areas: 3, responseTime: 480, rurality: 5, dps: "1.6/s", flammability: 4, urgency: 1 },
    "Fire Station": { areas: 3, responseTime: 60, rurality: 2, dps: "0.4/s", flammability: 1, urgency: 6 },
    "Furniture Store": { areas: 3, responseTime: 120, rurality: 3, dps: "2/s", flammability: 5, urgency: 1 },
    "Grocery Store": { areas: 3, responseTime: 60, rurality: 2, dps: "1.2/s", flammability: 3, urgency: 5 },
    "Gym": { areas: 3, responseTime: 30, rurality: 1, dps: "0.8/s", flammability: 2, urgency: 6 },
    "Laboratory": { areas: 3, responseTime: 480, rurality: 5, dps: "1.2/s", flammability: 3, urgency: 1 },
    "Lakehouse": { areas: 3, responseTime: 240, rurality: 4, dps: "1.2/s", flammability: 3, urgency: 1 },
    "Law Firm": { areas: 3, responseTime: 60, rurality: 2, dps: "1.2/s", flammability: 3, urgency: 5 },
    "Library": { areas: 3, responseTime: 120, rurality: 3, dps: "2/s", flammability: 5, urgency: 1 },
    "Medical Center": { areas: 3, responseTime: 60, rurality: 2, dps: "1.2/s", flammability: 3, urgency: 5 },
    "Motorcycle Club": { areas: 3, responseTime: 240, rurality: 4, dps: "1.6/s", flammability: 4, urgency: 1 },
    "Newspaper Office": { areas: 3, responseTime: 30, rurality: 1, dps: "1.6/s", flammability: 4, urgency: 5 },
    "Nightclub": { areas: 3, responseTime: 30, rurality: 1, dps: "1.6/s", flammability: 4, urgency: 5 },
    "Office Block": { areas: 3, responseTime: 30, rurality: 1, dps: "1.2/s", flammability: 3, urgency: 5 },
    "Penthouse": { areas: 3, responseTime: 30, rurality: 1, dps: "1.2/s", flammability: 3, urgency: 5 },
    "Pest Control Hub": { areas: 3, responseTime: 60, rurality: 2, dps: "1.6/s", flammability: 4, urgency: 4 },
    "Police Station": { areas: 3, responseTime: 30, rurality: 1, dps: "1.2/s", flammability: 3, urgency: 5 },
    "Private Security": { areas: 3, responseTime: 60, rurality: 2, dps: "0.8/s", flammability: 2, urgency: 6 },
    "Pub": { areas: 3, responseTime: 60, rurality: 2, dps: "1.6/s", flammability: 4, urgency: 4 },
    "Recording Studio": { areas: 3, responseTime: 240, rurality: 4, dps: "1.6/s", flammability: 4, urgency: 1 },
    "Restaurant": { areas: 3, responseTime: 30, rurality: 1, dps: "1.6/s", flammability: 4, urgency: 5 },
    "Strip Club": { areas: 3, responseTime: 30, rurality: 1, dps: "1.2/s", flammability: 3, urgency: 5 },
    "Subway": { areas: 3, responseTime: 60, rurality: 2, dps: "1.2/s", flammability: 3, urgency: 5 },
    "Townhouse": { areas: 3, responseTime: 60, rurality: 2, dps: "1.2/s", flammability: 3, urgency: 5 },
    "Ad Agency": { areas: 4, responseTime: 30, rurality: 1, dps: "1.2/s", flammability: 3, urgency: 5 },
    "Arms Warehouse": { areas: 4, responseTime: 240, rurality: 4, dps: "2/s", flammability: 5, urgency: 1 },
    "Bus Terminal": { areas: 4, responseTime: 30, rurality: 1, dps: "0.8/s", flammability: 2, urgency: 6 },
    "Chemical Plant": { areas: 4, responseTime: 480, rurality: 5, dps: "2/s", flammability: 5, urgency: 1 },
    "Church": { areas: 4, responseTime: 120, rurality: 3, dps: "1.6/s", flammability: 4, urgency: 2 },
    "College": { areas: 4, responseTime: 60, rurality: 2, dps: "1.2/s", flammability: 3, urgency: 5 },
    "Fertilizer Plant": { areas: 4, responseTime: 480, rurality: 5, dps: "2/s", flammability: 5, urgency: 1 },
    "Hotel": { areas: 4, responseTime: 60, rurality: 2, dps: "1.6/s", flammability: 4, urgency: 4 },
    "Luxury Villa": { areas: 4, responseTime: 240, rurality: 4, dps: "1.2/s", flammability: 3, urgency: 1 },
    "Manor House": { areas: 4, responseTime: 240, rurality: 4, dps: "1.2/s", flammability: 3, urgency: 1 },
    "Paper Mill": { areas: 4, responseTime: 240, rurality: 4, dps: "2/s", flammability: 5, urgency: 1 },
    "Post Office": { areas: 4, responseTime: 60, rurality: 2, dps: "1.6/s", flammability: 4, urgency: 4 },
    "Raceway": { areas: 4, responseTime: 60, rurality: 2, dps: "2/s", flammability: 5, urgency: 3 },
    "Ranch": { areas: 4, responseTime: 480, rurality: 5, dps: "1.6/s", flammability: 4, urgency: 1 },
    "Recycling Facility": { areas: 4, responseTime: 240, rurality: 4, dps: "2/s", flammability: 5, urgency: 1 },
    "Slaughterhouse": { areas: 4, responseTime: 240, rurality: 4, dps: "0.8/s", flammability: 2, urgency: 1 },
    "Supermarket": { areas: 4, responseTime: 60, rurality: 2, dps: "1.6/s", flammability: 4, urgency: 4 },
    "Theater": { areas: 4, responseTime: 60, rurality: 2, dps: "2/s", flammability: 5, urgency: 3 },
    "Warehouse": { areas: 4, responseTime: 240, rurality: 4, dps: "1.6/s", flammability: 4, urgency: 1 },
    "Aircraft Hangar": { areas: 5, responseTime: 480, rurality: 5, dps: "2/s", flammability: 5, urgency: 1 },
    "Casino": { areas: 5, responseTime: 30, rurality: 1, dps: "1.6/s", flammability: 4, urgency: 5 },
    "Castle": { areas: 5, responseTime: 480, rurality: 5, dps: "0.8/s", flammability: 2, urgency: 1 },
    "Cruise Line": { areas: 5, responseTime: 30, rurality: 1, dps: "1.6/s", flammability: 4, urgency: 5 },
    "Data Center": { areas: 5, responseTime: 480, rurality: 5, dps: "0.4/s", flammability: 1, urgency: 1 },
    "Electrical Substation": { areas: 5, responseTime: 240, rurality: 4, dps: "0.4/s", flammability: 1, urgency: 4 },
    "Factory": { areas: 5, responseTime: 240, rurality: 4, dps: "1.6/s", flammability: 4, urgency: 1 },
    "Foundry": { areas: 5, responseTime: 240, rurality: 4, dps: "0.8/s", flammability: 2, urgency: 1 },
    "Hospital": { areas: 5, responseTime: 30, rurality: 1, dps: "1.2/s", flammability: 3, urgency: 5 },
    "Palace": { areas: 5, responseTime: 480, rurality: 5, dps: "1.2/s", flammability: 3, urgency: 1 },
    "Shopping Mall": { areas: 5, responseTime: 30, rurality: 1, dps: "1.6/s", flammability: 4, urgency: 5 },
    "Sports Arena": { areas: 5, responseTime: 30, rurality: 1, dps: "1.6/s", flammability: 4, urgency: 5 },
    "TV Studio": { areas: 5, responseTime: 60, rurality: 2, dps: "1.2/s", flammability: 3, urgency: 5 },
    "Waste Facility": { areas: 5, responseTime: 480, rurality: 5, dps: "2/s", flammability: 5, urgency: 1 }
  };
  function formatResponseTime(seconds) {
    if (seconds <= 0) return "n/a";
    if (seconds < 60) return `${seconds}s`;
    const minutes = seconds / 60;
    return `${minutes % 1 === 0 ? minutes : minutes.toFixed(1)}m`;
  }

  // src/data/arson-information.ts
  var ACCELERANT_INFO = {
    [RESOURCE.GASOLINE]: {
      intensity: 1.5,
      momentum: 6,
      suspicion: 9,
      ignitionRisk: 1,
      stokingRisk: 7,
      advice: "Cheap but risky when stoking. High suspicion and high stoking risk."
    },
    [RESOURCE.DIESEL]: {
      intensity: 2,
      momentum: 5,
      suspicion: 7,
      ignitionRisk: 0,
      stokingRisk: 1,
      advice: "Lowers crit-rate on ignition, increases visibility. Best combined with solids."
    },
    [RESOURCE.KEROSENE]: {
      intensity: 2,
      momentum: 10,
      suspicion: 3,
      ignitionRisk: 1,
      stokingRisk: 3,
      advice: "Great as starter, insurance jobs, and small fires. Increases momentum in single area."
    },
    [RESOURCE.POTASSIUM_NITRATE]: {
      intensity: 10,
      momentum: 6,
      suspicion: 3,
      ignitionRisk: 3,
      stokingRisk: 1,
      advice: "Best for stoking, excellent for <3 zone targets. Increases intensity by 25% of current intensity in single area."
    },
    [RESOURCE.MAGNESIUM]: {
      intensity: 8,
      momentum: 6,
      suspicion: 10,
      ignitionRisk: 3,
      stokingRisk: 4,
      advice: "Best as starter, useful when low rurality. Halves dampening effectiveness and intensity decay from firefighters. Increases visibility."
    },
    [RESOURCE.THERMITE]: {
      intensity: 7,
      momentum: 4,
      suspicion: 7,
      ignitionRisk: 3,
      stokingRisk: 7,
      advice: "Best as starter for total destruction. Multiplies damage rate for each use."
    },
    [RESOURCE.OXYGEN]: {
      intensity: 6,
      momentum: 2,
      suspicion: 1,
      ignitionRisk: 2,
      stokingRisk: 1,
      advice: "Terrible starter, excellent for stoking 4-5 zone targets. Increases intensity by 25% of current in all areas."
    },
    [RESOURCE.METHANE]: {
      intensity: 4,
      momentum: 1,
      suspicion: -3,
      ignitionRisk: 2,
      stokingRisk: 3,
      advice: "Excellent spread for large targets. Lowers accumulated suspicion."
    },
    [RESOURCE.HYDROGEN]: {
      intensity: 4,
      momentum: 1,
      suspicion: 1,
      ignitionRisk: 2,
      stokingRisk: 3,
      advice: "Best used for 3-5 zone targets, and when paired with one solid & one liquid. Averages intensity and momentum across all areas."
    }
  };
  var IGNITER_INFO = {
    [RESOURCE.LIGHTER]: {
      suspicion: 1,
      advice: "Great for fine-tuning and low suspicion jobs. Provides very small increase in intensity (+2.5%) and momentum. Crit rate depends on accelerants used."
    },
    [RESOURCE.MOLOTOV]: {
      suspicion: 6,
      advice: "Great for spreading fires. Moderately high intensity (+17.5%) and momentum to area with lowest intensity based on the main zone momentum. Fixed crit rate."
    },
    [RESOURCE.FLAMETHROWER]: {
      suspicion: 8,
      advice: "High intensity/momentum randomly across areas with high visibility."
    }
  };

  // src/userscripts/arsonists-ledger/material-badges.ts
  var SCALE_MAX = 10;
  var SEGMENT_COUNT = 10;
  var STAT_DESCRIPTIONS = {
    Intensity: "How fiercely the fire burns in the main area. Drives the destruction rate, but pushes dispatch speed and crit-failure risk up when stoking or dampening a hot fire.",
    Momentum: "Unburned fuel pooling on the property. Feeds future intensity gain, but stoking while momentum is already high risks a severe accident.",
    Suspicion: "How obvious this arson material is. Most accelerants raise it, only Methane actively lowers it. Matters most for Insurance Claim and Accidental Cause jobs.",
    "Ignition Risk": "Likelihood of a critical failure when this material is used to start the fire.",
    "Stoking Risk": "Likelihood of a critical failure or accident when this material is used to stoke an already-burning fire."
  };
  var ACCELERANT_BARS = (info) => [
    {
      key: "intensity",
      label: "INT",
      fullLabel: "Intensity",
      value: info.intensity,
      direction: "good"
    },
    {
      key: "momentum",
      label: "MOM",
      fullLabel: "Momentum",
      value: info.momentum,
      direction: "good"
    },
    {
      key: "suspicion",
      label: "SUS",
      fullLabel: "Suspicion",
      value: info.suspicion,
      direction: "bad"
    },
    {
      key: "ignitionRisk",
      label: "IGN",
      fullLabel: "Ignition Risk",
      value: info.ignitionRisk,
      direction: "bad"
    },
    {
      key: "stokingRisk",
      label: "STK",
      fullLabel: "Stoking Risk",
      value: info.stokingRisk,
      direction: "bad"
    }
  ];
  var IGNITER_BARS = (info) => [
    {
      key: "suspicion",
      label: "SUS",
      fullLabel: "Suspicion",
      value: info.suspicion,
      direction: "bad"
    }
  ];
  var tornIdIndex = null;
  function getTornIdIndex() {
    if (tornIdIndex) return tornIdIndex;
    tornIdIndex = /* @__PURE__ */ new Map();
    for (const resource of Object.values(CATALOG)) {
      if (resource.tornId !== void 0) {
        tornIdIndex.set(resource.tornId, resource.id);
      }
    }
    return tornIdIndex;
  }
  function resourceIdFromImage(img) {
    const match = /\/images\/items\/(\d+)\//.exec(img.src || img.srcset || "");
    if (!match) return null;
    const tornId = Number(match[1]);
    return getTornIdIndex().get(tornId) ?? null;
  }
  function blendSeverity(hex, t) {
    const clamped = Math.min(1, Math.max(0, t));
    const full = hex.length === 4 ? hex.slice(1).split("").map((c) => c + c).join("") : hex.slice(1);
    const r = parseInt(full.slice(0, 2), 16);
    const g = parseInt(full.slice(2, 4), 16);
    const b = parseInt(full.slice(4, 6), 16);
    const neutral = 170;
    const mix = (channel) => Math.round(neutral + (channel - neutral) * clamped);
    return `rgb(${mix(r)}, ${mix(g)}, ${mix(b)})`;
  }
  var openTooltipTarget = null;
  var documentTapCloseBound = false;
  function bindTapToggle(target, buildContent, tooltip) {
    if (!documentTapCloseBound) {
      documentTapCloseBound = true;
      document.addEventListener(
        "click",
        (e) => {
          if (openTooltipTarget && !openTooltipTarget.contains(e.target)) {
            tooltip.hide();
            openTooltipTarget = null;
          }
        },
        { passive: true }
      );
    }
    target.addEventListener("click", (e) => {
      e.stopPropagation();
      if (openTooltipTarget === target) {
        tooltip.hide();
        openTooltipTarget = null;
        return;
      }
      tooltip.show(target, buildContent(), { position: "top" });
      openTooltipTarget = target;
    });
  }
  function buildBarRow(bar, tooltip) {
    const fraction = Math.min(1, Math.max(0, bar.value) / SCALE_MAX);
    const filledCount = Math.round(fraction * SEGMENT_COUNT);
    const color = bar.direction === "good" ? BAND_COLOR.good : BAND_COLOR.negative;
    const row2 = el("div", "pyro-mat-bar");
    const label = el("span", "pyro-mat-bar-label");
    label.textContent = bar.label;
    row2.appendChild(label);
    const track = buildSegmentTrack(
      "pyro-mat-bar-track",
      "pyro-mat-bar-seg",
      SEGMENT_COUNT,
      filledCount,
      color
    );
    row2.appendChild(track);
    const value = el("span", "pyro-mat-bar-value");
    value.textContent = String(bar.value);
    value.style.color = blendSeverity(color, fraction);
    row2.appendChild(value);
    const buildContent = () => buildStatTooltipGroup([
      {
        title: bar.fullLabel,
        description: STAT_DESCRIPTIONS[bar.fullLabel] ?? "",
        value: String(bar.value)
      }
    ]);
    row2.addEventListener("mouseenter", () => {
      tooltip.show(row2, buildContent(), { position: "top" });
    });
    row2.addEventListener("mouseleave", () => {
      tooltip.hide();
    });
    bindTapToggle(row2, buildContent, tooltip);
    return row2;
  }
  function bindMaterialTooltip(wrap, name, advice, tooltip) {
    wrap.addEventListener("mouseenter", () => {
      const content = buildStatTooltipGroup([
        { title: name, description: advice }
      ]);
      tooltip.show(wrap, content, { position: "top" });
    });
    wrap.addEventListener("mouseleave", () => {
      tooltip.hide();
    });
  }
  function buildBarStrip(bars, tooltip) {
    const strip = el("div", "pyro-mat-badges");
    for (const bar of bars) {
      strip.appendChild(buildBarRow(bar, tooltip));
    }
    return strip;
  }
  function scanMaterialPopover(tooltip, config) {
    document.querySelectorAll(SEL.ITEM_SELECTOR).forEach((popover) => {
      popover.querySelectorAll(SEL.ITEM_CELL_WRAP).forEach((wrap) => {
        if (wrap.dataset.pyroBadged) return;
        const img = wrap.querySelector(SEL.ITEM_IMAGE);
        if (!img) return;
        const resourceId = resourceIdFromImage(img);
        if (!resourceId) return;
        const accelerant = ACCELERANT_INFO[resourceId];
        const igniter = IGNITER_INFO[resourceId];
        if (!accelerant && !igniter) {
          wrap.dataset.pyroBadged = "true";
          return;
        }
        if (!config.enabled) {
          wrap.dataset.pyroBadged = "true";
          return;
        }
        const info = accelerant ?? igniter;
        const name = CATALOG[resourceId]?.name ?? resourceId;
        bindMaterialTooltip(wrap, name, info.advice, tooltip);
        const bars = (accelerant ? ACCELERANT_BARS(accelerant) : IGNITER_BARS(igniter)).filter((bar) => config[bar.key]);
        if (bars.length > 0) {
          wrap.after(buildBarStrip(bars, tooltip));
        }
        wrap.dataset.pyroBadged = "true";
      });
    });
  }
  function resetMaterialBadges() {
    document.querySelectorAll(SEL.ITEM_SELECTOR).forEach((popover) => {
      popover.querySelectorAll(SEL.ITEM_CELL_WRAP).forEach((wrap) => {
        delete wrap.dataset.pyroBadged;
        const strip = wrap.nextElementSibling;
        if (strip?.classList.contains("pyro-mat-badges")) strip.remove();
      });
    });
  }
  function injectMaterialBadgeStyles() {
    injectStyleOnce("pyro-mat-badge-styles", `
        .pyro-mat-badges {
            display: flex;
            flex-direction: column;
            gap: 1px;
            padding: 0 10px;
            align-self: stretch;
        }
        .pyro-mat-bar {
            display: grid;
            align-items: center;
            grid-template-columns: 1fr auto;
        }
        .pyro-mat-bar-label {
            font-size: 9px;
            letter-spacing: 0.05em;
            line-height: 1;
            color: var(--crimes-baseText-color, #666);
            font-family: monospace;
        }
        .pyro-mat-bar-track {
            display: flex;
            gap: 1px;
            height: 3px;
            flex: 1;
        }
        .pyro-mat-bar-seg {
            flex: 1;
            height: 100%;
            background: var(--crimes-subtleSubText-color, #999);
            border-radius: 1px;
            aspect-ratio: 1;
        }
        .pyro-mat-bar-value {
            display: none;
            font-size: 9px;
            letter-spacing: 0.05em;
            line-height: 1;
            font-family: monospace;
            font-weight: bold;
            text-align: right;
        }

        @media (max-width: 780px) {
            .pyro-mat-bar-track {
                display: none;
            }
            .pyro-mat-bar-value {
                display: block;
            }
        }
    `);
  }

  // src/userscripts/arsonists-ledger/index.ts
  var KEY_MANUAL_PRICES = "pyroLedger.v1.manualPrices";
  var KEY_API_PRICES = "pyroLedger.v1.apiPrices";
  var KEY_API_KEY = "pyroLedger.v1.apiKey";
  var KEY_API_REFRESH = "pyroLedger.v1.apiRefresh";
  var KEY_CATALOG_UPDATED = "pyroLedger.v1.catalogUpdated";
  var KEY_THRESHOLDS = "pyroLedger.v1.thresholds";
  var KEY_ACTIVE_TAB = "pyroLedger.v1.activeTab";
  var KEY_SHOW_OPTIONAL_BADGES = "pyroLedger.v1.showOptionalBadges";
  var KEY_SHOW_RESOURCE_PRICES = "pyroLedger.v1.showResourcePrices";
  var KEY_SHOW_SCENARIO_NAME = "pyroLedger.v1.showScenarioName";
  var KEY_STACK_RESOURCES = "pyroLedger.v1.stackResources";
  var KEY_PPN_BAR_POSITION = "pyroLedger.v1.ppnBarPosition";
  var KEY_PAYOUT_BASIS = "pyroLedger.v1.payoutBasis";
  var KEY_SHOW_BUILDING_STATS = "pyroLedger.v1.showBuildingStats";
  var KEY_SHOW_RESPONSE_TIME = "pyroLedger.v1.showResponseTime";
  var KEY_SHOW_FLAMMABILITY = "pyroLedger.v1.showFlammability";
  var KEY_SHOW_RURALITY = "pyroLedger.v1.showRurality";
  var KEY_SHOW_URGENCY = "pyroLedger.v1.showUrgency";
  var KEY_SHOW_MATERIAL_DATA = "pyroLedger.v1.showMaterialData";
  var KEY_SHOW_MATERIAL_INTENSITY = "pyroLedger.v1.showMaterialIntensity";
  var KEY_SHOW_MATERIAL_MOMENTUM = "pyroLedger.v1.showMaterialMomentum";
  var KEY_SHOW_MATERIAL_SUSPICION = "pyroLedger.v1.showMaterialSuspicion";
  var KEY_SHOW_MATERIAL_IGNITION_RISK = "pyroLedger.v1.showMaterialIgnitionRisk";
  var KEY_SHOW_MATERIAL_STOKING_RISK = "pyroLedger.v1.showMaterialStokingRisk";
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
        console.warn(
          "[ArsonistsLedger] BalaclavaTooltip not found \u2014 tooltips disabled."
        );
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
  var activeTab = "prices";
  var showOptionalBadges = true;
  var showResourcePrices = true;
  var showScenarioName = true;
  var stackResources = true;
  var ppnBarPosition = "right";
  var payoutBasis = "average";
  var showBuildingStats = false;
  var showResponseTime = true;
  var showFlammability = true;
  var showRurality = true;
  var showUrgency = true;
  var showMaterialData = false;
  var showMaterialIntensity = true;
  var showMaterialMomentum = true;
  var showMaterialSuspicion = true;
  var showMaterialIgnitionRisk = true;
  var showMaterialStokingRisk = true;
  var visibleMobileSection = null;
  var IOS_USER_AGENT_RE = /iPad|iPhone|iPod/i;
  function isIosDevice() {
    const platform = navigator.platform || "";
    const userAgent = navigator.userAgent || "";
    const maxTouchPoints = navigator.maxTouchPoints || 0;
    return IOS_USER_AGENT_RE.test(userAgent) || platform === "MacIntel" && maxTouchPoints > 1;
  }
  function effectivePrices() {
    return { ...apiPrices, ...manualPrices };
  }
  function loadState() {
    apiKey = store_get(KEY_API_KEY, "");
    activeTab = store_get(KEY_ACTIVE_TAB, "prices");
    apiLastRefresh = parseInt(store_get(KEY_API_REFRESH, "0"), 10) || 0;
    showOptionalBadges = store_get(KEY_SHOW_OPTIONAL_BADGES, "1") !== "0";
    showResourcePrices = store_get(KEY_SHOW_RESOURCE_PRICES, "1") !== "0";
    showScenarioName = store_get(KEY_SHOW_SCENARIO_NAME, "1") !== "0";
    stackResources = store_get(KEY_STACK_RESOURCES, "1") !== "0";
    ppnBarPosition = store_get(KEY_PPN_BAR_POSITION, "right") === "left" ? "left" : "right";
    payoutBasis = store_get(KEY_PAYOUT_BASIS, "average") === "max" ? "max" : "average";
    showBuildingStats = store_get(KEY_SHOW_BUILDING_STATS, "0") !== "0";
    showResponseTime = store_get(KEY_SHOW_RESPONSE_TIME, "1") !== "0";
    showFlammability = store_get(KEY_SHOW_FLAMMABILITY, "1") !== "0";
    showRurality = store_get(KEY_SHOW_RURALITY, "1") !== "0";
    showUrgency = store_get(KEY_SHOW_URGENCY, "1") !== "0";
    showMaterialData = store_get(KEY_SHOW_MATERIAL_DATA, "0") !== "0";
    showMaterialIntensity = store_get(KEY_SHOW_MATERIAL_INTENSITY, "1") !== "0";
    showMaterialMomentum = store_get(KEY_SHOW_MATERIAL_MOMENTUM, "1") !== "0";
    showMaterialSuspicion = store_get(KEY_SHOW_MATERIAL_SUSPICION, "1") !== "0";
    showMaterialIgnitionRisk = store_get(KEY_SHOW_MATERIAL_IGNITION_RISK, "1") !== "0";
    showMaterialStokingRisk = store_get(KEY_SHOW_MATERIAL_STOKING_RISK, "1") !== "0";
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
      const saved = JSON.parse(
        store_get(KEY_THRESHOLDS, "{}")
      );
      if (typeof saved.low === "number" && typeof saved.good === "number") {
        thresholds = { low: saved.low, good: saved.good };
      }
    } catch {
    }
    syncStoredPricesToCatalog();
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
  function setShowOptionalBadgesEnabled(show) {
    showOptionalBadges = show;
    store_set(KEY_SHOW_OPTIONAL_BADGES, show ? "1" : "0");
    resetScans();
  }
  function setShowResourcePricesEnabled(show) {
    showResourcePrices = show;
    store_set(KEY_SHOW_RESOURCE_PRICES, show ? "1" : "0");
    resetScans();
  }
  function setShowScenarioNameEnabled(show) {
    showScenarioName = show;
    store_set(KEY_SHOW_SCENARIO_NAME, show ? "1" : "0");
    resetScans();
  }
  function setStackResourcesEnabled(stack) {
    stackResources = stack;
    store_set(KEY_STACK_RESOURCES, stack ? "1" : "0");
    resetScans();
  }
  function applyPpnBarPosition() {
    document.documentElement.setAttribute(
      "data-pyro-bar-position",
      ppnBarPosition
    );
  }
  function setPpnBarPosition(position) {
    ppnBarPosition = position;
    store_set(KEY_PPN_BAR_POSITION, position);
    applyPpnBarPosition();
  }
  function setPayoutBasis(basis) {
    payoutBasis = basis;
    store_set(KEY_PAYOUT_BASIS, basis);
    resetScans();
  }
  function setShowBuildingStatsEnabled(show) {
    showBuildingStats = show;
    store_set(KEY_SHOW_BUILDING_STATS, show ? "1" : "0");
    resetScans();
  }
  function setShowResponseTimeEnabled(show) {
    showResponseTime = show;
    store_set(KEY_SHOW_RESPONSE_TIME, show ? "1" : "0");
    resetScans();
  }
  function setShowFlammabilityEnabled(show) {
    showFlammability = show;
    store_set(KEY_SHOW_FLAMMABILITY, show ? "1" : "0");
    resetScans();
  }
  function setShowRuralityEnabled(show) {
    showRurality = show;
    store_set(KEY_SHOW_RURALITY, show ? "1" : "0");
    resetScans();
  }
  function setShowUrgencyEnabled(show) {
    showUrgency = show;
    store_set(KEY_SHOW_URGENCY, show ? "1" : "0");
    resetScans();
  }
  function materialBadgeConfig() {
    return {
      enabled: showMaterialData,
      intensity: showMaterialIntensity,
      momentum: showMaterialMomentum,
      suspicion: showMaterialSuspicion,
      ignitionRisk: showMaterialIgnitionRisk,
      stokingRisk: showMaterialStokingRisk
    };
  }
  function resetMaterialScans() {
    resetMaterialBadges();
    scanMaterialPopover(materialBadgeTooltipCtx, materialBadgeConfig());
  }
  function setShowMaterialDataEnabled(show) {
    showMaterialData = show;
    store_set(KEY_SHOW_MATERIAL_DATA, show ? "1" : "0");
    resetMaterialScans();
  }
  function setShowMaterialIntensityEnabled(show) {
    showMaterialIntensity = show;
    store_set(KEY_SHOW_MATERIAL_INTENSITY, show ? "1" : "0");
    resetMaterialScans();
  }
  function setShowMaterialMomentumEnabled(show) {
    showMaterialMomentum = show;
    store_set(KEY_SHOW_MATERIAL_MOMENTUM, show ? "1" : "0");
    resetMaterialScans();
  }
  function setShowMaterialSuspicionEnabled(show) {
    showMaterialSuspicion = show;
    store_set(KEY_SHOW_MATERIAL_SUSPICION, show ? "1" : "0");
    resetMaterialScans();
  }
  function setShowMaterialIgnitionRiskEnabled(show) {
    showMaterialIgnitionRisk = show;
    store_set(KEY_SHOW_MATERIAL_IGNITION_RISK, show ? "1" : "0");
    resetMaterialScans();
  }
  function setShowMaterialStokingRiskEnabled(show) {
    showMaterialStokingRisk = show;
    store_set(KEY_SHOW_MATERIAL_STOKING_RISK, show ? "1" : "0");
    resetMaterialScans();
  }
  function setApiPrices(prices, timestamp) {
    apiPrices = prices;
    apiLastRefresh = timestamp;
    store_set(KEY_API_PRICES, JSON.stringify(apiPrices));
    store_set(KEY_API_REFRESH, String(apiLastRefresh));
    store_set(KEY_CATALOG_UPDATED, CATALOG_UPDATED);
    resetScans();
  }
  function clearApiPrices() {
    setApiPrices({}, 0);
  }
  function setApiKey(key) {
    apiKey = key;
    store_set(KEY_API_KEY, apiKey);
  }
  function setActiveTab(tab) {
    activeTab = tab;
    store_set(KEY_ACTIVE_TAB, activeTab);
  }
  function clearManualPrices() {
    manualPrices = {};
    store_set(KEY_MANUAL_PRICES, JSON.stringify(manualPrices));
    resetScans();
  }
  function catalogUpdatedTimestamp() {
    return Date.parse(`${CATALOG_UPDATED}T00:00:00Z`);
  }
  function syncStoredPricesToCatalog() {
    const storedCatalogUpdated = store_get(KEY_CATALOG_UPDATED, "");
    if (storedCatalogUpdated === CATALOG_UPDATED) return;
    if (Object.keys(apiPrices).length > 0 && apiLastRefresh < catalogUpdatedTimestamp()) {
      apiPrices = {};
      apiLastRefresh = 0;
      store_set(KEY_API_PRICES, JSON.stringify(apiPrices));
      store_set(KEY_API_REFRESH, "0");
    }
    store_set(KEY_CATALOG_UPDATED, CATALOG_UPDATED);
  }
  var KEY_SCENARIOS_CACHE = `pyroLedger.${SCENARIOS_VERSION}.scenariosCache`;
  var KEY_SCENARIOS_TS = `pyroLedger.${SCENARIOS_VERSION}.scenariosTs`;
  var SCENARIOS_URL = "https://balaclava.app/arsonists-ledger/scenarios.json";
  var SCENARIOS_TTL_MS = 24 * 60 * 60 * 1e3;
  var scenarioIndex = /* @__PURE__ */ new Map();
  function populateScenarioIndex(scenarios) {
    scenarioIndex.clear();
    for (const s of scenarios) {
      const key = s.scenarioName.toLowerCase();
      if (!scenarioIndex.has(key)) scenarioIndex.set(key, s);
    }
  }
  function scheduleScenarioRefresh() {
    if (typeof GM_xmlhttpRequest === "undefined") return;
    const ts = parseInt(store_get(KEY_SCENARIOS_TS, "0"), 10) || 0;
    const now = Date.now();
    if (now - ts < SCENARIOS_TTL_MS) {
      try {
        const cached = JSON.parse(
          store_get(KEY_SCENARIOS_CACHE, "")
        );
        if (Array.isArray(cached) && cached.length > 0) {
          populateScenarioIndex(cached);
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
          populateScenarioIndex(fresh);
          resetScans();
        } catch {
        }
      },
      onerror() {
      }
    });
  }
  function injectHighlightStyles() {
    injectStyleOnce(
      "pyro-highlight-styles",
      `
        .pyro-label { display: none; }

        :root { --pyro-bar-x: -5px; }
        :root[data-pyro-bar-position="left"] { --pyro-bar-x: 5px; }

        .arson-root ${SEL.CARD} { position: relative; }
        .arson-root ${SEL.CARD}::after {
            content: "";
            position: absolute;
            inset: 0;
            pointer-events: none;
        }
        .arson-root .pyro-band--negative::after { box-shadow: inset var(--pyro-bar-x) 0 0 ${BAND_COLOR.negative} !important; }
        .arson-root .pyro-band--low::after      { box-shadow: inset var(--pyro-bar-x) 0 0 ${BAND_COLOR.low}      !important; }
        .arson-root .pyro-band--good::after     { box-shadow: inset var(--pyro-bar-x) 0 0 ${BAND_COLOR.good}     !important; }
        .arson-root .pyro-band--excellent::after { box-shadow: inset var(--pyro-bar-x) 0 0 ${BAND_COLOR.excellent} !important; }
        .arson-root .pyro-band--unknown::after  { box-shadow: inset var(--pyro-bar-x) 0 0 ${BAND_COLOR.unknown}  !important; }

        ${SEL.FIRE_METER},
        .crime-image,
        ${SEL.BUILDING_RESPONDER_ICONS} { position: relative !important; }
        .pyro-value-pill {
            position: absolute;
            top: 3px;
            right: 3px;
            padding: 2px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            background: var(--crimes-crimeOption-bgColor, #222);
            border: 1px solid var(--crimes-outcomeDivider-color, #444);
            border-radius: 3px;
            color: var(--crimes-subText-color, #eee);
            font-size: 10px;
            letter-spacing: 0.04em;
            line-height: 1;
            pointer-events: none;
            user-select: none;
            white-space: nowrap;
            z-index: 10;
        }
        .pyro-building-badges {
            position: absolute;
            inset: 0;
            display: flex;
            flex-wrap: wrap;
            align-items: flex-start;
            align-content: flex-start;
            gap: 2px;
            pointer-events: none;
            user-select: none;
            z-index: 10;
            padding: 2px;
        }
        .pyro-building-badge {
            display: inline-flex;
            align-items: center;
            gap: 2px;
            padding: 1px 3px;
            background: var(--crimes-crimeOption-bgColor, #222);
            border: 1px solid var(--crimes-outcomeDivider-color, #444);
            border-radius: 3px;
            color: var(--crimes-subText-color, #eee);
            font-size: 10px;
            letter-spacing: 0.02em;
            line-height: 1;
            white-space: nowrap;
            pointer-events: auto;
        }
        .pyro-building-badge svg {
            width: 12px;
            height: 12px;
            flex-shrink: 0;
        }
        .pyro-mobile-stat-badge {
            display: block;
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            padding: 0;
            margin: 0;
            border: 0;
            border-radius: 0;
            background: transparent;
            box-shadow: none;
            appearance: none;
            -webkit-appearance: none;
            cursor: pointer;
        }
        .pyro-mobile-stat-badge-icon {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 14px;
            height: 14px;
            border: 1px solid var(--crimes-outcomeDivider-color, #444);
            border-radius: 50%;
            background: var(--crimes-crimeOption-bgColor, #222);
            position: absolute;
            right: -3px;
            top: -5px;
            pointer-events: none;
        }
        @media screen and (max-width: 386px) {
          .pyro-mobile-stat-badge-icon {
            right: 1px;
          }
        }
        .pyro-mobile-stat-badge-icon svg {
            width: 14px;
            height: 14px;
            padding: 0;
            box-sizing: border-box;
            border-radius: 50%;
            color: #ff8a3d;
        }
    `
    );
  }
  function getPillText(ranked) {
    if (!ranked) return "?";
    switch (ranked.band) {
      case "excellent":
        return "$$$";
      case "good":
        return "$$";
      case "low":
        return "$";
      case "negative":
        return "-";
      default:
        return "?";
    }
  }
  function ensureValuePill(target, ranked) {
    let pill = target.querySelector(".pyro-value-pill");
    if (!pill) {
      pill = el("span", "pyro-value-pill");
      pill.setAttribute("aria-hidden", "true");
      target.appendChild(pill);
    }
    pill.textContent = getPillText(ranked);
  }
  function buildingBadgeRow(icon, value, tooltipContent) {
    const row2 = el("span", "pyro-building-badge");
    row2.innerHTML = icon;
    row2.appendChild(txt(value));
    row2.addEventListener("mouseenter", () => {
      tryTooltip((api) => api.show(row2, tooltipContent, { position: "top" }));
    });
    row2.addEventListener("mouseleave", () => {
      tryTooltip((api) => api.hide());
    });
    return row2;
  }
  function collectBuildingStats(building) {
    const stats = [];
    if (!showBuildingStats) return stats;
    if (showResponseTime && building.responseTime > 0) {
      const value = formatResponseTime(building.responseTime);
      stats.push({
        icon: ICON_TIMER,
        value,
        entry: {
          title: "Response Time",
          description: "How long firefighters take to arrive once dispatched.",
          value
        }
      });
    }
    if (showFlammability && building.flammability >= 0) {
      const value = String(building.flammability);
      stats.push({
        icon: ICON_FLAMABILITY,
        value,
        entry: {
          title: "Flammability",
          description: "How fast the fire's intensity scales, and its max destruction speed.",
          value,
          bar: {
            value: building.flammability,
            min: 1,
            max: 5,
            lowLabel: "Fire-resistant",
            highLabel: "Highly flammable",
            invert: true
          }
        }
      });
    }
    if (showRurality && building.rurality >= 0) {
      const value = String(building.rurality);
      stats.push({
        icon: ICON_PIN,
        value,
        entry: {
          title: "Rurality",
          description: "How isolated the location is \u2014 drives dispatch delay and response time.",
          value,
          bar: {
            value: building.rurality,
            min: 1,
            max: 5,
            lowLabel: "Urban",
            highLabel: "Remote",
            invert: true
          }
        }
      });
    }
    if (showUrgency && building.urgency !== null) {
      const value = String(building.urgency);
      stats.push({
        icon: ICON_SIREN,
        value,
        entry: {
          title: "Urgency",
          description: "How fast the danger alert escalates through response tiers.",
          value,
          bar: {
            value: building.urgency,
            min: 1,
            max: 6,
            lowLabel: "Gradual",
            highLabel: "Rapid"
          }
        }
      });
    }
    return stats;
  }
  function ensureBuildingBadges(target, building) {
    let wrap = target.querySelector(".pyro-building-badges");
    const stats = building ? collectBuildingStats(building) : [];
    if (stats.length === 0) {
      wrap?.remove();
      return;
    }
    if (!wrap) {
      wrap = el("div", "pyro-building-badges");
      wrap.setAttribute("aria-hidden", "true");
      target.appendChild(wrap);
    }
    wrap.innerHTML = "";
    for (const stat of stats) {
      wrap.appendChild(
        buildingBadgeRow(
          stat.icon,
          stat.value,
          buildStatTooltip(
            stat.entry.title,
            stat.entry.description,
            stat.entry.bar
          )
        )
      );
    }
  }
  var visibleMobileStatsBadge = null;
  var mobileStatsState = /* @__PURE__ */ new WeakMap();
  function ensureMobileStatsBadge(section, building) {
    const iconsRow = section.querySelector(
      SEL.BUILDING_RESPONDER_ICONS
    );
    let badge = iconsRow?.querySelector(".pyro-mobile-stat-badge");
    const stats = building ? collectBuildingStats(building) : [];
    if (!iconsRow || stats.length === 0) {
      badge?.remove();
      return;
    }
    const entries = stats.map((s) => s.entry);
    const existing = badge ? mobileStatsState.get(badge) : void 0;
    if (existing) {
      existing.entries = entries;
    } else {
      const state = { entries };
      badge = el("button", "pyro-mobile-stat-badge");
      badge.setAttribute("type", "button");
      badge.setAttribute("aria-label", "Building stats");
      const badgeIcon = el("span", "pyro-mobile-stat-badge-icon");
      badgeIcon.innerHTML = ICON_EMBER;
      badge.appendChild(badgeIcon);
      mobileStatsState.set(badge, state);
      iconsRow.appendChild(badge);
      const badgeEl = badge;
      badgeEl.addEventListener("click", (e) => {
        e.stopPropagation();
        tryTooltip((api) => {
          if (visibleMobileStatsBadge === badgeEl) {
            api.hide();
            visibleMobileStatsBadge = null;
          } else {
            api.show(badgeEl, buildStatTooltipGroup(state.entries), {
              position: "top"
            });
            visibleMobileStatsBadge = badgeEl;
          }
        });
      });
      document.addEventListener(
        "click",
        (e) => {
          if (visibleMobileStatsBadge === badgeEl && !badgeEl.contains(e.target)) {
            tryTooltip((api) => api.hide());
            visibleMobileStatsBadge = null;
          }
        },
        { passive: true }
      );
    }
  }
  function buildUnknownTooltip() {
    const wrap = el("div");
    const style = el("style");
    style.textContent = buildTooltipStyles();
    wrap.appendChild(style);
    const msg = el("div");
    msg.style.cssText = "padding:10px 12px;font-size:12px;color:#888;line-height:1.5;max-width:220px;";
    msg.textContent = "This scenario isn't covered by Arsonist's Ledger yet \u2014 no scenario data available.";
    wrap.appendChild(msg);
    return wrap;
  }
  function attachRecipeSubmitTrigger(wrapperEl, scenarioName) {
    if (wrapperEl.querySelector(".pyro-submit-trigger-btn")) return;
    injectPopoverStyles();
    const btn = el("button", "pyro-popover-btn pyro-submit-trigger-btn");
    btn.type = "button";
    btn.setAttribute("aria-label", "Submit a recipe for this scenario");
    btn.innerHTML = ICON_FLAME;
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      openSettingsToSubmit(scenarioName);
    });
    wrapperEl.appendChild(btn);
  }
  function applyToSection(section, ranked, building) {
    section.querySelector(".pyro-label")?.remove();
    section.classList.forEach((c) => {
      if (c.startsWith("pyro-band--")) section.classList.remove(c);
    });
    const fireMeter = section.querySelector(SEL.FIRE_METER);
    const crimeImage = section.querySelector(SEL.CRIME_IMAGE);
    const hoverTarget = fireMeter ?? crimeImage ?? section;
    const isMobileLayout = !!section.querySelector(SEL.BUILDING_RESPONDER_ICONS);
    if (crimeImage) {
      ensureBuildingBadges(crimeImage, isMobileLayout ? null : building);
    }
    ensureMobileStatsBadge(section, building);
    if (!ranked) {
      section.classList.add("pyro-band--unknown");
      if (hoverTarget !== section) ensureValuePill(hoverTarget, ranked);
      wireTooltip(section, hoverTarget, () => buildUnknownTooltip());
      return;
    }
    section.classList.add(`pyro-band--${ranked.band}`);
    if (hoverTarget !== section) ensureValuePill(hoverTarget, ranked);
    const abandonWrapper = section.querySelector(
      SEL.ABANDON_BUTTON_WRAPPER
    );
    if (abandonWrapper) {
      attachRecipeSubmitTrigger(abandonWrapper, ranked.Scenario.scenarioName);
    }
    wireTooltip(section, hoverTarget, () => {
      const statsOnly = isPendingCollect(section) && !ranked.Scenario.needsVerification;
      return buildTooltipContentWithStyles(
        ranked,
        effectivePrices(),
        statsOnly,
        showOptionalBadges,
        showResourcePrices,
        showScenarioName,
        stackResources
      );
    });
  }
  function isPendingCollect(section) {
    return section.classList.contains("pending-collect") || !!section.closest(SEL.PENDING_COLLECT);
  }
  var tooltipState = /* @__PURE__ */ new WeakMap();
  function wireTooltip(section, hoverTarget, getContent) {
    const existing = tooltipState.get(section);
    if (existing) {
      existing.getContent = getContent;
      return;
    }
    const state = { getContent };
    tooltipState.set(section, state);
    const useTapOnlyTooltip = isIosDevice();
    if (!useTapOnlyTooltip) {
      hoverTarget.addEventListener("mouseenter", () => {
        tryTooltip(
          (api) => api.show(hoverTarget, state.getContent(), { position: "top" })
        );
      });
      hoverTarget.addEventListener("mouseleave", () => {
        tryTooltip((api) => api.hide());
      });
    }
    hoverTarget.addEventListener("click", (e) => {
      if (e.target.closest(
        'button, a, input, select, textarea, [role="button"]'
      ))
        return;
      tryTooltip((api) => {
        if (visibleMobileSection === section) {
          api.hide();
          visibleMobileSection = null;
        } else {
          api.show(hoverTarget, state.getContent(), { position: "top" });
          visibleMobileSection = section;
        }
      });
    });
    document.addEventListener(
      "click",
      (e) => {
        if (visibleMobileSection === section && !section.contains(e.target)) {
          tryTooltip((api) => api.hide());
          visibleMobileSection = null;
        }
      },
      { passive: true }
    );
  }
  function buildTooltipContentWithStyles(ranked, prices, statsOnly = false, showOptionalBadges2 = true, showResourcePrices2 = true, showScenarioName2 = true, stackResources2 = true) {
    const node = buildTooltipContent(ranked, prices, statsOnly, {
      showOptionalBadges: showOptionalBadges2,
      showResourcePrices: showResourcePrices2,
      showScenarioName: showScenarioName2,
      stackResources: stackResources2
    });
    const style = el("style");
    style.textContent = buildTooltipStyles();
    node.insertBefore(style, node.firstChild);
    return node;
  }
  function getRoot() {
    return document.querySelector(SEL.ROOT) ?? document.body;
  }
  function isArsonPage() {
    return !!document.querySelector(SEL.ROOT);
  }
  function scanPage() {
    if (!isArsonPage()) return;
    const prices = effectivePrices();
    getRoot().querySelectorAll(SEL.CARD).forEach((section) => {
      if (section.dataset.pyroScanned) return;
      section.dataset.pyroScanned = "true";
      const scenarioEl = section.querySelector('[class*="scenario___"]');
      const rawName = scenarioEl?.textContent?.trim() ?? "";
      if (!rawName) return;
      const scenario = scenarioIndex.get(rawName.toLowerCase()) ?? null;
      const ranked = scenario ? rankForScenario(scenario, prices, thresholds, payoutBasis) : null;
      const buildingName = scenarioEl?.previousElementSibling?.textContent?.trim() ?? "";
      const building = BUILDINGS[buildingName] ?? null;
      applyToSection(section, ranked, building);
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
    getActiveTab: () => activeTab,
    getShowOptionalBadges: () => showOptionalBadges,
    getShowResourcePrices: () => showResourcePrices,
    getShowScenarioName: () => showScenarioName,
    getStackResources: () => stackResources,
    getPpnBarPosition: () => ppnBarPosition,
    getPayoutBasis: () => payoutBasis,
    getShowBuildingStats: () => showBuildingStats,
    getShowResponseTime: () => showResponseTime,
    getShowFlammability: () => showFlammability,
    getShowRurality: () => showRurality,
    getShowUrgency: () => showUrgency,
    getShowMaterialData: () => showMaterialData,
    getShowMaterialIntensity: () => showMaterialIntensity,
    getShowMaterialMomentum: () => showMaterialMomentum,
    getShowMaterialSuspicion: () => showMaterialSuspicion,
    getShowMaterialIgnitionRisk: () => showMaterialIgnitionRisk,
    getShowMaterialStokingRisk: () => showMaterialStokingRisk,
    setManualPrice,
    clearManualPrices,
    clearManualPrice,
    setThresholds,
    setApiPrices,
    clearApiPrices,
    setApiKey,
    setActiveTab,
    setShowOptionalBadges: setShowOptionalBadgesEnabled,
    setShowResourcePrices: setShowResourcePricesEnabled,
    setShowScenarioName: setShowScenarioNameEnabled,
    setStackResources: setStackResourcesEnabled,
    setPpnBarPosition,
    setPayoutBasis,
    setShowBuildingStats: setShowBuildingStatsEnabled,
    setShowResponseTime: setShowResponseTimeEnabled,
    setShowFlammability: setShowFlammabilityEnabled,
    setShowRurality: setShowRuralityEnabled,
    setShowUrgency: setShowUrgencyEnabled,
    setShowMaterialData: setShowMaterialDataEnabled,
    setShowMaterialIntensity: setShowMaterialIntensityEnabled,
    setShowMaterialMomentum: setShowMaterialMomentumEnabled,
    setShowMaterialSuspicion: setShowMaterialSuspicionEnabled,
    setShowMaterialIgnitionRisk: setShowMaterialIgnitionRiskEnabled,
    setShowMaterialStokingRisk: setShowMaterialStokingRiskEnabled
  };
  var reInjectTimer = null;
  function scheduleInjectSettings() {
    if (reInjectTimer !== null) return;
    reInjectTimer = setTimeout(() => {
      reInjectTimer = null;
      if (!isArsonPage()) return;
      const root = getRoot();
      const btn = document.getElementById("pyro-settings-btn");
      if (!btn || !root.contains(btn)) {
        injectSettings(root, settingsCtx);
      }
    }, 200);
  }
  var materialBadgeTooltipCtx = {
    show: (target, content, options) => tryTooltip((api) => api.show(target, content, options)),
    hide: () => tryTooltip((api) => api.hide())
  };
  var observer = new MutationObserver(() => {
    scanPage();
    scanMaterialPopover(materialBadgeTooltipCtx, materialBadgeConfig());
    scheduleInjectSettings();
  });
  function start() {
    loadState();
    populateScenarioIndex(SCENARIOS);
    injectHighlightStyles();
    injectMaterialBadgeStyles();
    applyPpnBarPosition();
    observer.observe(document.body, { childList: true, subtree: true });
    scheduleScenarioRefresh();
    if (isArsonPage()) {
      scanPage();
      injectSettings(getRoot(), settingsCtx);
    }
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
