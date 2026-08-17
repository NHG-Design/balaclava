import type { RequestHandler } from './$types'
import { createClient } from '@libsql/client/web'
import { isAdminRequest } from '$lib/server/session'
import { logAdminAction } from '$lib/server/audit'

export const POST: RequestHandler = async ({
  params,
  platform,
  cookies,
  getClientAddress,
  request,
}) => {
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

    let note: string | null = null
    try {
      const body = (await request.json()) as { note?: unknown }
      if (typeof body.note === 'string' && body.note.trim() !== '') {
        const trimmed = body.note.trim()
        if (trimmed.length > 500) {
          return new Response(JSON.stringify({ error: 'Note must be 500 characters or fewer' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          })
        }
        note = trimmed
      }
    } catch {
      // no body / not JSON — treat as no note
    }

    const client = createClient({ url: dbUrl, authToken })
    const result = await client.execute({
      sql: `UPDATE recipe_submissions SET status = 'denied', deny_note = ? WHERE id = ? AND status = 'pending'`,
      args: [note, submissionId],
    })
    if (result.rowsAffected === 0) {
      return new Response(JSON.stringify({ error: 'Submission not found or not pending' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    await logAdminAction(client, 'deny', submissionId, getClientAddress())

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('recipe-submissions deny failed', err)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
