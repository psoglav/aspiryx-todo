import { useSelector, useDispatch } from "react-redux"
import { TaskItem } from "@/components/task"
import { Button } from "@/components/ui/button"
import { RootState } from "@/store"
import { Icon } from "@iconify/react/dist/iconify.js"
import { setActiveTask } from "@/store/main"
import { AnimatePresence, motion } from "framer-motion"

export function TaskDetailView() {
  const tasks = useSelector((state: RootState) => state.main.tasks)
  const taskId = useSelector((state: RootState) => state.main.activeTaskId)
  const task = tasks.find(item => item.id === taskId)
  const dispatch = useDispatch()

  return (
    <AnimatePresence mode="wait">
      <motion.div 
        initial={{ scale: 0.99, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.1 }}
        exit={{ scale: 0.99, opacity: 0 }} 
        key={taskId}
        className='flex min-w-60 flex-col gap-4 p-4'
      >
        <Button 
          variant='ghost' 
          size='icon' 
          className="size-8 self-end text-foreground/50"
          onClick={() => dispatch(setActiveTask(null))}
        >
          <Icon icon="material-symbols:close-small-outline-rounded" className="text-3xl" />
        </Button>
        {task ? <TaskItem value={task} editable /> : null}
      </motion.div>
    </AnimatePresence>
  )
}