import Image from 'next/image';

const AssetSelectorInput = () => {
  return (
    <div className="rounded-4px bg-secondaryLightGray border-1px border-thirdLightGray p-15px my-15px">
      <div className="flex justify-between items-center pb-15px">
        <span className="text-15px text-primaryGray ">Asset</span>
        <div className="flex items-center">
          <span className="px-1 font-light text-secondaryPurple text-3">
            Balance:
          </span>
          <span className="text-3 text-primaryPurple">0.0475938368 ETH</span>
        </div>
      </div>
      <div className="bg-white border-thirdLightGray border-1px pl-5 pr-4 py-6 flex justify-between items-center">
        <span className="text-primaryPurple">P</span>
        <div>
          <span className="font-light text-17px mx-15px text-fourthGray">
            PPP
          </span>
          <Image src="/images/send/asses/arrow.svg" width="14px" height="8px" />
        </div>
      </div>
    </div>
  );
};
export default AssetSelectorInput;
