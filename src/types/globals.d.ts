
declare global {
  type AppEvent = "minimize-app" | "maximize-app" | "close-app";
  type AppEventHandler = (channel: AppEvent, args?: unknown[]) => void

  interface Window {
    app?: {
      emit: AppEventHandler
      ipcRenderer: Electron.IpcRenderer
    }
    isElectronApp?: boolean
  }
}

export {}