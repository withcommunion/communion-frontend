import OrgMemberCard from '@/pages_components/org/[orgId]/send/communityMembers/orgMemberCard/OrgMemberCard';

export interface ICommunityMembers {
  id: number;
  avatar: string;
  name: string;
  isChecked?: boolean;
}

interface Props {
  communityMembers: ICommunityMembers[];
  setIsChecked: (id: number, isChecked: boolean) => void;
}

const OrgMemberCardList = ({ communityMembers, setIsChecked }: Props) => {
  return (
    <ul className="my-4">
      {communityMembers.map((communityMember, num: number) => (
        <OrgMemberCard
          key={num}
          communityMember={communityMember}
          setIsChecked={setIsChecked}
        />
      ))}
    </ul>
  );
};

export default OrgMemberCardList;
