import { getUserJwtTokenOnServer } from '@/util/cognitoAuthUtil';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';

import { useAppSelector } from '@/reduxHooks';

import { selectOrg } from '@/features/organization/organizationSlice';
import NavBar, { AvailablePages } from '@/shared_components/navBar/NavBar';
import PrimaryButton from '@/shared_components/buttons/primaryButton';

const SettingsPage = () => {
  const router = useRouter();
  const { signOut } = useAuthenticator((context) => [context.signOut]);
  const org = useAppSelector((state) => selectOrg(state));
  return (
    <>
      <NavBar
        activePage={AvailablePages.settings}
        activeOrgId={(org.id || '').toString()}
      />
      <div className="bg-secondaryLightGray min-h-100vh ">
        <div className="container w-full px-6 my-0 mx-auto md:max-w-50vw text-center">
          <div className="flex flex-col items-center space-around my-5">
            <h2 className="text-xl mb-5">Settings</h2>
            <PrimaryButton
              text="Sign Out"
              size="big"
              onClick={() => {
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
