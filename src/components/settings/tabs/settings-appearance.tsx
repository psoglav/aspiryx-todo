import { Button } from '@/components/ui/button'
import { useTheme } from '@/components/ui/theme-provider'
import { SettingsContext, SettingsTab } from ".."
import { useContext } from 'react'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

export function SettingsAppearance() {
  const { theme, setTheme } = useTheme()
  const ctx = useContext(SettingsContext)

  return (
    <SettingsTab 
      id={1}
      title="Appearance"
    >
      <div className="space-y-4">
        <Button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>Toggle theme</Button>
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Theme tweaks</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Switch id="fancy-noise" checked={ctx.enableFancyNoise} onCheckedChange={ctx.setEnableFancyNoise} />
              <Label htmlFor="fancy-noise">Fancy Noise</Label>
            </div>
          </div>
        </div>
      </div>
    </SettingsTab>
  )
}