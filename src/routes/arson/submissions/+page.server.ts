import type { PageServerLoad } from './$types'
import { SCENARIOS } from '../../../data/scenarios'

export const load: PageServerLoad = async () => {
  const currentScenarios = Object.fromEntries(
    SCENARIOS.map((s) => [
      s.scenarioName,
      { payoutMin: s.payoutMin, payoutMax: s.payoutMax, actions: s.actions },
    ]),
  )

  return { currentScenarios }
}
