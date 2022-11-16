import { app, shell, BrowserWindow, ipcMain, nativeImage, Tray, Menu } from 'electron'
import { electronApp, optimizer, is, platform } from '@electron-toolkit/utils'
import * as path from 'path'
import handler from './handler'

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 600,
    show: false,
    resizable: false,
    autoHideMenuBar: true,
    frame: false,
    ...(platform.isLinux
      ? {
          icon: path.join(__dirname, '../../build/icon.png')
        }
      : {
          icon: path.join(__dirname, '../../build/icon.ico')
        }),
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      sandbox: false,
      webSecurity: !is.dev
    }
  })

  mainWindow.on('ready-to-show', () => {
    // Create Tray
    createTray(mainWindow)
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'))
  }

  mainWindow.webContents.once('did-finish-load', () => {
    mainWindow.webContents.send('app:init-config', handler.getConfig())
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  setIpcHandler()
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (!platform.isMacOS) {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
function setIpcHandler(): void {
  ipcMain.once('app:init-finished', (event) => {
    const win = BrowserWindow.fromWebContents(event.sender)
    win?.show()
  })
  ipcMain.handle('dialog:read-directory', handler.readDirectory)
  ipcMain.handle('music:get-track-list', handler.getTrackList)
  ipcMain.handle('app:close', handler.hideOrCloseWindow)
}

function createTray(win: BrowserWindow): void {
  const icon = nativeImage.createFromPath(path.join(__dirname, '../../build/icon.png'))
  const tray = new Tray(icon)
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Muser' },
    { type: 'separator' },
    {
      label: '版本',
      type: 'normal',
      click: (): void => {
        handler.showMessage(`當前版本為 ${app.getVersion()}`, win)
      }
    },
    {
      label: '關於',
      type: 'normal',
      click: (): void => {
        handler.showMessage('A simple music player.', win)
      }
    },
    { label: '結束', type: 'normal', role: 'quit' }
  ])
  tray.on('double-click', () => {
    win.show()
  })
  tray.setContextMenu(contextMenu)
  tray.setToolTip('Muser')
}