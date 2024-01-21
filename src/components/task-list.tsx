
import { useSelector } from 'react-redux'
import { Icon } from '@iconify/react';

import type { RootState } from '@/store'

import TaskItem from '@/components/task-item'
import { Button } from '@/components/ui/button'
import { useState } from 'react';
import clsx from 'clsx';
import { Task } from '@/types/task';

function TaskList() {
  const tasks = useSelector((state: RootState) => state.main.tasks)
  const [showCompleted, setShowCompleted] = useState(false)

  const completedTasks = tasks.filter(item => item.completed)
  const uncompletedTasks = tasks.filter(item => !item.completed)

  const renderTasks = (arr: Task[]) => {
    return arr.length ?
      <div className='flex flex-col gap-2'>
        {
          arr
            .map(item => (
              <TaskItem key={item.id} value={item} />
            ))
        }
      </div> : null
  }

  return (
    <div className="space-y-4 p-2 py-4 lg:px-16 lg:py-20">
      {
        renderTasks(uncompletedTasks)
      }
      <div className="space-y-2">
        <Button variant={showCompleted ? 'secondary' : 'ghost'} onClick={() => setShowCompleted(!showCompleted)}>
          <Icon
            icon='material-symbols:keyboard-arrow-down-rounded' 
            className={clsx('mr-1 -rotate-90 text-lg transition-transform', {
              '!rotate-0': showCompleted
            })} 
          />
          <span>Completed</span>
          {completedTasks.length ? <span className='px-2 text-muted-foreground'>{completedTasks.length}</span> : null}
        </Button>
        {
          showCompleted ? renderTasks(completedTasks) : null
        }
      </div>
    </div>
  )
}

export default TaskList