import { useParams } from "react-router-dom";
import { DndContext } from '@dnd-kit/core';

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { TaskList, CreateTask, TaskEditSheet } from '@/components/task'
import Sidebar from '@/components/app-layout/sidebar'
import { ListDropdownMenu, ListTitle } from "@/components/list";


export default function Home() {
  const { listId } = useParams()

  return (
    <DndContext>
      <ResizablePanelGroup
        direction="horizontal"
        autoSaveId='ui-layout'
        className="relative h-screen"
      >
        <ResizablePanel defaultSize={20} maxSize={40} minSize={15}>
          <div className="h-screen p-4">
            <Sidebar />
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel className="z-[1]" style={{overflow: 'none'}}>
          <div className="grid h-screen grid-rows-[1fr_max-content]">
            <div className="px-4 md:px-6 lg:px-16">
              <div className="flex justify-between py-4 pt-8">
                <ListTitle />
                <ListDropdownMenu />
              </div>
              <TaskList id={listId} />
            </div>
            <CreateTask />
            <TaskEditSheet />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </DndContext>
  )
}