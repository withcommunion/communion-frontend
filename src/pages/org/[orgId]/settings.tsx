import { useEffect, useState } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';

import { isProd, isDev, isLocal } from '@/util/envUtil';
import { getUserJwtTokenOnServer } from '@/util/cognitoAuthUtil';

import { useAppSelector, useAppDispatch } from '@/reduxHooks';
import {
  selectOrg,
  reset as resetOrganization,
} from '@/features/organization/organizationSlice';
import { reset as resetSelf } from '@/features/selfSlice';
import { reset as resetJoinOrg } from '@/features/joinOrg/joinOrgSlice';
import { reset as resetMultisend } from '@/features/multisend/multisendSlice';
import { reset as resetCart } from '@/features/cart/cartSlice';

import { useFetchSelf, useFetchOrg } from '@/shared_hooks/sharedHooks';

import NavBar, { AvailablePages } from '@/shared_components/navBar/NavBar';
import PrimaryButton from '@/shared_components/buttons/primaryButton';

import {
  InviteLink,
  PhoneSettingsContainer,
} from '@/pages_components/org/[orgId]/settingsComponents';

interface Props {
  userJwt: string;
}
const SettingsPage = ({ userJwt }: Props) => {
  const router = useRouter();

  const dispatch = useAppDispatch();
  const { signOut } = useAuthenticator((context) => [context.signOut]);
  const org = useAppSelector((state) => selectOrg(state));
  const [orgUrlWithJoinCode, setOrgUrlWithJoinCode] = useState('');

  useFetchSelf(userJwt);
  useFetchOrg(userJwt);

  useEffect(() => {
    if (org && org.join_code && !orgUrlWithJoinCode) {
      const prodUrl = 'https://withcommunion.com';
      const devUrl = 'https://dev.withcommunion.com';
      const localUrl = 'http://localhost:3000';
      const urlQueryParams = `?orgId=${org.id}&joinCode=${org.join_code}`;

      if (isProd) {
        setOrgUrlWithJoinCode(`${prodUrl}${urlQueryParams}`);
      } else if (isDev) {
        setOrgUrlWithJoinCode(`${devUrl}${urlQueryParams}`);
      } else if (isLocal) {
        setOrgUrlWithJoinCode(`${localUrl}${urlQueryParams}`);
      }
    }
  }, [org, orgUrlWithJoinCode]);

  return (
    <>
      {/** TODO: This is a HACK.  The URL needs to go to the real home page */}
      <NavBar
        activePage={AvailablePages.settings}
        activeOrgId={(org.id || 'jacks-pizza-pittsfield').toString()}
      />

      <div className="min-h-100vh  bg-secondaryLightGray ">
        <div className="container my-0 mx-auto w-full px-6 md:max-w-50vw">
          <div className="space-around flex flex-col items-center pt-5">
            <h2 className="mb-5 text-xl">Settings</h2>
            {org?.join_code && (
              <InviteLink orgId={org.id} orgJoinCode={org.join_code} />
            )}
            <PhoneSettingsContainer userJwt={userJwt} />
            <PrimaryButton
              text="Sign Out"
              size="big"
              onClick={() => {
                dispatch(resetSelf());
                dispatch(resetOrganization());
                dispatch(resetJoinOrg());
                dispatch(resetMultisend());
                dispatch(resetCart());
                signOut();
                // TODO: This is hacky af
                setTimeout(() => {
                  router.push('/');
                }, 800);
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const userJwt = await getUserJwtTokenOnServer(context);
    return {
      props: { userJwt },
    };
  } catch (error) {
    console.log(error);
    return {
      props: {},
      redirect: {
        destination: '/',
      },
    };
  }
};
export default SettingsPage;
