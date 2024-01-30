import { loadItem, saveItem } from "@/helpers/localStorage";
import { PropsWithChildren, createContext, useState } from "react";

type SettingsContextState = {
  open: boolean,
  setOpen: (value: boolean) => void
  activeTab: string | number
  setActiveTab: (value: string | number) => void
  enableSoundEffects: boolean
  setEnableSoundEffects: (value: boolean) => void
}

const initialState: SettingsContextState = {
  open: false,
  setOpen: () => null,
  activeTab: 0,
  setActiveTab: () => null,
  enableSoundEffects: false,
  setEnableSoundEffects: () => null,
}

export const SettingsContext = createContext(initialState)

export function SettingsProvider({children}: PropsWithChildren) {
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<string | number>(0)
  const [enableSoundEffects, setEnableSoundEffects] = useState(loadItem('app:sfx') || false)

  const value = {
    open,
    setOpen,
    activeTab,
    setActiveTab,
    enableSoundEffects,
    setEnableSoundEffects: (val: boolean) => {
      saveItem('app:sfx', val.toString())
      setEnableSoundEffects(val)
    },
  }

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  )
}