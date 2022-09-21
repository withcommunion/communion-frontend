import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAppSelector } from '@/reduxHooks';
import { CommunionNft } from '@/util/walletApiUtil';
import BackToButton from '@/shared_components/backToButton/BackToButton';
import NftGridDisplayList from '@/pages_components/org/[orgId]/send/nft/nftGridDisplayList/nftGridDisplayList';
import SelectedNftComponent from '@/pages_components/org/[orgId]/send/nft/selectedNftComponent/selectedNftComponent';
import { selectAvailableNfts } from '@/features/organization/organizationSlice';

const SelectNftContainer = () => {
  const router = useRouter();
  const { orgId } = router.query;
  const [selectedItem, setSelectedItem] = useState<CommunionNft | null>(null);
  const [nftActive, setNftActive] = useState<number | null>(null);
  const availableNfts = useAppSelector((state) => selectAvailableNfts(state));

  useEffect(() => {
    if (availableNfts && availableNfts.length > 0) {
      setSelectedItem(availableNfts[0]);
    }
  }, [availableNfts]);

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
        availableNfts={availableNfts || []}
        onNftClick={onNftClick}
        nftActive={nftActive}
      />
    </div>
  );
};

export default SelectNftContainer;
