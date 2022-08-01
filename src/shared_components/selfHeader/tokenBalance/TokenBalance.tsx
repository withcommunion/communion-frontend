import Image from 'next/image';

interface Props {
  tokenAmount?: number | string | null;
  tokenSymbol?: string;
  isBalanceLoading?: boolean;
  isExpanded?: boolean;
}
const TokenBalance = ({
  tokenAmount,
  tokenSymbol,
  isBalanceLoading,
  isExpanded,
}: Props) => {
  return (
    <div className="bg-primaryLightGray rounded-md flex justify-between items-center px-4 py-4 font-normal">
      <span className="text-4 text-secondaryGray">Your Balance</span>
      <div className="flex rounded-lg bg-white px-4 py-3 w-44">
        <div className={isExpanded ? 'rotate-90' : 'rotate-0'}>
          <Image
            src="/images/home/Arrow.svg"
            alt="arrow"
            width="9px"
            height="16px"
          />
        </div>
        {isBalanceLoading && <span>♻️</span>}
        <span className="text-17px text-primaryPurple px-3">
          {tokenAmount} {tokenSymbol}
        </span>
      </div>
    </div>
  );
};

export default TokenBalance;
