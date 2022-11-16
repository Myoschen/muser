/* eslint-disable @typescript-eslint/no-explicit-any */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  readDirectory: async (): Promise<[string, string[]] | undefined> =>
    await ipcRenderer.invoke('dialog:read-directory'),
  closeApp: async (): Promise<void> => await ipcRenderer.invoke('app:close'),
  getTrackList: async (dirPath: string): Promise<string[]> =>
    await ipcRenderer.invoke('music:get-track-list', dirPath),
  onSetup: (callback: (event: IpcRendererEvent, ...args: any[]) => void): void => {
    ipcRenderer.once('app:init-config', callback)
  }
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

export type tAPI = typeof api
