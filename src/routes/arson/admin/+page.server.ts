import type { PageServerLoad } from './$types'
import { redirect } from '@sveltejs/kit'
import { isAdminRequest } from '$lib/server/session'
import { SCENARIOS } from '../../../data/scenarios'

export const load: PageServerLoad = async ({ platform, cookies }) => {
  const authed = await isAdminRequest(platform?.env?.SCENARIO_ADMIN_SESSION_SECRET, cookies)
  if (!authed) throw redirect(303, '/arson/admin/login')

  // Current known recipe/payout per scenario, so the client can diff each
  // pending submission against what's actually live today.
  const currentScenarios = Object.fromEntries(
    SCENARIOS.map((s) => [
      s.scenarioName,
      { payoutMin: s.payoutMin, payoutMax: s.payoutMax, actions: s.actions },
    ]),
  )

  return { currentScenarios }
}
