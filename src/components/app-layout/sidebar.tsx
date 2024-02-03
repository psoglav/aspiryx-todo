import clsx from 'clsx';
import { useContext } from 'react';
import { useSelector } from 'react-redux'
import { Link, useLocation } from "react-router-dom";
import { Icon } from "@iconify/react"

import type { RootState } from '@/store'

import { Button } from "@/components/ui/button"
import { CreateList, ListNavGroup } from '@/components/list'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area';
import { SettingsContext } from '@/components/settings';
import { PoweredBy } from '@/components/powered-by';

export default function Sidebar() {
  const lists = useSelector((state: RootState) => state.main.lists)
  const location = useLocation()
  const isRootPath = location.pathname === '/'
  const isImportant = location.pathname === '/important'
  const { setOpen } = useContext(SettingsContext)

  return (
    <div className='grid h-[100dvh] grid-rows-[max-content_1fr_max-content] space-y-2 p-4 pr-1'>
      <div className='flex flex-col gap-4 pr-3'>
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
          <Button variant='ghost' size='icon' onClick={() => setOpen(true)}>
            <Icon icon='material-symbols:settings' className='text-xl' />
          </Button>
        </div>

        <div className='flex flex-col gap-2'>
          <Link to='/important'>
            <Button variant={isImportant ? 'ghost-active' : 'ghost'} className={clsx('w-full justify-start', { 'text-muted-foreground': !isImportant })}>
              Important
            </Button>
          </Link>
          <Link to='/'>
            <Button variant={isRootPath ? 'ghost-active' : 'ghost'} className={clsx('w-full justify-start', { 'text-muted-foreground': !isRootPath })}>
              Tasks
            </Button>
          </Link>
        </div>
        <Separator />
      </div>

      <ScrollArea>
        <div className='relative h-full space-y-6 pr-3'>
          <CreateList />
          <ListNavGroup items={lists} />
        </div>
      </ScrollArea>

      <div className="space-y-2 pr-3">
        <PoweredBy />
      </div>
    </div>
  )
}