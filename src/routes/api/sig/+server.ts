import type { RequestHandler } from './$types'

const W = 600
const H = 100

interface TornProfile {
  name: string
  level: number
  rank: string
  last_action: { status: string; relative: string }
  status: { state: string }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export const GET: RequestHandler = async ({ request, platform }) => {
  try {
    return await handler(request, platform)
  } catch (err) {
    const msg = err instanceof Error ? `${err.name}: ${err.message}\n${err.stack}` : String(err)
    return new Response(msg, { status: 500, headers: { 'Content-Type': 'text/plain' } })
  }
}

async function handler(request: Request, platform: App.Platform | undefined) {
  const apiKey = platform?.env?.TORN_PUBLIC_API_KEY
  if (!apiKey) {
    return new Response('TORN_API_KEY not configured', { status: 500 })
  }

  const [profileRes, fontRes] = await Promise.all([
    fetch(`https://api.torn.com/user/?selections=profile&key=${apiKey}`),
    fetch(new URL('/fonts/Inter-Bold.ttf', request.url).href),
  ])

  const player = (await profileRes.json()) as TornProfile
  const font = await fontRes.arrayBuffer()

  const name = escapeHtml(player.name)
  const sub1 = escapeHtml(`Lv ${player.level} · ${player.rank}`)
  const sub2 = escapeHtml(`${player.last_action.status} · ${player.status.state}`)

  const html = `
    <div style="display:flex;width:${W}px;height:${H}px;background:linear-gradient(135deg,#0f0c29 0%,#302b63 50%,#24243e 100%);color:white;align-items:center;padding:0 24px;gap:16px;font-family:Inter;">
      <div style="display:flex;flex-direction:column;gap:4px;">
        <span style="font-size:28px;font-weight:700;">${name}</span>
        <span style="font-size:12px;opacity:0.7;">${sub1}</span>
        <span style="font-size:11px;opacity:0.55;">${sub2}</span>
      </div>
    </div>
  `

  const { ImageResponse } = await import('workers-og')

  return new ImageResponse(html, {
    width: W,
    height: H,
    fonts: [{ name: 'Inter', data: font, style: 'normal', weight: 700 }],
    headers: {
      'Cache-Control': 's-maxage=60, stale-while-revalidate=600',
    },
  })
}
