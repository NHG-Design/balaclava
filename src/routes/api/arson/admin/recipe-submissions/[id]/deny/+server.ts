import type { RequestHandler } from './$types'
import { createClient } from '@libsql/client/web'
import { isAdminRequest } from '$lib/server/session'

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
    if (!dbUrl || !authToken) return new Response('Not configured', { status: 500 })

    const submissionId = Number(params.id)
    if (!Number.isInteger(submissionId) || submissionId <= 0) {
      return new Response(JSON.stringify({ error: 'Invalid submission id' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const client = createClient({ url: dbUrl, authToken })
    const result = await client.execute({
      sql: `UPDATE recipe_submissions SET status = 'denied' WHERE id = ? AND status = 'pending'`,
      args: [submissionId],
    })
    if (result.rowsAffected === 0) {
      return new Response(JSON.stringify({ error: 'Submission not found or not pending' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    const msg = err instanceof Error ? `${err.name}: ${err.message}` : String(err)
    return new Response(msg, { status: 500, headers: { 'Content-Type': 'text/plain' } })
  }
}
