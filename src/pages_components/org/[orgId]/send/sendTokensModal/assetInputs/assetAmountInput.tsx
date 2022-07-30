import Image from 'next/image';

const AssetAmountInput = () => {
  return (
    <div className="rounded-4px bg-secondaryLightGray border-1px border-thirdLightGray p-15px my-15px">
      <div className="flex justify-between items-center pb-15px">
        <span className="text-15px text-primaryGray ">Amount</span>
        <button className="rounded-3px border-1px border-thirdOrange w-12 h-7">
          <span className="text-fourthOrange text-12px">Max</span>
        </button>
      </div>
      <div className="bg-white border-thirdLightGray border-1px pl-5 pr-4 py-6 flex justify-between items-center">
        <span className="text-primaryPurple">10</span>
        <div>
          <span className="font-light text-17px mx-15px text-fourthGray">
            PPP
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
