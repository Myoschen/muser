import create from 'zustand'

interface Config {
  directory_path: string | undefined
  theme: string | undefined
  clickX: 'hide' | 'quit'
}

interface ConfigStore extends Config {
  updateConfig: (config: Partial<Config>) => void
}

interface TrackStore {
  trackList: string[] | undefined
  currentTrack: number | undefined
  currentTrackName: string | undefined
  updateTrackList: (trackList: string[]) => void
  updateCurrentTrack: (index: number) => void
}

export const useAppConfig = create<ConfigStore>((set) => ({
  directory_path: undefined,
  theme: undefined,
  clickX: 'quit',
  updateConfig: (config): void => set((state) => ({ ...state, ...config }))
}))
export const useTrackDetail = create<TrackStore>((set) => ({
  trackList: undefined,
  currentTrack: undefined,
  currentTrackName: undefined,
  updateTrackList: (trackList): void => set((state) => ({ ...state, trackList })),
  updateCurrentTrack: (index: number): void =>
    set((state) => {
      const length = state.trackList?.length as number
      const updated = index < 0 ? length - 1 : index % length
      return {
        ...state,
        currentTrack: updated,
        currentTrackName: (state.trackList as string[])[updated]
      }
    })
}))
