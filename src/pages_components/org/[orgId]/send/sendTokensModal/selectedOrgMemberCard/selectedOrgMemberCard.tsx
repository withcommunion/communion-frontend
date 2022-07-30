import Image from 'next/image';
import { ICommunityMembers } from '../../sendMemberList/orgMemberCard';

interface Props {
  userInOrg: ICommunityMembers;
}
const selectedMemberCard = ({ userInOrg }: Props) => {
  const { avatar, name } = userInOrg;

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
        width="30px"
        height="30px"
        alt="delete icon"
      />
    </li>
  );
};

export default selectedMemberCard;
