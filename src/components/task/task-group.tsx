import { RootState } from "@/store"
import { setTasks } from "@/store/main"
import { Task } from "@/types"
import { Reorder, motion } from "framer-motion"
import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { TaskItem } from "./task-item"
import { Collapsible } from "../collapsible"

interface TaskGroupProps {
  id?: string | number
  title?: string
  subtitle?: string
  items: Task[]
  defaultCollapsed?: boolean
}

export function TaskGroup({ title, subtitle, items, defaultCollapsed = false, ...props }: TaskGroupProps) {
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
    <motion.div
      key={props.id}
      exit={{ opacity: 0 }} 
      transition={{
        opacity: { ease: 'easeInOut', duration: 0.2 }, 
      }}
    >
      <Collapsible id={props.id} title={title} subtitle={subtitle} defaultCollapsed={defaultCollapsed}>
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
    </motion.div>
  )
}