import '../styles/globals.css';
import '@aws-amplify/ui-react/styles.css';
import type { AppProps } from 'next/app';
import { Amplify } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import { Provider } from 'react-redux';

import dynamic from 'next/dynamic';
import { AMPLIFY_CONFIG } from '../util/cognitoAuthUtil';
import store from '@/reduxStore';
const ManagerModeBanner = dynamic(
  () => import('../shared_components/managerModeBanner'),
  { ssr: false }
);

// https://docs.amplify.aws/lib/client-configuration/configuring-amplify-categories/q/platform/js/#general-configuration
Amplify.configure({ ...AMPLIFY_CONFIG, ssr: false });

function App({ Component, pageProps }: AppProps) {
  return (
    <Authenticator.Provider>
      <Provider store={store}>
        <ManagerModeBanner />
        <Component {...pageProps} />
      </Provider>
    </Authenticator.Provider>
  );
}

export default App;
