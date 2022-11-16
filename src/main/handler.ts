import { BrowserWindow, dialog, IpcMainInvokeEvent } from 'electron'
import Store from 'electron-store'
import { readdir } from 'fs/promises'
import { extname } from 'path'

interface IStore {
  directory_path: string
  theme: string
  clickX: 'hide' | 'quit'
}

const store = new Store<IStore>({
  defaults: {
    directory_path: '',
    theme: 'light',
    clickX: 'quit'
  }
})

async function readDirectory(): Promise<[string, string[]] | undefined> {
  const filePaths = getDirectoryPath()
  if (!filePaths) {
    return undefined
  } else {
    const dirPath = filePaths[0]
    store.set('directory_path', dirPath)
    const storedDirPath = store.get('directory_path')
    const fileNames = await getFileNames(storedDirPath, ['.mp3'])
    return [dirPath, fileNames] || undefined
  }
}

function getDirectoryPath(): string[] | undefined {
  return dialog.showOpenDialogSync({ properties: ['openDirectory'] })
}

async function getTrackList(_event: IpcMainInvokeEvent, args: unknown): Promise<string[]> {
  const fileNames = await getFileNames(args as string, ['.mp3'])
  return fileNames
}

async function getFileNames(dirPath: string, ext: string[]): Promise<string[]> {
  const fileNames = await readdir(dirPath)
  const filteredFileNames = await fileNames.filter((f) => ext.includes(extname(f)))
  return filteredFileNames
}

function getConfig(): IStore {
  const result = store.store
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
  const type = store.get('clickX')
  const win = BrowserWindow.fromWebContents(event.sender)
  if (type === 'hide') win?.hide()
  else if (type === 'quit') win?.close()
}

const handler = {
  readDirectory,
  getConfig,
  getTrackList,
  showMessage,
  hideOrCloseWindow
}

export default handler
