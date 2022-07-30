import SelectedMemberCard from './selectedMemberCard';
import { FC } from 'react';
import { ICommunityMembers } from '@/pages_components/org/[orgId]/send/sendMemberList/orgMemberCard';

const MemberSendList: FC<{ communityMembers: ICommunityMembers[] }> = ({
  communityMembers,
}) => {
  return (
    <ul>
      {communityMembers.map(
        (communityMember) =>
          communityMember.isChecked && (
            <SelectedMemberCard
              key={communityMember.id}
              communityMember={communityMember}
            />
          )
      )}
    </ul>
  );
};

export default MemberSendList;
