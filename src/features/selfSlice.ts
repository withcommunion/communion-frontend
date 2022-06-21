import axios from 'axios';
import { ethers } from 'ethers';

import type { RootState } from '@/reduxStore';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { getEthersWallet } from '@/util/avaxEthersUtil';

export const DEV_API_URL =
  'https://p0rddetfk8.execute-api.us-east-1.amazonaws.com';

export interface User {
  id: string;
  email?: string;
  first_name: string;
  last_name: string;
  organization: string;
  role: 'worker' | 'manager' | 'owner' | 'seeder' | string;
  walletPrivateKeyWithLeadingHex?: string;
  walletAddressC: string;
  walletAddressP: string;
  walletAddressX: string;
}

export interface Self extends User {
  walletPrivateKeyWithLeadingHex: string;
}

// Define a type for the slice state
export interface SelfState {
  id: string;
  self: Self | null;
  wallet: {
    ethersWallet: ethers.Wallet | null;
    balance: {
      valueString: string | null;
      valueBigNumber: ethers.BigNumber | null;
      status: 'idle' | 'loading' | 'succeeded' | 'failed';
      error: string | null | undefined;
    };
  };
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null | undefined;
}

// Define the initial state using that type
const initialState: SelfState = {
  id: '',
  self: null,
  wallet: {
    ethersWallet: null,
    balance: {
      valueString: null,
      valueBigNumber: null,
      status: 'idle',
      error: null,
    },
  },
  status: 'idle',
  error: null,
};

export const userSlice = createSlice({
  name: 'self',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchSelf.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSelf.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.self = action.payload;
        state.wallet.ethersWallet = getEthersWallet(
          action.payload.walletPrivateKeyWithLeadingHex
        );
      })
      .addCase(fetchSelf.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchWalletBalance.pending, (state) => {
        state.wallet.balance.status = 'loading';
      })
      .addCase(fetchWalletBalance.fulfilled, (state, action) => {
        state.wallet.balance.status = 'succeeded';
        state.wallet.balance.valueBigNumber = action.payload;
        state.wallet.balance.valueString = ethers.utils.formatEther(
          action.payload
        );
      })
      .addCase(fetchWalletBalance.rejected, (state, action) => {
        state.wallet.balance.status = 'failed';
        state.wallet.balance.error = action.error.message;
      });
  },
});

// export const {  } = userSlice.actions;

export const fetchWalletBalance = createAsyncThunk(
  'self/fetchWalletBalance',
  async (args: {
    wallet?: ethers.Wallet;
    privateKeyWithLeadingHex?: string;
  }) => {
    const { wallet, privateKeyWithLeadingHex } = args;
    if (wallet) {
      const balanceBigNumber = await wallet.getBalance();
      return balanceBigNumber;
    } else if (privateKeyWithLeadingHex) {
      const wallet = getEthersWallet(privateKeyWithLeadingHex);
      const balanceBigNumber = await wallet.getBalance();
      return balanceBigNumber;
    } else {
      throw new Error('No wallet or private key provided');
    }
  }
);

export const fetchSelf = createAsyncThunk(
  'self/fetchSelf',
  async (jwtToken: string, { dispatch }) => {
    const rawSelf = await axios.get<Self>(`${DEV_API_URL}/user/self`, {
      headers: {
        Authorization: jwtToken,
      },
    });
    const self = rawSelf.data;

    dispatch(
      fetchWalletBalance({
        privateKeyWithLeadingHex: self.walletPrivateKeyWithLeadingHex,
      })
    );

    return self;
  }
);

export const selectSelf = (state: RootState) => state.self.self;
export const selectSelfStatus = (state: RootState) => state.self.status;

export const selectWallet = (state: RootState) => state.self.wallet;

export const selectWalletBalance = (state: RootState) =>
  state.self.wallet.balance;
export const selectWalletBalanceStatus = (state: RootState) =>
  state.self.wallet.balance.status;

export default userSlice.reducer;
