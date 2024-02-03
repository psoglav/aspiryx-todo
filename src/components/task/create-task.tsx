import { createTask } from "@/store/main"
import { Icon } from "@iconify/react"
import { AnimatePresence, motion } from "framer-motion"
import { useState, useRef, ChangeEvent } from "react"
import { useDispatch } from "react-redux"
import { useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"

export function CreateTask() {
  const [input, setInput] = useState('')
  const [focused, setFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  
  const dispatch = useDispatch()

  const { listId } = useParams()

  function submit() {
    if (!input || input.length > 255) return;
    dispatch(createTask({
      text: input,
      listId
    }))
    setInput('')
  }

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    setInput(e.target.value)
  }

  function handleInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      submit()
    }
  }

  const onBlur: React.FocusEventHandler<HTMLInputElement> = (event) => {
    const input = event.target as HTMLElement
    const potentialChild = event.relatedTarget as HTMLElement
    if (input.parentNode?.contains(potentialChild) && inputRef.current)
      return inputRef.current.focus()
    setFocused(false)
  }

  return (
    <div className='h-max w-full p-4 pb-6 pt-3 md:px-6 lg:px-16'>
      <div className="relative flex h-14 items-center rounded-lg border border-border bg-background/40 transition-colors focus-within:!bg-background hover:bg-zinc-100 dark:hover:bg-zinc-900">
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
          ref={inputRef}
          value={input}
          key={listId}
          onKeyDown={handleInputKeyDown}
          onChange={handleInputChange}  
          onFocus={() => setFocused(true)}
          onBlur={onBlur}
        />
        <AnimatePresence mode='wait'>
          {focused && (
            <motion.div layout 
              initial={{opacity: 0, scale: 0.9}} 
              animate={{opacity: 1, scale: 1}} 
              exit={{opacity: -0.1, scale: 0.9}} 
              transition={{type: 'spring'}}
              className='flex items-center px-2'
            >
              <Button onClick={submit}>
                Create
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
