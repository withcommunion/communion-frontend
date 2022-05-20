import type { NextPage } from 'next';
import Head from 'next/head';
import { Amplify } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import router from 'next/router';
import { useAuthenticator } from '@aws-amplify/ui-react';

import { AMPLIFY_CONFIG } from '../util/cognitoAuthUtil';

// https://docs.amplify.aws/lib/client-configuration/configuring-amplify-categories/q/platform/js/#general-configuration
Amplify.configure({ ...AMPLIFY_CONFIG, ssr: false });

const Index: NextPage = () => {
  const { route } = useAuthenticator((context) => {
    console.log(context.route);
    if (context.user?.attributes?.email_verified === 'true') {
      router.push('/demo');
    }
    return [context.route];
  });

  useAuthenticator((context) => {
    console.log(context.user);
    const { user } = context;
    if (user?.attributes?.email_verified) {
      router.push('/demo');
    }
    return [context.user];
  });

  const formFields = {
    signUp: {
      email: {
        order: 1,
      },
      family_name: {
        order: 2,
      },
      given_name: {
        order: 3,
      },
      password: {
        order: 4,
      },
      confirm_password: {
        order: 5,
      },
    },
  };

  return (
    <div className="h-screen">
      <Head>
        <title>Communion</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="h-full flex flex-col justify-center items-center ">
        <h1 className="text-2xl">👋 Hey friend</h1>
        <h1 className="text-3xl">Welcome to Communion</h1>
        <h1 className="text-2xl">Good stuff coming soon!</h1>
        <div className="">
          {route === 'idle' || !route ? (
            <h1 className="my-32">loading</h1>
          ) : (
            <Authenticator
              className="mt-5"
              initialState="signIn"
              signUpAttributes={['email', 'given_name', 'family_name']}
              formFields={formFields}
              loginMechanisms={['email']}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
