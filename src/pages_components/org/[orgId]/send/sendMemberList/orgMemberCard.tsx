import { User } from '@/util/walletApiUtil';
import Image from 'next/image';

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
        checked={isChecked}
        onChange={() => undefined}
        className={`${isChecked ? 'mx-4' : 'mx-5'} appearance-none
          relative
          bg-secondaryLightGray
          border-1px
          border-secondaryPurple
          h-4 w-4
          cursor-pointer
          transition-all
          rounded inline-flex text-center justify-center items-center
          checked:bg-secondaryLightGray
          checked:after:border-b-[3px]
          checked:after:border-primaryPurple
          checked:after:border-r-[3px]
          checked:after:rotate-45
          checked:after:rounded-md
          after:h-2.5 after:w-1.5
          after:absolute`}
      />
    </li>
  );
};

export default OrgMemberCard;
