import { PropsWithChildren, useContext, useEffect } from "react"
import { AnimatePresence, motion  } from "framer-motion"
import { Icon } from "@iconify/react"
import { Button } from "@/components/ui/button"
import { 
  SettingsNavigation, 
  SettingsAccount, 
  SettingsAppearance, 
  SettingsGeneral 
} from "@/components/settings"
import { ScrollArea } from "@/components/ui/scroll-area"
import { SettingsContext } from "./settings-provider"

type SettingsTabProps = {
  id: string | number
  title: string
} & PropsWithChildren

export const SettingsTab = ({ children, ...props }: SettingsTabProps) => {
  const ctx = useContext(SettingsContext)

  return ctx.activeTab === props.id && (
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

export const Settings = () => {
  const { setOpen, setActiveTab, open } = useContext(SettingsContext)

  function handleClose() {
    setOpen(false)
    setActiveTab(0)
  }

  function handleOpen() {
    setOpen(true)
  }

  useEffect(() => {
    window.addEventListener('keydown', (e) => {
      if (e.code === 'Escape') handleClose()
      if (e.code === 'Comma' && e.ctrlKey) handleOpen()
    })
  }, [])

  return (
    <AnimatePresence>
      {open && (
        <motion.div 
          className="fixed inset-0 z-10 size-full bg-background" 
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
            <div className="size-full lg:container">
              <div className="grid size-full grid-cols-[max-content_1fr_max-content] items-start">
                <SettingsNavigation />

                <ScrollArea className="h-[100dvh]">
                  <AnimatePresence mode="wait">
                    <SettingsGeneral key={0}  />
                    <SettingsAccount key={1}  />
                    <SettingsAppearance key={2}  />
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