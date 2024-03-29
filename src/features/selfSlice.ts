import axios from 'axios';

import type { RootState } from '@/reduxStore';
import {
  createSlice,
  createAsyncThunk,
  createSelector,
} from '@reduxjs/toolkit';

import { API_URL, CommunionNft, Self } from '@/util/walletApiUtil';
import { selectAvailableNfts } from './organization/organizationSlice';

// Define a type for the slice state
export interface SelfState {
  id: string;
  self: Self | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null | undefined;
}

// Define the initial state using that type
const initialState: SelfState = {
  id: '',
  self: null,
  status: 'idle',
  error: null,
};

export const userSlice = createSlice({
  name: 'self',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    reset: () => {
      return initialState;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchSelf.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSelf.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.self = action.payload;
      })
      .addCase(fetchSelf.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { reset } = userSlice.actions;

export const fetchSelf = createAsyncThunk(
  'self/fetchSelf',
  async (jwtToken: string) => {
    const rawSelf = await axios.get<Self>(`${API_URL}/user/self`, {
      headers: {
        Authorization: jwtToken,
      },
    });
    const self = rawSelf.data;

    return self;
  }
);

export const selectRootSelf = (state: RootState) => state.self;
export const selectSelf = createSelector([selectRootSelf], (root) => root.self);
export const selectSelfStatus = createSelector(
  [selectRootSelf],
  (root) => root.status
);
export const selectSelfOwnedNfts = createSelector(
  [selectRootSelf],
  (root) => root.self?.owned_nfts || []
);
export const selectOwnedNftsInCurrentOrg = createSelector(
  [selectSelfOwnedNfts, selectAvailableNfts],
  (ownedNfts, availableNftsInOrg) => {
    const ownedCommunionNfts = ownedNfts
      .map((nft) => {
        const nftInOrg = (availableNftsInOrg || []).find(
          (orgNft) => orgNft.id === nft.communionNftId
        );
        return nftInOrg;
      })
      .filter((nft) => nft !== undefined) as CommunionNft[];

    return ownedCommunionNfts;
  }
);

export default userSlice.reducer;
