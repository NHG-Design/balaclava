import type { FactionInformation } from '$lib/types'
import config from '$lib/config'

export const whitelisted = {
  getAll: ['33007', '2013'],
}

export async function getFactionInfo(
  id: string,
  apiKey: string,
): Promise<FactionInformation | undefined> {
  const fetchUrl = new URL(`https://api.torn.com/faction/${id}`)
  fetchUrl.searchParams.append('selections', 'basic')
  fetchUrl.searchParams.append('comment', 'getFaction')
  fetchUrl.searchParams.append('key', apiKey)

  try {
    const res = await fetch(fetchUrl)
    return await res.json()
  } catch (e) {
    console.error(`Error fetching faction info for ${id}: ${e}`)
  }
}

export function getFactionBanner(id: string): string {
  if (whitelisted.getAll.includes(id)) {
    return `${config.url}/factions/${id}/banner.png`
  }
  return `${config.url}/banners/1.png`
}

export function getFactionLogo(id: string): string {
  if (whitelisted.getAll.includes(id)) {
    return `${config.url}/factions/${id}/logo.svg`
  }
  return `${config.url}/logos/1.png`
}
