import { useEffect, useLayoutEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import type { RootState } from "@/store";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import Sidebar from '@/components/app-layout/sidebar'
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { setActiveTask } from "@/store/main";
import { ListView } from "@/views/ListView";
import { TaskDetailView } from "@/views/TaskDetailView";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { mockDemoData } from "@/mock/demo";
import { saveItem } from "@/helpers/localStorage";

export default function Home() {
  const [renderLeftSidebar] = useState(true)
  const [renderRightSidebar, setRenderRightSidebar] = useState(false)
  const activeTaskId = useSelector((state: RootState) => state.main.activeTaskId)
  const [searchParams] = useSearchParams();
  const { listId } = useParams()
  const navigate = useNavigate()

  if (searchParams.get('demo')) {
    saveItem('tasks', mockDemoData.tasks)
    saveItem('lists', mockDemoData.lists)
    saveItem('app:sfx', 'true')
    window.location.href = '/'
  }

  useEffect(() => {
    setRenderRightSidebar(window.innerWidth > 800)
    
    window.addEventListener('resize', () => {
      setRenderRightSidebar(window.innerWidth > 800)
    })

    const savedListId = localStorage.getItem('last-opened-list')

    if (savedListId) {
      navigate(`/list/${savedListId}`)
    }
  }, [])

  useLayoutEffect(() => {
    setRenderRightSidebar(Boolean(activeTaskId))
  }, [activeTaskId])

  useEffect(() => {
    if (listId) localStorage.setItem('last-opened-list', listId)
    else localStorage.removeItem('last-opened-list')
  }, [listId])

  const dispatch = useDispatch()
  const editSheetOpened = useSelector((state: RootState) => state.main.editSheetOpened)

  const onOpenChange = (open: boolean) => {
    if(!open) {
      dispatch(setActiveTask(null))
    }
  }

  return (
    <>
      <ResizablePanelGroup
        direction="horizontal"
        autoSaveId='ui-layout'
        className="relative"
      >
        {renderLeftSidebar && (
          <>
            <ResizablePanel 
              defaultSize={10} 
              maxSize={40} 
              minSize={10} 
              className="relative hidden min-w-max bg-background/80 md:block" 
              order={1}
            >
              <div className="absolute right-0 top-1/2 -z-10 h-[100vh] w-[100vw] -translate-y-1/2 bg-zinc-600/5"></div>
              <Sidebar />
            </ResizablePanel>
            <ResizableHandle className="hidden bg-transparent after:w-4 md:block" />
          </>
        )}

        <ResizablePanel style={{overflow: 'none'}} order={2}>
          <ListView />
        </ResizablePanel>

        {renderRightSidebar && editSheetOpened && (
          <>
            <ResizableHandle className="hidden md:block" />
            <ResizablePanel 
              defaultSize={20} 
              maxSize={40} 
              minSize={10} 
              order={3}
              className="relative hidden min-w-max bg-background/80 md:block"
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