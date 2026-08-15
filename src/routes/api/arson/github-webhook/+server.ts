import type { RequestHandler } from './$types'
import { createClient } from '@libsql/client/web'
import { verifyWebhookSignature } from '$lib/server/github'

interface PullRequestEventPayload {
  action: string
  number: number
  pull_request: {
    number: number
    merged: boolean
  }
}

export const POST: RequestHandler = async ({ request, platform }) => {
  try {
    const webhookSecret = platform?.env?.GITHUB_WEBHOOK_SECRET
    const dbUrl = platform?.env?.TURSO_DATABASE_URL
    const authToken = platform?.env?.TURSO_AUTH_TOKEN
    if (!webhookSecret || !dbUrl || !authToken) {
      return new Response('Not configured', { status: 500 })
    }

    const rawBody = await request.text()
    const signature = request.headers.get('X-Hub-Signature-256')
    if (!(await verifyWebhookSignature(webhookSecret, rawBody, signature))) {
      return new Response('Invalid signature', { status: 401 })
    }

    const event = request.headers.get('X-GitHub-Event')
    if (event !== 'pull_request') {
      return new Response('ok (ignored event)', { status: 200 })
    }

    const payload = JSON.parse(rawBody) as PullRequestEventPayload
    if (payload.action !== 'closed' || !payload.pull_request.merged) {
      return new Response('ok (not a merge)', { status: 200 })
    }

    const client = createClient({ url: dbUrl, authToken })
    const result = await client.execute({
      sql: `UPDATE recipe_submissions SET status = 'merged' WHERE pr_number = ? AND status IN ('approved', 'partial')`,
      args: [payload.pull_request.number],
    })

    return new Response(
      JSON.stringify({ ok: true, updated: result.rowsAffected }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    )
  } catch (err) {
    console.error('github-webhook POST failed', err)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
