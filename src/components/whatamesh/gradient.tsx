import { useEffect, useRef } from "react";
import { Gradient } from "whatamesh";
import { BgStyles } from "./gradient.constants";
import { useTheme } from '@/components/ui/theme-provider'

export type WhatameshStyle = keyof typeof BgStyles

interface Props {
  style?: WhatameshStyle
}

export function WhatameshGradient({ style = 'blue' }: Props) {
  const ref = useRef<HTMLCanvasElement>(null)
  const { theme } = useTheme()

  useEffect(() => {
    const grad = new Gradient()
    const stylePreset = BgStyles[style]
    const colors = Array.isArray(stylePreset) ? stylePreset : stylePreset[theme]
    
    grad.initGradient('#gradient-canvas')

    if(Array.isArray(colors)) {
      colors.forEach((color, i) => {
        ref.current?.style.setProperty(`--gradient-color-${i + 1}`, color)
      })
    }
  }, [style, theme])

  return (
    <canvas id="gradient-canvas" ref={ref} className="fixed inset-1/2 z-[-1] size-[120%] -translate-x-1/2 -translate-y-1/2 blur-xl" data-transition-in />
  )
}