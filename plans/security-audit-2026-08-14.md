# Security Audit — Balaclava (app code, userscripts excluded)

> Static audit performed 2026-08-14 via the `sentinel` skill. Scope: `src/routes/`, `src/lib/server/`, config files. Userscripts (`src/userscripts/`) explicitly excluded per request.

## Phase 1 — Stack Triage

**Framework:** SvelteKit 2 + Svelte 5, deployed via `@sveltejs/adapter-cloudflare` to Cloudflare Pages. **Database:** Turso (libSQL) via `@libsql/client/web`, all queries parameterized. **Auth:** two independent hand-rolled HMAC-SHA256 signed-cookie schemes (`src/lib/server/session.ts`) — an admin session (`SCENARIO_ADMIN_*` env vars, username+password login) and formerly a player session (removed in a prior commit). No framework session library, no JWT library. **Deploy target:** Cloudflare Pages/Workers — `getClientAddress()` is used for rate-limiting, which the Cloudflare adapter resolves from `CF-Connecting-IP` internally (correct trust source, not a spoofable header). **File uploads:** none. **External outbound calls:** GitHub REST API (PR automation, admin-only, fixed host/repo) and Torn's public API (fixed host, for signature images) — inbound GitHub webhook with HMAC verification. Read: `package.json`, `wrangler.toml`, all files under `src/routes/api/`, `src/lib/server/`.

## Summary

| # | Category | Status | Notes |
|---|----------|--------|-------|
| A1 | SQL injection | PASS | All queries parameterized (`recipe-submissions/+server.ts`, admin routes) |
| A3 | Command injection | PASS | No `exec`/`spawn` in deployed app code |
| A4–A7 | SSTI / XXE / LDAP | N/A | Not applicable to this stack |
| A8 | HTTP param pollution | PASS | Simple JSON bodies; `url.searchParams.get` single-value usage |
| B1–B3 | XSS (reflected/stored/DOM) | PASS | No `{@html}`, `innerHTML`, or `eval` found anywhere in `src/routes` |
| B4 | Content Security Policy | **FAIL** | No CSP header set anywhere |
| B5 | Subresource integrity | N/A | No external CDN scripts/styles; fonts self-hosted |
| B6 | Open redirect | PASS | No user-controlled `redirect()`/`Location` |
| B7 | Clickjacking | **FAIL** | No `X-Frame-Options`/`frame-ancestors` |
| B8 | Tabnabbing | PASS | All `target="_blank"` links carry `rel="noopener noreferrer"` |
| B9 | postMessage | N/A | Not used |
| B10 | Secrets in bundle | PASS | All `platform.env` access confined to `+server.ts`/`+page.server.ts` |
| B11 | localStorage abuse | PASS | Cookies used for sessions, not localStorage |
| C1 | Cookie attributes | PASS | `httpOnly`, `secure`, `sameSite: 'lax'` on admin cookie |
| C2 | Token expiry | PASS | `exp` embedded and checked in `verifySession` |
| C3 | Session revocation | MANUAL-REVIEW | Stateless token; logout can't revoke server-side |
| C5 | Password hashing | **FAIL** | Unsalted single-round SHA-256 |
| C8 | Brute-force protection | **FAIL** | No rate limit on admin login |
| C10 | Session fixation | PASS | Token only minted post-auth |
| D1 | HSTS | MANUAL-REVIEW | Cloudflare dashboard setting, not in repo |
| D2 | CORS | PASS | Explicit origin allowlist, no wildcard |
| D3 | CSRF | PASS | `SameSite=Lax` on the only state-changing-request cookie |
| D4 | Security headers | **FAIL** | No `X-Content-Type-Options`/`Referrer-Policy`/`Permissions-Policy` |
| D5 | Host header injection | PASS | No URL built from `Host` header |
| D6 | Request smuggling | MANUAL-REVIEW | Cloudflare edge-level, not app-verifiable |
| D7 | Cache poisoning | MANUAL-REVIEW | No explicit `Cache-Control`/`Vary` on dynamic API responses |
| E1 | Input validation | PASS | Full server-side schema check in `recipe-submissions/+server.ts` |
| E3 | Path traversal | PASS | `scenarios-patch.ts` only ever touches a hardcoded path |
| E4 | ReDoS | PASS | All regexes bounded, no nested quantifiers |
| E5 | Mass assignment | PASS | `validate()` whitelists fields explicitly |
| E6 | IDOR | PASS | All mutations admin-gated; no ownership model needed |
| E7 | Excessive data exposure | PASS | `submitter_ip` excluded from every response |
| E8 | Pagination limits | **FAIL** | Both list endpoints return unbounded rows |
| E9 | SSRF | PASS | All outbound hosts hardcoded; GitHub path segments are constants or validated integers |
| F1/C5 | Algorithm choice | **FAIL** | Same as C5 |
| F2 | Insecure randomness | PASS | No `Math.random()` in security-relevant code |
| F3 | Secret storage | PASS | Env-var only, `.dev.vars` gitignored, never committed |
| F4 | Timing attacks | **FAIL** | Admin login password compare is not constant-time |
| F5 | Token scope | MANUAL-REVIEW | GitHub PAT scope not re-verifiable from code |
| F6 | Webhook HMAC | PASS | Raw body + constant-time compare, matches GitHub's published test vector |
| G1 | Dependency CVEs | **FAIL** | 1 high in prod tree (`ws` via `@libsql/client`), 25 total incl. dev |
| G2 | Lockfile | PASS | `pnpm-lock.yaml` committed |
| G3 | Git-pinned deps | PASS | No `github:` deps |
| G5 | Secrets in history | PASS | Confirmed via `git log` — never committed |
| H1 | Error disclosure | **FAIL** | Raw `err.message` returned to client on every route |
| H3 | Audit logging | MANUAL-REVIEW | No explicit security-event log beyond DB status/timestamp |
| H4 | Rate limiting | **FAIL** | Only the public submission POST is rate-limited |
| H5 | Admin endpoint protection | PASS | Defense in depth: page-level + per-handler auth |
| H6 | Debug endpoints | PASS | None found |
| H7 | Default credentials | MANUAL-REVIEW | Actual admin password strength not verifiable from code |
| H8 | Security.txt | **FAIL** | Not present |
| H9 | Dependency update policy | PASS | Dependabot active (confirmed via GitHub push output) |
| H10 | Backup/recovery | MANUAL-REVIEW | Turso backup config not in repo |

