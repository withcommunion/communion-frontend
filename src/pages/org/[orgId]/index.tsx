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

import {
  fetchOrgById,
  selectOrg,
  selectOrgStatus,
  selectOrgUserTokenBalance,
  selectOrgRedeemables,
  fetchOrgTokenBalance,
} from '@/features/organization/organizationSlice';

import SelfHeader from '@/shared_components/selfHeader';
import NavBarOld from '@/shared_components/navBarTmp';
import ShortcutAction from '@/pages_components/home/shortcutAction';

import NavBar from '@/shared_components/navBar/NavBar';
import SelfOrgHeader from '@/shared_components/selfHeader/selfOrgHeader';

import {
  OrgTransactionHistoryList,
  ShortcutActions,
} from '@/pages_components/org/[orgId]/orgIdIndexComponents';

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

  const orgStatus = useAppSelector((state) => selectOrgStatus(state));
  const org = useAppSelector((state) => selectOrg(state));
  const userTokenBalance = useAppSelector((state) =>
    selectOrgUserTokenBalance(state)
  );
  const orgRedeemables = useAppSelector((state) => selectOrgRedeemables(state));

  const historicalTxns = useAppSelector((state) => selectHistoricalTxns(state));
  // const historicalTxnsStatus = useAppSelector((state) =>
  //   selectHistoricalTxnsStatus(state)
  // );
  const historicalTxnsStatus = useAppSelector((state) =>
    reSelectHistoricalTxnsStatus(state)
  );

  const { signOut } = useAuthenticator((context) => [context.signOut]);

  useEffect(() => {
    if (userJwt && orgId && orgStatus === 'idle') {
      const id = orgId.toString();
      dispatch(fetchOrgById({ orgId: id, jwtToken: userJwt }));
    }
  }, [orgId, orgStatus, userJwt, dispatch]);

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

  useEffect(() => {
    if (selfStatus === 'idle') {
      dispatch(fetchSelf(userJwt));
    }
  }, [userJwt, dispatch, self, selfStatus]);

  useEffect(() => {
    if (userJwt && orgId && historicalTxnsStatus === 'idle') {
      dispatch(
        fetchSelfHistoricalTxns({ orgId: orgId.toString(), jwtToken: userJwt })
      );
    }
  }, [userJwt, orgId, historicalTxnsStatus, dispatch]);

  return (
    <>
      <NavBarOld signOut={signOut} active="home" />
      <>
        <div className="bg-secondaryLightGray pb-2 h-screen">
          <div className="container w-full px-6 my-0 mx-auto">
            <SelfOrgHeader
              tokenAmount={userTokenBalance.valueString}
              tokenSymbol={userTokenBalance.tokenSymbol}
              name={self?.first_name}
            />
            <ul className="my-6">
              <ShortcutActions shortcutActions={org.actions} />
            </ul>
            <div className="my-8">
              {/* <OrgTransactionHistoryList transactions={transactions} /> */}
            </div>
          </div>
        </div>
        <NavBar />
      </>
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
