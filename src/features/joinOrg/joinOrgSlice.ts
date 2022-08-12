import {
  createSlice,
  createAsyncThunk,
  createSelector,
} from '@reduxjs/toolkit';
import { Transaction } from 'ethers';
import axios from 'axios';
import type { RootState } from '@/reduxStore';

import { API_URL } from '@/util/walletApiUtil';

interface PostJoinOrgResponse {
  userAddedInDb: boolean;
  userAddedInSmartContract: boolean;
  userAddContractTxn: Transaction | null;
}

export interface JoinOrgState {
  latestJoinedOrg: PostJoinOrgResponse;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null | undefined;
}

const initialState: JoinOrgState = {
  latestJoinedOrg: {
    userAddedInDb: false,
    userAddedInSmartContract: false,
    userAddContractTxn: null,
  },
  status: 'idle',
  error: null,
};

const joinOrgSlice = createSlice({
  name: 'joinOrg',
  initialState,
  reducers: {
    reset: () => {
      return initialState;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchJoinOrgById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchJoinOrgById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;
        state.latestJoinedOrg = action.payload;
      })
      .addCase(fetchJoinOrgById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { reset } = joinOrgSlice.actions;

export const fetchJoinOrgById = createAsyncThunk(
  'joinOrg/fetchJoinOrgById',
  async ({
    orgId,
    joinCode,
    jwtToken,
  }: {
    orgId: string;
    joinCode: string;
    jwtToken: string;
  }) => {
    const rawJoinResp = await axios.post<PostJoinOrgResponse>(
      `${API_URL}/org/${orgId}/join`,
      {
        joinCode,
      },
      {
        headers: {
          Authorization: jwtToken,
        },
      }
    );
    const joinResp = rawJoinResp.data;

    return joinResp;
  }
);

export const selectRoot = (state: RootState) => state.joinOrg;
export const selectLatestJoinedOrg = createSelector(
  [selectRoot],
  (root) => root.latestJoinedOrg
);
export const selectLatestJoinedOrgStatus = createSelector(
  [selectRoot],
  (root) => root.status
);

export default joinOrgSlice.reducer;
