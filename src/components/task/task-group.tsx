import { RootState } from "@/store"
import { setTasks } from "@/store/main"
import { Task } from "@/types"
import { Collapsible } from "@/components/collapsible"
import { useSelection } from "@/components/selection-context"
import { Reorder, motion } from "framer-motion"
import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { TaskItem } from "./task-item"

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

  const selection = useSelection()

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
                  value={item} 
                  onDragStart={() => setDraggedItem(item)} 
                  onDragEnd={onDragEnd}
                  layout
                  layoutId={item.id}
                  key={item.id}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }} 
                  whileTap={{scale: !selection.selected.length ? 1 : 0.98}} 
                  transition={{
                    scale: { type: 'spring', duration: 0.15 }, 
                    opacity: { ease: 'easeInOut', duration: 0.2 }, 
                  }}
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