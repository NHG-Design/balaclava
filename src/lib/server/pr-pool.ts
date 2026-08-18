import { patchScenarioSource, type RecipePayload } from './scenarios-patch'
import { bumpPatch } from './version-bump'
import {
  getBranchSha,
  createBranch,
  deleteBranch,
  getFileContent,
  updateFile,
  createPullRequest,
  findOpenPullRequest,
  updatePullRequestBody,
} from './github'

export const SCENARIOS_PATH = 'src/data/scenarios.ts'
export const VERSIONS_PATH = 'versions.json'
export const BASE_BRANCH = 'main'
export const POOL_BRANCH = 'recipe-pool'

export interface PooledSubmission {
  id: number
  scenario_name: string
}

export function buildPrBody(pooled: PooledSubmission[]): string {
  // Link the scenario name to its submission page instead of showing a bare "#N" —
  // GitHub auto-links "#N" text to issues/PRs in this repo, which have nothing to do
  // with these submission ids.
  const list = pooled
    .map((p) => `- [${p.scenario_name}](https://balaclava.app/arson/submissions#submission-${p.id})`)
    .join('\n')
  return (
    `Auto-generated from approved community submission(s) on balaclava.app.\n\n` +
    `Pooled submissions:\n${list}\n\n` +
    `Also bumps the userscript's patch version, since this changes shipped recipe data.\n\n` +
    `Review the diff, then merge to ship this to all userscript users.`
  )
}

/** Pushes a fresh version bump to a branch if it doesn't already match, computed from
 *  `main`'s current version (not incrementally off the branch) — the recipe-pool PR always
 *  stays exactly one patch version ahead of main, however much main has moved since. */
export async function refreshVersionBump(githubToken: string, branch: string): Promise<void> {
  const [mainVersions, branchVersions] = await Promise.all([
    getFileContent(githubToken, VERSIONS_PATH, BASE_BRANCH),
    getFileContent(githubToken, VERSIONS_PATH, branch),
  ])
  const mainParsed = JSON.parse(mainVersions.content) as Record<string, string>
  const targetVersion = bumpPatch(mainParsed['arsonists-ledger'])

  const branchParsed = JSON.parse(branchVersions.content) as Record<string, string>
  if (branchParsed['arsonists-ledger'] === targetVersion) return // already fresh

  branchParsed['arsonists-ledger'] = targetVersion
  const updated = JSON.stringify(branchParsed, null, 2) + '\n'
  await updateFile(
    githubToken,
    VERSIONS_PATH,
    updated,
    `chore(arson): bump arsonists-ledger to ${targetVersion}`,
    branch,
    branchVersions.sha,
  )
}

export interface PoolWriteResult {
  prNumber: number
  prUrl: string
}

/** Applies a scenario patch to the shared recipe-pool branch — layering onto the already-open
 *  pool PR if one exists, otherwise starting a fresh branch/PR — and refreshes the userscript
 *  version bump either way. Cleans up a freshly-created branch if anything after that fails. */
export async function writeToPool(
  githubToken: string,
  scenarioName: string,
  commitMessage: string,
  payoutMin: number,
  payoutMax: number,
  recipe: RecipePayload,
  prTitleIfNew: string,
  bodyPooled: PooledSubmission[],
): Promise<PoolWriteResult> {
  let branchCreated = false
  try {
    const openPool = await findOpenPullRequest(githubToken, POOL_BRANCH)
    if (openPool) {
      const file = await getFileContent(githubToken, SCENARIOS_PATH, POOL_BRANCH)
      const patched = patchScenarioSource(file.content, scenarioName, payoutMin, payoutMax, recipe)
      await updateFile(githubToken, SCENARIOS_PATH, patched, commitMessage, POOL_BRANCH, file.sha)
      await refreshVersionBump(githubToken, POOL_BRANCH)
      return { prNumber: openPool.number, prUrl: openPool.htmlUrl }
    }

    try {
      await deleteBranch(githubToken, POOL_BRANCH)
    } catch {
      /* branch may not exist yet — fine */
    }
    const mainSha = await getBranchSha(githubToken, BASE_BRANCH)
    await createBranch(githubToken, POOL_BRANCH, mainSha)
    branchCreated = true

    const file = await getFileContent(githubToken, SCENARIOS_PATH, POOL_BRANCH)
    const patched = patchScenarioSource(file.content, scenarioName, payoutMin, payoutMax, recipe)
    await updateFile(githubToken, SCENARIOS_PATH, patched, commitMessage, POOL_BRANCH, file.sha)
    await refreshVersionBump(githubToken, POOL_BRANCH)

    const pr = await createPullRequest(githubToken, prTitleIfNew, POOL_BRANCH, BASE_BRANCH, buildPrBody(bodyPooled))
    return { prNumber: pr.number, prUrl: pr.htmlUrl }
  } catch (err) {
    if (branchCreated) {
      try {
        await deleteBranch(githubToken, POOL_BRANCH)
      } catch {
        /* best-effort cleanup */
      }
    }
    throw err
  }
}

/** Best-effort refresh of a pool PR's body with the current full pooled list — never fails
 *  the caller's request, since the underlying write (branch/patch/PR/DB) already succeeded. */
export async function refreshPoolPrBody(
  githubToken: string,
  prNumber: number,
  pooled: PooledSubmission[],
): Promise<void> {
  try {
    await updatePullRequestBody(githubToken, prNumber, buildPrBody(pooled))
  } catch {
    /* non-fatal */
  }
}
