import { PropsWithChildren, createContext, useContext, useState } from "react"

type SelectionContextState = {
  selected: string[]
  select: (item: string | string[]) => void
  deselect: (item: string | string[]) => void
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
    select(value) {
      if (!Array.isArray(value)) value = [value]

      for (const item of value) {
        if (selected.includes(item)) continue;
        selected.push(item)
      }

      setSelected(selected.slice())
    },
    deselect(value) {
      setSelected(selected.filter(el => {
        return Array.isArray(value) ? !value.includes(el) : el !== value
      }))
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