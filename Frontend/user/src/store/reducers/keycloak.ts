// keycloakSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import Keycloak from 'keycloak-js'
import { RootState } from '../'

interface KeycloakState {
  keycloakInstance: Keycloak | null
  initialized: boolean
  loggedOut: boolean
}

const initialState: KeycloakState = {
  keycloakInstance: null,
  initialized: false,
  loggedOut: false
}

export const keycloakSlice = createSlice({
  name: 'keycloak',
  initialState,
  reducers: {
    setKeycloakInstance(state, action: PayloadAction<Keycloak>) {
      state.keycloakInstance = action.payload
      state.initialized = true
    },
    resetKeycloakInstance(state) {
      state.keycloakInstance = null
      state.initialized = false
      state.loggedOut = false
    },
    setLoggedOut(state) {
      state.loggedOut = true
    }
  }
})

export const { setKeycloakInstance, resetKeycloakInstance, setLoggedOut } = keycloakSlice.actions

export const selectInitialized = (state: RootState) => state.keycloak
export const selectLoggedOut = (state: RootState) => state.keycloak

export default keycloakSlice.reducer
