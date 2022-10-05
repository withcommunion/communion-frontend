import { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { Amplify } from 'aws-amplify';
import cx from 'classnames';

import { AMPLIFY_CONFIG } from '@/util/cognitoAuthUtil';
import { getUserJwtTokenOnServer } from '@/util/cognitoAuthUtil';

import { useAppSelector, useAppDispatch } from '@/reduxHooks';
import { selectSelf } from '@/features/selfSlice';
import {
  fetchOrgTokenBalance,
  selectOrg,
  selectIsManagerModeActive,
} from '@/features/organization/organizationSlice';
import { fetchSelfHistoricalTxns } from '@/features/transactions/transactionsSlice';
import {
  selectUsersAndAmounts,
  selectLatestTxnStatus,
  fetchMultisendFunds,
  clearedUsers,
  clearedLatestTxn,
  baseMsgUpdated,
  baseAmountUpdated,
} from '@/features/multisend/multisendSlice';

import { useFetchSelf, useFetchOrg } from '@/shared_hooks/sharedHooks';
import { isNftFeatureEnabled } from '@/util/envUtil';

import OrgTokenBalanceContainer from '@/shared_components/orgTokenBalance/orgTokenBalanceContainer';
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

  const org = useAppSelector((state) => selectOrg(state));
  const isManagerModeActive = useAppSelector((state) =>
    selectIsManagerModeActive(state)
  );

  const selectedUsersAndAmounts = useAppSelector((state) =>
    selectUsersAndAmounts(state)
  );
  const latestTxnStatus = useAppSelector((state) =>
    selectLatestTxnStatus(state)
  );

  const [showModal, setShowModal] = useState<boolean>(false);
  const isMemberSelected = selectedUsersAndAmounts.length > 0;
  const showBottomStickyButton = isMemberSelected && !showModal;

  useFetchSelf(userJwt);
  useFetchOrg(userJwt);

  useEffect(() => {
    if (!showModal) {
      dispatch(clearedLatestTxn());
    }
  }, [showModal, dispatch]);

  useEffect(() => {
    return function cleanup() {
      if (latestTxnStatus === 'succeeded') {
        dispatch(clearedUsers());
        dispatch(clearedLatestTxn());
        dispatch(baseMsgUpdated(''));
        dispatch(baseAmountUpdated(0));
      }
    };
  }, [latestTxnStatus, dispatch]);

  return (
    <>
      <NavBar
        activePage={AvailablePages.orgSend}
        activeOrgId={(orgId || '').toString()}
      />
      <div
        className={cx('h-full min-h-100vh bg-secondaryLightGray', {
          'pb-20': showBottomStickyButton,
          'pb-50': !showBottomStickyButton,
        })}
      >
        <div className="container my-0 mx-auto mb-20 w-full px-6 md:max-w-50vw">
          {!showModal && (
            <>
              <OrgTokenBalanceContainer />
              <SendPageHeader
                activeOrgId={(orgId || '').toString()}
                showSendNftBtn={Boolean(
                  isManagerModeActive &&
                    org?.available_nfts &&
                    isNftFeatureEnabled
                )}
              />
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
        </div>
      </div>
      {showBottomStickyButton && (
        <div className="mt-5">
          <BottomStickyButton
            onCancelClick={() => {
              dispatch(clearedUsers());
            }}
            onPrimaryClick={() => {
              setShowModal(true);
            }}
          />
        </div>
      )}
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
