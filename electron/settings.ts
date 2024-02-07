import type { Rectangle } from 'electron'
import settings from 'electron-settings'

export const saveBounds = (value?: Rectangle) => {
  if (!value) return
  settings.setSync('win-bounds', [value.x, value.y, value.width, value.height])
}

export const getBounds = () => {
  return settings.getSync('win-bounds') as number[]
}