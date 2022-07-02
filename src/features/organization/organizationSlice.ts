import {
  createSlice,
  createAsyncThunk,
  createSelector,
} from '@reduxjs/toolkit';
import axios from 'axios';
import type { RootState } from '@/reduxStore';

import { DEV_API_URL, OrgWithPublicData } from '@/util/walletApiUtil';

interface OrganizationState {
  org: OrgWithPublicData;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null | undefined;
}

const initialState: OrganizationState = {
  org: {
    id: '',
    actions: [],
    redeemables: [],
    roles: [],
    member_ids: [],
    members: [],
  },
  status: 'idle',
  error: null,
};

const organizationSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    reset: () => {
      return initialState;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchOrgById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchOrgById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.org = action.payload;
      })
      .addCase(fetchOrgById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { reset } = organizationSlice.actions;

export const fetchOrgById = createAsyncThunk(
  'organization/fetchOrgById',
  async ({ orgId, jwtToken }: { orgId: string; jwtToken: string }) => {
    const rawOrg = await axios.get<OrgWithPublicData>(
      `${DEV_API_URL}/org/${orgId}`,
      {
        headers: {
          Authorization: jwtToken,
        },
      }
    );
    const org = rawOrg.data;
    return org;
  }
);

export default organizationSlice.reducer;

export const selectOrgStatus = (state: RootState) => state.organization.status;
export const selectOrg = (state: RootState) => state.organization.org;
export const selectOrgUsers = createSelector([selectOrg], (org) => {
  return org.members;
});
export const selectOrgRedeemables = createSelector([selectOrg], (org) => {
  return org.redeemables;
});
