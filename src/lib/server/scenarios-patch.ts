export interface ActionItemPayload {
  resourceId: string
  qty: number
  optional?: boolean
}

export interface RecipePayload {
  place: ActionItemPayload[]
  ignite: ActionItemPayload[]
  stoke?: ActionItemPayload[]
  stokeTime?: string
  dampen?: ActionItemPayload[]
  dampenTime?: string
}

/** Matches the codebase's `210_000`-style thousands separators in numeric literals. */
function withUnderscoreSeparators(n: number): string {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '_')
}

function findMatchingBrace(source: string, openIndex: number): number {
  let depth = 0
  for (let i = openIndex; i < source.length; i++) {
    if (source[i] === '{') depth++
    else if (source[i] === '}') {
      depth--
      if (depth === 0) return i
    }
  }
  throw new Error('Unbalanced braces while patching scenarios.ts')
}

function serializeActionItem(item: ActionItemPayload): string {
  const optional = item.optional ? ', optional: true' : ''
  return `{ resourceId: RESOURCE.${item.resourceId.toUpperCase()}, qty: ${item.qty}${optional} }`
}

function serializeActionItems(items: ActionItemPayload[]): string {
  return `[${items.map(serializeActionItem).join(', ')}]`
}

function serializeActions(recipe: RecipePayload): string {
  const lines: string[] = []
  lines.push(`      place: ${serializeActionItems(recipe.place)},`)
  lines.push(`      ignite: ${serializeActionItems(recipe.ignite)},`)
  if (recipe.stoke) lines.push(`      stoke: ${serializeActionItems(recipe.stoke)},`)
  if (recipe.stokeTime) lines.push(`      stokeTime: ${JSON.stringify(recipe.stokeTime)},`)
  if (recipe.dampen) lines.push(`      dampen: ${serializeActionItems(recipe.dampen)},`)
  if (recipe.dampenTime) lines.push(`      dampenTime: ${JSON.stringify(recipe.dampenTime)},`)
  return lines.join('\n')
}

/**
 * Patches a single scenario's payoutMin/payoutMax/actions in the raw scenarios.ts source text.
 * Locates the entry by its unique `scenarioName: "X",` line, bracket-matches the enclosing
 * Scenario object literal, then does targeted field replacement within just that block —
 * every other entry, and every other field on this entry (notes, needsVerification), is
 * left untouched. Throws if the scenario or its actions block can't be found, so a caller
 * can surface that as an admin-facing error rather than silently corrupting the file.
 */
export function patchScenarioSource(
  source: string,
  scenarioName: string,
  payoutMin: number,
  payoutMax: number,
  recipe: RecipePayload,
): string {
  const anchor = `scenarioName: ${JSON.stringify(scenarioName)},`
  const anchorIndex = source.indexOf(anchor)
  if (anchorIndex === -1) {
    throw new Error(`Scenario "${scenarioName}" not found in scenarios.ts`)
  }
  if (source.indexOf(anchor, anchorIndex + 1) !== -1) {
    throw new Error(`Scenario "${scenarioName}" is not unique in scenarios.ts`)
  }

  let entryStart = anchorIndex
  let depth = 0
  while (entryStart > 0) {
    entryStart--
    if (source[entryStart] === '}') depth++
    else if (source[entryStart] === '{') {
      if (depth === 0) break
      depth--
    }
  }
  if (source[entryStart] !== '{') {
    throw new Error(`Could not locate opening brace for scenario "${scenarioName}"`)
  }
  const entryEnd = findMatchingBrace(source, entryStart)
  const entryBlock = source.slice(entryStart, entryEnd + 1)

  let patchedEntry = entryBlock
    .replace(/payoutMin:\s*[\d_]+,/, `payoutMin: ${withUnderscoreSeparators(payoutMin)},`)
    .replace(/payoutMax:\s*[\d_]+,/, `payoutMax: ${withUnderscoreSeparators(payoutMax)},`)

  if (!/payoutMin:\s*\d/.test(patchedEntry) || !/payoutMax:\s*\d/.test(patchedEntry)) {
    throw new Error(`Could not patch payoutMin/payoutMax for scenario "${scenarioName}"`)
  }

  const actionsMatch = /actions:\s*\{/.exec(patchedEntry)
  if (!actionsMatch) {
    throw new Error(`Scenario "${scenarioName}" has no actions block`)
  }
  const actionsOpen = actionsMatch.index + actionsMatch[0].length - 1
  const actionsClose = findMatchingBrace(patchedEntry, actionsOpen)
  const newActionsBlock = `actions: {\n${serializeActions(recipe)}\n    }`
  patchedEntry =
    patchedEntry.slice(0, actionsMatch.index) + newActionsBlock + patchedEntry.slice(actionsClose + 1)

  return source.slice(0, entryStart) + patchedEntry + source.slice(entryEnd + 1)
}
