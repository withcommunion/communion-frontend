import { OrgRedeemableInCart } from '@/features/cart/cartSlice';
import Image from 'next/image';

interface Props {
  selectedRedeemable: OrgRedeemableInCart;
  removeSelectedRedeemable: () => void;
}
const selectedMemberCard = ({
  selectedRedeemable,
  removeSelectedRedeemable,
}: Props) => {
  const { name, amount } = selectedRedeemable;

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
          {name} {amount}
        </span>
      </div>
      <Image
        onClick={() => removeSelectedRedeemable()}
        src="/images/delete.svg"
        width="30px"
        height="30px"
        alt="delete icon"
      />
    </li>
  );
};

export default selectedMemberCard;
