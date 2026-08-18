import type { ResourceId } from '../data/catalog'
import type { Scenario } from '../data/scenarios'
import {
  calcProfitPerNerve,
  profitBand,
  DEFAULT_THRESHOLDS,
  type ProfitBand,
} from '../userscripts/arsonists-ledger/engine'

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
  /** Optional admin-written note, set when status is 'denied'. */
  deny_note?: string | null
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
  s: Pick<SubmissionLike, 'payout_min' | 'payout_max'>,
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

  // Exactly one igniter is ever used, unlike place/stoke/dampen which are true multi-item
  // lists — so a swap (e.g. flamethrower -> lighter) is one decision, compared as a whole
  // field like payout, not a per-item remove-old + add-new pair.
  const oldIgnite = current?.actions.ignite
  const newIgnite = recipe.ignite
  if (oldIgnite || newIgnite) {
    const oldText = formatItems(oldIgnite)
    const newText = formatItems(newIgnite)
    if (oldText !== newText) {
      rows.push({ key: 'ignite', label: 'Ignite', kind: 'field', oldText, newText })
    }
  }

  const sections: Array<[RecipeSection, string]> = [
    ['place', 'Place'],
    ['stoke', 'Stoke'],
    ['dampen', 'Dampen'],
  ]
  for (const [section, label] of sections) {
    const oldItems = current?.actions[section]
    const newItems = recipe[section]
    if (!oldItems && !newItems) continue
    for (const item of computeItemDiff(section, oldItems, newItems)) {
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
  const igniteApproved = (decisions['ignite'] ?? 'approve') === 'approve'
  const ignite = (igniteApproved ? recipe.ignite : current?.actions.ignite) ?? []
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
  return rows
    .filter((r) => r.kind !== 'unchanged')
    .some((r) => (decisions[r.key] ?? 'approve') === 'deny')
}

/** Whether every line was denied — a fully-denied submission is routed through the plain
 *  deny endpoint instead of being recorded as an empty 'partial' approval. Unchanged lines
 *  aren't toggle-able, so they're excluded from this check. */
export function isAllDenied(rows: LineRow[], decisions: FieldDecisions): boolean {
  const actionable = rows.filter((r) => r.kind !== 'unchanged')
  return actionable.length > 0 && actionable.every((r) => (decisions[r.key] ?? 'approve') === 'deny')
}

export interface MergeCandidate {
  /** 'current' or a submission id. */
  source: 'current' | number
  text: string
}

export interface MergeLineRow {
  key: string
  label: string
  candidates: MergeCandidate[]
}

export interface MergeableSubmission {
  id: number
  payout_min: number
  payout_max: number
  recipe: Recipe
}

/** Union of every changed line across a set of sibling submissions being merged together,
 *  each line listing "current" plus one candidate value per submission that touches it —
 *  used to render the multi-select merge view's per-line picker. Lines untouched by every
 *  selected submission are omitted (nothing to pick between). */
export function computeMergeLines(
  submissions: MergeableSubmission[],
  current: CurrentScenario | undefined,
): MergeLineRow[] {
  const byKey = new Map<string, { label: string; oldText: string; candidates: MergeCandidate[] }>()
  for (const sub of submissions) {
    const rows = computeLineDiffs(sub, sub.recipe, current)
    for (const row of rows) {
      if (row.kind === 'unchanged') continue
      let entry = byKey.get(row.key)
      if (!entry) {
        entry = { label: row.label, oldText: row.oldText, candidates: [{ source: 'current', text: row.oldText }] }
        byKey.set(row.key, entry)
      }
      entry.candidates.push({ source: sub.id, text: row.newText })
    }
  }
  return [...byKey.entries()].map(([key, entry]) => ({ key, label: entry.label, candidates: entry.candidates }))
}

export type MergeResolutions = Record<string, number | 'current'>

/** Resolves a merge: for every contested/changed line, picks the winning submission's raw
 *  value (or current's, if 'current' won or no resolution was given for that line), and
 *  assembles the single Recipe that should ship. Unlike `mergeDecisions` (one submission vs.
 *  current), this chooses among N submissions per line. */
export function mergeMultiSubmission(
  current: CurrentScenario | undefined,
  submissions: MergeableSubmission[],
  resolutions: MergeResolutions,
): MergedRecipe {
  const byId = new Map(submissions.map((s) => [s.id, s]))

  function winnerFor(key: string): MergeableSubmission | 'current' {
    const w = resolutions[key]
    if (w === undefined || w === 'current') return 'current'
    return byId.get(w) ?? 'current'
  }

  const payoutWinner = winnerFor('payout')
  const payoutMin =
    payoutWinner === 'current' ? (current?.payoutMin ?? submissions[0].payout_min) : payoutWinner.payout_min
  const payoutMax =
    payoutWinner === 'current' ? (current?.payoutMax ?? submissions[0].payout_max) : payoutWinner.payout_max

  function mergeSection(section: RecipeSection): ActionItem[] {
    const ids = new Set<string>()
    for (const sub of submissions) {
      for (const item of computeItemDiff(section, current?.actions[section], sub.recipe[section])) {
        ids.add(item.key)
      }
    }
    const result: ActionItem[] = []
    for (const key of ids) {
      const resourceId = key.slice(section.length + 1)
      const winner = winnerFor(key)
      const item =
        winner === 'current'
          ? (current?.actions[section] ?? []).find((i) => i.resourceId === resourceId)
          : winner.recipe[section]?.find((i) => i.resourceId === resourceId)
      if (item) result.push(item)
    }
    return result
  }

  const place = mergeSection('place')
  const stoke = mergeSection('stoke')
  const dampen = mergeSection('dampen')

  // Exactly one igniter is ever used — resolved as a whole field (key 'ignite'), matching
  // computeLineDiffs, not per-item like place/stoke/dampen.
  const igniteWinner = winnerFor('ignite')
  const ignite = (igniteWinner === 'current' ? current?.actions.ignite : igniteWinner.recipe.ignite) ?? []

  const stokeTimeWinner = winnerFor('stokeTime')
  const stokeTime = stokeTimeWinner === 'current' ? current?.actions.stokeTime : stokeTimeWinner.recipe.stokeTime
  const dampenTimeWinner = winnerFor('dampenTime')
  const dampenTime =
    dampenTimeWinner === 'current' ? current?.actions.dampenTime : dampenTimeWinner.recipe.dampenTime

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

/** Per-submission FieldDecisions derived from a resolved merge — a submission's own touched
 *  lines become 'approve' where it won, 'deny' where a sibling (or current) won instead. Used
 *  to persist each merged submission's individual status/field_decisions (decision #21: no new
 *  schema for merges — every submission still gets its own record). */
export function fieldDecisionsForMerge(
  sub: MergeableSubmission,
  current: CurrentScenario | undefined,
  resolutions: MergeResolutions,
): FieldDecisions {
  const rows = computeLineDiffs(sub, sub.recipe, current).filter((r) => r.kind !== 'unchanged')
  const decisions: FieldDecisions = {}
  for (const row of rows) {
    const winner = resolutions[row.key]
    decisions[row.key] = winner === sub.id ? 'approve' : 'deny'
  }
  return decisions
}

export interface SubmissionPpn {
  ppn: number
  band: ProfitBand
}

/** Expected $/nerve for a merged (payout, recipe) pair, using the same PPN math the
 *  userscript uses to rank live scenarios — static catalog prices, 'average' payout basis. */
export function calcSubmissionPpn(merged: MergedRecipe): SubmissionPpn {
  const scenario = {
    scenarioName: '',
    payoutMin: merged.payoutMin,
    payoutMax: merged.payoutMax,
    actions: {
      place: merged.recipe.place.map((i) => ({ ...i, resourceId: i.resourceId as ResourceId })),
      ignite: merged.recipe.ignite?.map((i) => ({ ...i, resourceId: i.resourceId as ResourceId })),
      stoke: merged.recipe.stoke?.map((i) => ({ ...i, resourceId: i.resourceId as ResourceId })),
      stokeTime: merged.recipe.stokeTime,
      dampen: merged.recipe.dampen?.map((i) => ({ ...i, resourceId: i.resourceId as ResourceId })),
      dampenTime: merged.recipe.dampenTime,
    },
  }
  const ppn = calcProfitPerNerve(scenario as unknown as Scenario, {}, 'average')
  return { ppn, band: profitBand(ppn, DEFAULT_THRESHOLDS) }
}
