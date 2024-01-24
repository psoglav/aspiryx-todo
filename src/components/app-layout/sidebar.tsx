import clsx from 'clsx';
import { useSelector } from 'react-redux'
import { useParams, Link } from "react-router-dom";
import { Icon } from "@iconify/react"

import type { RootState } from '@/store'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CreateList, ListGroup } from '@/components/list'
import { Separator } from '@/components/ui/separator'

export default function Sidebar() {
  const lists = useSelector((state: RootState) => state.main.lists)
  const { listId } = useParams()
  const isToday = !listId

  return (
    <div className='grid h-full grid-rows-[max-content_1fr_max-content] space-y-4'>
      <a href="https://aspiryx.space">
        <Button
          variant='ghost'
          className="flex w-full gap-2 py-8 uppercase" 
        >
          <Icon icon='ion:arrow-back-outline' />
          <span className="text-lg font-bold">HUB</span>
        </Button>
      </a>
      
      <div className='space-y-4'>
        <Input placeholder="Search" icon='material-symbols:search' />

        <div className='flex flex-col gap-2'>
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

      <CreateList />

    </div>
  )
}