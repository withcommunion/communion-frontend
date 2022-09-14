import BackToButton from '@/shared_components/backToButton/BackToButton';
import { CommunionNft } from '@/shared_components/nftTrophyDisplay/nftTrophyDisplay';
import { useEffect, useState, useCallback } from 'react';
import NftGridDisplayList from '@/pages_components/org/[orgId]/send/nft/nftGridDisplayList/nftGridDisplayList';
import SelectedNftComponent from '@/pages_components/org/[orgId]/send/nft/selectedNftComponent/selectedNftComponent';

interface Props {
  selectedNft: CommunionNft | null;
}

const SendNft = ({ selectedNft }: Props) => {
  useEffect(() => {
    setSelectedItem(selectedNft);
  }, []);

  const availableNfts: CommunionNft[] = [
    {
      erc721Meta: {
        title: 'tittle',
        properties: {
          name: 'name',
          description:
            'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dignissimos, ullam!',
          image: '/images/nftTrophyDisplay/nft1.png',
          attributes: [
            {
              display_type: 1,
              trait_type: 'string',
              value: 1,
            },
          ],
        },
      },
    },
    {
      erc721Meta: {
        title: 'tittle',
        properties: {
          name: 'name',
          description:
            'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dignissimos, ullam!',
          image: '/images/nftTrophyDisplay/nft1.png',
          attributes: [
            {
              display_type: 1,
              trait_type: 'string',
              value: 1,
            },
          ],
        },
      },
    },
    {
      erc721Meta: {
        title: 'tittle',
        properties: {
          name: 'name',
          description:
            'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dignissimos, ullam!',
          image: '/images/nftTrophyDisplay/nft1.png',
          attributes: [
            {
              display_type: 1,
              trait_type: 'string',
              value: 1,
            },
          ],
        },
      },
    },
    {
      erc721Meta: {
        title: 'tittle',
        properties: {
          name: 'name',
          description:
            'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dignissimos, ullam!',
          image: '/images/nftTrophyDisplay/nft1.png',
          attributes: [
            {
              display_type: 1,
              trait_type: 'string',
              value: 1,
            },
          ],
        },
      },
    },
    {
      erc721Meta: {
        title: 'tittle',
        properties: {
          name: 'name',
          description:
            'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dignissimos, ullam!',
          image: '/images/nftTrophyDisplay/nft1.png',
          attributes: [
            {
              display_type: 1,
              trait_type: 'string',
              value: 1,
            },
          ],
        },
      },
    },
    {
      erc721Meta: {
        title: 'tittle',
        properties: {
          name: 'name',
          description:
            'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dignissimos, ullam!',
          image: '/images/nftTrophyDisplay/nft1.png',
          attributes: [
            {
              display_type: 1,
              trait_type: 'string',
              value: 1,
            },
          ],
        },
      },
    },
    {
      erc721Meta: {
        title: 'tittle',
        properties: {
          name: 'name',
          description:
            'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dignissimos, ullam!',
          image: '/images/nftTrophyDisplay/nft1.png',
          attributes: [
            {
              display_type: 1,
              trait_type: 'string',
              value: 1,
            },
          ],
        },
      },
    },
    {
      erc721Meta: {
        title: 'tittle',
        properties: {
          name: 'name',
          description:
            'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dignissimos, ullam!',
          image: '/images/nftTrophyDisplay/nft1.png',
          attributes: [
            {
              display_type: 1,
              trait_type: 'string',
              value: 1,
            },
          ],
        },
      },
    },
  ];

  const [selectedItem, setSelectedItem] = useState<CommunionNft | null>(null);
  const [nftActive, setNftActive] = useState<number | null>(null);

  const onNftClick = useCallback((num: number, nft: CommunionNft) => {
    setNftActive(num);
    setSelectedItem(nft);
  }, []);

  const onCloseSelected = () => {
    setSelectedItem(null);
    setNftActive(null);
  };

  return (
    <div className=" min-h-100vh w-full bg-secondaryLightGray">
      <div className="w-full bg-secondaryLightGray pb-1 md:max-w-50vw">
        <BackToButton
          onClick={() => console.log('hi2')}
          backToDestinationText={'NFTs'}
        />
        {selectedItem && (
          <SelectedNftComponent
            onCloseSelected={onCloseSelected}
            selectedItem={selectedItem}
          />
        )}
        <NftGridDisplayList
          availableNfts={availableNfts}
          onNftClick={onNftClick}
          nftActive={nftActive}
        />
      </div>
    </div>
  );
};

export default SendNft;
