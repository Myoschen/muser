import { ElectronAPI } from '@electron-toolkit/preload'
import type { API_TYPES } from './index'

declare global {
  interface Window {
    electron: ElectronAPI
    api: API_TYPES
  }
}
