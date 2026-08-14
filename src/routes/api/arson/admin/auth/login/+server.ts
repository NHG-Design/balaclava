import type { RequestHandler } from './$types'
import { signSession, sha256Hex, timingSafeEqual, ADMIN_SESSION_COOKIE } from '$lib/server/session'

const SESSION_MAX_AGE_SECONDS = 12 * 60 * 60 // 12 hours

export const POST: RequestHandler = async ({ request, platform, cookies }) => {
  try {
    const username = platform?.env?.SCENARIO_ADMIN_USERNAME
    const passwordHash = platform?.env?.SCENARIO_ADMIN_PASSWORD_HASH
    const sessionSecret = platform?.env?.SCENARIO_ADMIN_SESSION_SECRET
    if (!username || !passwordHash || !sessionSecret) {
      return new Response('Not configured', { status: 500 })
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

    const { username: inputUsername, password } = body as {
      username?: unknown
      password?: unknown
    }
    if (typeof inputUsername !== 'string' || typeof password !== 'string') {
      return new Response(JSON.stringify({ error: 'Username and password required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const inputHash = await sha256Hex(password)
    if (!timingSafeEqual(inputUsername, username) || !timingSafeEqual(inputHash, passwordHash)) {
      return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const token = await signSession(sessionSecret, { admin: true }, SESSION_MAX_AGE_SECONDS)
    cookies.set(ADMIN_SESSION_COOKIE, token, {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: SESSION_MAX_AGE_SECONDS,
    })

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('admin login failed', err)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
