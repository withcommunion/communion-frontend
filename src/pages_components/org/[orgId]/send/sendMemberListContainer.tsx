import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/reduxHooks';

import {
  selectUsersAndAmounts,
  fetchMultisendFunds,
  userAdded,
  userRemoved,
  clearedUsers,
  selectTotalAmountSending,
  selectBaseAmount,
  baseAmountUpdated,
} from '@/features/multisend/multisendSlice';
import OrgMemberCard from './sendMemberList/orgMemberCard';
import BottomStickyButton from '@/pages_components/org/[orgId]/send/bottomStickyButton/bottomStickyButtonContainer';
import SendTokenTipsModal from '@/pages_components/org/[orgId]/send/sendTokensModal/sendTokensModal';
import {
  selectOrg,
  selectOrgUsers,
} from '@/features/organization/organizationSlice';

interface Props {
  userJwt: string;
}
const SendMemberListContainer = ({ userJwt }: Props) => {
  const dispatch = useAppDispatch();
  const org = useAppSelector((state) => selectOrg(state));
  const orgUsers = useAppSelector((state) => selectOrgUsers(state));
  const selectedUsersAndAmounts = useAppSelector((state) =>
    selectUsersAndAmounts(state)
  );
  const baseAmountToSend = useAppSelector((state) => selectBaseAmount(state));
  const totalAmountSending = useAppSelector((state) =>
    selectTotalAmountSending(state)
  );
  const [showModal, setShowModal] = useState<boolean>(false);

  const isMemberSelected = selectedUsersAndAmounts.length > 0;
  const showBottomStickyButton = isMemberSelected && !showModal;
  return (
    <>
      <div className={`${showBottomStickyButton ? 'pb-20' : ''}`}>
        {!showModal && (
          <ul className="my-4">
            {orgUsers.map((user) => {
              // TODO: This is super inefficient, let's move to a map
              const isUserSelected = Boolean(
                selectedUsersAndAmounts.find(
                  (selectedUser) => selectedUser.user.id === user.id
                )
              );
              return (
                <OrgMemberCard
                  key={user.id}
                  userInOrg={user}
                  toggleChecked={() => {
                    isUserSelected
                      ? dispatch(userRemoved({ userId: user.id }))
                      : dispatch(userAdded({ user, amount: baseAmountToSend }));
                  }}
                  isChecked={isUserSelected}
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
          onAssetAmountChange={(value: number) => {
            dispatch(baseAmountUpdated(value));
          }}
          onPrimaryButtonClick={() => {
            dispatch(
              fetchMultisendFunds({
                toUsersAndAmounts: selectedUsersAndAmounts,
                orgId: org.id,
                jwtToken: userJwt,
              })
            );
          }}
        />
      )}

      {/* TODO: Move to page container */}
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
    </>
  );
};

export default SendMemberListContainer;
