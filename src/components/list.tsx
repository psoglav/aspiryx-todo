import clsx from "clsx";
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, Link } from "react-router-dom";
import { Icon } from "@iconify/react";

import type { KeyboardEvent, ChangeEvent, PropsWithChildren } from 'react'
import type { RootState } from '@/store'

import { createList, deleteListById, setLists, updateList, } from '@/store/main'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuGroup, 
  DropdownMenuItem, 
  DropdownMenuPortal, 
  DropdownMenuRadioGroup, 
  DropdownMenuRadioItem, 
  DropdownMenuSeparator, 
  DropdownMenuSub, 
  DropdownMenuSubContent, 
  DropdownMenuSubTrigger, 
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
import { ContentEditable } from "./content-editable";

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
    <div className="sticky top-2 z-10">
      <Input
        icon='material-symbols:add'
        placeholder="New List"
        autoFocus
        value={input}
        onKeyDown={handleInputKeyDown}
        onChange={handleInputChange}  
      />
    </div>
  )
}

interface ListItemProps {
  value: List
  disabled?: boolean
  onDragEnd: () => void
}

export const ListItem = ({ value, disabled, onDragEnd }: ListItemProps) => {
  const { listId } = useParams()
  const isActive = listId === value.id
  const [isDragging, setIsDragging] = useState(false)

  const y = useMotionValue(0);
  const dragControls = useDragControls();

  const ListItemContextMenu = ({ children, id }: PropsWithChildren & { id: string }) => {
    const dispatch = useDispatch()
  
    return (
      <ContextMenu>
        <ContextMenuTrigger>{children}</ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem 
            className='!text-red-500 hover:!bg-destructive/20'
            onClick={() => dispatch(deleteListById(id))}
          >
            Delete
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    )
  }

  return (
    <Reorder.Item
      value={value}
      id={value.id}
      style={{ y, contain: 'strict' }}
      dragControls={dragControls}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={() => { 
        setIsDragging(false); 
        onDragEnd(); 
      }}
      className="relative h-10"
    >
      <ListItemContextMenu id={value.id}>
        <Link to={`/list/${value.id}`} className={clsx({ 'pointer-events-none': disabled || isDragging })} draggable="false">
          <Button 
            variant={isActive ? 'ghost-active' : 'ghost'}
            className={clsx(
              'flex w-full justify-start gap-2 backdrop-blur-sm', 
              { 
                'text-muted-foreground': !isActive, 
                'bg-accent/50': isDragging 
              })}
          >
            <Icon icon='fluent:task-list-square-ltr-24-regular' className="shrink-0 text-xl" />
            <span className="block min-w-0 truncate">{ value.name }</span>
          </Button>
        </Link>
      </ListItemContextMenu>
    </Reorder.Item>
  )
}

interface ListGroupProps {
  items: List[]
}

export const ListGroup = (props: ListGroupProps) => {
  const [lists, setItems] = useState(props.items)
  const dispatch = useDispatch()

  useEffect(() => {
    setItems(props.items)
  }, [props.items])

  function onReorderApplied(value: List[]) {
    dispatch(setLists(value))
  }

  return (
    <Reorder.Group 
      className="space-y-2"
      values={lists} 
      axis="y" 
      onReorder={(items: List[]) => setItems(items)} 
    >
      {lists.map((item) => (
        <ListItem key={item.id} value={item} onDragEnd={() => onReorderApplied(lists)} />
      ))}
    </Reorder.Group>
  )
}

export const ListHeader = () => {
  const { listId } = useParams()
  const currentList = useSelector((state: RootState) => state.main.lists.find(item => item.id === listId))
  const title = currentList ? currentList.name : 'Tasks'
  const dispatch = useDispatch()

  const onChange: React.FormEventHandler<HTMLSpanElement> = (e) => {
    const target = e.target as HTMLInputElement 
    const text = target?.value
    if (!currentList || !text) return 
    dispatch(updateList({
      ...currentList,
      name: text
    }))
  }

  const onStyleChange = (value: string) => {
    if (!currentList?.id) return;

    dispatch(updateList({
      ...currentList,
      style: value || undefined
    }))
  }

  return (
    <div className="flex justify-between gap-2 p-4 pt-8 md:px-6 lg:px-16">
      <ContentEditable 
        className='w-max rounded-lg px-2 py-1 text-2xl font-semibold outline-none transition-colors hover:bg-foreground/10 focus:bg-foreground/10'
        value={title}
        changeOnBlur
        onChange={onChange}
      />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size='icon' variant='ghost' className="data-[state=open]:bg-foreground/5">
            <Icon icon='radix-icons:dots-vertical' className="text-xl" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="left" align="start">
          <DropdownMenuGroup>
            <DropdownMenuItem>Import</DropdownMenuItem>
            <DropdownMenuItem>Export</DropdownMenuItem>
          </DropdownMenuGroup>
          {currentList?.id && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <span>Style</span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuRadioGroup value={currentList.style} onValueChange={onStyleChange}>
                        <DropdownMenuRadioItem value="">Default</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="aura">Aura</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="pearl">Pearl</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="swamp">Swamp</DropdownMenuRadioItem>
                      </DropdownMenuRadioGroup>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
              </DropdownMenuGroup>
            </>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem className='!text-red-500 hover:!bg-destructive/20'>
           Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
