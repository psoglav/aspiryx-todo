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

  return <>
    <ResizablePanelGroup
      direction="horizontal"
      autoSaveId='ui-layout'
      className="h-screen"
    >
      <ResizablePanel defaultSize={20} maxSize={30} minSize={15}>
        <div className="h-screen p-4">
          <Sidebar />
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={100}>
        <div className="grid h-screen grid-rows-[max-content_1fr_max-content]">
          <div className='p-2 py-4 pt-8 text-3xl lg:px-16'>
            Tasks
          </div>
          <TaskList id={listId} />
          <CreateTask />
          <TaskEditSheet />
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  </>
}