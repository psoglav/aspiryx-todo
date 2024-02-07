import { PluginOption, defineConfig } from "vite"
import path from "node:path"
import react from "@vitejs/plugin-react"
import electron from 'vite-plugin-electron/simple'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const plugins: PluginOption[] = [
    react(),
    tsconfigPaths(),
  ]

  if (mode === 'electron') {
    plugins.push(electron({
      main: {
        entry: 'electron/main.ts',
      },
      preload: {
        input: path.join(__dirname, 'electron/preload.ts'),
      },
    }))
  }

  return {
    plugins,
  }
})
