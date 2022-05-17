import '../styles/globals.css';
import '@aws-amplify/ui-react/styles.css';
import type { AppProps } from 'next/app';
import { Amplify } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';

import {
  USER_POOL_ID_DEV,
  USER_POOL_CLIENT_ID_DEV,
} from '../util/cognitoAuthUtil';

// https://docs.amplify.aws/lib/client-configuration/configuring-amplify-categories/q/platform/js/#general-configuration
Amplify.configure({
  aws_cognito_region: 'us-east-1', // (required) - Region where Amazon Cognito project was created
  aws_user_pools_id: USER_POOL_ID_DEV, // (optional) -  Amazon Cognito User Pool ID
  aws_user_pools_web_client_id: USER_POOL_CLIENT_ID_DEV, // (optional) - Amazon Cognito App Client ID (App client secret needs to be disabled)
  // aws_cognito_identity_pool_id:
  //   'us-east-1:f602c14b-0fde-409c-9a7e-0baccbfd87d0', // (optional) - Amazon Cognito Identity Pool ID
  aws_mandatory_sign_in: 'enable', // (optional) - Users are not allowed to get the aws credentials unless they are signed in
  ssr: true,
});

function App({ Component, pageProps }: AppProps) {
  // TODO: This may cause continual re-renders.  Look here https://ui.docs.amplify.aws/react/components/authenticator#prevent-re-renders=
  return (
    <Authenticator.Provider>
      <Component {...pageProps} />
    </Authenticator.Provider>
  );
}

export default App;
