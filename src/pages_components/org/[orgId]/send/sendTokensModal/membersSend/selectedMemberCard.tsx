import Image from 'next/image';
import { ICommunityMembers } from '../../sendMemberList/orgMemberCard';

interface Props {
  communityMember: ICommunityMembers;
}
const selectedMemberCard = ({ communityMember }: Props) => {
  const { avatar, name } = communityMember;

  return (
    <li className="flex items-center justify-between my-6">
      <div className="flex items-center">
        <Image src={avatar} width="30px" height="30px" alt="person icon" />
        <span className="text-primaryGray text-5 font-semibold pl-2">
          {name}
        </span>
      </div>
      <Image
        src="/images/delete.svg"
        width="16px"
        height="18px"
        alt="delete icon"
      />
    </li>
  );
};

export default selectedMemberCard;
