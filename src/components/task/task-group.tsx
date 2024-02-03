import { RootState } from "@/store"
import { setTasks } from "@/store/main"
import { Task } from "@/types"
import { Icon } from "@iconify/react"
import { Button } from "@/components/ui/button"
import clsx from "clsx"
import { Reorder } from "framer-motion"
import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { TaskItem } from "./task-item"

interface TaskGroupProps {
  title?: string
  items: Task[]
  defaultCollapsed?: boolean
}

export function TaskGroup({ title, items, defaultCollapsed = false }: TaskGroupProps) {
  const [collapsed, setCollapsed] = useState(items.length ? defaultCollapsed : true)
  const [draggedItem, setDraggedItem] = useState<Task | null>(null)
  const dispatch = useDispatch()
  const allTasks = useSelector((state: RootState) => state.main.tasks)
  const [groupTasks, setGroupTasks] = useState<Task[]>(items)

  useEffect(() => {
    setGroupTasks(items)
  }, [items])

  if (items.length === 0) return null

  function onDragEnd() {
    const fullList = allTasks.filter(({id}) => !groupTasks.find((el) => el.id === id))
    dispatch(setTasks([...fullList, ...groupTasks]))
  }

  return (
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
      <Reorder.Group values={groupTasks} onReorder={setGroupTasks}>
        <div className="space-y-2">
          {(!collapsed || !title) && groupTasks
            .map(item => (
              <Reorder.Item 
                key={item.id} 
                value={item} 
                onDragStart={() => setDraggedItem(item)} 
                onDragEnd={onDragEnd}
              >
                <TaskItem value={item} tasks={items} isDragging={draggedItem?.id === item.id} />
              </Reorder.Item>
            ))}
        </div>
      </Reorder.Group>
    </div>
  )
}