import Image from 'next/image';
import Link from 'next/link';

interface Props {
  activeOrgId: string;
  isManagerModeActive: boolean;
}

const SendPageHeader = ({ activeOrgId, isManagerModeActive }: Props) => {
  return (
    <div className="flex justify-between py-5">
      <div className="flex text-center">
        <Image
          src="/images/send/gift.svg"
          alt="gift"
          width="19px"
          height="21px"
        />
        <h2 className="mx-2 text-19px font-medium text-primaryPurple">
          Send Token Tips
        </h2>
      </div>
      {isManagerModeActive && (
        <button className="rounded border-2 border-eighthOrange px-14px py-1 text-sm font-medium text-eighthOrange">
          <Link href={`/org/${activeOrgId}/send/nft`}>Send NFTs</Link>
        </button>
      )}
    </div>
  );
};

export default SendPageHeader;
