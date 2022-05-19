import { useState, useEffect } from 'react';
import router from 'next/router';
import { ethers } from 'ethers';
import { Amplify } from 'aws-amplify';
import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react';

import { fetchSelf, Self } from '@/util/walletApiUtil';
import { getEthersWallet, getBalanceOfAddress } from '@/util/avaxEthersUtil';

const BasicWalletDemo = () => {
  const [userPrivateKey, setUserPrivateKey] = useState<string>('');
  const [ethersWallet, setEthersWallet] = useState<ethers.Wallet>();
  const [accountBalance, setAccountBalance] = useState<string>();
  const [userJwt, setUserJwt] = useState<string>();
  const [self, setSelf] = useState<Self>();

  const { user, signOut } = useAuthenticator((context) => {
    if (!context.user) {
      router.push('/');
    }

    return [context.user];
  });

  useEffect(() => {
    if (user) {
      // @ts-expect-error TODO: Clean up
      // eslint-disable-next-line
      Amplify.Auth.currentSession().then((res) => {
        // eslint-disable-next-line
        const jwt = res.getAccessToken().getJwtToken() as string;
        setUserJwt(jwt);
      });
    }
  }, [user]);

  useEffect(() => {
    if (userPrivateKey) {
      setEthersWallet(getEthersWallet(userPrivateKey));
    }
  }, [userPrivateKey]);

  useEffect(() => {
    const fetchBalance = async (address: string) => {
      const balance = await getBalanceOfAddress(address);
      setAccountBalance(ethers.utils.formatEther(balance));
    };

    if (ethersWallet) {
      fetchBalance(ethersWallet.address);
    }
  }, [ethersWallet]);

  return (
    <Authenticator>
      <div className="h-screen container flex flex-col justify-center items-center">
        {userJwt && (
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={async () => {
              const self = await fetchSelf(userJwt);
              const userPrivateKey = self.wallet.privateKeyWithLeadingHex;

              setSelf(self);
              setUserPrivateKey(userPrivateKey);
            }}
          >
            Connect to wallet
          </button>
        )}
        {self && <h3>Hi {self.first_name}</h3>}
        {ethersWallet && (
          <div className="w-screen">
            <p>Your address:</p>
            <p>{ethersWallet.address}</p>
          </div>
        )}
        {accountBalance && (
          <div className="w-screen">
            <p>Your balance:</p>
            <p>{accountBalance}</p>
          </div>
        )}
        {user && (
          <div className="mt-5">
            <p>Hi {user.attributes?.given_name}</p>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => signOut()}
            >
              Sign out
            </button>
          </div>
        )}
      </div>
    </Authenticator>
  );
};

export default BasicWalletDemo;
