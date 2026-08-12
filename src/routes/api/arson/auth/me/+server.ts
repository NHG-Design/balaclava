import type { RequestHandler } from './$types'
import { verifySession, PLAYER_SESSION_COOKIE } from '$lib/server/session'

interface PlayerSession {
  playerId: string
  name: string
}

export const GET: RequestHandler = async ({ platform, cookies }) => {
  const secret = platform?.env?.PLAYER_SESSION_SECRET
  if (!secret) return new Response('Not configured', { status: 500 })

  const session = await verifySession<PlayerSession>(secret, cookies.get(PLAYER_SESSION_COOKIE))
  if (!session) {
    return new Response(JSON.stringify({ loggedIn: false }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  return new Response(
    JSON.stringify({ loggedIn: true, playerId: session.playerId, name: session.name }),
    { status: 200, headers: { 'Content-Type': 'application/json' } },
  )
}
