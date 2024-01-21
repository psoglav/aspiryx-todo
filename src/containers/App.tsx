import { ThemeProvider } from "@/components/theme-provider"
import Header from '@/components/header'
import Home from './Home'

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"

function App() {
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
          <Home />
        </ResizablePanel>
      </ResizablePanelGroup>
    </ThemeProvider>
  )
}

export default App
