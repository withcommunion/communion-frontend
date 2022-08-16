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
          ? 'my-1 flex h-16 items-center rounded border-4 border-primaryBeige bg-white'
          : 'my-1 flex h-16 items-center rounded bg-white'
      }
      onClick={toggleChecked}
    >
      <div className="relative flex grow items-center">
        <div
          className={`absolute h-30px w-1 bg-primaryYellow ${
            isChecked ? '-left-1' : 'left-0'
          }`}
        ></div>
        <span
          className={`ml-30px text-15px text-primaryGray ${
            isChecked ? 'ml-26px' : 'ml-30px'
          }`}
        >
          {name}
        </span>
      </div>

      <div className="flex items-center">
        <span
          className={`text-15px font-semibold text-primaryPurple ${
            isChecked ? 'mr-1' : ''
          }`}
        >
          {amount}
        </span>
        <input
          type="checkbox"
          className={`${isChecked ? 'mx-4' : 'mx-5'} relative
          inline-flex
          h-4
          w-4
          cursor-pointer
          appearance-none items-center
          justify-center
          rounded
          border-1px border-secondaryPurple bg-secondaryLightGray text-center transition-all
          after:absolute
          after:h-2.5
          after:w-1.5
          checked:bg-secondaryLightGray
          checked:after:rotate-45
          checked:after:rounded-md
          checked:after:border-b-[3px] checked:after:border-r-[3px]
          checked:after:border-primaryPurple`}
          checked={isChecked}
          onChange={() => undefined}
        ></input>
      </div>
    </li>
  );
};

export default RedeemableCard;
