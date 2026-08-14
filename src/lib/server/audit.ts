import type { Client } from '@libsql/client/web'

/** Records an admin action (approve/deny/login) to admin_audit_log. Best-effort — a logging
 *  failure should never fail the underlying admin action, so callers should not await this
 *  inside a try/catch that would surface the error to the client. */
export async function logAdminAction(
  client: Client,
  action: string,
  targetId: number | null,
  ip: string,
): Promise<void> {
  try {
    await client.execute({
      sql: `INSERT INTO admin_audit_log (action, target_id, ip) VALUES (?, ?, ?)`,
      args: [action, targetId, ip],
    })
  } catch (err) {
    console.error('logAdminAction failed', err)
  }
}
