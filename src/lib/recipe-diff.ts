export interface ActionItem {
  resourceId: string
  qty: number
  optional?: boolean
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

export interface RecipeSubmission {
  id: number
  scenario_name: string
  payout_min: number
  payout_max: number
  submitter_id: string | null
  submitter_name: string | null
  recipe: string
  status: 'pending' | 'approved' | 'partial' | 'merged' | 'denied'
  pr_number: number | null
  created_at: string
  /** JSON-encoded FieldDecisions, set when status is 'partial' (and optionally 'approved'). */
  field_decisions?: string | null
}

export type LineDecision = 'approve' | 'deny'

/** Per-line approve/deny verdicts keyed by 'payout', 'stokeTime', 'dampenTime', or
 *  `${section}:${resourceId}` for individual ingredient lines. A key absent from this
 *  map defaults to 'approve' — the admin card starts every line pre-approved. */
export type FieldDecisions = Record<string, LineDecision>

export function parseFieldDecisions(raw: string | null | undefined): FieldDecisions {
  if (!raw) return {}
  try {
    return JSON.parse(raw) as FieldDecisions
  } catch {
    return {}
  }
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
  return items.map((i) => `${i.qty}× ${i.resourceId}${i.optional ? ' (optional)' : ''}`).join(', ')
}

export function itemsKey(items: ActionItem[] | undefined): string {
  return (items ?? [])
    .map((i) => `${i.resourceId}:${i.qty}:${i.optional ? 1 : 0}`)
    .sort()
    .join(',')
}

/** A normalized signature identifying a (payout, recipe) pair regardless of array order —
 *  used to detect duplicate submissions carrying the same effective change. */
export function recipeSignature(
  payoutMin: number,
  payoutMax: number,
  recipe: Recipe,
): string {
  return JSON.stringify({
    payoutMin,
    payoutMax,
    place: itemsKey(recipe.place),
    ignite: itemsKey(recipe.ignite),
    stoke: recipe.stoke ? itemsKey(recipe.stoke) : null,
    stokeTime: recipe.stokeTime ?? null,
    dampen: recipe.dampen ? itemsKey(recipe.dampen) : null,
    dampenTime: recipe.dampenTime ?? null,
  })
}

export interface RecipeField {
  label: string
  text: string
}

/** Plain (non-diffed) summary of a submission's payout/recipe — used once a submission has
 *  merged, since by then the scenario's live data equals the submission and a diff against
 *  "current" would show everything as unchanged. */
export function summarizeRecipe(s: SubmissionLike, recipe: Recipe | null): RecipeField[] {
  const fields: RecipeField[] = [
    {
      label: 'Payout',
      text: `${s.payout_min.toLocaleString()}–${s.payout_max.toLocaleString()}`,
    },
  ]
  if (!recipe) return fields

  const rows: Array<[string, ActionItem[] | undefined]> = [
    ['Place', recipe.place],
    ['Ignite', recipe.ignite],
    ['Stoke', recipe.stoke],
    ['Dampen', recipe.dampen],
  ]
  for (const [label, items] of rows) {
    if (!items) continue
    fields.push({ label, text: formatItems(items) })
  }
  if (recipe.stokeTime) fields.push({ label: 'Stoke time', text: recipe.stokeTime })
  if (recipe.dampenTime) fields.push({ label: 'Dampen time', text: recipe.dampenTime })

  return fields
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

export type RecipeSection = 'place' | 'ignite' | 'stoke' | 'dampen'

export interface ItemDiffRow {
  /** `${section}:${resourceId}` — the FieldDecisions key for this line. */
  key: string
  section: RecipeSection
  kind: 'added' | 'removed' | 'modified' | 'unchanged'
  oldItem: ActionItem | null
  newItem: ActionItem | null
}

/** Item-level diff between an old and new ingredient list, keyed by resourceId (a recipe
 *  doesn't repeat the same resource within one list, so it's a stable identity). */
export function computeItemDiff(
  section: RecipeSection,
  oldItems: ActionItem[] | undefined,
  newItems: ActionItem[] | undefined,
): ItemDiffRow[] {
  const oldMap = new Map((oldItems ?? []).map((i) => [i.resourceId, i]))
  const newMap = new Map((newItems ?? []).map((i) => [i.resourceId, i]))
  const ids = [...new Set([...oldMap.keys(), ...newMap.keys()])].sort()

  return ids.map((id) => {
    const oldItem = oldMap.get(id) ?? null
    const newItem = newMap.get(id) ?? null
    let kind: ItemDiffRow['kind']
    if (oldItem && !newItem) kind = 'removed'
    else if (!oldItem && newItem) kind = 'added'
    else if (
      oldItem &&
      newItem &&
      (oldItem.qty !== newItem.qty || !!oldItem.optional !== !!newItem.optional)
    )
      kind = 'modified'
    else kind = 'unchanged'
    return { key: `${section}:${id}`, section, kind, oldItem, newItem }
  })
}

export interface LineRow {
  /** FieldDecisions key: 'payout', 'stokeTime', 'dampenTime', or an ItemDiffRow key. */
  key: string
  label: string
  kind: 'field' | ItemDiffRow['kind']
  oldText: string
  newText: string
}

/** Every changed line between a submission and current scenario data, one row per
 *  toggle-able decision — used to render the admin card's per-line approve/deny controls. */
export function computeLineDiffs(
  s: SubmissionLike,
  recipe: Recipe,
  current: CurrentScenario | undefined,
): LineRow[] {
  const rows: LineRow[] = []

  const payoutChanged =
    !current || current.payoutMin !== s.payout_min || current.payoutMax !== s.payout_max
  if (payoutChanged) {
    rows.push({
      key: 'payout',
      label: 'Payout',
      kind: 'field',
      oldText: current
        ? `${current.payoutMin.toLocaleString()}–${current.payoutMax.toLocaleString()}`
        : '—',
      newText: `${s.payout_min.toLocaleString()}–${s.payout_max.toLocaleString()}`,
    })
  }

  const sections: Array<[RecipeSection, string]> = [
    ['place', 'Place'],
    ['ignite', 'Ignite'],
    ['stoke', 'Stoke'],
    ['dampen', 'Dampen'],
  ]
  for (const [section, label] of sections) {
    const oldItems = current?.actions[section]
    const newItems = recipe[section]
    if (!oldItems && !newItems) continue
    for (const item of computeItemDiff(section, oldItems, newItems)) {
      if (item.kind === 'unchanged') continue
      rows.push({
        key: item.key,
        label,
        kind: item.kind,
        oldText: item.oldItem ? formatItems([item.oldItem]) : '—',
        newText: item.newItem ? formatItems([item.newItem]) : '—',
      })
    }
  }

  const timeFields: Array<['stokeTime' | 'dampenTime', string]> = [
    ['stokeTime', 'Stoke time'],
    ['dampenTime', 'Dampen time'],
  ]
  for (const [key, label] of timeFields) {
    const oldVal = current?.actions[key]
    const newVal = recipe[key]
    if (oldVal === undefined && newVal === undefined) continue
    if ((oldVal ?? '') === (newVal ?? '')) continue
    rows.push({ key, label, kind: 'field', oldText: oldVal ?? '—', newText: newVal ?? '—' })
  }

  return rows
}

function mergeItems(
  section: RecipeSection,
  oldItems: ActionItem[] | undefined,
  newItems: ActionItem[] | undefined,
  decisions: FieldDecisions,
): ActionItem[] {
  const result: ActionItem[] = []
  for (const row of computeItemDiff(section, oldItems, newItems)) {
    const decision = decisions[row.key] ?? 'approve'
    if (row.kind === 'unchanged') {
      result.push((row.newItem ?? row.oldItem)!)
    } else if (row.kind === 'added') {
      if (decision === 'approve') result.push(row.newItem!)
    } else if (row.kind === 'removed') {
      if (decision === 'deny') result.push(row.oldItem!)
    } else if (row.kind === 'modified') {
      result.push(decision === 'approve' ? row.newItem! : row.oldItem!)
    }
  }
  return result
}

export interface MergedRecipe {
  payoutMin: number
  payoutMax: number
  recipe: Recipe
}

/** Builds the payout/recipe that should actually ship: the submission's value for every
 *  approved line, and the scenario's current value for every denied line. A key missing
 *  from `decisions` defaults to 'approve' (an all-approve decisions map reproduces the
 *  submission's recipe exactly). */
export function mergeDecisions(
  s: SubmissionLike,
  recipe: Recipe,
  current: CurrentScenario | undefined,
  decisions: FieldDecisions,
): MergedRecipe {
  const payoutApproved = (decisions['payout'] ?? 'approve') === 'approve'
  const payoutMin = payoutApproved ? s.payout_min : (current?.payoutMin ?? s.payout_min)
  const payoutMax = payoutApproved ? s.payout_max : (current?.payoutMax ?? s.payout_max)

  const place = mergeItems('place', current?.actions.place, recipe.place, decisions)
  const ignite = mergeItems('ignite', current?.actions.ignite, recipe.ignite, decisions)
  const stoke = mergeItems('stoke', current?.actions.stoke, recipe.stoke, decisions)
  const dampen = mergeItems('dampen', current?.actions.dampen, recipe.dampen, decisions)

  const stokeTimeApproved = (decisions['stokeTime'] ?? 'approve') === 'approve'
  const stokeTime = stokeTimeApproved ? recipe.stokeTime : current?.actions.stokeTime
  const dampenTimeApproved = (decisions['dampenTime'] ?? 'approve') === 'approve'
  const dampenTime = dampenTimeApproved ? recipe.dampenTime : current?.actions.dampenTime

  return {
    payoutMin,
    payoutMax,
    recipe: {
      place,
      ignite,
      ...(stoke.length ? { stoke } : {}),
      ...(stokeTime ? { stokeTime } : {}),
      ...(dampen.length ? { dampen } : {}),
      ...(dampenTime ? { dampenTime } : {}),
    },
  }
}

/** Whether a decisions map (defaults included) contains any denial — used to tell a
 *  clean 'approved' from a mixed 'partial' outcome. */
export function hasAnyDenial(rows: LineRow[], decisions: FieldDecisions): boolean {
  return rows.some((r) => (decisions[r.key] ?? 'approve') === 'deny')
}

/** Whether every line was denied — a fully-denied submission is routed through the plain
 *  deny endpoint instead of being recorded as an empty 'partial' approval. */
export function isAllDenied(rows: LineRow[], decisions: FieldDecisions): boolean {
  return rows.length > 0 && rows.every((r) => (decisions[r.key] ?? 'approve') === 'deny')
}
