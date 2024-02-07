import { ListHeader } from "@/components/list";
import { CreateTask, TaskList } from "@/components/task";
import { ScrollArea } from "@/components/ui/scroll-area";
import { WhatameshGradient } from "@/components/whatamesh/gradient";
import { RootState } from "@/store";
import { List } from "@/types";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";

export function ListView() {
  const { listId } = useParams()
  const location = useLocation()
  const list = useSelector((state: RootState) => state.main.lists.find(item => item.id === listId))
  const lists = useSelector((state: RootState) => state.main.lists)
  const [filteredLists, setFilteredLists] = useState<List[]>([])
  const [search, setSearch] = useState('')

  const tasks = useSelector((state: RootState) => {
    if (location.pathname === '/') return state.main.tasks.filter(item => !item.listId)
    if (location.pathname === '/important') return state.main.tasks.filter(item => item.isImportant)
    return state.main.tasks.filter(item => item.listId === listId)
  })

  const allTasks = useSelector((state: RootState) => state.main.tasks)

  useEffect(() => {
    if (!search) {
      setFilteredLists([])
      return
    }
    setFilteredLists(lists.filter(({id}) => {
      const ids = allTasks.filter(({text}) => text.includes(search)).map(({listId}) => listId)
      return ids.includes(id)
    }))
  }, [search, lists, allTasks])


  return (
    <div 
      className={clsx("h-full bg-background md:p-2", {
        '!pt-0': window.isElectronApp
      })}
    >
      <div className="relative h-full overflow-hidden rounded-lg border border-border/50">
        <div 
          className="relative z-[1] grid h-full min-w-max grid-rows-[max-content_1fr_max-content] bg-background/60 pt-4 lg:pt-8" 
        >
          <ListHeader onSearch={setSearch} />
          <AnimatePresence mode="wait">
            <motion.div 
              initial={{ scale: 0.99, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.1 }}
              exit={{ scale: 0.99, opacity: 0 }} 
              className="relative min-h-0"
              key={location.pathname}
            >
              <ScrollArea className="size-full">
                <div className="space-y-8 p-4 md:px-6 lg:px-16">
                  <AnimatePresence mode="sync">
                    {search ? (
                      filteredLists.map(item => <TaskList tasks={allTasks.filter((el) => item.id === el.listId)} filter={search} list={item} key={item.id} />)
                    ) : <TaskList tasks={tasks} filter={search} />}
                  </AnimatePresence>
                </div>
              </ScrollArea>
            </motion.div>
          </AnimatePresence>
          <CreateTask />
        </div>
        <WhatameshGradient style={list?.style} />
      </div>
    </div>
  )
}