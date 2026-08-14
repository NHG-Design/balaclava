import type { RequestHandler } from './$types'
import { createClient } from '@libsql/client/web'
import { signSession, verifyPassword, timingSafeEqual, ADMIN_SESSION_COOKIE } from '$lib/server/session'
import { logAdminAction } from '$lib/server/audit'

const SESSION_MAX_AGE_SECONDS = 12 * 60 * 60 // 12 hours
const LOGIN_RATE_LIMIT_WINDOW_MINUTES = 15
const LOGIN_RATE_LIMIT_MAX = 5

export const POST: RequestHandler = async ({ request, platform, cookies, getClientAddress }) => {
  try {
    const username = platform?.env?.SCENARIO_ADMIN_USERNAME
    const passwordHash = platform?.env?.SCENARIO_ADMIN_PASSWORD_HASH
    const sessionSecret = platform?.env?.SCENARIO_ADMIN_SESSION_SECRET
    const dbUrl = platform?.env?.TURSO_DATABASE_URL
    const authToken = platform?.env?.TURSO_AUTH_TOKEN
    if (!username || !passwordHash || !sessionSecret || !dbUrl || !authToken) {
      return new Response('Not configured', { status: 500 })
    }

    const client = createClient({ url: dbUrl, authToken })
    const clientIp = getClientAddress()

    const recent = await client.execute({
      sql: `SELECT COUNT(*) as count FROM admin_login_attempts WHERE ip = ? AND success = 0 AND created_at >= datetime('now', ?)`,
      args: [clientIp, `-${LOGIN_RATE_LIMIT_WINDOW_MINUTES} minutes`],
    })
    if (Number(recent.rows[0]?.count ?? 0) >= LOGIN_RATE_LIMIT_MAX) {
      return new Response(JSON.stringify({ error: 'Too many attempts, try again later' }), {
        status: 429,
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

    const passwordOk = await verifyPassword(password, passwordHash)
    const loginOk = timingSafeEqual(inputUsername, username) && passwordOk

    await client.execute({
      sql: `INSERT INTO admin_login_attempts (ip, success) VALUES (?, ?)`,
      args: [clientIp, loginOk ? 1 : 0],
    })

    if (!loginOk) {
      return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    await logAdminAction(client, 'login', null, clientIp)

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
