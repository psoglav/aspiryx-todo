import { PropsWithChildren, createContext, useContext, useEffect, useState } from "react"
import { AnimatePresence, motion  } from "framer-motion"
import { Icon } from "@iconify/react"
import { useDispatch, useSelector } from "react-redux"
import { Button } from "@/components/ui/button"
import { 
  SettingsNavigation, 
  SettingsAccount, 
  SettingsAppearance, 
  SettingsGeneral 
} from "@/components/settings"
import { setSettingsOpen } from "@/store/settings"
import { RootState } from "@/store"
import { ScrollArea } from "@/components/ui/scroll-area"

type SettingsTabProps = {
  id: string | number
  title: string
} & PropsWithChildren

export const SettingsTab = ({ children, ...props }: SettingsTabProps) => {
  const currentTabId = useContext(SettingsTabsContext)

  return currentTabId === props.id && (
    <motion.div
      className="w-full space-y-5 px-10 py-20"
      key={props.id}
      animate={{ opacity: 1, scale: 1 }}
      initial={{ opacity: 0, scale: 0.98 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.25 }}
    >
      <div className="text-3xl font-semibold">{ props.title }</div>
      {children}
    </motion.div>
  )
}

export const SettingsTabsContext = createContext<string | number>(0)

export const Settings = () => {
  const [activeTab, setActiveTab] = useState<string | number>(0)
  const isSettingsOpen = useSelector((state: RootState) => state.settings.open)
  const dispatch = useDispatch()

  function handleClose() {
    dispatch(setSettingsOpen(false))
    setActiveTab(0)
  }

  function handleOpen() {
    dispatch(setSettingsOpen(true))
  }

  useEffect(() => {
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') handleClose()
      if (e.key === ',' && e.ctrlKey) handleOpen()
    })
  }, [])

  return (
    <AnimatePresence>
      {isSettingsOpen && (
        <motion.div 
          className="fixed inset-0 z-10 h-[100dvh] w-[100dvw] bg-background" 
          initial={{ opacity: 0, }}
          animate={{ opacity: 1, }}
          transition={{ duration: 0.15 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="h-full"
            initial={{ scale: 1.05 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.15 }}
            exit={{ scale: 1.05 }}
          >
            <div className="container h-full">
              <div className="grid size-full grid-cols-[max-content_1fr_max-content] items-start">
                <SettingsTabsContext.Provider value={activeTab}>
                  <SettingsNavigation onTabChanged={setActiveTab} />

                  <ScrollArea className="h-[100dvh]">
                    <AnimatePresence mode="wait">
                      <SettingsGeneral key={0}  />
                      <SettingsAccount key={1}  />
                      <SettingsAppearance key={2}  />
                    </AnimatePresence>
                  </ScrollArea>
                </SettingsTabsContext.Provider>

                <div className="px-5 py-20">
                  <Button onClick={handleClose} className="flex h-auto flex-col rounded-xl px-4 text-muted-foreground" variant='ghost'>
                    <Icon icon='material-symbols:cancel-outline-rounded' className="shrink-0 text-3xl" />
                    <div className="text-lg font-semibold">Esc</div>
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>)}
    </AnimatePresence>
  )
}