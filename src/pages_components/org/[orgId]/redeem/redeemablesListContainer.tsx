import { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/reduxHooks';

import {
  selectCart,
  selectTotalCost,
  redeemableAdded,
  redeemableRemoved,
  clearedRedeemables,
  OrgRedeemableInCart,
  fetchOrgRedeem,
  clearedLatestRedeemTxn,
} from '@/features/cart/cartSlice';

import RedeemableCard from './redeemableCard/redeemableCard';
import BottomStickyButton from '@/pages_components/org/[orgId]/redeem/bottomStickyButton/bottomStickyButtonContainer';
import RedeemModalContainer from '@/pages_components/org/[orgId]/redeem/redeemModal/redeemModalContainer';
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
  const totalAmountRedeeming = useAppSelector((state) =>
    selectTotalCost(state)
  );
  const selectedRedeemables = useAppSelector((cart) => selectCart(cart));

  const [showModal, setShowModal] = useState<boolean>(false);

  const isRedeemableSelected = selectedRedeemables.length > 0;
  const showBottomStickyButton = isRedeemableSelected && !showModal;

  useEffect(() => {
    if (!showModal) {
      dispatch(clearedLatestRedeemTxn());
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
        <RedeemModalContainer
          closeModal={() => setShowModal(false)}
          selectedRedeemables={selectedRedeemables}
          removeSelectedRedeemable={(selectedRedeemable: OrgRedeemableInCart) =>
            dispatch(redeemableRemoved(selectedRedeemable))
          }
          totalAmountRedeeming={totalAmountRedeeming}
          tokenSymbol={org.avax_contract.token_symbol}
          fetchOrgRedeem={async () => {
            await dispatch(
              fetchOrgRedeem({
                amount: totalAmountRedeeming,
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
