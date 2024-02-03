import type { List, Task } from '@/types';
import { SelectionProvider } from '@/components/selection-context';
import { TaskGroup } from './task-group';
import { Collapsible } from '../collapsible';
import { AnimatePresence } from 'framer-motion';
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
    <Collapsible id={list?.id} title={list?.name} titleSize='lg' defaultCollapsed={false}>
      <div className='flex flex-col gap-4'>
        <SelectionProvider>
          <AnimatePresence mode='wait'>
            <TaskGroup items={uncompletedTasks} id="completed" />
            <TaskGroup 
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
  )
}
