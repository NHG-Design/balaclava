const scenarios = {
  "A Bitter Taste": [
    "Profit/Nerve: ",
    "Flamethrower: ",
    "Evidence: ",
    "Place: ",
    "Stoke: ",
    "Dampen: "
  ],
  "A Black Mark": [
    [
      "Payout:210K",
      "Profit/Nerve: ",
      "Flamethrower:  No",
      "Place: 2 Gasoline ",
      "Stoke: 1 Lighter",
      "Dampen: "
    ],
    [
      "Payout:210K",
      "Profit/Nerve: 13.9K ",
      "Flamethrower:  Yes",
      "Place: 1 Gasoline ",
      "Stoke: ?1 Flamethrower?",
    ]
  ],
  "A Burnt Child Dreads the Fire": [
    [
      "Payout: 190K",
      "Profit/Nerve: ",
      "Flamethrower: No",
      "Place: 2 Kerosene ",
      "Stoke: 1 Methane Tank",
      "Dampen: "
    ],
    [
      "Payout: 235K",
      "Profit/Nerve: 7.5K",
      "Flamethrower: Yes",
      "Place: 1 Hydrogen Tank ",
      "Stoke: 1 Hydrogen Tank",
      "Dampen: "
    ]
  ],
  "A Dirty Job": [
    [
      "Payout:30K",
      "Profit/Nerve: ",
      "Flamethrower: No",
      "Place: 2 Gasoline",
      "Stoke: ",
      "Dampen: "
    ],
    [
      "Payout:32K",
      "Profit/Nerve: ",
      "Flamethrower: Yes",
      "Place: 1 Gasoline",
      "Stoke: ",
      "Dampen: "
    ]
  ],
  "A Fungus Among Us": [
    [
      "Payout:38K",
      "Profit/Nerve: ",
      "Flamethrower: No",
      "Place: 3 Gasoline",
      "Stoke: ",
      "Dampen: "
    ],
    [
      "Payout:34K",
      "Profit/Nerve: ",
      "Flamethrower: Yes",
      "Place: 1 Gasoline",
      "Stoke: ",
      "Dampen: "
    ]
  ],
  "A Hot Lead": [
    "Payout:22K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 1 Gasoline",
    "Stoke: ",
    "Dampen: "
  ],
  "A Mug's Game": [
    [
      "Payout:55K",
      "Profit/Nerve: ",
      "Ignite: 1 Molotov Cocktail",
      "Flamethrower: No",
      "Place: 2 Gasoline",
      "Stoke: ",
      "Dampen: "
    ],
    [
      "Payout:55K",
      "Profit/Nerve: 2.7K",
      "Flamethrower: Yes",
      "Place: 2 Gasoline",
      "Stoke: ",
      "Dampen: "
    ]
  ],
  "A Problem Shared": [
    [
      "Payout: 180K",
      "Profit/Nerve: ",
      "Flamethrower: No",
      "Place: 6 Gasoline",
      "Stoke: 1 Gasoline",
      "Dampen: "
    ],
    [
      "Payout: 180K",
      "Profit/Nerve: ",
      "Flamethrower: Yes",
      "Place: 4 Gasoline",
      "Stoke: 1 Flamethrower",
      "Dampen: "
    ]
  ],
  "A Rash Decision": [
    "Payout: 11K",
    "Profit/Nerve: ",
    "Ignite: Lighter",
    "Place: 1 Gasoline",
    "Stoke: ",
    "Dampen: "
  ],
  "A Treat for the Tricked": [
    "Payout: 71K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Evidence: 1 Kabuki Mask",
    "Place: 1 Gasoline",
    "Stoke: ",
    "Dampen: "
  ],
  "All Mouth and Trousers": [
    [
      "Payout: 51K",
      "Profit/Nerve: ",
      "Flamethrower: No",
      "Evidence: 1 Diamond Ring",
      "Place: 2 Gasoline",
      "Stoke: ",
      "Dampen: "
    ],
    [
      "Payout: 56K",
      "Profit/Nerve: ",
      "Flamethrower: Yes",
      "Evidence: 1 Diamond Ring",
      "Place: 2 Gasoline",
      "Stoke: ",
      "Dampen: "
    ]
  ],
  "Always Read the Label": [
    "Payout: 170K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 5 Gasoline",
    "Stoke: 1 Flamethrower",
    "Dampen: "
  ],
  "Anon Starter": [
    [
      "Payout:1.2K",
      "Profit/Nerve: ",
      "Flamethrower: No",
      "Place: 1 Gasoline ",
      "Stoke: ",
      "Dampen: "
    ],
    [
      "Payout:31K",
      "Profit/Nerve: ",
      "Flamethrower: Yes",
      "Place: 1 Gasoline ",
      "Stoke: ",
      "Dampen: "
    ]
  ],
  "Apart of the Problem": [
    [
      "Payout:265K",
      "Profit/Nerve: ",
      "Flamethrower: No",
      "Place: 6 Gasoline",
      "Stoke: ",
      "Dampen: "
    ],
    [
      "Payout:265K",
      "Profit/Nerve: ",
      "Flamethrower: Yes",
      "Place: 4 Gasoline",
      "Stoke: 1 Flamethrower",
      "Dampen: "
    ]
  ],
  "Ash or Credit?": [
    "Payout:180K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 1 Hydrogen Tank",
    "Stoke: 1 Hydrogen Tank",
    "Dampen: "
  ],
  "Ashes to Ancestors": [
    [
      "Payout:90K",
      "Profit/Nerve: ",
      "Flamethrower: No",
      "Place: 4 Gasoline",
      "Stoke: 1 Gasoline ",
    ],
    [
      "Payout:90K",
      "Profit/Nerve: ",
      "Flamethrower: Yes",
      "Place: 5 Gasoline",
      "Stoke: ",
    ]
  ],
  "Back, Sack, and Crack": [
    "Payout:300K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 2 Hydrogen Tank",
    "Stoke: ",
    "Dampen: "
  ],
  "Baewatch": [
    "Payout: 13K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 1 Gasoline",
    "Stoke: ",
    "Dampen: "
  ],
  "Bagged and Tagged": [
    "Payout:1.6K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 1 Gasoline",
    "Stoke: ",
    "Dampen: "
  ],
  "Bald Faced Destruction": [
    [
      "Payout:230K",
      "Profit/Nerve: ",
      "Flamethrower: No",
      "Evidence: 1 Raw Ivory",
      "Place: 4 Gasoline",
      "Stoke: ",
      "Dampen: "
    ],
    [
      "Payout:245K",
      "Profit/Nerve: ",
      "Flamethrower: Yes",
      "Evidence: 1 Raw Ivory",
      "Place: 3 Gasoline",
      "Stoke: ",
      "Dampen: "
    ]
  ],
  "Bang For Your Buck": [
    [
      "Payout:21K",
      "Profit/Nerve: ",
      "Flamethrower: No",
      "Evidence: 1 Grenade",
      "Place: 2 Gasoline",
    ],
    [
      "Payout:44K",
      "Profit/Nerve: ",
      "Flamethrower: Yes",
      "Evidence: 1 Grenade",
      "Place: 1 Gasoline",
    ]
  ],
  "Banking on It": [
    "Payout:120K",
    "Profit/Nerve: ",
    "Flamethrower: No",
    "Evidence: 1 Stapler",
    "Place: 3 Gasoline",
    "Stoke: ",
    "Dampen: "
  ],
  "Banking on It": [
    "Payout:200K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Evidence: 1 Stapler",
    "Place: 3 Gasoline",
    "Stoke: ",
    "Dampen: "
  ],
  "Beach Bum": [
    [
      "Payout: 20K",
      "Profit/Nerve: ",
      "Flamethrower: No",
      "Place: 1 Gasoline",
      "Stoke: 1 Gasoline",
      "Dampen: "
    ],
    [
      "Payout: 19K",
      "Profit/Nerve: ",
      "Flamethrower: Yes",
      "Place: 1 Gasoline",
      "Stoke: ",
      "Dampen: "
    ]
  ],
  "Beat the Odds": [
    "Payout: 330K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 4 Gasoline",
    "Stoke: ",
    "Dampen: "
  ],
  "Beggars Can't be Choosers": [
    "try 5 gasoline, 1 Thermite",
    "Payout: 480K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 5 Gasoline, 2 Thermite",
    "Stoke: ",
    "Dampen: "
  ],
  "Beyond Repair": [
    "Try: 3 gas",
    "Payout: 93.5K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 4 Gasoline",
    "Stoke: 1 Flamethrower",
    "Dampen: "
  ],
  "Blaze of Glory": [
    [
      "Profit/Nerve: ",
      "Flamethrower: No",
      "Evidence: 1 Toothbrush",
      "Place: ",
      "Stoke: ",
      "Dampen: "
    ],
    [
      "Payout: 180K",
      "Profit/Nerve: ",
      "Flamethrower: Yes",
      "Evidence: 1 Toothbrush",
      "Place: 2 Gasoline",
      "Stoke: 1 Flamethrower",
      "Dampen: "
    ]
  ],
  "Blown to High Heaven": [
    "Profit/Nerve: ",
    "Flamethrower: ",
    "Evidence: ",
    "Place: ",
    "Stoke: ",
    "Dampen: "
  ],
  "Body of Evidence": [
    [
      "Payout: 105K",
      "Profit/Nerve: ",
      "Flamethrower: No",
      "Place: 6 Gasoline",
      "Stoke: ",
      "Dampen: "
    ],
    [
      "Payout: 105K",
      "Profit/Nerve: ",
      "Flamethrower: Yes",
      "Place: 5 Gasoline",
      "Stoke: ",
      "Dampen: "
    ]
  ],
  "Bone of Contention": [
    "Payout: 43K",
    "Profit/Nerve: 2.5K ",
    "ignite: lighter",
    "Place: 1 Gasoline",
    "Stoke: ",
    "Dampen: 1 Blanket"
  ],
  "Boom Industry": [
    [
      "Payout: 130K",
      "Profit/Nerve: 3.6K",
      "Flamethrower: No",
      "Place: 5 Gasoline ",

    ],
    [
      "Payout: 100K",
      "Profit/Nerve: 3.9K",
      "Flamethrower: Yes",
      "Place: 3 Gasoline ",
    ]
  ],
  "Boxing Clever": [
    "Payout: 325K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 2 Gasoline",
    "Stoke: ",
    "Dampen: "
  ],
  "Bright Spark": [
    "Try: 1 Hyrdrogen, FT ignite, Metahne stoke",
    "Payout: 275K",
    "Profit/Nerve: ",
    "Ignite: Lighter",
    "Place: 1 Hydrogen Tank",
    "Stoke: 2 Hydrogen Tank",
    "Dampen: "
  ],
  "Bugging Me": [
    "Profit/Nerve: ",
    "Flamethrower: ",
    "Evidence: ",
    "Place: ",
    "Stoke: ",
    "Dampen: "
  ],
  "Bummed Out": [
    "Profit/Nerve: ",
    "Flamethrower: ",
    "Evidence: ",
    "Place: ",
    "Stoke: ",
    "Dampen: "
  ],
  "Burn After Screening": [
    [
      "Payout: 99K",
      "Profit/Nerve: ",
      "Flamethrower: No",
      "Place: 3 Gasoline",
      "Stoke: ",
      "Dampen: "
    ],
    [
      "Payout: 100K",
      "Profit/Nerve: ",
      "Flamethrower: Yes",
      "Place: 2 Gasoline",
      "Stoke: ",
      "Dampen: "
    ]
  ],
  "Burn Notice": [
    [
      "Payout: 175K",
      "Profit/Nerve: ",
      "Flamethrower: No",
      "Place: 4 Gasoline",
      "Stoke: 3 Gasoline",
      "Dampen: "
    ],
    [
      "Payout: 175K",
      "Profit/Nerve: ",
      "Flamethrower: Yes",
      "Place: 5 Gasoline",
      "Stoke: 1 Flametrhower",
      "Dampen: "
    ]
  ],
  "Burn Rubber": [
    [
      "Payout: 50K",
      "Profit/Nerve: 1.7K",
      "Flamethrower: No",
      "Evidence: 1 Mayan Statue",
      "Place: 2 Gasoline",
      "Stoke: ",
      "Dampen: "
    ],
    [
      "Payout: 67K",
      "Profit/Nerve: 2.4K",
      "Flamethrower: Yes",
      "Evidence: 1 Mayan Statue",
      "Place: 2 Gasoline",
      "Stoke: ",
      "Dampen: "
    ]
  ],
  "Burn the Deck": [
    [
      "Payout: 57K",
      "Profit/Nerve: ",
      "Flamethrower: No",
      "Place: 3 Gasoline ",
      "Stoke: ",
      "Dampen: "
    ],
    [
      "Payout: 96K",
      "Profit/Nerve: ",
      "Flamethrower: Yes",
      "Place: 3 Gasoline ",
      "Stoke: ",
      "Dampen: "
    ]
  ],
  "Burned by Stupidity": [
    "Payout: 32K",
    "Profit/Nerve: ",
    "Ignite: Lighter",
    "Place: 1 Kerosene",
    "Stoke: ",
    "Dampen: "
  ],
  "Burned Cookies": [
    "Payout: 81K",
    "Profit/Nerve: ",
    "Flamethrower: ",
    "Place: 2 Diesel, 2 Magnesium Shavings",
    "Stoke: 1 Diesel",
    "Dampen: "
  ],
  "Burning Ambition": [
    [
      "Profit/Nerve: ",
      "Flamethrower: No ",
      "Place: ",
      "Stoke: ",
      "Dampen: "
    ],
    [
      "Payout: 46K",
      "Profit/Nerve: 2.7K",
      "Flamethrower: Yes",
      "Place: 2 Gasoline",
      "Stoke: ",
      "Dampen: "
    ]
  ],
  "Burning Calories": [
    [
      "Try: 5 Gasoline",
      "Payout: 84K",
      "Profit/Nerve: 2.7K",
      "Flamethrower: No",
      "Place: 4 Gasoline ",
      "Stoke: ",
      "Dampen: "
    ],
    [
      "Payout: 100K",
      "Profit/Nerve: 3.2K",
      "Flamethrower: Yes",
      "Place: 4 Gasoline ",
      "Stoke: ",
      "Dampen: "
    ]
  ],
  "Burning Liability": [
    "Payout: 160K",
    "Profit/Nerve: ",
    "Ignite: Lighter ",
    "Place: 1 Hydrogen Tank",
    "Stoke: 2 Hydrogen Tank",
    "Dampen: "
  ],
  "Burning Memory": [
    [
      "Payout: 32K",
      "Profit/Nerve: ",
      "Flamethrower: No",
      "Place: 3 Gasoline ",
      "Stoke: ",
      "Dampen: "
    ],
    [
      "Payout: 32K",
      "Profit/Nerve: ",
      "Flamethrower: Yes",
      "Place: 2 Gasoline ",
      "Stoke: ",
      "Dampen: "
    ]
  ],
  "Burning Through Cash": [
    [
      "Payout: 58K",
      "Profit/Nerve: ",
      "Flamethrower: No ",
      "Place: 1 Oxygen Tank",
      "Stoke: ",
      "Dampen: "
    ],
    [
      "Payout: 105K",
      "Profit/Nerve: Negative",
      "Flamethrower: Yes ",
      "Place: 1 Hydrogen Tank",
      "Stoke: ",
      "Dampen: "
    ]
  ],
  "Burnt Ends": [
    "Might fail, try 5 gas?",
    "Payout:170K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 4 Gasoline",
    "Stoke: ?1 Flamethrower?",
  ],
  "Burn up the Dancefloor": [
    [
      "Payout:150K",
      "Profit/Nerve: ",
      "Flamethrower: No",
      "Place: 3 Gasoline",
      "Stoke: ",
    ],
    [
      "Payout:175K",
      "Profit/Nerve: ",
      "Flamethrower: Yes",
      "Place: 2 Gasoline",
      "Stoke: ",
    ]
  ],
  "Cache and Burn": [
    "Payout: 490K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 4 Kerosene ",
    "Stoke: ",
    "Dampen: "
  ],
  "Camera Tricks": [
    [
      "Payout: 115K",
      "Profit/Nerve: 2.9K",
      "Flamethrower: No",
      "Place: 5 Gasoline ",
      "Stoke: 1 Gasoline",
      "Dampen: "
    ],
    [
      "Payout: 115K",
      "Profit/Nerve: 3.1K",
      "Flamethrower: Yes",
      "Place: 4 Gasoline ",
      "Stoke:  1 Flamethrower",
      "Dampen: "
    ]
  ],
  "Carrying a Torch": [
    "Payout: 44.5K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 2 Gasoline",
    "Stoke: ",
    "Dampen: "
  ],
  "Chance of Redemption": [
    [
      "Payout: 90K",
      "Profit/Nerve: ",
      "Flamethrower: No",
      "Place: 4 Gasoline ",
      "Stoke: ",
      "Dampen: "
    ],
    [
      "Payout: 59K",
      "Profit/Nerve: ",
      "Flamethrower: Yes",
      "Place: 2 Gasoline ",
      "Stoke: ",
      "Dampen: "
    ]
  ],
  "Charcoal Sketch": [
    [
      "Payout: 49K",
      "Profit/Nerve: ",
      "Flamethrower: No",
      "Place: 3 Gasoline ",
      "Stoke: ",
      "Dampen: "
    ],
    [
      "Payout: 39K",
      "Profit/Nerve: ",
      "Flamethrower: Yes",
      "Place: 1 Gasoline ",
      "Stoke: ",
      "Dampen: "
    ]
  ],
  "Chasing Targets": [
    "Payout: 24K",
    "Profit/Nerve: 2K",
    "Flamethrower: Yes",
    "Place: 1 Gasoline",
  ],
  "Checking Out": [
    "Payout: 280K",
    "Profit/Nerve: ",
    "Ignite: Lighter ",
    "Place: 1 Hydrogen Tank",
    "Stoke: 1 Hydrogen Tank",
    "Dampen: "
  ],
  "Child's Play": [
    [
      "Payout: 23K",
      "Profit/Nerve: 1.4K",
      "Flamethrower: No ",
      "Place: 2 Gasoline",
      "Stoke: ",
      "Dampen: "
    ],
    [
      "Payout: 23K",
      "Profit/Nerve: 2.2K",
      "Flamethrower: Yes",
      "Place: 1 Gasoline",
      "Stoke: ",
      "Dampen: "
    ]
  ],
  "Claim to Flame": [
    "Payout: 33.5K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 2 Gasoline",
    "Stoke: ",
    "Dampen: "
  ],
  "Clean Sweep": [
    [
      "Payout: 150K",
      "Profit/Nerve:  ",
      "Flamethrower: No",
      "Place: 5 Gasoline",
      "Stoke: 1 Diesel",
      "Dampen: "
    ],
    [
      "Payout: 150K",
      "Profit/Nerve:  ",
      "Flamethrower: Yes",
      "Place: 4 Gasoline",
      "Stoke: 1 Flamethrower",
      "Dampen: "
    ]
  ],
  "Cleansed Through Fire": [
    "Payout: 46K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 1 Diesel",
    "Stoke: ",
    "Dampen: "
  ],
  "Clinical Exposure": [
    "Payout: 165K",
    "Profit/Nerve: ",
    "Ignite: Lighter",
    "Evidence:  1 Opium",
    "Place: 1 Gasoline",
    "Stoke: ",
    "Dampen: "
  ],
  "Cold Brew Reality": [
    "try stoke 1 Hydrpgen",
    "Payout: 150K",
    "Profit/Nerve: ",
    "Ignite: Lighter ",
    "Place: 1 Hydrogen Tank",
    "Stoke: 2 Hydrogen Tank",
    "Dampen: "
  ],
  "Cold Feet": [
    [
      "Payout: 100K",
      "Profit/Nerve:  ",
      "Flamethrower: No",
      "Place: 6 Gasoline ",
      "Stoke: 1 Diesel ",
      "Dampen: "
    ],
    [
      "Try 4 gas",
      "Payout: 120K",
      "Profit/Nerve:  ",
      "Flamethrower: yes",
      "Place: 5 Gasoline ",
      "Stoke: 1 Flamethrower ",
      "Dampen: "
    ]
  ],
  "Cook it Rare": [
    "Payout: 330K",
    "Profit/Nerve: ",
    "Ignite: Lighter ",
    "Place: 3 Kerosene",
    "Stoke: ",
    "Dampen: "
  ],
  "Cooked and Burned": [
    [
      "Payout: 70K",
      "Profit/Nerve: ",
      "Flamethrower: No",
      "Evidence: 1 Ammonia",
      "Place: 3 Gasoline",
      "Stoke: ",
      "Dampen: "
    ],
    [
      "Payout: 73K",
      "Profit/Nerve: 2.4K",
      "Flamethrower: Yes",
      "Evidence: 1 Ammonia",
      "Place: 2 Gasoline",
      "Stoke: ",
      "Dampen: "
    ]
  ],
  "Cooking the Books": [
    [
      "Payout: 22K",
      "Profit/Nerve: ",
      "Flamethrower: No",
      "Place: 2 Gasoline ",
      "Stoke: ",
      "Dampen: "
    ],
    [
      "Payout: 25K",
      "Profit/Nerve: ",
      "Flamethrower: Yes",
      "Place: 1 Gasoline ",
      "Stoke: ",
      "Dampen: "
    ]
  ],
  "Cooking Time": [
    "Profit/Nerve: ",
    "Flamethrower: ",
    "Evidence: ",
    "Place: ",
    "Stoke: ",
    "Dampen: "
  ],
  "Cop Some Heat": [
    "Payout:19K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 1 Gasoline ",
    "Stoke: ",
    "Dampen: "
  ],
  "Crafty Devil": [
    "Payout: 100K",
    "Profit/Nerve: 10K",
    "Ignite: Lighter ",
    "Place: 1 Gasoline",
    "Stoke: ",
    "Dampen: "
  ],
  "Crisp Bills": [
    [
      "Payout: 35K",
      "Profit/Nerve: ",
      "Flamethrower: No",
      "Place: 2 Gasoline ",
      "Stoke: ",
      "Dampen: "
    ],
    [
      "Payout: 39K",
      "Profit/Nerve: ",
      "Flamethrower: Yes",
      "Place: 1 Gasoline ",
      "Stoke: ",
      "Dampen: "
    ]
  ],
  "Curtain Call": [
    "Payout: 57K",
    "Profit/Nerve: ",
    "Ignite: Lighter",
    "Place: 1 Gasoline",
    "Stoke: ",
    "Dampen: "
  ],
  "Cut Corners": [
    "Payout: 200K",
    "Profit/Nerve: ",
    "Ignite: Lighter",
    "Place: 1 Hydrogen Tank",
    "Stoke: 1 Hydrogen Tank",
    "Dampen: "
  ],
  "Cut to the Chase": [
    "Profit/Nerve: ",
    "Flamethrower: ",
    "Evidence: ",
    "Place: ",
    "Stoke: ",
    "Dampen: "
  ],
  "Daddy's Girl": [
    "Payout: 330K",
    "Profit/Nerve: ",
    "Ignite: Lighter ",
    "Place: 1 Kerosene",
    "Stoke: 1 Methane Tank, 1 Hydrogen Tank",
    "Dampen: "
  ],
  "Damned If You Don't": [
    "Payout: 74K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 1 Gasoline",
    "Stoke: ",
    "Dampen: "
  ],
  "Dead Giveaway": [
    "Payout: 29K",
    "Profit/Nerve: ",
    "Ignite: Lighter",
    "Place: 1 Kerosene",
    "Stoke: ",
    "Dampen: "
  ],
  "Dine and Dash": [
    "Payout: 95K",
    "Profit/Nerve: ",
    "Ignite: Lighter ",
    "Place: 1 Hydrogen Tank",
    "Stoke: 1 Hydrogen Tank",
    "Dampen: "
  ],
  "Dirty Money": [
    "Payout: 360K",
    "Profit/Nerve: ",
    "Ignite: Lighter",
    "Place: 3 Kerosene",
    "Stoke: ",
    "Dampen: "
  ],
  "Disco Inferno": [
    "Payout: 48K",
    "Profit/Nerve: ",
    "Ignite: Lighter",
    "Place: 1 Hydrogen Tank",
    "Stoke: ",
    "Dampen: "
  ],
  "Don't Hate the Player": [
    [
      "Payout: 20K",
      "Profit/Nerve: ",
      "Flamethrower: No",
      "Place: 2 Gasoline",
    ],
    [
      "Payout: 32K",
      "Profit/Nerve: ",
      "Flamethrower: Yes",
      "Place: 2 Gasoline",
    ]
  ],
  "Doxing Clever": [
    "Try: Needs Thermite",
    "Profit/Nerve: ",
    "Flamethrower: ",
    "Evidence: ",
    "Place: ",
    "Stoke: ",
    "Dampen: "
  ],
  "Eight Lives": [
    [
      "Payout: 4.2K",
      "Profit/Nerve: ",
      "Flamethrower: No",
      "Place: 1 Gasoline",
      "Stoke: ",
      "Dampen: "
    ],
    [
      "Payout: 6K",
      "Profit/Nerve:  ",
      "Flamethrower: Yes",
      "Place: 1 Gasoline",
      "Stoke: ",
      "Dampen: "
    ]
  ],
  "Emotional Wreck": [
    [
      "Payout: 140K",
      "Profit/Nerve: ",
      "Flamethrower: No",
      "Place: 6 Gasoline",
      "Stoke: ",
      "Dampen: "
    ],
    [
      "Payout: 140K",
      "Profit/Nerve: ",
      "Flamethrower: Yes",
      "Place: 4 Gasoline",
      "Stoke: 1 Flamethrower",
      "Dampen: "
    ]
  ],
  "End of the Line": [
    [
      "Payout: 100K",
      "Profit/Nerve: ",
      "Flamethrower: No",
      "Place: 5 Gasoline ",
      "Stoke: ",
      "Dampen: "
    ],
    [
      "Payout: 78K",
      "Profit/Nerve: ",
      "Flamethrower: Yes",
      "Place: 3 Gasoline ",
      "Stoke: ",
      "Dampen: "
    ]
  ],
  "Faction Fiction": [
    [
      "Payout: 64.5K",
      "Profit/Nerve: ",
      "Flamethrower: No",
      "Place: 4 Gasoline",
      "Stoke: ",
      "Dampen: "
    ],
    [
      "Payout: 64.5K",
      "Profit/Nerve: ",
      "Flamethrower: Yes",
      "Place: 3 Gasoline",
      "Stoke: ",
      "Dampen: "
    ]
  ],
  "Family Feud": [
    [
      "Payout: 8K",
      "Profit/Nerve: 1.2K ",
      "Flamethrower: No",
      "Place: 2 Gasoline ",
      "Stoke: ",
      "Dampen: "
    ],
    [
      "Payout: 20K",
      "Profit/Nerve: 1.3K ",
      "Flamethrower: Yes",
      "Place: 1 Gasoline ",
      "Stoke: ",
      "Dampen: "
    ]
  ],
  "Fan the Flames": [
    "Payout: 33K",
    "Profit/Nerve: ",
    "Ignite: Lighter ",
    "Place: 1 Hydrogen Tank",
    "Stoke: ",
    "Dampen: "
  ],
  "Fight Fire With Fire": [
    "Payout: 81K",
    "Profit/Nerve: ",
    "Ignite: Lighter",
    "Place: 2 Gasoline",
    "Stoke: ",
    "Dampen: "
  ],
  "Final Cut": [
    [
      "Payout: 150K",
      "Profit/Nerve: ",
      "Flamethrower: No",
      "Place: 4 Gasoline ",
      "Stoke: ",
      "Dampen: "
    ],
    [
      "Payout: 150K",
      "Profit/Nerve: 4.9K",
      "Flamethrower: Yes",
      "Place: 4 Gasoline ",
      "Stoke: ",
      "Dampen: "
    ]
  ],
  "Final Markdown": [
    "Payout: 49K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 2 Gasoline",
    "Stoke: ",
    "Dampen: "
  ],
  "Finish Line": [
    "Profit/Nerve: ",
    "Flamethrower: ",
    "Evidence: ",
    "Place: ",
    "Stoke: ",
    "Dampen: "
  ],
  "Fire and Brimstone": [
    "Payout: 125K",
    "Profit/Nerve: ",
    "Ignite: Lighter",
    "Place: 1 Gasoline",
    "Stoke: ",
    "Dampen: "
  ],
  "Fire Burn and Cauldron Bubble": [
    [
      "Payout: 170K",
      "Profit/Nerve: ",
      "Flamethrower: No",
      "Place: 5 Gasoline",
      "Stoke: ",
      "Dampen: "
    ],
    [
      "Payout: 170K",
      "Profit/Nerve: ",
      "Flamethrower: Yes",
      "Place: 4 Gasoline",
      "Stoke: ",
      "Dampen: "
    ]
  ],
  "Fire in the Belly": [
    "Payout: 17K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 1 Gasoline",
    "Stoke: ",
    "Dampen: "
  ],
  "Fire Kills 99.9% of Bacteria": [
    "Payout: 305K",
    "Profit/Nerve: ",
    "Ignite: Lighter",
    "Place: 1 Hydrogen Tank",
    "Stoke: ",
  ],
  "Fire Sale": [
    "Payout: 10K",
    "Profit/Nerve: ",
    "Ignite: Lighter ",
    "Place: 1 Kerosene",
    "Stoke: ",
    "Dampen: "
  ],
  "Flame and Fortune": [
    "Payout: 680K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 3 Kerosene",
    "Stoke: ",
    "Dampen: "
  ],
  "Follow the Leader": [
    "Payout: 69K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 1 Hydrogen Tank",
    "Stoke: ",
    "Dampen: "
  ],
  "For Closure": [
    [
      "Payout: 22K",
      "Profit/Nerve: ",
      "Flamethrower: No",
      "Place: 2 Gasoline",
      "Stoke: ",
      "Dampen: "
    ],
    [
      "Payout: 16K",
      "Profit/Nerve: ",
      "Flamethrower: yes",
      "Place: 1 Gasoline",
      "Stoke: ",
      "Dampen: "
    ]
  ],
  "Foul Play": [
    [
      "Payout: 120K",
      "Profit/Nerve: ",
      "Flamethrower: No",
      "Place: 5 Gasoline ",
      "Stoke: ",
      "Dampen: "
    ],
    [
      "Payout: 120K",
      "Profit/Nerve: ",
      "Flamethrower: Yes",
      "Place: 4 Gasoline ",
      "Stoke: ",
      "Dampen: "
    ]
  ],
  "From the Ashes": [
    [
      "Payout: 120K",
      "Profit/Nerve: ",
      "Flamethrower: No",
      "Place: 5 Gasoline ",
      "Stoke: ",
      "Dampen: "
    ],
    [
      "Payout: 170K",
      "Profit/Nerve: 3.3K",
      "Flamethrower: Yes",
      "Place: 4 Gasoline ",
      "Stoke: ",
      "Dampen: "
    ]
  ],
  "Gay Frogs": [
    [
      "Try: 3 Gasoline",
      "Payout: 41K",
      "Profit/Nerve: 1.3K",
      "Flamethrower: No",
      "Place: 4 Gasoline",
      "Stoke: ",
      "Dampen: "
    ],
    [
      "Payout: 34K",
      "Profit/Nerve: ",
      "Flamethrower: Yes",
      "Place: 2 Gasoline",
      "Stoke: ",
      "Dampen: "
    ]
  ],
  "Gentrifried": [
    "Payout: 230K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 2 Gasoline",
    "Stoke: 2 Potassium Nitrate",
    "Dampen: "
  ],
  "Get Wrecked": [
    [
      "Payout: 90K",
      "Profit/Nerve: ",
      "Flamethrower: No",
      "Place: 4 Gasoline",
      "Stoke: ",
      "Dampen: "
    ],
    [
      "Payout: 84K",
      "Profit/Nerve: ",
      "Flamethrower: Yes",
      "Place: 2 Gasoline",
      "Stoke: ",
      "Dampen: "
    ]
  ],
  "Going Viral": [
    [
      "Payout: 190K",
      "Profit/Nerve: 4.9K",
      "Flamethrower: No",
      "Place: 4 Gasoline",
      "Stoke: ",
      "Dampen: "
    ],
    [
      "Payout: 190K",
      "Profit/Nerve: K",
      "Flamethrower: Yes",
      "Place: 3 Gasoline",
      "Stoke: ?1 Flamethrower?",
      "Dampen: "
    ]
  ],
  "Green With Envy": [
    [
      "Payout: 120K",
      "Profit/Nerve: ",
      "Flamethrower: No",
      "Place: 6 Gasoline ",
      "Stoke: ",
      "Dampen: "
    ],
    [
      "Payout: 120K",
      "Profit/Nerve: 4.5K",
      "Flamethrower: Yes",
      "Place: 4 Gasoline ",
      "Stoke: ",
      "Dampen: "
    ]
  ],
  "Gym'll Fix It": [
    [
      "Payout: 62K",
      "Profit/Nerve: ",
      "Flamethrower: No",
      "Place: 4 Gasoline",
      "Stoke: ",
      "Dampen: "
    ],
    [
      "Payout: 52K",
      "Profit/Nerve: ",
      "Flamethrower: Yes",
      "Place: 2 Gasoline",
      "Stoke: ",
      "Dampen: "
    ]
  ],
  "Hair Today...": [
    "Payout: 93K",
    "Profit/Nerve: ",
    "Ignite: Lighter",
    "Place: 1 Hydrogen Tank",
    "Stoke: 1 Hydrogen Tank",
    "Dampen: "
  ],
  "Heat the Rich": [
    [
      "Payout: 34K",
      "Profit/Nerve: ",
      "Flamethrower: No",
      "Place: 3 Gasoline",
      "Stoke: ",
      "Dampen: "
    ],
    [
      "Payout: 40K",
      "Profit/Nerve: ",
      "Flamethrower: Yes",
      "Place: 2 Gasoline",
      "Stoke: ",
      "Dampen: "
    ]
  ],
  "Hell Fire": [
    "Profit/Nerve: ",
    "Flamethrower: ",
    "Evidence: ",
    "Place: ",
    "Stoke: ",
    "Dampen: "
  ],
  "Hide and Seek": [
    [
      "Payout: 33K",
      "Profit/Nerve: ",
      "Flamethrower: No",
      "Place: 4 Gasoline",
      "Stoke: ",
      "Dampen: "
    ],
    [
      "Payout: 33K",
      "Profit/Nerve: ",
      "Flamethrower: Yes",
      "Place: 2 Gasoline",
      "Stoke: ",
      "Dampen: "
    ]
  ],
  "High Time": [
    [
      "Payout: 4.3K",
      "Profit/Nerve: ",
      "Flamethrower: No",
      "Place: 1 Gasoline",
      "Stoke: ",
      "Dampen: "
    ],
    [
      "Payout: 10K",
      "Profit/Nerve: 650",
      "Flamethrower: Yes",
      "Place: 1 Gasoline",
      "Stoke: ",
      "Dampen: "
    ]
  ],
  "Hire and Fire": [
    [
      "Payout: 49K",
      "Profit/Nerve: ",
      "Flamethrower: No",
      "Place: 3 Gasoline",
      "Stoke: ",
      "Dampen: "
    ],
    [
      "Payout: 57K",
      "Profit/Nerve: ",
      "Flamethrower: Yes",
      "Place: 2 Gasoline",
      "Stoke: ",
      "Dampen: "
    ]
  ],
  "Hold Fire": [
    "Payout: 110K",
    "Profit/Nerve:  ",
    "Ignite: Lighter",
    "Place: 1 Gasoline",
    "Stoke: ",
    "Dampen: "
  ],
  "Holy Smokes": [
    "Payout: 56.5K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 1 Gasoline",
    "Stoke: ",
    "Dampen: "
  ],
  "Home and Dry": [
    [
      "Payout: 35K",
      "Profit/Nerve: ",
      "Flamethrower: No",
      "Place: 3 Gasoline",
      "Stoke: ",
      "Dampen: "
    ],
    [
      "Payout: 49K",
      "Profit/Nerve: ",
      "Flamethrower: Yes",
      "Place: 1 Gasoline",
      "Stoke: ",
      "Dampen: "
    ]
  ],
  "Hostile Takeover": [
    "Payout: 300K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 3 Gasoline",
    "Stoke: ",
    "Dampen: "
  ],
  "Hot Dinners": [
    "Payout:55K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 1 Diesel",
    "Stoke: ",
    "Dampen: "
  ],
  "Hot Dog": [
    [
      "Payout: 38K",
      "Profit/Nerve: ",
      "Flamethrower: No",
      "Place: 3 Gasoline",
      "Stoke: ",
      "Dampen: "
    ],
    [
      "Payout: 30.5K",
      "Profit/Nerve: ",
      "Flamethrower: Yes",
      "Place: 1 Gasoline",
      "Stoke: ",
      "Dampen: "
    ]
  ],
  "Hot Gossip": [
    [
      "Payout: 62K",
      "Profit/Nerve: ",
      "Flamethrower: No",
      "Place: 3 Gasoline ",
      "Stoke: ",
      "Dampen: "
    ],
    [
      "Payout: 62K",
      "Profit/Nerve: ",
      "Flamethrower: Yes",
      "Place: 2 Gasoline ",
      "Stoke: ",
      "Dampen: "
    ]
  ],
  "Hot Off the Press": [
    "Payout: 18K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 1 Gasoline",
    "Stoke: ",
    "Dampen: "
  ],
  "Hot on the Trail": [
    "Payout: 390K",
    "Profit/Nerve: ",
    "Ignite: Lighter",
    "Place: 2 Gasoline",
    "Stoke: ",
    "Dampen: "
  ],
  "Hot out of the Gate": [
    [
      "Payout: 53K",
      "Profit/Nerve: ",
      "Flamethrower: No",
      "Evidence: 1 Gold Tooth",
      "Place: 2 Gasoline",
      "Stoke: ",
      "Dampen: "
    ],
    [
      "Payout: 96K",
      "Profit/Nerve: ",
      "Flamethrower: Yes",
      "Evidence: 1 Gold Tooth",
      "Place: 2 Gasoline",
      "Stoke: ",
      "Dampen: "
    ]
  ],
  "Hot Profit": [
    "Payout: 84K",
    "Profit/Nerve: ",
    "Flamethrower: No",
    "Place: 4 Gasoline",
    "Stoke: ",
    "Dampen: "
  ],
  "Hot Profit": [
    "Payout: 57.5K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 2 Gasoline",
    "Stoke: ",
    "Dampen: "
  ],
  "Hot Pursuit": [
    [
      "Payout: 28K",
      "Profit/Nerve: ",
      "Flamethrower: No",
      "Place: 2 Gasoline",
      "Stoke: ",
      "Dampen: "
    ],
    [
      "Payout: 50K",
      "Profit/Nerve: ",
      "Flamethrower: Yes",
      "Place: 2 Gasoline",
      "Stoke: ",
      "Dampen: "
    ]
  ],
  "Hot Trend": [
    "Payout: 54K",
    "Profit/Nerve: ",
    "Ignite: Lighter",
    "Place: 1 Kerosene",
    "Stoke: ",
    "Dampen: "
  ],
  "Hot Under the Collar": [
    "Profit/Nerve: ",
    "Flamethrower: ",
    "Evidence: ",
    "Place: ",
    "Stoke: ",
    "Dampen: "
  ],
  "House Edge": [
    [
      "Payout: 190K",
      "Profit/Nerve: ",
      "Flamethrower: No",
      "Place: 5 Gasoline",
      "Stoke: ",
      "Dampen: "
    ],
    [
      "Payout: 135K",
      "Profit/Nerve: ",
      "Flamethrower: Yes",
      "Place: 3 Gasoline",
      "Stoke: ",
      "Dampen: "
    ]
  ],
  "House of Cards": [
    "Payout: 610K",
    "Profit/Nerve: ",
    "Ignite: Lighter",
    "Place: 1 Hydrogen",
    "Stoke: 2 Hydrogen",
    "Dampen: "
  ],
  "Igniting Curiosity": [
    [
      "Payout: 100K",
      "Profit/Nerve: ",
      "Flamethrower: No",
      "Evidence: 1 Sumo Doll ",
      "Place: 3 Gasoline",
      "Stoke: ",
      "Dampen: "
    ],
    [
      "Payout: 260K",
      "Profit/Nerve: ",
      "Flamethrower: Yes",
      "Evidence: 1 Sumo Doll ",
      "Place: 4 Gasoline",
      "Stoke: ",
      "Dampen: "
    ]
  ],
  "Improving the Odds": [
    "Profit/Nerve: ",
    "Flamethrower: ",
    "Evidence: ",
    "Place: ",
    "Stoke: ",
    "Dampen: "
  ],
  "In Your Debt": [
    "Payout: 33K",
    "Profit/Nerve: ",
    "Ignite: Lighter ",
    "Place: 1 Kerosene",
    "Stoke: ",
    "Dampen: "
  ],
  "Insert Coin to Continue": [
    "Payout: 120K",
    "Profit/Nerve: ",
    "Ignite: Lighter ",
    "Place: 1 Hydrogen Tank",
    "Stoke: 1 Hydrogen Tank",
    "Dampen: "
  ],
  "It Cuts Both Ways": [
    [
      "Payout: 19K",
      "Profit/Nerve: ",
      "Flamethrower: No",
      "Place: 2 Gasoline",
      "Stoke: ",
      "Dampen: "
    ],
    [
      "Payout: 20.5K",
      "Profit/Nerve: ",
      "Flamethrower: Yes",
      "Place: 1 Gasoline",
      "Stoke: ",
      "Dampen: "
    ]
  ],
  "It's a Write Off": [
    "Payout: 225K",
    "Profit/Nerve: ",
    "Ignite: Lighter",
    "Place: 3 Gasoline",
    "Stoke: ",
    "Dampen: "
  ],
  "It's Not All White": [
    "Payout: 140K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 1 Hydrogen Tank",
    "Stoke: 1 Hydrogen Tank",
    "Dampen: "
  ],
  "Kindling Spirits": [
    [
      "Payout: 64K",
      "Profit/Nerve: ",
      "Flamethrower: No",
      "Place: 4 Gasoline",
      "Stoke: ",
      "Dampen: "
    ],
    [
      "Payout: 92.5K",
      "Profit/Nerve: ",
      "Flamethrower: Yes",
      "Place: 4 Gasoline",
      "Stoke: ",
      "Dampen: "
    ]
  ],
  "Landmark Decision": [
    "Try 4 Gas",
    "Payout: 280K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 5 Gasoline ",
  ],
  "Last Lyft Home": [
    "Payout: 52K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 2 Gasoline",
  ],
  "Letter of the Law": [
    [
      "Payout:1K",
      "Profit/Nerve: ",
      "Flamethrower: No",
      "Place: 1 Kerosene",
      "Stoke: ",
      "Dampen: "
    ],
    [
      "Payout: 360K",
      "Profit/Nerve:",
      "Flamethrower: Yes",
      "Place: 1 Hydrogen Tank",
      "Stoke: 2 Hydrogen Tank",
      "Dampen: "
    ]
  ],
  "Light Fingered": [
    [
      "Payout: 165K",
      "Profit/Nerve: ",
      "Flamethrower: No",
      "Place: 4 Gasoline",
      "Stoke: ",
      "Dampen: "
    ],
    [
      "Payout: 165K",
      "Profit/Nerve: ",
      "Flamethrower: Yes",
      "Place: 3 Gasoline",
      "Stoke: ",
      "Dampen: "
    ]
  ],
  "Like for Like": [
    "Payout: 110K",
    "Profit/Nerve: 1.1K",
    "Ignite: Lighter",
    "Place: 1 Hydrogen Tank",
    "Stoke: 1 Hydrogen Tank",
    "Dampen: "
  ],
  "Liquor on the Back Row": [
    [
      "Payout: 37K",
      "Profit/Nerve: ",
      "Flamethrower: No",
      "Place: 3 Gasoline",
      "Stoke: ",
      "Dampen: "
    ],
    [
      "Payout: 50K",
      "Profit/Nerve: ",
      "Flamethrower: Yes",
      "Place: 2 Gasoline",
    ]
  ],
  "Local Concerns": [
    [
      "Payout: 20K",
      "Profit/Nerve: ",
      "Flamethrower: No",
      "Place: 3 Gasoline",
      "Stoke: ",
      "Dampen: "
    ],
    [
      "Payout: 30K",
      "Profit/Nerve: 1.5K",
      "Flamethrower: Yes",
      "Place: 1 Gasoline",
      "Stoke: ",
      "Dampen: "
    ]
  ],
  "Lock, Stock, and Barrel": [
    "Payout: 210K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 1 Hydrogen Tank",
    "Stoke: 1 Hydrogen Tank"
  ],
  "Long Pig": [
    "Payout: 130K",
    "Profit/Nerve: ",
    "Ignite: Lighter",
    "Place: 2 Gasoline",
    "Stoke: ",
    "Dampen: "
  ],
  "Loud and Clear": [
    "Payout: 195K",
    "Profit/Nerve: ",
    "Ignite: Lighter",
    "Place: 2 Gasoline",
    "Stoke: ",
    "Dampen: "
  ],
  "Lover's Quarrel": [
    "Payout: 39K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 2 Gasoline",
    "Stoke: ",
    "Dampen: "
  ],
  "Low Rent": [
    "Payout: 120K",
    "Profit/Nerve: ",
    "Ignite: Lighter",
    "Place: 1 Hydrogen Tank",
    "Stoke: 1 Hydrogen Tank",
    "Dampen: "
  ],
  "Make a Killing": [
    [
      "Payout:260K",
      "Profit/Nerve: ",
      "Flametrhower: No",
      "Place: 1 Gasoline, 2 Kerosene",
      "Stoke: ",
      "Dampen: "
    ],
    [
      "Payout: 390k",
      "Profit/Nerve: ",
      "Flamethrower: Yes",
      "Place: 1 Gasoline, 2 Kerosene",
      "Stoke: ",
      "Dampen: "
    ]
  ],
  "Marked for Salvation": [
    [
      "Payout:30K",
      "Profit/Nerve: ",
      "Flamethrower: No",
      "Place: 1 Hydrogen Tank ",
      "Stoke: ",
      "Dampen: "
    ],
    [
      "Payout: 80K",
      "Profit/Nerve: ",
      "Flamethrower: Yes",
      "Place: 1 Kerosene",
      "Stoke: ",
      "Dampen: "
    ]
  ],
  "Mallrats": [
    "Tip: fast responders",
    "Payout: 410K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 4 Gasoline ",
    "Stoke: 1 Flamethrower",
    "Dampen: "
  ],
  "Marx & Sparks": [
    [
      "Payout: 140K",
      "Profit/Nerve: ",
      "Flamethrower: No",
      "Place: 4 Gasoline",
      "Stoke: ",
      "Dampen: "
    ],
    [
      "Payout: 125K",
      "Profit/Nerve: ",
      "Flamethrower: yes",
      "Place: 3 Gasoline",
      "Stoke: ",
      "Dampen: "
    ]
  ],
  "Medium Rare": [
    "Payout: 330K",
    "Profit/Nerve: ",
    "Ignite: Lighter",
    "Place: 4 Diesel",
    "Stoke: ",
    "Dampen: "
  ],
  "Mental Block": [
    "Payout: 580K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 5 Gasoline, 1 Thermite",
    "Stoke: ?1 Flamethrower?",
    "Dampen: "
  ],
  "Milk Milk, Lemonade": [
    "Payout: 155K",
    "Profit/Nerve: ",
    "Ignite: Lighter ",
    "Place: 1 Gasoline ",
    "Stoke: ",
    "Dampen:  "
  ],
  "Muscling In": [
    "Payout: 90.5K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Evidence: 1 Syringe",
    "Place: 2 Gasoline",
    "Stoke: ",
    "Dampen: "
  ],
  "Naked Aggression": [
    [
      "Payout:31.5K",
      "Profit/Nerve: ",
      "Flamethrower: No",
      "Place: 4 Gasoline",
      "Stoke: ",
      "Dampen: "
    ],
    [
      "Payout: 31.5K",
      "Profit/Nerve: ",
      "Flamethrower: Yes",
      "Place: 2 Gasoline",
      "Stoke: 1 Flamethrower",
      "Dampen: "
    ]
  ],
  "Needles to Say": [
    [
      "Payout: 23K",
      "Profit/Nerve: ",
      "Flamethrower: No",
      "Place: 2 Gasoline",
      "Stoke: ",
      "Dampen: "
    ],
    [
      "Payout: 39K",
      "Profit/Nerve: ",
      "Flamethrower: Yes",
      "Place: 1 Gasoline",
      "Stoke: ",
      "Dampen: "
    ]
  ],
  "Not a Leg to Stand on": [
    [
      "Payout: 150K",
      "Profit/Nerve: ",
      "Flamethrower: No",
      "Place: 6 Gasoline",
      "Stoke: ",
      "Dampen: "
    ],
    [
      "Payout: 125K",
      "Profit/Nerve: ",
      "Flamethrower: Yes",
      "Place: 3 Gasoline",
      "Stoke: ",
      "Dampen: "
    ]
  ],
  "Off the Market": [
    [
      "Payout: 30K",
      "Profit/Nerve: ",
      "Flamethrower: No",
      "Place: 1 Kerosene",
      "Stoke: ",
      "Dampen: "
    ],
    [
      "Payout: 155K",
      "Profit/Nerve: 4.5K",
      "Flamethrower: Yes",
      "Place: 1 Hydrogen Tank",
      "Stoke: 1 Hydrogen Tank",
      "Dampen: "
    ]
  ],
  "Oh God, Yes": [
    "Payout: 17.5K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 1 Gasoline ",
    "Stoke: ",
    "Dampen: "
  ],
  "Old School": [
    [
      "Payout: 62K",
      "Profit/Nerve: 2K",
      "Flamethrower: No",
      "Place: 4 Gasoline",
      "Stoke: ",
      "Dampen: "
    ],
    [
      "Payout: 62.5K",
      "Profit/Nerve: 2.3K",
      "Flamethrower: Yes",
      "Place: 3 Gasoline",
      "Stoke: ",
      "Dampen: "
    ]
  ],
  "On Fire at the Box Office": [
    [
      "Payout: 10K",
      "Profit/Nerve: ",
      "Flamethrower: No",
      "Place: 1 Hydrogen Tank",
      "Stoke: ",
      "Dampen: "
    ],
    [
      "Payout: 14K",
      "Profit/Nerve: ",
      "Flamethrower: Yes",
      "Place: 1 Hydrogen Tank",
      "Stoke: ",
      "Dampen: "
    ]
  ],
  "One Rotten Apple": [
    [
      "Payout: 180K",
      "Profit/Nerve: 8.5K",
      "Flamethrower: No",
      "Place: 3 Gasoline ",
      "Stoke: ",
      "Dampen: "
    ],
    [
      "Payout: 180K",
      "Profit/Nerve: 11.9K",
      "Flamethrower: Yes",
      "Place: 2 Gasoline ",
      "Stoke: ",
      "Dampen: "
    ]
  ],
  "Open House": [
    "Payout: 64K",
    "Profit/Nerve: ",
    "Ignite: Lighter ",
    "Place: 1 Gasoline",
    "Stoke: ",
    "Dampen: "
  ],
  "Out in the Wash": [
    [
      "Payout: 235K",
      "Profit/Nerve: ",
      "Flamethrower: No",
      "Place: 3 Gasoline",
      "Stoke: ",
      "Dampen: "
    ],
    [
      "Payout: 235K",
      "Profit/Nerve: ",
      "Flamethrower: Yes",
      "Place: 2 Gasoline",
      "Stoke: ",
      "Dampen: "
    ]
  ],
  "Out with a Bang": [
    "Payout: 42K",
    "Profit/Nerve: ",
    "Ignite: Lighter ",
    "Place: 1 Gasoline",
    "Dampen: 1 Blanket "
  ],
  "Party Pooper": [
    [
      "Payout: 58K",
      "Profit/Nerve: 2.3K",
      "Flamethrower: No",
      "Place: 3 Gasoline",
      "Stoke: ",
      "Dampen: "
    ],
    [
      "Payout: 62K",
      "Profit/Nerve: 3.3K",
      "Flamethrower: Yes",
      "Place: 2 Gasoline",
      "Stoke: ",
      "Dampen: "
    ]
  ],
  "Pest Control": [
    "Payout: 16K",
    "Profit/Nerve: ",
    "Ignite: Lighter ",
    "Place: 1 Hydrogen Tank",
    "Stoke: ",
    "Dampen: "
  ],
  "Piggy in the Middle": [
    "Payout: 73K",
    "Profit/Nerve: ",
    "Flamethrower: No",
    "Place: 3 Gasoline ",
    "Stoke: ",
    "Dampen: "
  ],
  "Piggy in the Middle": [
    "Payout: 104K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 2 Gasoline ",
    "Stoke: ",
    "Dampen: "
  ],
  "Plane and Simple": [
    "Profit/Nerve: ",
    "Flamethrower: ",
    "Evidence: ",
    "Place: ",
    "Stoke: ",
    "Dampen: "
  ],
  "Planted": [
    "Payout: 120K",
    "Profit/Nerve: ",
    "Ignite: Lighter",
    "Evidence: 1 Pele Charm",
    "Place: 1 Gasoline",
    "Stoke: ",
    "Dampen: "
  ],
  "Playing With Fire": [
    "Payout: 210K",
    "Profit/Nerve: ",
    "Ignite: Lighter",
    "Place: 2 Gasoline ",
    "Stoke: ",
    "Dampen: "
  ],
  "Point of No Return": [
    "Payout: 90K",
    "Profit/Nerve: ",
    "Flamethrower: ",
    "Place: 1 Gasoline, 1 Thermite",
    "Stoke: 2 Magnesium Shavings",
    "Dampen: "
  ],
  "Political Firestorm": [
    [
      "Payout: 22K",
      "Profit/Nerve: ",
      "Flamethrower: No",
      "Place: 2 Gasoline",
      "Stoke: ",
      "Dampen: "
    ],
    [
      "Payout: 40K",
      "Profit/Nerve: ",
      "Flamethrower: Yes",
      "Place: 2 Gasoline",
      "Stoke: ",
      "Dampen: "
    ]
  ],
  "Pyro for Pornos": [
    "Payout: 65K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 2 Gasoline",
  ],
  "Raising Hell": [
    [
      "Payout: 170K",
      "Profit/Nerve: ",
      "Flamethrower: No",
      "Place: 6 Gasoline",
      "Stoke: ",
      "Dampen: "
    ],
    [
      "Payout: 170K",
      "Profit/Nerve: ",
      "Flamethrower: Yes",
      "Place: 3 Gasoline",
      "Stoke: 1 Flamethrower",
      "Dampen: "
    ]
  ],
  "Raze the Roof": [
    "Payout: 90k",
    "Profit/Nerve: 150",
    "Ignite: Lighter ",
    "Place: 1 Hydrogen Tank",
    "Stoke: 1 Hydrogen Tank",
    "Dampen: "
  ],
  "Raze the Steaks": [
    "Payout: 250K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 5 Gasoline",
    "Stoke: ",
    "Dampen: "
  ],
  "Read the Room": [
    [
      "Payout: 125K",
      "Profit/Nerve: ",
      "Flamethrower: No",
      "Place: 5 Gasoline",
      "Stoke: ",
      "Dampen: "
    ],
    [
      "Payout: 125K",
      "Try: 3 Gas",
      "Profit/Nerve: ",
      "Flamethrower: Yes",
      "Place: 4 Gasoline",
      "Stoke: ",
      "Dampen: "
    ]
  ],
  "Remote Possibility": [
    "Payout: 102.5K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 3 Gasoline",
  ],
  "Rest in Peace": [
    "Payout: 20.5K",
    "Profit/Nerve: 1.6K",
    "Flamethrower: Yes",
    "Place: 1 Gasoline",
    "Stoke: ",
    "Dampen: "
  ],
  "Ring of Fire": [
    "Payout: 160K",
    "Profit/Nerve: ",
    "Ignite: Lighter",
    "Place: 1 Hydrogen Tank",
    "Stoke: 1 Hydrogen Tank",
    "Dampen: "
  ],
  "Risky Business": [
    "Payout: 50K",
    "Profit/Nerve: ",
    "Ignition: Lighter ",
    "Place: 1 Kerosene",
    "Stoke: ",
    "Dampen: "
  ],
  "Roast Beef": [
    "Profit/Nerve: ",
    "Flamethrower: ",
    "Evidence: ",
    "Place: ",
    "Stoke: ",
    "Dampen: "
  ],
  "Rock the Boat": [
    "Payout: 325K",
    "Profit/Nerve: ",
    "Ignite: Lighter ",
    "Place: 1 Diesel",
    "Stoke: ",
    "Dampen: "
  ],
  "Searing Irony": [
    "Payout: 240K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 4 Gasoline",
    "Stoke: ",
    "Dampen: "
  ],
  "Second Hand Smoke": [
    "Payout: 37K",
    "Profit/Nerve: ",
    "Ignite: Lighter ",
    "Place: 1 Kerosene",
    "Stoke: ",
    "Dampen: "
  ],
  "See No Evil": [
    [
      "Payout: 52K",
      "Profit/Nerve: ",
      "Flamethrower: No",
      "Place: 3 Gasoline",
      "Stoke: ",
      "Dampen: "
    ],
    [
      "Payout:71K",
      "Profit/Nerve: 3.6K",
      "Flamethrower: Yes",
      "Place: 3 Gasoline",
      "Stoke: ",
      "Dampen: "
    ]
  ],
  "Set 'Em Straight": [
    "Payout: 310K",
    "Profit/Nerve: ",
    "Ignite: Lighter",
    "Place: 1 Hydrogen Tank",
    "Stoke: 1 Hydrogen Tank",
    "Dampen: "
  ],
  "Shaky Investment": [
    "Payout: 80K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 1 Hydrogen Tank",
    "Stoke: ",
    "Dampen: "
  ],
  "Shielded from the Truth": [
    [
      "Payout: 8.9K",
      "Profit/Nerve: 850",
      "Flamethrower: No",
      "Place: 1 Gasoline ",
      "Stoke: ",
      "Dampen: "
    ],
    [
      "Payout: 16K",
      "Profit/Nerve: ",
      "Flamethrower: Yes",
      "Place: 1 Gasoline ",
      "Stoke: ",
      "Dampen: "
    ]
  ],
  "Short Shelf Life": [
    "Payout: 395K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 2 Gasoline ",
    "Stoke: ",
    "Dampen: "
  ],
  "Sky High Prices": [
    "Profit/Nerve: ",
    "Flamethrower: ",
    "Evidence: Glitter Bomb",
    "Place: ",
    "Stoke: ",
    "Dampen: "
  ],
  "Smoke on the Water": [
    [
      "Payout: 4.2K",
      "Profit/Nerve: ",
      "Flamethrower: No",
      "Place: 1 Gasoline",
      "Stoke: ",
      "Dampen: "
    ],
    [
      "Payout: 8.6K",
      "Profit/Nerve: ",
      "Flamethrower: Yes",
      "Place: 1 Gasoline",
      "Stoke: ",
      "Dampen: "
    ]
  ],
  "Smoke Out": [
    [
      "Payout: 10K",
      "Profit/Nerve: ",
      "Flamethrower: No",
      "Evidence: 1 Cannabis",
      "Place: 1 Gasoline",
      "Stoke: ",
      "Dampen: "
    ],
    [
      "Payout: 21K",
      "Profit/Nerve: ",
      "Flamethrower: Yes",
      "Evidence: 1 Cannabis",
      "Place: 1 Gasoline",
      "Stoke: ",
      "Dampen: "
    ]
  ],
  "Smoke Signals": [
    "Try: Try 2 Diesel",
    "Payout: 120K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 2 Diesel, 1 Magnesium Shavings",
    "Stoke: ",
    "Dampen: "
  ],
  "Smoke Screen": [
    "Payout: 535K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 3 Gasoline",
    "Stoke: ?1 Flamethrower?",
    "Dampen: "
  ],
  "Smoke Without Fire": [
    "Payout: 200K",
    "Profit/Nerve: ",
    "Ignite: Lighter",
    "Place: 2 Gasoline",
    "Stoke: ",
    "Dampen: "
  ],
  "Smoldering Resentment": [
    [
      "Profit/Nerve: ",
      "Flamethrower: No",
      "Evidence: ",
      "Place: ",
      "Stoke: ",
      "Dampen: "
    ],
    [
      "Payout: 10K",
      "Profit/Nerve: 950",
      "Flamethrower: Yes",
      "Place: 1 Gasoline",
      "Stoke: ",
      "Dampen: "
    ]
  ],
  "Sofa King Cheap": [
    "Payout: 120K",
    "Profit/Nerve: ",
    "Ignite: Lighter",
    "Place: 1 Hydrogen Tank",
    "Stoke: 1 Hydrogen Tank",
    "Dampen: "
  ],
  "Specter of Destruction": [
    "Payout: 74K",
    "Profit/Nerve: ",
    "Flamethrower: ",
    "Evidence: 1 Elephant Statue",
    "Place: 1 Gasoline",
    "Stoke: ",
    "Dampen: "
  ],
  "Spirit Level": [
    "Payout: 280k",
    "Profit/Nerve:",
    "Flamethrower: Yes",
    "Place: 3 Gasoline",
    "Stoke:",
    "Dampen: "
  ],
  "Stick to the Script": [
    "Payout: 160K",
    "Profit/Nerve: ",
    "Ignite: Lighter",
    "Place: 1 Hydrogen Tank",
    "Stoke: 2 Hydrogen Tank",
    "Dampen: "
  ],
  "Stink to High Heaven": [
    "Payout: 41K",
    "Profit/Nerve: ",
    "Ignite: Lighter",
    "Place: 1 Kerosene",
    "Stoke: ",
    "Dampen: "
  ],
  "Stop, Drop and Lol": [
    "Profit/Nerve: ",
    "Flamethrower: ",
    "Evidence: ",
    "Place: ",
    "Stoke: ",
    "Dampen: "
  ],
  "Strike While it's Hot": [
    "Payout: 265K",
    "Profit/Nerve: ",
    "Ignite: Lighter",
    "Place: 1 Hydrogen Tank",
    "Stoke: 2 Hydrogen Tank",
    "Dampen: "
  ],
  "Stroke of Fortune": [
    [
      "Payout: 120K",
      "Profit/Nerve: ",
      "Flamethrower: No",
      "Place: 6 Gasoline",
      "Stoke: ",
    ],
    [
      "Payout: 120K",
      "Profit/Nerve: ",
      "Flamethrower: Yes",
      "Place: 3 Gasoline",
      "Stoke: 1 Flamethrower",
    ]
  ],
  "Supermarket Sweep": [
    [
      "Payout: 265K",
      "Profit/Nerve:",
      "Flamethrower: No",
      "Place: 5 Gasoline",
      "Stoke: 1 Lighter",
      "Dampen: "
    ],
    [
      "Payout: 265K",
      "Profit/Nerve:",
      "Flamethrower: Yes",
      "Place: 5 Gasoline",
      "Stoke: ",
      "Dampen: "
    ]
  ],
  "Swansong": [
    "Payout: 27K",
    "Profit/Nerve: ",
    "Ignite: Lighter",
    "Place: 1 Kerosene",
    "Stoke: ",
    "Dampen: "
  ],
  "Taking out the Trash": [
    "Payout:110K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Evidence: 1 Hard Drive",
    "Place: 3 Gasoline",
    "Stoke: ",
    "Dampen: "
  ],
  "That Place Is History": [
    [
      "Payout:90K",
      "Profit/Nerve: ",
      "Flamethrower: No",
      "Place: 4 Gasoline",
      "Stoke: ",
      "Dampen: "
    ],
    [
      "Payout: 118.5K",
      "Profit/Nerve: ",
      "Flamethrower: Yes",
      "Place: 3 Gasoline",
      "Stoke: ",
      "Dampen: "
    ]
  ],
  "The Ashes of Empire": [
    "Payout: 175K",
    "Profit/Nerve: ",
    "Ignite: Lighter",
    "Place: 2 Gasoline ",
    "Dampen: "
  ],
  "The Bad Samaritan": [
    "Payout: 22K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 2 Gasoline",
    "Stoke: 1 Flamethrower",
    "Dampen: "
  ],
  "The Bolted Horse": [
    "Profit/Nerve: ",
    "Flamethrower: ",
    "Evidence: ",
    "Place: ",
    "Stoke: ",
    "Dampen: "
  ],
  "The Declaration of Inebrience": [
    [
      "Payout: 115K",
      "Profit/Nerve: ",
      "Flamethrower: No",
      "Place: 3 Gasoline",
      "Stoke: ",
      "Dampen: "
    ],
    [
      "Payout: 115K",
      "Profit/Nerve: ",
      "Flamethrower: Yes",
      "Place: 3 Gasoline",
      "Stoke: ",
      "Dampen: "
    ]
  ],
  "The Devil's in the Details": [
    [
      "Payout: 73K",
      "Profit/Nerve: Negative",
      "Flamethrower: No",
      "Place: 3 Diesel",
      "Stoke: ",
      "Dampen: "
    ],
    [
      "might fail",
      "Payout: 130K",
      "Profit/Nerve: 750",
      "Flamethrower: Yes",
      "Place: 1 Diesel",
      "Stoke: 1 Potassium Nitrate",
      "Dampen: "
    ]
  ],
  "The Empyre Strikes Back": [
    [
      "Payout: 49K",
      "Profit/Nerve: 1.8K",
      "Flamethrower: No",
      "Place: 5 Gasoline",
      "Stoke: ",
      "Dampen: "
    ],
    [
      "Payout: 49K",
      "Profit/Nerve: 2.4K",
      "Flamethrower: Yes",
      "Place: 2 Gasoline",
      "Stoke: ",
      "Dampen: "
    ]
  ],
  "The Fat is in the Fire": [
    "Payout: 300k",
    "Profit/Nerve: ",
    "Flamethrower: yes",
    "Place: 5 Gasoline",
    "Stoke: 1 Flamethrower",
    "Dampen: "
  ],
  "The Fire Chief": [
    [
      "Payout: 130K",
      "Profit/Nerve: ",
      "Flamethrower: No",
      "Place: 6 Gasoline",
      "Stoke: ",
      "Dampen: "
    ],
    [
      "Payout: 140K",
      "Profit/Nerve: ",
      "Flamethrower: Yes",
      "Place: 3 Gasoline",
      "Stoke: 1 Flamethrower",
      "Dampen: "
    ]
  ],
  "The Fried Piper": [
    "Payout: 270K",
    "Profit/Nerve: 14.9K",
    "Ignite: Lighter ",
    "Place: 1 Hydrogen Tank ",
  ],
  "The Grass Ain't Greener": [
    [
      "Payout: 85K",
      "Profit/Nerve: ",
      "Flamethrower: No",
      "Place: 4 Gasoline",
      "Stoke: 1 Diesel",
      "Dampen: "
    ],
    [
      "Payout: 85K",
      "Profit/Nerve: ",
      "Flamethrower: Yes",
      "Place: 4 Gasoline",
      "Stoke: ",
      "Dampen: "
    ]
  ],
  "The Male Gaze": [
    [
      "Payout: 130K",
      "Profit/Nerve: ",
      "Flamethrower: No",
      "Place: 4 Gasoline",
      "Stoke: ",
      "Dampen: "
    ],
    [
      "Payout: 110K",
      "Profit/Nerve: ",
      "Flamethrower: Yes",
      "Place: 3 Gasoline",
      "Stoke: ",
      "Dampen: "
    ]
  ],
  "The Midnight Oil": [
    [
      "Payout:63K",
      "Profit/Nerve: ",
      "Flamethrower: No",
      "Place: 4 Gasoline",
      "Stoke: ",
      "Dampen: "
    ],
    [
      "Payout: 75K",
      "Profit/Nerve: ",
      "Flamethrower: Yes ",
      "Place: 3 Gasoline",
      "Stoke: ",
      "Dampen: "
    ]
  ],
  "The Plane Truth": [
    [
      "Payout: 38K",
      "Profit/Nerve: ",
      "Flamethrower: No",
      "Place: 3 Gasoline",
      "Stoke: ",
      "Dampen: "
    ],
    [
      "Payout: 25K",
      "Profit/Nerve: ",
      "Flamethrower: Yes",
      "Place: 1 Gasoline",
      "Stoke: ",
      "Dampen: "
    ]
  ],
  "The Savage Beast": [
    "Payout: 170K",
    "Profit/Nerve: ",
    "Ignite: Lighter",
    "Place: 3 Gasoline",
    "Stoke: ",
    "Dampen: "
  ],
  "The Smoking Gun": [
    "Payout: 470K",
    "Profit/Nerve: ",
    "Ignite: Lighter",
    "Place: 4 Kerosene",
    "Stoke: ?1 Lighter? ",
    "Dampen: "
  ],
  "The Waiting Game": [
    "Payout: 120K",
    "Profit/Nerve: ",
    "Ignite: Lighter",
    "Place: 1 Gasoline",
    "Stoke: ",
    "Dampen: "
  ],
  "Third-Degree Burn": [
    [
      "Payout: 25.5K",
      "Profit/Nerve: 1.6K",
      "Flamethrower: No",
      "Place: 2 Gasoline ",
      "Stoke: ",
      "Dampen: "
    ],
    [
      "Payout: 29K",
      "Profit/Nerve: 2.2K",
      "Flamethrower: Yes",
      "Place: 1 Gasoline ",
      "Stoke: ",
      "Dampen: "
    ]
  ],
  "To the Manor Scorned": [
    "Payout: 75.5K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 3 Gasoline",
    "Stoke: ",
    "Dampen: "
  ],
  "Totally Armless": [
    [
      "Payout: 44K",
      "Profit/Nerve: ",
      "Flamethrower: No",
      "Place: 2 Kerosene",
      "Stoke: ",
      "Dampen: "
    ],
    [
      "Payout: 35K",
      "Profit/Nerve: ",
      "Flamethrower: Yes",
      "Place: 1 Gasoline",
      "Stoke: ",
      "Dampen: "
    ]
  ],
  "Turn up the Heat": [
    [
      "Payout: 90K",
      "Profit/Nerve: ",
      "Flamethrower: No",
      "Evidence: 1 Compass",
      "Place: 4 Gasoline",
    ],
    [
      "Payout: 76K",
      "Profit/Nerve: 1.6K",
      "Flamethrower: Yes",
      "Evidence: 1 Compass",
      "Place: 2 Gasoline",
    ]
  ],
  "Twisted Firestarter": [
    [
      "Payout: 32K",
      "Profit/Nerve: ",
      "Flamethrower: No",
      "Place: 3 Gasoline",
      "Stoke: ",
      "Dampen: "
    ],
    [
      "Payout: 23K",
      "Profit/Nerve: ",
      "Flamethrower: Yes",
      "Place: 1 Gasoline",
      "Stoke: ",
      "Dampen: "
    ]
  ],
  "Uber Heats": [
    [
      "Payout: 78K",
      "Profit/Nerve: ",
      "Flamethrower: No",
      "Place: 4 Gasoline ",
      "Stoke: ",
      "Dampen: "
    ],
    [
      "Payout: 59K",
      "Profit/Nerve: ",
      "Flamethrower: Yes",
      "Place: 2 Gasoline ",
      "Stoke: ",
      "Dampen: "
    ]
  ],
  "Under the Table": [
    "Try: gas, lighter, 2 methane",
    "Payout: 400K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 2 Gasoline ",
    "Stoke: ?1 Flamethrower?",
    "Dampen: "
  ],
  "Unpopular Mechanics": [
    [
      "Payout: 4.5K",
      "Profit/Nerve: ",
      "Flamethrower: No",
      "Place: 1 Gasoline ",
      "Stoke: ",
      "Dampen: "
    ],
    [
      "Payout: 8.6K",
      "Profit/Nerve: ",
      "Flamethrower: yes",
      "Place: 1 Gasoline ",
      "Stoke: ",
      "Dampen: "
    ]
  ],
  "Unspilled Beans": [
    "Payout: 220K",
    "Profit/Nerve: ",
    "Ignite: Lighter ",
    "Place: 1 Hydrogen Tank",
    "Stoke: 2 Hydrogen Tank",
    "Dampen: "
  ],
  "Visions of the Savory": [
    [
      "Payout: 70K",
      "Profit/Nerve: ",
      "Flamethrower: No",
      "Evidence: 1 Family Photo",
      "Place: 3 Gasoline",
      "Stoke: ",
      "Dampen: "
    ],
    [
      "Payout: 110K",
      "Profit/Nerve: ",
      "Flamethrower: Yes",
      "Evidence:  1 Family Photo",
      "Place: 3 Gasoline",
      "Stoke: ",
      "Dampen: "
    ]
  ],
  "Waist Not, Want Not": [
    "Payout: 210K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 4 Gasoline",
    "Stoke: ",
    "Dampen: "
  ],
  "Wedded to the Lie": [
    [
      "Payout: 81K",
      "Profit/Nerve: ",
      "Flamethrower: No",
      "Place: 4 Gasoline",
      "Stoke: ",
      "Dampen: "
    ],
    [
      "Payout: 69K",
      "Profit/Nerve: ",
      "Flamethrower: Yes",
      "Place: 3 Gasoline",
      "Stoke: ",
      "Dampen: "
    ]
  ],
  "Wet Behind the Ears": [
    [
      "Payout: 240k",
      "Profit/Nerve: ",
      "Flamethrower: No",
      "Place: 2 Gasoline",
      "Stoke: ",
      "Dampen: "
    ],
    [
      "Payout: 200k",
      "Profit/Nerve: ",
      "Flamethrower: Yes",
      "Place: 1 Gasoline",
      "Stoke: ",
      "Dampen: "
    ]
  ],
  "Where There's a Will": [
    [
      "Payout: 23K",
      "Profit/Nerve: ",
      "Flamethrower: No",
      "Evidence: ",
      "Place: 2 Gasoline",
      "Stoke: ",
      "Dampen: "
    ],
    [
      "Payout: 52K",
      "Profit/Nerve: ",
      "Flamethrower: Yes",
      "Evidence: ",
      "Place: 3 Gasoline",
      "Stoke: ",
      "Dampen: "
    ]
  ],
  "Whiskey Business": [
    "Payout: 90K",
    "Profit/Nerve: ",
    "Ignite: Lighter ",
    "Place: 1 Hydrogen Tank",
    "Stoke: 1 Hydrogen Tank",
    "Dampen: "
  ],
  "Wired for War": [
    "Payout:430K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 8 Gasoline",
    "Stoke: ",
    "Dampen: "
  ],
  "Womb With a View": [
    [
      "Payout: 95K",
      "Profit/Nerve: ",
      "Flamethrower: No",
      "Place: 4 Gasoline",
    ],
    [
      "Payout: 78.5K",
      "Profit/Nerve: ",
      "Flamethrower: Yes",
      "Place: 2 Gasoline",
    ]
  ],
  "Workplace Burnout": [
    [
      "Payout: 100K",
      "Profit/Nerve: ",
      "Flamethrower: No",
      "Place: 4 Gasoline",
      "Stoke: ",
      "Dampen: "
    ],
    [
      "Payout: 73K",
      "Profit/Nerve: ",
      "Flamethrower: Yes",
      "Place: 2 Gasoline",
      "Stoke: ",
      "Dampen: "
    ]
  ],
  "You're Fired!": [
    "Payout: 150K",
    "Profit/Nerve: 4.4K",
    "Flamethrower: ",
    "Evidence: 1 Lipstick",
    "Place: 4 Gasoline",
    "Stoke: ",
    "Dampen: "
  ]
};