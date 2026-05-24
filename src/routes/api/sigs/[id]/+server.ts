import type { RequestHandler } from './$types'
import { players } from '$lib/players'
import { renderPersonalSig } from '$lib/sigs/personal-sig'

export const GET: RequestHandler = async ({ params, request, platform }) => {
  const apiKey = platform?.env?.TORN_PUBLIC_API_KEY
  if (!apiKey) return new Response('TORN_PUBLIC_API_KEY not configured', { status: 500 })

  const config = players[params.id]
  if (!config) return new Response(`Player '${params.id}' is not a whitelisted personal signature.`, { status: 404 })

  return renderPersonalSig(params.id, config, request, apiKey)
}
