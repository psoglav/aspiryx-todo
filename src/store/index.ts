import { configureStore } from '@reduxjs/toolkit'
import mainReducer from './main'
import settingsReducer from './settings'

export const store = configureStore({
  reducer: {
    main: mainReducer,
    settings: settingsReducer
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch