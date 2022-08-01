import type { NextPage } from 'next';
import Head from 'next/head';
import { Amplify } from 'aws-amplify';
import { useRouter } from 'next/router';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { AMPLIFY_CONFIG } from '../util/cognitoAuthUtil';
import {
  AuthComponent,
  IndexHeader,
  WelcomeHeader,
} from '../pages_components/indexPageComponents';
import Footer from '@/shared_components/footer/footer';

// https://docs.amplify.aws/lib/client-configuration/configuring-amplify-categories/q/platform/js/#general-configuration
Amplify.configure({ ...AMPLIFY_CONFIG, ssr: false });

const Index: NextPage = () => {
  const router = useRouter();
  const { route, user } = useAuthenticator(({ authStatus, route, user }) => {
    if (authStatus === 'authenticated') {
      router.push('/org/jacks-pizza-pittsfield');
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
        {!user && <WelcomeHeader />}
        {user && user.attributes?.given_name && (
          <IndexHeader userName={user?.attributes?.given_name} />
        )}
        <div>
          {route === 'idle' || !route ? (
            <h1 className="my-36">loading</h1>
          ) : (
            <AuthComponent />
          )}
        </div>
        <Footer />
      </main>
    </div>
  );
};

export default Index;
