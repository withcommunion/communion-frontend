import { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { ethers } from 'ethers';
import { Amplify } from 'aws-amplify';
import { useAuthenticator } from '@aws-amplify/ui-react';

import { fetchOrganization, Organization, Self } from '@/util/walletApiUtil';
import { getEthersWallet } from '@/util/avaxEthersUtil';
import { AMPLIFY_CONFIG } from '@/util/cognitoAuthUtil';
import { useUserContext } from '@/context/userContext';

import { getUserJwtTokenOnServer } from '@/util/cognitoAuthUtil';
import NavBar from '@/shared_components/navBar';
import SendTokensModal from '@/shared_components/sendTokensModal';

// https://docs.amplify.aws/lib/client-configuration/configuring-amplify-categories/q/platform/js/#general-configuration
Amplify.configure({ ...AMPLIFY_CONFIG, ssr: true });

interface Props {
  userJwt: string;
}

const CommunityIndex = ({ userJwt }: Props) => {
  const { bigSelf } = useUserContext();
  const { self } = bigSelf;
  const [userPrivateKey, setUserPrivateKey] = useState<string>('');
  const [ethersWallet, setEthersWallet] = useState<ethers.Wallet>();
  const [accountBalance, setAccountBalance] = useState<string>();
  const [isAccountBalanceZero, setIsAccountBalanceZero] =
    useState<boolean>(false);
  const [isAccountBalanceZeroLoading, setIsAccountBalanceZeroLoading] =
    useState<boolean>(false);
  const [organization, setOrganization] = useState<Organization>();

  const { signOut } = useAuthenticator((context) => [context.signOut]);

  useEffect(() => {
    const getSelf = async (jwt: string) => {
      await bigSelf.fetch(jwt);
    };

    if (!bigSelf.self && !bigSelf.isLoading) {
      getSelf(userJwt);
    }
  }, [userJwt, bigSelf]);

  useEffect(() => {
    if (!userPrivateKey && self && self.walletPrivateKeyWithLeadingHex) {
      setUserPrivateKey(self.walletPrivateKeyWithLeadingHex);
      setEthersWallet(getEthersWallet(self.walletPrivateKeyWithLeadingHex));
    }
  }, [self, userPrivateKey]);

  useEffect(() => {
    const fetchBalance = async (wallet: ethers.Wallet) => {
      const balanceBigNumber = await wallet.getBalance();
      const balance = ethers.utils.formatEther(balanceBigNumber);
      setIsAccountBalanceZero(balanceBigNumber.isZero());
      setAccountBalance(balance);
    };

    if (ethersWallet && !accountBalance) {
      fetchBalance(ethersWallet);
    }
  }, [ethersWallet, accountBalance]);

  useEffect(() => {
    const fetchOrg = async (self: Self) => {
      const org = await fetchOrganization(self.organization, userJwt);
      setOrganization(org);
    };

    if (!organization && self && userJwt) {
      fetchOrg(self);
    }
  }, [self, organization, userJwt]);

  return (
    <>
      <NavBar signOut={signOut} active="send" />
      <div className="py-4 flex flex-col items-center ">
        <div className="w-full md:w-1/4 px-5">
          {self && (
            <div className="container flex flex-col items-center">
              <h2>👋 Welcome {self.first_name}!</h2>
              {ethersWallet && (
                <>
                  <p>Your address:</p>
                  <div className="whitespace-normal break-words">
                    <p>
                      <small>
                        <a
                          className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
                          target="_blank"
                          rel="noreferrer"
                          href={`https://testnet.snowtrace.io/address/${ethersWallet.address}`}
                        >
                          {`${ethersWallet.address.substring(
                            0,
                            10
                          )}...${ethersWallet.address.substring(32)}`}
                        </a>
                      </small>
                    </p>
                  </div>
                </>
              )}

              {accountBalance && (
                <>
                  <p>Your balance:</p>
                  <p>{accountBalance} AVAX</p>
                  {isAccountBalanceZero && ethersWallet && (
                    <button
                      className="bg-blue-500 disabled:bg-gray-400 hover:bg-blue-700 text-white py-1 px-2 rounded"
                      disabled={isAccountBalanceZeroLoading}
                      onClick={async () => {
                        setIsAccountBalanceZeroLoading(true);
                        const balance = await ethersWallet.getBalance();
                        setIsAccountBalanceZero(balance.isZero());
                        setAccountBalance(ethers.utils.formatEther(balance));
                        setIsAccountBalanceZeroLoading(false);
                      }}
                    >
                      Balance is zero? Refresh!
                    </button>
                  )}
                </>
              )}
            </div>
          )}

          {organization && (
            <ul className="mt-5 h-75vh flex flex-col items-start gap-y-3 overflow-auto">
              {organization.users.map((user) => (
                <li
                  className="flex justify-between items-center w-full gap-x-2"
                  key={`${user.walletAddressC}`}
                >
                  <p>
                    {user.first_name} {user.last_name}
                  </p>
                  {ethersWallet && (
                    <SendTokensModal
                      userJwt={userJwt}
                      fromUsersWallet={ethersWallet}
                      toUser={user}
                    >
                      <button className="bg-blue-500 disabled:bg-gray-400 hover:bg-blue-700 text-white py-1 px-2 rounded">
                        Send
                      </button>
                    </SendTokensModal>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
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

export default CommunityIndex;
