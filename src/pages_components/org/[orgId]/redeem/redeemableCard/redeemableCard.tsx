import { OrgRedeemable } from '@/util/walletApiUtil';
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
        <div
          className={`absolute w-1 h-30px bg-primaryYellow ${
            isChecked ? '-left-1' : 'left-0'
          }`}
        ></div>
        <span
          className={`text-primaryGray text-15px ml-30px ${
            isChecked ? 'ml-26px' : 'ml-30px'
          }`}
        >
          {name}
        </span>
      </div>

      <div className="flex items-center">
        <span
          className={`text-primaryPurple text-15px font-semibold ${
            isChecked ? 'mr-1' : ''
          }`}
        >
          {amount}
        </span>
        <input
          type="checkbox"
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
          checked={isChecked}
          onChange={() => undefined}
        ></input>
      </div>
    </li>
  );
};

export default RedeemableCard;
