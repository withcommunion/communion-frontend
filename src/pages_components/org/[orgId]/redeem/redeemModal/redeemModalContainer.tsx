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
    <div className="absolute top-0 left-0 mx-auto w-full z-50 bg-secondaryLightGray min-h-100vh">
      <div className="container w-full md:max-w-50vw px-6 pb-1 mx-auto bg-secondaryLightGray">
        <BackToButton backToDestinationText={'List'} onClick={closeModal} />

        {currentStep === 'input' && (
          <div className="shadow-primaryModalShadow rounded-4px bg-white px-15px pb-10">
            <div className="flex justify-center items-center py-4">
              <Image
                src="/images/redeem/Shopping-cart.svg"
                width="25px"
                height="25px"
                alt="shopping cart"
              />
              <span className="mx-1 font-semibold text-21px text-primaryDarkGray">
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
              <span className="text-fifthLightGray text-15px">Total: </span>
              <span className="font-semibold text-primaryPurple text-15px">
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
            <div className="mt-5 text-sixthLightGray text-13px flex justify-center">
              Note: This action can not be undone!
            </div>
          </div>
        )}
        {currentStep === 'confirm' && (
          <div className="shadow-primaryModalShadow rounded-4px bg-white pb-7">
            <div className="relative p-15px flex justify-center items-center rounded-tl-4px rounded-tr-4px">
              <span className="text-primaryDarkGray text-21px font-semibold">
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
                    <th className="text-start p-4 text-14px text-white font-semibold">
                      Name
                    </th>
                    <th className="text-end p-4 w-30vw text-14px text-white font-semibold">
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
                      <td className="text-start text-primaryGray text-15px px-4 py-5">
                        {selectedRedeemable.name}
                      </td>
                      <td className="text-end text-primaryGray text-15px px-4 py-5">
                        {selectedRedeemable.amount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex justify-center items-center flex-col my-6">
                <span className="mr-2 text-eighthGray text-15px">
                  You are about to redeem rewards for a total of
                </span>
                <div>
                  <span className="text-primaryPurple text-15px">
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
          <div className="shadow-primaryModalShadow rounded-4px bg-white mb-16 flex flex-col justify-center items-center">
            <div className="flex justify-center items-center pt-5">
              <Image
                src="/images/redeem/applePresent.png"
                width="273px"
                height="273px"
                alt="A gift"
              />
            </div>
            <p className="mt-3 mb-2 flex justify-center items-center">
              <span className="text-primaryDarkGray text-21px font-semibold">
                Success!
              </span>
            </p>
            <p className="text-eleventhGray text-4 flex flex-col justify-center items-center mb-7">
              <div>
                {totalAmountRedeeming} {tokenSymbol}
              </div>
              <span>were successfully redeemed</span>
            </p>
            {latestTxn && (
              <div className="flex flex-col my-5">
                <p className="">View the transaction on the blockchain!</p>
                <a
                  className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
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
