import { RootState } from "@/store"
import { updateList } from "@/store/main"
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuGroup, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuSub, 
  DropdownMenuSubTrigger, 
  DropdownMenuPortal, 
  DropdownMenuSubContent, 
  DropdownMenuRadioGroup, 
  DropdownMenuRadioItem 
} from "@/components/ui/dropdown-menu"
import { ContentEditable } from "@/components/content-editable"
import { Button } from "@/components/ui/button"
import { Icon } from "@iconify/react"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { useEffect, useRef, useState } from "react"
import clsx from "clsx"
import { useHotkeys } from "react-hotkeys-hook"

interface Props {
  onSearch?: (query: string) => void
}

export const ListHeader = ({ onSearch }: Props) => {
  const { listId } = useParams()
  const currentList = useSelector((state: RootState) => state.main.lists.find(item => item.id === listId))
  const title = currentList ? currentList.name : 'Tasks'
  const [search, setSearch] = useState('')
  const dispatch = useDispatch()
  const searchRef = useRef<HTMLInputElement>(null)

  const onChange: React.FormEventHandler<HTMLSpanElement> = (e) => {
    const target = e.target as HTMLInputElement 
    const text = target?.value
    if (!currentList || !text) return 
    dispatch(updateList({
      ...currentList,
      name: text
    }))
  }

  const onStyleChange = (value: string) => {
    if (!currentList?.id) return;

    dispatch(updateList({
      ...currentList,
      style: value || undefined
    }))
  }

  useEffect(() => {
    if (onSearch) {
      onSearch(search)
    }
  }, [search, onSearch])

  useHotkeys('ctrl+k', (event) => {
    event.preventDefault()
    event.stopPropagation()
    searchRef.current?.focus()
  }, { enableOnContentEditable: true, enableOnFormTags: true })

  useHotkeys('escape', () => {
    searchRef.current?.blur()
  }, { enableOnContentEditable: true, enableOnFormTags: true })

  return (
    <div className="flex items-center justify-between gap-4 p-4 pt-8 md:px-6 lg:px-16">
      <AnimatePresence mode="popLayout">
        {!search && (
          <motion.div
            layout
            key={listId}
            layoutId={listId}
            exit={{ opacity: 0 }} 
          >
            <ContentEditable 
              className='w-max min-w-20 max-w-96 shrink-0 truncate !whitespace-nowrap rounded-lg px-2 py-1 text-2xl font-semibold outline-none transition-colors hover:bg-foreground/10 focus:bg-foreground/10'
              value={title}
              changeOnBlur
              onChange={onChange}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="hidden grow justify-center md:flex">
        <motion.div layout className={clsx("relative min-w-[200px] grow", {
          'max-w-[480px]': !search
        })}>
          <Input 
            icon="material-symbols:search-rounded" 
            placeholder="Search (Ctrl + K)" className="border-foreground/10 bg-foreground/5 focus-within:!bg-foreground/10 hover:!bg-foreground/10" 
            value={search}
            ref={searchRef}
            onChange={e => {
              if (onSearch) setSearch(e.target.value)
            }}
          />
          {search && (
            <Button 
              variant='ghost' 
              size='icon' 
              className="absolute right-1 top-1/2 size-8 -translate-y-1/2"
              onClick={() => setSearch('')}
            >
              <Icon icon="material-symbols:close-small-outline-rounded" className="text-3xl text-muted-foreground" />
            </Button>
          )}
        </motion.div>
      </div>

      <div className="flex justify-end lg:max-w-48 lg:grow">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size='icon' variant='ghost' className="data-[state=open]:bg-foreground/5">
              <Icon icon='radix-icons:dots-vertical' className="text-xl" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="left" align="start">
            <DropdownMenuGroup>
              <DropdownMenuItem>Import</DropdownMenuItem>
              <DropdownMenuItem>Export</DropdownMenuItem>
            </DropdownMenuGroup>
            {currentList?.id && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <span>Style</span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        <DropdownMenuRadioGroup value={currentList.style} onValueChange={onStyleChange}>
                          <DropdownMenuRadioItem value="">Default</DropdownMenuRadioItem>
                          <DropdownMenuRadioItem value="aura">Aura</DropdownMenuRadioItem>
                          <DropdownMenuRadioItem value="black-swan">Black Swan</DropdownMenuRadioItem>
                          <DropdownMenuRadioItem value="pearl">Pearl</DropdownMenuRadioItem>
                          <DropdownMenuRadioItem value="swamp">Swamp</DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                </DropdownMenuGroup>
              </>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem className='!text-red-500 hover:!bg-destructive/20'>
           Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}