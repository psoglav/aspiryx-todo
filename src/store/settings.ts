import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface SettingsState {
  open: boolean
}

const initialState: SettingsState = {
  open: false,
}

export const settingsSlice = createSlice({
  name: 'main',
  initialState,
  reducers: {
    setSettingsOpen: (state, action: PayloadAction<boolean>) => {
      state.open = action.payload
    },
  },
})

export const {
  setSettingsOpen,
} = settingsSlice.actions

export default settingsSlice.reducer