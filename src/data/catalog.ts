/** ISO date of the most recent catalog default-price update. Shown in the settings UI. */
export const CATALOG_UPDATED = '2026-06-09';

export type ResourceKind = 'fuel' | 'evidence' | 'tool';
export type FuelCategory = 'liquid' | 'solid' | 'gaseous';
export type ToolCategory = 'igniter' | 'dampener';
export type ResourceCategory = FuelCategory | ToolCategory | 'misc';

export interface Resource {
    readonly id: string;
    readonly name: string;
    readonly kind: ResourceKind;
    readonly category: ResourceCategory;
    /** Tools are reusable/permanent — excluded from market cost calculation. */
    readonly isTool: boolean;
    /** Default market price in Torn dollars. Overridden by API or manual input. */
    readonly defaultPrice: number;
    /** Torn item ID — used for API price lookups. Undefined for items with no market listing. */
    readonly tornId?: number;
}

export const RESOURCE = {
    // Liquids
    GASOLINE:          'gasoline',
    DIESEL:            'diesel',
    KEROSENE:          'kerosene',
    // Solids
    MAGNESIUM:         'magnesium',
    THERMITE:          'thermite',
    POTASSIUM_NITRATE: 'potassium_nitrate',
    // Gases
    OXYGEN:            'oxygen',
    METHANE:           'methane',
    HYDROGEN:          'hydrogen',
    // Igniters
    LIGHTER:           'lighter',
    MOLOTOV:           'molotov',
    FLAMETHROWER:      'flamethrower',
    // Dampeners
    BLANKET:           'blanket',
    SAND:              'sand',
    FIRE_EXTINGUISHER: 'fire_extinguisher',
    // Evidence
    AMMONIA:           'ammonia',
    CANNABIS:          'cannabis',
    COMPASS:           'compass',
    DIAMOND_RING:      'diamond_ring',
    ELEPHANT_STATUE:   'elephant_statue',
    FAMILY_PHOTO:      'family_photo',
    GLITTER_BOMB:      'glitter_bomb',
    GOLD_TOOTH:        'gold_tooth',
    GRENADE:           'grenade',
    HARD_DRIVE:        'hard_drive',
    JADE_BUDDHA:       'jade_buddha',
    KABUKI_MASK:       'kabuki_mask',
    LIPSTICK:          'lipstick',
    MAYAN_STATUE:      'mayan_statue',
    OPIUM:             'opium',
    PCP:               'pcp',
    PELE_CHARM:        'pele_charm',
    RAW_IVORY:         'raw_ivory',
    STAPLER:           'stapler',
    STICK_GRENADE:     'stick_grenade',
    SUMO_DOLL:         'sumo_doll',
    SYRINGE:           'syringe',
    TOOTHBRUSH:        'toothbrush',
} as const;

export type ResourceId = (typeof RESOURCE)[keyof typeof RESOURCE];

