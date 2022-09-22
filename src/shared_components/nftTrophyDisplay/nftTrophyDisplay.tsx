import axios from 'axios';
import Image from 'next/image';

import { useState, useEffect } from 'react';

import { Erc721Nft, MintedNftDetails } from '@/util/walletApiUtil';

interface Props {
  nftDetails?: MintedNftDetails[];
  showcaseNft: Erc721Nft | null;
}

export const fetchNfts = async (urls: string[]) => {
  const responses = await Promise.all(
    urls.map((url) => {
      return axios.get<Erc721Nft>(url);
    })
  );
  const nfts = responses.map((response) => response.data);
  return nfts;
};

export default function NftTrophyDisplay({
  nftDetails = [],
  showcaseNft = null,
}: Props) {
  const [nfts, setNfts] = useState<Erc721Nft[] | undefined>(undefined);

  useEffect(() => {
    const setNftsHelper = async (nftsToFetch: MintedNftDetails[]) => {
      const urls = nftsToFetch.map((nft) => nft.mintedNftUri);
      const nfts = await fetchNfts(urls);
      setNfts(nfts);
    };

    if (!nfts && nftDetails.length > 0) {
      setNftsHelper(nftDetails);
    }
  }, [nftDetails, nfts]);

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex items-center justify-start rounded bg-white shadow-nftTrophyShadow">
        {nfts && nfts.length > 1 ? (
          <Image
            width="75%"
            height="75%"
            src={nfts[1].image}
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
        {nfts && nfts.length > 0 ? (
          <Image
            width="100%"
            height="100%"
            src={showcaseNft ? showcaseNft.image : nfts[0].image}
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
        {nfts && nfts.length === 3 ? (
          <Image
            width="75%"
            height="75%"
            src={nfts[2].image}
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
