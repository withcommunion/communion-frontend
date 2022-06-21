import {
  createSlice,
  //   PayloadAction,
  createAsyncThunk,
  createSelector,
} from '@reduxjs/toolkit';
import axios from 'axios';
import type { RootState } from '@/reduxStore';

import { Organization, DEV_API_URL } from '@/util/walletApiUtil';

interface OrganizationState {
  org: Organization;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null | undefined;
}

const initialState: OrganizationState = {
  org: {
    name: '',
    users: [],
  },
  status: 'idle',
  error: null,
};

const organizationSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchOrg.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchOrg.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.org = action.payload;
      })
      .addCase(fetchOrg.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

// export const { } = postsSlice.actions;

export const fetchOrg = createAsyncThunk(
  'organization/fetchOrg',
  async ({ orgName, jwtToken }: { orgName: string; jwtToken: string }) => {
    const rawOrg = await axios.get<Organization>(
      `${DEV_API_URL}/organization/${orgName}`,
      {
        headers: {
          Authorization: jwtToken,
        },
      }
    );
    const organization = rawOrg.data;
    return organization;
  }
);

export default organizationSlice.reducer;

export const selectOrg = (state: RootState) => state.organization.org;
export const selectOrgStatus = (state: RootState) => state.organization.status;
export const selectOrgUsers = createSelector([selectOrg], (org) => {
  return org.users;
});
