import TaskList from '@/components/task-list'
import CreateTask from '@/components/create-task'

import TaskEditSheet from '@/components/task-edit-sheet';

export default function Home() {
  return <>
    <div className="grid h-screen grid-rows-[max-content_1fr_max-content]">
      <div></div>
      <TaskList />
      <CreateTask />
      <TaskEditSheet />
    </div>
  </>
}