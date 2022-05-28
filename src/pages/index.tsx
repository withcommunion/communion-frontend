import type { NextPage } from 'next';
import Head from 'next/head';
import { Amplify } from 'aws-amplify';
import router from 'next/router';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { AMPLIFY_CONFIG } from '../util/cognitoAuthUtil';
import {
  AuthComponent,
  IndexHeader,
} from '../pages_components/indexPageComponents';

// https://docs.amplify.aws/lib/client-configuration/configuring-amplify-categories/q/platform/js/#general-configuration
Amplify.configure({ ...AMPLIFY_CONFIG, ssr: false });

const Index: NextPage = () => {
  const { route } = useAuthenticator((context) => {
    if (context.user?.attributes?.email_verified === 'true') {
      router.push('/demo');
    }
    return [context.route];
  });

  useAuthenticator((context) => {
    const { user } = context;
    if (user?.attributes?.email_verified) {
      router.push('/demo');
    }
    return [context.user];
  });

  return (
    <div className="h-screen">
      <Head>
        <title>Communion</title>
        <meta name="description" content="Communion" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen py-4 flex flex-col justify-center items-center">
        <IndexHeader />
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
