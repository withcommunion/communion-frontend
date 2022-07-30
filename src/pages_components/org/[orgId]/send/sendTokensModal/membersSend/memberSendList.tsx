import SelectedMemberCard from './selectedMemberCard';
import { ICommunityMembers } from '@/pages_components/org/[orgId]/send/sendMemberList/orgMemberCard';

interface Props {
  usersInOrg: ICommunityMembers[];
}

const MemberSendList = ({ usersInOrg }: Props) => {
  return (
    <ul>
      {usersInOrg.map(
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
