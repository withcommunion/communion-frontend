import Image from 'next/image';

interface Props {
  onClick: () => void;
}

const SendPageHeader = ({ onClick }: Props) => {
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
      <button
        className="rounded border-2 border-eighthOrange px-14px py-1 text-sm font-medium text-eighthOrange"
        onClick={onClick}
      >
        Send NFTs
      </button>
    </div>
  );
};

export default SendPageHeader;
