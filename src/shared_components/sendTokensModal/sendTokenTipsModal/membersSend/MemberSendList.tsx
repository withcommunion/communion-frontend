import MemberSend from '@/shared_components/sendTokensModal/sendTokenTipsModal/membersSend/memberSend/MemberSend';
import { FC } from 'react';
import { ICommunityMembers } from '@/pages_components/org/[orgId]/send/communityMembers/OrgMemberCardList';

const MemberSendList: FC<{ communityMembers: ICommunityMembers[] }> = ({
  communityMembers,
}) => {
  return (
    <ul>
      {communityMembers.map((communityMember) =>
        communityMember.isChecked ? (
          <MemberSend
            key={communityMember.id}
            communityMember={communityMember}
          />
        ) : (
          <></>
        )
      )}
    </ul>
  );
};

export default MemberSendList;
