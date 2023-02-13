/* eslint-disable @typescript-eslint/no-explicit-any */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { Channel } from '../main/contants'

const api = {
  // 初始化 Muser 配置
  onSetup: (callback: (event: IpcRendererEvent, ...args: any[]) => void): void => {
    ipcRenderer.once(Channel.APP_CONFIGURATION_SETUP, callback)
  },
  onReload: (callback: (event: IpcRendererEvent, ...args: any[]) => void): void => {
    ipcRenderer.on(Channel.FS_RELOAD, callback)
  },
  removeOnReload: (callback: (event: IpcRendererEvent, ...args: any[]) => void): void => {
    ipcRenderer.removeListener(Channel.FS_RELOAD, callback)
  },
  updateConfiguration: async (args: unknown): Promise<void> =>
    await ipcRenderer.invoke(Channel.APP_CONFIGURATION_UPDATE, args),
  closeApp: async (): Promise<void> => await ipcRenderer.invoke(Channel.APP_CLOSE),
  readDirectory: async (): Promise<string | undefined> =>
    await ipcRenderer.invoke(Channel.FS_READ_DIRECTORY),
  getMusicList: async (): Promise<Music[] | undefined> =>
    await ipcRenderer.invoke(Channel.FS_GET_MUSIC_LIST)
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
