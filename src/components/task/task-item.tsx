import { ReactNode, type MouseEventHandler } from 'react'
import clsx from 'clsx'
import { Icon } from '@iconify/react'
import { useDispatch } from 'react-redux'

import type { Task } from '@/types'

import { updateTask, deleteTaskById, setEditedTaskId } from '@/store/main'
import { Draggable } from '@/components/dnd'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"

type Props = {
  value: Task
}

function TaskItem({ value }: Props) {
  const dispatch = useDispatch()

  const onCheckButtonClick: MouseEventHandler = (e) => {
    e.stopPropagation()
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

  const CheckButton = () => {
    return (
      <div className="group p-3" onClick={onCheckButtonClick}>
        <div 
          className={clsx(
            'grid size-4 place-content-center rounded-full ring-1 ring-white/50 transition-all group-hover:bg-white/30 group-hover:ring-white group-active:ring-2', 
            {
              '!ring-white': value.completed
            }
          )}
        >
          <div 
            className={clsx('size-3 rounded-full transition-all', {
              'bg-white': value.completed
            })}></div>
        </div>
      </div>
    )
  }

  const ContextMenuWrapper = (trigger: ReactNode): ReactNode => {
    return (
      <ContextMenu>
        <ContextMenuTrigger>{trigger}</ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>
            Select
          </ContextMenuItem>
          <ContextMenuItem 
            className='cursor-pointer !text-red-500 hover:!bg-destructive/20'
            onClick={() => dispatch(deleteTaskById(value.id))}
          >
            Delete
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    )
  }

  return (
    <Draggable id={value.id}>{
      ContextMenuWrapper(
        <Card 
          className='flex cursor-pointer items-center p-2 text-left backdrop-blur-sm transition-colors hover:bg-muted/50' 
          onClick={() => dispatch(setEditedTaskId(value.id))}
        >
          <CheckButton  /> 
          <div className={clsx('w-0 grow truncate', {
            'line-through text-muted-foreground': value.completed
          })}>
            {value.text}
          </div>
          <Button 
            className='size-8' 
            variant='ghost' 
            size='icon' 
            onClick={onFavoriteToggled}
          >
            <Icon 
              icon={ value.isImportant ? 'ic:round-star' : 'ic:round-star-border' } 
              className={clsx('text-lg', { 
                'text-yellow-400': value.isImportant 
              })} 
            />
          </Button>
        </Card>
      )
    }</Draggable>
  )
}

export default TaskItem