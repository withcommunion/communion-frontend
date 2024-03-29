import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { Amplify } from 'aws-amplify';

import { AMPLIFY_CONFIG } from '@/util/cognitoAuthUtil';
import { getUserJwtTokenOnServer } from '@/util/cognitoAuthUtil';

import { useAppSelector, useAppDispatch } from '@/reduxHooks';
import { fetchSelfHistoricalTxns } from '@/features/transactions/transactionsSlice';
import { selectSelf } from '@/features/selfSlice';
import {
  fetchOrgTokenBalance,
  selectOrg,
  selectIsManagerModeActive,
} from '@/features/organization/organizationSlice';

import { useFetchSelf, useFetchOrg } from '@/shared_hooks/sharedHooks';

import NavBar, { AvailablePages } from '@/shared_components/navBar/NavBar';
import OrgTokenBalanceContainer from '@/shared_components/orgTokenBalance/orgTokenBalanceContainer';
import {
  RedeemPageHeader,
  RedeemablesListContainer,
} from '@/pages_components/org/[orgId]/redeemComponents';

// https://docs.amplify.aws/lib/client-configuration/configuring-amplify-categories/q/platform/js/#general-configuration
Amplify.configure({ ...AMPLIFY_CONFIG, ssr: true });

interface Props {
  userJwt: string;
}

const RedeemPage = ({ userJwt }: Props) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { orgId } = router.query;

  const self = useAppSelector((state) => selectSelf(state));

  const org = useAppSelector((state) => selectOrg(state));

  const isManagerModeActive = useAppSelector((state) =>
    selectIsManagerModeActive(state)
  );

  useFetchSelf(userJwt);
  useFetchOrg(userJwt);

  return (
    <>
      <NavBar
        activePage={AvailablePages.orgRedeem}
        activeOrgId={(orgId || '').toString()}
      />
      <div className="h-full min-h-100vh bg-secondaryLightGray pb-6">
        <div className="container my-0 mx-auto mb-10 w-full px-6 md:max-w-50vw">
          {!isManagerModeActive && (
            <>
              <OrgTokenBalanceContainer />
              <RedeemPageHeader />
              <RedeemablesListContainer
                userJwt={userJwt}
                fetchRefreshUserBalance={() => {
                  dispatch(
                    fetchOrgTokenBalance({
                      walletAddress: self?.walletAddressC || '',
                      contractAddress: org.avax_contract.address,
                    })
                  );
                }}
                fetchRefreshTxns={() =>
                  dispatch(
                    fetchSelfHistoricalTxns({
                      orgId: (orgId || '').toString(),
                      jwtToken: userJwt,
                    })
                  )
                }
              />
            </>
          )}

          {isManagerModeActive && (
            <div>
              <RedeemPageHeader />
              <div className="flex h-50vh flex-col place-content-center text-center text-primaryGray">
                <div className="">
                  <Image
                    src="/images/redeem/arrow-right.png"
                    alt="arrow-pointing-up"
                    width="64"
                    height="64"
                  />
                </div>
                <h3 className="text-16px">
                  Please toggle <strong className="font-bold">off</strong>{' '}
                  Manager Mode to see redeemable prizes!
                </h3>
              </div>
            </div>
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

export default RedeemPage;
