import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import { RootState } from '../'

export interface ExampleState {
  acessToken: string
}

const initialState: ExampleState = {
  acessToken: ''
}
export const TokenSlice = createSlice({
  name: 'KC_TOKEN',
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.acessToken = action.payload
    }
  }
})

export const selectExample = (state: RootState) => state.KC_TOKEN

export default TokenSlice
