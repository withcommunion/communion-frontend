import { useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { Amplify } from 'aws-amplify';
import { useAuthenticator } from '@aws-amplify/ui-react';

import { AMPLIFY_CONFIG } from '@/util/cognitoAuthUtil';

import { useAppSelector, useAppDispatch } from '@/reduxHooks';
import {
  selectSelf,
  selectSelfStatus,
  selectWallet,
  fetchSelf,
  fetchWalletBalance,
  selectEthersWallet,
} from '@/features/selfSlice';

import {
  fetchOrgById,
  fetchOrgTokenBalance,
  selectOrg,
  selectOrgStatus,
  selectOrgRedeemables,
  selectOrgUserTokenBalance,
} from '@/features/organization/organizationSlice';

import {
  fetchOrgRedeem,
  redeemableAdded,
  redeemableRemoved,
  selectCartReverse,
  selectLatestRedeemTxn,
  selectLatestRedeemTxnErrorMessage,
  selectLatestRedeemTxnStatus,
  selectTotalCost,
} from '@/features/cart/cartSlice';

import { getUserJwtTokenOnServer } from '@/util/cognitoAuthUtil';

import NavBar from '@/shared_components/navBar';
import SelfHeader from '@/shared_components/selfHeader';
import Transaction from '@/shared_components/transaction';

// https://docs.amplify.aws/lib/client-configuration/configuring-amplify-categories/q/platform/js/#general-configuration
Amplify.configure({ ...AMPLIFY_CONFIG, ssr: true });

interface Props {
  userJwt: string;
}

const RedeemPage = ({ userJwt }: Props) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { orgId } = router.query;

  const self = useAppSelector((state) => selectSelf(state));
  const selfStatus = useAppSelector((state) => selectSelfStatus(state));

  const org = useAppSelector((state) => selectOrg(state));
  const orgStatus = useAppSelector((state) => selectOrgStatus(state));
  const orgRedeemables = useAppSelector((state) => selectOrgRedeemables(state));
  const userTokenBalance = useAppSelector((state) =>
    selectOrgUserTokenBalance(state)
  );

  const cart = useAppSelector((state) => selectCartReverse(state));
  const totalCartCost = useAppSelector((state) => selectTotalCost(state));
  const latestRedeemTxn = useAppSelector((state) =>
    selectLatestRedeemTxn(state)
  );
  const latestRedeemTxnStatus = useAppSelector((state) =>
    selectLatestRedeemTxnStatus(state)
  );
  const latestRedeemTxnErrorMsg = useAppSelector((state) =>
    selectLatestRedeemTxnErrorMessage(state)
  );

  const wallet = useAppSelector((state) => selectWallet(state));
  const balance = wallet.balance;
  const ethersWallet = useAppSelector((state) => selectEthersWallet(state));

  const { signOut } = useAuthenticator((context) => [context.signOut]);

  useEffect(() => {
    if (selfStatus === 'idle') {
      dispatch(fetchSelf(userJwt));
    }
  }, [userJwt, dispatch, self, selfStatus]);

  useEffect(() => {
    if (self && orgId && orgStatus === 'idle') {
      dispatch(fetchOrgById({ orgId: orgId.toString(), jwtToken: userJwt }));
    }
  }, [self, userJwt, orgId, orgStatus, dispatch]);

  useEffect(() => {
    if (
      userTokenBalance.status === 'idle' &&
      org.avax_contract.address &&
      self
    ) {
      dispatch(
        fetchOrgTokenBalance({
          walletAddress: self.walletAddressC,
          contractAddress: org.avax_contract.address,
        })
      );
    }
  }, [userTokenBalance, org, self, dispatch]);

  return (
    <>
      <NavBar signOut={signOut} active="redeem" />
      <div className="py-4 flex flex-col items-center ">
        <div className="w-full md:w-1/4 px-5">
          <SelfHeader
            self={self}
            balance={balance}
            orgTokenBalance={userTokenBalance}
            ethersWallet={ethersWallet}
            refreshWalletBalance={(ethersWallet) =>
              dispatch(fetchWalletBalance({ wallet: ethersWallet }))
            }
          />

          {orgRedeemables && self && (
            <div>
              <h1 className="mt-5 text-2xl">Redeemables</h1>
              <ul className="mt-5 flex flex-col items-start gap-y-3 overflow-auto">
                {orgRedeemables.map((redeemable) => (
                  <li
                    className="flex justify-between items-center w-full gap-x-2"
                    key={`${redeemable.name}`}
                  >
                    <p>{redeemable.name}</p>
                    {ethersWallet && (
                      <button
                        className="bg-blue-500 disabled:bg-gray-400 hover:bg-blue-700 text-white py-1 px-2 rounded"
                        onClick={() => dispatch(redeemableAdded(redeemable))}
                      >
                        {redeemable.amount} Claim
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {Boolean(cart.length) && (
            <div className="mt-5 ">
              <h1 className="text-xl">Your cart:</h1>
              <ul className="mt-5 flex flex-col items-start gap-y-3 max-h-30vh overflow-scroll">
                {cart.map((redeemable) => (
                  <li className="flex w-full gap-x-2" key={redeemable.id}>
                    <button
                      className="bg-blue-500 disabled:bg-gray-400 hover:bg-blue-700 text-white py-1 px-2 rounded"
                      onClick={() => {
                        dispatch(redeemableRemoved(redeemable));
                      }}
                    >
                      X
                    </button>
                    <p className="ml-5 grow">{redeemable.name}</p>
                    <p>{redeemable.amount}</p>
                  </li>
                ))}
              </ul>
              <p className="mt-5">Total Cost: {totalCartCost}</p>
              <button
                className="bg-blue-500 disabled:bg-gray-400 hover:bg-blue-700 text-white py-1 px-2 rounded"
                disabled={latestRedeemTxnStatus === 'loading'}
                onClick={() =>
                  dispatch(
                    fetchOrgRedeem({
                      amount: totalCartCost,
                      orgId: (orgId || '').toString(),
                      jwtToken: userJwt,
                    })
                  )
                }
              >
                Checkout
              </button>
            </div>
          )}
          {latestRedeemTxn && (
            <div py-10>
              <Transaction
                transaction={latestRedeemTxn}
                amount={totalCartCost}
                toFirstName={`${cart.map((item) => item.name).toString()}`}
                toLastName={''}
                status={latestRedeemTxnStatus}
              />
            </div>
          )}
          {latestRedeemTxnErrorMsg && (
            <div className="">
              <p className="text-red-500">{latestRedeemTxnErrorMsg}</p>
            </div>
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

export default RedeemPage;
