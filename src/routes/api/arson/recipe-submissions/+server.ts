import type { RequestHandler } from './$types'
import { createClient } from '@libsql/client/web'
import { SCENARIOS } from '../../../../data/scenarios'
import { CATALOG, type ResourceId } from '../../../../data/catalog'

const RATE_LIMIT_MAX = 5
const RATE_LIMIT_WINDOW_MINUTES = 60

interface ActionItemPayload {
  resourceId: string
  qty: number
}

interface SubmissionPayload {
  scenarioName: string
  payoutMin: number
  payoutMax: number
  submitterId?: string | null
  recipe: {
    place: ActionItemPayload[]
    ignite: ActionItemPayload[]
    stoke?: ActionItemPayload[]
    stokeTime?: string
    dampen?: ActionItemPayload[]
    dampenTime?: string
  }
}

const scenarioNames = new Set(SCENARIOS.map((s) => s.scenarioName))
const resourceIds = new Set(Object.keys(CATALOG) as ResourceId[])
const igniterIds = new Set(
  (Object.keys(CATALOG) as ResourceId[]).filter((id) => CATALOG[id].category === 'igniter'),
)

function isValidIgniteItems(items: unknown): items is ActionItemPayload[] {
  return (
    isValidActionItems(items) &&
    (items as ActionItemPayload[]).every((item) => igniterIds.has(item.resourceId as ResourceId))
  )
}

function isValidActionItems(items: unknown): items is ActionItemPayload[] {
  return (
    Array.isArray(items) &&
    items.length > 0 &&
    items.every(
      (item) =>
        typeof item === 'object' &&
        item !== null &&
        typeof (item as ActionItemPayload).resourceId === 'string' &&
        resourceIds.has((item as ActionItemPayload).resourceId as ResourceId) &&
        Number.isFinite((item as ActionItemPayload).qty) &&
        (item as ActionItemPayload).qty > 0,
    )
  )
}

function validate(body: unknown): { ok: true; payload: SubmissionPayload } | { ok: false; error: string } {
  if (typeof body !== 'object' || body === null) {
    return { ok: false, error: 'Invalid request body' }
  }
  const b = body as Record<string, unknown>

  if (typeof b.scenarioName !== 'string' || !scenarioNames.has(b.scenarioName)) {
    return { ok: false, error: 'Unknown scenario' }
  }
  if (!Number.isFinite(b.payoutMin) || !Number.isFinite(b.payoutMax)) {
    return { ok: false, error: 'Payout min/max must be numbers' }
  }
  const payoutMin = b.payoutMin as number
  const payoutMax = b.payoutMax as number
  if (payoutMin < 0 || payoutMax < 0) {
    return { ok: false, error: 'Payout must be non-negative' }
  }
  if (payoutMax < payoutMin) {
    return { ok: false, error: 'Payout max must be >= min' }
  }

  const recipe = b.recipe as SubmissionPayload['recipe'] | undefined
  if (typeof recipe !== 'object' || recipe === null) {
    return { ok: false, error: 'Missing recipe' }
  }
  if (!isValidActionItems(recipe.place)) {
    return { ok: false, error: 'Invalid place materials' }
  }
  if (!isValidIgniteItems(recipe.ignite)) {
    return { ok: false, error: 'Invalid igniter' }
  }
  if (recipe.stoke !== undefined && !isValidActionItems(recipe.stoke)) {
    return { ok: false, error: 'Invalid stoke materials' }
  }
  if (recipe.dampen !== undefined && !isValidActionItems(recipe.dampen)) {
    return { ok: false, error: 'Invalid dampen materials' }
  }
  if (recipe.stokeTime !== undefined && typeof recipe.stokeTime !== 'string') {
    return { ok: false, error: 'Invalid stokeTime' }
  }
  if (recipe.dampenTime !== undefined && typeof recipe.dampenTime !== 'string') {
    return { ok: false, error: 'Invalid dampenTime' }
  }

  const submitterId =
    typeof b.submitterId === 'string' && b.submitterId.trim() !== '' ? b.submitterId.trim() : null

  return {
    ok: true,
    payload: {
      scenarioName: b.scenarioName,
      payoutMin,
      payoutMax,
      submitterId,
      recipe,
    },
  }
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': 'https://www.torn.com',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export const OPTIONS: RequestHandler = async () => {
  return new Response(null, { status: 204, headers: CORS_HEADERS })
}

