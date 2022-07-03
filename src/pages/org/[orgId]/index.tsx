import type { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { ethers } from 'ethers';
import { Amplify } from 'aws-amplify';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { useEffect } from 'react';

import { formatTxnHash } from '@/util/avaxEthersUtil';
import { AMPLIFY_CONFIG } from '@/util/cognitoAuthUtil';
import { getUserJwtTokenOnServer } from '@/util/cognitoAuthUtil';

import { useAppSelector, useAppDispatch } from '@/reduxHooks';
import {
  selectSelf,
  selectSelfStatus,
  selectWallet,
  selectEthersWallet,
  fetchSelf,
  fetchWalletBalance,
} from '@/features/selfSlice';

import {
  fetchSelfHistoricalTxns,
  selectHistoricalTxns,
  // selectHistoricalTxnsStatus,
  reSelectHistoricalTxnsStatus,
} from '@/features/transactions/transactionsSlice';

import SelfHeader from '@/shared_components/selfHeader';
import NavBar from '@/shared_components/navBar';
import ShortcutAction from '@/pages_components/home/shortcutAction';

// https://docs.amplify.aws/lib/client-configuration/configuring-amplify-categories/q/platform/js/#general-configuration
Amplify.configure({ ...AMPLIFY_CONFIG, ssr: true });

interface Props {
  userJwt: string;
}
const Home = ({ userJwt }: Props) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { orgId } = router.query;
  const self = useAppSelector((state) => selectSelf(state));
  const selfStatus = useAppSelector((state) => selectSelfStatus(state));

  const wallet = useAppSelector((state) => selectWallet(state));
  const balance = wallet.balance;
  const ethersWallet = useAppSelector((state) => selectEthersWallet(state));

  const historicalTxns = useAppSelector((state) => selectHistoricalTxns(state));
  // const historicalTxnsStatus = useAppSelector((state) =>
  //   selectHistoricalTxnsStatus(state)
  // );
  const historicalTxnsStatus = useAppSelector((state) =>
    reSelectHistoricalTxnsStatus(state)
  );

  const { signOut } = useAuthenticator((context) => [context.signOut]);

  useEffect(() => {
    if (selfStatus === 'idle') {
      dispatch(fetchSelf(userJwt));
    }
  }, [userJwt, dispatch, self, selfStatus]);

  useEffect(() => {
    console.log('balance status', historicalTxnsStatus);
    if (userJwt && orgId && historicalTxnsStatus === 'idle') {
      dispatch(
        fetchSelfHistoricalTxns({ orgId: orgId.toString(), jwtToken: userJwt })
      );
    }
  }, [userJwt, orgId, historicalTxnsStatus, dispatch]);

  return (
    <>
      <NavBar signOut={signOut} active="home" />
      <div className="h-fit">
        <div className="py-4 flex flex-col items-center ">
          <div className="w-full md:w-1/4 px-5">
            <div className="container flex flex-col items-center">
              <SelfHeader
                self={self}
                balance={balance}
                ethersWallet={ethersWallet}
                refreshWalletBalance={(ethersWallet) =>
                  dispatch(fetchWalletBalance({ wallet: ethersWallet }))
                }
              />

              <div className="mt-8">
                <h2 className="text-xl">Shortcut Actions:</h2>
                <ul className="mt-2 flex flex-col items-start gap-y-3 overflow-visible">
                  <li>
                    <ShortcutAction actionAmount={5} actionName={'Kindness'} />
                  </li>
                  <li>
                    <ShortcutAction actionAmount={10} actionName={'Support'} />
                  </li>
                </ul>
              </div>

              <div className="mt-8">
                <div className="flex gap-x-1 ">
                  <button
                    disabled={historicalTxnsStatus === 'loading'}
                    className="text-sm bg-blue-500 disabled:bg-gray-400 hover:bg-blue-700 text-white py-1 px-2 rounded"
                    onClick={() => {
                      if (orgId) {
                        dispatch(
                          fetchSelfHistoricalTxns({
                            orgId: orgId.toString(),
                            jwtToken: userJwt,
                          })
                        );
                      }
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
