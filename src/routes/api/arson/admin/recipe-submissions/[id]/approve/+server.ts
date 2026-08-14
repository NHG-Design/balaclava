import type { RequestHandler } from './$types'
import { createClient } from '@libsql/client/web'
import { isAdminRequest } from '$lib/server/session'
import { patchScenarioSource, type RecipePayload } from '$lib/server/scenarios-patch'
import { bumpPatch } from '$lib/server/version-bump'
import {
  getBranchSha,
  createBranch,
  deleteBranch,
  getFileContent,
  updateFile,
  createPullRequest,
  findOpenPullRequest,
  updatePullRequestBody,
} from '$lib/server/github'

const SCENARIOS_PATH = 'src/data/scenarios.ts'
const VERSIONS_PATH = 'versions.json'
const BASE_BRANCH = 'main'
const POOL_BRANCH = 'recipe-pool'

interface SubmissionRow {
  id: number
  scenario_name: string
  payout_min: number
  payout_max: number
  recipe: string
  status: string
}

interface PooledSubmission {
  id: number
  scenario_name: string
}

function buildPrBody(pooled: PooledSubmission[]): string {
  const list = pooled.map((p) => `- #${p.id} — ${p.scenario_name}`).join('\n')
  return (
    `Auto-generated from approved community submission(s) on balaclava.app.\n\n` +
    `Pooled submissions:\n${list}\n\n` +
    `Also bumps the userscript's patch version, since this changes shipped recipe data.\n\n` +
    `Review the diff, then merge to ship this to all userscript users.`
  )
}

/** Pushes a fresh version bump to a branch if it doesn't already match, computed from
 *  `main`'s current version (not incrementally off the branch) — the recipe-pool PR always
 *  stays exactly one patch version ahead of main, however much main has moved since. */
async function refreshVersionBump(githubToken: string, branch: string): Promise<void> {
  const [mainVersions, branchVersions] = await Promise.all([
    getFileContent(githubToken, VERSIONS_PATH, BASE_BRANCH),
    getFileContent(githubToken, VERSIONS_PATH, branch),
  ])
  const mainParsed = JSON.parse(mainVersions.content) as Record<string, string>
  const targetVersion = bumpPatch(mainParsed['arsonists-ledger'])

  const branchParsed = JSON.parse(branchVersions.content) as Record<string, string>
  if (branchParsed['arsonists-ledger'] === targetVersion) return // already fresh

  branchParsed['arsonists-ledger'] = targetVersion
  const updated = JSON.stringify(branchParsed, null, 2) + '\n'
  await updateFile(
    githubToken,
    VERSIONS_PATH,
    updated,
    `chore(arson): bump arsonists-ledger to ${targetVersion}`,
    branch,
    branchVersions.sha,
  )
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

    let prNumber: number
    let prUrl: string
    let branchCreated = false
    try {
      const openPool = await findOpenPullRequest(githubToken, POOL_BRANCH)

      if (openPool) {
        // Add this approval's patch to the already-open pool PR/branch.
        const file = await getFileContent(githubToken, SCENARIOS_PATH, POOL_BRANCH)
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
          POOL_BRANCH,
          file.sha,
        )
        await refreshVersionBump(githubToken, POOL_BRANCH)

        prNumber = openPool.number
        prUrl = openPool.htmlUrl
      } else {
        // No pool currently open — start a fresh one on the same fixed branch name.
        try {
          await deleteBranch(githubToken, POOL_BRANCH)
        } catch {
          /* branch may not exist yet — fine */
        }

        const mainSha = await getBranchSha(githubToken, BASE_BRANCH)
        await createBranch(githubToken, POOL_BRANCH, mainSha)
        branchCreated = true

        const file = await getFileContent(githubToken, SCENARIOS_PATH, POOL_BRANCH)
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
          POOL_BRANCH,
          file.sha,
        )
        await refreshVersionBump(githubToken, POOL_BRANCH)

        const pr = await createPullRequest(
          githubToken,
          `Approve community recipe: ${row.scenario_name}`,
          POOL_BRANCH,
          BASE_BRANCH,
          buildPrBody([{ id: submissionId, scenario_name: row.scenario_name }]),
        )
        prNumber = pr.number
        prUrl = pr.htmlUrl
      }
    } catch (err) {
      if (branchCreated) {
        try {
          await deleteBranch(githubToken, POOL_BRANCH)
        } catch {
          /* best-effort cleanup */
        }
      }
      const msg = err instanceof Error ? err.message : String(err)
      return new Response(JSON.stringify({ error: `Failed to open/update PR: ${msg}` }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    await client.execute({
      sql: `UPDATE recipe_submissions SET status = 'approved', pr_number = ? WHERE id = ?`,
      args: [prNumber, submissionId],
    })

    // Best-effort: refresh the PR body with the full pooled list. Doesn't fail the request —
    // the approve itself (branch, patch, PR, DB) already succeeded by this point.
    try {
      const pooledRows = await client.execute({
        sql: `SELECT id, scenario_name FROM recipe_submissions WHERE pr_number = ? AND status = 'approved'`,
        args: [prNumber],
      })
      const pooled = pooledRows.rows.map((r) => ({
        id: Number(r.id),
        scenario_name: String(r.scenario_name),
      }))
      await updatePullRequestBody(githubToken, prNumber, buildPrBody(pooled))
    } catch {
      /* non-fatal */
    }

    const siblings = await client.execute({
      sql: `SELECT id FROM recipe_submissions WHERE scenario_name = ? AND status = 'pending' AND id != ?`,
      args: [row.scenario_name, submissionId],
    })
    const siblingsToDeny = siblings.rows.map((r) => Number(r.id))

    return new Response(JSON.stringify({ ok: true, prNumber, prUrl, siblingsToDeny }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    const msg = err instanceof Error ? `${err.name}: ${err.message}` : String(err)
    return new Response(msg, { status: 500, headers: { 'Content-Type': 'text/plain' } })
  }
}
