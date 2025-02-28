import { configureStore } from '@reduxjs/toolkit'
import { TokenSlice } from './reducers'
import { BoardApiRTQ, CardApiRTQ, CardlistApiRTQ, WorkspaceApiRTQ, UserApiRTQ } from '~/api'

export const store = configureStore({
  reducer: {
    KC_TOKEN: TokenSlice.reducer,
    [BoardApiRTQ.BoardApiSlice.reducerPath]: BoardApiRTQ.BoardApiSlice.reducer,
    [WorkspaceApiRTQ.WorkspaceApiSlice.reducerPath]: WorkspaceApiRTQ.WorkspaceApiSlice.reducer,
    [CardApiRTQ.CardApiSlice.reducerPath]: CardApiRTQ.CardApiSlice.reducer,
    [CardlistApiRTQ.CardListApiSlice.reducerPath]: CardlistApiRTQ.CardListApiSlice.reducer,
    [UserApiRTQ.UserApiSlice.reducerPath]: UserApiRTQ.UserApiSlice.reducer
  },
  middleware: (getDefault) =>
    getDefault().concat(
      BoardApiRTQ.BoardApiSlice.middleware,
      WorkspaceApiRTQ.WorkspaceApiSlice.middleware,
      CardApiRTQ.CardApiSlice.middleware,
      CardlistApiRTQ.CardListApiSlice.middleware,
      UserApiRTQ.UserApiSlice.middleware
    )
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
