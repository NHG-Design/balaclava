export function numberShortened(x: number) {
  const trillion = 10e11
  const billion = 10e8
  const million = 10e5
  const thousand = 10e2

  if (x >= trillion) {
    if (x % trillion === 0) return `${x / trillion}T`
    return `${(x / trillion).toFixed(2)}T`
  }
  if (x >= billion) {
    if (x % billion === 0) return `${x / billion}B`
    return `${(x / billion).toFixed(2)}B`
  }
  if (x >= million) {
    if (x % million === 0) return `${x / million}M`
    return `${(x / million).toFixed(2)}M`
  }
  if (x >= thousand) {
    if (x % thousand === 0) return `${x / thousand}K`
    return `${(x / thousand).toFixed(2)}K`
  }
  if (x % 1 === 0) return `${x}`
  return `${x.toFixed(2)}`
}

export function secondsToDays(x: number) {
  const days = Math.floor(x / 86400)
  const hours = Math.floor((x % 86400) / 3600)
  return `${days}d ${hours}h`
}

export function formatNumberByDataType(value: number, datatype: string): string {
  if (value === null || value === undefined || value === 0) return '-'
  if (datatype === 'percentage') {
    const v = typeof value === 'string' ? value : (value * 100).toFixed(2)
    return `${v}%`
  }
  if (datatype === 'money') return `$${numberShortened(value)}`
  if (datatype === 'number') return numberShortened(value)
  if (datatype === 'time') return secondsToDays(value)
  if (datatype === 'liquid') return `${numberShortened(value)} liters`
  return `${value}`
}
