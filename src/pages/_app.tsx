import '../styles/globals.css';
import '@aws-amplify/ui-react/styles.css';
import type { AppProps } from 'next/app';
import { Amplify } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';

import { AMPLIFY_CONFIG } from '../util/cognitoAuthUtil';

// https://docs.amplify.aws/lib/client-configuration/configuring-amplify-categories/q/platform/js/#general-configuration
Amplify.configure({ ...AMPLIFY_CONFIG, ssr: true });

function App({ Component, pageProps }: AppProps) {
  // TODO: This may cause continual re-renders.  Look here https://ui.docs.amplify.aws/react/components/authenticator#prevent-re-renders=
  return (
    <Authenticator.Provider>
      <Component {...pageProps} />
    </Authenticator.Provider>
  );
}

export default App;
