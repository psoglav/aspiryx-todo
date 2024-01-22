
import { useSelector } from 'react-redux'
import { useParams } from "react-router-dom";

import type { RootState } from '@/store'
import type { Task } from '@/types';

import TaskItem from './task-item'
import TaskGroup from './task-group';

function TaskList() {
  const { listId } = useParams()
  const tasks = useSelector((state: RootState) => state.main.tasks.filter(item => item.listId === listId))

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
    <div className="space-y-4 p-2 py-4 lg:px-16">
      {
        renderTasks(uncompletedTasks)
      }
      <TaskGroup tasks={completedTasks} title='Completed' />
    </div>
  )
}

export default TaskList