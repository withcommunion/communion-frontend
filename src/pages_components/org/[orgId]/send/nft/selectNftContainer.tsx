import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAppSelector, useAppDispatch } from '@/reduxHooks';
import BackToButton from '@/shared_components/backToButton/BackToButton';
import NftGridDisplayList from '@/pages_components/org/[orgId]/send/nft/nftGridDisplayList/nftGridDisplayList';
import SelectedNftComponent from '@/pages_components/org/[orgId]/send/nft/selectedNftComponent/selectedNftComponent';
import {
  selectAvailableNfts,
  selectOrgUsersSortedByName,
} from '@/features/organization/organizationSlice';
import OrgMemberCard from '../sendMemberList/orgMemberCard';
import {
  clearedSelectedUser,
  selectedNftUpdated,
  selectedUserUpdated,
  selectSelectedNft,
  selectSelectedUser,
} from '@/features/sendNft/sendNftSlice';
import { BottomStickyButton } from '../../sendComponents';

const SelectNftContainer = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { orgId } = router.query;
  const orgUsers = useAppSelector((state) => selectOrgUsersSortedByName(state));
  const availableNfts = useAppSelector((state) => selectAvailableNfts(state));
  const selectedUser = useAppSelector((state) => selectSelectedUser(state));
  const selectedNft = useAppSelector((state) => selectSelectedNft(state));

  const [currentStep, setCurrentStep] = useState<
    'selectNft' | 'selectUser' | 'confirm' | 'success' | 'error'
  >('selectNft');

  useEffect(() => {
    if (availableNfts) {
      dispatch(selectedNftUpdated(availableNfts[0]));
    }
  }, [availableNfts, dispatch]);

  return (
    <div>
      <Link href={`/org/${(orgId || '').toString()}/send`}>
        <div className="w-fit">
          <BackToButton onClick={() => true} backToDestinationText={'Send'} />
        </div>
      </Link>
      {currentStep === 'selectNft' && (
        <>
          {selectedNft && (
            <SelectedNftComponent
              selectedItem={selectedNft}
              onSendClick={() => setCurrentStep('selectUser')}
            />
          )}
          <NftGridDisplayList
            availableNfts={availableNfts || []}
            onNftClick={(nft) => {
              dispatch(selectedNftUpdated(nft));
            }}
            activeNft={selectedNft}
          />
        </>
      )}

      {currentStep === 'selectUser' && (
        <>
          <ul className="my-4">
            {orgUsers.map((user) => {
              const isUserSelected = Boolean(selectedUser?.id === user.id);
              return (
                <OrgMemberCard
                  key={user.id}
                  userInOrg={user}
                  toggleChecked={() => {
                    isUserSelected
                      ? dispatch(clearedSelectedUser)
                      : dispatch(selectedUserUpdated(user));
                  }}
                  isChecked={isUserSelected}
                />
              );
            })}
          </ul>
          <BottomStickyButton
            onCancelClick={() => {
              dispatch(clearedSelectedUser);
            }}
            onPrimaryClick={() => {
              setCurrentStep('confirm');
            }}
          />
        </>
      )}
    </div>
  );
};

export default SelectNftContainer;
