import { User } from '@/util/walletApiUtil';
import Image from 'next/image';
export interface ICommunityMembers {
  id: number;
  avatar: string;
  name: string;
  isChecked?: boolean;
}
interface Props {
  userInOrg: User;
  toggleChecked: () => void;
  isChecked: boolean;
}

const OrgMemberCard = ({ userInOrg, toggleChecked, isChecked }: Props) => {
  const { first_name, last_name } = userInOrg;

  return (
    <li
      className={
        isChecked
          ? 'flex justify-between items-center h-16 bg-white rounded my-1 border-primaryBeige border-4'
          : 'flex justify-between items-center h-16 bg-white rounded my-1'
      }
      onClick={toggleChecked}
    >
      <div className="flex items-center">
        <span
          className={
            isChecked
              ? 'ml-1.5 mr-2.5 flex items-center'
              : 'mx-2.5 flex items-center'
          }
        >
          <Image
            src={'/images/send/avatar.svg'}
            width="30px"
            height="30px"
            alt="user avatar"
          />
        </span>
        <span className="text-primaryGray text-15px">
          {first_name} {last_name}
        </span>
      </div>
      <input
        type="checkbox"
        className={isChecked ? 'mx-4' : 'mx-5'}
        checked={isChecked}
        onChange={() => undefined}
      ></input>
    </li>
  );
};

export default OrgMemberCard;
