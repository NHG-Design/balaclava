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
    DIAMOND_RING: "diamond_ring",
    GRENADE: "grenade",
    MAYAN_STATUE: "mayan_statue",
    AMMONIA: "ammonia",
    SYRINGE: "syringe",
    GOLD_TOOTH: "gold_tooth",
    SUMO_DOLL: "sumo_doll",
    RAW_IVORY: "raw_ivory",
    KABUKI_MASK: "kabuki_mask",
    STAPLER: "stapler",
    PELE_CHARM: "pele_charm",
    OPIUM: "opium",
    TOOTHBRUSH: "toothbrush"
  };
  var CATALOG = {
    [RESOURCE.GASOLINE]: { id: RESOURCE.GASOLINE, name: "Gasoline", kind: "fuel", category: "liquid", isTool: false, defaultPrice: 1500 },
    [RESOURCE.DIESEL]: { id: RESOURCE.DIESEL, name: "Diesel", kind: "fuel", category: "liquid", isTool: false, defaultPrice: 2500 },
    [RESOURCE.KEROSENE]: { id: RESOURCE.KEROSENE, name: "Kerosene", kind: "fuel", category: "liquid", isTool: false, defaultPrice: 4e3 },
    [RESOURCE.MAGNESIUM]: { id: RESOURCE.MAGNESIUM, name: "Magnesium Shavings", kind: "fuel", category: "solid", isTool: false, defaultPrice: 5e3 },
    [RESOURCE.THERMITE]: { id: RESOURCE.THERMITE, name: "Thermite", kind: "fuel", category: "solid", isTool: false, defaultPrice: 8e4 },
    [RESOURCE.SALTPETRE]: { id: RESOURCE.SALTPETRE, name: "Saltpetre", kind: "fuel", category: "solid", isTool: false, defaultPrice: 2e3 },
    [RESOURCE.POTASSIUM_NITRATE]: { id: RESOURCE.POTASSIUM_NITRATE, name: "Potassium Nitrate", kind: "fuel", category: "solid", isTool: false, defaultPrice: 5e3 },
    [RESOURCE.OXYGEN]: { id: RESOURCE.OXYGEN, name: "Oxygen Tank", kind: "fuel", category: "gaseous", isTool: false, defaultPrice: 3e3 },
    [RESOURCE.METHANE]: { id: RESOURCE.METHANE, name: "Methane Tank", kind: "fuel", category: "gaseous", isTool: false, defaultPrice: 8e3 },
    [RESOURCE.HYDROGEN]: { id: RESOURCE.HYDROGEN, name: "Hydrogen Tank", kind: "fuel", category: "gaseous", isTool: false, defaultPrice: 15e3 },
    [RESOURCE.LIGHTER]: { id: RESOURCE.LIGHTER, name: "Lighter", kind: "tool", category: "igniter", isTool: false, defaultPrice: 500 },
    [RESOURCE.MOLOTOV]: { id: RESOURCE.MOLOTOV, name: "Molotov Cocktail", kind: "tool", category: "igniter", isTool: false, defaultPrice: 3e3 },
    [RESOURCE.FLAMETHROWER]: { id: RESOURCE.FLAMETHROWER, name: "Flamethrower", kind: "tool", category: "igniter", isTool: true, defaultPrice: 0 },
    [RESOURCE.BLANKET]: { id: RESOURCE.BLANKET, name: "Blanket", kind: "tool", category: "dampener", isTool: true, defaultPrice: 0 },
    [RESOURCE.SAND]: { id: RESOURCE.SAND, name: "Sand", kind: "tool", category: "dampener", isTool: false, defaultPrice: 1e3 },
    [RESOURCE.FIRE_EXTINGUISHER]: { id: RESOURCE.FIRE_EXTINGUISHER, name: "Fire Extinguisher", kind: "tool", category: "dampener", isTool: true, defaultPrice: 0 },
    [RESOURCE.DIAMOND_RING]: { id: RESOURCE.DIAMOND_RING, name: "Diamond Ring", kind: "evidence", category: "misc", isTool: false, defaultPrice: 5e4 },
    [RESOURCE.GRENADE]: { id: RESOURCE.GRENADE, name: "Grenade", kind: "evidence", category: "misc", isTool: false, defaultPrice: 1e4 },
    [RESOURCE.MAYAN_STATUE]: { id: RESOURCE.MAYAN_STATUE, name: "Mayan Statue", kind: "evidence", category: "misc", isTool: false, defaultPrice: 2e4 },
    [RESOURCE.AMMONIA]: { id: RESOURCE.AMMONIA, name: "Ammonia", kind: "evidence", category: "misc", isTool: false, defaultPrice: 2e3 },
    [RESOURCE.SYRINGE]: { id: RESOURCE.SYRINGE, name: "Syringe", kind: "evidence", category: "misc", isTool: false, defaultPrice: 5e3 },
    [RESOURCE.GOLD_TOOTH]: { id: RESOURCE.GOLD_TOOTH, name: "Gold Tooth", kind: "evidence", category: "misc", isTool: false, defaultPrice: 15e3 },
    [RESOURCE.SUMO_DOLL]: { id: RESOURCE.SUMO_DOLL, name: "Sumo Doll", kind: "evidence", category: "misc", isTool: false, defaultPrice: 3e4 },
    [RESOURCE.RAW_IVORY]: { id: RESOURCE.RAW_IVORY, name: "Raw Ivory", kind: "evidence", category: "misc", isTool: false, defaultPrice: 8e4 },
    [RESOURCE.KABUKI_MASK]: { id: RESOURCE.KABUKI_MASK, name: "Kabuki Mask", kind: "evidence", category: "misc", isTool: false, defaultPrice: 2e4 },
    [RESOURCE.STAPLER]: { id: RESOURCE.STAPLER, name: "Stapler", kind: "evidence", category: "misc", isTool: false, defaultPrice: 1e3 },
    [RESOURCE.PELE_CHARM]: { id: RESOURCE.PELE_CHARM, name: "Pele Charm", kind: "evidence", category: "misc", isTool: false, defaultPrice: 5e4 },
    [RESOURCE.OPIUM]: { id: RESOURCE.OPIUM, name: "Opium", kind: "evidence", category: "misc", isTool: false, defaultPrice: 1e5 },
    [RESOURCE.TOOTHBRUSH]: { id: RESOURCE.TOOTHBRUSH, name: "Toothbrush", kind: "evidence", category: "misc", isTool: false, defaultPrice: 500 }
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
  function resolvePrice(resourceId, prices2) {
    const override = prices2[resourceId];
    if (override !== void 0) return override;
    return CATALOG[resourceId]?.defaultPrice ?? 0;
  }
  function itemCost(items, prices2) {
    if (!items) return 0;
    return items.reduce((sum, item) => {
      if (item.optional) return sum;
      const resource = CATALOG[item.resourceId];
      if (!resource || resource.isTool) return sum;
      return sum + item.qty * resolvePrice(item.resourceId, prices2);
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
  function calcMaterialCost(strategy, prices2) {
    const { evidence, ignite, place, stoke, dampen } = strategy.actions;
    return itemCost(evidence, prices2) + itemCost(ignite, prices2) + itemCost(place, prices2) + itemCost(stoke, prices2) + itemCost(dampen, prices2);
  }
  function calcProfitPerNerve(strategy, prices2) {
    const nerve = calcNerve(strategy);
    const cost = calcMaterialCost(strategy, prices2);
    return (strategy.payout - cost) / nerve;
  }
  function profitBand(ppn, thresholds) {
    if (ppn <= 0) return "negative";
    if (ppn <= thresholds.low) return "low";
    if (ppn <= thresholds.good) return "good";
    return "jackpot";
  }
  function formatPpn(ppn) {
    const rounded = Math.floor(ppn / 100) * 100;
    if (rounded >= 1e3) return `$${(rounded / 1e3).toFixed(1)}k/N`;
    return `$${rounded}/N`;
  }
  function rankForScenario(candidates, hasFlamethrower, prices2, thresholds) {
    const eligible = candidates.filter((s) => {
      if (s.requiresFlamethrower && !hasFlamethrower) return false;
      return true;
    });
    if (eligible.length === 0) return [];
    const ranked = eligible.map((s) => {
      const ppn = calcProfitPerNerve(s, prices2);
      return {
        strategy: s,
        materialCost: calcMaterialCost(s, prices2),
        baseNerve: calcNerve(s),
        profitPerNerve: ppn,
        band: profitBand(ppn, thresholds)
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
    TITLE_SECTION: '[class*="crimeOptionSection___"]'
  };

  // src/userscripts/pyromaniacs-ledger/index.ts
  var KEY_DEBUG = "pyroLedger.v1.debug";
  var KEY_PRICES = "pyroLedger.v1.prices";
  function store_get(key, def = "") {
    if (typeof GM_getValue !== "undefined") return GM_getValue(key, def);
    return localStorage.getItem(key) ?? def;
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
  var prices = {};
  var debugMode = false;
  var visibleMobileSection = null;
  function loadState() {
    debugMode = store_get(KEY_DEBUG) === "true";
    try {
      const saved = store_get(KEY_PRICES, "{}");
      prices = JSON.parse(saved);
    } catch {
      prices = {};
    }
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
    getRoot().querySelectorAll(SEL.CARD).forEach((section) => {
      if (section.dataset.pyroScanned) return;
      section.dataset.pyroScanned = "true";
      const scenarioEl = section.querySelector('[class*="scenario___"]');
      const rawName = scenarioEl?.textContent?.trim() ?? "";
      if (!rawName) return;
      const candidates = strategyIndex.get(rawName.toLowerCase()) ?? [];
      const allRanked = rankForScenario(candidates, hasFlamethrower, prices, DEFAULT_THRESHOLDS);
      applyToSection(section, allRanked, rawName);
    });
  }
  function resetScans() {
    getRoot().querySelectorAll(SEL.CARD).forEach((section) => {
      delete section.dataset.pyroScanned;
    });
    scanPage();
  }
  var observer = new MutationObserver(() => {
    scanPage();
  });
  function start() {
    loadState();
    injectHighlightStyles();
    scanPage();
    observer.observe(document.body, { childList: true, subtree: true });
    if (debugMode) console.log("[PyroLedger] started, debug on");
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
