import { useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { Amplify } from 'aws-amplify';
import { useAuthenticator } from '@aws-amplify/ui-react';

import { AMPLIFY_CONFIG } from '@/util/cognitoAuthUtil';

import { useAppSelector, useAppDispatch } from '@/reduxHooks';
import {
  selectSelf,
  selectSelfStatus,
  selectWallet,
  fetchSelf,
  fetchWalletBalance,
} from '@/features/selfSlice';

import {
  selectOrgStatus,
  fetchOrgById,
  selectOrgUsers,
} from '@/features/organization/organizationSlice';

import { getUserJwtTokenOnServer } from '@/util/cognitoAuthUtil';

import NavBar from '@/shared_components/navBar';
import SendTokensModal from '@/shared_components/sendTokensModal';
import SelfHeader from '@/shared_components/selfHeader';

// https://docs.amplify.aws/lib/client-configuration/configuring-amplify-categories/q/platform/js/#general-configuration
Amplify.configure({ ...AMPLIFY_CONFIG, ssr: true });

interface Props {
  userJwt: string;
}

const OrgIdIndex = ({ userJwt }: Props) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { orgId } = router.query;
  const self = useAppSelector((state) => selectSelf(state));
  const selfStatus = useAppSelector((state) => selectSelfStatus(state));

  const orgUsers = useAppSelector((state) => selectOrgUsers(state));
  const orgStatus = useAppSelector((state) => selectOrgStatus(state));

  const wallet = useAppSelector((state) => selectWallet(state));
  const balance = wallet.balance;
  const ethersWallet = wallet.ethersWallet;

  const { signOut } = useAuthenticator((context) => [context.signOut]);

  useEffect(() => {
    if (selfStatus === 'idle') {
      dispatch(fetchSelf(userJwt));
    }
  }, [userJwt, dispatch, self, selfStatus]);

  // useEffect(() => {
  //   if (self && orgStatus === 'idle') {
  //     dispatch(fetchOrg({ orgName: self.organization, jwtToken: userJwt }));
  //   }
  // }, [self, userJwt, orgStatus, dispatch]);

  useEffect(() => {
    if (self && orgId && orgStatus === 'idle') {
      dispatch(fetchOrgById({ orgId: orgId.toString(), jwtToken: userJwt }));
    }
  }, [self, userJwt, orgId, orgStatus, dispatch]);

  return (
    <>
      <NavBar signOut={signOut} active="send" />
      <div className="py-4 flex flex-col items-center ">
        <div className="w-full md:w-1/4 px-5">
          <SelfHeader
            self={self}
            balance={balance}
            ethersWallet={ethersWallet}
            refreshWalletBalance={(ethersWallet) =>
              dispatch(fetchWalletBalance({ wallet: ethersWallet }))
            }
          />

          {orgUsers && (
            <ul className="mt-5 h-75vh flex flex-col items-start gap-y-3 overflow-auto">
              {orgUsers.map((user) => (
                <li
                  className="flex justify-between items-center w-full gap-x-2"
                  key={`${user.walletAddressC}`}
                >
                  <p>
                    {user.first_name} {user.last_name}
                  </p>
                  {ethersWallet && (
                    <SendTokensModal
                      userJwt={userJwt}
                      fromUsersWallet={ethersWallet}
                      toUser={user}
                    >
                      <button className="bg-blue-500 disabled:bg-gray-400 hover:bg-blue-700 text-white py-1 px-2 rounded">
                        Send
                      </button>
                    </SendTokensModal>
                  )}
                </li>
              ))}
            </ul>
          )}
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

export default OrgIdIndex;
