import { configureStore } from '@reduxjs/toolkit'
import { conversationSlice} from './slice'

// ...

const store = configureStore({
    reducer: {
        converse: conversationSlice.reducer,
    },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

export default store