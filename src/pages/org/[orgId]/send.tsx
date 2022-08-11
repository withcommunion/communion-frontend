import { useEffect, useState } from 'react';
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

import { fetchSelfHistoricalTxns } from '@/features/transactions/transactionsSlice';

import { getUserJwtTokenOnServer } from '@/util/cognitoAuthUtil';
import {
  selectUsersAndAmounts,
  fetchMultisendFunds,
  clearedUsers,
  clearedLatestTxn,
} from '@/features/multisend/multisendSlice';

import SelfOrgHeader from '@/shared_components/selfHeader/selfOrgHeader';
import NavBar, { AvailablePages } from '@/shared_components/navBar/NavBar';
import {
  SendPageHeader,
  SendMemberListContainer,
  SendTokenTipsModal,
  BottomStickyButton,
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

  const selectedUsersAndAmounts = useAppSelector((state) =>
    selectUsersAndAmounts(state)
  );

  const [showModal, setShowModal] = useState<boolean>(false);
  const isMemberSelected = selectedUsersAndAmounts.length > 0;
  const showBottomStickyButton = isMemberSelected && !showModal;

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
  useEffect(() => {
    if (!showModal) {
      dispatch(clearedLatestTxn());
    }
  }, [showModal, dispatch]);

  return (
    <>
      <NavBar
        activePage={AvailablePages.orgSend}
        activeOrgId={(orgId || '').toString()}
      />
      <div className="pb-6 h-full min-h-100vh bg-secondaryLightGray">
        <div className="container w-full px-6 my-0 mx-auto mb-10 md:max-w-50vw">
          {!showModal && (
            <>
              <SelfOrgHeader
                orgId={(orgId || '').toString()}
                tokenAmount={userTokenBalance.valueString}
                tokenSymbol={userTokenBalance.tokenSymbol}
                name={self?.first_name}
              />
              <SendPageHeader />
              <SendMemberListContainer />
            </>
          )}

          {showModal && (
            <SendTokenTipsModal
              closeModal={() => setShowModal(false)}
              tokenSymbol={org.avax_contract.token_symbol}
              sendTokens={async () => {
                await dispatch(
                  fetchMultisendFunds({
                    toUsersAndAmounts: selectedUsersAndAmounts,
                    orgId: org.id,
                    jwtToken: userJwt,
                  })
                );
                dispatch(
                  fetchOrgTokenBalance({
                    walletAddress: self?.walletAddressC || '',
                    contractAddress: org.avax_contract.address,
                  })
                );
                dispatch(
                  fetchSelfHistoricalTxns({
                    orgId: (orgId || '').toString(),
                    jwtToken: userJwt,
                  })
                );
              }}
            />
          )}

          {showBottomStickyButton && (
            <BottomStickyButton
              onCancelClick={() => {
                dispatch(clearedUsers());
              }}
              onPrimaryClick={() => {
                setShowModal(true);
              }}
            />
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
