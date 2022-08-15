import type { NextPage } from 'next';
import Head from 'next/head';
import { Amplify } from 'aws-amplify';
import { useRouter } from 'next/router';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { useAppSelector, useAppDispatch } from '@/reduxHooks';
import { selectSelf, selectSelfStatus, fetchSelf } from '@/features/selfSlice';
import { AMPLIFY_CONFIG } from '../util/cognitoAuthUtil';
import {
  AuthComponent,
  WelcomeHeader,
} from '../pages_components/indexPageComponents';
import Footer from '@/shared_components/footer/footer';
import { useEffect } from 'react';

// https://docs.amplify.aws/lib/client-configuration/configuring-amplify-categories/q/platform/js/#general-configuration
Amplify.configure({ ...AMPLIFY_CONFIG, ssr: false });

const Index: NextPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { orgId } = router.query;
  const queryOrgId = (orgId as string) || '';

  const { user } = useAuthenticator(({ route, user }) => {
    return [route, user];
  });

  const self = useAppSelector((state) => selectSelf(state));
  const selfStatus = useAppSelector((state) => selectSelfStatus(state));

  useEffect(() => {
    const userJwt =
      user && user.getSignInUserSession()?.getIdToken().getJwtToken();
    const shouldFetchSelf = selfStatus === 'idle';
    if (shouldFetchSelf && userJwt) {
      dispatch(fetchSelf(userJwt));
    }
  }, [user, selfStatus, dispatch]);

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
    <div>
      <Head>
        <title>Communion</title>
        <meta name="description" content="Communion" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-100vh ">
        <div className="container w-full px-6 my-0 mx-auto md:max-w-50vw">
          <div className="flex flex-col justify-center items-center">
            {!user && <WelcomeHeader />}
            <div>
              <AuthComponent />
            </div>
            <Footer />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
