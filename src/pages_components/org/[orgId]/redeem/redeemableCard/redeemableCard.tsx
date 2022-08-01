import { OrgRedeemable } from '@/util/walletApiUtil';
import Image from 'next/image';
export interface ICommunityMembers {
  id: number;
  avatar: string;
  name: string;
  isChecked?: boolean;
}
interface Props {
  redeemable: OrgRedeemable;
  toggleChecked: () => void;
  isChecked: boolean;
}

const RedeemableCard = ({ redeemable, toggleChecked, isChecked }: Props) => {
  const { name, amount } = redeemable;

  return (
    <li
      className={
        isChecked
          ? 'flex items-center h-16 bg-white rounded my-1 border-primaryBeige border-4'
          : 'flex items-center h-16 bg-white rounded my-1'
      }
      onClick={toggleChecked}
    >
      <div className="flex grow items-center">
        <span
          className={
            isChecked
              ? 'ml-1.5 mr-2.5 flex items-center'
              : 'mx-2.5 flex items-center'
          }
        >
          <Image
            src={'/images/send/gift.svg'}
            width="22px"
            height="22px"
            alt="gift"
          />
        </span>
        <span className="text-primaryGray text-15px">{name}</span>
      </div>

      <div className="flex items-center">
        <span className="text-primaryGray text-15px">{amount}</span>
        <input
          type="checkbox"
          className={isChecked ? 'mx-4' : 'mx-5'}
          checked={isChecked}
          onChange={() => undefined}
        ></input>
      </div>
    </li>
  );
};

export default RedeemableCard;
