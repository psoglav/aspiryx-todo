import { useContext } from "react";
import './index.css'
import { SettingsContext } from "@/components/settings";

export function FancyNoise() {
  const settings = useContext(SettingsContext)
  if (!settings.enableFancyNoise) return null
  return (
    <div id="fancy-noise"></div>
  )
}
