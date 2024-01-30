import clsx from 'clsx';
import { useDispatch, useSelector } from 'react-redux'
import { useParams, Link } from "react-router-dom";
import { Icon } from "@iconify/react"

import type { RootState } from '@/store'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CreateList, ListGroup } from '@/components/list'
import { Separator } from '@/components/ui/separator'
import { setSettingsOpen } from "@/store/settings"
import { ScrollArea } from '@/components/ui/scroll-area';

export default function Sidebar() {
  const lists = useSelector((state: RootState) => state.main.lists)
  const { listId } = useParams()
  const isToday = !listId
  const dispatch = useDispatch()

  return (
    <div className='grid h-[100dvh] grid-rows-[max-content_1fr_max-content] space-y-4 p-4'>
      <div className='flex flex-col gap-4'>
        <div className="flex gap-2">
          <a href="https://aspiryx.space" className='grow'>
            <Button
              variant='ghost'
              className="flex size-full justify-start gap-2 uppercase" 
            >
              <Icon icon='ion:arrow-back-outline' />
              <span className=" font-bold">HUB</span>
            </Button>
          </a>
          <Button variant='ghost' size='icon' onClick={() => dispatch(setSettingsOpen(true))}>
            <Icon icon='material-symbols:settings' className='text-xl' />
          </Button>
        </div>

        <Input placeholder="Search" icon='material-symbols:search' />

        <Link to='/'>
          <Button variant={isToday ? 'ghost-active' : 'ghost'} className={clsx('w-full justify-start', { 'text-muted-foreground': !isToday })}>
              Tasks
          </Button>
        </Link>

        <Separator />
      </div>

      <ScrollArea>
        <div className='h-full space-y-2'>
          <ListGroup items={lists} />
        </div>
      </ScrollArea>

      <div className="space-y-2">
        <CreateList />

        <div className='flex justify-center gap-2 py-3 text-center text-xs text-muted-foreground'>
          <div>powered by</div> 
          <a className='flex gap-1 hover:underline' href='https://aspiryx.space' target='_blank'>
            <img src='https://aspiryx.space/logo.svg' className='size-4' />
            <span>ASPIRYX</span>
          </a>
        </div>
      </div>
    </div>
  )
}