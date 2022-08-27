import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';

import { useAppSelector, useAppDispatch } from '@/reduxHooks';

import {
  fetchSelfHistoricalTxns,
  selectHistoricalTxns,
  reSelectHistoricalTxnsStatus,
} from '@/features/transactions/transactionsSlice';
import { selectIsManagerModeActive } from '@/features/organization/organizationSlice';
import { selectSelf } from '@/features/selfSlice';

import OrgTransactionHistoryItem from '@/pages_components/org/[orgId]/orgIdIndex/orgTransactionList/orgTransactionItem/orgTransactionItem';

interface Props {
  userJwt: string;
}

const HistoryOrg = ({ userJwt }: Props) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { orgId } = router.query;

  const self = useAppSelector((state) => selectSelf(state));
  const historicalTxns = useAppSelector((state) => selectHistoricalTxns(state));
  const historicalTxnsStatus = useAppSelector((state) =>
    reSelectHistoricalTxnsStatus(state)
  );
  const isManagerModeActive = useAppSelector((state) =>
    selectIsManagerModeActive(state)
  );

  const memoizedFetchRefreshTxns = useCallback(
    () =>
      dispatch(
        fetchSelfHistoricalTxns({
          orgId: (orgId || '').toString(),
          jwtToken: userJwt,
        })
      ),
    [orgId, userJwt, dispatch]
  );

  useEffect(() => {
    memoizedFetchRefreshTxns();
  }, [isManagerModeActive, memoizedFetchRefreshTxns]);

  useEffect(() => {
    if (userJwt && orgId && historicalTxnsStatus === 'idle') {
      dispatch(
        fetchSelfHistoricalTxns({ orgId: orgId.toString(), jwtToken: userJwt })
      );
    }
  }, [userJwt, orgId, historicalTxnsStatus, dispatch]);

  return (
    <>
      <div className="my-4 flex justify-between text-center">
        <span className="text-4 font-semibold text-primaryGray">
          {isManagerModeActive ? 'Bank History' : 'Your History'}
        </span>
        <button
          className="rounded border-2 border-primaryOrange py-1 px-1 text-sm text-primaryOrange"
          onClick={() =>
            dispatch(
              fetchSelfHistoricalTxns({
                orgId: (orgId || '').toString(),
                jwtToken: userJwt,
              })
            )
          }
        >
          {historicalTxnsStatus === 'loading' && <span>♻️</span>} Refresh
        </button>
      </div>
      <ul className="pb-10">
        {historicalTxnsStatus === 'loading' && (
          <div>
            <p>Loading...</p>
          </div>
        )}
        {historicalTxns.map((transaction, num) => (
          <OrgTransactionHistoryItem
            key={num}
            transaction={transaction}
            selfWalletAddress={self?.walletAddressC || ''}
          />
        ))}
      </ul>
    </>
  );
};

export default HistoryOrg;
