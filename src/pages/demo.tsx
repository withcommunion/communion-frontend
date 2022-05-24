import { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { ethers } from 'ethers';
import { Amplify } from 'aws-amplify';
import { useAuthenticator } from '@aws-amplify/ui-react';

import { fetchSelf, Self } from '@/util/walletApiUtil';
import { getEthersWallet } from '@/util/avaxEthersUtil';
import { AMPLIFY_CONFIG } from '@/util/cognitoAuthUtil';
import Router from 'next/router';

import { getUserJwtTokenOnServer } from '@/util/cognitoAuthUtil';

// https://docs.amplify.aws/lib/client-configuration/configuring-amplify-categories/q/platform/js/#general-configuration
Amplify.configure({ ...AMPLIFY_CONFIG, ssr: true });

const BasicWalletDemo = ({ userJwt }: { userJwt: string }) => {
  const [userPrivateKey, setUserPrivateKey] = useState<string>('');
  const [ethersWallet, setEthersWallet] = useState<ethers.Wallet>();
  const [accountBalance, setAccountBalance] = useState<string>();
  const [self, setSelf] = useState<Self>();

  const { signOut } = useAuthenticator((context) => [context.signOut]);

  useEffect(() => {
    if (userPrivateKey) {
      console.log('here');
      setEthersWallet(getEthersWallet(userPrivateKey));
    }
  }, [userPrivateKey]);

  useEffect(() => {
    const fetchBalance = async (wallet: ethers.Wallet) => {
      const balanceBigNumber = await wallet.getBalance();
      console.log(balanceBigNumber);
      console.log(ethers.utils.formatEther(balanceBigNumber));
      setAccountBalance(ethers.utils.formatEther(balanceBigNumber));
    };

    if (ethersWallet) {
      fetchBalance(ethersWallet);
    }
  }, [ethersWallet]);

  return (
    <div className="h-screen container flex flex-col justify-center items-center">
      <h1>here</h1>
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
        <div className="">
          <p>Your address:</p>
          <p>{ethersWallet.address}</p>
        </div>
      )}
      {accountBalance && (
        <div className="">
          <p>Your balance:</p>
          <p>{accountBalance} AVAX</p>
        </div>
      )}
      {userJwt && (
        <div className="mt-5">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => {
              signOut();
              // TODO: This is hacky af
              setTimeout(() => {
                Router.push('/');
              }, 500);
            }}
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const userJwt = await getUserJwtTokenOnServer(context);
    return {
      props: { userJwt },
    };
  } catch (error) {
    console.log(error);
    return {
      props: {},
      redirect: {
        destination: '/',
      },
    };
  }
};

export default BasicWalletDemo;
