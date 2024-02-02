import clsx from 'clsx';
import React, { createRef, useContext, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from "react-router-dom";
import { Icon } from '@iconify/react'
import useSound from 'use-sound';

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

import type { KeyboardEvent, ChangeEvent, ReactNode, MouseEventHandler, FormEventHandler } from 'react'
import type { RootState } from "@/store"
import type { Task } from '@/types';

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { Sortable } from '@/components/dnd';
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

import { 
  updateTask, 
  deleteTaskById, 
  setActiveTask, 
  createTask, 
  setTasks, 
  deleteManyTasksById
} from '@/store/main'
import { restrictToParentElement } from '@dnd-kit/modifiers';
import { ContentEditable } from './content-editable';

import completeSfx from '@/assets/audio/complete.wav'
import revertSfx from '@/assets/audio/revert.wav'
import { SettingsContext } from './settings';
import { SelectionProvider, useSelection } from '@/components/selection-context';
import { AnimatePresence, motion } from 'framer-motion';

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

  function handleInputKeyDown(e: KeyboardEvent<HTMLInputElement>) {
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

type TaskItemProps = {
  value: Task
  tasks?: Task[]
  editable?: boolean
}

export function TaskItem({ value, tasks, editable = false }: TaskItemProps) {
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
    <motion.div 
      layout 
      exit={{ opacity: 0 }} 
      whileTap={{scale: !selection.selected.length ? 1 : 0.98}} 
      transition={{ scale: { type: 'spring', duration: 0.15 } }}
    >
      {ContextMenuWrapper(
        <Card 
          className={clsx('flex cursor-pointer items-start bg-card/50 p-2 text-left backdrop-blur-lg transition-all hover:bg-zinc-100/50 dark:hover:bg-zinc-900/50', {
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
      )}
    </motion.div>
  )
}

interface TaskGroupProps {
  title?: string
  items: Task[]
  defaultCollapsed?: boolean
}

export function TaskGroup({ title, items, defaultCollapsed = false }: TaskGroupProps) {
  const [collapsed, setCollapsed] = useState(items.length ? defaultCollapsed : true)

  if (items.length === 0) return null

  return (
    <>
      <div className="space-y-2">
        {
          title ? (
            <Button 
              variant={collapsed ? 'ghost' : 'ghost-active'} 
              onClick={() => setCollapsed(!collapsed)}
            >
              <Icon
                icon='material-symbols:keyboard-arrow-down-rounded' 
                className={clsx('mr-1 rotate-0 text-lg transition-transform', {
                  '!-rotate-90': collapsed,
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
                  <TaskItem value={item} tasks={items} />
                </Sortable>
              ))
          }
        </SortableContext>
      </div>
    </>
  )
}

interface TaskGroupListProps {
  tasks: Task[]
}

export function TaskGroupList({ tasks }: TaskGroupListProps) {
  const [draggedItem, setDraggedItem] = useState<Task | null>(null)
  const dispatch = useDispatch()

  const allTasks = useSelector((state: RootState) => state.main.tasks)

  const completedTasks = tasks.filter(item => item.completed)
  const uncompletedTasks = tasks.filter(item => !item.completed)

  const modifiers = [restrictToParentElement]
  const sensors = [
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 1,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor)
  ]

  function onDragStart(event: DragStartEvent) {
    console.log(event)
    const task = tasks.find(item => item.id === event.active?.id)
    if (task) setDraggedItem(task)
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
        <SelectionProvider>
          <TaskGroup items={uncompletedTasks} />
          <TaskGroup 
            items={completedTasks} 
            title='Completed' 
            defaultCollapsed={Boolean(uncompletedTasks.length)}
          />
        </SelectionProvider>
      </div>
      <DragOverlay dropAnimation={{
        duration: 600,
        easing: 'ease',
      }}>
        {draggedItem && <TaskItem value={draggedItem} key={draggedItem.id} />}
      </DragOverlay>
    </DndContext>
  )
}
