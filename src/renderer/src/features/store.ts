import { configureStore } from '@reduxjs/toolkit'
import configurationReducer from './slices/configuration'
import musicReducer from './slices/music'
import playerReducer from './slices/player'

const store = configureStore({
  reducer: {
    configuration: configurationReducer,
    music: musicReducer,
    player: playerReducer
  }
})

export default store
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
