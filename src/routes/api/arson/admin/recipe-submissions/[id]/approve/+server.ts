import type { RequestHandler } from './$types'
import { createClient } from '@libsql/client/web'
import { isAdminRequest } from '$lib/server/session'
import { patchScenarioSource, type RecipePayload } from '$lib/server/scenarios-patch'
import {
  getBranchSha,
  createBranch,
  deleteBranch,
  getFileContent,
  updateFile,
  createPullRequest,
} from '$lib/server/github'

const SCENARIOS_PATH = 'src/data/scenarios.ts'
const BASE_BRANCH = 'main'

interface SubmissionRow {
  id: number
  scenario_name: string
  payout_min: number
  payout_max: number
  recipe: string
  status: string
}

export const POST: RequestHandler = async ({ params, platform, cookies }) => {
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

    const recipe = JSON.parse(row.recipe) as RecipePayload
    const branchName = `recipe-approval-${submissionId}`

    let prNumber: number
    let prUrl: string
    let branchCreated = false
    try {
      const mainSha = await getBranchSha(githubToken, BASE_BRANCH)
      await createBranch(githubToken, branchName, mainSha)
      branchCreated = true

      const file = await getFileContent(githubToken, SCENARIOS_PATH, branchName)
      const patched = patchScenarioSource(
        file.content,
        row.scenario_name,
        row.payout_min,
        row.payout_max,
        recipe,
      )
      await updateFile(
        githubToken,
        SCENARIOS_PATH,
        patched,
        `feat(arson): approve community recipe for "${row.scenario_name}" (submission #${submissionId})`,
        branchName,
        file.sha,
      )

      const pr = await createPullRequest(
        githubToken,
        `Approve community recipe: ${row.scenario_name}`,
        branchName,
        BASE_BRANCH,
        `Auto-generated from an approved community submission (#${submissionId}) on balaclava.app.\n\n` +
          `Payout: ${row.payout_min}–${row.payout_max}\n\nReview the diff, then merge to ship this to all userscript users.`,
      )
      prNumber = pr.number
      prUrl = pr.htmlUrl
    } catch (err) {
      if (branchCreated) {
        try {
          await deleteBranch(githubToken, branchName)
        } catch {
          /* best-effort cleanup */
        }
      }
      const msg = err instanceof Error ? err.message : String(err)
      return new Response(JSON.stringify({ error: `Failed to open PR: ${msg}` }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    await client.execute({
      sql: `UPDATE recipe_submissions SET status = 'approved', pr_number = ? WHERE id = ?`,
      args: [prNumber, submissionId],
    })

    return new Response(JSON.stringify({ ok: true, prNumber, prUrl }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    const msg = err instanceof Error ? `${err.name}: ${err.message}` : String(err)
    return new Response(msg, { status: 500, headers: { 'Content-Type': 'text/plain' } })
  }
}
