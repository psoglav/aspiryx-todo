import { useParams } from "react-router-dom";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { TaskList, CreateTask, TaskEditSheet } from '@/components/task'
import Sidebar from '@/components/app-layout/sidebar'

export default function Home() {
  const { listId } = useParams()

  return (
    <ResizablePanelGroup
      direction="horizontal"
      autoSaveId='ui-layout'
      className="h-screen"
    >
      <ResizablePanel defaultSize={20} maxSize={40} minSize={15}>
        <div className="h-screen p-4">
          <Sidebar />
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel>
        <div className="grid h-screen grid-rows-[1fr_max-content]">
          <div className="px-4 md:px-6 lg:px-16">
            <div className='py-4 pt-8 text-3xl'>
              Tasks
            </div>
            <TaskList id={listId} />
          </div>
          <CreateTask />
          <TaskEditSheet />
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}