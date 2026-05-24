import type { RequestHandler } from './$types'
import React from 'react'
import satori from 'satori'
import { initWasm, Resvg } from '@resvg/resvg-wasm'

// Cached per isolate — Workers re-use isolates across requests
let wasmInit: Promise<void> | null = null

const W = 600
const H = 100

interface TornProfile {
  name: string
  level: number
  rank: string
  last_action: { status: string; relative: string }
  status: { state: string }
}

export const GET: RequestHandler = async ({ request, platform }) => {
  const apiKey = platform?.env?.TORN_API_KEY
  if (!apiKey) {
    return new Response('TORN_API_KEY not configured', { status: 500 })
  }

  // Initialise WASM on first request; fetch from Pages static assets
  if (!wasmInit) {
    const wasmUrl = new URL('/wasm/resvg.wasm', request.url).href
    wasmInit = fetch(wasmUrl).then((r) => initWasm(r))
  }

  const [, profileRes, fontRes] = await Promise.all([
    wasmInit,
    fetch(`https://api.torn.com/user/?selections=profile&key=${apiKey}`),
    fetch(new URL('/fonts/Inter-Bold.ttf', request.url).href),
  ])

  const player = (await profileRes.json()) as TornProfile
  const font = await fontRes.arrayBuffer()

  const svg = await satori(
    React.createElement(
      'div',
      {
        style: {
          display: 'flex',
          width: W,
          height: H,
          background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
          color: 'white',
          alignItems: 'center',
          padding: '0 24px',
          gap: 16,
          fontFamily: 'Inter',
        },
      },
      React.createElement(
        'div',
        { style: { display: 'flex', flexDirection: 'column', gap: 4 } },
        React.createElement(
          'span',
          { style: { fontSize: 28, fontWeight: 700 } },
          player.name,
        ),
        React.createElement(
          'span',
          { style: { fontSize: 12, opacity: 0.7 } },
          `Lv ${player.level} · ${player.rank}`,
        ),
        React.createElement(
          'span',
          { style: { fontSize: 11, opacity: 0.55 } },
          `${player.last_action.status} · ${player.status.state}`,
        ),
      ),
    ),
    {
      width: W,
      height: H,
      fonts: [{ name: 'Inter', data: font, style: 'normal', weight: 700 }],
    },
  )

  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: W } })
  const png = resvg.render().asPng()

  return new Response(png, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 's-maxage=1, stale-while-revalidate=59',
    },
  })
}
