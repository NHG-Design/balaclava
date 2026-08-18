import type { ActionItem, CurrentScenario } from '../recipe-diff'
import { extractScenarioEntryBlock } from './scenarios-patch'

function parseNum(raw: string | undefined): number | null {
  if (!raw) return null
  const n = Number(raw.replace(/_/g, ''))
  return Number.isFinite(n) ? n : null
}

function parseItems(raw: string | undefined): ActionItem[] | undefined {
  if (raw === undefined) return undefined
  const items: ActionItem[] = []
  const itemRe = /resourceId:\s*RESOURCE\.(\w+)\s*,\s*qty:\s*([\d_]+)(\s*,\s*optional:\s*true)?/g
  let m: RegExpExecArray | null
  while ((m = itemRe.exec(raw))) {
    items.push({
      resourceId: m[1].toLowerCase(),
      qty: Number(m[2].replace(/_/g, '')),
      ...(m[3] ? { optional: true } : {}),
    })
  }
  return items
}

/** Best-effort parse of a single scenario entry out of scenarios.ts source text — used to
 *  build a diff baseline from a branch that hasn't been deployed yet (an open recipe-pool
 *  PR). Returns null if the scenario isn't present or its shape can't be confidently parsed;
 *  callers treat that as "no baseline override available" and fall back to deployed data,
 *  never as a hard failure. */
export function parseScenarioEntry(source: string, scenarioName: string): CurrentScenario | null {
  const block = extractScenarioEntryBlock(source, scenarioName)
  if (!block) return null
  try {
    const payoutMin = parseNum(/payoutMin:\s*([\d_]+)/.exec(block)?.[1])
    const payoutMax = parseNum(/payoutMax:\s*([\d_]+)/.exec(block)?.[1])
    if (payoutMin === null || payoutMax === null) return null

    const actionsMatch = /actions:\s*\{/.exec(block)
    if (!actionsMatch) return null
    const actionsText = block.slice(actionsMatch.index + actionsMatch[0].length)

    const place = parseItems(/place:\s*\[([\s\S]*?)\]/.exec(actionsText)?.[1])
    const ignite = parseItems(/ignite:\s*\[([\s\S]*?)\]/.exec(actionsText)?.[1])
    if (!place || !ignite) return null
    const stoke = parseItems(/stoke:\s*\[([\s\S]*?)\]/.exec(actionsText)?.[1])
    const dampen = parseItems(/dampen:\s*\[([\s\S]*?)\]/.exec(actionsText)?.[1])
    const stokeTime = /stokeTime:\s*"([^"]*)"/.exec(actionsText)?.[1]
    const dampenTime = /dampenTime:\s*"([^"]*)"/.exec(actionsText)?.[1]

    return {
      payoutMin,
      payoutMax,
      actions: {
        place,
        ignite,
        ...(stoke ? { stoke } : {}),
        ...(stokeTime ? { stokeTime } : {}),
        ...(dampen ? { dampen } : {}),
        ...(dampenTime ? { dampenTime } : {}),
      },
    }
  } catch {
    return null
  }
}
