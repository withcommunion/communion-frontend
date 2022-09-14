import { CommunionNft } from '@/shared_components/nftTrophyDisplay/nftTrophyDisplay';
import Image from 'next/image';

interface Props {
  availableNfts: CommunionNft[];
  onNftClick: (num: number, nft: CommunionNft) => void;
  nftActive: number | null;
}

const NftGridDisplayList = ({
  availableNfts,
  onNftClick,
  nftActive,
}: Props) => {
  return (
    <div className="flex flex-wrap justify-center gap-3">
      {availableNfts.map((nft: CommunionNft, num) => (
        <button
          key={num}
          className={`h-100px w-100px rounded-md ${
            nftActive === num ? 'bg-eighthOrange p-1.5' : ''
          }`}
          onClick={() => onNftClick(num, nft)}
        >
          <Image
            className="rounded-md"
            src={nft.erc721Meta.properties.image}
            alt="nft image"
            width={100}
            height={100}
          />
        </button>
      ))}
    </div>
  );
};

export default NftGridDisplayList;
