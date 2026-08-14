import { RESOURCE, type ResourceId } from "./catalog.js";

/** Per-accelerant stats used to badge the materials popover. All on a fixed 0-10 scale. */
export interface AccelerantInfo {
  readonly intensity: number;
  readonly momentum: number;
  readonly suspicion: number;
  readonly ignitionRisk: number;
  readonly stokingRisk: number;
  readonly advice: string;
}

/** Per-igniter stats used to badge the materials popover. */
export interface IgniterInfo {
  readonly suspicion: number;
  readonly advice: string;
}

export const ACCELERANT_INFO: Readonly<
  Partial<Record<ResourceId, AccelerantInfo>>
> = {
  [RESOURCE.GASOLINE]: {
    intensity: 1.5,
    momentum: 6,
    suspicion: 9,
    ignitionRisk: 1,
    stokingRisk: 7,
    advice:
      "Cheap but risky when stoking. High suspicion and high stoking risk.",
  },
  [RESOURCE.DIESEL]: {
    intensity: 2,
    momentum: 5,
    suspicion: 7,
    ignitionRisk: 0,
    stokingRisk: 1,
    advice:
      "Lowers crit-rate on ignition, increases visibility. Best combined with solids.",
  },
  [RESOURCE.KEROSENE]: {
    intensity: 2,
    momentum: 10,
    suspicion: 3,
    ignitionRisk: 1,
    stokingRisk: 3,
    advice:
      "Great as starter, insurance jobs, and small fires. Increases momentum in single area.",
  },
  [RESOURCE.POTASSIUM_NITRATE]: {
    intensity: 10,
    momentum: 6,
    suspicion: 3,
    ignitionRisk: 3,
    stokingRisk: 1,
    advice:
      "Best for stoking, excellent for <3 zone targets. Increases intensity by 25% of current intensity in single area.",
  },
  [RESOURCE.MAGNESIUM]: {
    intensity: 8,
    momentum: 6,
    suspicion: 10,
    ignitionRisk: 3,
    stokingRisk: 4,
    advice:
      "Best as starter, useful when low rurality. Halves dampening effectiveness and intensity decay from firefighters. Increases visibility.",
  },
  [RESOURCE.THERMITE]: {
    intensity: 7,
    momentum: 4,
    suspicion: 7,
    ignitionRisk: 3,
    stokingRisk: 7,
    advice:
      "Best as starter for total destruction. Multiplies damage rate for each use.",
  },
  [RESOURCE.OXYGEN]: {
    intensity: 6,
    momentum: 2,
    suspicion: 1,
    ignitionRisk: 2,
    stokingRisk: 1,
    advice:
      "Terrible starter, excellent for stoking 4-5 zone targets. Increases intensity by 25% of current in all areas.",
  },
  [RESOURCE.METHANE]: {
    intensity: 4,
    momentum: 1,
    suspicion: -3,
    ignitionRisk: 2,
    stokingRisk: 3,
    advice: "Excellent spread for large targets. Lowers accumulated suspicion.",
  },
  [RESOURCE.HYDROGEN]: {
    intensity: 4,
    momentum: 1,
    suspicion: 1,
    ignitionRisk: 2,
    stokingRisk: 3,
    advice:
      "Best used for 3-5 zone targets, and when paired with one solid & one liquid. Averages intensity and momentum across all areas.",
  },
};

export const IGNITER_INFO: Readonly<Partial<Record<ResourceId, IgniterInfo>>> =
  {
    [RESOURCE.LIGHTER]: {
      suspicion: 1,
      advice:
        "Great for fine-tuning and low suspicion jobs. Provides very small increase in intensity (+2.5%) and momentum. Crit rate depends on accelerants used.",
    },
    [RESOURCE.MOLOTOV]: {
      suspicion: 6,
      advice:
        "Great for spreading fires. Moderately high intensity (+17.5%) and momentum to area with lowest intensity based on the main zone momentum. Fixed crit rate.",
    },
    [RESOURCE.FLAMETHROWER]: {
      suspicion: 8,
      advice:
        "High intensity/momentum randomly across areas with high visibility.",
    },
  };
