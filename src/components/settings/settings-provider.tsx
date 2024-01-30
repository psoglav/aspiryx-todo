import { PropsWithChildren, createContext, useState } from "react";

type SettingsContextState = {
  open: boolean,
  setOpen: (value: boolean) => void
  activeTab: string | number
  setActiveTab: (value: string | number) => void
}

const initialState: SettingsContextState = {
  open: false,
  setOpen: () => null,
  activeTab: 0,
  setActiveTab: () => null,
}

export const SettingsContext = createContext(initialState)

export function SettingsProvider({children}: PropsWithChildren) {
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<string | number>(0)

  const value = {
    open,
    setOpen,
    activeTab,
    setActiveTab,
  }

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  )
}