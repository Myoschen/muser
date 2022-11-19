import create from 'zustand'
import { AudioSlice, createAudioSlice } from './audio'
import { SettingSlice, createSettingSlice } from './setting'

export type StoreState = SettingSlice & AudioSlice

const useStore = create<StoreState>((...args) => ({
  ...createAudioSlice(...args),
  ...createSettingSlice(...args)
}))

export default useStore
export type { Setting } from './setting'
