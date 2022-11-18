import { BrowserWindow, dialog, IpcMainInvokeEvent } from 'electron'
// import Store from 'electron-store'
import settings from 'electron-settings'
import { readdir } from 'fs/promises'
import { extname } from 'path'

interface AppSetting {
  directory_path: string
  theme: string
  clickX: 'hide' | 'quit'
}

settings.configure({
  fileName: 'app-settings.json',
  prettify: true
})

settings.setSync({
  app: {
    directory_path: '',
    theme: 'light',
    clickX: 'quit'
  }
})

// const store = new Store<AppStore>()

async function readDirectory(): Promise<[string, string[]] | undefined> {
  const filePaths = getDirectoryPath()
  if (!filePaths) {
    return undefined
  } else {
    const dirPath = filePaths[0]
    await settings.set('app.directory_path', dirPath)
    const storedDirPath = settings.getSync('app.directory_path') as unknown as string
    const fileNames = (await getFileNames(storedDirPath, ['.mp3'])) as string[]
    return [dirPath, fileNames] || undefined
  }
}

function getDirectoryPath(): string[] | undefined {
  return dialog.showOpenDialogSync({ properties: ['openDirectory'] })
}

async function getAudioList(
  _event: IpcMainInvokeEvent,
  args: unknown
): Promise<string[] | undefined> {
  const fileNames = await getFileNames(args as string, ['.mp3'])
  return fileNames
}

async function getFileNames(dirPath: string, ext: string[]): Promise<string[] | undefined> {
  if (!dirPath) return undefined
  const fileNames = await readdir(dirPath)
  const filteredFileNames = await fileNames.filter((f) => ext.includes(extname(f)))
  return filteredFileNames
}

function getConfig(): AppSetting {
  const result = settings.getSync('app') as unknown as AppSetting
  return result
}

async function showMessage(
  msg: string,
  win?: Electron.BrowserWindow
): Promise<Electron.MessageBoxReturnValue> {
  if (win) return await dialog.showMessageBox(win, { title: 'Muser', message: msg })
  else return await dialog.showMessageBox({ title: 'Muser', message: msg })
}

function hideOrCloseWindow(event: IpcMainInvokeEvent): void {
  const type = settings.getSync('app.clickX') as unknown as AppSetting['clickX']
  const win = BrowserWindow.fromWebContents(event.sender)
  if (type === 'hide') win?.hide()
  else if (type === 'quit') win?.close()
}

const handler = {
  readDirectory,
  getConfig,
  getAudioList,
  showMessage,
  hideOrCloseWindow
}

export default handler
