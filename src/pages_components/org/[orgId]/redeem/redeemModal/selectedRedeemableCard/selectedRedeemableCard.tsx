import { OrgRedeemableInCart } from '@/features/cart/cartSlice';
import Image from 'next/image';

interface Props {
  selectedRedeemable: OrgRedeemableInCart;
  removeSelectedRedeemable: () => void;
  tokenSymbol: string;
}
const selectedMemberCard = ({
  selectedRedeemable,
  removeSelectedRedeemable,
  tokenSymbol,
}: Props) => {
  const { name, amount } = selectedRedeemable;

  return (
    <li className=" relative mb-2.5 rounded border-1px border-thirdLightGray bg-secondaryLightGray pt-2 pb-4 pl-4 pr-3">
      <div className="absolute left-0 top-7 h-30px w-1 bg-primaryYellow"></div>
      <div className="flex items-center justify-end">
        <button
          onClick={() => removeSelectedRedeemable()}
          className="flex items-center"
        >
          <Image
            src="/images/darkDelete.svg"
            width="20px"
            height="20px"
            alt="delete icon"
          />
          <span className="ml-2 text-15px text-fifthLightGray">Remove</span>
        </button>
      </div>
      <div className="mb-2">
        <span className="text-19px font-semibold text-primaryGray">{name}</span>
      </div>
      <div className="grid grid-cols-5 rounded border-1px border-thirdLightGray bg-white">
        <div className="col-span-3 flex items-center border-r-1px border-thirdLightGray px-14px text-17px text-primaryGray">
          {amount} {tokenSymbol}
        </div>
        <div className="col-span-2 px-3 py-2">
          <span className="text-19px font-medium text-primaryGray">1</span>
        </div>
      </div>
    </li>
  );
};

export default selectedMemberCard;
