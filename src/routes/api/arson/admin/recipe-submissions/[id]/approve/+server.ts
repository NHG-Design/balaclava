import type { RequestHandler } from './$types'
import { createClient } from '@libsql/client/web'
import { isAdminRequest } from '$lib/server/session'
import { logAdminAction } from '$lib/server/audit'
import { type RecipePayload } from '$lib/server/scenarios-patch'
import { writeToPool, refreshPoolPrBody } from '$lib/server/pr-pool'
import { SCENARIOS } from '../../../../../../../data/scenarios'
import {
  computeLineDiffs,
  hasAnyDenial,
  isAllDenied,
  mergeDecisions,
  type FieldDecisions,
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

export const POST: RequestHandler = async ({ params, request, platform, cookies, getClientAddress }) => {
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

    const submissionId = Number(params.id)
    if (!Number.isInteger(submissionId) || submissionId <= 0) {
      return new Response(JSON.stringify({ error: 'Invalid submission id' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Per-line approve/deny verdicts from the admin card; a key missing here defaults to
    // 'approve', so an empty body reproduces the old whole-submission approve behavior.
    let decisions: FieldDecisions = {}
    try {
      const body = (await request.json()) as { decisions?: FieldDecisions }
      decisions = body?.decisions ?? {}
    } catch {
      /* no body — full approve */
    }

    const client = createClient({ url: dbUrl, authToken })
    const rows = await client.execute({
      sql: 'SELECT id, scenario_name, payout_min, payout_max, recipe, status FROM recipe_submissions WHERE id = ?',
      args: [submissionId],
    })
    const row = rows.rows[0] as unknown as SubmissionRow | undefined
    if (!row) {
      return new Response(JSON.stringify({ error: 'Submission not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      })
    }
    if (row.status !== 'pending') {
      return new Response(JSON.stringify({ error: `Submission is not pending (status: ${row.status})` }), {
        status: 409,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const submittedRecipe = JSON.parse(row.recipe) as Recipe
    const currentScenario = SCENARIOS.find((sc) => sc.scenarioName === row.scenario_name)
    const current = currentScenario
      ? {
          payoutMin: currentScenario.payoutMin,
          payoutMax: currentScenario.payoutMax,
          actions: currentScenario.actions,
        }
      : undefined

    const lineDiffs = computeLineDiffs(row, submittedRecipe, current)
    if (isAllDenied(lineDiffs, decisions)) {
      return new Response(
        JSON.stringify({ error: 'All lines denied — use the deny endpoint instead' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      )
    }
    const partial = hasAnyDenial(lineDiffs, decisions)
    const merged = mergeDecisions(row, submittedRecipe, current, decisions)
    const recipe = merged.recipe as RecipePayload

    let prNumber: number
    let prUrl: string
    try {
      const result = await writeToPool(
        githubToken,
        row.scenario_name,
        `feat(arson): approve community recipe for "${row.scenario_name}" (submission #${submissionId})`,
        merged.payoutMin,
        merged.payoutMax,
        recipe,
        'Approve community recipes',
        [{ id: submissionId, scenario_name: row.scenario_name }],
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

    await client.execute({
      sql: `UPDATE recipe_submissions SET status = ?, pr_number = ?, field_decisions = ? WHERE id = ?`,
      args: [
        partial ? 'partial' : 'approved',
        prNumber,
        Object.keys(decisions).length > 0 ? JSON.stringify(decisions) : null,
        submissionId,
      ],
    })

    await logAdminAction(client, partial ? 'partial-approve' : 'approve', submissionId, getClientAddress())

    // Best-effort: refresh the PR body with the full pooled list. Doesn't fail the request —
    // the approve itself (branch, patch, PR, DB) already succeeded by this point.
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
        // So the admin page can immediately correct sibling cards' diff baseline for this
        // scenario without waiting on a page reload or a pool-PR refetch.
        merged: { payoutMin: merged.payoutMin, payoutMax: merged.payoutMax, actions: merged.recipe },
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      },
    )
  } catch (err) {
    console.error('recipe-submissions approve failed', err)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
