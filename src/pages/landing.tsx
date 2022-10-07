import { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import { Amplify } from 'aws-amplify';
import { useRouter } from 'next/router';
import { useAuthenticator } from '@aws-amplify/ui-react';

import { AMPLIFY_CONFIG } from '../util/cognitoAuthUtil';

import { useAppSelector, useAppDispatch } from '@/reduxHooks';
import { selectSelf, selectSelfStatus } from '@/features/selfSlice';

import { useFetchSelf } from '@/shared_hooks/sharedHooks';

import FloatingFruitLandingPage from '@/pages_components/landing/floatingFruitLandingPage';

import styles from '@/styles/index.module.css';

// https://docs.amplify.aws/lib/client-configuration/configuring-amplify-categories/q/platform/js/#general-configuration
Amplify.configure({ ...AMPLIFY_CONFIG, ssr: false });

const LandingPage: NextPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [userJwt, setUserJwt] = useState('');

  const { orgId } = router.query;
  const queryOrgId = (orgId as string) || '';

  const { user } = useAuthenticator(({ route, user }) => {
    return [route, user];
  });

  const self = useAppSelector((state) => selectSelf(state));
  const selfStatus = useAppSelector((state) => selectSelfStatus(state));

  useFetchSelf(userJwt);

  useEffect(() => {
    const jwt = user && user.getSignInUserSession()?.getIdToken().getJwtToken();

    if (!userJwt && jwt) {
      setUserJwt(jwt);
    }
  }, [user, userJwt]);

  useEffect(() => {
    const shouldRouteUserToOnlyOrg =
      selfStatus === 'succeeded' &&
      self?.organizations.length === 1 &&
      !queryOrgId;

    const shouldRouteUserToHome = selfStatus === 'succeeded';

    if (shouldRouteUserToOnlyOrg) {
      router.push({
        pathname: `/org/${self.organizations[0].orgId}`,
        query: router.query,
      });
    } else if (shouldRouteUserToHome) {
      router.push({ pathname: '/home', query: router.query });
    }
  }, [dispatch, selfStatus, self, queryOrgId, router, user]);

  return (
    <>
      <Head>
        <title>Communion</title>
        <meta name="description" content="Communion" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.app}>
        <FloatingFruitLandingPage />)
      </div>
    </>
  );
};

export default LandingPage;
