import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import BackToButton from '@/shared_components/backToButton/BackToButton';
import { CommunionNft } from '@/shared_components/nftTrophyDisplay/nftTrophyDisplay';
import NftGridDisplayList from '@/pages_components/org/[orgId]/send/nft/nftGridDisplayList/nftGridDisplayList';
import SelectedNftComponent from '@/pages_components/org/[orgId]/send/nft/selectedNftComponent/selectedNftComponent';

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

const SelectNftContainer = () => {
  useEffect(() => {
    setSelectedItem(availableNfts[0]);
  }, []);

  const router = useRouter();
  const { orgId } = router.query;
  const [selectedItem, setSelectedItem] = useState<CommunionNft | null>(null);
  const [nftActive, setNftActive] = useState<number | null>(null);

  const onNftClick = useCallback((num: number, nft: CommunionNft) => {
    setNftActive(num);
    setSelectedItem(nft);
  }, []);

  return (
    <div>
      <Link href={`/org/${(orgId || '').toString()}/send`}>
        <div className="w-fit">
          <BackToButton onClick={() => true} backToDestinationText={'Send'} />
        </div>
      </Link>
      {selectedItem && <SelectedNftComponent selectedItem={selectedItem} />}
      <NftGridDisplayList
        availableNfts={availableNfts}
        onNftClick={onNftClick}
        nftActive={nftActive}
      />
    </div>
  );
};

export default SelectNftContainer;
