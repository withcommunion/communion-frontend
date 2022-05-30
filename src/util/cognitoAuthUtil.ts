import { withSSRContext } from 'aws-amplify';
import type { Auth } from 'aws-amplify';
import type { CognitoUser } from 'amazon-cognito-identity-js';
import { GetServerSidePropsContext } from 'next';

export const USER_POOL_ID_DEV = 'us-east-1_EXRZZF0cp';
export const USER_POOL_ID_PROD = 'us-east-1_SeeaUyuuH';

export const USER_POOL_CLIENT_ID_DEV = '4eerlu1taf72c8r20pv2tmmvmt';
export const USER_POOL_CLIENT_ID_PROD = '66eoq77778g7d8e36v6pobj0b6';

const isProd = Boolean(process.env.NEXT_PUBLIC_VERCEL_STAGE === 'prod');
const isDev = Boolean(process.env.NEXT_PUBLIC_VERCEL_STAGE === 'dev');

function getCookieStorage() {
  const cookieStorageBase = {
    domain: undefined,
    secure: undefined,
    path: '/',
    expires: 30,
  };
  if (isProd) {
    return { ...cookieStorageBase, domain: 'withcommunion.com', secure: true };
  }

  if (isDev) {
    // <project-name>-git-<branch-name>-<scope-slug>.vercel.app
    // https://communion-frontend-git-testdevdeploy-communion.vercel.app/
    // eslint-disable-next-line
    const prBranchDomainName = process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF
      ? `communion-frontend-git-${process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF}-communion.vercel.app`
      : false;
    return { ...cookieStorageBase, domain: prBranchDomainName, secure: true };
  }

  return { ...cookieStorageBase, domain: 'localhost', secure: false };
}

export const AMPLIFY_CONFIG = {
  aws_cognito_region: 'us-east-1',
  aws_user_pools_id: USER_POOL_ID_DEV,
  aws_user_pools_web_client_id: USER_POOL_CLIENT_ID_DEV,
  aws_mandatory_sign_in: 'enable',
  cookieStorage: getCookieStorage(),
};

console.log('AMPLIFY_CONFIG', AMPLIFY_CONFIG);

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
