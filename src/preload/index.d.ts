import { ElectronAPI } from '@electron-toolkit/preload'
import type { tAPI } from './index'

declare global {
  interface Window {
    electron: ElectronAPI
    api: tAPI
  }
}
