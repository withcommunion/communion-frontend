import {
  createSlice,
  nanoid,
  PayloadAction,
  createAsyncThunk,
  createSelector,
} from '@reduxjs/toolkit';
import type { RootState } from '@/reduxStore';

interface Post {
  id: string;
  title: string;
  content: string;
}
interface PostsState {
  posts: Post[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null | undefined;
}

const initialState: PostsState = {
  posts: [],
  status: 'idle',
  error: null,
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    postAdded: {
      reducer(state: PostsState, action: PayloadAction<Post>) {
        state.posts.push(action.payload);
      },
      prepare(title: string, content: string) {
        return {
          payload: {
            id: nanoid(),
            title,
            content,
          },
        };
      },
    },
    postUpdated(state: PostsState, action: PayloadAction<Post>) {
      const { id, title, content } = action.payload;
      const existingPost = state.posts.find((post) => post.id === id);
      if (existingPost) {
        existingPost.title = title;
        existingPost.content = content;
      }
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Add any fetched posts to the array
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { postAdded, postUpdated } = postsSlice.actions;

const someAsyncFunction = () => {
  return Promise.resolve({
    data: {
      posts: [
        { title: 'Foo', content: 'Some content here', id: '1' },
        { title: 'Another Foo', content: 'Some more content here', id: '2' },
      ],
    },
  });
};
export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  const response = await someAsyncFunction();
  return response.data.posts as Post[];
});

export default postsSlice.reducer;

export const selectAllPosts = (state: RootState) => state.posts.posts;

// https://redux.js.org/tutorials/essentials/part-6-performance-normalization#memoizing-selector-functions
export const selectPostByIdReselect = createSelector(
  [selectAllPosts, (_, postId: string) => postId],
  (allPosts, postId) => {
    return allPosts.find((post) => post.id === postId);
  }
);
export const selectPostByIdNormal = (state: RootState, postId: string) =>
  state.posts.posts.find((post) => post.id === postId);
