import { useState } from 'react'
import { useDispatch } from 'react-redux'

import type { KeyboardEvent, ChangeEvent } from 'react'

import { addTask, } from '../store/main'
import { Icon } from '@iconify/react'

export default function CreateTask() {
  const [input, setInput] = useState('')
  const [focused, setFocused] = useState(false)

  const dispatch = useDispatch()

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    setInput(e.target.value)
  }

  function handleInputKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      dispatch(addTask({
        text: input,
      }))
      setInput('')
    }
  }

  return (
    <div className='h-max w-full border-t border-border px-2 pb-4 pt-3 lg:px-16'>
      <div className="flex h-10 items-center rounded-lg border border-border bg-secondary transition-colors focus-within:!bg-background hover:bg-secondary/80">
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