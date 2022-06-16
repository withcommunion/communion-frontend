import React, { useContext, useState, ReactNode } from 'react';
import { fetchSelf, Self } from '@/util/walletApiUtil';

interface UserContext {
  bigSelf: {
    self?: Self;
    // eslint-disable-next-line
    fetch: (jwt: string) => Promise<void>;
    isLoading: boolean;
  };
}

const defaultValues = {
  bigSelf: {
    self: undefined,
    isLoading: false,
    fetch: () => Promise.resolve(undefined),
  },
  selfLoading: false,
};
export const UserContext = React.createContext<UserContext>(defaultValues);

export const useUserContext = () => useContext(UserContext);

export const UserContextProvider = ({ children }: { children: ReactNode }) => {
  const fetchSelfContext = async (jwt: string) => {
    if (bigSelf.self || bigSelf.isLoading) {
      console.log('already doing things, returning');
      return;
    }

    setBigSelf((oldBigSelf) => ({ ...oldBigSelf, isLoading: true }));

    console.log('Fetching self');
    const selfResp = await fetchSelf(jwt);

    setBigSelf((oldBigSelf) => ({
      ...oldBigSelf,
      self: selfResp,
      isLoading: false,
    }));
    return;
  };

  const [bigSelf, setBigSelf] = useState<UserContext['bigSelf']>({
    ...defaultValues.bigSelf,
    fetch: fetchSelfContext,
  });

  return (
    <UserContext.Provider value={{ bigSelf }}>{children}</UserContext.Provider>
  );
};
