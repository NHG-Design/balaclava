const ACCELERANTS = {
  "Gasoline": {
    "type": "Liquid",
    "intensity": "5%",
    "intensity_abs": 1.5,
    "momentum": "HIGH",
    "momentum_abs": 6,
    "spread": "37.5%",
    "ignition_risk": 1,
    "stoking_risk": 7,
    "suspicion": 9,
    "advice": "Use up to 1+Number of areas (max 6). Cheap but risky when stoking."
  },
  "Diesel": {
    "type": "Liquid",
    "intensity": "5.25%",
    "intensity_abs": 2,
    "momentum": "HIGH",
    "momentum_abs": 5,
    "spread": "16%",
    "ignition_risk": 0,
    "stoking_risk": 1,
    "suspicion": 7,
    "advice": "Lowers crit-rate on ignition, increases visibility. Best combined with solids."
  },
  "Kerosene": {
    "type": "Liquid",
    "intensity": "5.25%",
    "intensity_abs": 2,
    "momentum": "BEST",
    "momentum_abs": 10,
    "spread": "25%",
    "ignition_risk": 1,
    "stoking_risk": 3,
    "suspicion": 3,
    "advice": "Great as starter, insurance jobs, and small fires. Increases momentum in single area."
  },
  "Potassium Nitrate": {
    "type": "Solid",
    "intensity": "31.25%",
    "intensity_abs": 10,
    "momentum": "HIGH",
    "momentum_abs": 6,
    "spread": "0%",
    "ignition_risk": 3,
    "stoking_risk": 1,
    "suspicion": 3,
    "advice": "Increases intensity by 25% of current intensity in single area."
  },
  "Magnesium Shavings": {
    "type": "Solid",
    "intensity": "27.5%",
    "intensity_abs": 8,
    "momentum": "HIGH",
    "momentum_abs": 6,
    "spread": "0%",
    "ignition_risk": 3,
    "stoking_risk": 4,
    "suspicion": 10,
    "advice": "Halves dampening effectiveness and intensity decay from firefighters. Increases visibility."
  },
  "Thermite": {
    "type": "Solid",
    "intensity": "22.5%",
    "intensity_abs": 7,
    "momentum": "MID",
    "momentum_abs": 4,
    "spread": "0%",
    "ignition_risk": 3,
    "stoking_risk": 7,
    "suspicion": 7,
    "advice": "Best as starter for total destruction. Multiplies damage rate for each use."
  },
  "Oxygen": {
    "type": "Gaseous",
    "intensity": "20%",
    "intensity_abs": 6,
    "momentum": "LOW",
    "momentum_abs": 2,
    "spread": "65%",
    "ignition_risk": 2,
    "stoking_risk": 1,
    "suspicion": 1,
    "advice": "Terrible starter, excellent for stoking size 4-5. Increases intensity by 25% of current in all areas."
  },
  "Methane": {
    "type": "Gaseous",
    "intensity": "15.6%",
    "intensity_abs": 4,
    "momentum": "LOW",
    "momentum_abs": 1,
    "spread": "84%",
    "ignition_risk": 2,
    "stoking_risk": 3,
    "suspicion": -3,
    "advice": "Excellent spread for large targets. Lowers accumulated suspicion."
  },
  "Hydrogen": {
    "type": "Gaseous",
    "intensity": "14%",
    "intensity_abs": 4,
    "momentum": "LOW",
    "momentum_abs": 1,
    "spread": "100%",
    "ignition_risk": 2,
    "stoking_risk": 3,
    "suspicion": 1,
    "advice": "Averages intensity and momentum across all areas. Best for size 3-5 targets."
  }
};

const IGNITERS = {
  "Windproof Lighter": {
    "suspicion": 1,
    "advice": "Enhanced lighter. Same base stats as Lighter but works in adverse conditions."
  },
  "Molotov": {
    "suspicion": 6,
    "advice": "Moderately high intensity/momentum to area with lowest intensity. Fixed crit rate."
  },
  "Flamethrower": {
    "suspicion": 8,
    "advice": "High intensity/momentum randomly across areas. Riskiest ignition choice."
  }
};

const DAMPENERS = {
  "Blanket": {
    "advice": "Lowers intensity and momentum by ~25%. Has high crit rate (~20% with low skill). May be lost on fail."
  },
  "Sand": {
    "effect": "Twice as effective and half as risky as a Blanket. Effective for controlled burns. Is consumed on use.",
  },
  "Fire Extinguisher": {
    "effect": "As effective as Sand, but safer to use. Is consumed on use.",
  }
};

