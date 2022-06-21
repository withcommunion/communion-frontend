import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '@/features/counter/counterSlice';
import postsReducer from '@/features/posts/postsSlice';
import selfReducer from '@/features/selfSlice';
import transactionsReducer from '@/features/transactions/transactionsSlice';
import organizationReducer from '@/features/organization/organizationSlice';

const store = configureStore({
  reducer: {
    counter: counterReducer,
    posts: postsReducer,
    self: selfReducer,
    transactions: transactionsReducer,
    organization: organizationReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
