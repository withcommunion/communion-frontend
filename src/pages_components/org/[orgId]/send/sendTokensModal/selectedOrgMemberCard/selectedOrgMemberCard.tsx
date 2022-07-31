import { User } from '@/util/walletApiUtil';
import Image from 'next/image';

interface Props {
  selectedUser: User;
  removeSelectedUser: () => void;
}
const selectedMemberCard = ({ selectedUser, removeSelectedUser }: Props) => {
  const { first_name, last_name } = selectedUser;

  return (
    <li className="flex items-center justify-between my-6">
      <div className="flex items-center">
        <Image
          src={'/images/send/avatar.svg'}
          width="30px"
          height="30px"
          alt="person icon"
        />
        <span className="text-primaryGray text-5 font-semibold pl-2">
          {first_name} {last_name}
        </span>
      </div>
      <Image
        onClick={() => removeSelectedUser()}
        src="/images/delete.svg"
        width="30px"
        height="30px"
        alt="delete icon"
      />
    </li>
  );
};

export default selectedMemberCard;
