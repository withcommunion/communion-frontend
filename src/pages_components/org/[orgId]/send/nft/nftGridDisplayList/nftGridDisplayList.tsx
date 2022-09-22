import { CommunionNft } from '@/util/walletApiUtil';
import Image from 'next/image';

interface Props {
  availableNfts: CommunionNft[];
  onNftClick: (nft: CommunionNft) => void;
  activeNft: CommunionNft | null;
}

const NftGridDisplayList = ({
  availableNfts,
  onNftClick,
  activeNft,
}: Props) => {
  return (
    <div className="mx-auto flex flex-wrap justify-center gap-3 md:w-full lg:w-70% xl:w-60% 2xl:w-50%">
      {availableNfts.map((nft: CommunionNft, num) => {
        const isActiveNft = activeNft?.id === nft.id;
        return (
          <button
            key={num}
            className={`h-100px w-100px rounded-md ${
              isActiveNft ? 'bg-eighthOrange p-1.5' : ''
            }`}
            onClick={() => onNftClick(nft)}
          >
            <Image
              className="rounded-md"
              src={nft.erc721Meta.properties.image}
              alt="nft image"
              width={100}
              height={100}
            />
          </button>
        );
      })}
    </div>
  );
};

export default NftGridDisplayList;
