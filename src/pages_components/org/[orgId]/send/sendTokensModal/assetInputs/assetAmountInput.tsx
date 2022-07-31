import Image from 'next/image';

interface Props {
  amount: number;
  tokenSymbol: string;
  onChange: (value: number) => void;
}
const AssetAmountInput = ({ amount, tokenSymbol, onChange }: Props) => {
  return (
    <div className="rounded-4px bg-secondaryLightGray border-1px border-thirdLightGray p-15px my-15px">
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
          onChange={(event) => onChange(parseInt(event.target.value || '0'))}
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
