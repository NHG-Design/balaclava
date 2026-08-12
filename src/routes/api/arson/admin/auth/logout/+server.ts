import type { RequestHandler } from './$types'
import { ADMIN_SESSION_COOKIE } from '$lib/server/session'

export const POST: RequestHandler = async ({ cookies }) => {
  cookies.delete(ADMIN_SESSION_COOKIE, { path: '/' })
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}
