import type { RequestHandler } from './$types'
import { createClient } from '@libsql/client/web'
import { isAdminRequest } from '$lib/server/session'

export const GET: RequestHandler = async ({ platform, cookies }) => {
  try {
    if (!(await isAdminRequest(platform?.env?.SCENARIO_ADMIN_SESSION_SECRET, cookies))) {
      return new Response(JSON.stringify({ error: 'Not authorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const dbUrl = platform?.env?.TURSO_DATABASE_URL
    const authToken = platform?.env?.TURSO_AUTH_TOKEN
    if (!dbUrl || !authToken) return new Response('Not configured', { status: 500 })

    const client = createClient({ url: dbUrl, authToken })
    const result = await client.execute(
      `SELECT id, scenario_name, payout_min, payout_max, submitter_id, submitter_name, recipe, status, pr_number, created_at
       FROM recipe_submissions
       ORDER BY (status = 'pending') DESC, scenario_name ASC, created_at DESC`,
    )

    const decided = await client.execute(
      `SELECT DISTINCT scenario_name FROM recipe_submissions WHERE status IN ('approved', 'merged')`,
    )
    const scenariosWithApproved = new Set(decided.rows.map((r) => String(r.scenario_name)))

    const submissions = result.rows.map((row) => ({
      ...row,
      isStale: row.status === 'pending' && scenariosWithApproved.has(String(row.scenario_name)),
    }))

    return new Response(JSON.stringify({ submissions }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    const msg = err instanceof Error ? `${err.name}: ${err.message}` : String(err)
    return new Response(msg, { status: 500, headers: { 'Content-Type': 'text/plain' } })
  }
}
