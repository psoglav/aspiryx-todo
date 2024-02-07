import { updateTask, setActiveTask, deleteManyTasksById, deleteTaskById } from "@/store/main"
import { Task } from "@/types"
import { Icon } from "@iconify/react"
import { ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem, ContextMenuSeparator } from "@/components/ui/context-menu"
import clsx from "clsx"
import useSound from 'use-sound';
import { createRef, useContext, MouseEventHandler, FormEventHandler, ReactNode } from "react"
import { useDispatch } from "react-redux"
import { ContentEditable } from "@/components/content-editable"
import { useSelection } from "@/components/selection-context"
import { SettingsContext } from "@/components/settings"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import completeSfx from '@/assets/audio/complete.wav'
import revertSfx from '@/assets/audio/revert.wav'

type TaskItemProps = {
  value: Task
  tasks?: Task[]
  editable?: boolean
  isDragging?: boolean
}

export function TaskItem({ value, tasks, editable = false, isDragging }: TaskItemProps) {
  const inputRef = createRef<HTMLSpanElement>()
  const dispatch = useDispatch()
  const { enableSoundEffects } = useContext(SettingsContext)
  const [playCompleteSfx] = useSound(completeSfx);
  const [playRevertSfx] = useSound(revertSfx);

  const selection = useSelection()

  const onCheckButtonClick: MouseEventHandler = (e) => {
    e.stopPropagation()

    if (enableSoundEffects) {
      if (!value.completed) playCompleteSfx()
      else playRevertSfx()
    }

    dispatch(updateTask({
      ...value,
      completed: !value.completed
    }))
  }

  const onFavoriteToggled: MouseEventHandler = (e) => {
    e.stopPropagation()
    dispatch(updateTask({
      ...value,
      isImportant: !value.isImportant
    }))
  }

  const focusInput = () => {
    setTimeout(() => {
      inputRef.current?.focus()
    })
  }

  const onSelect: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (e.shiftKey && selection.lastSelected && tasks) {
      const start = tasks.findIndex(item => item.id === selection.lastSelected)
      const end = tasks.findIndex(item => item.id === value.id)
      if (start >= 0) {
        selection.select(tasks.map(({id}) => id).slice(Math.min(start, end), Math.max(start, end) + 1))
      }
      e.preventDefault()
      return
    }

    if(selection.selected.includes(value.id))
      return selection.deselect(value.id)

    selection.select(value.id)
  }

  const onTaskClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (isDragging) return
      
    if (selection.selected.length) {
      onSelect(e)
    } else if (editable) {
      focusInput()
    } else {
      dispatch(setActiveTask(value.id))
    }
  }

  const onChange: FormEventHandler<HTMLSpanElement> = (e) => {
    const target = e.target as HTMLInputElement 
    const text = target?.value

    if (!text) {
      target.innerHTML = value.text
      return e.preventDefault()
    }
    
    // TODO: implement max length validation
    if (text.length > 255) return
  
    dispatch(updateTask({
      ...value,
      text
    }))
  }

  const onDelete = () => {
    if (selection.selected.length) {
      dispatch(deleteManyTasksById(selection.selected))
      selection.clear()
    } else {
      dispatch(deleteTaskById(value.id))
    }
  }


  const ContextMenuWrapper = (trigger: ReactNode): ReactNode => {
    return (
      <ContextMenu>
        <ContextMenuTrigger className='grow'>{trigger}</ContextMenuTrigger>
        <ContextMenuContent>
          {!selection.selected.includes(value.id) ? (
            <ContextMenuItem onClick={() => selection.select(value.id)}>
            Select
            </ContextMenuItem>
          ) : (
            <ContextMenuItem onClick={() => selection.deselect(value.id)}>
            Deselect
            </ContextMenuItem>
          )}
          <ContextMenuSeparator />
          <ContextMenuItem 
            className='!text-red-500 hover:!bg-destructive/20'
            onClick={onDelete}
          >
            Delete
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    )
  }

  return (
    ContextMenuWrapper(
      <Card 
        className={clsx('flex cursor-pointer items-start bg-card/50 p-1 text-left backdrop-blur-lg transition-all hover:bg-zinc-100/50 dark:hover:bg-zinc-900/50 md:p-2', {
          'focus-within:cursor-text focus-within:border-muted-foreground/50 focus-within:!bg-card': editable,
          '!bg-zinc-300/50 dark:!bg-zinc-700/50 border-zinc-500/50': selection.selected.includes(value.id)
        })}
        onClick={onTaskClick}
      >
        <div
          className='group h-10 cursor-pointer p-3'
          onClick={onCheckButtonClick}
        >
          <div 
            className={clsx(
              'grid size-4 place-content-center rounded-full ring-1 ring-foreground/50 transition-all group-hover:ring-foreground group-active:ring-2', 
              {
                '!ring-foreground': value.completed
              }
            )}
          >
            <div 
              className={clsx('size-[10px] rounded-full transition-all group-hover:bg-foreground/30', {
                '!bg-foreground': value.completed
              })}></div>
          </div>
        </div>

        <div 
          className="flex min-h-10 w-0 grow px-2"
        >
          <ContentEditable 
            className={clsx('self-center font-semibold outline-0 focus:text-foreground focus:no-underline', {
              'line-through text-muted-foreground': value.completed,
            })}
            disabled={!editable}
            value={value.text}
            onChange={onChange}
            ref={inputRef}
            placeholder='Do something...'
            changeOnBlur
          />
        </div>

        {!editable && (
          <Button 
            className='size-10' 
            variant='ghost' 
            size='icon' 
            onClick={onFavoriteToggled}
          >
            <Icon 
              icon={ value.isImportant ? 'ic:round-star' : 'ic:round-star-border' } 
              className={clsx('text-xl text-muted-foreground', { 
                'text-yellow-400': value.isImportant 
              })} 
            />
          </Button>
        )}
      </Card>
    )
  )
}