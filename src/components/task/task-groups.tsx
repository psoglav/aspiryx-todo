import type { Task } from '@/types';
import { SelectionProvider } from '@/components/selection-context';
import { TaskGroup } from './task-group';

interface TaskGroupsProps {
  tasks: Task[]
}

export function TaskGroups({ tasks }: TaskGroupsProps) {
  const completedTasks = tasks.filter(item => item.completed)
  const uncompletedTasks = tasks.filter(item => !item.completed)

  return (
    <div className="flex flex-col gap-4 py-4">
      <SelectionProvider>
        <TaskGroup items={uncompletedTasks} />
        <TaskGroup 
          items={completedTasks} 
          title='Completed' 
          defaultCollapsed={Boolean(uncompletedTasks.length)}
        />
      </SelectionProvider>
    </div>
  )
}
