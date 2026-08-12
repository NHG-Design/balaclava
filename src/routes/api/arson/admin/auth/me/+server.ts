import type { RequestHandler } from './$types'
import { verifySession, ADMIN_SESSION_COOKIE } from '$lib/server/session'

export const GET: RequestHandler = async ({ platform, cookies }) => {
  const secret = platform?.env?.SCENARIO_ADMIN_SESSION_SECRET
  if (!secret) return new Response('Not configured', { status: 500 })

  const session = await verifySession<{ admin: boolean }>(
    secret,
    cookies.get(ADMIN_SESSION_COOKIE),
  )

  return new Response(JSON.stringify({ loggedIn: !!session?.admin }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}
