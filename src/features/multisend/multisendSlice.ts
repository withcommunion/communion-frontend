import axios from 'axios';
import {
  PayloadAction,
  createSlice,
  createAsyncThunk,
  createSelector,
} from '@reduxjs/toolkit';
import type { RootState } from '@/reduxStore';
import { Transaction } from 'ethers';
import { HTTPSProvider } from '@/util/avaxEthersUtil';

import { API_URL } from '@/util/walletApiUtil';

interface UserAndAmount {
  userId: string;
  amount: number;
}

interface MultisendState {
  latestTxn: {
    txn: Transaction | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null | undefined;
  };
  selectedUsersAndAmountsMap: UserAndAmount[];
}

// Define the initial state using that type
const initialState: MultisendState = {
  latestTxn: {
    txn: null,
    status: 'idle',
    error: 'null',
  },
  selectedUsersAndAmountsMap: [],
};

export const multisendSlice = createSlice({
  name: 'multisend',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    userAdded(state: MultisendState, action: PayloadAction<UserAndAmount>) {
      const userExists = state.selectedUsersAndAmountsMap.find(
        (userAndAmount) => userAndAmount.userId === action.payload.userId
      );

      if (!userExists) {
        state.selectedUsersAndAmountsMap.push(action.payload);
      }
    },
    userRemoved(state: MultisendState, action: PayloadAction<UserAndAmount>) {
      state.selectedUsersAndAmountsMap =
        state.selectedUsersAndAmountsMap.filter(
          (selectUserAndAmount) =>
            selectUserAndAmount.userId !== action.payload.userId
        );
    },
    updatedUserAmount(
      state: MultisendState,
      action: PayloadAction<UserAndAmount>
    ) {
      const updatedUser = state.selectedUsersAndAmountsMap.find(
        (userAndAmount) => userAndAmount.userId === action.payload.userId
      );

      if (updatedUser) {
        updatedUser.amount = action.payload.amount;
      }
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchMultisendFunds.pending, (state) => {
        state.latestTxn.status = 'loading';
      })
      .addCase(fetchMultisendFunds.fulfilled, (state, action) => {
        state.latestTxn.status = 'succeeded';
        // Add any fetched posts to the array
        if (action.payload) {
          state.latestTxn.error = null;
          state.latestTxn.txn = action.payload;
        }
      })
      .addCase(fetchMultisendFunds.rejected, (state, action) => {
        state.latestTxn.txn = null;
        state.latestTxn.status = 'failed';
        state.latestTxn.error = action.error.message;
      });
  },
});

export const selectUsersAndAmountsMap = (state: RootState) =>
  state.multisend.selectedUsersAndAmountsMap;

// Other code such as selectors can use the imported `RootState` type
export const selectRootLatestTxn = (state: RootState) =>
  state.multisend.latestTxn;
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

export const fetchMultisendFunds = createAsyncThunk(
  'transactions/fetchMultisendFunds',
  async ({
    toUserIdsAmount,
    orgId,
    jwtToken,
  }: {
    toUserIdsAmount: UserAndAmount[];
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
        `${API_URL}/user/self/multisend`,
        {
          orgId,
          toUserIdsAmount,
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

export const { userAdded, userRemoved, updatedUserAmount } =
  multisendSlice.actions;

export default multisendSlice.reducer;
