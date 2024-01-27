import { Button } from '@/components/ui/button'
import { useTheme } from '@/components/ui/theme-provider'

export function SettingsAppearance() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="">
      <Button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>Toggle theme</Button>
    </div>
  )
}