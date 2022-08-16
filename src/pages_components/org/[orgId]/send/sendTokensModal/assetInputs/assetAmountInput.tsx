import Image from 'next/image';
import cx from 'classnames';
import { useAppSelector } from '@/reduxHooks';
import { selectIsManagerModeActive } from '@/features/organization/organizationSlice';

interface Props {
  amount: number;
  tokenSymbol: string;
  onChange: (value: number) => void;
}
const AssetAmountInput = ({ amount, tokenSymbol, onChange }: Props) => {
  const isManagerModeActive = useAppSelector((state) =>
    selectIsManagerModeActive(state)
  );
  return (
    <div
      className={cx(
        'my-15px rounded-4px  bg-secondaryLightGray p-15px',
        { 'border-1px border-thirdLightGray': !isManagerModeActive },
        { 'border-1px border-primaryOrange': isManagerModeActive }
      )}
    >
      <div className="flex items-center justify-between pb-15px">
        <span className="text-15px text-primaryGray ">Amount</span>
        {/**TODO: Add "max" */}
        {/* <button className="rounded-3px border-1px border-thirdOrange w-12 h-7">
          <span className="text-fourthOrange text-12px">Max</span>
        </button> */}
      </div>
      <div className="flex items-center justify-between border-1px border-thirdLightGray bg-white py-6 pl-5 pr-4">
        <input
          className="w-full border-1px border-thirdLightGray bg-white py-2 pl-5 pr-4 text-primaryPurple"
          type="number"
          min="0"
          max={1000}
          step="1"
          onFocus={() => {
            if (amount === 0) {
              // @ts-expect-error it's okay
              onChange('');
            }
          }}
          onChange={(event) => {
            const value = parseInt(event.target.value || '0');
            onChange(value);
          }}
          value={amount}
        />

        <div>
          <span className="mx-15px text-17px font-light text-fourthGray">
            {tokenSymbol}
          </span>
          <Image
            src="/images/send/asses/swap.svg"
            width="14px"
            height="16px"
            alt="select different token arrows"
          />
        </div>
      </div>
    </div>
  );
};

export default AssetAmountInput;
