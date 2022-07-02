import axios from 'axios';
import {
  createSlice,
  createAsyncThunk,
  createSelector,
} from '@reduxjs/toolkit';
import type { RootState } from '@/reduxStore';
import { ethers } from 'ethers';

import { DEV_API_URL, User } from '@/util/walletApiUtil';

// Define a type for the slice state
export interface HistoricalTxn {
  fromUser: User;
  toUser: User;
  blockNumber: string;
  timeStamp: string;
  hash: string;
  nonce: string;
  blockHash: string;
  transactionIndex: string;
  from: string;
  to: string;
  value: string;
  gas: string;
  gasPrice: string;
  isError: string;
  txreceipt_status: string;
  input: string;
  contractAddress: string;
  cumulativeGasUsed: string;
  gasUsed: string;
  confirmations: string;
}
interface TransactionsState {
  currentEthersTxn: {
    txn:
      | ethers.providers.TransactionRequest
      | ethers.providers.TransactionResponse
      | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null | undefined;
  };
  historicalTxns: {
    txns: HistoricalTxn[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null | undefined;
  };
}

// Define the initial state using that type
const initialState: TransactionsState = {
  currentEthersTxn: {
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
      })
      .addCase(fetchSelfHistoricalTxns.fulfilled, (state, action) => {
        state.historicalTxns.status = 'succeeded';
        // Add any fetched posts to the array
        state.historicalTxns.txns = action.payload;
      })
      .addCase(fetchSelfHistoricalTxns.rejected, (state, action) => {
        state.historicalTxns.status = 'failed';
        state.historicalTxns.error = action.error.message;
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

export const fetchSelfHistoricalTxns = createAsyncThunk(
  'transactions/fetchSelfHistoricalTxns',
  async ({ orgId, jwtToken }: { orgId: string; jwtToken: string }) => {
    const rawWallet = await axios.get<{ txs: HistoricalTxn[] }>(
      `${DEV_API_URL}/org/${orgId}/txs/self`,
      {
        headers: {
          Authorization: jwtToken,
        },
      }
    );
    const selfTxs = rawWallet.data;
    return selfTxs.txs;
  }
);

export default transactionsSlice.reducer;
