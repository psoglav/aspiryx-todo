import { useSelector, useDispatch } from 'react-redux'
import {
  Sheet,
  SheetTitle,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
} from "@/components/ui/sheet"
import { Button } from '@/components/ui/button'
import { RootState } from "@/store"
import { setEditedTaskId } from '@/store/main'
import TaskItem from "./task-item"

export default function TaskEditSheet() {
  const dispatch = useDispatch()
  
  const tasks = useSelector((state: RootState) => state.main.tasks)
  const taskId = useSelector((state: RootState) => state.main.editedTaskId)
  const editSheetOpened = useSelector((state: RootState) => state.main.editSheetOpened)

  const task = tasks.find(item => item.id === taskId)

  const onOpenChange = (open: boolean) => {
    if(!open) {
      dispatch(setEditedTaskId(null))
    }
  }

  return (
    <>
      <Sheet open={editSheetOpened} onOpenChange={onOpenChange}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Edit</SheetTitle>
          </SheetHeader>
          <div className='py-4'>
            {task ? <TaskItem value={task} /> : null}
          </div>
          <SheetFooter>
            <SheetClose asChild>
              <Button type="submit">Save changes</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>

    </>
  )
}