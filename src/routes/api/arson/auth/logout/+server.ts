import type { RequestHandler } from './$types'
import { PLAYER_SESSION_COOKIE } from '$lib/server/session'

export const POST: RequestHandler = async ({ cookies }) => {
  cookies.delete(PLAYER_SESSION_COOKIE, { path: '/' })
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}
