import { useState } from 'react'
import { useDispatch } from 'react-redux'

import type { KeyboardEvent, ChangeEvent } from 'react'

import { createList, } from '@/store/main'
import { Icon } from '@iconify/react'

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
    <div className="flex h-10 items-center rounded-lg border border-border transition-colors focus-within:!bg-background hover:bg-secondary/40">
      <div className="flex w-10 justify-center">
        <Icon icon='material-symbols:add' className='text-lg' />
      </div>
      <input 
        className='h-full grow cursor-pointer border-transparent bg-transparent outline-none focus:cursor-text'
        placeholder="New List"
        autoFocus
        value={input}
        onKeyDown={handleInputKeyDown}
        onChange={handleInputChange}  
      />
    </div>
  )
}