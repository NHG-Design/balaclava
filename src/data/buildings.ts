/**
 * Static per-building risk stats for Torn's Arson crime targets, used to
 * annotate crime-image thumbnails in the Arsonist's Ledger userscript.
 *
 * Source: plans/arson/arson-information/arson-information.js (BUILDINGS).
 * Null/-1 fields mean "not applicable" for that building (e.g. Barn, Dental
 * Surgery, Firework Store have no fire-response mechanic).
 */
export interface Building {
  readonly areas: number;
  /** Firefighter response time in seconds. */
  readonly responseTime: number;
  /** 1 (urban) to 5 (rural), or -1 when not applicable. */
  readonly rurality: number;
  readonly dps: string | null;
  /** 1-5, or -1 when not applicable. */
  readonly flammability: number;
  /** 1-6, or null when not applicable. */
  readonly urgency: number | null;
}

export const BUILDINGS: Record<string, Building> = {
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
  "Waste Facility": { areas: 5, responseTime: 480, rurality: 5, dps: "2/s", flammability: 5, urgency: 1 },
};

export function formatResponseTime(seconds: number): string {
  if (seconds <= 0) return "n/a";
  if (seconds < 60) return `${seconds}s`;
  const minutes = seconds / 60;
  return `${minutes % 1 === 0 ? minutes : minutes.toFixed(1)}m`;
}
