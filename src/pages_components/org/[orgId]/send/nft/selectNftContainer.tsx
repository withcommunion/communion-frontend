import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAppSelector, useAppDispatch } from '@/reduxHooks';
import BackToButton from '@/shared_components/backToButton/BackToButton';
import PrimaryButton from '@/shared_components/buttons/primaryButton';
import SecondaryButton from '@/shared_components/buttons/secondaryButton';
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
  selectLatestTxnStatus,
  fetchSendNft,
} from '@/features/sendNft/sendNftSlice';
import { BottomStickyButton } from '../../sendComponents';

interface Props {
  userJwt: string;
}

const SelectNftContainer = ({ userJwt }: Props) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { orgId } = router.query;
  const orgUsers = useAppSelector((state) => selectOrgUsersSortedByName(state));
  const availableNfts = useAppSelector((state) => selectAvailableNfts(state));
  const selectedUser = useAppSelector((state) => selectSelectedUser(state));
  const selectedNft = useAppSelector((state) => selectSelectedNft(state));
  const latestTxnStatus = useAppSelector((state) =>
    selectLatestTxnStatus(state)
  );

  const [currentStep, setCurrentStep] = useState<
    'selectNft' | 'selectUser' | 'confirm' | 'success' | 'error'
  >('selectNft');

  useEffect(() => {
    if (availableNfts) {
      dispatch(selectedNftUpdated(availableNfts[0]));
    }
  }, [availableNfts, dispatch]);

  const isUserSelected = Boolean(selectedUser);

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

      {currentStep === 'selectUser' && selectedNft && (
        <>
          {selectedNft && (
            <div
              className={
                'flex items-center rounded-md bg-thirteenthGray px-2 py-2 font-normal'
              }
            >
              <Image
                className="rounded-md"
                src={selectedNft?.erc721Meta.properties.image}
                alt="nft image"
                width="70%"
                height="70%"
              />
              <p className="ml-5 text-lg text-white">
                Send {selectedNft?.erc721Meta.properties.name} to:
              </p>
            </div>
          )}
          <ul className="my-4">
            {orgUsers.map((user) => {
              const isUserSelected = Boolean(selectedUser?.id === user.id);
              return (
                <OrgMemberCard
                  key={user.id}
                  userInOrg={user}
                  toggleChecked={() => {
                    isUserSelected
                      ? dispatch(clearedSelectedUser())
                      : dispatch(selectedUserUpdated(user));
                  }}
                  isChecked={isUserSelected}
                />
              );
            })}
          </ul>
          {isUserSelected && (
            <BottomStickyButton
              onCancelClick={() => {
                dispatch(clearedSelectedUser());
              }}
              onPrimaryClick={() => {
                setCurrentStep('confirm');
              }}
            />
          )}
        </>
      )}

      {currentStep === 'confirm' && selectedNft && selectedUser && (
        <>
          <div className="rounded-4px bg-white pb-7 shadow-primaryModalShadow">
            <div className="relative flex items-center justify-center rounded-tl-4px rounded-tr-4px p-15px">
              <span className="text-21px font-semibold text-primaryDarkGray">
                Confirmation
              </span>
              <div className="absolute right-18px top-18px">
                {/** TODO back to send */}
                <button onClick={() => setCurrentStep('selectUser')}>
                  <Image
                    src="/images/exit.svg"
                    width="12px"
                    height="12px"
                    alt="x to close"
                  />
                </button>
              </div>
            </div>
            <div className="px-15px">
              <table className="w-full border-collapse overflow-hidden rounded-md">
                <thead>
                  <tr className={'bg-primaryOrange'}>
                    <th className="text-14px p-4 text-start font-semibold text-white">
                      Name
                    </th>
                    <th className="text-14px w-30vw p-4 text-center font-semibold text-white">
                      NFT
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    key={selectedNft?.erc721Meta.properties.name}
                    className="border-l-2 border-b-2 border-r-2 border-eighthLightGray"
                  >
                    <td className="px-4 py-5 text-start text-15px text-primaryGray">
                      {selectedUser?.first_name} {selectedUser?.last_name}
                    </td>

                    <td className="px-4 py-5 text-end text-15px text-primaryGray">
                      <Image
                        className="rounded-md"
                        src={selectedNft?.erc721Meta.properties.image}
                        alt="nft image"
                        width="100%"
                        height="100%"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="my-5 flex justify-center">
                <SecondaryButton
                  text={'Back'}
                  onClick={() => {
                    setCurrentStep('selectUser');
                  }}
                  size="big"
                  disabled={Boolean(latestTxnStatus === 'loading')}
                />
                <PrimaryButton
                  text={'Send'}
                  onClick={async () => {
                    // TODO: Send NFT
                    await Promise.resolve('hi');
                    console.log('hi');
                    dispatch(
                      fetchSendNft({
                        communionNftId: selectedNft.id,
                        toUserId: selectedUser.id,
                        orgId: (orgId || '').toString(),
                        jwtToken: userJwt,
                      })
                    );
                  }}
                  size="big"
                  disabled={Boolean(latestTxnStatus === 'loading')}
                  loading={Boolean(latestTxnStatus === 'loading')}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SelectNftContainer;
