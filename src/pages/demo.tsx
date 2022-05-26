import { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { ethers } from 'ethers';
import { Amplify } from 'aws-amplify';
import { useAuthenticator } from '@aws-amplify/ui-react';

import {
  fetchSelf,
  Self,
  fetchOrganization,
  Organization,
} from '@/util/walletApiUtil';
import { getEthersWallet } from '@/util/avaxEthersUtil';
import { AMPLIFY_CONFIG } from '@/util/cognitoAuthUtil';
import Router from 'next/router';

import { getUserJwtTokenOnServer } from '@/util/cognitoAuthUtil';

// https://docs.amplify.aws/lib/client-configuration/configuring-amplify-categories/q/platform/js/#general-configuration
Amplify.configure({ ...AMPLIFY_CONFIG, ssr: true });

interface Props {
  userJwt: string;
  self: Self;
}

const BasicWalletDemo = ({ userJwt, self }: Props) => {
  const [userPrivateKey, setUserPrivateKey] = useState<string>('');
  const [ethersWallet, setEthersWallet] = useState<ethers.Wallet>();
  const [accountBalance, setAccountBalance] = useState<string>();
  const [organization, setOrganization] = useState<Organization>();
  // const [self, setSelf] = useState<Self>();

  const { signOut } = useAuthenticator((context) => [context.signOut]);

  useEffect(() => {
    if (!userPrivateKey && self && self.wallet.privateKeyWithLeadingHex) {
      setUserPrivateKey(self.wallet.privateKeyWithLeadingHex);
      setEthersWallet(getEthersWallet(self.wallet.privateKeyWithLeadingHex));
    }
  }, [self, userPrivateKey]);

  useEffect(() => {
    const fetchBalance = async (wallet: ethers.Wallet) => {
      const balanceBigNumber = await wallet.getBalance();
      setAccountBalance(ethers.utils.formatEther(balanceBigNumber));
    };

    if (ethersWallet && !accountBalance) {
      fetchBalance(ethersWallet);
    }
  }, [ethersWallet, accountBalance]);

  useEffect(() => {
    const fetchOrg = async () => {
      const org = await fetchOrganization(self.organization, userJwt);
      console.log(org);
      setOrganization(org);
    };

    if (!organization && self && userJwt) {
      fetchOrg();
    }
  }, [self, organization, userJwt]);

  return (
    <div className="h-screen w-screen p-5">
      {self && (
        <div className="container flex flex-col items-center">
          <h2>👋 Welcome {self.first_name}!</h2>
          {ethersWallet && (
            <>
              <p>Your address:</p>
              <div className="whitespace-normal break-words">
                <p>
                  <small>{ethersWallet.address}</small>
                </p>
              </div>
            </>
          )}

          {accountBalance && (
            <>
              <p>Your balance:</p>
              <p>{accountBalance} AVAX</p>
            </>
          )}
        </div>
      )}

      {organization && (
        <ul className="mt-5 flex flex-col gap-y-4">
          {organization.users.map((user) => (
            <li
              className="flex items-center gap-x-1"
              key={`${user.wallet.addressC}`}
            >
              <p>
                {user.first_name} {user.last_name}
              </p>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 rounded"
                onClick={() => {
                  console.log(`Sending txn to ${user.wallet.addressC}`);
                }}
              >
                Send
              </button>
            </li>
          ))}
        </ul>
      )}

      {userJwt && (
        <div className="flex justify-center">
          <div className="absolute bottom-5 mt-5">
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
        </div>
      )}
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const userJwt = await getUserJwtTokenOnServer(context);
    let self;
    if (userJwt) {
      self = await fetchSelf(userJwt);
      return {
        props: { userJwt, self },
      };
    }
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
