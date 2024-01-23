import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useParams } from "react-router-dom";

import type { KeyboardEvent, ChangeEvent } from 'react'

import { createTask, } from '@/store/main'
import { Icon } from '@iconify/react'

export default function CreateTask() {
  const [input, setInput] = useState('')
  const [focused, setFocused] = useState(false)
  
  const dispatch = useDispatch()

  const { listId } = useParams()

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    setInput(e.target.value)
  }

  function handleInputKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      dispatch(createTask({
        text: input,
        listId
      }))
      setInput('')
    }
  }

  return (
    <div className='h-max w-full border-t border-border p-4 pt-3 md:px-6 lg:px-16'>
      <div className="flex h-14 items-center rounded-lg border border-border bg-secondary transition-colors focus-within:!bg-background hover:bg-secondary/80">
        <div className="flex w-10 justify-center">
          {
            focused
              ? <div 
                className='size-4 rounded-full ring-1 ring-muted-foreground'
              ></div>
              : <Icon icon='material-symbols:add' className='text-lg' />
          }
        </div>
        <input 
          className='h-full grow cursor-pointer border-transparent bg-transparent outline-none focus:cursor-text'
          placeholder="Add a task"
          autoFocus
          value={input}
          onKeyDown={handleInputKeyDown}
          onChange={handleInputChange}  
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      </div>
    </div>
  )
}