import { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/reduxHooks';

import {
  selectUsersAndAmounts,
  fetchMultisendFunds,
  userRemoved,
  selectTotalAmountSending,
  selectBaseAmount,
  clearedLatestTxn,
} from '@/features/multisend/multisendSlice';

import {
  selectCart,
  redeemableAdded,
  redeemableRemoved,
  clearedRedeemables,
} from '@/features/cart/cartSlice';

import RedeemableCard from './redeemableCard/redeemableCard';
import BottomStickyButton from '@/pages_components/org/[orgId]/redeem/bottomStickyButton/bottomStickyButtonContainer';
import SendTokenTipsModal from '@/pages_components/org/[orgId]/redeem/sendTokensModal/sendTokensModal';
import {
  selectOrg,
  selectOrgRedeemablesSortedByAmount,
} from '@/features/organization/organizationSlice';

interface Props {
  userJwt: string;
  fetchRefreshUserBalance: () => void;
  fetchRefreshTxns: () => void;
}

const RedeemablesListContainer = ({
  userJwt,
  fetchRefreshUserBalance,
  fetchRefreshTxns,
}: Props) => {
  const dispatch = useAppDispatch();
  const org = useAppSelector((state) => selectOrg(state));
  const orgRedeemables = useAppSelector((state) =>
    selectOrgRedeemablesSortedByAmount(state)
  );
  const selectedUsersAndAmounts = useAppSelector((state) =>
    selectUsersAndAmounts(state)
  );
  const baseAmountToSend = useAppSelector((state) => selectBaseAmount(state));
  const totalAmountSending = useAppSelector((state) =>
    selectTotalAmountSending(state)
  );

  const selectedRedeemables = useAppSelector((cart) => selectCart(cart));

  const [showModal, setShowModal] = useState<boolean>(false);

  const isRedeemableSelected = selectedRedeemables.length > 0;
  const showBottomStickyButton = isRedeemableSelected && !showModal;

  useEffect(() => {
    if (!showModal) {
      dispatch(clearedLatestTxn());
    }
  }, [showModal, dispatch]);

  return (
    <>
      <div className={`${showBottomStickyButton ? 'pb-20' : ''}`}>
        {!showModal && (
          <ul className="my-4">
            {orgRedeemables.map((redeemable, idx) => {
              // TODO: This is super inefficient, let's move to a map
              // TODO: This is also based on name - super janky.
              // TODO: Add a unique id to the redeemable when we fetch it from the API
              const selectedRedeemable = selectedRedeemables.find(
                (selectedRedeemable) =>
                  selectedRedeemable.name === redeemable.name
              );
              return (
                <RedeemableCard
                  key={idx}
                  redeemable={redeemable}
                  toggleChecked={() => {
                    selectedRedeemable
                      ? // TODO: Janky, fix this - selectedRedeemable is based on name, no bueno
                        dispatch(redeemableRemoved(selectedRedeemable))
                      : dispatch(redeemableAdded(redeemable));
                  }}
                  isChecked={Boolean(selectedRedeemable)}
                />
              );
            })}
          </ul>
        )}
      </div>

      {/* TODO: Move to page container */}
      {showModal && (
        <SendTokenTipsModal
          closeModal={() => setShowModal(false)}
          selectedUsersAndAmounts={selectedUsersAndAmounts}
          removeSelectedUser={(userId: string) =>
            dispatch(userRemoved({ userId }))
          }
          baseAmountToSendPerUser={baseAmountToSend}
          totalAmountSending={totalAmountSending}
          tokenSymbol={org.avax_contract.token_symbol}
          sendTokens={async () => {
            await dispatch(
              fetchMultisendFunds({
                toUsersAndAmounts: selectedUsersAndAmounts,
                orgId: org.id,
                jwtToken: userJwt,
              })
            );
            fetchRefreshUserBalance();
            fetchRefreshTxns();
          }}
        />
      )}

      {/* TODO: Move to page container */}
      {showBottomStickyButton && (
        <BottomStickyButton
          onCancelClick={() => {
            dispatch(clearedRedeemables());
          }}
          onPrimaryClick={() => {
            setShowModal(true);
          }}
        />
      )}
    </>
  );
};

export default RedeemablesListContainer;
