# Security Audit — Balaclava (app code, userscripts excluded)

> Static audit performed 2026-08-15 via the `sentinel` skill. Scope: `src/routes/`, `src/lib/server/`, config files. Userscripts (`src/userscripts/`) explicitly excluded per request. Supersedes `security-audit-2026-08-14.md` — all verdicts re-derived from the current codebase, not carried over from the prior report.

## Phase 1 — Stack Triage

Balaclava is a SvelteKit 2 (Svelte 5) application deployed to Cloudflare Pages via `@sveltejs/adapter-cloudflare`, running on the Cloudflare Workers runtime (`nodejs_compat` flag, `wrangler.toml`). All server-side data access goes through `@libsql/client/web` to a Turso (libSQL) database, and every call site uses parameterized queries (`client.execute({ sql, args })`) — no string-concatenated SQL was found. Auth is a hand-rolled admin session: a single shared admin username/password (SHA-256 hash compared server-side) issues an HMAC-SHA256-signed, expiring cookie (`src/lib/server/session.ts`), used only to gate `/api/arson/admin/*`. There is no per-user auth system, no OAuth, no `hooks.server.ts` (none exists in the repo), and no `static/_headers` file, so no security headers, CSP, or HSTS are set anywhere in the app. Outbound calls are to a small, fixed set of trusted hosts (`api.torn.com`, `api.github.com`, Turso) — no user-controlled URLs are fetched, so SSRF surface is minimal. The `getClientAddress()` SvelteKit helper (backed by Cloudflare's `CF-Connecting-IP`) is used for IP-based rate limiting on the public recipe-submission endpoint. A GitHub webhook endpoint verifies `X-Hub-Signature-256` via constant-time HMAC comparison. Secrets (`GITHUB_PAT`, Torn API keys, Turso token, admin session secret) live in `.dev.vars` (gitignored, confirmed not in git history) and presumably Cloudflare secrets in production, accessed only through `platform.env` in `+server.ts` files — never bundled to the client.

## Summary

| # | Category | Status | Notes |
|---|----------|--------|-------|
| 1 | Security headers (CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy) | FAIL | No `hooks.server.ts`, no `static/_headers` anywhere in repo |
| 2 | Clickjacking (missing X-Frame-Options / frame-ancestors) | FAIL | Same root cause as #1 |
| 3 | Unsalted, unstretched SHA-256 password hash | FAIL | `src/lib/server/session.ts:5-10`, used in login |
| 4 | Non-constant-time credential comparison on admin login | FAIL | `src/routes/api/arson/admin/auth/login/+server.ts:37` |
| 5 | No brute-force protection on admin login | FAIL | Same file, no rate limiting/lockout |
| 6 | Unbounded pagination on recipe-submissions list endpoints | FAIL | Both admin and public GET handlers |
| 7 | Raw internal error messages (`err.message`/stack) returned to clients | FAIL | Present in nearly every `+server.ts` catch block |
| 8 | SQL injection | PASS | All queries parameterized via `client.execute({sql, args})` |
| 9 | XSS (reflected/stored) | PASS | User-controlled strings escaped before HTML interpolation in `/api/faction/[id]` and `/api/sig` |
| 10 | GitHub webhook signature verification | PASS | Constant-time HMAC compare, `src/lib/server/github.ts:151-176` |
| 11 | CORS on public recipe-submissions POST | PASS | Locked to `https://www.torn.com` origin, `src/routes/api/arson/recipe-submissions/+server.ts:134-138` |
| 12 | Rate limiting on public recipe submission | PASS | 20/60min per IP via `CF-Connecting-IP`, same file lines 184-207 |
| 13 | Admin endpoint auth (handler-level) | PASS | Every admin `+server.ts` calls `isAdminRequest()` before doing work |
| 14 | Cookie attributes on admin session | PASS | `httpOnly`, `secure`, `sameSite: lax`, `maxAge` set, `login/+server.ts:45-51` |
| 15 | `ws` transitive CVE via `@libsql/client` → `@libsql/isomorphic-ws` | FAIL | Confirmed present via `pnpm audit --prod` |
| 16 | Secrets in client bundle | PASS | All secrets read via `platform.env` only in `+server.ts`/`$lib/server` files |
| 17 | Secrets in git history (`.dev.vars`) | PASS | Gitignored, `git log --all -- .dev.vars` empty |
| 18 | Insecure randomness in security context | PASS | No `Math.random()` in auth/token code; `crypto.subtle` used throughout |
| 19 | ReDoS in regexes | PASS | Regexes reviewed (session, scenarios-patch, version-bump, github) — no nested/overlapping quantifiers on unbounded user input |
| 20 | Path traversal | PASS | No filesystem path built from user input in `src/routes` |
| 21 | Excessive data exposure (`submitter_ip`) | PASS | Neither admin nor public GET selects `submitter_ip`; only inserted, never returned |
| 22 | security.txt | FAIL | Not present |
| 23 | Dependabot / automated dependency updates | FAIL | No `.github/dependabot.yml`; only two unrelated workflow files exist |
| 24 | Session revocation | MANUAL-REVIEW | Stateless signed cookie — no server-side revocation list; requires infra/product decision |
| 25 | HSTS | MANUAL-REVIEW | Set at Cloudflare edge/dashboard, not verifiable from repo |
| 26 | Request smuggling / cache poisoning at Cloudflare edge | MANUAL-REVIEW | Infra-level, not verifiable from code |
| 27 | GitHub PAT scope | MANUAL-REVIEW | `GITHUB_PAT` used for repo contents/PR/branch API calls — actual token scope not visible from repo |
| 28 | Audit logging (admin approve/deny/login) | MANUAL-REVIEW | No app-level audit log found; may be covered by Cloudflare/Turso logging |
| 29 | Admin credential strength | MANUAL-REVIEW | Password strength/rotation policy is an operational fact, not code |
| 30 | Turso backup/recovery configuration | MANUAL-REVIEW | Infra-level, not in repo |

**Skipped:** `src/userscripts/**` (excluded per scope, includes `arsonists-ledger`, `balaclava-tooltip`, and `src/lib/shared-ui/dom.ts` which is only consumed by userscripts). `scripts/*.ts` (build/ops tooling, not part of the deployed Worker). `.github/workflows/*.yml` — checked only for Dependabot presence, not audited in depth for CI/CD secret handling. Non-security library code (`src/lib/factions.ts`, `personal-stats.ts`, `players.ts`, `users.ts`, `recipe-diff.ts`, `types.ts`, `config.ts`) — spot-checked via grep, not read line-by-line (no auth/DB-write/raw-HTML logic present).

---

### 1–2. Missing security headers / clickjacking protection — FAIL
**Files:** No `src/hooks.server.ts` exists; no `static/_headers` exists.
**Risk:** Every response — including the faction/personal signature image endpoints and all HTML pages — ships without `Content-Security-Policy`, `X-Frame-Options`/`frame-ancestors`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, or `Permissions-Policy`. The app can be framed by any third-party site (clickjacking), and there is no defense-in-depth against injected script content if an XSS gap is ever introduced elsewhere.
**Fix:**
```ts
// src/hooks.server.ts
import type { Handle } from '@sveltejs/kit'

export const handle: Handle = async ({ event, resolve }) => {
  const response = await resolve(event)
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()')
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; img-src 'self' data: https:; style-src 'self' 'unsafe-inline'; frame-ancestors 'none'; base-uri 'self'",
  )
  return response
}
```
or equivalently in `static/_headers`:
```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Content-Security-Policy: default-src 'self'; img-src 'self' data: https:; frame-ancestors 'none'
```

### 3. Unsalted, unstretched SHA-256 password hash — FAIL
**File:** `src/lib/server/session.ts:3-10`
```ts
export async function sha256Hex(input: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input))
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}
```
Used in `src/routes/api/arson/admin/auth/login/+server.ts:36`: `const inputHash = await sha256Hex(password)`.
**Risk:** SHA-256 is a fast general-purpose hash, not a password hash. If `SCENARIO_ADMIN_PASSWORD_HASH` ever leaks, it is trivially brute-forceable given there's only one admin credential to guess and no salt. This is the account gating recipe approval + GitHub PR creation, so compromise has real supply-chain impact (it can push commits to `main` via the merge flow).
**Fix:** Use PBKDF2 via Web Crypto (available in `crypto.subtle` on Workers) with a per-deployment salt:
```ts
export async function pbkdf2Hex(input: string, saltHex: string, iterations = 210_000): Promise<string> {
  const salt = new Uint8Array(saltHex.match(/.{2}/g)!.map((b) => parseInt(b, 16)))
  const keyMaterial = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(input), 'PBKDF2', false, ['deriveBits'],
  )
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations, hash: 'SHA-256' }, keyMaterial, 256,
  )
  return Array.from(new Uint8Array(bits)).map((b) => b.toString(16).padStart(2, '0')).join('')
}
```
Store `SCENARIO_ADMIN_PASSWORD_SALT` alongside the hash, rotate the admin password, and update `SCENARIO_ADMIN_PASSWORD_HASH` accordingly (new env var — ask before adding to Cloudflare secrets/`.dev.vars` per AGENTS.md).

### 4. Non-constant-time credential comparison on admin login — FAIL
**File:** `src/routes/api/arson/admin/auth/login/+server.ts:36-42`
```ts
const inputHash = await sha256Hex(password)
if (inputUsername !== username || inputHash !== passwordHash) {
  return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
    status: 401,
    headers: { 'Content-Type': 'application/json' },
  })
}
```
**Risk:** `!==` short-circuits on the first differing character, leaking timing information about how many leading hex characters of `inputHash` match. The codebase already fixed this class of bug correctly in `verifyWebhookSignature` (`src/lib/server/github.ts:172-175`) — that pattern just wasn't reused here.
**Fix:**
```ts
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}
// ...
if (!timingSafeEqual(inputUsername, username) || !timingSafeEqual(inputHash, passwordHash)) {
```
(Best placed as a shared helper in `src/lib/server/session.ts` so both this route and `github.ts` can use one implementation.)

### 5. No brute-force protection on admin login — FAIL
**File:** `src/routes/api/arson/admin/auth/login/+server.ts` (whole handler)
**Risk:** No rate limiting, lockout, or CAPTCHA. An attacker can send unlimited password guesses against the single shared admin account. Unlike `recipe-submissions` (20/60min IP rate limit via `getClientAddress()`), this endpoint has none.
**Fix:** Reuse the Turso-backed rate-limit pattern already implemented in `src/routes/api/arson/recipe-submissions/+server.ts:184-207`:
```ts
export const POST: RequestHandler = async ({ request, platform, cookies, getClientAddress }) => {
  const clientIp = getClientAddress()
  const client = createClient({ url: dbUrl, authToken })
  const recent = await client.execute({
    sql: `SELECT COUNT(*) as count FROM admin_login_attempts WHERE ip = ? AND created_at >= datetime('now', '-15 minutes') AND success = 0`,
    args: [clientIp],
  })
  if (Number(recent.rows[0]?.count ?? 0) >= 5) {
    return new Response(JSON.stringify({ error: 'Too many attempts, try again later' }), { status: 429 })
  }
  // ...on failure, INSERT INTO admin_login_attempts (ip, success) VALUES (?, 0)
}
```
At minimum, configure a Cloudflare WAF/Rate Limiting rule on `/api/arson/admin/auth/login` (infra-level, faster to ship than app-level).

### 6. Unbounded pagination on recipe-submissions endpoints — FAIL
**Files:** `src/routes/api/arson/admin/recipe-submissions/+server.ts:19-23` and `src/routes/api/arson/recipe-submissions/+server.ts:272-280` — both `SELECT ... ORDER BY ...` with no `LIMIT`.
**Risk:** As `recipe_submissions` grows unbounded over time, both endpoints return every matching row in a single response — a resource-exhaustion/cost vector against Turso row-read billing and Worker CPU/memory, unauthenticated on the public GET.
**Fix:**
```ts
const limit = Math.min(Number(url.searchParams.get('limit')) || 100, 200)
const offset = Math.max(Number(url.searchParams.get('offset')) || 0, 0)
const rows = await client.execute({
  sql: `
    SELECT id, scenario_name, payout_min, payout_max, submitter_id, submitter_name, recipe, status, pr_number, created_at
    FROM recipe_submissions
    WHERE status IN (${placeholders})
    ORDER BY scenario_name ASC, created_at DESC
    LIMIT ? OFFSET ?
  `,
  args: [...statuses, limit, offset],
})
```

### 7. Raw internal error messages returned to clients — FAIL
**Files (representative, pattern repeats across nearly every `+server.ts`):** `admin/auth/login/+server.ts:57-60`, `admin/recipe-submissions/+server.ts:39-42`, `admin/recipe-submissions/[id]/approve/+server.ts:236-239`, `admin/recipe-submissions/[id]/deny/+server.ts:42-45`, `github-webhook/+server.ts:49-52`, `recipe-submissions/+server.ts:151-156,288-291`, `api/sig/+server.ts:25-28` (includes `err.stack`, not just message).
```ts
} catch (err) {
  const msg = err instanceof Error ? `${err.name}: ${err.message}` : String(err)
  return new Response(msg, { status: 500, headers: { 'Content-Type': 'text/plain' } })
}
```
**Risk:** Uncaught exceptions return `err.message` — and in `api/sig/+server.ts`, `err.stack` — directly to the client, leaking internal implementation details across nearly the entire API surface.
**Fix:**
```ts
} catch (err) {
  console.error('recipe-submissions GET failed', err)
  return new Response(JSON.stringify({ error: 'Internal server error' }), {
    status: 500,
    headers: { 'Content-Type': 'application/json' },
  })
}
```
Apply uniformly to every catch block listed above; drop the `err.stack` leak in `api/sig/+server.ts` entirely.

### 15. `ws` transitive CVE via `@libsql/client` — FAIL
**Path:** `. > @libsql/client > @libsql/hrana-client > @libsql/isomorphic-ws > ws`, confirmed via `pnpm audit --prod`:
```
high | ws: Memory exhaustion DoS from tiny fragments and data chunks
Vulnerable versions: >=8.0.0 <8.21.0
Patched versions: >=8.21.0
```
**Risk:** Memory-exhaustion DoS via crafted WebSocket frames on any path where the libSQL client opens a WebSocket (hrana protocol).
**Fix:**
```json
"pnpm": {
  "overrides": {
    "cookie": ">=0.7.0",
    "ws": ">=8.21.0"
  }
}
```
Then `pnpm install` and re-run `pnpm audit --prod` to confirm it clears. Worth checking whether `@libsql/client/web` (used everywhere in this codebase) actually pulls in `ws` at runtime on Workers, or only in the dependency graph for other environments.

### 22. security.txt not present — FAIL
**Finding:** No `static/.well-known/security.txt` exists.
**Fix:**
```
# static/.well-known/security.txt
Contact: mailto:robert@nhg.design
Expires: 2027-08-15T00:00:00.000Z
Preferred-Languages: en
```

### 23. No automated dependency update policy (Dependabot) — FAIL
**Finding:** `.github/` contains only `workflows/bump-userscript-versions.yml` and `workflows/sync-scenario-hash.yml` — no `dependabot.yml`.
**Risk:** The `ws` CVE above (and future transitive vulnerabilities) will go unnoticed without CI-integrated `pnpm audit` or Dependabot/Renovate raising PRs automatically.
**Fix:**
```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
```

---

### MANUAL-REVIEW items

```text
### Session revocation (24)
**Action:** The admin session (src/lib/server/session.ts) is a stateless signed token
with no server-side store — logout can only delete the client's cookie, and a stolen
token stays valid until its expiry (12h, SESSION_MAX_AGE_SECONDS in login/+server.ts:4).
Decide whether that window is acceptable given the single admin account, or whether a
lightweight server-side revocation table is worth the added DB round-trip per request.
```
```text
### HSTS (25)
**Action:** Verify in the Cloudflare dashboard (SSL/TLS → Edge Certificates) that "Always
Use HTTPS" and HSTS (appropriate max-age, includeSubDomains/preload if desired) are
enabled for balaclava.app — not set anywhere in this repo.
```
```text
### Request smuggling / cache poisoning (26)
**Action:** Several endpoints set Cache-Control: s-maxage=60... (faction/[id]/+server.ts:156,
sig/+server.ts:66). Confirm Cloudflare's edge cache key for these image-signature endpoints
includes every query parameter that affects the response body (user, rounded, align,
factionLogo, daysInFaction, stats) — otherwise a crafted request could poison the shared
edge cache with another user's rendered signature. Requires reviewing Cloudflare Pages cache
configuration outside the repo.
```
```text
### GitHub PAT scope (27)
**Action:** GITHUB_PAT (src/lib/server/github.ts) creates branches, commits files, and
opens/merges PRs against NHG-Design/balaclava. Re-confirm in GitHub → Settings → Developer
settings → Fine-grained tokens that it's scoped to exactly this repo with only Contents:
Read-and-write + Pull requests: Read-and-write — not a classic PAT with broader repo scope.
```
```text
### Audit logging (28)
**Action:** No application-level audit log for admin actions — approve/+server.ts and
deny/+server.ts mutate recipe_submissions.status directly with no separate audit trail.
Decide whether Cloudflare/Turso request logs are sufficient, or whether an explicit
admin_audit_log table (actor, action, target, timestamp) is warranted given this flow can
push commits to main.
```
```text
### Admin credential strength (29)
**Action:** Can't verify from code whether the current SCENARIO_ADMIN_PASSWORD_HASH
corresponds to a genuinely strong password — confirm it's high-entropy and not reused,
independent of the hashing-algorithm fix in finding #3.
```
```text
### Turso backup/recovery (30)
**Action:** Confirm in the Turso dashboard that point-in-time recovery / backups are enabled
for the recipe_submissions database, and that access to trigger a restore is restricted.
```
