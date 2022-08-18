import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import { API_URL } from '@/util/walletApiUtil';
import type { RootState } from '@/reduxStore';

// Define a type for the slice state
interface SelfSettingsState {
  phoneNumber: string;
  allowSms: boolean;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null | undefined;
}

// Define the initial state using that type
const initialState: SelfSettingsState = {
  phoneNumber: '',
  allowSms: false,
  status: 'idle',
  error: null,
};

export const selfSettingsSlice = createSlice({
  name: 'selfSettings',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    phoneNumberUpdated: (
      state: SelfSettingsState,
      action: PayloadAction<string>
    ) => {
      state.phoneNumber = action.payload;
    },
    allowSmsUpdated: (
      state: SelfSettingsState,
      action: PayloadAction<boolean>
    ) => {
      state.allowSms = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchPatchSelf.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPatchSelf.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Add any fetched posts to the array
        if (action.payload) {
          state.error = null;
          state.allowSms = action.payload.allowSms;
          state.phoneNumber = action.payload.phoneNumber;
          // state.latestTxn.txn = action.payload;
        }
      })
      .addCase(fetchPatchSelf.rejected, (state, action) => {
        // state.latestTxn.txn = null;
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const fetchPatchSelf = createAsyncThunk(
  'selfSettings/fetchPatchSelf',
  async ({
    phoneNumber,
    allowSms,
    jwtToken,
  }: {
    phoneNumber: string;
    allowSms: boolean;
    jwtToken: string;
  }) => {
    try {
      const updateSelfResp = await axios.patch<{
        phoneNumber: string;
        allowSms: boolean;
      }>(
        `${API_URL}/user/self`,
        {
          phoneNumber,
          allowSms,
        },
        {
          headers: {
            Authorization: jwtToken,
          },
        }
      );

      return updateSelfResp.data;
      // @ts-expect-error this is okay
    } catch (error: axios.AxiosError) {
      console.error(error);
      if (axios.isAxiosError(error)) {
        /**
         * TODO: This is not ideal.  We can surface this error better on the BE
         */
        throw error.response?.data;
      }
    }
  }
);

export const { phoneNumberUpdated, allowSmsUpdated } =
  selfSettingsSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectCount = (state: RootState) => state.counter.value;

export default selfSettingsSlice.reducer;
