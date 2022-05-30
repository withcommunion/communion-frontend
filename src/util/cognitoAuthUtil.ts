import { withSSRContext } from 'aws-amplify';
import type { Auth } from 'aws-amplify';
import type { CognitoUser } from 'amazon-cognito-identity-js';
import { GetServerSidePropsContext } from 'next';

export const USER_POOL_ID_DEV = 'us-east-1_EXRZZF0cp';
export const USER_POOL_ID_PROD = 'us-east-1_SeeaUyuuH';

export const USER_POOL_CLIENT_ID_DEV = '4eerlu1taf72c8r20pv2tmmvmt';
export const USER_POOL_CLIENT_ID_PROD = '66eoq77778g7d8e36v6pobj0b6';

console.log(process.env.NEXT_PUBLIC_STAGE);
const isDev = Boolean(process.env.NEXT_PUBLIC_STAGE == 'dev');

console.log(process.env.NEXT_PUBLIC_VERCEL_URL);

const cookieStorageDev = {
  domain: process.env.NEXT_PUBLIC_VERCEL_URL || 'localhost',
  // Set true if is a domain with https. For localhost set it to false
  secure: false,
  path: '/',
  expires: 30,
};

const cookieStorageProd = {
  domain: 'withcommunion.com',
  // Set true if is a domain with https. For localhost set it to false
  secure: true,
  path: '/',
  expires: 30,
};

export const AMPLIFY_CONFIG = {
  aws_cognito_region: 'us-east-1', // (required) - Region where Amazon Cognito project was created
  aws_user_pools_id: USER_POOL_ID_DEV, // (optional) -  Amazon Cognito User Pool ID
  aws_user_pools_web_client_id: USER_POOL_CLIENT_ID_DEV, // (optional) - Amazon Cognito App Client ID (App client secret needs to be disabled)
  // aws_cognito_identity_pool_id:
  //   'us-east-1:f602c14b-0fde-409c-9a7e-0baccbfd87d0', // (optional) - Amazon Cognito Identity Pool ID
  aws_mandatory_sign_in: 'enable', // (optional) - Users are not allowed to get the aws credentials unless they are signed in
  cookieStorage: isDev ? cookieStorageDev : cookieStorageProd, // (optional) - Cookie storage options
};

export async function getUserJwtTokenOnServer(
  serverSidePropsContext: GetServerSidePropsContext
) {
  const SSRContext = withSSRContext(serverSidePropsContext);
  const SsrAuth = SSRContext.Auth as typeof Auth;

  let userJwt;
  try {
    const user = (await SsrAuth.currentAuthenticatedUser()) as CognitoUser;
    userJwt = user.getSignInUserSession()?.getIdToken().getJwtToken();
    return userJwt;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
