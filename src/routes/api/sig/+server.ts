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

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export const GET: RequestHandler = async ({ request, platform }) => {
  const apiKey = platform?.env?.TORN_API_KEY
  if (!apiKey) {
    return new Response('TORN_API_KEY not configured', { status: 500 })
  }

  const [profileRes, fontRes] = await Promise.all([
    fetch(`https://api.torn.com/user/?selections=profile&key=${apiKey}`),
    fetch(new URL('/fonts/Inter-Bold.ttf', request.url).href),
  ])

  const player = (await profileRes.json()) as TornProfile
  const fontBuffer = await fontRes.arrayBuffer()
  const fontBytes = new Uint8Array(fontBuffer)
  let fontBinary = ''
  for (let i = 0; i < fontBytes.length; i += 8192) {
    fontBinary += String.fromCharCode(...fontBytes.subarray(i, i + 8192))
  }
  const fontBase64 = btoa(fontBinary)

  const name = escapeXml(player.name)
  const sub1 = escapeXml(`Lv ${player.level} · ${player.rank}`)
  const sub2 = escapeXml(`${player.last_action.status} · ${player.status.state}`)

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <style>@font-face{font-family:'Inter';src:url('data:font/truetype;base64,${fontBase64}');font-weight:700;}</style>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%"   stop-color="#0f0c29"/>
      <stop offset="50%"  stop-color="#302b63"/>
      <stop offset="100%" stop-color="#24243e"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <text x="24" y="44" font-family="Inter,sans-serif" font-size="28" font-weight="700" fill="white">${name}</text>
  <text x="24" y="62" font-family="Inter,sans-serif" font-size="12" fill="rgba(255,255,255,0.7)">${sub1}</text>
  <text x="24" y="76" font-family="Inter,sans-serif" font-size="11" fill="rgba(255,255,255,0.55)">${sub2}</text>
</svg>`

  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 's-maxage=1, stale-while-revalidate=59',
    },
  })
}
