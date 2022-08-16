// TODO: This will make this component real smoove https://reactjs.org/docs/animation.html
import { useEffect, useState } from 'react';
import Image from 'next/image';

import { useAppSelector, useAppDispatch } from '@/reduxHooks';
import BackToButton from '@/shared_components/backToButton/BackToButton';
import BasicModal from '@/shared_components/basicModal';
import SelectedRedeemableCard from './selectedRedeemableCard/selectedRedeemableCard';

import {
  clearedLatestRedeemTxn,
  selectLatestRedeemTxnErrorMessage,
  selectLatestRedeemTxnStatus,
  selectLatestRedeemTxn,
} from '@/features/cart/cartSlice';

import { formatTxnHash, getSnowtraceExplorerUrl } from '@/util/avaxEthersUtil';
import {
  clearedRedeemables,
  OrgRedeemableInCart,
} from '@/features/cart/cartSlice';
import PrimaryButton from '@/shared_components/buttons/primaryButton';

interface Props {
  closeModal: () => void;
  selectedRedeemables: OrgRedeemableInCart[];
  removeSelectedRedeemable: (redeemable: OrgRedeemableInCart) => void;
  totalAmountRedeeming: number;
  tokenSymbol: string;
  fetchOrgRedeem: () => Promise<void>;
}

