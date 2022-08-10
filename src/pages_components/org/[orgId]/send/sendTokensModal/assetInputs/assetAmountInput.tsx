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
        'rounded-4px bg-secondaryLightGray  p-15px my-15px',
        { 'border-1px border-thirdLightGray': !isManagerModeActive },
        { 'border-1px border-primaryOrange': isManagerModeActive }
      )}
    >
      <div className="flex justify-between items-center pb-15px">
        <span className="text-15px text-primaryGray ">Amount</span>
        {/**TODO: Add "max" */}
        {/* <button className="rounded-3px border-1px border-thirdOrange w-12 h-7">
          <span className="text-fourthOrange text-12px">Max</span>
        </button> */}
      </div>
      <div className="bg-white border-thirdLightGray border-1px pl-5 pr-4 py-6 flex justify-between items-center">
        <input
          className="text-primaryPurple bg-white w-full border-thirdLightGray border-1px pl-5 pr-4 py-2"
          type="number"
          min="0"
          step="1"
          onFocus={() => {
            if (amount === 0) {
              // @ts-expect-error it's okay
              onChange('');
            }
          }}
          onChange={(event) => {
            onChange(parseInt(event.target.value || '0'));
          }}
          value={amount}
        />

        <div>
          <span className="font-light text-17px mx-15px text-fourthGray">
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
