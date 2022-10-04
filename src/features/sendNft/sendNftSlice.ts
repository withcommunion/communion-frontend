import axios from 'axios';
import {
  PayloadAction,
  createSlice,
  createAsyncThunk,
  createSelector,
} from '@reduxjs/toolkit';
import type { RootState } from '@/reduxStore';
import { HTTPSProvider } from '@/util/avaxEthersUtil';

import {
  API_URL,
  User,
  postToLogTxnError,
  CommunionNft,
  MintedNftDetails,
} from '@/util/walletApiUtil';

interface SendNftState {
  latestTxn: {
    txn: MintedNftDetails | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null | undefined;
  };
  selectedUser: User | null;
  selectedNft: CommunionNft | null;
}

// Define the initial state using that type
const initialState: SendNftState = {
  latestTxn: {
    txn: null,
    status: 'idle',
    error: 'null',
  },
  selectedUser: null,
  selectedNft: null,
};

export const sendNftSlice = createSlice({
  name: 'sendNft',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    reset: () => {
      return initialState;
    },
    selectedUserUpdated: (state: SendNftState, action: PayloadAction<User>) => {
      state.selectedUser = action.payload;
    },
    clearedSelectedUser(state: SendNftState) {
      state.selectedUser = null;
    },
    selectedNftUpdated: (
      state: SendNftState,
      action: PayloadAction<CommunionNft>
    ) => {
      state.selectedNft = action.payload;
    },
    clearedSelectedNft(state: SendNftState) {
      state.selectedNft = null;
    },
    clearedLatestTxn(state: SendNftState) {
      state.latestTxn = initialState.latestTxn;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchSendNft.pending, (state) => {
        state.latestTxn.status = 'loading';
      })
      .addCase(fetchSendNft.fulfilled, (state, action) => {
        state.latestTxn.status = 'succeeded';
        // state.latestTxn.txn = action.payload;
        // Add any fetched posts to the array
        if (action.payload) {
          state.latestTxn.error = null;
          state.latestTxn.txn = action.payload;
        }
      })
      .addCase(fetchSendNft.rejected, (state, action) => {
        state.latestTxn.txn = null;
        state.latestTxn.status = 'failed';
        state.latestTxn.error = action.error.message;
      });
  },
});

export const fetchSendNft = createAsyncThunk(
  'sendNft/fetchSendNft',
  async ({
    communionNftId,
    toUserId,
    orgId,
    jwtToken,
  }: {
    communionNftId: string;
    toUserId: string;
    orgId: string;
    jwtToken: string;
  }) => {
    const waitXSeconds = (seconds: number) =>
      new Promise((resolve) => setTimeout(resolve, seconds * 1000));

    try {
      const txnResp = await axios.post<{
        success: boolean;
        mintedNft: MintedNftDetails;
        txnHash: string;
      }>(
        `${API_URL}/org/${orgId}/mintNft`,
        {
          communionNftId,
          toUserId,
        },
        {
          headers: {
            Authorization: jwtToken,
          },
        }
      );

      /**
       * TODO: This is janky, how does uniswap or other handle this?
       * We will want some retry logic to consistently
       */
      await waitXSeconds(3.5);
      const ethersTxn = await HTTPSProvider.getTransaction(
        txnResp.data.txnHash
      );
      await ethersTxn.wait();
      return txnResp.data.mintedNft;
      // @ts-expect-error this is okay
    } catch (error: axios.AxiosError) {
      console.error(error);
      if (axios.isAxiosError(error)) {
        /**
         * TODO: This is not ideal.  We can surface this error better on the BE
         */
        // @ts-expect-error this is okay for now.
        // eslint-disable-next-line
        const errorFromBlockchain = error.response?.data?.error?.error
          ?.reason as string;

        // const errorMessage = { errorFromBlockchain };
        if (errorFromBlockchain) {
          postToLogTxnError('mintNft', errorFromBlockchain, jwtToken);
          throw new Error(errorFromBlockchain);
        } else {
          const errorMessage =
            (error.response?.data as string) || 'Unknown error';
          postToLogTxnError('mintNft', errorMessage, jwtToken);
          throw error.response?.data;
        }
      }
    }
  }
);

export const selectSelectedNft = (state: RootState) =>
  state.sendNft.selectedNft;
export const selectSelectedUser = (state: RootState) =>
  state.sendNft.selectedUser;

export const selectRootLatestTxn = (state: RootState) =>
  state.sendNft.latestTxn;
export const selectLatestTxn = createSelector(
  [selectRootLatestTxn],
  (multisend) => multisend.txn
);
export const selectLatestTxnStatus = createSelector(
  [selectRootLatestTxn],
  (multisend) => multisend.status
);
export const selectLatestTxnErrorMessage = createSelector(
  [selectRootLatestTxn],
  (multisend) => multisend.error
);

export const {
  selectedUserUpdated,
  clearedSelectedUser,
  selectedNftUpdated,
  clearedSelectedNft,
  clearedLatestTxn,
} = sendNftSlice.actions;

export default sendNftSlice.reducer;
