import {
  createSlice,
  createSelector,
  PayloadAction,
  nanoid,
} from '@reduxjs/toolkit';
import type { RootState } from '@/reduxStore';

import { OrgRedeemable } from '@/util/walletApiUtil';

interface OrgRedeemableInCart extends OrgRedeemable {
  id: string;
}
interface CartState {
  cart: OrgRedeemableInCart[];
}

const initialState: CartState = {
  cart: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    reset: () => {
      return initialState;
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
});

export default cartSlice.reducer;
export const { redeemableAdded, redeemableRemoved } = cartSlice.actions;

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

export const selectTotalCost = createSelector([selectCart], (cart) =>
  cart.reduce((acc, redeemable) => {
    return acc + parseInt(redeemable.amount);
  }, 0)
);
