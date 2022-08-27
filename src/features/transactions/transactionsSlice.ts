import axios from 'axios';
import {
  createSlice,
  createAsyncThunk,
  createSelector,
} from '@reduxjs/toolkit';
import type { RootState } from '@/reduxStore';
import { Transaction } from 'ethers';
import { HTTPSProvider } from '@/util/avaxEthersUtil';

import { API_URL, CommunionTx } from '@/util/walletApiUtil';

interface TransactionsState {
  latestTxn: {
    txn: Transaction | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null | undefined;
  };
  historicalTxns: {
    txns: CommunionTx[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null | undefined;
  };
}

// Define the initial state using that type
const initialState: TransactionsState = {
  latestTxn: {
    txn: null,
    status: 'idle',
    error: 'null',
  },
  historicalTxns: { txns: [], status: 'idle', error: null },
};

export const transactionsSlice = createSlice({
  name: 'transactions',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchSelfHistoricalTxns.pending, (state) => {
        state.historicalTxns.status = 'loading';
        state.historicalTxns.txns = [];
      })
      .addCase(fetchSelfHistoricalTxns.fulfilled, (state, action) => {
        state.historicalTxns.status = 'succeeded';
        // Add any fetched posts to the array
        state.historicalTxns.txns = action.payload;
      })
      .addCase(fetchSelfHistoricalTxns.rejected, (state, action) => {
        state.historicalTxns.status = 'failed';
        state.historicalTxns.error = action.error.message;
      })
      .addCase(fetchSelfTransferFunds.pending, (state) => {
        state.latestTxn.status = 'loading';
      })
      .addCase(fetchSelfTransferFunds.fulfilled, (state, action) => {
        state.latestTxn.status = 'succeeded';
        // Add any fetched posts to the array
        if (action.payload) {
          state.latestTxn.error = null;
          state.latestTxn.txn = action.payload;
        }
      })
      .addCase(fetchSelfTransferFunds.rejected, (state, action) => {
        state.latestTxn.txn = null;
        state.latestTxn.status = 'failed';
        state.latestTxn.error = action.error.message;
      });
  },
});

// export const { } = transactionsSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectRootHistoricalTxns = (state: RootState) =>
  state.transactions.historicalTxns;
export const selectHistoricalTxns = (state: RootState) =>
  state.transactions.historicalTxns.txns;
export const selectHistoricalTxnsStatus = (state: RootState) =>
  state.transactions.historicalTxns.status;
export const reSelectHistoricalTxnsStatus = createSelector(
  [selectRootHistoricalTxns],
  (root) => {
    return root.status;
  }
);

export const selectRootLatestTxn = (state: RootState) =>
  state.transactions.latestTxn;
export const selectLatestTxn = createSelector(
  [selectRootLatestTxn],
  (latestTxn) => latestTxn.txn
);
export const selectLatestTxnStatus = createSelector(
  [selectRootLatestTxn],
  (latestTxn) => latestTxn.status
);
export const selectLatestTxnErrorMessage = createSelector(
  [selectRootLatestTxn],
  (latestTxn) => latestTxn.error
);

export const fetchSelfTransferFunds = createAsyncThunk(
  'transactions/fetchSelfTransferFunds',
  async ({
    toUserId,
    orgId,
    amount,
    jwtToken,
  }: {
    toUserId: string;
    amount: number;
    orgId: string;
    jwtToken: string;
  }) => {
    const waitXSeconds = (seconds: number) =>
      new Promise((resolve) => setTimeout(resolve, seconds * 1000));
    try {
      const txnResp = await axios.post<{
        transaction: Transaction;
        txnHash: string;
      }>(
        `${API_URL}/user/self/transfer`,
        {
          orgId,
          toUserId,
          amount,
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
      if (ethersTxn) {
        await ethersTxn.wait();
      }
      return txnResp.data.transaction;
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
        if (errorFromBlockchain) {
          throw new Error(errorFromBlockchain);
        } else {
          throw error.response?.data;
        }
      }
    }
  }
);

export const fetchSelfHistoricalTxns = createAsyncThunk(
  'transactions/fetchSelfHistoricalTxns',
  async (
    { orgId, jwtToken }: { orgId: string; jwtToken: string },
    { getState }
  ) => {
    const state = getState() as RootState;
    const managerMode = state.organization.managerMode;

    const isManagerModeAvailable = managerMode.isAvailable;
    const isManagerModeActive = isManagerModeAvailable && managerMode.isActive;

    const rawTxsResp = await axios.get<{ txs: CommunionTx[] }>(
      `${API_URL}/user/self/txs`,
      {
        headers: {
          Authorization: jwtToken,
        },
        params: {
          orgId,
          isManagerMode: isManagerModeActive,
        },
      }
    );

    const selfTxs = rawTxsResp.data;
    return selfTxs.txs;
  }
);

export default transactionsSlice.reducer;
