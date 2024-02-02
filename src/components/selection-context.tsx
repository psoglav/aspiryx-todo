import { PropsWithChildren, createContext, useContext, useState } from "react"

type SelectionContextState = {
  selected: string[]
  lastSelected: string | null
  setLastSelected: (item: string | null) => void
  select: (item: string | string[]) => void
  deselect: (item: string | string[]) => void
  clear: () => void
}

const initialState: SelectionContextState = {
  selected: [],
  lastSelected: null,
  setLastSelected: () => null,
  select: () => null,
  deselect: () => null,
  clear: () => null,
}

export const SelectionContext = createContext(initialState)

export function SelectionProvider({children}: PropsWithChildren) {
  const [selected, setSelected] = useState<string[]>([])
  const [lastSelected, setLastSelected] = useState<string | null>(null)

  const value: SelectionContextState = {
    lastSelected,
    setLastSelected,
    selected,
    select(value) {
      if (!Array.isArray(value)) value = [value]

      for (const item of value) {
        if (selected.includes(item)) continue;
        selected.push(item)
        setLastSelected(item)
      }

      setSelected(selected.slice())
    },
    deselect(value) {
      setSelected(selected.filter(el => {
        return Array.isArray(value) ? !value.includes(el) : el !== value
      }))
      setLastSelected(null)
    },
    clear() {
      setSelected([])
      setLastSelected(null)
    },
  }

  return (
    <SelectionContext.Provider value={value}>
      {children}
    </SelectionContext.Provider>
  )
}

export const useSelection = () => {
  const context = useContext(SelectionContext)

  if (context === undefined)
    throw new Error("useSelection must be used within a SelectionProvider")

  return context
}