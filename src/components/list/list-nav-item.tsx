import { deleteListById } from "@/store/main"
import { Icon } from "@iconify/react"
import { ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem } from "@/components/ui/context-menu"
import clsx from "clsx"
import { useMotionValue, useDragControls, Reorder } from "framer-motion"
import type { List } from "@/types"
import { useState, PropsWithChildren } from "react"
import { useDispatch } from "react-redux"
import { useParams, Link } from "react-router-dom"
import { Button } from "@/components/ui/button"

interface ListNavItemProps {
  value: List
  disabled?: boolean
  onDragEnd: () => void
}

export const ListNavItem = ({ value, disabled, onDragEnd }: ListNavItemProps) => {
  const { listId } = useParams()
  const isActive = listId === value.id
  const [isDragging, setIsDragging] = useState(false)

  const y = useMotionValue(0);
  const dragControls = useDragControls();

  const ListNavItemContextMenu = ({ children, id }: PropsWithChildren & { id: string }) => {
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
      <ListNavItemContextMenu id={value.id}>
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
      </ListNavItemContextMenu>
    </Reorder.Item>
  )
}