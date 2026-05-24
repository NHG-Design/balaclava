export interface PersonalSigConfig {
  overlayBg: string
  badgeBg: string
  textColor: string
}

export const players: Record<string, PersonalSigConfig> = {
  '906148': {
    overlayBg: 'rgba(255,255,255,0.2)',
    badgeBg: 'rgba(255,255,255,0.2)',
    textColor: 'white',
  },
  '2665568': {
    overlayBg: 'rgba(255,100,29,0.1)',
    badgeBg: 'rgba(255,100,29,0.2)',
    textColor: '#ffcfb0',
  },
}
