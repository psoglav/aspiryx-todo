import { useEffect, useRef } from "react";
import { Gradient } from "whatamesh";
import { BgStyles } from "./gradient.constants";
import { useTheme } from '@/components/ui/theme-provider'
import { ListStyle } from "@/types";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";

interface Props {
  style?: string
}

export function WhatameshGradient({ style }: Props) {
  const ref = useRef<HTMLCanvasElement>(null)
  const { theme } = useTheme()
  const location = useLocation()
  
  useEffect(() => {
    if (!style) return
    
    const grad = new Gradient()
    const stylePreset = BgStyles[style as ListStyle]
    const colors = Array.isArray(stylePreset) ? stylePreset : stylePreset[theme]

    grad.initGradient('#gradient-canvas')
    
    if(Array.isArray(colors)) {
      colors.forEach((color, i) => {
        ref.current?.style.setProperty(`--gradient-color-${i + 1}`, color)
      })
    }

  }, [style, theme])

  return (
    <motion.canvas 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }} 
      transition={{ duration: 0.5 }}
      key={location.pathname} 
      id="gradient-canvas" 
      ref={ref} 
      className="absolute inset-1/2 z-[-1] size-[120%] -translate-x-1/2 -translate-y-1/2 blur-xl" 
      data-transition-in 
    />
  )
}