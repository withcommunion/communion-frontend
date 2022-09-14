import Image from 'next/image';

export interface CommunionNft {
  erc721Meta: {
    title: string;
    properties: {
      name: string;
      description: string;
      image: string;
      attributes: {
        display_type: number;
        trait_type: string;
        value: number;
      }[];
    };
  };
}

interface Props {
  nfts: CommunionNft[];
  showcaseNft: CommunionNft | null;
}

export default function NftTrophyDisplay({
  nfts = [],
  showcaseNft = null,
}: Props) {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex items-center justify-start rounded bg-white shadow-nftTrophyShadow">
        {nfts.length > 1 ? (
          <Image
            width="75%"
            height="75%"
            src={nfts[1].erc721Meta.properties.image}
            alt="nftTrophy image"
          />
        ) : (
          <div className="relative -left-20% flex items-center">
            <Image
              width="85%"
              height="75%"
              src={'/images/nftTrophyDisplay/Car.png'}
              alt="nftTrophy image"
            />
          </div>
        )}
      </div>
      <div className="z-10 flex items-center justify-center rounded bg-white shadow-nftTrophyShadow">
        {nfts.length > 0 ? (
          <Image
            width="100%"
            height="100%"
            src={
              showcaseNft
                ? showcaseNft.erc721Meta.properties.image
                : nfts[0].erc721Meta.properties.image
            }
            alt="nftTrophy image"
          />
        ) : (
          <Image
            width="100%"
            height="100%"
            src={'/images/nftTrophyDisplay/clock.png'}
            alt="nftTrophy image"
          />
        )}
      </div>
      <div className="relative flex items-center justify-end rounded bg-white shadow-nftTrophyShadow">
        {nfts.length === 3 ? (
          <Image
            width="75%"
            height="75%"
            src={nfts[2].erc721Meta.properties.image}
            alt="nftTrophy image"
          />
        ) : (
          <div className="relative -right-20% flex items-center">
            <Image
              width="85%"
              height="75%"
              src={'/images/nftTrophyDisplay/Airplane.png'}
              alt="nftTrophy image"
            />
          </div>
        )}
      </div>
    </div>
  );
}
