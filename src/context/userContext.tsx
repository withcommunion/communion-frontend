import React, {
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { ethers } from 'ethers';

import { fetchSelf, Self } from '@/util/walletApiUtil';
import { getEthersWallet } from '@/util/avaxEthersUtil';

interface UserContext {
  jwtCtx: string;
  setJwtCtx: Dispatch<SetStateAction<string>>;
  selfCtx: {
    self?: Self;
    // eslint-disable-next-line
    fetch: (jwt: string) => Promise<void>;
    isLoading: boolean;
  };
  selfWalletCtx: {
    ethersWallet?: ethers.Wallet;
    balance?: {
      valueStr?: string;
      valueBigNum?: ethers.BigNumber;
      isLoading: boolean;
      // eslint-disable-next-line
      fetchRefresh?: (wallet: ethers.Wallet) => Promise<void>;
    };
  };
}

const defaultValues = {
  jwtCtx: '',
  setJwtCtx: () => {
    return;
  },
  selfCtx: {
    self: undefined,
    isLoading: false,
    fetch: () => Promise.resolve(undefined),
  },
  selfWalletCtx: {},
};

export const UserContext = React.createContext<UserContext>(defaultValues);
export const useUserContext = () => useContext(UserContext);

export const UserContextProvider = ({ children }: { children: ReactNode }) => {
  const [selfCtx, setSelfCtx] = useState<UserContext['selfCtx']>({
    ...defaultValues.selfCtx,
  });
  const [selfWalletCtx, setSelfWalletCtx] = useState<
    UserContext['selfWalletCtx']
  >({});
  const [jwtCtx, setJwtCtx] = useState('');

  const fetchBalanceRefresh = useCallback(
    async (wallet: ethers.Wallet) => {
      setSelfWalletCtx({
        ...selfWalletCtx,
        balance: {
          ...selfWalletCtx.balance,
          isLoading: true,
        },
      });
      const balanceBigNumber = await wallet.getBalance();

      setSelfWalletCtx({
        ...selfWalletCtx,
        balance: {
          ...selfWalletCtx.balance,
          valueStr: ethers.utils.formatEther(balanceBigNumber),
          valueBigNum: balanceBigNumber,
          isLoading: false,
        },
      });
    },
    [selfWalletCtx]
  );

  useEffect(() => {
    const fetchSelfCtx = async (jwt: string) => {
      setSelfCtx((oldSelfCtx) => ({ ...oldSelfCtx, isLoading: true }));

      const selfResp = await fetchSelf(jwt);

      setSelfCtx((oldSelfCtx) => ({
        ...oldSelfCtx,
        self: selfResp,
        isLoading: false,
      }));
      return;
    };

    if (jwtCtx && !selfCtx.self && !selfCtx.isLoading) {
      fetchSelfCtx(jwtCtx);
    }
  }, [jwtCtx, selfCtx]);

  useEffect(() => {
    if (
      selfCtx &&
      !selfWalletCtx.ethersWallet &&
      !selfCtx.isLoading &&
      selfCtx.self &&
      selfCtx.self.walletPrivateKeyWithLeadingHex
    ) {
      setSelfWalletCtx({
        ...selfWalletCtx,
        ethersWallet: getEthersWallet(
          selfCtx.self.walletPrivateKeyWithLeadingHex
        ),
      });
    }
  }, [selfCtx, selfWalletCtx]);

  useEffect(() => {
    if (selfWalletCtx.ethersWallet && !selfWalletCtx.balance?.fetchRefresh) {
      setSelfWalletCtx({
        ...selfWalletCtx,
        balance: {
          ...selfWalletCtx.balance,
          isLoading: false,
          fetchRefresh: fetchBalanceRefresh,
        },
      });
    }
    if (selfWalletCtx.ethersWallet && !selfWalletCtx.balance) {
      fetchBalanceRefresh(selfWalletCtx.ethersWallet);
    }
  }, [selfWalletCtx, fetchBalanceRefresh]);

  return (
    <UserContext.Provider value={{ selfCtx, jwtCtx, setJwtCtx, selfWalletCtx }}>
      {children}
    </UserContext.Provider>
  );
};
