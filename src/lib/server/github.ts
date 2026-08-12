const OWNER = 'NHG-Design'
const REPO = 'balaclava'
const API_BASE = `https://api.github.com/repos/${OWNER}/${REPO}`

function headers(token: string): Record<string, string> {
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'Content-Type': 'application/json',
  }
}

async function githubFetch(token: string, path: string, init?: RequestInit): Promise<Response> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: { ...headers(token), ...(init?.headers as Record<string, string> | undefined) },
  })
  return res
}

export interface FileContent {
  content: string
  sha: string
}

/** Fetches a file's decoded text content + blob SHA (needed to update it later). */
export async function getFileContent(token: string, path: string, ref: string): Promise<FileContent> {
  const res = await githubFetch(token, `/contents/${path}?ref=${encodeURIComponent(ref)}`)
  if (!res.ok) {
    throw new Error(`GitHub getFileContent failed: HTTP ${res.status} ${await res.text()}`)
  }
  const data = (await res.json()) as { content: string; encoding: string; sha: string }
  if (data.encoding !== 'base64') {
    throw new Error(`Unexpected GitHub content encoding: ${data.encoding}`)
  }
  return { content: atob(data.content.replace(/\n/g, '')), sha: data.sha }
}

/** Returns the current commit SHA that a branch (e.g. "main") points to. */
export async function getBranchSha(token: string, branch: string): Promise<string> {
  const res = await githubFetch(token, `/git/ref/heads/${encodeURIComponent(branch)}`)
  if (!res.ok) {
    throw new Error(`GitHub getBranchSha failed: HTTP ${res.status} ${await res.text()}`)
  }
  const data = (await res.json()) as { object: { sha: string } }
  return data.object.sha
}

/** Creates a new branch pointing at the given commit SHA. */
export async function createBranch(token: string, branchName: string, fromSha: string): Promise<void> {
  const res = await githubFetch(token, '/git/refs', {
    method: 'POST',
    body: JSON.stringify({ ref: `refs/heads/${branchName}`, sha: fromSha }),
  })
  if (!res.ok) {
    throw new Error(`GitHub createBranch failed: HTTP ${res.status} ${await res.text()}`)
  }
}

/** Deletes a branch — used to clean up if a later step in the approve flow fails. */
export async function deleteBranch(token: string, branchName: string): Promise<void> {
  await githubFetch(token, `/git/refs/heads/${encodeURIComponent(branchName)}`, { method: 'DELETE' })
}

/** Updates a file's content on a branch, given its current blob SHA. */
export async function updateFile(
  token: string,
  path: string,
  content: string,
  message: string,
  branch: string,
  sha: string,
): Promise<void> {
  const res = await githubFetch(token, `/contents/${path}`, {
    method: 'PUT',
    body: JSON.stringify({
      message,
      content: btoa(unescape(encodeURIComponent(content))),
      branch,
      sha,
    }),
  })
  if (!res.ok) {
    throw new Error(`GitHub updateFile failed: HTTP ${res.status} ${await res.text()}`)
  }
}

export interface PullRequestResult {
  number: number
  htmlUrl: string
}

/** Opens a PR from `head` into `base`. */
export async function createPullRequest(
  token: string,
  title: string,
  head: string,
  base: string,
  body: string,
): Promise<PullRequestResult> {
  const res = await githubFetch(token, '/pulls', {
    method: 'POST',
    body: JSON.stringify({ title, head, base, body }),
  })
  if (!res.ok) {
    throw new Error(`GitHub createPullRequest failed: HTTP ${res.status} ${await res.text()}`)
  }
  const data = (await res.json()) as { number: number; html_url: string }
  return { number: data.number, htmlUrl: data.html_url }
}

/** Verifies a GitHub webhook payload signature (X-Hub-Signature-256) via HMAC-SHA256. */
export async function verifyWebhookSignature(
  secret: string,
  payload: string,
  signatureHeader: string | null,
): Promise<boolean> {
  if (!signatureHeader?.startsWith('sha256=')) return false
  const expectedHex = signatureHeader.slice('sha256='.length)

  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload))
  const actualHex = Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')

  if (actualHex.length !== expectedHex.length) return false
  let diff = 0
  for (let i = 0; i < actualHex.length; i++) diff |= actualHex.charCodeAt(i) ^ expectedHex.charCodeAt(i)
  return diff === 0
}
