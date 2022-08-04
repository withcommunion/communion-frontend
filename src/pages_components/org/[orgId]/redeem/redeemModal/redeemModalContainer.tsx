// TODO: This will make this component real smoove https://reactjs.org/docs/animation.html
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

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
          <BasicModal
            title={'Redeeming Rewards:'}
            toggleModal={closeModal}
            onPrimaryActionButtonClick={() => {
              setCurrentStep('confirm');
            }}
            primaryActionButtonText={'Next'}
          >
            <>
              <div>
                <ul>
                  {selectedRedeemables.map((redeemable) => (
                    <SelectedRedeemableCard
                      key={redeemable.id}
                      removeSelectedRedeemable={() => {
                        removeSelectedRedeemable(redeemable);
                      }}
                      selectedRedeemable={redeemable}
                    />
                  ))}
                </ul>
              </div>

              <div>
                <span className="p-2">Total: </span>
                <span className="font-semibold">
                  {totalAmountRedeeming} {tokenSymbol}
                </span>
              </div>
            </>
          </BasicModal>
        )}
        {currentStep === 'confirm' && (
          <BasicModal
            title={'Confirmation'}
            toggleModal={closeModal}
            secondaryActionButtonText={'Back'}
            onSecondaryActionButtonClick={() => {
              setCurrentStep('input');
            }}
            onPrimaryActionButtonClick={async () => {
              await fetchOrgRedeem();
            }}
            primaryActionButtonText={'Submit'}
            disablePrimaryActionButton={latestTxnStatus === 'loading'}
            loadingPrimaryActionButton={latestTxnStatus === 'loading'}
          >
            <div>
              <p className="my-5 text-center text-secondaryGray">
                You are about to redeem:
              </p>
              <table className="border w-full">
                <thead>
                  <tr>
                    <th className="text-start px-2">Name</th>
                    <th className="text-end px-2 w-30vw">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedRedeemables.map((selectedRedeemable) => (
                    <tr
                      key={selectedRedeemable.id}
                      className="border border-spacing-2"
                    >
                      <td className="text-start px-2 py-4">
                        {selectedRedeemable.name}
                      </td>
                      <td className="text-end px-2 py-4">
                        {selectedRedeemable.amount} {tokenSymbol}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex flex-row my-5">
                <span className="mr-2">For a total of:</span>
                <span className="font-semibold">
                  {totalAmountRedeeming} {tokenSymbol}
                </span>
              </div>
            </div>
          </BasicModal>
        )}
        {currentStep === 'success' && (
          <div className="shadow-primaryModalShadow rounded-4px bg-white mb-16 flex flex-col justify-center items-center">
            <div className="flex justify-center items-center pt-5">
              <Image
                src="/images/redeem/shutterstock.png"
                width="273px"
                height="273px"
                alt="shutterstock image"
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
            <PrimaryButton
              text={'Back to Redeem’s List'}
              onClick={() => {
                dispatch(clearedRedeemables());
                closeModal();
              }}
              size="big"
            />
            <Link href={'#'}>
              <a className="mt-6 mb-7 text-primaryOrange text-13px font-light">
                Back to Dashboard
              </a>
            </Link>
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
