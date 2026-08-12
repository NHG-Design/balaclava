import type { RequestHandler } from './$types'
import { createClient } from '@libsql/client/web'
import { verifySession, PLAYER_SESSION_COOKIE } from '$lib/server/session'

interface PlayerSession {
  playerId: string
  name: string
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': 'https://balaclava.app',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Credentials': 'true',
}

export const OPTIONS: RequestHandler = async () => {
  return new Response(null, { status: 204, headers: CORS_HEADERS })
}

export const POST: RequestHandler = async ({ params, request, platform, cookies }) => {
  try {
    const response = await handler(params, request, platform, cookies)
    for (const [key, value] of Object.entries(CORS_HEADERS)) {
      response.headers.set(key, value)
    }
    return response
  } catch (err) {
    const msg = err instanceof Error ? `${err.name}: ${err.message}` : String(err)
    return new Response(msg, { status: 500, headers: { 'Content-Type': 'text/plain' } })
  }
}

async function handler(
  params: { id?: string },
  request: Request,
  platform: App.Platform | undefined,
  cookies: { get(name: string): string | undefined },
) {
  const dbUrl = platform?.env?.TURSO_DATABASE_URL
  const authToken = platform?.env?.TURSO_AUTH_TOKEN
  const sessionSecret = platform?.env?.PLAYER_SESSION_SECRET
  if (!dbUrl || !authToken || !sessionSecret) {
    return new Response('Not configured', { status: 500 })
  }

  const session = await verifySession<PlayerSession>(
    sessionSecret,
    cookies.get(PLAYER_SESSION_COOKIE),
  )
  if (!session) {
    return new Response(JSON.stringify({ error: 'Not logged in' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const submissionId = Number(params.id)
  if (!Number.isInteger(submissionId) || submissionId <= 0) {
    return new Response(JSON.stringify({ error: 'Invalid submission id' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const value = (body as { value?: unknown })?.value
  if (value !== 1 && value !== -1 && value !== 0) {
    return new Response(JSON.stringify({ error: 'value must be 1, -1, or 0 (retract)' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const client = createClient({ url: dbUrl, authToken })

  const exists = await client.execute({
    sql: 'SELECT id, status FROM recipe_submissions WHERE id = ?',
    args: [submissionId],
  })
  if (exists.rows.length === 0) {
    return new Response(JSON.stringify({ error: 'Submission not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  if (value === 0) {
    await client.execute({
      sql: 'DELETE FROM submission_votes WHERE submission_id = ? AND player_id = ?',
      args: [submissionId, session.playerId],
    })
  } else {
    await client.execute({
      sql: `INSERT INTO submission_votes (submission_id, player_id, value) VALUES (?, ?, ?)
            ON CONFLICT(submission_id, player_id) DO UPDATE SET value = excluded.value`,
      args: [submissionId, session.playerId, value],
    })
  }

  const tally = await client.execute({
    sql: 'SELECT COALESCE(SUM(value), 0) as score FROM submission_votes WHERE submission_id = ?',
    args: [submissionId],
  })
  const score = Number(tally.rows[0]?.score ?? 0)

  return new Response(JSON.stringify({ ok: true, score, yourVote: value === 0 ? null : value }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}
