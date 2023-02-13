import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface MusicState {
  list: Music[]
}

const initialState: MusicState = {
  list: []
}

const musicSlice = createSlice({
  name: 'music',
  initialState,
  reducers: {
    updateMusicList: (state, action: PayloadAction<Music[]>) => {
      state.list = action.payload
    }
  }
})

export const { updateMusicList } = musicSlice.actions
export default musicSlice.reducer
