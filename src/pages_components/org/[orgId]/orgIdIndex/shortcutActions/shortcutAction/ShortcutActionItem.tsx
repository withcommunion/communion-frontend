import Link from 'next/link';
import Image from 'next/image';
import { OrgAction } from '@/util/walletApiUtil';

interface Props {
  orgId: string;
  action: OrgAction;
  imageUrl: string;
  onClick: () => void;
}

const ShortcutAction = ({ action, imageUrl, orgId, onClick }: Props) => {
  const { name, amount } = action;
  return (
    <li onClick={onClick}>
      <Link href={`/org/${orgId}/send`}>
        <a className="text-primaryGray my-2.5 bg-white justify-between rounded-xl flex items-center px-4">
          <div className="flex items-center">
            <span className="font-bold text-45px mr-3 py-4">{amount}</span>
            <div className="flex flex-col">
              <span className="font-normal text-[#B0B2D6] ">Token Tip</span>
              <span className="font-semibold">{name}</span>
            </div>
          </div>
          <Image src={imageUrl} alt={name} width="82px" height="82px" />
        </a>
      </Link>
    </li>
  );
};

export default ShortcutAction;
