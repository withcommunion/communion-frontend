import { useEffect, useState } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import copy from 'copy-to-clipboard';

import { isProd, isDev, isLocal } from '@/util/envUtil';
import { useAppSelector, useAppDispatch } from '@/reduxHooks';
import { getUserJwtTokenOnServer } from '@/util/cognitoAuthUtil';

import {
  selectOrg,
  reset as resetOrganization,
} from '@/features/organization/organizationSlice';

import { useFetchSelf, useFetchOrg } from '@/shared_hooks/sharedHooks';

import { reset as resetSelf } from '@/features/selfSlice';
import { reset as resetJoinOrg } from '@/features/joinOrg/joinOrgSlice';
import { reset as resetMultisend } from '@/features/multisend/multisendSlice';
import { reset as resetCart } from '@/features/cart/cartSlice';
import NavBar, { AvailablePages } from '@/shared_components/navBar/NavBar';
import PrimaryButton from '@/shared_components/buttons/primaryButton';
import SecondaryButton from '@/shared_components/buttons/secondaryButton';

interface Props {
  userJwt: string;
}
const SettingsPage = ({ userJwt }: Props) => {
  const router = useRouter();

  const dispatch = useAppDispatch();
  const { signOut } = useAuthenticator((context) => [context.signOut]);
  const org = useAppSelector((state) => selectOrg(state));
  const [orgUrlWithJoinCode, setOrgUrlWithJoinCode] = useState('');
  const [copyMessage, setCopyMessage] = useState('Copy');

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

      <div className="bg-secondaryLightGray  min-h-100vh ">
        <div className="container w-full px-6 my-0 mx-auto md:max-w-50vw">
          <div className="flex flex-col items-center space-around pt-5">
            <h2 className="text-xl mb-5">Settings</h2>
            {org?.join_code && (
              <div className="text-start w-full my-8 flex flex-col">
                <label>
                  <span className="text-xl">Invite code</span>
                </label>
                <div className="flex flex-row">
                  <input
                    readOnly
                    className="text-primaryPurple focus:outline-0 bg-white w-full border-thirdLightGray border-1px pl-5 pr-4 py-2"
                    value={orgUrlWithJoinCode}
                  />
                  {org?.join_code && (
                    <button
                      className="text-sm w-2/6 border-2 border-primaryOrange text-primaryOrange py-1 px-1 rounded"
                      onClick={() => {
                        copy(orgUrlWithJoinCode);
                        setCopyMessage('✅ Copied!');
                        setTimeout(() => {
                          setCopyMessage('Copy');
                        }, 1000);
                      }}
                    >
                      {copyMessage}
                    </button>
                  )}
                </div>
                {navigator.share && (
                  <SecondaryButton
                    text="Share"
                    size="big"
                    onClick={async () => {
                      try {
                        console.log(navigator.canShare());
                        await navigator.share({
                          title: `Join Communion Org ${org.id}`,
                          url: orgUrlWithJoinCode,
                        });
                      } catch (err) {
                        // @ts-expect-error it's okay
                        console.error('Share failed:', err.message);
                      }
                    }}
                  />
                )}
              </div>
            )}
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
