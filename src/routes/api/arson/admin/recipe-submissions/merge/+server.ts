import type { RequestHandler } from './$types'
import { createClient } from '@libsql/client/web'
import { isAdminRequest } from '$lib/server/session'
import { logAdminAction } from '$lib/server/audit'
import { type RecipePayload } from '$lib/server/scenarios-patch'
import { writeToPool, refreshPoolPrBody } from '$lib/server/pr-pool'
import { SCENARIOS } from '../../../../../../data/scenarios'
import {
  computeLineDiffs,
  fieldDecisionsForMerge,
  isAllDenied,
  mergeMultiSubmission,
  type MergeResolutions,
  type MergeableSubmission,
  type Recipe,
} from '$lib/recipe-diff'

interface SubmissionRow {
  id: number
  scenario_name: string
  payout_min: number
  payout_max: number
  recipe: string
  status: string
}

export const POST: RequestHandler = async ({ request, platform, cookies, getClientAddress }) => {
  try {
    if (!(await isAdminRequest(platform?.env?.SCENARIO_ADMIN_SESSION_SECRET, cookies))) {
      return new Response(JSON.stringify({ error: 'Not authorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const dbUrl = platform?.env?.TURSO_DATABASE_URL
    const authToken = platform?.env?.TURSO_AUTH_TOKEN
    const githubToken = platform?.env?.GITHUB_PAT
    if (!dbUrl || !authToken || !githubToken) {
      return new Response('Not configured', { status: 500 })
    }

    let body: { submissionIds?: unknown; resolutions?: unknown; notes?: unknown }
    try {
      body = await request.json()
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const submissionIds = Array.isArray(body.submissionIds)
      ? body.submissionIds.filter((id): id is number => Number.isInteger(id) && id > 0)
      : []
    if (submissionIds.length < 2) {
      return new Response(JSON.stringify({ error: 'Select at least 2 submissions to merge' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }
    const resolutions = (
      body.resolutions && typeof body.resolutions === 'object' ? body.resolutions : {}
    ) as MergeResolutions

    // Optional per-submission deny note (only applied to submissions that end up 'denied').
    const rawNotes = (body.notes && typeof body.notes === 'object' ? body.notes : {}) as Record<
      string,
      unknown
    >
    const denyNotes: Record<number, string> = {}
    for (const [idStr, raw] of Object.entries(rawNotes)) {
      const id = Number(idStr)
      if (!Number.isInteger(id) || typeof raw !== 'string') continue
      const trimmed = raw.trim()
      if (trimmed === '') continue
      if (trimmed.length > 500) {
        return new Response(JSON.stringify({ error: 'Note must be 500 characters or fewer' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        })
      }
      denyNotes[id] = trimmed
    }

    const client = createClient({ url: dbUrl, authToken })
    const placeholders = submissionIds.map(() => '?').join(', ')
    const rows = await client.execute({
      sql: `SELECT id, scenario_name, payout_min, payout_max, recipe, status FROM recipe_submissions WHERE id IN (${placeholders})`,
      args: submissionIds,
    })
    const dbRows = rows.rows as unknown as SubmissionRow[]
    if (dbRows.length !== submissionIds.length) {
      return new Response(JSON.stringify({ error: 'One or more submissions not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      })
    }
    if (dbRows.some((r) => r.status !== 'pending')) {
      return new Response(JSON.stringify({ error: 'All selected submissions must be pending' }), {
        status: 409,
        headers: { 'Content-Type': 'application/json' },
      })
    }
    const scenarioName = dbRows[0].scenario_name
    if (dbRows.some((r) => r.scenario_name !== scenarioName)) {
      return new Response(JSON.stringify({ error: 'All selected submissions must be for the same scenario' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const currentScenario = SCENARIOS.find((sc) => sc.scenarioName === scenarioName)
    const current = currentScenario
      ? {
          payoutMin: currentScenario.payoutMin,
          payoutMax: currentScenario.payoutMax,
          actions: currentScenario.actions,
        }
      : undefined

    const mergeable: MergeableSubmission[] = dbRows.map((r) => ({
      id: r.id,
      payout_min: r.payout_min,
      payout_max: r.payout_max,
      recipe: JSON.parse(r.recipe) as Recipe,
    }))

    const merged = mergeMultiSubmission(current, mergeable, resolutions)
    const recipe = merged.recipe as RecipePayload

    let prNumber: number
    let prUrl: string
    try {
      const result = await writeToPool(
        githubToken,
        scenarioName,
        `feat(arson): merge ${submissionIds.length} community recipes for "${scenarioName}" (${submissionIds.map((id) => `#${id}`).join(', ')})`,
        merged.payoutMin,
        merged.payoutMax,
        recipe,
        'Approve community recipes',
        dbRows.map((r) => ({ id: r.id, scenario_name: r.scenario_name })),
      )
      prNumber = result.prNumber
      prUrl = result.prUrl
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      return new Response(JSON.stringify({ error: `Failed to open/update PR: ${msg}` }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Each submission gets its own status/field_decisions from the shared resolution —
    // approved if every line it touched won, partial if some did, denied if none did.
    for (const sub of mergeable) {
      const decisions = fieldDecisionsForMerge(sub, current, resolutions)
      const lineDiffs = computeLineDiffs(
        dbRows.find((r) => r.id === sub.id)!,
        sub.recipe,
        current,
      )
      const status = isAllDenied(lineDiffs, decisions)
        ? 'denied'
        : Object.values(decisions).some((d) => d === 'deny')
          ? 'partial'
          : 'approved'
      await client.execute({
        sql: `UPDATE recipe_submissions SET status = ?, pr_number = ?, field_decisions = ?, deny_note = ? WHERE id = ?`,
        args: [
          status,
          status === 'denied' ? null : prNumber,
          status === 'denied' ? null : JSON.stringify(decisions),
          status === 'denied' ? (denyNotes[sub.id] ?? null) : null,
          sub.id,
        ],
      })
      await logAdminAction(client, `merge-${status}`, sub.id, getClientAddress())
    }

    try {
      const pooledRows = await client.execute({
        sql: `SELECT id, scenario_name FROM recipe_submissions WHERE pr_number = ? AND status IN ('approved', 'partial')`,
        args: [prNumber],
      })
      const pooled = pooledRows.rows.map((r) => ({
        id: Number(r.id),
        scenario_name: String(r.scenario_name),
      }))
      await refreshPoolPrBody(githubToken, prNumber, pooled)
    } catch {
      /* non-fatal */
    }

    return new Response(
      JSON.stringify({
        ok: true,
        prNumber,
        prUrl,
        merged: { payoutMin: merged.payoutMin, payoutMax: merged.payoutMax, actions: merged.recipe },
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    )
  } catch (err) {
    console.error('recipe-submissions merge failed', err)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