**Skipped:** `src/routes/api/sig/`, `src/routes/api/sigs/[id]/`, `src/routes/api/faction/[id]/` were spot-checked only (pre-existing, lower-sensitivity signature-image endpoints, allowlist-gated) — not read line-by-line for every category. `scripts/*.ts` (dev tooling, not part of the deployed Worker) excluded per scope.

---

### 1. Content Security Policy — FAIL
**File:** no `src/hooks.server.ts` or `static/_headers` exists
**Risk:** No CSP means any XSS that does slip through (or a future `{@html}` mistake) has no second line of defense; also no `frame-ancestors` protection.
**Fix:**
```ts
// src/hooks.server.ts (new file)
import type { Handle } from '@sveltejs/kit'

export const handle: Handle = async ({ event, resolve }) => {
  const response = await resolve(event)
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; frame-ancestors 'none'; base-uri 'self'",
  )
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'geolocation=(), camera=(), microphone=()')
  return response
}
```

### 2. Clickjacking — FAIL
**File:** same as above — no `X-Frame-Options`
**Risk:** The admin login/dashboard could be framed by a malicious page and clickjacked (e.g. an invisible iframe overlaying "Approve" buttons).
**Fix:** Covered by the `frame-ancestors 'none'` directive in the CSP fix above (modern browsers honor it over `X-Frame-Options`); for older-browser defense in depth also add:
```ts
response.headers.set('X-Frame-Options', 'DENY')
```

### 3. Security headers — FAIL
**File:** same `hooks.server.ts` fix as #1/#2 — folded into the same handler.

