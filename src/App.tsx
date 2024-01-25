import { RouterProvider } from "react-router-dom";
import { motion, AnimatePresence  } from "framer-motion"

import { router } from '@/router'

import Header from '@/components/app-layout/header'
import { Settings } from '@/components/settings'
import { useSelector } from "react-redux";
import { RootState } from "./store";

export default function Root() {
  const isSettingsOpen = useSelector((state: RootState) => state.settings.open)


  return (
    <>
      <Header />
      <Settings />
      <AnimatePresence>
        {!isSettingsOpen && (
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
    </>
  )
}
