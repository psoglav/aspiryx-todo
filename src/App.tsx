import {
  RouterProvider,
} from "react-router-dom";

import { router } from '@/router'

import { ThemeProvider } from "@/components/ui/theme-provider"
import Header from '@/components/app-layout/header'

export default function Root() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Header />
      <RouterProvider router={router} />
    </ThemeProvider>
  )
}
