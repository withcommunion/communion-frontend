import type { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { Amplify } from 'aws-amplify';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { useEffect } from 'react';

import { AMPLIFY_CONFIG } from '@/util/cognitoAuthUtil';
import { getUserJwtTokenOnServer } from '@/util/cognitoAuthUtil';

import { useAppSelector, useAppDispatch } from '@/reduxHooks';
import { selectSelf, selectSelfStatus, fetchSelf } from '@/features/selfSlice';

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
  fetchOrgTokenBalance,
} from '@/features/organization/organizationSlice';

import NavBarOld from '@/shared_components/navBarTmp';

import NavBar, { AvailablePages } from '@/shared_components/navBar/NavBar';
import SelfOrgHeader from '@/shared_components/selfHeader/selfOrgHeader';

import {
  OrgTransactionHistoryList,
  ShortcutActionsList,
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

  const orgStatus = useAppSelector((state) => selectOrgStatus(state));
  const org = useAppSelector((state) => selectOrg(state));
  const userTokenBalance = useAppSelector((state) =>
    selectOrgUserTokenBalance(state)
  );

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
        <div className="bg-secondaryLightGray pb-2 min-h-100vh ">
          <div className="container w-full px-6 my-0 mx-auto md:max-w-50vw">
            <SelfOrgHeader
              tokenAmount={userTokenBalance.valueString}
              tokenSymbol={userTokenBalance.tokenSymbol}
              name={self?.first_name}
            />
            <ul className="my-6">
              <ShortcutActionsList shortcutActions={org.actions} />
            </ul>
            <div className="my-8">
              <OrgTransactionHistoryList
                selfWalletAddress={self?.walletAddressC || ''}
                transactions={historicalTxns}
                fetchRefreshTxns={() =>
                  dispatch(
                    fetchSelfHistoricalTxns({
                      orgId: (orgId || '').toString(),
                      jwtToken: userJwt,
                    })
                  )
                }
              />
            </div>
          </div>
        </div>
        <NavBar
          activePage={AvailablePages.orgHome}
          activeOrgId={(orgId || '').toString()}
        />
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
