import type { RequestHandler } from './$types'
import { isAdminRequest } from '$lib/server/session'
import { findOpenPullRequest, getFileContent } from '$lib/server/github'
import { SCENARIOS_PATH, POOL_BRANCH } from '$lib/server/pr-pool'
import { parseScenarioEntry } from '$lib/server/scenarios-parse'
import type { CurrentScenario } from '$lib/recipe-diff'

/** Returns the current recipe-pool branch's data for the requested scenario names (if a pool
 *  PR is open), so the admin page can diff sibling submissions against what's actually queued
 *  to ship instead of stale deployed data. Best-effort: a scenario that fails to parse is just
 *  omitted from the response, never a hard error. */
export const GET: RequestHandler = async ({ url, platform, cookies }) => {
  try {
    if (!(await isAdminRequest(platform?.env?.SCENARIO_ADMIN_SESSION_SECRET, cookies))) {
      return new Response(JSON.stringify({ error: 'Not authorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const githubToken = platform?.env?.GITHUB_PAT
    if (!githubToken) {
      return new Response('Not configured', { status: 500 })
    }

    const names = (url.searchParams.get('names') ?? '')
      .split(',')
      .map((n) => n.trim())
      .filter(Boolean)
    if (names.length === 0) {
      return new Response(JSON.stringify({ scenarios: {} }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const openPool = await findOpenPullRequest(githubToken, POOL_BRANCH)
    if (!openPool) {
      return new Response(JSON.stringify({ scenarios: {} }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const file = await getFileContent(githubToken, SCENARIOS_PATH, POOL_BRANCH)
    const scenarios: Record<string, CurrentScenario> = {}
    for (const name of names) {
      const parsed = parseScenarioEntry(file.content, name)
      if (parsed) scenarios[name] = parsed
    }

    return new Response(JSON.stringify({ scenarios }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('pool-scenarios GET failed', err)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
