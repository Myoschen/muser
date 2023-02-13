import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface ConfigurationState {
  configuration: Configuration
}

const initialState: ConfigurationState = {
  configuration: {
    directory: '',
    theme: 'light',
    closeAction: 'quit',
    defaultVolume: 0.15
  }
}

const configurationSlice = createSlice({
  name: 'configuration',
  initialState,
  reducers: {
    updateConfiguration: (state, action: PayloadAction<Partial<Configuration>>) => {
      state.configuration = { ...state.configuration, ...action.payload }
    }
  }
})

export const { updateConfiguration } = configurationSlice.actions
export default configurationSlice.reducer
