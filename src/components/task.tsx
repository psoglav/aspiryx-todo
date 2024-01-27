import clsx from 'clsx';
import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from "react-router-dom";
import { Icon } from '@iconify/react'
import { 
  DndContext, 
  DragEndEvent, 
  DragOverlay, 
  DragStartEvent, 
  KeyboardSensor, 
  MouseSensor, 
  TouchSensor, 
  useSensor 
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import type { KeyboardEvent, ChangeEvent, ReactNode, MouseEventHandler } from 'react'
import type { RootState } from "@/store"
import type { Task } from '@/types';

import {
  Sheet,
  SheetTitle,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
} from "@/components/ui/sheet"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { Sortable } from '@/components/dnd';
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

import { 
  updateTask, 
  deleteTaskById, 
  setEditedTaskId, 
  createTask, 
  setTasks 
} from '@/store/main'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';

export function CreateTask() {
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
    <div className='h-max w-full border-t border-border p-4 pb-6 pt-3 md:px-6 lg:px-16'>
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

type TaskItemProps = {
  value: Task
}

export function TaskItem({ value }: TaskItemProps) {
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
      <div className='group p-3' onClick={onCheckButtonClick}>
        <div 
          className={clsx(
            'grid size-4 place-content-center rounded-full ring-1 ring-foreground/50 transition-all group-hover:bg-foreground/30 group-hover:ring-foreground group-active:ring-2', 
            {
              '!ring-foreground': value.completed
            }
          )}
        >
          <div 
            className={clsx('size-[8px] rounded-full transition-all', {
              'bg-foreground': value.completed
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
    <>{
      ContextMenuWrapper(
        <Card 
          className='flex cursor-pointer items-center p-2 text-left backdrop-blur-sm transition-all hover:bg-muted/50'
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
    }</>
  )
}

interface TaskGroupProps {
  title?: string
  items: Task[]
  defaultCollapsed?: boolean
}

export function TaskGroup({ title, items, defaultCollapsed = false }: TaskGroupProps) {
  const [collapsed, setCollapsed] = useState(items.length ? defaultCollapsed : true)

  return (
    <>
      <div className="space-y-2">
        {
          title ? (
            <Button variant={collapsed ? 'ghost' : 'secondary'} onClick={() => setCollapsed(!collapsed)}>
              <Icon
                icon='material-symbols:keyboard-arrow-down-rounded' 
                className={clsx('mr-1 rotate-0 text-lg transition-transform', {
                  '!-rotate-90': collapsed
                })} 
              />
              <span>{ title }</span>
              {items.length ? <span className='px-2 text-muted-foreground'>{items.length}</span> : null}
            </Button>
          ) : null
        }

        <SortableContext 
          items={items}
          strategy={verticalListSortingStrategy}
        >
          {
            (!collapsed || !title) && items
              .map(item => (
                <Sortable key={item.id} id={item.id}>
                  <TaskItem value={item} />
                </Sortable>
              ))
          }
        </SortableContext>
      </div>
    </>
  )
}

interface TaskGroupListProps {
  id?: string
}

export function TaskGroupList({ id }: TaskGroupListProps) {
  const tasks = useSelector((state: RootState) => state.main.tasks.filter(item => item.listId === id))
  const [draggedItem, setDraggedItem] = useState<Task | null>(null)
  const dispatch = useDispatch()

  const allTasks = useSelector((state: RootState) => state.main.tasks)

  const completedTasks = tasks.filter(item => item.completed)
  const uncompletedTasks = tasks.filter(item => !item.completed)

  const modifiers = [restrictToVerticalAxis]
  const sensors = [
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor)
  ]

  function onDragStart(event: DragStartEvent) {
    const task = tasks.find(item => item.id === event.active?.id)
    if (task) setDraggedItem(task)
    console.log(event)
  }

  function onDragCancel() {
    setDraggedItem(null)
  }

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    setDraggedItem(null)

    if (over && active.id !== over.id) {
      const oldIndex = allTasks.findIndex(item => item.id === active.id);
      const newIndex = allTasks.findIndex(item => item.id === over.id);
        
      const arr = arrayMove(allTasks, oldIndex, newIndex);

      dispatch(setTasks(arr))
    }
  }
  
  return (
    <DndContext 
      modifiers={modifiers} 
      sensors={sensors}
      onDragStart={onDragStart}
      onDragCancel={onDragCancel}
      onDragEnd={onDragEnd}
    >
      <div className="flex flex-col gap-4 py-4">
        <TaskGroup items={uncompletedTasks} />
        <TaskGroup 
          items={completedTasks} 
          title='Completed' 
          defaultCollapsed={Boolean(uncompletedTasks.length)}
        />
      </div>
      <DragOverlay dropAnimation={{
        duration: 500,
        easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
      }}>
        {draggedItem && <TaskItem value={draggedItem} key={draggedItem.id} />}
      </DragOverlay>
    </DndContext>
  )
}

export function TaskEdit() {
  const tasks = useSelector((state: RootState) => state.main.tasks)
  const taskId = useSelector((state: RootState) => state.main.editedTaskId)
  const task = tasks.find(item => item.id === taskId)

  return (
    <div className='min-w-60 p-4'>
      {task ? <TaskItem value={task} /> : null}
    </div>
  )
}

export function TaskEditSheet() {
  const dispatch = useDispatch()
  
  const editSheetOpened = useSelector((state: RootState) => state.main.editSheetOpened)

  const onOpenChange = (open: boolean) => {
    if(!open) {
      dispatch(setEditedTaskId(null))
    }
  }

  return (
    <>
      <Sheet open={editSheetOpened} onOpenChange={onOpenChange}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Edit</SheetTitle>
          </SheetHeader>
          <TaskEdit />
          <SheetFooter>
            <SheetClose asChild>
              <Button type="submit">Save changes</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  )
}