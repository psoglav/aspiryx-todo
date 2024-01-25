import clsx from "clsx";
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, Link } from "react-router-dom";
import { Icon } from "@iconify/react";

import type { KeyboardEvent, ChangeEvent, PropsWithChildren } from 'react'
import type { RootState } from '@/store'

import { createList, deleteListById, setLists, } from '@/store/main'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  ContextMenu, 
  ContextMenuTrigger, 
  ContextMenuContent, 
  ContextMenuItem, 
} from "@/components/ui/context-menu";
import { Input } from '@/components/ui/input'
import { Button } from "@/components/ui/button"
import { List } from "@/types";
import { Reorder, useDragControls, useMotionValue } from "framer-motion";

export const CreateList = () => {
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

const ListItemContextMenu = ({ children, id }: PropsWithChildren & { id: string }) => {
  const dispatch = useDispatch()

  return (
    <ContextMenu>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem 
          className='cursor-pointer !text-red-500 hover:!bg-destructive/20'
          onClick={() => dispatch(deleteListById(id))}
        >
          Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}

interface ListItemProps {
  value: List
  disabled?: boolean
}

export const ListItem = ({ value, disabled }: ListItemProps) => {
  const { listId } = useParams()
  const isActive = listId === value.id
  const [isDragging, setIsDragging] = useState(false)

  const y = useMotionValue(0);
  const dragControls = useDragControls();

  return (
    <Reorder.Item
      value={value}
      id={value.id}
      style={{ y }}
      dragControls={dragControls}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={() => setIsDragging(false)}
      className="relative"
    >
      <ListItemContextMenu id={value.id}>
        <Link to={`/list/${value.id}`} className={clsx({ 'pointer-events-none': disabled || isDragging })} draggable="false">
          <Button 
            variant={isActive ? 'secondary' : 'ghost'} 
            className={clsx(
              'flex w-full justify-start gap-2 backdrop-blur-sm', 
              { 
                'text-muted-foreground': !isActive, 
                'bg-accent/50': isDragging 
              })}
          >
            <Icon icon='fluent:task-list-square-ltr-24-regular' className="text-xl" />
            <span>{ value.name }</span>
          </Button>
        </Link>
      </ListItemContextMenu>
    </Reorder.Item>
  )
}

interface ListGroupProps {
  items: List[]
}

export const ListGroup = ({ items }: ListGroupProps) => {
  const dispatch = useDispatch()

  return (
    <Reorder.Group 
      className="space-y-2"
      values={items} 
      axis="y" 
      layoutScroll
      onReorder={(items: List[]) => dispatch(setLists(items))} 
    >
      {items.map((item) => (
        <ListItem key={item.id} value={item} />
      ))}
    </Reorder.Group>
  )
}

export const ListTitle = () => {
  const { listId } = useParams()
  const currentList = useSelector((state: RootState) => state.main.lists.find(item => item.id === listId))
  const title = currentList ? currentList.name : 'Tasks'

  return (
    <div className='text-2xl font-semibold'>
      { title }
    </div>
  )
}

export const ListDropdownMenu = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size='icon' variant='ghost'>
          <Icon icon='radix-icons:dots-horizontal' className="text-xl" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>Import</DropdownMenuItem>
        <DropdownMenuItem>Export</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className='cursor-pointer !text-red-500 hover:!bg-destructive/20'>
           Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
