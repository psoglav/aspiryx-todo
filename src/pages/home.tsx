import { useEffect, useLayoutEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import type { RootState } from "@/store";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import Sidebar from '@/components/app-layout/sidebar'
import { ScrollArea } from "@/components/ui/scroll-area";
import { TaskGroupList, CreateTask, TaskDetailView } from '@/components/task'
import { ListHeader } from "@/components/list";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { setEditedTaskId } from "@/store/main";
import { WhatameshGradient } from "@/components/whatamesh/gradient";

export default function Home() {
  const { listId } = useParams()
  const [renderLeftSidebar] = useState(true)
  const [renderRightSidebar, setRenderRightSidebar] = useState(false)
  const editedTaskId = useSelector((state: RootState) => state.main.editedTaskId)

  useEffect(() => {
    setRenderRightSidebar(window.innerWidth > 800)
    
    window.addEventListener('resize', () => {
      setRenderRightSidebar(window.innerWidth > 800)
    })
  }, [])

  useLayoutEffect(() => {
    setRenderRightSidebar(Boolean(editedTaskId))
  }, [editedTaskId])

  const dispatch = useDispatch()
  const editSheetOpened = useSelector((state: RootState) => state.main.editSheetOpened)

  const onOpenChange = (open: boolean) => {
    console.log(open)
    if(!open) {
      dispatch(setEditedTaskId(null))
    }
  }

  return (
    <>
      <ResizablePanelGroup
        direction="horizontal"
        autoSaveId='ui-layout'
        className="relative h-screen"
      >
        {renderLeftSidebar && (
          <>
            <ResizablePanel 
              defaultSize={20} 
              maxSize={40} 
              minSize={10} 
              className="relative hidden min-w-max bg-background/80 md:block" 
              order={1}
            >
              <div className="absolute right-0 top-1/2 -z-10 h-[100vh] w-[100vw] -translate-y-1/2 bg-zinc-600/5"></div>
              <Sidebar />
            </ResizablePanel>
            <ResizableHandle className="hidden md:block" />
          </>
        )}

        <ResizablePanel className="min-w-max" style={{overflow: 'none'}} order={2}>
          <div className="relative grid h-[100dvh] grid-rows-[max-content_1fr_max-content] bg-background/60">
            <ListHeader />
            <ScrollArea className="size-full">
              <div className="px-4 md:px-6 lg:px-16">
                <TaskGroupList id={listId} />
              </div>
            </ScrollArea>
            <CreateTask />
            <WhatameshGradient style="aura" />
          </div>
        </ResizablePanel>

        {renderRightSidebar && editSheetOpened && (
          <>
            <ResizableHandle className="hidden md:block" />
            <ResizablePanel 
              defaultSize={20} 
              maxSize={40} 
              minSize={10} 
              order={3}
              className="relative hidden min-w-max bg-background/80 p-4 md:block"
            >
              <div className="absolute left-0 top-1/2 -z-10 h-[100vh] w-[100vw] -translate-y-1/2 bg-zinc-600/5"></div>
              <TaskDetailView />
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>
    
      {!renderRightSidebar && (
        <Sheet open={editSheetOpened} onOpenChange={onOpenChange}>
          <SheetContent className="pt-8" style={{'animation': 'none'}}>
            <TaskDetailView />
          </SheetContent>
        </Sheet>
      )}
    </>
  )
}