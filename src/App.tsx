import { useContext } from "react";
import { RouterProvider } from "react-router-dom";
import { motion, AnimatePresence  } from "framer-motion"

import { router } from '@/router'

import Header from '@/components/app-layout/header'
import { Settings, SettingsContext } from '@/components/settings'

export default function Root() {
  const settings = useContext(SettingsContext)

  return (
    <>
      <Header />
      <Settings />
      <AnimatePresence>
        {!settings.open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.15 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <RouterProvider router={router} />
          </motion.div>
        )}
      </AnimatePresence>
      {settings.enableFancyNoise && <div id="bg-noise"></div>}
    </>
  )
}
