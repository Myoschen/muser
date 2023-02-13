import chokidar from 'chokidar'
import { BrowserWindow, dialog, IpcMainInvokeEvent } from 'electron'
import settings from 'electron-settings'
import { readdir } from 'fs/promises'
import { homedir } from 'os'
import { extname, join } from 'path'
import { Channel } from './contants'

// if setting.json not exists (first time use)
// 當 setting.json 不存在
if (!settings.hasSync('app')) {
  settings.setSync({
    app: {
      directory: join(homedir(), 'Music'),
      theme: 'light',
      closeAction: 'quit',
      defaultVolume: 0.15
    }
  })
}

let watcher: chokidar.FSWatcher | null

async function initWatcher(window: BrowserWindow) {
  const path = (await settings.get('app.directory')) as unknown as string
  if (path !== '') {
    watcher = chokidar.watch(path, { ignoreInitial: true })

    // When file is added
    // 當檔案加入
    watcher.on('add', () => {
      window.webContents.send(Channel.FS_RELOAD)
    })

    // When file is removed
    // 當檔案移除
    watcher.on('unlink', () => {
      window.webContents.send(Channel.FS_RELOAD)
    })
  }
}

function addPathToWatcher(path: string) {
  if (watcher) {
    watcher.add(path)
  }
}

function removePathFromWatcher(path: string) {
  if (watcher) {
    watcher.unwatch(path)
  }
}

async function readDirectory() {
  try {
    const paths = await getDirectory()
    if (!paths) return undefined
    const directory = paths[0]
    const oldPath = (await settings.get('app.directory')) as unknown as string
    removePathFromWatcher(oldPath)
    await settings.set('app.directory', directory)
    addPathToWatcher(directory)
    return directory
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message)
    }
    return undefined
  }
}

async function getDirectory() {
  try {
    const paths = await dialog.showOpenDialogSync({ properties: ['openDirectory'] })
    return paths
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message)
    }
    return undefined
  }
}

async function getMusicList() {
  try {
    const path = (await settings.get('app.directory')) as unknown as Configuration['directory']
    const fileNames = await getFileNames(path, ['.mp3'])
    const musicList: Music[] | undefined = fileNames?.map((fileName) => ({
      name: fileName.split('.')[0],
      src: join(path, fileName)
    }))
    return musicList
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message)
    }
    return undefined
  }
}

type FileSuffix = '.mp3' | '.mp4' | '.wav' | '.m4a' | '.flac' | '.wma' | '.aac'

async function getFileNames(path: string, suffix: FileSuffix[]) {
  if (!path) return undefined
  try {
    const fileNames = await readdir(path)
    const filteredFileNames = fileNames.filter((fileName: string) =>
      suffix.includes(extname(fileName) as FileSuffix)
    )
    return filteredFileNames
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message)
    }
    return undefined
  }
}

function getConfiguration() {
  const configuration = settings.getSync('app') as unknown as Configuration
  return configuration
}

async function updateConfiguration(_event: IpcMainInvokeEvent, args: unknown) {
  try {
    const configuration = (await settings.get('app')) as unknown as Configuration
    await settings.set({
      app: {
        ...configuration,
        ...(args as Partial<Omit<Configuration, 'directory'>>)
      }
    })
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message)
    }
  }
}

async function showMessage(message: string, window?: Electron.BrowserWindow) {
  try {
    if (window) {
      return await dialog.showMessageBox(window, { title: 'Muser', message })
    }
    return await dialog.showMessageBox({ title: 'Muser', message })
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message)
    }
    return undefined
  }
}

async function closeWindow(event: IpcMainInvokeEvent) {
  try {
    const type = (await settings.get('app.closeAction')) as unknown as Configuration['closeAction']
    const window = BrowserWindow.fromWebContents(event.sender)
    type === 'quit' ? window?.close() : window?.hide()
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message)
    }
  }
}

// TODO Minimal window
// async function minimalWindow() {}

const handler = {
  readDirectory,
  getConfiguration,
  getMusicList,
  showMessage,
  closeWindow,
  updateConfiguration,
  initWatcher
}

export default handler
