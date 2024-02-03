import type { List, Task } from '@/types';
import { SelectionProvider } from '@/components/selection-context';
import { TaskGroup } from './task-group';
import { Collapsible } from '../collapsible';

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
          <TaskGroup items={uncompletedTasks} />
          <TaskGroup 
            items={completedTasks} 
            title='Completed' 
            defaultCollapsed={Boolean(uncompletedTasks.length)}
          />
        </SelectionProvider>
      </div>
    </Collapsible>
  )
}
