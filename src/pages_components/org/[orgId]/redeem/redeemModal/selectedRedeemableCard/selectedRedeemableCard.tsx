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
    <li className=" relative pt-2 pb-4 pl-4 pr-3 bg-secondaryLightGray border-1px border-thirdLightGray rounded mb-2.5">
      <div className="absolute w-1 h-30px bg-primaryYellow left-0 top-7"></div>
      <div className="flex justify-end items-center">
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
          <span className="text-15px text-fifthLightGray ml-2">Remove</span>
        </button>
      </div>
      <div className="mb-2">
        <span className="text-primaryGray font-semibold text-19px">{name}</span>
      </div>
      <div className="bg-white border-thirdLightGray rounded grid grid-cols-5 border-1px">
        <div className="text-primaryGray text-17px px-14px border-r-1px border-thirdLightGray flex items-center col-span-3">
          {amount} {tokenSymbol}
        </div>
        <div className="px-3 py-2 col-span-2">
          <span className="text-primaryGray font-medium text-19px">1</span>
        </div>
      </div>
    </li>
  );
};

export default selectedMemberCard;
