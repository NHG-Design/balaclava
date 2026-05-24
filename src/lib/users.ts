import type { PersonalStatsRaw } from '$lib/types'

export async function getUserPersonalStats(id: string, apiKey: string): Promise<PersonalStatsRaw> {
  const fetchUrl = new URL(`https://api.torn.com/user/${id}`)
  fetchUrl.searchParams.append('selections', 'personalstats')
  fetchUrl.searchParams.append('comment', 'getStats')
  fetchUrl.searchParams.append('key', apiKey)

  try {
    const res = await fetch(fetchUrl)
    const { personalstats } = await res.json()
    return personalstats
  } catch (e) {
    console.error(`Error fetching user personal stats for ${id}: ${e}`)
    return {}
  }
}
