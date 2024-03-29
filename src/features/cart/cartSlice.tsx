import axios from 'axios';
import { Transaction } from 'ethers';
import {
  createSlice,
  createSelector,
  PayloadAction,
  nanoid,
  createAsyncThunk,
} from '@reduxjs/toolkit';
import type { RootState } from '@/reduxStore';
import { fetchOrgTokenBalance } from '@/features/organization/organizationSlice';

import {
  OrgRedeemable,
  API_URL,
  postToLogTxnError,
} from '@/util/walletApiUtil';
import { HTTPSProvider } from '@/util/avaxEthersUtil';

export interface OrgRedeemableInCart extends OrgRedeemable {
  id: string;
}
interface CartState {
  cart: OrgRedeemableInCart[];
  latestRedeemTxn: {
    txn: Transaction | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null | undefined;
  };
}

const initialState: CartState = {
  cart: [],
  latestRedeemTxn: {
    txn: null,
    status: 'idle',
    error: null,
  },
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    reset: () => {
      return initialState;
    },
    clearedLatestRedeemTxn(state: CartState) {
      state.latestRedeemTxn = initialState.latestRedeemTxn;
    },
    clearedRedeemables(state: CartState) {
      state.cart = initialState.cart;
    },
    redeemableAdded: {
      reducer(state: CartState, action: PayloadAction<OrgRedeemableInCart>) {
        state.cart.push(action.payload);
      },
      prepare(orgRedeemable: OrgRedeemable) {
        return {
          payload: {
            id: nanoid(),
            amount: orgRedeemable.amount,
            name: orgRedeemable.name,
            allowed_roles: orgRedeemable.allowed_roles,
          },
        };
      },
    },
    redeemableRemoved(
      state: CartState,
      action: PayloadAction<OrgRedeemableInCart>
    ) {
      state.cart = state.cart.filter(
        (redeemable) => redeemable.id !== action.payload.id
      );
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchOrgRedeem.pending, (state) => {
        state.latestRedeemTxn.status = 'loading';
      })
      .addCase(fetchOrgRedeem.fulfilled, (state, action) => {
        state.latestRedeemTxn.status = 'succeeded';
        // Add any fetched posts to the array
        if (action.payload) {
          state.latestRedeemTxn.error = null;
          state.latestRedeemTxn.txn = action.payload;
        }
      })
      .addCase(fetchOrgRedeem.rejected, (state, action) => {
        state.latestRedeemTxn.txn = null;
        state.latestRedeemTxn.status = 'failed';
        state.latestRedeemTxn.error = action.error.message;
      });
  },
});

export default cartSlice.reducer;
export const {
  reset,
  redeemableAdded,
  redeemableRemoved,
  clearedRedeemables,
  clearedLatestRedeemTxn,
} = cartSlice.actions;

export const selectCartFromStore = (state: RootState) => state.cart;
export const selectCart = createSelector([selectCartFromStore], (cart) => {
  return cart.cart;
});
export const selectCartReverse = createSelector(
  [selectCartFromStore],
  (cart) => {
    return [...cart.cart].reverse();
  }
);

export const selectRootLatestRedeemTxn = (state: RootState) =>
  state.cart.latestRedeemTxn;
export const selectLatestRedeemTxn = createSelector(
  [selectRootLatestRedeemTxn],
  (latestRedeemTxn) => latestRedeemTxn.txn
);
export const selectLatestRedeemTxnStatus = createSelector(
  [selectRootLatestRedeemTxn],
  (latestRedeemTxn) => latestRedeemTxn.status
);
export const selectLatestRedeemTxnErrorMessage = createSelector(
  [selectRootLatestRedeemTxn],
  (latestRedeemTxn) => latestRedeemTxn.error
);

export const selectTotalCost = createSelector([selectCart], (cart) =>
  cart.reduce((acc, redeemable) => {
    return acc + parseInt(redeemable.amount);
  }, 0)
);

export const fetchOrgRedeem = createAsyncThunk(
  'cart/fetchOrgRedeem',
  async (
    {
      amount,
      message,
      orgId,
      jwtToken,
    }: {
      amount: number;
      message: string;
      orgId: string;
      jwtToken: string;
    },
    { getState, dispatch }
  ) => {
    const waitXSeconds = (seconds: number) =>
      new Promise((resolve) => setTimeout(resolve, seconds * 1000));

    try {
      const txnResp = await axios.post<{
        transaction: Transaction;
        txnHash: string;
      }>(
        `${API_URL}/org/${orgId}/redeem`,
        {
          amount,
          message,
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

      const { organization, self } = getState() as RootState;

      dispatch(
        fetchOrgTokenBalance({
          contractAddress: organization.org.avax_contract.address,
          walletAddress: self.self?.walletAddressC || '',
        })
      );

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
          postToLogTxnError('redeem', errorFromBlockchain, jwtToken);
          throw new Error(errorFromBlockchain);
        } else {
          const errorMessage =
            (error.response?.data as string) || 'Unknown error';
          postToLogTxnError('redeem', errorMessage, jwtToken);
          throw error.response?.data;
        }
      }
    }
  }
);
