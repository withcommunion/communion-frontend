import { OrgRedeemable } from '@/util/walletApiUtil';
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
      <div className="relative flex grow items-center">
        <div className={`absolute w-1 h-30px bg-primaryYellow ${isChecked?'-left-1':'left-0'}`}></div>
        <span className={`text-primaryGray text-15px ml-30px ${isChecked?'ml-26px':'ml-30px'}`}>{name}</span>
      </div>

      <div className="flex items-center">
        <span className={`text-primaryPurple text-15px font-semibold ${isChecked?'mr-1':''}`}>{amount}</span>
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
