import React, { useContext, useState, ReactNode, useEffect } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { fetchSelf, Self } from '@/util/walletApiUtil';

interface UserContext {
  jwtCtx: string;
  setJwtCtx: Dispatch<SetStateAction<string>>;
  selfCtx: {
    self?: Self;
    // eslint-disable-next-line
    fetch: (jwt: string) => Promise<void>;
    isLoading: boolean;
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
};
export const UserContext = React.createContext<UserContext>(defaultValues);

export const useUserContext = () => useContext(UserContext);

export const UserContextProvider = ({ children }: { children: ReactNode }) => {
  const [selfCtx, setSelfCtx] = useState<UserContext['selfCtx']>({
    ...defaultValues.selfCtx,
  });

  const [jwtCtx, setJwtCtx] = useState('');

  useEffect(() => {
    const fetchSelfContext = async (jwt: string) => {
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

    if (jwtCtx && !selfCtx.self && !selfCtx.isLoading) {
      fetchSelfContext(jwtCtx);
    }
  }, [jwtCtx, selfCtx]);

  return (
    <UserContext.Provider value={{ selfCtx, jwtCtx, setJwtCtx }}>
      {children}
    </UserContext.Provider>
  );
};
