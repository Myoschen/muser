import create from 'zustand'
import { AudioSlice, createAudioSlice } from './createAudioSlice'
import { ConfigSlice, createConfigSlice } from './createConfigSlice'

export type StoreState = ConfigSlice & AudioSlice

const useStore = create<StoreState>((...args) => ({
  ...createAudioSlice(...args),
  ...createConfigSlice(...args)
}))

export default useStore
