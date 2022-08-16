import { useEffect } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import { Amplify } from 'aws-amplify';
import { useRouter } from 'next/router';

import { AMPLIFY_CONFIG } from '../util/cognitoAuthUtil';

import { useAppSelector, useAppDispatch } from '@/reduxHooks';
import { selectSelf, selectSelfStatus } from '@/features/selfSlice';

import useFetchUserJwt from '@/shared_hooks/useFetchUserJwtHook';
import { useFetchSelf } from '@/shared_hooks/sharedHooks';

import {
  AuthComponent,
  WelcomeHeader,
} from '../pages_components/indexPageComponents';
import Footer from '@/shared_components/footer/footer';

// https://docs.amplify.aws/lib/client-configuration/configuring-amplify-categories/q/platform/js/#general-configuration
Amplify.configure({ ...AMPLIFY_CONFIG, ssr: false });

const Index: NextPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { orgId } = router.query;
  const queryOrgId = (orgId as string) || '';

  const self = useAppSelector((state) => selectSelf(state));
  const selfStatus = useAppSelector((state) => selectSelfStatus(state));

  const [userJwt] = useFetchUserJwt();
  useFetchSelf(userJwt);

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
  }, [dispatch, selfStatus, self, queryOrgId, router]);

  return (
    <div>
      <Head>
        <title>Communion</title>
        <meta name="description" content="Communion" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-100vh ">
        <div className="container my-0 mx-auto w-full px-6 md:max-w-50vw">
          <div className="flex flex-col items-center justify-center">
            {!self && <WelcomeHeader />}
            <div>
              <AuthComponent />
            </div>
            {self ? (
              <div className="flex h-90vh items-center">
                <Footer />
              </div>
            ) : (
              <Footer />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
