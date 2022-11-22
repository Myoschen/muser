/* eslint-disable @typescript-eslint/no-explicit-any */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { Channel } from '../main/contants'

// Custom APIs for renderer
const api = {
  onSetup: (callback: (event: IpcRendererEvent, ...args: any[]) => void): void => {
    ipcRenderer.once(Channel.APP_SETTING_SETUP, callback)
  },
  updateAppSetting: async (args: unknown): Promise<void> =>
    await ipcRenderer.invoke(Channel.APP_SETTING_UPDATE, args),
  closeApp: async (): Promise<void> => await ipcRenderer.invoke(Channel.APP_CLOSE),
  readDirectory: async (): Promise<[string, string[]] | undefined> =>
    await ipcRenderer.invoke(Channel.FS_READ_DIRECTORY),
  getAudioList: async (directoryPath: string): Promise<string[]> =>
    await ipcRenderer.invoke(Channel.FS_GET_AUDIO_LIST, directoryPath)
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}

export type API_TYPES = typeof api
