import { ListHeader } from "@/components/list";
import { CreateTask, TaskGroupList } from "@/components/task";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AnimatePresence, motion } from "framer-motion";

export function ListView(props: { id?: string }) {
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
          key={props.id}
        >
          <ScrollArea className="size-full">
            <div className="px-4 md:px-6 lg:px-16">
              <TaskGroupList id={props.id} />
            </div>
          </ScrollArea>
        </motion.div>
      </AnimatePresence>
      <CreateTask />
    </div>
  )
}