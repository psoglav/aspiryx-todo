import { ListHeader } from "@/components/list";
import { CreateTask, TaskGroupList } from "@/components/task";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RootState } from "@/store";
import { AnimatePresence, motion } from "framer-motion";
import { useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";

export function ListView() {
  const { listId } = useParams()
  const location = useLocation()

  const tasks = useSelector((state: RootState) => {
    if (location.pathname === '/') return state.main.tasks.filter(item => !item.listId)
    if (location.pathname === '/important') return state.main.tasks.filter(item => item.isImportant)
    return state.main.tasks.filter(item => item.listId === listId)
  })


  return (
    <div 
      className="grid h-[100dvh] min-w-max grid-rows-[max-content_1fr_max-content] bg-background/60" 
    >
      <ListHeader />
      <AnimatePresence mode="wait">
        <motion.div 
          initial={{ scale: 0.99, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.1 }}
          exit={{ scale: 0.99, opacity: 0 }} 
          className="relative"
          key={location.pathname}
        >
          <ScrollArea className="size-full">
            <div className="px-4 md:px-6 lg:px-16">
              <TaskGroupList tasks={tasks} />
            </div>
          </ScrollArea>
        </motion.div>
      </AnimatePresence>
      <CreateTask />
    </div>
  )
}