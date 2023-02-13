import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from './store'

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

// Selector
export const selectConfiguration = (state: RootState) => state.configuration
export const selectMusic = (state: RootState) => state.music
export const selectPlayer = (state: RootState) => state.player
