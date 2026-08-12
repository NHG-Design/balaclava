import type { PageServerLoad } from './$types'
import { redirect } from '@sveltejs/kit'
import { isAdminRequest } from '$lib/server/session'

export const load: PageServerLoad = async ({ platform, cookies }) => {
  const authed = await isAdminRequest(platform?.env?.SCENARIO_ADMIN_SESSION_SECRET, cookies)
  if (!authed) throw redirect(303, '/arson/admin/login')
  return {}
}
