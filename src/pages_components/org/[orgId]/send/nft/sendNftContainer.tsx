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
  fetchOrgById,
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
  clearedSelectedNft,
  selectLatestTxn,
  selectLatestTxnErrorMessage,
  clearedLatestTxn,
} from '@/features/sendNft/sendNftSlice';
import { BottomStickyButton } from '../../sendComponents';
import { formatTxnHash, getSnowtraceExplorerUrl } from '@/util/avaxEthersUtil';
import { isNftFeatureEnabled } from '@/util/envUtil';

interface Props {
  userJwt: string;
}

const SendNftContainer = ({ userJwt }: Props) => {
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
  const latestTxnErrorMessage = useAppSelector((state) =>
    selectLatestTxnErrorMessage(state)
  );
  const latestTxn = useAppSelector((state) => selectLatestTxn(state));

  const [currentStep, setCurrentStep] = useState<
    'selectNft' | 'selectUser' | 'confirm' | 'success' | 'error'
  >('selectNft');

  useEffect(() => {
    if (availableNfts && !selectedNft) {
      dispatch(selectedNftUpdated(availableNfts[0]));
    }
  }, [availableNfts, selectedNft, dispatch]);

  useEffect(() => {
    if (latestTxnStatus === 'succeeded') {
      setCurrentStep('success');
    } else if (latestTxnStatus === 'failed') {
      setCurrentStep('error');
    }
  }, [latestTxnStatus]);

  useEffect(() => {
    return function cleanup() {
      dispatch(clearedSelectedUser());
      dispatch(clearedLatestTxn());
      dispatch(clearedSelectedNft());
      dispatch(
        fetchOrgById({
          orgId: (orgId || '').toString(),
          jwtToken: userJwt,
        })
      );
    };
  }, [dispatch, orgId, userJwt]);

  const isUserSelected = Boolean(selectedUser);

  return (
    <div>
      <Link href={`/org/${(orgId || '').toString()}/send`}>
        <a>
          <div className="w-fit">
            <BackToButton onClick={() => true} backToDestinationText={'Send'} />
          </div>
        </a>
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
                  showNftTrophies={Boolean(
                    isNftFeatureEnabled && availableNfts?.length
                  )}
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
                  onClick={() => {
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

      {currentStep === 'success' && (
        <div className="mb-16 flex flex-col items-center justify-center rounded-4px bg-white shadow-primaryModalShadow">
          <div className="flex items-center justify-center pt-10">
            <Image
              src="/images/send/wand.png"
              width="192px"
              height="199px"
              alt="wand image"
            />
          </div>
          <p className="my-3 flex items-center justify-center">
            <span className="text-21px font-semibold text-primaryDarkGray">
              Congratulations
            </span>
          </p>
          <div className="text-4 mb-7 flex flex-col items-center justify-center text-eleventhGray">
            <div>
              <span className="font-semibold">
                {selectedNft?.erc721Meta.properties.name}
              </span>{' '}
              was successfully sent!
            </div>
          </div>
          {latestTxn && (
            <div className="my-5 flex flex-col">
              <p className="">View the transaction on the blockchain!</p>
              <a
                className="text-blue-600 underline visited:text-purple-600 hover:text-blue-800"
                href={getSnowtraceExplorerUrl(latestTxn.txnHash)}
                target="_blank"
                rel="noreferrer"
              >
                Here: {formatTxnHash(latestTxn.txnHash)}
              </a>
            </div>
          )}
          <div className="my-6">
            <PrimaryButton
              text={'Back to Members’s List'}
              onClick={() => {
                dispatch(clearedSelectedNft());
                dispatch(clearedSelectedUser());
                dispatch(clearedLatestTxn());
                router.push(`/org/${(orgId || '').toString()}/send`);
              }}
              size="big"
            />
          </div>
          {/* <Link href={'#'}>
              <a className="mt-6 mb-7 text-primaryOrange text-13px font-light">
                Back to Dashboard
              </a>
            </Link> */}
        </div>
      )}

      {currentStep === 'error' && (
        <div className="mb-16 flex flex-col items-center justify-center rounded-4px bg-white pb-5 shadow-primaryModalShadow">
          <div className="flex items-center justify-center">
            <div className="px-5">
              <p className="my-5 text-xl font-semibold">
                Something went wrong.
              </p>
              <p className="my-5">
                Your funds did not send, you can safely try again.
              </p>
              <p className="mt-5">
                <p>Error:</p>
              </p>
              <p> {latestTxnErrorMessage && latestTxnErrorMessage}</p>

              <div className="mt-5">
                <PrimaryButton
                  text="Try Again"
                  onClick={() => setCurrentStep('confirm')}
                  size="big"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SendNftContainer;