const RedeemModalContainer = ({
  closeModal,
  selectedRedeemables,
  removeSelectedRedeemable,
  totalAmountRedeeming,
  tokenSymbol,
  fetchOrgRedeem,
}: Props) => {
  const dispatch = useAppDispatch();
  const latestTxnStatus = useAppSelector((state) =>
    selectLatestRedeemTxnStatus(state)
  );
  const latestTxnErrorMessage = useAppSelector((state) =>
    selectLatestRedeemTxnErrorMessage(state)
  );
  const latestTxn = useAppSelector((state) => selectLatestRedeemTxn(state));

  const [currentStep, setCurrentStep] = useState<
    'input' | 'confirm' | 'success' | 'error'
  >('input');

  useEffect(() => {
    if (selectedRedeemables.length === 0) {
      closeModal();
    }
  }, [selectedRedeemables, closeModal]);

  useEffect(() => {
    if (latestTxnStatus === 'succeeded') {
      setCurrentStep('success');
    } else if (latestTxnStatus === 'failed') {
      setCurrentStep('error');
    }
  }, [latestTxnStatus]);
  return (
    <div className="absolute top-0 left-0 z-50 mx-auto min-h-100vh w-full bg-secondaryLightGray">
      <div className="container mx-auto w-full bg-secondaryLightGray px-6 pb-1 md:max-w-50vw">
        <BackToButton backToDestinationText={'List'} onClick={closeModal} />

        {currentStep === 'input' && (
          <div className="rounded-4px bg-white px-15px pb-10 shadow-primaryModalShadow">
            <div className="flex items-center justify-center py-4">
              <Image
                src="/images/redeem/Shopping-cart.svg"
                width="25px"
                height="25px"
                alt="shopping cart"
              />
              <span className="mx-1 text-21px font-semibold text-primaryDarkGray">
                Cart
              </span>
            </div>
            <ul>
              {selectedRedeemables.map((redeemable) => (
                <SelectedRedeemableCard
                  key={redeemable.id}
                  removeSelectedRedeemable={() => {
                    removeSelectedRedeemable(redeemable);
                  }}
                  selectedRedeemable={redeemable}
                  tokenSymbol={tokenSymbol}
                />
              ))}
            </ul>

            <div className="my-10 flex justify-between px-2">
              <span className="text-15px text-fifthLightGray">Total: </span>
              <span className="text-15px font-semibold text-primaryPurple">
                {totalAmountRedeeming} {tokenSymbol}
              </span>
            </div>
            <div className="flex justify-center">
              <PrimaryButton
                text={'Redeem'}
                onClick={() => {
                  setCurrentStep('confirm');
                }}
                size="big"
              />
            </div>
            <div className="mt-5 flex justify-center text-13px text-sixthLightGray">
              Note: This action can not be undone!
            </div>
          </div>
        )}
        {currentStep === 'confirm' && (
          <div className="rounded-4px bg-white pb-7 shadow-primaryModalShadow">
            <div className="relative flex items-center justify-center rounded-tl-4px rounded-tr-4px p-15px">
              <span className="text-21px font-semibold text-primaryDarkGray">
                Confirmation
              </span>
              <div className="absolute right-18px top-18px">
                <button onClick={closeModal}>
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
                  <tr className="bg-primaryDarkGray">
                    <th className="text-14px p-4 text-start font-semibold text-white">
                      Name
                    </th>
                    <th className="text-14px w-30vw p-4 text-end font-semibold text-white">
                      Tokens
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {selectedRedeemables.map((selectedRedeemable) => (
                    <tr
                      key={selectedRedeemable.id}
                      className="border-l-2 border-b-2 border-r-2 border-eighthLightGray"
                    >
                      <td className="px-4 py-5 text-start text-15px text-primaryGray">
                        {selectedRedeemable.name}
                      </td>
                      <td className="px-4 py-5 text-end text-15px text-primaryGray">
                        {selectedRedeemable.amount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="my-6 flex flex-col items-center justify-center">
                <span className="mr-2 text-15px text-eighthGray">
                  You are about to redeem rewards for a total of
                </span>
                <div>
                  <span className="text-15px text-primaryPurple">
                    <span className="font-semibold">
                      {totalAmountRedeeming}
                    </span>{' '}
                    tokens
                  </span>
                </div>
              </div>
              <div className="flex justify-center">
                <PrimaryButton
                  text={'Redeem'}
                  onClick={async () => {
                    await fetchOrgRedeem();
                  }}
                  size="big"
                  disabled={Boolean(latestTxnStatus === 'loading')}
                  loading={Boolean(latestTxnStatus === 'loading')}
                />
              </div>
            </div>
          </div>
        )}
        {currentStep === 'success' && (
          <div className="mb-16 flex flex-col items-center justify-center rounded-4px bg-white shadow-primaryModalShadow">
            <div className="flex items-center justify-center pt-5">
              <Image
                src="/images/redeem/applePresent.png"
                width="273px"
                height="273px"
                alt="A gift"
              />
            </div>
            <p className="mt-3 mb-2 flex items-center justify-center">
              <span className="text-21px font-semibold text-primaryDarkGray">
                Success!
              </span>
            </p>
            <p className="text-4 mb-7 flex flex-col items-center justify-center text-eleventhGray">
              <div>
                {totalAmountRedeeming} {tokenSymbol}
              </div>
              <span>were successfully redeemed</span>
            </p>
            {latestTxn && (
              <div className="my-5 flex flex-col">
                <p className="">View the transaction on the blockchain!</p>
                <a
                  className="text-blue-600 underline visited:text-purple-600 hover:text-blue-800"
                  href={getSnowtraceExplorerUrl(latestTxn.hash || '')}
                  target="_blank"
                  rel="noreferrer"
                >
                  Here: {latestTxn.hash && formatTxnHash(latestTxn.hash)}
                </a>
              </div>
            )}
            <div className="my-5">
              <PrimaryButton
                text={'Back to Redeem List'}
                onClick={() => {
                  dispatch(clearedRedeemables());
                  closeModal();
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
          <BasicModal
            title={'Whoops, something went wrong!'}
            toggleModal={closeModal}
            primaryActionButtonText={'Try Again'}
            onPrimaryActionButtonClick={() => {
              dispatch(clearedLatestRedeemTxn());
              setCurrentStep('confirm');
            }}
          >
            <div className="px-5">
              <p className="my-5">Something went wrong.</p>
              <p className="my-5">
                Your funds did not send, you can safely try again.
              </p>
              <p className="mt-5">
                <p>Error:</p>
              </p>
              <p> {latestTxnErrorMessage && latestTxnErrorMessage}</p>
            </div>
          </BasicModal>
        )}
      </div>
    </div>
  );
};

export default RedeemModalContainer;
