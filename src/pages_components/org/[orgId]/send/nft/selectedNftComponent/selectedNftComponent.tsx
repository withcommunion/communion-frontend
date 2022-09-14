import Image from 'next/image';
import PrimaryButton from '@/shared_components/buttons/primaryButton';
import { CommunionNft } from '@/shared_components/nftTrophyDisplay/nftTrophyDisplay';

interface Props {
  selectedItem: CommunionNft;
}

const SelectedNftComponent = ({ selectedItem }: Props) => {
  return (
    <div className="w-full">
      <div className="mb-14px rounded-xl border-4 border-twelfthLightGray bg-white sm:h-full sm:w-full">
        <div className="relative mb-5 h-255px w-full ">
          <Image
            src={selectedItem.erc721Meta.properties.image}
            alt="nft image"
            width="100%"
            height="100%"
            layout="fill"
            objectFit="fill"
          />
          <div className="absolute -bottom-4 right-2 flex w-full justify-end">
            {selectedItem.erc721Meta.properties.attributes.map(
              (attributes, num) => (
                <div
                  key={num}
                  className="mx-1 flex flex-col items-center justify-center
                              rounded
                              border-2 border-seventhBeige bg-eighthOrange py-1.5 px-2 text-10px font-semibold uppercase text-white"
                >
                  <span className="text-center">{attributes.value} more</span>
                  <span className="text-center">
                    {attributes.trait_type} tokens
                  </span>
                </div>
              )
            )}
          </div>
        </div>
        <div className="text-primaryGray">
          <h2 className="mb-2 px-7 text-lg font-semibold uppercase">
            {selectedItem.erc721Meta.properties.name}
          </h2>
          <p className="break-words px-7 text-sm">
            {selectedItem.erc721Meta.properties.description}
          </p>
          <div className="mt-3 mb-4 flex justify-center">
            <PrimaryButton
              text={'Send'}
              onClick={() => {
                console.log('hi3');
              }}
              size={'middle'}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectedNftComponent;
