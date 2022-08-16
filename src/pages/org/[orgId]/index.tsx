import type { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { Amplify } from 'aws-amplify';
import { useEffect, useCallback } from 'react';

import { AMPLIFY_CONFIG } from '@/util/cognitoAuthUtil';
import { getUserJwtTokenOnServer } from '@/util/cognitoAuthUtil';

import { useAppSelector, useAppDispatch } from '@/reduxHooks';
import { selectSelf } from '@/features/selfSlice';

import {
  fetchSelfHistoricalTxns,
  selectHistoricalTxns,
  // selectHistoricalTxnsStatus,
  reSelectHistoricalTxnsStatus,
} from '@/features/transactions/transactionsSlice';

import {
  selectOrg,
  selectIsManagerModeActive,
  selectOrgUserTokenBalance,
} from '@/features/organization/organizationSlice';

import NavBar, { AvailablePages } from '@/shared_components/navBar/NavBar';
import SelfOrgHeader from '@/shared_components/selfHeader/selfOrgHeader';

import {
  OrgTransactionHistoryList,
  ShortcutActionsList,
} from '@/pages_components/org/[orgId]/orgIdIndexComponents';

import {
  useFetchSelf,
  useFetchOrg,
  useFetchOrgTokenBalance,
} from '@/shared_hooks/sharedHooks';

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
  const org = useAppSelector((state) => selectOrg(state));

  const userTokenBalance = useAppSelector((state) =>
    selectOrgUserTokenBalance(state)
  );

  const isManagerModeActive = useAppSelector((state) =>
    selectIsManagerModeActive(state)
  );

  const historicalTxns = useAppSelector((state) => selectHistoricalTxns(state));
  const historicalTxnsStatus = useAppSelector((state) =>
    reSelectHistoricalTxnsStatus(state)
  );

  useFetchSelf(userJwt);
  useFetchOrg(userJwt);
  useFetchOrgTokenBalance();

  useEffect(() => {
    if (userJwt && orgId && historicalTxnsStatus === 'idle') {
      dispatch(
        fetchSelfHistoricalTxns({ orgId: orgId.toString(), jwtToken: userJwt })
      );
    }
  }, [userJwt, orgId, historicalTxnsStatus, dispatch]);

  const memoizedFetchRefreshTxns = useCallback(
    () =>
      dispatch(
        fetchSelfHistoricalTxns({
          orgId: (orgId || '').toString(),
          jwtToken: userJwt,
        })
      ),
    [orgId, userJwt, dispatch]
  );

  useEffect(() => {
    memoizedFetchRefreshTxns();
  }, [isManagerModeActive, memoizedFetchRefreshTxns]);

  return (
    <>
      <NavBar
        activePage={AvailablePages.orgHome}
        activeOrgId={(orgId || '').toString()}
      />
      <>
        <div className="min-h-100vh bg-secondaryLightGray pb-2 ">
          <div className="container my-0 mx-auto w-full px-6 md:max-w-50vw">
            <SelfOrgHeader
              orgId={(orgId || '').toString()}
              tokenAmount={userTokenBalance.valueString}
              tokenSymbol={userTokenBalance.tokenSymbol}
              name={self?.first_name}
            />
            <div className="my-6">
              <ShortcutActionsList
                shortcutActions={org.actions}
                orgId={(orgId || '').toString()}
              />
            </div>
            <div className="my-8">
              <OrgTransactionHistoryList
                isManagerModeActive={isManagerModeActive}
                selfWalletAddress={self?.walletAddressC || ''}
                transactions={historicalTxns}
                fetchRefreshTxns={() => {
                  dispatch(
                    fetchSelfHistoricalTxns({
                      orgId: (orgId || '').toString(),
                      jwtToken: userJwt,
                    })
                  );
                }}
              />
            </div>
          </div>
        </div>
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
