import {
  RouterProvider,
} from "react-router-dom";

import {router} from '@/router'

import { ThemeProvider } from "@/components/theme-provider"
import Header from '@/components/header'

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"

export default function Root() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Header />
      <ResizablePanelGroup
        direction="horizontal"
        autoSaveId='ui-layout'
        className="h-screen"
      >
        <ResizablePanel defaultSize={20} maxSize={30} minSize={15}>
          <div className="h-screen">
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={100}>
          <RouterProvider router={router} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </ThemeProvider>
  )
}
