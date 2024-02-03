import type { List, Task } from '@/types';
import { SelectionProvider } from '@/components/selection-context';
import { TaskGroup } from './task-group';
import { Collapsible } from '../collapsible';
import { AnimatePresence } from 'framer-motion';

interface TaskListProps {
  list?: List
  tasks: Task[]
}

export function TaskList({ list, tasks }: TaskListProps) {
  const completedTasks = tasks.filter(item => item.completed)
  const uncompletedTasks = tasks.filter(item => !item.completed)

  return (
    <Collapsible title={list?.name} titleSize='lg' defaultCollapsed={false}>
      <div className='flex flex-col gap-4'>
        <SelectionProvider>
          <AnimatePresence mode='wait'>
            <TaskGroup items={uncompletedTasks} id="completed" />
            <TaskGroup 
              id="uncompleted"
              items={completedTasks} 
              title='Completed'
              subtitle={completedTasks.length.toString() || ''}
              defaultCollapsed={Boolean(uncompletedTasks.length)}
            />
          </AnimatePresence>
        </SelectionProvider>
      </div>
    </Collapsible>
  )
}
