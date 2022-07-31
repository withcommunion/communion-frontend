import { useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { Amplify } from 'aws-amplify';

import { AMPLIFY_CONFIG } from '@/util/cognitoAuthUtil';

import { useAppSelector, useAppDispatch } from '@/reduxHooks';
import { selectSelf, selectSelfStatus, fetchSelf } from '@/features/selfSlice';

import {
  fetchOrgById,
  fetchOrgTokenBalance,
  selectOrg,
  selectOrgStatus,
  selectOrgUserTokenBalance,
} from '@/features/organization/organizationSlice';

import { getUserJwtTokenOnServer } from '@/util/cognitoAuthUtil';

import SelfOrgHeader from '@/shared_components/selfHeader/selfOrgHeader';
import NavBar, { AvailablePages } from '@/shared_components/navBar/NavBar';
import {
  SendPageHeader,
  SendMemberListContainer,
} from '@/pages_components/org/[orgId]/sendComponents';

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

  const org = useAppSelector((state) => selectOrg(state));
  const orgStatus = useAppSelector((state) => selectOrgStatus(state));
  const userTokenBalance = useAppSelector((state) =>
    selectOrgUserTokenBalance(state)
  );

  useEffect(() => {
    if (selfStatus === 'idle') {
      dispatch(fetchSelf(userJwt));
    }
  }, [userJwt, dispatch, self, selfStatus]);

  useEffect(() => {
    if (self && orgId && orgStatus === 'idle') {
      dispatch(fetchOrgById({ orgId: orgId.toString(), jwtToken: userJwt }));
    }
  }, [self, userJwt, orgId, orgStatus, dispatch]);

  useEffect(() => {
    if (
      userTokenBalance.status === 'idle' &&
      org.avax_contract.address &&
      self
    ) {
      dispatch(
        fetchOrgTokenBalance({
          walletAddress: self.walletAddressC,
          contractAddress: org.avax_contract.address,
        })
      );
    }
  }, [userTokenBalance, org, self, dispatch]);

  return (
    <>
      <NavBar
        activePage={AvailablePages.orgSend}
        activeOrgId={(orgId || '').toString()}
      />
      <div className="pb-6 h-full min-h-100vh bg-secondaryLightGray">
        <div className="container w-full px-6 my-0 mx-auto mb-10 md:max-w-50vw">
          <SelfOrgHeader
            tokenAmount={userTokenBalance.valueString}
            tokenSymbol={userTokenBalance.tokenSymbol}
            name={self?.first_name}
          />
          <SendPageHeader />
          {/* <SearchPanel /> */}
          <SendMemberListContainer userJwt={userJwt} />
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
