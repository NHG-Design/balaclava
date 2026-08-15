import type { RequestHandler } from './$types'
import { createClient } from '@libsql/client/web'
import { isAdminRequest } from '$lib/server/session'

export const GET: RequestHandler = async ({ url, platform, cookies }) => {
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

    const limit = Math.min(Math.max(Number(url.searchParams.get('limit')) || 200, 1), 500)
    const offset = Math.max(Number(url.searchParams.get('offset')) || 0, 0)

    const client = createClient({ url: dbUrl, authToken })
    const result = await client.execute({
      sql: `SELECT id, scenario_name, payout_min, payout_max, submitter_id, submitter_name, recipe, status, pr_number, created_at
       FROM recipe_submissions
       ORDER BY (status = 'pending') DESC, scenario_name ASC, created_at DESC
       LIMIT ? OFFSET ?`,
      args: [limit, offset],
    })

    return new Response(JSON.stringify({ submissions: result.rows }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('admin/recipe-submissions GET failed', err)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
