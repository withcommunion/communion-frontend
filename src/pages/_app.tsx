import '../styles/globals.css';
import '@aws-amplify/ui-react/styles.css';
import type { AppProps } from 'next/app';
import { Amplify } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import { Provider } from 'react-redux';

import { AMPLIFY_CONFIG } from '../util/cognitoAuthUtil';
import store from '@/reduxStore';
import ManagerModeBanner from '@/shared_components/managerModeBanner';

// https://docs.amplify.aws/lib/client-configuration/configuring-amplify-categories/q/platform/js/#general-configuration
Amplify.configure({ ...AMPLIFY_CONFIG, ssr: false });

function App({ Component, pageProps }: AppProps) {
  // TODO: This may cause continual re-renders.  Look here https://ui.docs.amplify.aws/react/components/authenticator#prevent-re-renders=
  console.log('App spamming');
  return (
    <Provider store={store}>
      <Authenticator.Provider>
        <ManagerModeBanner />
        <Component {...pageProps} />
      </Authenticator.Provider>
    </Provider>
  );
}

export default App;
