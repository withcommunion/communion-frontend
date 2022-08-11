import { useAppSelector, useAppDispatch } from '@/reduxHooks';

import {
  selectUsersAndAmounts,
  userAdded,
  userRemoved,
  selectBaseAmount,
} from '@/features/multisend/multisendSlice';
import OrgMemberCard from './sendMemberList/orgMemberCard';
import { selectOrgUsers } from '@/features/organization/organizationSlice';

const SendMemberListContainer = () => {
  const dispatch = useAppDispatch();
  const orgUsers = useAppSelector((state) => selectOrgUsers(state));
  const selectedUsersAndAmounts = useAppSelector((state) =>
    selectUsersAndAmounts(state)
  );
  const baseAmountToSend = useAppSelector((state) => selectBaseAmount(state));

  return (
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
  );
};

export default SendMemberListContainer;