const BUILDINGS = {
  "Bazaar": {
    "areas": 1,
    "response_time": 60,
    "rurality": 2,
    "dps": "1.6/s",
    "flammability": 4,
    "urgency": 4
  },
  "Beach Hut": {
    "areas": 1,
    "response_time": 120,
    "rurality": 3,
    "dps": "2/s",
    "flammability": 5,
    "urgency": 1
  },
  "Firework Store": {
    "areas": 1,
    "response_time": 60,
    "rurality": 2,
    "dps": null,
    "flammability": -1,
    "urgency": null
  },
  "Fishing Hut": {
    "areas": 1,
    "response_time": 480,
    "rurality": 5,
    "dps": "2/s",
    "flammability": 5,
    "urgency": 1
  },
  "Forgery Workshop": {
    "areas": 1,
    "response_time": 480,
    "rurality": 5,
    "dps": "1.2/s",
    "flammability": 3,
    "urgency": 1
  },
  "Hunting Lodge": {
    "areas": 1,
    "response_time": 480,
    "rurality": 5,
    "dps": "1.6/s",
    "flammability": 4,
    "urgency": 1
  },
  "Lifeguard Hut": {
    "areas": 1,
    "response_time": 120,
    "rurality": 3,
    "dps": "1.6/s",
    "flammability": 4,
    "urgency": 2
  },
  "Mobile Home": {
    "areas": 1,
    "response_time": 120,
    "rurality": 3,
    "dps": "1.6/s",
    "flammability": 4,
    "urgency": 2
  },
  "Restroom": {
    "areas": 1,
    "response_time": 120,
    "rurality": 3,
    "dps": "0.4/s",
    "flammability": 1,
    "urgency": 6
  },
  "Self Storage Container": {
    "areas": 1,
    "response_time": 240,
    "rurality": 4,
    "dps": "1.2/s",
    "flammability": 3,
    "urgency": 1
  },
  "Shack": {
    "areas": 1,
    "response_time": 240,
    "rurality": 4,
    "dps": "2/s",
    "flammability": 5,
    "urgency": 1
  },
  "Tool Shed": {
    "areas": 1,
    "response_time": 120,
    "rurality": 3,
    "dps": "2/s",
    "flammability": 5,
    "urgency": 1
  },
  "Yurt": {
    "areas": 1,
    "response_time": 120,
    "rurality": 3,
    "dps": "2/s",
    "flammability": 5,
    "urgency": 1
  },
  "Adult Store": {
    "areas": 2,
    "response_time": 60,
    "rurality": 2,
    "dps": "1.2/s",
    "flammability": 3,
    "urgency": 5
  },
  "Apartment": {
    "areas": 2,
    "response_time": 30,
    "rurality": 1,
    "dps": "1.2/s",
    "flammability": 3,
    "urgency": 5
  },
  "Arcade": {
    "areas": 2,
    "response_time": 60,
    "rurality": 2,
    "dps": "1.6/s",
    "flammability": 4,
    "urgency": 4
  },
  "Barbershop": {
    "areas": 2,
    "response_time": 60,
    "rurality": 2,
    "dps": "0.8/s",
    "flammability": 2,
    "urgency": 6
  },
  "Bookies": {
    "areas": 2,
    "response_time": 30,
    "rurality": 1,
    "dps": "1.6/s",
    "flammability": 4,
    "urgency": 5
  },
  "Bordello": {
    "areas": 2,
    "response_time": 120,
    "rurality": 3,
    "dps": "1.6/s",
    "flammability": 4,
    "urgency": 2
  },
  "Bungalow": {
    "areas": 2,
    "response_time": 120,
    "rurality": 3,
    "dps": "1.2/s",
    "flammability": 3,
    "urgency": 2
  },
  "Cafe": {
    "areas": 2,
    "response_time": 120,
    "rurality": 3,
    "dps": "1.6/s",
    "flammability": 4,
    "urgency": 2
  },
  "Candle Shop": {
    "areas": 2,
    "response_time": 60,
    "rurality": 2,
    "dps": "2/s",
    "flammability": 5,
    "urgency": 3
  },
  "Chiropractors Office": {
    "areas": 2,
    "response_time": 60,
    "rurality": 2,
    "dps": "0.8/s",
    "flammability": 2,
    "urgency": 6
  },
  "Cleaning Agency": {
    "areas": 2,
    "response_time": 120,
    "rurality": 3,
    "dps": "1.2/s",
    "flammability": 3,
    "urgency": 2
  },
  "Clock Tower": {
    "areas": 2,
    "response_time": 30,
    "rurality": 1,
    "dps": "1.6/s",
    "flammability": 4,
    "urgency": 5
  },
  "Clothing Store": {
    "areas": 2,
    "response_time": 30,
    "rurality": 1,
    "dps": "1.6/s",
    "flammability": 4,
    "urgency": 5
  },
  "Community Center": {
    "areas": 2,
    "response_time": 30,
    "rurality": 1,
    "dps": "1.6/s",
    "flammability": 4,
    "urgency": 5
  },
  "Cottage": {
    "areas": 2,
    "response_time": 240,
    "rurality": 4,
    "dps": "1.6/s",
    "flammability": 4,
    "urgency": 1
  },
  "Cyber Cafe": {
    "areas": 2,
    "response_time": 30,
    "rurality": 1,
    "dps": "0.8/s",
    "flammability": 2,
    "urgency": 6
  },
  "Dental Surgery": {
    "areas": 2,
    "response_time": 60,
    "rurality": 2,
    "dps": null,
    "flammability": -1,
    "urgency": null
  },
  "Detective Agency": {
    "areas": 2,
    "response_time": 60,
    "rurality": 2,
    "dps": "1.2/s",
    "flammability": 3,
    "urgency": 5
  },
  "Diner": {
    "areas": 2,
    "response_time": 240,
    "rurality": 4,
    "dps": "1.2/s",
    "flammability": 3,
    "urgency": 1
  },
  "Drugs Lab": {
    "areas": 2,
    "response_time": 120,
    "rurality": 3,
    "dps": "1.6/s",
    "flammability": 4,
    "urgency": 2
  },
  "Flower Shop": {
    "areas": 2,
    "response_time": 60,
    "rurality": 2,
    "dps": "1.2/s",
    "flammability": 3,
    "urgency": 5
  },
  "Funeral Parlor": {
    "areas": 2,
    "response_time": 120,
    "rurality": 3,
    "dps": "1.6/s",
    "flammability": 4,
    "urgency": 2
  },
  "Game Shop": {
    "areas": 2,
    "response_time": 60,
    "rurality": 2,
    "dps": "0.8/s",
    "flammability": 2,
    "urgency": 6
  },
  "Gas Station": {
    "areas": 2,
    "response_time": 60,
    "rurality": 2,
    "dps": "2/s",
    "flammability": 5,
    "urgency": 3
  },
  "Hair Salon": {
    "areas": 2,
    "response_time": 60,
    "rurality": 2,
    "dps": "0.8/s",
    "flammability": 2,
    "urgency": 6
  },
  "Hardware Store": {
    "areas": 2,
    "response_time": 120,
    "rurality": 3,
    "dps": "1.6/s",
    "flammability": 4,
    "urgency": 2
  },
  "Homeless Camp": {
    "areas": 2,
    "response_time": 60,
    "rurality": 2,
    "dps": "1.6/s",
    "flammability": 4,
    "urgency": 4
  },
  "Jewelry Store": {
    "areas": 2,
    "response_time": 60,
    "rurality": 2,
    "dps": "1.2/s",
    "flammability": 3,
    "urgency": 5
  },
  "Lingerie Store": {
    "areas": 2,
    "response_time": 60,
    "rurality": 2,
    "dps": "1.2/s",
    "flammability": 3,
    "urgency": 5
  },
  "Liquor Store": {
    "areas": 2,
    "response_time": 60,
    "rurality": 2,
    "dps": "1.6/s",
    "flammability": 4,
    "urgency": 4
  },
  "Loanshark Office": {
    "areas": 2,
    "response_time": 60,
    "rurality": 2,
    "dps": "1.2/s",
    "flammability": 3,
    "urgency": 5
  },
  "Mechanic Shop": {
    "areas": 2,
    "response_time": 120,
    "rurality": 3,
    "dps": "1.6/s",
    "flammability": 4,
    "urgency": 2
  },
  "Music Store": {
    "areas": 2,
    "response_time": 60,
    "rurality": 2,
    "dps": "1.2/s",
    "flammability": 3,
    "urgency": 5
  },
  "Pharmacy": {
    "areas": 2,
    "response_time": 60,
    "rurality": 2,
    "dps": "1.2/s",
    "flammability": 3,
    "urgency": 5
  },
  "Police Safehouse": {
    "areas": 2,
    "response_time": 60,
    "rurality": 2,
    "dps": "1.2/s",
    "flammability": 3,
    "urgency": 5
  },
  "Printing Store": {
    "areas": 2,
    "response_time": 60,
    "rurality": 2,
    "dps": "2/s",
    "flammability": 5,
    "urgency": 3
  },
  "Suburban Home": {
    "areas": 2,
    "response_time": 120,
    "rurality": 3,
    "dps": "1.2/s",
    "flammability": 3,
    "urgency": 2
  },
  "Tattoo Parlor": {
    "areas": 2,
    "response_time": 60,
    "rurality": 2,
    "dps": "1.6/s",
    "flammability": 4,
    "urgency": 4
  },
  "Toy Shop": {
    "areas": 2,
    "response_time": 60,
    "rurality": 2,
    "dps": "1.6/s",
    "flammability": 4,
    "urgency": 4
  },
  "Travel Agent": {
    "areas": 2,
    "response_time": 30,
    "rurality": 1,
    "dps": "1.2/s",
    "flammability": 3,
    "urgency": 5
  },
  "Art Gallery": {
    "areas": 3,
    "response_time": 60,
    "rurality": 2,
    "dps": "1.6/s",
    "flammability": 4,
    "urgency": 4
  },
  "Bank": {
    "areas": 3,
    "response_time": 30,
    "rurality": 1,
    "dps": "0.8/s",
    "flammability": 2,
    "urgency": 6
  },
  "Barn": {
    "areas": 3,
    "response_time": 0,
    "rurality": -1,
    "dps": null,
    "flammability": -1,
    "urgency": null
  },
  "Bowling Alley": {
    "areas": 3,
    "response_time": 30,
    "rurality": 1,
    "dps": "1.6/s",
    "flammability": 4,
    "urgency": 5
  },
  "Car Showroom": {
    "areas": 3,
    "response_time": 60,
    "rurality": 2,
    "dps": "1.6/s",
    "flammability": 4,
    "urgency": 4
  },
  "Car Wash": {
    "areas": 3,
    "response_time": 120,
    "rurality": 3,
    "dps": "0.8/s",
    "flammability": 2,
    "urgency": 4
  },
  "Cinema": {
    "areas": 3,
    "response_time": 30,
    "rurality": 1,
    "dps": "2/s",
    "flammability": 5,
    "urgency": 5
  },
  "Distillery": {
    "areas": 3,
    "response_time": 240,
    "rurality": 4,
    "dps": "2/s",
    "flammability": 5,
    "urgency": 1
  },
  "Farmhouse": {
    "areas": 3,
    "response_time": 480,
    "rurality": 5,
    "dps": "1.6/s",
    "flammability": 4,
    "urgency": 1
  },
  "Fire Station": {
    "areas": 3,
    "response_time": 60,
    "rurality": 2,
    "dps": "0.4/s",
    "flammability": 1,
    "urgency": 6
  },
  "Furniture Store": {
    "areas": 3,
    "response_time": 120,
    "rurality": 3,
    "dps": "2/s",
    "flammability": 5,
    "urgency": 1
  },
  "Grocery Store": {
    "areas": 3,
    "response_time": 60,
    "rurality": 2,
    "dps": "1.2/s",
    "flammability": 3,
    "urgency": 5
  },
  "Gym": {
    "areas": 3,
    "response_time": 30,
    "rurality": 1,
    "dps": "0.8/s",
    "flammability": 2,
    "urgency": 6
  },
  "Laboratory": {
    "areas": 3,
    "response_time": 480,
    "rurality": 5,
    "dps": "1.2/s",
    "flammability": 3,
    "urgency": 1
  },
  "Lakehouse": {
    "areas": 3,
    "response_time": 240,
    "rurality": 4,
    "dps": "1.2/s",
    "flammability": 3,
    "urgency": 1
  },
  "Law Firm": {
    "areas": 3,
    "response_time": 60,
    "rurality": 2,
    "dps": "1.2/s",
    "flammability": 3,
    "urgency": 5
  },
  "Library": {
    "areas": 3,
    "response_time": 120,
    "rurality": 3,
    "dps": "2/s",
    "flammability": 5,
    "urgency": 1
  },
  "Medical Center": {
    "areas": 3,
    "response_time": 60,
    "rurality": 2,
    "dps": "1.2/s",
    "flammability": 3,
    "urgency": 5
  },
  "Motorcycle Club": {
    "areas": 3,
    "response_time": 240,
    "rurality": 4,
    "dps": "1.6/s",
    "flammability": 4,
    "urgency": 1
  },
  "Newspaper Office": {
    "areas": 3,
    "response_time": 30,
    "rurality": 1,
    "dps": "1.6/s",
    "flammability": 4,
    "urgency": 5
  },
  "Nightclub": {
    "areas": 3,
    "response_time": 30,
    "rurality": 1,
    "dps": "1.6/s",
    "flammability": 4,
    "urgency": 5
  },
  "Office Block": {
    "areas": 3,
    "response_time": 30,
    "rurality": 1,
    "dps": "1.2/s",
    "flammability": 3,
    "urgency": 5
  },
  "Penthouse": {
    "areas": 3,
    "response_time": 30,
    "rurality": 1,
    "dps": "1.2/s",
    "flammability": 3,
    "urgency": 5
  },
  "Pest Control Hub": {
    "areas": 3,
    "response_time": 60,
    "rurality": 2,
    "dps": "1.6/s",
    "flammability": 4,
    "urgency": 4
  },
  "Police Station": {
    "areas": 3,
    "response_time": 30,
    "rurality": 1,
    "dps": "1.2/s",
    "flammability": 3,
    "urgency": 5
  },
  "Private Security": {
    "areas": 3,
    "response_time": 60,
    "rurality": 2,
    "dps": "0.8/s",
    "flammability": 2,
    "urgency": 6
  },
  "Pub": {
    "areas": 3,
    "response_time": 60,
    "rurality": 2,
    "dps": "1.6/s",
    "flammability": 4,
    "urgency": 4
  },
  "Recording Studio": {
    "areas": 3,
    "response_time": 240,
    "rurality": 4,
    "dps": "1.6/s",
    "flammability": 4,
    "urgency": 1
  },
  "Restaurant": {
    "areas": 3,
    "response_time": 30,
    "rurality": 1,
    "dps": "1.6/s",
    "flammability": 4,
    "urgency": 5
  },
  "Strip Club": {
    "areas": 3,
    "response_time": 30,
    "rurality": 1,
    "dps": "1.2/s",
    "flammability": 3,
    "urgency": 5
  },
  "Subway": {
    "areas": 3,
    "response_time": 60,
    "rurality": 2,
    "dps": "1.2/s",
    "flammability": 3,
    "urgency": 5
  },
  "Townhouse": {
    "areas": 3,
    "response_time": 60,
    "rurality": 2,
    "dps": "1.2/s",
    "flammability": 3,
    "urgency": 5
  },
  "Ad Agency": {
    "areas": 4,
    "response_time": 30,
    "rurality": 1,
    "dps": "1.2/s",
    "flammability": 3,
    "urgency": 5
  },
  "Arms Warehouse": {
    "areas": 4,
    "response_time": 240,
    "rurality": 4,
    "dps": "2/s",
    "flammability": 5,
    "urgency": 1
  },
  "Bus Terminal": {
    "areas": 4,
    "response_time": 30,
    "rurality": 1,
    "dps": "0.8/s",
    "flammability": 2,
    "urgency": 6
  },
  "Chemical Plant": {
    "areas": 4,
    "response_time": 480,
    "rurality": 5,
    "dps": "2/s",
    "flammability": 5,
    "urgency": 1
  },
  "Church": {
    "areas": 4,
    "response_time": 120,
    "rurality": 3,
    "dps": "1.6/s",
    "flammability": 4,
    "urgency": 2
  },
  "College": {
    "areas": 4,
    "response_time": 60,
    "rurality": 2,
    "dps": "1.2/s",
    "flammability": 3,
    "urgency": 5
  },
  "Fertilizer Plant": {
    "areas": 4,
    "response_time": 480,
    "rurality": 5,
    "dps": "2/s",
    "flammability": 5,
    "urgency": 1
  },
  "Hotel": {
    "areas": 4,
    "response_time": 60,
    "rurality": 2,
    "dps": "1.6/s",
    "flammability": 4,
    "urgency": 4
  },
  "Luxury Villa": {
    "areas": 4,
    "response_time": 240,
    "rurality": 4,
    "dps": "1.2/s",
    "flammability": 3,
    "urgency": 1
  },
  "Manor House": {
    "areas": 4,
    "response_time": 240,
    "rurality": 4,
    "dps": "1.2/s",
    "flammability": 3,
    "urgency": 1
  },
  "Paper Mill": {
    "areas": 4,
    "response_time": 240,
    "rurality": 4,
    "dps": "2/s",
    "flammability": 5,
    "urgency": 1
  },
  "Post Office": {
    "areas": 4,
    "response_time": 60,
    "rurality": 2,
    "dps": "1.6/s",
    "flammability": 4,
    "urgency": 4
  },
  "Raceway": {
    "areas": 4,
    "response_time": 60,
    "rurality": 2,
    "dps": "2/s",
    "flammability": 5,
    "urgency": 3
  },
  "Ranch": {
    "areas": 4,
    "response_time": 480,
    "rurality": 5,
    "dps": "1.6/s",
    "flammability": 4,
    "urgency": 1
  },
  "Recycling Facility": {
    "areas": 4,
    "response_time": 240,
    "rurality": 4,
    "dps": "2/s",
    "flammability": 5,
    "urgency": 1
  },
  "Slaughterhouse": {
    "areas": 4,
    "response_time": 240,
    "rurality": 4,
    "dps": "0.8/s",
    "flammability": 2,
    "urgency": 1
  },
  "Supermarket": {
    "areas": 4,
    "response_time": 60,
    "rurality": 2,
    "dps": "1.6/s",
    "flammability": 4,
    "urgency": 4
  },
  "Theater": {
    "areas": 4,
    "response_time": 60,
    "rurality": 2,
    "dps": "2/s",
    "flammability": 5,
    "urgency": 3
  },
  "Warehouse": {
    "areas": 4,
    "response_time": 240,
    "rurality": 4,
    "dps": "1.6/s",
    "flammability": 4,
    "urgency": 1
  },
  "Aircraft Hangar": {
    "areas": 5,
    "response_time": 480,
    "rurality": 5,
    "dps": "2/s",
    "flammability": 5,
    "urgency": 1
  },
  "Casino": {
    "areas": 5,
    "response_time": 30,
    "rurality": 1,
    "dps": "1.6/s",
    "flammability": 4,
    "urgency": 5
  },
  "Castle": {
    "areas": 5,
    "response_time": 480,
    "rurality": 5,
    "dps": "0.8/s",
    "flammability": 2,
    "urgency": 1
  },
  "Cruise Line": {
    "areas": 5,
    "response_time": 30,
    "rurality": 1,
    "dps": "1.6/s",
    "flammability": 4,
    "urgency": 5
  },
  "Data Center": {
    "areas": 5,
    "response_time": 480,
    "rurality": 5,
    "dps": "0.4/s",
    "flammability": 1,
    "urgency": 1
  },
  "Electrical Substation": {
    "areas": 5,
    "response_time": 240,
    "rurality": 4,
    "dps": "0.4/s",
    "flammability": 1,
    "urgency": 4
  },
  "Factory": {
    "areas": 5,
    "response_time": 240,
    "rurality": 4,
    "dps": "1.6/s",
    "flammability": 4,
    "urgency": 1
  },
  "Foundry": {
    "areas": 5,
    "response_time": 240,
    "rurality": 4,
    "dps": "0.8/s",
    "flammability": 2,
    "urgency": 1
  },
  "Hospital": {
    "areas": 5,
    "response_time": 30,
    "rurality": 1,
    "dps": "1.2/s",
    "flammability": 3,
    "urgency": 5
  },
  "Palace": {
    "areas": 5,
    "response_time": 480,
    "rurality": 5,
    "dps": "1.2/s",
    "flammability": 3,
    "urgency": 1
  },
  "Shopping Mall": {
    "areas": 5,
    "response_time": 30,
    "rurality": 1,
    "dps": "1.6/s",
    "flammability": 4,
    "urgency": 5
  },
  "Sports Arena": {
    "areas": 5,
    "response_time": 30,
    "rurality": 1,
    "dps": "1.6/s",
    "flammability": 4,
    "urgency": 5
  },
  "TV Studio": {
    "areas": 5,
    "response_time": 60,
    "rurality": 2,
    "dps": "1.2/s",
    "flammability": 3,
    "urgency": 5
  },
  "Waste Facility": {
    "areas": 5,
    "response_time": 480,
    "rurality": 5,
    "dps": "2/s",
    "flammability": 5,
    "urgency": 1
  }
};