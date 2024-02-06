/// <reference types="vite-plugin-electron/electron-env" />

declare namespace NodeJS {
  interface ProcessEnv {
    /**
     * The built directory structure
     *
     * ```tree
     * ├─┬─┬ dist
     * │ │ └── index.html
     * │ │
     * │ ├─┬ dist-electron
     * │ │ ├── main.js
     * │ │ └── preload.js
     * │
     * ```
     */
    DIST: string
    /** /dist/ or /public/ */
    VITE_PUBLIC: string
  }
}

type AppEvent = "minimize-app" | "maximize-app" | "close-app";
type AppEventHandler = (channel: AppEvent, args?: unknown[]) => void

// Used in Renderer process, expose in `preload.ts`
interface Window {
  app?: {
    emit: AppEventHandler
    ipcRenderer: Electron.IpcRenderer
  }
  isElectronApp?: boolean
}
