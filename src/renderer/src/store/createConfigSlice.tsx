import { StateCreator } from 'zustand'
import { StoreState } from './index'

export interface Config {
  directory_path: string | undefined
  theme: string | undefined
  clickX: 'hide' | 'quit'
}

export interface ConfigSlice extends Config {
  updateConfig: (config: Partial<Config>) => void
}

export const createConfigSlice: StateCreator<StoreState, [], [], ConfigSlice> = (set) => ({
  directory_path: undefined,
  theme: undefined,
  clickX: 'quit',
  updateConfig: (config): void => set((state) => ({ ...state, ...config }))
})
