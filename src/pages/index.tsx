import type { NextPage } from 'next';
import Head from 'next/head';
import { Amplify } from 'aws-amplify';
import { useRouter } from 'next/router';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { AMPLIFY_CONFIG } from '../util/cognitoAuthUtil';
import {
  AuthComponent,
  IndexHeader,
} from '../pages_components/indexPageComponents';

// https://docs.amplify.aws/lib/client-configuration/configuring-amplify-categories/q/platform/js/#general-configuration
Amplify.configure({ ...AMPLIFY_CONFIG, ssr: false });

const Index: NextPage = () => {
  const router = useRouter();
  const { route, user } = useAuthenticator(({ authStatus, route, user }) => {
    if (authStatus === 'authenticated') {
      router.push('/org/org-jacks-pizza-1');
    }
    return [route, user];
  });

  return (
    <div className="h-screen">
      <Head>
        <title>Communion</title>
        <meta name="description" content="Communion" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen py-4 flex flex-col justify-center items-center">
        <IndexHeader userName={user?.attributes?.given_name} />
        <div>
          {route === 'idle' || !route ? (
            <h1 className="my-36">loading</h1>
          ) : (
            <AuthComponent />
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
