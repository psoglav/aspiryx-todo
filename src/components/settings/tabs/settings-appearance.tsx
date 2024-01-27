import { Button } from '@/components/ui/button'
import { useTheme } from '@/components/ui/theme-provider'
import { SettingsTab } from ".."

export function SettingsAppearance() {
  const { theme, setTheme } = useTheme()

  return (
    <SettingsTab 
      id={1}
      title="Appearance"
    >
      <div className="">
        <Button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>Toggle theme</Button>
      </div>
    </SettingsTab>
  )
}