import { motion } from "framer-motion";
import { PropsWithChildren, useEffect, useState } from "react";

export function WelcomeView({ children }: PropsWithChildren) {
  const [showWelcome, setShowWelcome] = useState(window.isElectronApp)

  useEffect(() => {
    if (!showWelcome) return
    setTimeout(() => setShowWelcome(false), 1500)
  }, [])

  if (!showWelcome) return children

  return (
    <div className="grid h-screen place-content-center justify-items-center gap-2 overflow-hidden rounded-full">
      <motion.svg
        width="256"
        height="256"
        viewBox="-100 -100 456 456"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        whileTap={{ scale: 0.9 }}
        drag
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        className='outline-none'
      >
        <motion.path 
          d="M256 128C256 198.692 198.692 256 128 256C57.3075 256 -6.18013e-06 198.692 0 128C6.18013e-06 57.3075 57.3076 -6.18013e-06 128 0C198.692 6.18013e-06 256 57.3076 256 128Z" 
          fill="url(#paint0_radial_228_22)"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.1 }}
        />

        <motion.path 
          d="M256 128C256 198.692 198.692 256 128 256C57.3075 256 -6.18013e-06 198.692 0 128C6.18013e-06 57.3075 57.3076 -6.18013e-06 128 0C198.692 6.18013e-06 256 57.3076 256 128Z" 
          fill="url(#paint0_radial_228_22)"
          style={{ filter: 'blur(20px)' }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', delay: 0.1 }}
        />

        <motion.circle
          cx="128"
          cy="128"
          r="75"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.5 }}
          fill="url(#paint0_linear_233_38)"
        />

        <motion.circle
          cx="128"
          cy="128"
          r="128"
          stroke="url(#paint0_linear_233_38)"
          fill="transparent" 
          initial={{ scale: 0, opacity: 0, strokeWidth: 0 }}
          animate={{ scale: 1, opacity: 1, strokeWidth: 8 }}
          transition={{ 
            type: 'spring', 
            delay: 0.1,
            strokeWidth: {
              delay: 0.5,
            }
          }}
        />

        <defs>
          <linearGradient id="paint0_linear_233_38" x1="67.0003" y1="195" x2="67.0003" y2="-61" gradientUnits="userSpaceOnUse">
            <stop stop-color="#3C3C3C" stop-opacity="0.45"/>
            <stop offset="1" stop-color="white"/>
          </linearGradient>
          <radialGradient id="paint0_radial_228_22" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(149 105.5) rotate(135.353) scale(286.737 286.737)">
            <stop stop-color="#7407FF"/>
            <stop offset="0.342002" stop-color="#170133"/>
            <stop offset="0.70949" stop-color="#00B03C"/>
            <stop offset="1"/>
          </radialGradient>
        </defs>
      </motion.svg>

    </div>
  );
}