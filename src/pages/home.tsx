import { useParams } from "react-router-dom";
import { DndContext } from '@dnd-kit/core';
import { MouseSensor, TouchSensor, KeyboardSensor, useSensor } from '@dnd-kit/core';
import { restrictToParentElement } from '@dnd-kit/modifiers';

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { TaskList, CreateTask, TaskEditSheet } from '@/components/task'
import Sidebar from '@/components/app-layout/sidebar'
import { ListDropdownMenu, ListTitle } from "@/components/list";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Home() {
  const { listId } = useParams()

  const modifiers = [restrictToParentElement]
  const sensors = [
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor)
  ]

  return (
    <>
      <DndContext modifiers={modifiers} sensors={sensors}>
        <ResizablePanelGroup
          direction="horizontal"
          autoSaveId='ui-layout'
          className="relative h-screen"
        >
          <ResizablePanel defaultSize={20} maxSize={40} minSize={15} className="hidden md:block">
            <div className="h-[100dvh]">
              <Sidebar />
            </div>
          </ResizablePanel>
          <ResizableHandle className="hidden w-[10px] border-r border-border bg-zinc-600/5 transition-colors md:block" />
          <ResizablePanel className="z-[1]" style={{overflow: 'none'}}>
            <div className="grid h-[100dvh] grid-rows-[max-content_1fr_max-content]">
              <div className="flex justify-between p-4 pt-8 md:px-6 lg:px-16">
                <ListTitle />
                <ListDropdownMenu />
              </div>
              <ScrollArea className="size-full">
                <div className="px-4 md:px-6 lg:px-16">
                  <TaskList id={listId} />
                </div>
              </ScrollArea>
              <CreateTask />
              <TaskEditSheet />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </DndContext>

    </>
  )
}