import React, { useContext, useState, ReactNode } from 'react';
import { fetchSelf, Self } from '@/util/walletApiUtil';

interface UserContext {
  selfCtx: {
    self?: Self;
    // eslint-disable-next-line
    fetch: (jwt: string) => Promise<void>;
    isLoading: boolean;
  };
}

const defaultValues = {
  selfCtx: {
    self: undefined,
    isLoading: false,
    fetch: () => Promise.resolve(undefined),
  },
};
export const UserContext = React.createContext<UserContext>(defaultValues);

export const useUserContext = () => useContext(UserContext);

export const UserContextProvider = ({ children }: { children: ReactNode }) => {
  const fetchSelfContext = async (jwt: string) => {
    if (selfCtx.self || selfCtx.isLoading) {
      console.log('already doing things, returning');
      return;
    }

    setSelfCtx((oldSelfCtx) => ({ ...oldSelfCtx, isLoading: true }));

    console.log('Fetching self');
    const selfResp = await fetchSelf(jwt);

    setSelfCtx((oldSelfCtx) => ({
      ...oldSelfCtx,
      self: selfResp,
      isLoading: false,
    }));
    return;
  };

  const [selfCtx, setSelfCtx] = useState<UserContext['selfCtx']>({
    ...defaultValues.selfCtx,
    fetch: fetchSelfContext,
  });

  return (
    <UserContext.Provider value={{ selfCtx }}>{children}</UserContext.Provider>
  );
};
