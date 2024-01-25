import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Icon, type IconifyIcon } from "@iconify/react"
import { Separator } from "@/components/ui/separator"

export type SettingsNavigationGroupLabel = {
  type: 'group-label'
  text: string
}

export type SettingsNavigationTab = {
  type: 'tab'
  text: string
  icon?: string | IconifyIcon
  content: () => JSX.Element
} | null

export type SettingsNavigationItem = SettingsNavigationGroupLabel | SettingsNavigationTab | null

interface SettingsNavigationProps {
  items: SettingsNavigationItem[]
  onTabChanged: (tab: number) => void
}

export const SettingsNavigation = (props: SettingsNavigationProps) => {
  const [activeTab, setActiveTab] = useState(1)

  function handleTabClick(index: number) {
    setActiveTab(index)
    props.onTabChanged(index)
  }

  function renderItem(item: SettingsNavigationItem, i: number) {
    if (item === null) return <Separator className="my-1" key={i} />

    switch(item.type) {
    case 'group-label':
      return (
        <div className="px-4 pb-2 font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground" key={i}>
          {item.text}
        </div>
      )
    case 'tab':
      return (
        <Button 
          className="justify-start space-x-2"
          key={i} 
          onClick={() => handleTabClick(i)}
          variant={activeTab === i ? 'secondary' : 'ghost'}
        >
          {item.icon && <Icon icon={item.icon} />}
          <span>{item.text}</span>
        </Button>
      )
    default:
      return null
    }
  }

  return (
    <div className="relative flex h-full w-[200px] flex-col gap-1 px-5">
      <div className="absolute right-0 top-1/2 -z-10 h-[100vh] w-[100vw] -translate-y-1/2 border-r border-border bg-zinc-600/5"></div>
      { props.items.map(renderItem) }
    </div>
  )
}