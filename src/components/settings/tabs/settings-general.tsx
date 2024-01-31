import { Switch } from "@/components/ui/switch"
import { SettingsContext, SettingsTab } from ".."
import { Label } from "@/components/ui/label"
import { useContext } from "react"

export function SettingsGeneral() {
  const { enableSoundEffects, setEnableSoundEffects } = useContext(SettingsContext)

  return (
    <SettingsTab 
      id={0}
      title="General"
    >
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Audio</h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Switch id="sound-effects" checked={enableSoundEffects} onCheckedChange={setEnableSoundEffects} />
            <Label htmlFor="sound-effects">Sound effects</Label>
          </div>
        </div>
      </div>
    </SettingsTab>
  )
}