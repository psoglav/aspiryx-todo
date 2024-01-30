import { useSelector, useDispatch } from "react-redux"
import { TaskItem } from "@/components/task"
import { Button } from "@/components/ui/button"
import { RootState } from "@/store"
import { Icon } from "@iconify/react/dist/iconify.js"
import { deleteTaskById, setActiveTask, updateTask } from "@/store/main"
import { AnimatePresence, motion } from "framer-motion"
import clsx from "clsx"
import { FormEventHandler, PropsWithChildren } from "react"

export function TaskDetailView() {
  const tasks = useSelector((state: RootState) => state.main.tasks)
  const taskId = useSelector((state: RootState) => state.main.activeTaskId)
  const task = tasks.find(item => item.id === taskId)!
  const dispatch = useDispatch()

  const onFavoriteToggle = () => {
    dispatch(updateTask({
      ...task,
      isImportant: !task.isImportant
    }))
  }

  const onClose = () => {
    dispatch(setActiveTask(null))
  }
  
  const onDelete = () => {
    onClose()
    dispatch(deleteTaskById(task.id))
  }

  function IconButton(props: { onClick: FormEventHandler } & PropsWithChildren) {
    return (
      <Button 
        variant='ghost' 
        size='icon' 
        className="size-8 self-end text-foreground/50"
        {...props}
      >
        {props.children}
      </Button>
    )
  }

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
        <div className="flex justify-between">
          <div className="flex justify-end gap-2">
            <IconButton onClick={onFavoriteToggle}>
              <Icon 
                icon={ task.isImportant ? 'ic:round-star' : 'ic:round-star-border' } 
                className={clsx('text-xl text-muted-foreground', { 
                  'text-yellow-400': task.isImportant 
                })} 
              />
            </IconButton>

            <IconButton 
              onClick={onDelete}
            >
              <Icon icon="ic:baseline-delete-outline" className="text-xl" />
            </IconButton>
          </div>
          
          <IconButton 
            onClick={onClose}
          >
            <Icon icon="material-symbols:close-small-outline-rounded" className="text-3xl" />
          </IconButton>
        </div>
        {task ? <TaskItem value={task} editable /> : null}
      </motion.div>
    </AnimatePresence>
  )
}