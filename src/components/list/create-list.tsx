import { useState } from 'react'
import { useDispatch } from 'react-redux'

import type { KeyboardEvent, ChangeEvent } from 'react'

import { createList, } from '@/store/main'
import { Input } from '@/components/ui/input'

export default function CreateList() {
  const [input, setInput] = useState('')

  const dispatch = useDispatch()

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    setInput(e.target.value)
  }

  function handleInputKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      dispatch(createList({
        name: input,
      }))
      setInput('')
    }
  }

  return (
    <Input
      icon='material-symbols:add'
      placeholder="New List"
      autoFocus
      value={input}
      onKeyDown={handleInputKeyDown}
      onChange={handleInputChange}  
    />
  )
}