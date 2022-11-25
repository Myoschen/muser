import { BrowserWindow, dialog, IpcMainInvokeEvent } from 'electron'
import settings from 'electron-settings'
import { readdir } from 'fs/promises'
import { extname, join } from 'path'
import { homedir } from 'os'
import chokidar from 'chokidar'
import { Channel } from './contants'

interface Setting {
  directoryPath: string
  theme: 'light' | 'dark'
  closeAction: 'quit' | 'hide'
  defaultVolume: number
}

/* if setting.json not exists */
if (!settings.hasSync('app')) {
  settings.setSync({
    app: {
      directoryPath: join(homedir(), 'Music'),
      theme: 'light',
      closeAction: 'quit',
      defaultVolume: 0.5
    }
  })
}

let watcher: chokidar.FSWatcher | null

async function initWatcher(window: BrowserWindow): Promise<void> {
  const path = (await settings.get('app.directoryPath')) as unknown as string
  if (path !== '') {
    watcher = chokidar.watch(path, { ignoreInitial: true })
    watcher.on('add', () => {
      window.webContents.send(Channel.FS_NEED_RELOAD)
    })
    watcher.on('unlink', () => {
      window.webContents.send(Channel.FS_NEED_RELOAD)
    })
  }
}

function addPathToWatcher(path: string, window: BrowserWindow): void {
  if (watcher) {
    watcher.add(path)
  } else {
    watcher = chokidar.watch(path, { ignoreInitial: true })
    watcher.on('add', () => {
      window.webContents.send(Channel.FS_NEED_RELOAD)
    })
    watcher.on('unlink', () => {
      window.webContents.send(Channel.FS_NEED_RELOAD)
    })
  }
}

function removePathFromWatcher(path: string): void {
  if (watcher) {
    watcher.unwatch(path)
  }
}

/**
 * It gets the directory path, sets it in the settings, gets the file names, and returns the directory
 * path and file names
 * @returns An array of strings.
 */
async function readDirectory(event: IpcMainInvokeEvent): Promise<[string, string[]] | undefined> {
  try {
    const window = BrowserWindow.fromWebContents(event.sender)
    const paths = await getDirectoryPath()
    if (!paths) return undefined
    const directoryPath = paths[0]
    const oldPath = (await settings.get('app.directoryPath')) as unknown as string
    removePathFromWatcher(oldPath)
    await settings.set('app.directoryPath', directoryPath)
    const newPath = (await settings.get('app.directoryPath')) as unknown as string
    addPathToWatcher(newPath, window!)
    const fileNames = (await getFileNames(newPath, ['.mp3'])) as string[]
    return [directoryPath, fileNames]
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message)
    }
    return undefined
  }
}

/**
 * It returns a promise that resolves to an array of strings or undefined
 * @returns An array of strings or undefined.
 */
async function getDirectoryPath(): Promise<string[] | undefined> {
  try {
    const result = await dialog.showOpenDialogSync({ properties: ['openDirectory'] })
    return result
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message)
    }
    return undefined
  }
}

/**
 * It returns a list of audio files in a given directory
 * @param {IpcMainInvokeEvent} _event - IpcMainInvokeEvent - This is the event that is passed to the
 * function.
 * @param {unknown} args - unknown
 * @returns A promise that resolves to an array of strings or undefined.
 */
async function getAudioList(
  _event: IpcMainInvokeEvent,
  args: unknown
): Promise<string[] | undefined> {
  try {
    const fileNames = await getFileNames(args as string, ['.mp3'])
    return fileNames
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message)
    }
    return undefined
  }
}

/**
 * It returns a promise that resolves to an array of file names in a given directory that have a given
 * extension
 * @param {string} path - The path to the directory you want to read.
 * @param {string[]} ext - string[] - an array of file extensions to filter by
 * @returns A Promise that resolves to an array of strings or undefined.
 */
async function getFileNames(path: string, ext: string[]): Promise<string[] | undefined> {
  if (!path) return undefined
  try {
    const fileNames = await readdir(path)
    const predicate = (f: string): boolean => ext.includes(extname(f))
    const filtered = fileNames.filter(predicate)
    return filtered
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message)
    }
    return undefined
  }
}

/**
 * It gets the app setting from the settings store
 * @returns Setting | undefined
 */
function getAppSetting(): Setting {
  const setting = settings.getSync('app') as unknown as Setting
  return setting
}

/**
 * It updates the app setting
 * @param {IpcMainInvokeEvent} _event - IpcMainInvokeEvent - This is the event that is passed to the
 * function.
 * @param {unknown} args - unknown
 */
async function updateAppSetting(_event: IpcMainInvokeEvent, args: unknown): Promise<void> {
  try {
    const setting = (await settings.get('app')) as unknown as Setting
    await settings.set({
      app: {
        directoryPath: setting.directoryPath,
        ...(args as Partial<Omit<Setting, 'directoryPath'>>)
      }
    })
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message)
    }
  }
}

/**
 * It shows a message box with the given message and title, and returns the result of the message box
 * @param {string} message - The message to display in the dialog.
 * @param [window] - The window to show the message box in.
 * @returns A promise that resolves to a MessageBoxReturnValue or undefined.
 */
async function showMessage(
  message: string,
  window?: Electron.BrowserWindow
): Promise<Electron.MessageBoxReturnValue | undefined> {
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

/**
 * It gets the value of the `app.closeAction` setting, and then either closes or hides the window
 * depending on the value
 * @param {IpcMainInvokeEvent} event - IpcMainInvokeEvent
 */
async function closeWindow(event: IpcMainInvokeEvent): Promise<void> {
  try {
    const type = (await settings.get('app.closeAction')) as unknown as Setting['closeAction']
    const window = BrowserWindow.fromWebContents(event.sender)
    type === 'quit' ? window?.close() : window?.hide()
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message)
    }
  }
}

const handler = {
  readDirectory,
  getAppSetting,
  getAudioList,
  showMessage,
  closeWindow,
  updateAppSetting,
  initWatcher
}

export default handler
