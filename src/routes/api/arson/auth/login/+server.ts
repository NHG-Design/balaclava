import type { RequestHandler } from './$types'
import { signSession, PLAYER_SESSION_COOKIE } from '$lib/server/session'

const SESSION_MAX_AGE_SECONDS = 30 * 24 * 60 * 60 // 30 days

interface TornBasicProfile {
  player_id?: number
  name?: string
  error?: { code: number; error: string }
}

export const POST: RequestHandler = async ({ request, platform, cookies }) => {
  try {
    const secret = platform?.env?.PLAYER_SESSION_SECRET
    if (!secret) return new Response('Not configured', { status: 500 })

    let body: unknown
    try {
      body = await request.json()
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const apiKey = (body as { apiKey?: unknown })?.apiKey
    if (typeof apiKey !== 'string' || apiKey.trim() === '') {
      return new Response(JSON.stringify({ error: 'API key required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const response = await fetch(
      `https://api.torn.com/user/?selections=basic&key=${encodeURIComponent(apiKey.trim())}`,
    )
    const data = (await response.json()) as TornBasicProfile

    if (data.error) {
      return new Response(JSON.stringify({ error: `Torn API: ${data.error.error}` }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }
    if (!data.player_id || !data.name) {
      return new Response(JSON.stringify({ error: 'Unexpected Torn API response' }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const token = await signSession(
      secret,
      { playerId: String(data.player_id), name: data.name },
      SESSION_MAX_AGE_SECONDS,
    )

    cookies.set(PLAYER_SESSION_COOKIE, token, {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: SESSION_MAX_AGE_SECONDS,
    })

    return new Response(JSON.stringify({ ok: true, playerId: String(data.player_id), name: data.name }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    const msg = err instanceof Error ? `${err.name}: ${err.message}` : String(err)
    return new Response(msg, { status: 500, headers: { 'Content-Type': 'text/plain' } })
  }
}
