/** Bumps a semver string's patch component by 1 (e.g. "1.2.0" -> "1.2.1"). */
export function bumpPatch(version: string): string {
  const match = /^(\d+)\.(\d+)\.(\d+)$/.exec(version.trim())
  if (!match) {
    throw new Error(`Cannot bump non-semver version string: "${version}"`)
  }
  const [, major, minor, patch] = match
  return `${major}.${minor}.${Number(patch) + 1}`
}
