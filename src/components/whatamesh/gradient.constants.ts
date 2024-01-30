import type { Theme } from "@/components/ui/theme-provider"
import { ListStyle } from "@/types"

export const BgStyles: Record<ListStyle, string[] | Partial<Record<Theme, string[]>>> = {
  aura: {
    dark: ['#000000', '#111111', '#4800ff', '#000000'],
    light: ['#ffffff', '#eeeeee', '#4800ff', '#ffffff'],
  },
  pearl: {
    dark: [
      '#000000',
      '#111111',
      '#4800ff',
      '#47F2E9'
    ],
    light: [
      '#c3e4ff',
      '#6ec3f4',
      '#eae2ff',
      '#b9beff',
    ],
  },
  swamp: {
    dark: [
      '#53DF83',
      '#47D2E9',
      '#3F3F3F',
      '#111111',
    ],
    light: [
      '#53DF83',
      '#47D2E9',
      '#3F3F3F',
      '#EEEEEE',
    ],
  },
}