export const POST: RequestHandler = async ({ request, platform, getClientAddress }) => {
  try {
    const response = await handler(request, platform, getClientAddress())
    for (const [key, value] of Object.entries(CORS_HEADERS)) {
      response.headers.set(key, value)
    }
    return response
  } catch (err) {
    const msg = err instanceof Error ? `${err.name}: ${err.message}` : String(err)
    return new Response(msg, {
      status: 500,
      headers: { 'Content-Type': 'text/plain', ...CORS_HEADERS },
    })
  }
}

async function handler(request: Request, platform: App.Platform | undefined, clientIp: string) {
  const dbUrl = platform?.env?.TURSO_DATABASE_URL
  const authToken = platform?.env?.TURSO_AUTH_TOKEN
  if (!dbUrl || !authToken) {
    return new Response('Turso not configured', { status: 500 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return new Response('Invalid JSON', { status: 400 })
  }

  const result = validate(body)
  if (!result.ok) {
    return new Response(JSON.stringify({ error: result.error }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const client = createClient({ url: dbUrl, authToken })

  const recent = await client.execute({
    sql: `SELECT COUNT(*) as count FROM recipe_submissions WHERE submitter_ip = ? AND created_at >= datetime('now', ?)`,
    args: [clientIp, `-${RATE_LIMIT_WINDOW_MINUTES} minutes`],
  })
  const recentCount = Number(recent.rows[0]?.count ?? 0)
  if (recentCount >= RATE_LIMIT_MAX) {
    return new Response(JSON.stringify({ error: 'Rate limit exceeded, try again later' }), {
      status: 429,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const { payload } = result
  await client.execute({
    sql: `INSERT INTO recipe_submissions (scenario_name, payout_min, payout_max, submitter_id, submitter_ip, recipe) VALUES (?, ?, ?, ?, ?, ?)`,
    args: [
      payload.scenarioName,
      payload.payoutMin,
      payload.payoutMax,
      payload.submitterId ?? null,
      clientIp,
      JSON.stringify(payload.recipe),
    ],
  })

  return new Response(JSON.stringify({ ok: true }), {
    status: 201,
    headers: { 'Content-Type': 'application/json' },
  })
}

/** Public listing: pending/approved/merged submissions by default. Denied submissions are
 *  only included via ?status=denied. */
export const GET: RequestHandler = async ({ url, platform }) => {
  try {
    const dbUrl = platform?.env?.TURSO_DATABASE_URL
    const authToken = platform?.env?.TURSO_AUTH_TOKEN
    if (!dbUrl || !authToken) {
      return new Response('Turso not configured', { status: 500 })
    }

    const statusFilter = url.searchParams.get('status')
    const statuses =
      statusFilter && ['pending', 'approved', 'merged', 'denied'].includes(statusFilter)
        ? [statusFilter]
        : ['pending', 'approved', 'merged']

    const client = createClient({ url: dbUrl, authToken })
    const placeholders = statuses.map(() => '?').join(', ')
    const rows = await client.execute({
      sql: `
        SELECT id, scenario_name, payout_min, payout_max, submitter_id, recipe, status, pr_number, created_at
        FROM recipe_submissions
        WHERE status IN (${placeholders})
        ORDER BY scenario_name ASC, created_at DESC
      `,
      args: statuses,
    })

    const submissions = rows.rows

    return new Response(JSON.stringify({ submissions }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    const msg = err instanceof Error ? `${err.name}: ${err.message}` : String(err)
    return new Response(msg, { status: 500, headers: { 'Content-Type': 'text/plain' } })
  }
}
