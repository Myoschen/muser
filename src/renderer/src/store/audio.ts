import { StateCreator } from 'zustand'
import { StoreState } from './index'

export interface AudioSlice {
  audioList: string[] | undefined
  currentAudio: number | undefined
  currentAudioName: string | undefined
  updateAudioList: (list: string[]) => void
  updateCurrentAudio: (index: number) => void
}

export const createAudioSlice: StateCreator<StoreState, [], [], AudioSlice> = (set) => ({
  audioList: undefined,
  currentAudio: undefined,
  currentAudioName: undefined,
  updateAudioList: (list): void => set((state) => ({ ...state, audioList: list })),
  updateCurrentAudio: (index: number): void =>
    set((state) => {
      const length = state.audioList?.length as number
      const updated = index < 0 ? length - 1 : index % length
      return {
        ...state,
        currentAudio: updated,
        currentAudioName: (state.audioList as string[])[updated]
      }
    })
})
