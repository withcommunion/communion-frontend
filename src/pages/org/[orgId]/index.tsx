import { useEffect } from 'react';
import type { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { Amplify } from 'aws-amplify';
import cx from 'classnames';

import { AMPLIFY_CONFIG } from '@/util/cognitoAuthUtil';
import { getUserJwtTokenOnServer } from '@/util/cognitoAuthUtil';

import { useAppSelector, useAppDispatch } from '@/reduxHooks';
import // selectHistoricalTxnsStatus,
'@/features/transactions/transactionsSlice';
import { selectOrg } from '@/features/organization/organizationSlice';
import { selectSelf, fetchSelf } from '@/features/selfSlice';

import { useFetchSelf, useFetchOrg } from '@/shared_hooks/sharedHooks';

import NavBar, { AvailablePages } from '@/shared_components/navBar/NavBar';
import OrgTokenBalanceContainer from '@/shared_components/orgTokenBalance/orgTokenBalanceContainer';
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
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { orgId } = router.query;

  const org = useAppSelector((state) => selectOrg(state));
  const self = useAppSelector((state) => selectSelf(state));

  useFetchSelf(userJwt);
  useFetchOrg(userJwt);

  useEffect(() => {
    dispatch(fetchSelf(userJwt));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <NavBar
        activePage={AvailablePages.orgHome}
        activeOrgId={(orgId || '').toString()}
      />
      <>
        <div className="min-h-100vh bg-secondaryLightGray pb-2 ">
          <div className="container my-0 mx-auto w-full px-6 md:max-w-50vw">
            <OrgTokenBalanceContainer />
            <div className={cx('my-6', { 'h-35vh': !org.actions.length })}>
              <ShortcutActionsList
                isBankHeistAvailable={Boolean(self?.isBankHeistAvailable)}
                shortcutActions={org.actions}
                orgId={(orgId || '').toString()}
              />
            </div>
            <div className="my-8">
              <OrgTransactionHistoryList userJwt={userJwt} />
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
