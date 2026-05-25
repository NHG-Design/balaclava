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
}

export const RESOURCE = {
    // Liquid fuels
    GASOLINE:          'gasoline',
    DIESEL:            'diesel',
    KEROSENE:          'kerosene',
    // Solid fuels
    MAGNESIUM:         'magnesium',
    THERMITE:          'thermite',
    SALTPETRE:         'saltpetre',
    POTASSIUM_NITRATE: 'potassium_nitrate',
    // Gaseous fuels
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
    DIAMOND_RING:      'diamond_ring',
    GRENADE:           'grenade',
    MAYAN_STATUE:      'mayan_statue',
    AMMONIA:           'ammonia',
    SYRINGE:           'syringe',
    GOLD_TOOTH:        'gold_tooth',
    SUMO_DOLL:         'sumo_doll',
    RAW_IVORY:         'raw_ivory',
    KABUKI_MASK:       'kabuki_mask',
    STAPLER:           'stapler',
    PELE_CHARM:        'pele_charm',
    OPIUM:             'opium',
    TOOTHBRUSH:        'toothbrush',
} as const;

export type ResourceId = (typeof RESOURCE)[keyof typeof RESOURCE];

export const CATALOG: Readonly<Record<ResourceId, Resource>> = {
    [RESOURCE.GASOLINE]:          { id: RESOURCE.GASOLINE,          name: 'Gasoline',          kind: 'fuel',     category: 'liquid',   isTool: false, defaultPrice: 1500    },
    [RESOURCE.DIESEL]:            { id: RESOURCE.DIESEL,            name: 'Diesel',            kind: 'fuel',     category: 'liquid',   isTool: false, defaultPrice: 2500    },
    [RESOURCE.KEROSENE]:          { id: RESOURCE.KEROSENE,          name: 'Kerosene',          kind: 'fuel',     category: 'liquid',   isTool: false, defaultPrice: 4000    },
    [RESOURCE.MAGNESIUM]:         { id: RESOURCE.MAGNESIUM,         name: 'Magnesium Shavings', kind: 'fuel',    category: 'solid',    isTool: false, defaultPrice: 5000    },
    [RESOURCE.THERMITE]:          { id: RESOURCE.THERMITE,          name: 'Thermite',          kind: 'fuel',     category: 'solid',    isTool: false, defaultPrice: 80000   },
    [RESOURCE.SALTPETRE]:         { id: RESOURCE.SALTPETRE,         name: 'Saltpetre',         kind: 'fuel',     category: 'solid',    isTool: false, defaultPrice: 2000    },
    [RESOURCE.POTASSIUM_NITRATE]: { id: RESOURCE.POTASSIUM_NITRATE, name: 'Potassium Nitrate', kind: 'fuel',     category: 'solid',    isTool: false, defaultPrice: 5000    },
    [RESOURCE.OXYGEN]:            { id: RESOURCE.OXYGEN,            name: 'Oxygen Tank',       kind: 'fuel',     category: 'gaseous',  isTool: false, defaultPrice: 3000    },
    [RESOURCE.METHANE]:           { id: RESOURCE.METHANE,           name: 'Methane Tank',      kind: 'fuel',     category: 'gaseous',  isTool: false, defaultPrice: 8000    },
    [RESOURCE.HYDROGEN]:          { id: RESOURCE.HYDROGEN,          name: 'Hydrogen Tank',     kind: 'fuel',     category: 'gaseous',  isTool: false, defaultPrice: 15000   },
    [RESOURCE.LIGHTER]:           { id: RESOURCE.LIGHTER,           name: 'Lighter',           kind: 'tool',     category: 'igniter',  isTool: false, defaultPrice: 500     },
    [RESOURCE.MOLOTOV]:           { id: RESOURCE.MOLOTOV,           name: 'Molotov Cocktail',  kind: 'tool',     category: 'igniter',  isTool: false, defaultPrice: 3000    },
    [RESOURCE.FLAMETHROWER]:      { id: RESOURCE.FLAMETHROWER,      name: 'Flamethrower',      kind: 'tool',     category: 'igniter',  isTool: true,  defaultPrice: 0       },
    [RESOURCE.BLANKET]:           { id: RESOURCE.BLANKET,           name: 'Blanket',           kind: 'tool',     category: 'dampener', isTool: true,  defaultPrice: 0       },
    [RESOURCE.SAND]:              { id: RESOURCE.SAND,              name: 'Sand',              kind: 'tool',     category: 'dampener', isTool: false, defaultPrice: 1000    },
    [RESOURCE.FIRE_EXTINGUISHER]: { id: RESOURCE.FIRE_EXTINGUISHER, name: 'Fire Extinguisher', kind: 'tool',     category: 'dampener', isTool: true,  defaultPrice: 0       },
    [RESOURCE.DIAMOND_RING]:      { id: RESOURCE.DIAMOND_RING,      name: 'Diamond Ring',      kind: 'evidence', category: 'misc',     isTool: false, defaultPrice: 50000   },
    [RESOURCE.GRENADE]:           { id: RESOURCE.GRENADE,           name: 'Grenade',           kind: 'evidence', category: 'misc',     isTool: false, defaultPrice: 10000   },
    [RESOURCE.MAYAN_STATUE]:      { id: RESOURCE.MAYAN_STATUE,      name: 'Mayan Statue',      kind: 'evidence', category: 'misc',     isTool: false, defaultPrice: 20000   },
    [RESOURCE.AMMONIA]:           { id: RESOURCE.AMMONIA,           name: 'Ammonia',           kind: 'evidence', category: 'misc',     isTool: false, defaultPrice: 2000    },
    [RESOURCE.SYRINGE]:           { id: RESOURCE.SYRINGE,           name: 'Syringe',           kind: 'evidence', category: 'misc',     isTool: false, defaultPrice: 5000    },
    [RESOURCE.GOLD_TOOTH]:        { id: RESOURCE.GOLD_TOOTH,        name: 'Gold Tooth',        kind: 'evidence', category: 'misc',     isTool: false, defaultPrice: 15000   },
    [RESOURCE.SUMO_DOLL]:         { id: RESOURCE.SUMO_DOLL,         name: 'Sumo Doll',         kind: 'evidence', category: 'misc',     isTool: false, defaultPrice: 30000   },
    [RESOURCE.RAW_IVORY]:         { id: RESOURCE.RAW_IVORY,         name: 'Raw Ivory',         kind: 'evidence', category: 'misc',     isTool: false, defaultPrice: 80000   },
    [RESOURCE.KABUKI_MASK]:       { id: RESOURCE.KABUKI_MASK,       name: 'Kabuki Mask',       kind: 'evidence', category: 'misc',     isTool: false, defaultPrice: 20000   },
    [RESOURCE.STAPLER]:           { id: RESOURCE.STAPLER,           name: 'Stapler',           kind: 'evidence', category: 'misc',     isTool: false, defaultPrice: 1000    },
    [RESOURCE.PELE_CHARM]:        { id: RESOURCE.PELE_CHARM,        name: 'Pele Charm',        kind: 'evidence', category: 'misc',     isTool: false, defaultPrice: 50000   },
    [RESOURCE.OPIUM]:             { id: RESOURCE.OPIUM,             name: 'Opium',             kind: 'evidence', category: 'misc',     isTool: false, defaultPrice: 100000  },
    [RESOURCE.TOOTHBRUSH]:        { id: RESOURCE.TOOTHBRUSH,        name: 'Toothbrush',        kind: 'evidence', category: 'misc',     isTool: false, defaultPrice: 500     },
};
