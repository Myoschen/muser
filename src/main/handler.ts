import { BrowserWindow, dialog, IpcMainInvokeEvent } from 'electron'
import settings from 'electron-settings'
import { readdir } from 'fs/promises'
import { extname } from 'path'

interface Setting {
  directoryPath: string
  theme: 'light' | 'dark'
  closeAction: 'quit' | 'hide'
}

if (!settings.hasSync('app')) {
  settings.setSync({
    app: {
      directoryPath: '',
      theme: 'light',
      closeAction: 'quit'
    }
  })
}

async function readDirectory(): Promise<[string, string[]] | undefined> {
  const paths = await getDirectoryPath()
  if (!paths) {
    return undefined
  } else {
    const directoryPath = paths[0]
    await settings.set('app.directoryPath', directoryPath)
    const stored = (await settings.get('app.directoryPath')) as unknown as string
    const fileNames = (await getFileNames(stored, ['.mp3'])) as string[]
    return [directoryPath, fileNames] || undefined
  }
}

async function getDirectoryPath(): Promise<string[] | undefined> {
  return await dialog.showOpenDialogSync({ properties: ['openDirectory'] })
}

async function getAudioList(
  _event: IpcMainInvokeEvent,
  args: unknown
): Promise<string[] | undefined> {
  const fileNames = await getFileNames(args as string, ['.mp3'])
  return fileNames
}

async function getFileNames(path: string, ext: string[]): Promise<string[] | undefined> {
  if (!path) return undefined
  const fileNames = await readdir(path)
  const filteredFileNames = await fileNames.filter((f) => ext.includes(extname(f)))
  return filteredFileNames
}

function getAppSetting(): Setting {
  const setting = settings.getSync('app') as unknown as Setting
  return setting
}

async function updateAppSetting(_event: IpcMainInvokeEvent, args: unknown): Promise<void> {
  const setting = (await settings.get('app')) as unknown as Setting

  await settings.setSync({
    app: {
      directoryPath: setting.directoryPath,
      ...(args as Omit<Setting, 'directoryPath'>)
    }
  })
}

async function showMessage(
  msg: string,
  win?: Electron.BrowserWindow
): Promise<Electron.MessageBoxReturnValue> {
  if (win) return await dialog.showMessageBox(win, { title: 'Muser', message: msg })
  else return await dialog.showMessageBox({ title: 'Muser', message: msg })
}

async function closeWindow(event: IpcMainInvokeEvent): Promise<void> {
  const type = (await settings.get('app.closeAction')) as unknown as Setting['closeAction']
  const win = BrowserWindow.fromWebContents(event.sender)
  if (type === 'hide') win?.hide()
  else if (type === 'quit') win?.close()
}

const handler = {
  readDirectory,
  getAppSetting,
  getAudioList,
  showMessage,
  closeWindow,
  updateAppSetting
}

export default handler
