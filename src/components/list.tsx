import clsx from "clsx";
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, Link } from "react-router-dom";
import { Icon } from "@iconify/react";

import type { KeyboardEvent, ChangeEvent } from 'react'
import type { RootState } from '@/store'

import { createList, } from '@/store/main'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Input } from '@/components/ui/input'
import { Button } from "@/components/ui/button"
import { List } from "@/types";

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

interface ListItemProps {
  value: List
}

export const ListItem = ({ value }: ListItemProps) => {
  const { listId } = useParams()
  const isActive = listId === value.id

  return (
    <Link to={`/list/${value.id}`}>
      <Button 
        variant={isActive ? 'secondary' : 'ghost'} 
        className={clsx('flex w-full justify-start gap-2', { 'text-muted-foreground': !isActive })}
      >
        <Icon icon='fluent:task-list-square-ltr-24-regular' className="text-xl" />
        <span>{ value.name }</span>
      </Button>
    </Link>
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
