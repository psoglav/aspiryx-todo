import { useEffect, useRef } from "react";
import { Gradient } from "whatamesh";
import { BgStyles } from "./gradient.constants";

export type WhatameshStyle = keyof typeof BgStyles

interface Props {
  style?: WhatameshStyle
}

export function WhatameshGradient({ style = 'blue' }: Props) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const grad = new Gradient()
    
    grad.initGradient('#gradient-canvas')

    BgStyles[style].forEach((color, i) => {
      ref.current?.style.setProperty(`--gradient-color-${i + 1}`, color)
    })
  }, [style])

  return (
    <canvas id="gradient-canvas" ref={ref} className="absolute inset-0 z-[-1] size-full blur-xl" data-transition-in />
  )
}