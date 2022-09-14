import Image from 'next/image';
import PrimaryButton from '@/shared_components/buttons/primaryButton';
import { CommunionNft } from '@/shared_components/nftTrophyDisplay/nftTrophyDisplay';

interface Props {
  onCloseSelected: () => void;
  selectedItem: CommunionNft;
}

const SelectedNftComponent = ({ onCloseSelected, selectedItem }: Props) => {
  return (
    <div className="mb-14px h-full w-full rounded-xl border-4 border-twelfthLightGray bg-white">
      <div className="relative mb-5 h-255px w-full">
        <button
          className="absolute right-4 top-3 z-10"
          onClick={onCloseSelected}
        >
          <Image src="/images/exit.svg" alt="exit" width={12} height={12} />
        </button>
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
  );
};

export default SelectedNftComponent;