### 4. Password hashing — FAIL
**File:** `src/lib/server/session.ts:5-10`
**Snippet:**
```ts
export async function sha256Hex(input: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input))
  ...
}
```
used at `src/routes/api/arson/admin/auth/login/+server.ts:36`:
```ts
const inputHash = await sha256Hex(password)
if (inputUsername !== username || inputHash !== passwordHash) {
```
**Risk:** Unsalted, single-round SHA-256 is fast to brute-force offline (billions of guesses/sec on commodity GPUs) if `SCENARIO_ADMIN_PASSWORD_HASH` ever leaks (e.g. via a misconfigured log, a Cloudflare dashboard screenshot, or a future bug). A real password hash function is designed to be slow specifically to prevent this.
**Fix:** Cloudflare Workers' `crypto.subtle` doesn't ship PBKDF2-with-adjustable-cost as conveniently as bcrypt, but it does support PBKDF2 natively — use it with a high iteration count and a stored salt:
```ts
// New: hash a password with PBKDF2-SHA256, 210k iterations (OWASP 2023 minimum), random salt
export async function hashPassword(password: string, saltHex?: string): Promise<string> {
  const salt = saltHex
    ? Uint8Array.from(saltHex.match(/.{2}/g)!.map((b) => parseInt(b, 16)))
    : crypto.getRandomValues(new Uint8Array(16))
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits'])
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: 210_000, hash: 'SHA-256' },
    key,
    256,
  )
  const saltHexOut = Array.from(salt).map((b) => b.toString(16).padStart(2, '0')).join('')
  const hashHex = Array.from(new Uint8Array(bits)).map((b) => b.toString(16).padStart(2, '0')).join('')
  return `${saltHexOut}:${hashHex}`
}
```
Requires regenerating `SCENARIO_ADMIN_PASSWORD_HASH` in the new `salt:hash` format and updating the login route's comparison accordingly (see finding #5 for the comparison itself).

### 5. Timing attack on login — FAIL
**File:** `src/routes/api/arson/admin/auth/login/+server.ts:37`
**Snippet:**
```ts
if (inputUsername !== username || inputHash !== passwordHash) {
```
**Risk:** JavaScript's `!==` on strings short-circuits at the first differing character, leaking timing information about how many leading hex characters of the guessed hash are correct. Over many requests an attacker can use this to narrow the search space. (The webhook signature check in `github.ts:133-136` already does this correctly — this route is the inconsistent one.)
**Fix:**
```ts
import { timingSafeEqualHex } from '$lib/server/session' // extract the constant-time loop already in github.ts into session.ts and reuse it here

const inputHash = await sha256Hex(password) // or hashPassword() per finding #4
const usernameOk = inputUsername === username // username isn't secret, plain compare is fine
const hashOk = timingSafeEqualHex(inputHash, passwordHash)
if (!usernameOk || !hashOk) {
  return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401, ... })
}
```

### 6. Brute-force protection on admin login — FAIL
**File:** `src/routes/api/arson/admin/auth/login/+server.ts` (entire handler — no rate-limit check anywhere)
**Risk:** Unlimited login attempts against a single shared admin account with no lockout, throttle, or CAPTCHA. Combined with finding #4 (fast hash), if the hash ever leaks this is moot, but even hash-in-hand-only isn't required — this is a straightforward online brute-force target as-is.
**Fix:** Reuse the exact IP-based rate-limit pattern already implemented for submissions (`recipe-submissions/+server.ts:167-177`):
```ts
const recent = await client.execute({
  sql: `SELECT COUNT(*) as count FROM admin_login_attempts WHERE ip = ? AND created_at >= datetime('now', '-15 minutes')`,
  args: [getClientAddress()],
})
if (Number(recent.rows[0]?.count ?? 0) >= 5) {
  return new Response(JSON.stringify({ error: 'Too many attempts, try again later' }), { status: 429, ... })
}
// on failure, insert a row into admin_login_attempts(ip, created_at)
```
Requires a new `admin_login_attempts` Turso table (`id, ip, created_at`).

### 7. Pagination limits — FAIL
**File:** `src/routes/api/arson/admin/recipe-submissions/+server.ts:19-23` and `src/routes/api/arson/recipe-submissions/+server.ts:216-224`
**Snippet:**
```ts
const result = await client.execute(
  `SELECT id, scenario_name, ... FROM recipe_submissions ORDER BY ...`,
)
```
**Risk:** Both the admin and public listing endpoints return every matching row with no `LIMIT`. Low impact today given small data volume, but as submissions accumulate this becomes an unbounded-response DoS vector (a large enough table makes every page load fetch/serialize/render the entire history) with no cap to catch it before it's a problem.
**Fix:**
```ts
const result = await client.execute({
  sql: `... ORDER BY ... LIMIT ? OFFSET ?`,
  args: [...statuses, 100, offset], // add page/offset query param support to both endpoints
})
```

