import type { GetServerSideProps } from 'next';
import { ethers } from 'ethers';
import { Amplify } from 'aws-amplify';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { useEffect } from 'react';
import Link from 'next/link';

import { formatWalletAddress, formatTxnHash } from '@/util/avaxEthersUtil';
import { AMPLIFY_CONFIG } from '@/util/cognitoAuthUtil';
import { getUserJwtTokenOnServer } from '@/util/cognitoAuthUtil';

import { useAppSelector, useAppDispatch } from '@/reduxHooks';
import {
  selectSelf,
  selectSelfStatus,
  selectWallet,
  fetchSelf,
  fetchWalletBalance,
} from '@/features/selfSlice';

import {
  fetchSelfHistoricalTxns,
  selectHistoricalTxns,
  selectHistoricalTxnsStatus,
} from '@/features/transactions/transactionsSlice';

import NavBar from '@/shared_components/navBar';

// https://docs.amplify.aws/lib/client-configuration/configuring-amplify-categories/q/platform/js/#general-configuration
Amplify.configure({ ...AMPLIFY_CONFIG, ssr: true });

interface Props {
  userJwt: string;
}
const Home = ({ userJwt }: Props) => {
  const dispatch = useAppDispatch();
  const self = useAppSelector((state) => selectSelf(state));
  const selfStatus = useAppSelector((state) => selectSelfStatus(state));

  const wallet = useAppSelector((state) => selectWallet(state));
  const walletBalance = wallet.balance;

  const { signOut } = useAuthenticator((context) => [context.signOut]);

  const historicalTxns = useAppSelector((state) => selectHistoricalTxns(state));
  const historicalTxnsStatus = useAppSelector((state) =>
    selectHistoricalTxnsStatus(state)
  );

  useEffect(() => {
    if (selfStatus === 'idle') {
      dispatch(fetchSelf(userJwt));
    }
  }, [userJwt, dispatch, self, selfStatus]);

  useEffect(() => {
    if (userJwt && historicalTxnsStatus === 'idle') {
      dispatch(fetchSelfHistoricalTxns(userJwt));
    }
  }, [userJwt, historicalTxnsStatus, dispatch]);

  return (
    <>
      <NavBar signOut={signOut} active="home" />
      <div className="h-fit">
        <div className="py-4 flex flex-col items-center ">
          <div className="w-full md:w-1/4 px-5">
            <div className="container flex flex-col items-center">
              <>
                {self && <h2>👋 Welcome {self.first_name}!</h2>}
                {wallet.ethersWallet && (
                  <>
                    <p>Your address:</p>
                    <div className="whitespace-normal break-words">
                      <p>
                        <small>
                          <a
                            className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
                            target="_blank"
                            rel="noreferrer"
                            href={`https://testnet.snowtrace.io/address/${wallet.ethersWallet.address}`}
                          >
                            {formatWalletAddress(wallet.ethersWallet.address)}
                          </a>
                        </small>
                      </p>
                    </div>
                  </>
                )}

                {walletBalance && (
                  <>
                    <p>Your balance:</p>
                    <p>
                      {walletBalance.status === 'loading' && <small>♻️</small>}{' '}
                      {walletBalance.valueString} AVAX
                    </p>
                    {walletBalance.valueBigNumber?.isZero() && (
                      <button
                        className="bg-blue-500 disabled:bg-gray-400 hover:bg-blue-700 text-white py-1 px-2 rounded"
                        disabled={walletBalance.status === 'loading'}
                        onClick={() => {
                          wallet.ethersWallet &&
                            dispatch(
                              fetchWalletBalance({
                                wallet: wallet.ethersWallet,
                              })
                            );
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
                    disabled={historicalTxnsStatus === 'loading'}
                    className="text-sm bg-blue-500 disabled:bg-gray-400 hover:bg-blue-700 text-white py-1 px-2 rounded"
                    onClick={() => {
                      dispatch(fetchSelfHistoricalTxns(userJwt));
                    }}
                  >
                    Refresh
                  </button>
                  <h2 className="text-xl">Recent Transactions:</h2>
                </div>
                <ul className="mt-2 max-h-35vh flex flex-col items-start gap-y-3 overflow-auto">
                  {historicalTxns.map((txn) => (
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