export const CATALOG: Readonly<Record<ResourceId, Resource>> = {
    // Liquids
    [RESOURCE.GASOLINE]:          { id: RESOURCE.GASOLINE,          name: 'Gasoline',           kind: 'fuel',     category: 'liquid',   isTool: false, defaultPrice: 553,   tornId: 172   },
    [RESOURCE.DIESEL]:            { id: RESOURCE.DIESEL,            name: 'Diesel',             kind: 'fuel',     category: 'liquid',   isTool: false, defaultPrice: 5_013,   tornId: 1458  },
    [RESOURCE.KEROSENE]:          { id: RESOURCE.KEROSENE,          name: 'Kerosene',           kind: 'fuel',     category: 'liquid',   isTool: false, defaultPrice: 10_157,   tornId: 1457  },
    // Solids
    [RESOURCE.MAGNESIUM]:         { id: RESOURCE.MAGNESIUM,         name: 'Magnesium Shavings', kind: 'fuel',     category: 'solid',    isTool: false, defaultPrice: 60_703,   tornId: 1462  },
    [RESOURCE.THERMITE]:          { id: RESOURCE.THERMITE,          name: 'Thermite',           kind: 'fuel',     category: 'solid',    isTool: false, defaultPrice: 107_115,  tornId: 1461  },
    [RESOURCE.POTASSIUM_NITRATE]: { id: RESOURCE.POTASSIUM_NITRATE, name: 'Potassium Nitrate',  kind: 'fuel',     category: 'solid',    isTool: false, defaultPrice: 49_276,   tornId: 1264  },
    // Gases
    [RESOURCE.OXYGEN]:            { id: RESOURCE.OXYGEN,            name: 'Oxygen Tank',        kind: 'fuel',     category: 'gaseous',  isTool: false, defaultPrice: 24_277,   tornId: 1219  },
    [RESOURCE.METHANE]:           { id: RESOURCE.METHANE,           name: 'Methane Tank',       kind: 'fuel',     category: 'gaseous',  isTool: false, defaultPrice: 14_075,   tornId: 1460  },
    [RESOURCE.HYDROGEN]:          { id: RESOURCE.HYDROGEN,          name: 'Hydrogen Tank',      kind: 'fuel',     category: 'gaseous',  isTool: false, defaultPrice: 14_088,  tornId: 1459  },
    // Igniters
    [RESOURCE.LIGHTER]:           { id: RESOURCE.LIGHTER,           name: 'Windproof Lighter',  kind: 'tool',     category: 'igniter',  isTool: true,  defaultPrice: 0,       tornId: 544   },
    [RESOURCE.MOLOTOV]:           { id: RESOURCE.MOLOTOV,           name: 'Molotov Cocktail',   kind: 'tool',     category: 'igniter',  isTool: false, defaultPrice: 85_296,   tornId: 742   },
    [RESOURCE.FLAMETHROWER]:      { id: RESOURCE.FLAMETHROWER,      name: 'Flamethrower',       kind: 'tool',     category: 'igniter',  isTool: true,  defaultPrice: 0                      },
    // Dampeners
    [RESOURCE.BLANKET]:           { id: RESOURCE.BLANKET,           name: 'Blanket',            kind: 'tool',     category: 'dampener', isTool: true,  defaultPrice: 0                      },
    [RESOURCE.SAND]:              { id: RESOURCE.SAND,              name: 'Sand',               kind: 'tool',     category: 'dampener', isTool: false, defaultPrice: 30_752,   tornId: 833   },
    [RESOURCE.FIRE_EXTINGUISHER]: { id: RESOURCE.FIRE_EXTINGUISHER, name: 'Fire Extinguisher',  kind: 'tool',     category: 'dampener', isTool: true,  defaultPrice: 0,       tornId: 1463  },
    // Evidence
    [RESOURCE.AMMONIA]:           { id: RESOURCE.AMMONIA,           name: 'Ammonia',            kind: 'evidence', category: 'misc',     isTool: false, defaultPrice: 2_012,   tornId: 1248  },
    [RESOURCE.CANNABIS]:          { id: RESOURCE.CANNABIS,          name: 'Cannabis',           kind: 'evidence', category: 'misc',     isTool: false, defaultPrice: 6_029,   tornId: 196   },
    [RESOURCE.COMPASS]:           { id: RESOURCE.COMPASS,           name: 'Compass',            kind: 'evidence', category: 'misc',     isTool: false, defaultPrice: 14_159,   tornId: 407   },
    [RESOURCE.DIAMOND_RING]:      { id: RESOURCE.DIAMOND_RING,      name: 'Diamond Ring',       kind: 'evidence', category: 'misc',     isTool: false, defaultPrice: 2_626,  tornId: 54    },
    [RESOURCE.ELEPHANT_STATUE]:   { id: RESOURCE.ELEPHANT_STATUE,   name: 'Elephant Statue',    kind: 'evidence', category: 'misc',     isTool: false, defaultPrice: 4_759,  tornId: 280   },
    [RESOURCE.FAMILY_PHOTO]:      { id: RESOURCE.FAMILY_PHOTO,      name: 'Family Photo',       kind: 'evidence', category: 'misc',     isTool: false, defaultPrice: 773,     tornId: 1089  },
    [RESOURCE.GLITTER_BOMB]:      { id: RESOURCE.GLITTER_BOMB,      name: 'Glitter Bomb',       kind: 'evidence', category: 'misc',     isTool: false, defaultPrice: 627_194,  tornId: 1294  },
    [RESOURCE.GOLD_TOOTH]:        { id: RESOURCE.GOLD_TOOTH,        name: 'Gold Tooth',         kind: 'evidence', category: 'misc',     isTool: false, defaultPrice: 14_508,  tornId: 1282  },
    [RESOURCE.GRENADE]:           { id: RESOURCE.GRENADE,           name: 'Grenade',            kind: 'evidence', category: 'misc',     isTool: false, defaultPrice: 6_960,  tornId: 220   },
    [RESOURCE.HARD_DRIVE]:        { id: RESOURCE.HARD_DRIVE,        name: 'Hard Drive',         kind: 'evidence', category: 'misc',     isTool: false, defaultPrice: 255,   tornId: 45    },
    [RESOURCE.JADE_BUDDHA]:       { id: RESOURCE.JADE_BUDDHA,       name: 'Jade Buddha',        kind: 'evidence', category: 'misc',     isTool: false, defaultPrice: 10_228,  tornId: 275   },
    [RESOURCE.KABUKI_MASK]:       { id: RESOURCE.KABUKI_MASK,       name: 'Kabuki Mask',        kind: 'evidence', category: 'misc',     isTool: false, defaultPrice: 17_169,  tornId: 278   },
    [RESOURCE.LIPSTICK]:          { id: RESOURCE.LIPSTICK,          name: 'Lipstick',           kind: 'evidence', category: 'misc',     isTool: false, defaultPrice: 202,     tornId: 1085  },
    [RESOURCE.MAYAN_STATUE]:      { id: RESOURCE.MAYAN_STATUE,      name: 'Mayan Statue',       kind: 'evidence', category: 'misc',     isTool: false, defaultPrice: 2_315,  tornId: 259   },
    [RESOURCE.OPIUM]:             { id: RESOURCE.OPIUM,             name: 'Opium',              kind: 'evidence', category: 'misc',     isTool: false, defaultPrice: 26_819, tornId: 200   },
    [RESOURCE.PCP]:               { id: RESOURCE.PCP,               name: 'PCP',                kind: 'evidence', category: 'misc',     isTool: false, defaultPrice: 3_007,   tornId: 201   },
    [RESOURCE.PELE_CHARM]:        { id: RESOURCE.PELE_CHARM,        name: 'Pele Charm',         kind: 'evidence', category: 'misc',     isTool: false, defaultPrice: 3_296,  tornId: 265   },
    [RESOURCE.RAW_IVORY]:         { id: RESOURCE.RAW_IVORY,         name: 'Raw Ivory',          kind: 'evidence', category: 'misc',     isTool: false, defaultPrice: 69_988,  tornId: 358   },
    [RESOURCE.STAPLER]:           { id: RESOURCE.STAPLER,           name: 'Stapler',            kind: 'evidence', category: 'misc',     isTool: false, defaultPrice: 6_753,   tornId: 1286  },
    [RESOURCE.STICK_GRENADE]:     { id: RESOURCE.STICK_GRENADE,     name: 'Stick Grenade',      kind: 'evidence', category: 'misc',     isTool: false, defaultPrice: 13_911,   tornId: 221   },
    [RESOURCE.SUMO_DOLL]:         { id: RESOURCE.SUMO_DOLL,         name: 'Sumo Doll',          kind: 'evidence', category: 'misc',     isTool: false, defaultPrice: 15_307,  tornId: 427   },
    [RESOURCE.SYRINGE]:           { id: RESOURCE.SYRINGE,           name: 'Syringe',            kind: 'evidence', category: 'misc',     isTool: false, defaultPrice: 511,   tornId: 1094  },
    [RESOURCE.TOOTHBRUSH]:        { id: RESOURCE.TOOTHBRUSH,        name: 'Toothbrush',         kind: 'evidence', category: 'misc',     isTool: false, defaultPrice: 2_772,     tornId: 1272  },
};
