import { PropsWithChildren, createContext, useContext, useState } from "react"

type SelectionContextState = {
  selected: string[]
  select: (item: string) => void
  deselect: (item: string) => void
  clear: () => void
}

const initialState: SelectionContextState = {
  selected: [],
  select: () => null,
  deselect: () => null,
  clear: () => null,
}

export const SelectionContext = createContext(initialState)

export function SelectionProvider({children}: PropsWithChildren) {
  const [selected, setSelected] = useState<string[]>([])

  const value: SelectionContextState = {
    selected,
    select(item) {
      if (selected.includes(item)) return;
      selected.push(item)
      setSelected(selected.slice())
    },
    deselect(item) {
      if (!selected.includes(item)) return;
      setSelected(selected.filter(el => el !== item))
    },
    clear() {
      setSelected([])
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