import Image from 'next/image';

const AssetSelectorInput = () => {
  return (
    <div className="my-15px rounded-4px border-1px border-thirdLightGray bg-secondaryLightGray p-15px">
      <div className="flex items-center justify-between pb-15px">
        <span className="text-15px text-primaryGray ">Asset</span>
        <div className="flex items-center">
          <span className="text-3 px-1 font-light text-secondaryPurple">
            Balance:
          </span>
          <span className="text-3 text-primaryPurple">0.0475938368 ETH</span>
        </div>
      </div>
      <div className="flex items-center justify-between border-1px border-thirdLightGray bg-white py-6 pl-5 pr-4">
        <span className="text-primaryPurple">P</span>
        <div>
          <span className="mx-15px text-17px font-light text-fourthGray">
            PPP
          </span>
          <Image
            src="/images/send/asses/arrow.svg"
            width="14px"
            height="8px"
            alt="select more down arrow"
          />
        </div>
      </div>
    </div>
  );
};

export default AssetSelectorInput;
