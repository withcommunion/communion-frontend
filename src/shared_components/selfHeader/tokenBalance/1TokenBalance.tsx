import Image from 'next/image';
import cx from 'classnames';
import { useAppSelector } from '@/reduxHooks';
import { selectIsManagerModeActive } from '@/features/organization/organizationSlice';

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
  const isManagerModeActive = useAppSelector((state) =>
    selectIsManagerModeActive(state)
  );
  return (
    <div
      className={cx(
        'flex items-center justify-between rounded-md bg-primaryLightGray px-4 py-4 font-normal',
        { 'border border-primaryOrange': isManagerModeActive }
      )}
    >
      <span className="text-4 text-secondaryGray">
        {isManagerModeActive ? 'Bank Balance' : 'Your Balance'}
      </span>
      <div className="flex w-44 rounded-lg bg-white px-4 py-3">
        <div className={isExpanded ? 'rotate-90' : 'rotate-0'}>
          <Image
            src="/images/home/Arrow.svg"
            alt="arrow"
            width="9px"
            height="16px"
          />
        </div>
        {isBalanceLoading && <span>♻️</span>}
        <span className="px-3 text-17px text-primaryPurple">
          {isManagerModeActive ? '--' : tokenAmount} {tokenSymbol}
        </span>
      </div>
    </div>
  );
};

export default TokenBalance;
