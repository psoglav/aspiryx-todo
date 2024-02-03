import type { Task } from '@/types';
import { SelectionProvider } from '@/components/selection-context';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle} from '@/components/ui/alert-dialog';
import { TaskGroup } from './task-group';

interface TaskGroupsProps {
  tasks: Task[]
}

export function TaskGroups({ tasks }: TaskGroupsProps) {
  const completedTasks = tasks.filter(item => item.completed)
  const uncompletedTasks = tasks.filter(item => !item.completed)

  return (
    <div className="flex flex-col gap-4 py-4">
      <SelectionProvider>
        <TaskGroup items={uncompletedTasks} />
        <TaskGroup 
          items={completedTasks} 
          title='Completed' 
          defaultCollapsed={Boolean(uncompletedTasks.length)}
        />
        <AlertDialog open={true}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
        This action cannot be undone. This will permanently delete your account
        and remove your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </SelectionProvider>
    </div>
  )
}
