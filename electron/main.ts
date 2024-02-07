import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'node:path'
import { getBounds, saveBounds } from './settings'

process.env.DIST = path.join(__dirname, '../dist')
process.env.VITE_PUBLIC = app.isPackaged ? process.env.DIST : path.join(process.env.DIST, '../public')


let win: BrowserWindow | null
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(__dirname, '../electron/icons/icon.png'),
    minWidth: 320,
    minHeight: 480,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
    titleBarStyle: 'hidden',
    ...(!app.isPackaged ? { icon: path.join(__dirname, '../electron/resources/icon.png') } : {}),
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    win.loadFile(path.join(process.env.DIST!, 'index.html'))
  }

  const bounds = getBounds()

  if (bounds) {
    win?.setBounds({
      x: bounds[0],
      y: bounds[1],
      width: bounds[2],
      height: bounds[3],
    })
  }
}

app
  .whenReady()
  .then(() => {
    createWindow()

    ipcMain.on("minimize-app", () => {
      win?.minimize();
    });

    ipcMain.on("maximize-app", () => {
      if (win?.isMaximized()) {
        win?.unmaximize();
      } else {
        win?.maximize();
      }
    });

    ipcMain.on("close-app", () => {
      win?.close();
    });

    win?.addListener('resized', () => {
      saveBounds(win?.getBounds())
    })

    app.on("activate", () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (win === null) createWindow();
    });

    // Quit when all windows are closed, except on macOS. There, it's common
    // for applications and their menu bar to stay active until the user quits
    // explicitly with Cmd + Q.
    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit()
        win = null
      }
    })
  })
