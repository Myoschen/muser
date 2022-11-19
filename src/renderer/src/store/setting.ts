import { StateCreator } from 'zustand'
import { StoreState } from './index'

export interface Setting {
  directoryPath: string
  theme: 'light' | 'dark' | 'system'
  closeAction: 'hide' | 'quit'
}

export interface SettingSlice {
  setting: Setting
  updateSetting: (settings: Partial<Setting>) => void
}

export const createSettingSlice: StateCreator<StoreState, [], [], SettingSlice> = (set) => ({
  setting: {
    directoryPath: '',
    theme: 'system',
    closeAction: 'quit'
  },
  updateSetting: (settings): void =>
    set((state) => ({ setting: { ...state.setting, ...settings } }))
})
