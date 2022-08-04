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

import { API_URL, User, postToLogTxnError } from '@/util/walletApiUtil';

export interface UserAndAmount {
  user: User;
  amount: number;
}

interface MultisendState {
  latestTxn: {
    txn: Transaction | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null | undefined;
  };
  selectedUsersAndAmounts: UserAndAmount[];
  baseAmount: number;
}

// Define the initial state using that type
const initialState: MultisendState = {
  latestTxn: {
    txn: null,
    status: 'idle',
    error: 'null',
  },
  selectedUsersAndAmounts: [],
  baseAmount: 0,
};

export const multisendSlice = createSlice({
  name: 'multisend',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    baseAmountUpdated: (
      state: MultisendState,
      action: PayloadAction<number>
    ) => {
      const baseAmount = action.payload;
      state.baseAmount = baseAmount;
      state.selectedUsersAndAmounts = state.selectedUsersAndAmounts.map(
        (selectedUserAndAmount) => ({
          ...selectedUserAndAmount,
          amount: baseAmount,
        })
      );
    },
    userAdded(state: MultisendState, action: PayloadAction<UserAndAmount>) {
      const userExists = state.selectedUsersAndAmounts.find(
        (userAndAmount) => userAndAmount.user.id === action.payload.user.id
      );

      if (!userExists) {
        const { user, amount } = action.payload;
        state.selectedUsersAndAmounts.push({
          user,
          amount: amount || state.baseAmount,
        });
      }
    },
    userRemoved(
      state: MultisendState,
      action: PayloadAction<{ userId: string }>
    ) {
      state.selectedUsersAndAmounts = state.selectedUsersAndAmounts.filter(
        (selectUserAndAmount) =>
          selectUserAndAmount.user.id !== action.payload.userId
      );
    },
    clearedUsers(state: MultisendState) {
      state.selectedUsersAndAmounts = [];
    },
    updatedUserAmount(
      state: MultisendState,
      action: PayloadAction<UserAndAmount>
    ) {
      const updatedUser = state.selectedUsersAndAmounts.find(
        (userAndAmount) => userAndAmount.user.id === action.payload.user.id
      );

      if (updatedUser) {
        updatedUser.amount = action.payload.amount;
      }
    },
    clearedLatestTxn(state: MultisendState) {
      state.latestTxn = initialState.latestTxn;
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

export const selectUsersAndAmounts = (state: RootState) =>
  state.multisend.selectedUsersAndAmounts;
export const selectTotalAmountSending = createSelector(
  [selectUsersAndAmounts],
  (usersAndAmount) =>
    usersAndAmount.reduce(
      (total, userAndAmount) => total + userAndAmount.amount,
      0
    )
);

export const selectBaseAmount = (state: RootState) =>
  state.multisend.baseAmount;

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
    toUsersAndAmounts,
    orgId,
    jwtToken,
  }: {
    toUsersAndAmounts: UserAndAmount[];
    orgId: string;
    jwtToken: string;
  }) => {
    const waitXSeconds = (seconds: number) =>
      new Promise((resolve) => setTimeout(resolve, seconds * 1000));

    const toUserIdAndAmountObjs = toUsersAndAmounts.map((userAndAmount) => ({
      userId: userAndAmount.user.id,
      amount: userAndAmount.amount,
    }));
    try {
      const txnResp = await axios.post<{
        transaction: Transaction;
        txnHash: string;
      }>(
        `${API_URL}/user/self/multisend`,
        {
          orgId,
          toUserIdAndAmountObjs,
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

        // const errorMessage = { errorFromBlockchain };
        if (errorFromBlockchain) {
          postToLogTxnError('multisend', errorFromBlockchain, jwtToken);
          throw new Error(errorFromBlockchain);
        } else {
          const errorMessage =
            (error.response?.data as string) || 'Unknown error';
          postToLogTxnError('multisend', errorMessage, jwtToken);
          throw error.response?.data;
        }
      }
    }
  }
);

export const {
  clearedLatestTxn,
  baseAmountUpdated,
  userAdded,
  userRemoved,
  updatedUserAmount,
  clearedUsers,
} = multisendSlice.actions;

export default multisendSlice.reducer;
