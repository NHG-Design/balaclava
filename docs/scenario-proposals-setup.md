# Scenario Proposal Inbox Setup

This document boots issue `#13`: a D1-backed `Scenario Proposal Inbox`, the submitter-facing `Scenario Proposal Form`, and the protected `Scenario Admin` inbox.

## 1. Create the D1 database

Run this once in Cloudflare:

```powershell
pnpm exec wrangler d1 create balaclava-scenario-proposals
```

Wrangler will print a `database_id`. Add this block to [wrangler.toml](/X:/Dev/balaclava/wrangler.toml):

```toml
[[d1_databases]]
binding = "SCENARIO_PROPOSALS_DB"
database_name = "balaclava-scenario-proposals"
database_id = "<paste database_id>"
migrations_dir = "migrations"
```

## 2. Apply the schema

Apply the migration locally first:

```powershell
pnpm exec wrangler d1 migrations apply SCENARIO_PROPOSALS_DB --local
```

Then apply it to the remote database:

```powershell
pnpm exec wrangler d1 migrations apply SCENARIO_PROPOSALS_DB --remote
```

The initial schema lives in [migrations/0001_scenario_proposals.sql](/X:/Dev/balaclava/migrations/0001_scenario_proposals.sql) and already includes the ADR 0004 workflow tables:

- `scenario_submitters`
- `scenario_submit_tokens`
- `scenario_proposals`
- `scenario_supporting_runs`
- `scenario_triage_records`
- `scenario_triage_record_members`
- `scenario_pr_events`

## 3. Configure secrets

Set the three server-only secrets in Cloudflare:

```powershell
pnpm exec wrangler secret put SCENARIO_ADMIN_USERNAME
pnpm exec wrangler secret put SCENARIO_ADMIN_PASSWORD_HASH
pnpm exec wrangler secret put SCENARIO_ADMIN_SESSION_SECRET
```

For local development, add the same names to `.dev.vars`:

```dotenv
SCENARIO_ADMIN_USERNAME=replace-me
SCENARIO_ADMIN_PASSWORD_HASH=replace-me
SCENARIO_ADMIN_SESSION_SECRET=replace-me
```

### Generate the password hash

The app verifies the admin password with SHA-256 and stores only the hash:

```powershell
$value = 'replace-with-admin-password'
[Convert]::ToHexString([System.Security.Cryptography.SHA256]::HashData([Text.Encoding]::UTF8.GetBytes($value))).ToLowerInvariant()
```

Paste the resulting lowercase hex string into `SCENARIO_ADMIN_PASSWORD_HASH`.

### Generate the session secret

Use a random 32-byte secret for signing the `httpOnly` admin session cookie:

```powershell
[Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
```

## 4. Seed a submitter and hashed submit token

The issue-13 slice intentionally keeps submitter/token management out of the UI. Seed them directly in D1.

Pick a plaintext token, hash it locally, and only store the hash:

```powershell
$token = 'replace-with-submit-token'
[Convert]::ToHexString([System.Security.Cryptography.SHA256]::HashData([Text.Encoding]::UTF8.GetBytes($token))).ToLowerInvariant()
```

Use the hash in a D1 SQL session:

```sql
INSERT INTO scenario_submitters (
    player_id,
    player_name,
    notes,
    is_active,
    created_at_utc,
    updated_at_utc
) VALUES (
    123456,
    'Example Submitter',
    'Initial allowlisted submitter',
    1,
    '2026-06-06T00:00:00.000Z',
    '2026-06-06T00:00:00.000Z'
);

INSERT INTO scenario_submit_tokens (
    id,
    submitter_id,
    token_hash,
    label,
    created_at_utc
) VALUES (
    'replace-with-uuid',
    (SELECT id FROM scenario_submitters WHERE player_id = 123456),
    'replace-with-token-hash',
    'initial token',
    '2026-06-06T00:00:00.000Z'
);
```

You can run those statements with:

```powershell
pnpm exec wrangler d1 execute SCENARIO_PROPOSALS_DB --remote --file .\seed-scenario-submitter.sql
```

## 5. Use the feature

- Submitter form: `/scenario-proposals`
- Admin login: `/scenario-proposals/admin/login`
- Admin inbox: `/scenario-proposals/admin`

The form only accepts existing canonical `Scenario`s from `src/data/scenarios.ts`. Successful submissions write raw proposals plus structured supporting runs into D1. The admin inbox reads those stored proposals directly; grouping, acceptance previews, repo commits, and PR creation are later issues in the chain.
