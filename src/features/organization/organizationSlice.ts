import {
  createSlice,
  createAsyncThunk,
  createSelector,
  ThunkDispatch,
  AnyAction,
} from '@reduxjs/toolkit';
import { Contract, utils, BigNumber } from 'ethers';
import axios from 'axios';
import type { RootState } from '@/reduxStore';
import contractAbi from '../../contractAbi/jacksPizza/JacksPizzaOrg.json';

import { DEV_API_URL, OrgWithPublicData } from '@/util/walletApiUtil';
import { HTTPSProvider } from '@/util/avaxEthersUtil';

export interface OrganizationState {
  org: OrgWithPublicData;
  userToken: {
    balance: {
      valueString: string | null;
      tokenSymbol: string;
      status: 'idle' | 'loading' | 'succeeded' | 'failed';
      error: string | null | undefined;
    };
  };
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
    avax_contract: {
      address: '',
      token_name: '',
      token_symbol: '',
    },
  },
  userToken: {
    balance: {
      valueString: null,
      tokenSymbol: '',
      status: 'idle',
      error: null,
    },
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
        state.userToken.balance.tokenSymbol =
          action.payload.avax_contract.token_symbol;
      })
      .addCase(fetchOrgById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchOrgTokenBalance.pending, (state) => {
        state.userToken.balance.status = 'loading';
      })
      .addCase(fetchOrgTokenBalance.fulfilled, (state, action) => {
        state.userToken.balance.status = 'succeeded';
        state.userToken.balance.valueString = action.payload;
      })
      .addCase(fetchOrgTokenBalance.rejected, (state, action) => {
        state.userToken.balance.status = 'failed';
        state.userToken.balance.error = action.error.message;
      });
  },
});

export const { reset } = organizationSlice.actions;

export const fetchOrgById = createAsyncThunk(
  'organization/fetchOrgById',
  async (
    { orgId, jwtToken }: { orgId: string; jwtToken: string },
    { getState, dispatch }
  ) => {
    const rawOrg = await axios.get<OrgWithPublicData>(
      `${DEV_API_URL}/org/${orgId}`,
      {
        headers: {
          Authorization: jwtToken,
        },
      }
    );
    const org = rawOrg.data;

    fetchUpdateTokenBalanceHelper(getState as () => RootState, dispatch);

    return org;
  }
);

export const fetchOrgTokenBalance = createAsyncThunk(
  'organization/fetchOrgTokenBalance',
  async (args: { contract: Contract }, thunkApi) => {
    const { contract } = args;
    // @ts-expect-error This is what it is
    const { getState }: { getState: () => RootState } = thunkApi;

    const selfAddressC = getState().self?.self?.walletAddressC;
    if (!selfAddressC) {
      return null;
    }

    // eslint-disable-next-line
    const balanceBigNumber = (await contract.getBalanceOf(
      selfAddressC
    )) as BigNumber;

    return utils.formatUnits(balanceBigNumber, 'wei');
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

export const selectOrgContract = createSelector([selectOrg], (org) => {
  if (!org.avax_contract || !org.avax_contract.address) {
    return null;
  }

  return new Contract(
    org.avax_contract.address,
    contractAbi.abi,
    HTTPSProvider
  );
});

export const selectOrgUserToken = (state: RootState) =>
  state.organization.userToken;

export const selectOrgUserTokenStatus = (state: RootState) =>
  state.organization.userToken.balance.status;

export const selectOrgUserTokenBalance = createSelector(
  [selectOrgUserToken],
  (token) => token.balance
);

export const fetchUpdateTokenBalanceHelper = (
  getState: () => RootState,
  dispatch: ThunkDispatch<unknown, unknown, AnyAction>
) => {
  const { organization } = getState();
  const contract = new Contract(
    organization.org.avax_contract.address,
    contractAbi.abi,
    HTTPSProvider
  );
  dispatch(fetchOrgTokenBalance({ contract }));
};
