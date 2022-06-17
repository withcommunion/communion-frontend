import type { GetServerSideProps } from 'next';
import { ethers } from 'ethers';
import { Amplify } from 'aws-amplify';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';

import { formatWalletAddress, formatTxnHash } from '@/util/avaxEthersUtil';
import { fetchSelfTxs, HistoricalTxn } from '@/util/walletApiUtil';
import { AMPLIFY_CONFIG } from '@/util/cognitoAuthUtil';
import { getUserJwtTokenOnServer } from '@/util/cognitoAuthUtil';
import { useUserContext } from '@/context/userContext';

import NavBar from '@/shared_components/navBar';

// https://docs.amplify.aws/lib/client-configuration/configuring-amplify-categories/q/platform/js/#general-configuration
Amplify.configure({ ...AMPLIFY_CONFIG, ssr: true });

interface Props {
  userJwt: string;
}
const Home = ({ userJwt }: Props) => {
  const { selfCtx, setJwtCtx, selfWalletCtx } = useUserContext();
  const { self } = selfCtx;
  const { ethersWallet } = selfWalletCtx;
  const { signOut } = useAuthenticator((context) => [context.signOut]);
  const [accountBalance, setAccountBalance] = useState<string>();
  const [isAccountBalanceZero, setIsAccountBalanceZero] =
    useState<boolean>(false);
  const [isAccountBalanceZeroLoading, setIsAccountBalanceZeroLoading] =
    useState<boolean>(false);

  const [addressHistory, setAddressHistory] = useState<{
    isLoading: boolean;
    txns: HistoricalTxn[];
  }>({ isLoading: false, txns: [] });

  useEffect(() => {
    if (userJwt) {
      setJwtCtx(userJwt);
    }
  }, [userJwt, setJwtCtx]);

  // useEffect(() => {
  //   if (self && self.walletPrivateKeyWithLeadingHex) {
  //     setEthersWallet(getEthersWallet(self.walletPrivateKeyWithLeadingHex));
  //   }
  // }, [self]);

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
    const fetchHistory = async (jwt: string) => {
      const history = await fetchSelfTxs(jwt);
      setAddressHistory({ isLoading: false, txns: history });
    };

    if (userJwt && !addressHistory.txns.length) {
      fetchHistory(userJwt);
    }
  }, [userJwt, addressHistory]);

  return (
    <>
      <NavBar signOut={signOut} active="home" />
      <div className="h-fit">
        <div className="py-4 flex flex-col items-center ">
          <div className="w-full md:w-1/4 px-5">
            <div className="container flex flex-col items-center">
              <>
                <h2>👋 Welcome {self?.first_name}!</h2>
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
                            {formatWalletAddress(ethersWallet.address)}
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
              </>

              <div className="mt-8">
                <h2 className="text-xl">Shortcut Actions:</h2>
                <ul className="mt-2 flex flex-col items-start gap-y-3 overflow-auto">
                  <li>
                    <button className="bg-blue-500 disabled:bg-gray-400 hover:bg-blue-700 text-white py-1 px-2 rounded">
                      <Link href="/community">5 token tip: Kindness</Link>
                    </button>
                  </li>
                  <li>
                    <button className="bg-blue-500 disabled:bg-gray-400 hover:bg-blue-700 text-white py-1 px-2 rounded">
                      <Link href="/community">10 token tip: Support</Link>
                    </button>
                  </li>
                </ul>
              </div>

              <div className="mt-8">
                <div className="flex gap-x-1 ">
                  <button
                    disabled={addressHistory.isLoading}
                    className="text-sm bg-blue-500 disabled:bg-gray-400 hover:bg-blue-700 text-white py-1 px-2 rounded"
                    onClick={async () => {
                      if (ethersWallet) {
                        setAddressHistory({
                          isLoading: true,
                          txns: addressHistory.txns,
                        });
                        const history = await fetchSelfTxs(userJwt);
                        setAddressHistory({ isLoading: false, txns: history });
                      }
                    }}
                  >
                    Refresh
                  </button>
                  <h2 className="text-xl">Recent Transactions:</h2>
                </div>
                <ul className="mt-2 max-h-35vh flex flex-col items-start gap-y-3 overflow-auto">
                  {addressHistory.txns.map((txn) => (
                    <li key={txn.hash}>
                      <p>
                        Amount: {ethers.utils.formatUnits(txn.value, 'ether')}
                      </p>
                      <p>
                        From: {txn.fromUser.first_name} {txn.fromUser.last_name}
                      </p>
                      <p>
                        To: {txn.toUser.first_name} {txn.toUser.last_name}
                      </p>
                      <a
                        className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
                        target="_blank"
                        rel="noreferrer"
                        href={`https://testnet.snowtrace.io/tx/${txn.hash}`}
                      >
                        {formatTxnHash(txn.hash)}
                      </a>
                      <p>Status: {txn.txreceipt_status}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
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

export default Home;
