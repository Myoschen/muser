import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type Status = 'stop' | 'playing'
type Repeat = 'off' | 'once' | 'all'

export interface PlayerState {
  musicId: number
  status: Status
  duration: number
  volume: number
  currentLocation: number
  repeatType: Repeat
}

const initialState: PlayerState = {
  musicId: 0,
  status: 'stop',
  duration: 0,
  volume: 0.15,
  currentLocation: 0,
  repeatType: 'off'
}

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    setMusicId(state, action: PayloadAction<number>) {
      state.musicId = action.payload
    },
    setPlayerStatus(state, action: PayloadAction<Status>) {
      state.status = action.payload
    },
    setDuration(state, action: PayloadAction<number>) {
      state.duration = action.payload
    },
    setCurrentLocation(state, action: PayloadAction<number>) {
      state.currentLocation = action.payload
    },
    setVolume(state, action: PayloadAction<number>) {
      state.volume = action.payload
    },
    setRepeatType(state) {
      const stateMachine: Record<Repeat, Repeat> = {
        off: 'once',
        once: 'all',
        all: 'off'
      }
      state.repeatType = stateMachine[state.repeatType]
    }
  }
})

export const {
  setMusicId,
  setCurrentLocation,
  setDuration,
  setPlayerStatus,
  setVolume,
  setRepeatType
} = playerSlice.actions
export default playerSlice.reducer
