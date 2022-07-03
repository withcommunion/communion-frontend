import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '@/features/counter/counterSlice';
import postsReducer from '@/features/posts/postsSlice';
import selfReducer from '@/features/selfSlice';
import transactionsReducer from '@/features/transactions/transactionsSlice';
import organizationReducer from '@/features/organization/organizationSlice';
import cartReducer from '@/features/cart/cartSlice';

const store = configureStore({
  reducer: {
    // These are just an example
    counter: counterReducer,
    posts: postsReducer,

    self: selfReducer,
    transactions: transactionsReducer,
    organization: organizationReducer,
    cart: cartReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
