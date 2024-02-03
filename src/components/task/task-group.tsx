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
import { Collapsible } from "../collapsible"

interface TaskGroupProps {
  title?: string
  items: Task[]
  defaultCollapsed?: boolean
}

export function TaskGroup({ title, items, defaultCollapsed = false }: TaskGroupProps) {
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
    <Collapsible title={title} defaultCollapsed={defaultCollapsed}>
      <Reorder.Group values={groupTasks} onReorder={setGroupTasks}>
        <div className="space-y-2">
          {groupTasks
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
    </Collapsible>
  )
}