### 8. Error disclosure — FAIL
**File:** every `+server.ts` under `src/routes/api/arson/` — pattern repeats identically, e.g. `recipe-submissions/+server.ts:134-140`:
**Snippet:**
```ts
} catch (err) {
  const msg = err instanceof Error ? `${err.name}: ${err.message}` : String(err)
  return new Response(msg, { status: 500, headers: { 'Content-Type': 'text/plain', ...CORS_HEADERS } })
}
```
**Risk:** Raw exception messages (which can include Turso/libSQL internal error text, occasionally file paths or query fragments) are returned verbatim to unauthenticated clients on the public `recipe-submissions` POST/GET routes. This helps an attacker fingerprint the backend and occasionally leaks more than intended (e.g. a DB error revealing table/column names beyond what the public schema already implies).
**Fix:** Log server-side (once logging exists — see H2/H3 note below) and return a generic message to the client:
```ts
} catch (err) {
  console.error('recipe-submissions error:', err) // server-side only, not sent to client
  return new Response(JSON.stringify({ error: 'Internal server error' }), {
    status: 500,
    headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
  })
}
```
Apply the same change to all ~9 route handlers with this pattern.

### 9. Dependency CVE (prod-reachable) — FAIL
**File:** `pnpm-lock.yaml` — `ws` pulled in transitively via `@libsql/client > @libsql/hrana-client > @libsql/isomorphic-ws`
**Risk:** `ws <8.21.0` has a memory-exhaustion DoS via crafted fragmented frames (GHSA-96hv-2xvq-fx4p). The app imports `@libsql/client/web` (HTTP transport), so this specific `ws`-based path is likely unreachable in the deployed Worker — but the vulnerable package is still resolved into the tree and would activate if any code path ever touches the websocket transport.
**Fix:**
```jsonc
// package.json
"pnpm": {
  "overrides": {
    "cookie": ">=0.7.0",
    "ws": ">=8.21.0"
  }
}
```
Then `pnpm install` and re-run `pnpm audit --prod` to confirm it clears.

### 10. Security.txt — FAIL
**File:** `static/.well-known/security.txt` does not exist
**Risk:** No documented channel for a good-faith security researcher to report a finding responsibly.
**Fix:**
```
# static/.well-known/security.txt
Contact: mailto:robert@nhg.design
Preferred-Languages: en
Expires: 2027-08-14T00:00:00.000Z
```

---

### MANUAL-REVIEW items

```text
### Session revocation (C3)
**Action:** The admin session is a stateless signed token with no server-side store, so
"logout" can only delete the client's cookie — a stolen token stays valid until its 12h
`exp`. Decide whether that's acceptable (single low-value admin account, 12h window) or
whether a revocation list (e.g. a Turso `revoked_sessions` table checked on every
`verifySession` call) is worth the added complexity.
```
```text
### HSTS (D1)
**Action:** Verify in the Cloudflare dashboard (SSL/TLS → Edge Certificates) that "Always
Use HTTPS" and HSTS are both enabled for balaclava.app — this isn't set anywhere in the repo.
```
```text
### Request smuggling / cache poisoning (D6, D7)
**Action:** Both are edge/CDN-layer concerns Cloudflare handles by default for Pages, but
worth an explicit check: confirm no dynamic `/api/arson/*` response is being cached by
Cloudflare's edge cache (they don't set Cache-Control today, which defaults to Cloudflare's
standard heuristics — explicitly set `Cache-Control: no-store` on all `/api/arson/admin/*`
and any response containing `submitter_id`/`recipe` data to be safe).
```
```text
### GitHub PAT scope (F5)
**Action:** Re-confirm in GitHub → Settings → Developer settings → Fine-grained tokens that
GITHUB_PAT is still scoped to exactly `NHG-Design/balaclava` with only Contents:
Read-and-write + Pull requests: Read-and-write — no broader account access.
```
```text
### Audit logging (H3)
**Action:** Decide whether admin approve/deny/login and the community submission flow need
an explicit audit log (actor, IP, timestamp, action) beyond the implicit trail in
recipe_submissions.status/created_at — useful if abuse or a disputed approval ever needs
investigating after the fact.
```
```text
### Default/weak admin credentials (H7)
**Action:** Can't verify from code whether the current SCENARIO_ADMIN_PASSWORD_HASH
corresponds to a genuinely strong password — confirm it's not something short/guessable,
independent of the hashing-algorithm fix in finding #4.
```
```text
### Turso backup/recovery (H10)
**Action:** Confirm in the Turso dashboard that point-in-time recovery / backups are enabled
for the balaclava-arson-recipes database, and that access to trigger a restore is restricted.
```
