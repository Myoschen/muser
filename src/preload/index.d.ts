import { ElectronAPI } from '@electron-toolkit/preload'
import type { ApiTypes } from './index'

declare global {
  interface Window {
    electron: ElectronAPI
    api: ApiTypes
  }
}
