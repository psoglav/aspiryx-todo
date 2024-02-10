import { useContext } from "react";
import { RouterProvider } from "react-router-dom";
import { motion, AnimatePresence  } from "framer-motion"

import { router } from '@/router'

import { Settings, SettingsContext } from '@/components/settings'
import Titlebar from "@/components/app-layout/titlebar/titlebar";
import { WelcomeView } from '@/views/WelcomeView'
import clsx from "clsx";
import { FancyNoise } from "@/components/fancy-noise";

export default function Root() {
  const settings = useContext(SettingsContext)

  return (
    <>
      <Titlebar />

      <WelcomeView>
        <Settings />
        <AnimatePresence>
          {!settings.open && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.15 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={clsx("h-[100dvh]", { "md:h-[calc(100dvh-2rem)]": window.isElectronApp })}
            >
              <RouterProvider router={router} />
            </motion.div>
          )}
        </AnimatePresence>
      </WelcomeView>

      <FancyNoise />
    </>
  )
}
