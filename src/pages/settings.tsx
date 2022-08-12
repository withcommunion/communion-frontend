/**
 * TODO: This breaks if you navigate directly to it.
 * This is because there is no "org" in the url or elsewhere.
 * this will eventually lead us to the proper home page
 */
import { getUserJwtTokenOnServer } from '@/util/cognitoAuthUtil';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';

import { useAppSelector, useAppDispatch } from '@/reduxHooks';

import {
  selectOrg,
  reset as resetOrganization,
} from '@/features/organization/organizationSlice';
import { reset as resetSelf } from '@/features/selfSlice';
import { reset as resetJoinOrg } from '@/features/joinOrg/joinOrgSlice';
import { reset as resetMultisend } from '@/features/multisend/multisendSlice';
import { reset as resetCart } from '@/features/cart/cartSlice';
import NavBar, { AvailablePages } from '@/shared_components/navBar/NavBar';
import PrimaryButton from '@/shared_components/buttons/primaryButton';

const SettingsPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { signOut } = useAuthenticator((context) => [context.signOut]);
  const org = useAppSelector((state) => selectOrg(state));
  return (
    <>
      {/** TODO: This is a HACK.  The URL needs to go to the real home page */}
      <NavBar
        activePage={AvailablePages.settings}
        activeOrgId={(org.id || 'jacks-pizza-pittsfield').toString()}
      />
      <div className="bg-secondaryLightGray min-h-100vh ">
        <div className="container w-full px-6 my-0 mx-auto md:max-w-50vw text-center">
          <div className="flex flex-col items-center space-around my-5">
            <h2 className="text-xl mb-5">Settings</h2>
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
                }, 500);
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
