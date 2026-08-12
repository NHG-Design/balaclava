export const PLAYER_SESSION_COOKIE = 'pyro_player_session'
export const ADMIN_SESSION_COOKIE = 'pyro_admin_session'

/** Unsalted SHA-256 hex digest — matches the convention implied by SCENARIO_ADMIN_PASSWORD_HASH's
 *  existing 64-hex-char value. */
export async function sha256Hex(input: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input))
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

async function hmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify'],
  )
}

function base64urlEncode(bytes: Uint8Array): string {
  let str = ''
  for (const b of bytes) str += String.fromCharCode(b)
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function base64urlDecode(str: string): Uint8Array {
  const padded = str.replace(/-/g, '+').replace(/_/g, '/')
  const bin = atob(padded + '='.repeat((4 - (padded.length % 4)) % 4))
  const bytes = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
  return bytes
}

/** Signs a JSON payload + expiry into a compact `base64url(payload).base64url(hmac)` token — a minimal
 *  hand-rolled signed-cookie scheme using the Workers-native Web Crypto API, avoiding a new npm dependency. */
export async function signSession(
  secret: string,
  payload: Record<string, unknown>,
  maxAgeSeconds: number,
): Promise<string> {
  const body = { ...payload, exp: Date.now() + maxAgeSeconds * 1000 }
  const encodedPayload = base64urlEncode(new TextEncoder().encode(JSON.stringify(body)))
  const key = await hmacKey(secret)
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(encodedPayload))
  return `${encodedPayload}.${base64urlEncode(new Uint8Array(sig))}`
}

/** Checks the admin session cookie against SCENARIO_ADMIN_SESSION_SECRET; true if valid. */
export async function isAdminRequest(
  secret: string | undefined,
  cookies: { get(name: string): string | undefined },
): Promise<boolean> {
  if (!secret) return false
  const session = await verifySession<{ admin: boolean }>(secret, cookies.get(ADMIN_SESSION_COOKIE))
  return !!session?.admin
}

/** Verifies signature + expiry; returns the payload or null if invalid/expired/missing. */
export async function verifySession<T extends object>(
  secret: string,
  token: string | undefined | null,
): Promise<T | null> {
  if (!token) return null
  const [encodedPayload, encodedSig] = token.split('.')
  if (!encodedPayload || !encodedSig) return null

  const key = await hmacKey(secret)
  const valid = await crypto.subtle.verify(
    'HMAC',
    key,
    base64urlDecode(encodedSig) as BufferSource,
    new TextEncoder().encode(encodedPayload),
  )
  if (!valid) return null

  const body = JSON.parse(new TextDecoder().decode(base64urlDecode(encodedPayload))) as T & {
    exp: number
  }
  if (typeof body.exp !== 'number' || body.exp < Date.now()) return null
  return body
}
