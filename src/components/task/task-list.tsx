import type { List, Task } from '@/types';
import { SelectionProvider } from '@/components/selection-context';
import { TaskGroup } from './task-group';
import { Collapsible } from '../collapsible';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface TaskListProps {
  list?: List
  tasks: Task[]
  filter?: string
}

export function TaskList({ list, tasks, filter }: TaskListProps) {
  const [items, setItems] = useState(tasks)
  const completedTasks = items.filter(item => item.completed)
  const uncompletedTasks = items.filter(item => !item.completed)

  useEffect(() => {
    setItems(filter ? tasks.filter(({text}) => text.includes(filter)) : tasks)
  }, [filter, tasks])

  return (
    <motion.div layout key={list?.id}>
      <Collapsible id={list?.id} title={list?.name} subtitle={filter ? items.length.toString() : ''} titleSize='lg' defaultCollapsed={false}>
        <div className='flex flex-col gap-4'>
          <SelectionProvider>
            <AnimatePresence mode='wait'>
              <TaskGroup key={0} items={uncompletedTasks} id="completed" />
              <TaskGroup 
                key={1}
                id="uncompleted"
                items={completedTasks} 
                title='Completed'
                subtitle={completedTasks.length.toString() || ''}
                defaultCollapsed={Boolean(uncompletedTasks.length && !filter)}
              />
            </AnimatePresence>
          </SelectionProvider>
        </div>
      </Collapsible>
    </motion.div>
  )
}
