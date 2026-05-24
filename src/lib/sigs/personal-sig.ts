import type { PlayerInformation } from '$lib/types'
import type { PersonalSigConfig } from '$lib/players'
import { escape } from '$lib/utils/html'

const W = 600
const H = 100

export async function renderPersonalSig(
  tornId: string,
  config: PersonalSigConfig,
  request: Request,
  apiKey: string,
): Promise<Response> {
  const baseUrl = new URL(request.url).origin

  const [profileRes, fontRes] = await Promise.all([
    fetch(`https://api.torn.com/user/${tornId}?selections=profile&key=${apiKey}`),
    fetch(`${baseUrl}/fonts/Inter-Bold.ttf`),
  ])

  const player = (await profileRes.json()) as PlayerInformation
  const font = await fontRes.arrayBuffer()

  const html = `
    <div style="display:flex;position:relative;width:${W}px;height:${H}px;overflow:hidden;color:${config.textColor};">
      <img src="${baseUrl}/${tornId}.png" width="${W}" height="${H}" style="position:absolute;top:0;left:0;width:${W}px;height:${H}px;object-fit:cover;" />
      <div style="display:flex;flex-direction:column;justify-content:space-between;position:absolute;background:${config.overlayBg};top:8px;left:8px;bottom:8px;border-radius:8px;padding:8px;">
        <div style="display:flex;width:100%;align-items:center;justify-content:space-between;font-size:20px;letter-spacing:-0.025em;">
          <span>${escape(player.name)}</span>
          <span style="padding:0 4px;background:${config.badgeBg};border-radius:6px;margin-left:8px;">${player.level}</span>
        </div>
        <div style="display:flex;width:100%;align-items:center;">
          <span style="font-size:14px;opacity:0.75;">${escape(player.rank)}</span>
        </div>
        <div style="display:flex;width:100%;align-items:center;">
          <span style="font-size:12px;opacity:0.55;">${escape(player.last_action.status)} · ${escape(player.status.state)}</span>
        </div>
      </div>
    </div>
  `

  const { ImageResponse } = await import('workers-og')

  return new ImageResponse(html, {
    width: W,
    height: H,
    fonts: [{ name: 'Inter', data: font, style: 'normal', weight: 700 }],
    headers: { 'Cache-Control': 's-maxage=60, stale-while-revalidate=600' },
  })
}
