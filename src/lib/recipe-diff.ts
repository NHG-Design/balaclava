export interface ActionItem {
  resourceId: string
  qty: number
}

export interface Recipe {
  place: ActionItem[]
  ignite?: ActionItem[]
  stoke?: ActionItem[]
  stokeTime?: string
  dampen?: ActionItem[]
  dampenTime?: string
}

export interface CurrentScenario {
  payoutMin: number
  payoutMax: number
  actions: Recipe
}

export interface SubmissionLike {
  scenario_name: string
  payout_min: number
  payout_max: number
}

export interface FieldDiff {
  label: string
  changed: boolean
  oldText: string
  newText: string
}

export function parseRecipe(raw: string): Recipe | null {
  try {
    return JSON.parse(raw) as Recipe
  } catch {
    return null
  }
}

export function formatItems(items: ActionItem[] | undefined): string {
  if (!items || items.length === 0) return '—'
  return items.map((i) => `${i.qty}× ${i.resourceId}`).join(', ')
}

function itemsKey(items: ActionItem[] | undefined): string {
  return (items ?? [])
    .map((i) => `${i.resourceId}:${i.qty}`)
    .sort()
    .join(',')
}

/** Diffs a submission's payout/recipe against the scenario's currently-live data, field by field. */
export function computeDiff(
  s: SubmissionLike,
  recipe: Recipe | null,
  currentScenarios: Record<string, CurrentScenario>,
): FieldDiff[] {
  const current = currentScenarios[s.scenario_name]
  const fields: FieldDiff[] = []

  const oldPayout = current
    ? `${current.payoutMin.toLocaleString()}–${current.payoutMax.toLocaleString()}`
    : '—'
  const newPayout = `${s.payout_min.toLocaleString()}–${s.payout_max.toLocaleString()}`
  fields.push({
    label: 'Payout',
    changed: !current || current.payoutMin !== s.payout_min || current.payoutMax !== s.payout_max,
    oldText: oldPayout,
    newText: newPayout,
  })

  if (!recipe) return fields

  const rows: Array<[string, ActionItem[] | undefined, ActionItem[] | undefined]> = [
    ['Place', current?.actions.place, recipe.place],
    ['Ignite', current?.actions.ignite, recipe.ignite],
    ['Stoke', current?.actions.stoke, recipe.stoke],
    ['Dampen', current?.actions.dampen, recipe.dampen],
  ]
  for (const [label, oldItems, newItems] of rows) {
    if (!oldItems && !newItems) continue
    fields.push({
      label,
      changed: itemsKey(oldItems) !== itemsKey(newItems),
      oldText: formatItems(oldItems),
      newText: formatItems(newItems),
    })
  }

  if (current?.actions.stokeTime !== undefined || recipe.stokeTime !== undefined) {
    fields.push({
      label: 'Stoke time',
      changed: (current?.actions.stokeTime ?? '') !== (recipe.stokeTime ?? ''),
      oldText: current?.actions.stokeTime ?? '—',
      newText: recipe.stokeTime ?? '—',
    })
  }
  if (current?.actions.dampenTime !== undefined || recipe.dampenTime !== undefined) {
    fields.push({
      label: 'Dampen time',
      changed: (current?.actions.dampenTime ?? '') !== (recipe.dampenTime ?? ''),
      oldText: current?.actions.dampenTime ?? '—',
      newText: recipe.dampenTime ?? '—',
    })
  }

  return fields
}
