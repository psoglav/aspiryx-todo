import { useEffect, useState } from "react"
import { AnimatePresence, motion  } from "framer-motion"
import { Icon } from "@iconify/react"
import { useDispatch, useSelector } from "react-redux"
import { Button } from "@/components/ui/button"
import { 
  SettingsNavigation, 
  SettingsNavigationItem, 
  SettingsAccount, 
  SettingsAppearance, 
  SettingsGeneral 
} from "@/components/settings"
import { setSettingsOpen } from "@/store/settings"
import { RootState } from "@/store"
import { ScrollArea } from "@/components/ui/scroll-area"

const navigationItems: SettingsNavigationItem[] = [
  { type: 'group-label', text: 'App Settings' },
  {
    id: 1,
    type: 'tab',
    text: 'General',
    icon: 'material-symbols:settings',
    content: SettingsGeneral
  },
  {
    id: 2,
    type: 'tab',
    text: 'Appearance',
    icon: 'fluent:dark-theme-20-regular',
    content: SettingsAppearance
  },
  null,
  { type: 'group-label', text: 'User Settings' },
  {
    id: 3,
    type: 'tab',
    text: 'Account',
    icon: 'material-symbols:person',
    content: SettingsAccount
  },
]

export const Settings = () => {
  const [activeTabIndex, setActiveTabIndex] = useState(1)
  const activeTab = navigationItems[activeTabIndex]
  const isSettingsOpen = useSelector((state: RootState) => state.settings.open)
  const dispatch = useDispatch()

  function handleClose() {
    dispatch(setSettingsOpen(false))
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
                <SettingsNavigation items={navigationItems} onTabChanged={setActiveTabIndex} />
                <ScrollArea className="h-[100dvh]">
                  <AnimatePresence mode="wait">
                    {
                      activeTab?.type === 'tab' && (
                        <motion.div
                          className="w-full space-y-5 px-10 py-20"
                          key={activeTab.id}
                          animate={{ opacity: 1 }}
                          initial={{ opacity: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.15 }}
                        >
                          <div className="text-3xl font-semibold">{ activeTab.text }</div>
                          { activeTab.content() }
                        </motion.div>
                      )
                    }
                  </AnimatePresence>
                </ScrollArea>
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