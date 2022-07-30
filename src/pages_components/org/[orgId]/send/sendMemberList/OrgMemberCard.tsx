import Image from 'next/image';
import { FC } from 'react';

export interface ICommunityMembers {
  id: number;
  avatar: string;
  name: string;
  isChecked?: boolean;
}
interface IOrgMemberCard {
  communityMember: ICommunityMembers;
  setIsChecked: (id: number, isChecked: boolean) => void;
}

const OrgMemberCard: FC<IOrgMemberCard> = ({
  communityMember,
  setIsChecked,
}) => {
  const { isChecked, id } = communityMember;

  const onSwitchChecked = () => {
    setIsChecked(id, !isChecked);
  };

  const { avatar, name } = communityMember;

  return (
    <li
      className={
        isChecked
          ? 'flex justify-between items-center h-16 bg-white rounded my-1 border-primaryBeige border-4'
          : 'flex justify-between items-center h-16 bg-white rounded my-1'
      }
    >
      <div className="flex items-center">
        <span
          className={
            isChecked
              ? 'ml-1.5 mr-2.5 flex items-center'
              : 'mx-2.5 flex items-center'
          }
        >
          <Image src={avatar} width="30px" height="30px" />
        </span>
        <span className="text-primaryGray text-15px">{name}</span>
      </div>
      <input
        type="checkbox"
        className={isChecked ? 'mx-4' : 'mx-5'}
        id={name}
        name={name}
        checked={isChecked}
        onChange={onSwitchChecked}
      />
    </li>
  );
};

export default OrgMemberCard;
