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

export default function Sidebar() {
  const lists = useSelector((state: RootState) => state.main.lists)
  const { listId } = useParams()
  const isToday = !listId
  const dispatch = useDispatch()

  return (
    <div className='relative grid h-full grid-rows-[max-content_1fr_max-content] space-y-4 p-4 pr-[7px]'>
      <div className="absolute right-0 top-1/2 -z-10 h-[100vh] w-[100vw] -translate-y-1/2 bg-zinc-600/5"></div>

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
        <Button variant='outline' size='icon' onClick={() => dispatch(setSettingsOpen(true))}>
          <Icon icon='material-symbols:settings' className='text-xl' />
        </Button>
      </div>
      
      <div className='space-y-4'>
        <Input placeholder="Search" icon='material-symbols:search' />

        <div className='space-y-2'>
          <Link to='/'>
            <Button variant={isToday ? 'secondary' : 'ghost'} className={clsx('w-full justify-start', { 'text-muted-foreground': !isToday })}>
              Tasks
            </Button>
          </Link>
          {
            lists.length ? (
              <>
                <Separator />
                <ListGroup items={lists} />
              </>
            ) : null
          }
        </div>
      </div>

      <div className="space-y-2">
        <CreateList />
      </div>
    </div>
  )
}