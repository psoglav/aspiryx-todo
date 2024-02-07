import { createList } from "@/store/main"
import { useState, ChangeEvent } from "react"
import { useDispatch } from "react-redux"
import { Input } from "@/components/ui/input"

export const CreateList = () => {
  const [input, setInput] = useState('')

  const dispatch = useDispatch()

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    setInput(e.target.value)
  }

  function handleInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      dispatch(createList({
        name: input,
      }))
      setInput('')
    }
  }

  return (
    <div className="app-no-drag sticky top-2 z-10">
      <Input
        icon='material-symbols:add'
        placeholder="New List"
        autoFocus
        value={input}
        onKeyDown={handleInputKeyDown}
        onChange={handleInputChange}  
      />
    </div>
  )
}