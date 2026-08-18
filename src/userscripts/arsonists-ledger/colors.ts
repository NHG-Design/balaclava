import { RESOURCE, type ResourceId } from "../../data/catalog.js";

export const BAND_COLOR = {
  negative: "#f66",
  low: "#fa0",
  good: "#3c9",
  excellent: "#c9f",
  unknown: "#666",
} as const;

/** Per-material text colors for liquids/solids/gases only, used by the "Color material text" setting. */
export const MATERIAL_COLOR: Partial<Record<ResourceId, string>> = {
  [RESOURCE.GASOLINE]: "#d4694b",
  [RESOURCE.DIESEL]: "#d7ce45",
  [RESOURCE.KEROSENE]: "#5fa1e5",
  [RESOURCE.POTASSIUM_NITRATE]: "#aa9988",
  [RESOURCE.MAGNESIUM]: "#c9c9c9",
  [RESOURCE.THERMITE]: "#aba872",
  [RESOURCE.OXYGEN]: "#799f71",
  [RESOURCE.METHANE]: "#6095c5",
  [RESOURCE.HYDROGEN]: "#a49707",
};
