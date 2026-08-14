// One-off CLI to generate a SCENARIO_ADMIN_PASSWORD_HASH value in the PBKDF2 `salt:hash` format
// expected by src/lib/server/session.ts's verifyPassword(). Run locally, never commit the output.
//
// Usage: pnpm tsx scripts/hash-admin-password.ts "your-new-admin-password"

import { hashPassword } from '../src/lib/server/session'

const password = process.argv[2]
if (!password) {
  console.error('Usage: pnpm tsx scripts/hash-admin-password.ts "your-new-admin-password"')
  process.exit(1)
}

const hash = await hashPassword(password)
console.log('\nSCENARIO_ADMIN_PASSWORD_HASH=' + hash + '\n')
console.log('Set this as SCENARIO_ADMIN_PASSWORD_HASH in .dev.vars and as a Cloudflare Pages secret.')
