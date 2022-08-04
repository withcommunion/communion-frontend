// TODO: This will make this component real smoove https://reactjs.org/docs/animation.html
import { useEffect, useState } from 'react';
import cx from 'classnames';

import { useAppSelector, useAppDispatch } from '@/reduxHooks';
import BackToButton from '@/shared_components/backToButton/BackToButton';
import BasicModal from '@/shared_components/basicModal';
import AssetAmountInput from '@/pages_components/org/[orgId]/send/sendTokensModal/assetInputs/assetAmountInput';
import SelectedOrgMemberCard from './selectedOrgMemberCard/selectedOrgMemberCard';
import {
  clearedLatestTxn,
  baseAmountUpdated,
  updatedUserAmount,
  clearedUsers,
  selectLatestTxnErrorMessage,
  selectLatestTxnStatus,
  selectLatestTxn,
  UserAndAmount,
} from '@/features/multisend/multisendSlice';
import { formatTxnHash, getSnowtraceExplorerUrl } from '@/util/avaxEthersUtil';
import Image from 'next/image';
import PrimaryButton from '@/shared_components/buttons/primaryButton';

interface Props {
  closeModal: () => void;
  selectedUsersAndAmounts: UserAndAmount[];
  removeSelectedUser: (userId: string) => void;
  baseAmountToSendPerUser: number;
  totalAmountSending: number;
  tokenSymbol: string;
  sendTokens: () => Promise<void>;
}

const SendTokenTipsModal = ({
  closeModal,
  selectedUsersAndAmounts,
  removeSelectedUser,
  baseAmountToSendPerUser,
  totalAmountSending,
  tokenSymbol,
  sendTokens,
}: Props) => {
  const dispatch = useAppDispatch();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const latestTxnStatus = useAppSelector((state) =>
    selectLatestTxnStatus(state)
  );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const latestTxnErrorMessage = useAppSelector((state) =>
    selectLatestTxnErrorMessage(state)
  );
  const latestTxn = useAppSelector((state) => selectLatestTxn(state));

  const [isSendingSameAmount, setIsSendingSameAmount] = useState(true);
  const [currentStep, setCurrentStep] = useState<
    'input' | 'confirm' | 'success' | 'error'
  >('input');

  useEffect(() => {
    if (selectedUsersAndAmounts.length === 0) {
      closeModal();
    }
  }, [selectedUsersAndAmounts, closeModal]);

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
            title={'Send Token Tips to:'}
            toggleModal={closeModal}
            onPrimaryActionButtonClick={() => {
              setCurrentStep('confirm');
            }}
            primaryActionButtonText={'Next'}
          >
            <>
              {/**TODO: Make this it's own component, make styling match designs */}
              <div className="flex flex-row gap-x-2">
                <button
                  value="sameAmount"
                  className={cx(
                    {
                      'border-1px border-thirdOrange text-fourthOrange':
                        isSendingSameAmount,
                      'text-fourthGray': !isSendingSameAmount,
                    },
                    'rounded-3px p-2 text-sm'
                  )}
                  onClick={() => {
                    dispatch(baseAmountUpdated(baseAmountToSendPerUser));
                    setIsSendingSameAmount(true);
                  }}
                >
                  The Same Amount
                </button>
                <button
                  className={cx(
                    {
                      'border-1px border-thirdOrange text-fourthOrange':
                        !isSendingSameAmount,
                      'text-fourthGray': isSendingSameAmount,
                    },
                    'rounded-3px p-2 text-sm'
                  )}
                  value="differentAmount"
                  onClick={() => setIsSendingSameAmount(false)}
                >
                  Different Amounts
                </button>
              </div>
              {isSendingSameAmount && (
                <div>
                  <ul>
                    {selectedUsersAndAmounts.map((userAndAmount) => (
                      <SelectedOrgMemberCard
                        removeSelectedUser={() =>
                          removeSelectedUser(userAndAmount.user.id)
                        }
                        key={userAndAmount.user.id}
                        selectedUser={userAndAmount.user}
                      />
                    ))}
                  </ul>
                  <AssetAmountInput
                    amount={baseAmountToSendPerUser}
                    tokenSymbol={tokenSymbol}
                    onChange={(value: number) =>
                      dispatch(baseAmountUpdated(value))
                    }
                  />
                </div>
              )}
              {!isSendingSameAmount &&
                selectedUsersAndAmounts.map((userAndAmount) => (
                  <ul key={userAndAmount.user.id}>
                    <SelectedOrgMemberCard
                      removeSelectedUser={() =>
                        removeSelectedUser(userAndAmount.user.id)
                      }
                      selectedUser={userAndAmount.user}
                    />
                    <AssetAmountInput
                      amount={userAndAmount.amount}
                      tokenSymbol={tokenSymbol}
                      onChange={(value: number) =>
                        dispatch(
                          updatedUserAmount({
                            user: userAndAmount.user,
                            amount: value,
                          })
                        )
                      }
                    />
                  </ul>
                ))}

              <div>
                <span className="p-2">Total: </span>
                <span className="font-semibold">
                  {totalAmountSending} {tokenSymbol}
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
              await sendTokens();
            }}
            primaryActionButtonText={'Submit'}
            disablePrimaryActionButton={latestTxnStatus === 'loading'}
            loadingPrimaryActionButton={latestTxnStatus === 'loading'}
          >
            <div>
              <p className="my-5 text-center text-secondaryGray">
                You are about to send:
              </p>
              <table className="border w-full">
                <thead>
                  <tr>
                    <th className="text-start px-2">Name</th>
                    <th className="text-end px-2 w-30vw">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedUsersAndAmounts.map((userAndAmount) => (
                    <tr
                      key={userAndAmount.user.id}
                      className="border border-spacing-2"
                    >
                      <td className="text-start px-2 py-4">
                        {userAndAmount.user.first_name}{' '}
                        {userAndAmount.user.last_name}
                      </td>
                      <td className="text-end px-2 py-4">
                        {userAndAmount.amount} {tokenSymbol}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex flex-row my-5">
                <span className="mr-2">For a total of:</span>
                <span className="font-semibold">
                  {totalAmountSending} {tokenSymbol}
                </span>
              </div>
            </div>
          </BasicModal>
        )}
        {currentStep === 'success' && (
          <div className="shadow-primaryModalShadow rounded-4px bg-white mb-16 flex flex-col justify-center items-center">
            <div className="flex justify-center items-center pt-10">
              <Image
                src="/images/send/donat.png"
                width="192px"
                height="199px"
                alt="donat image"
              />
            </div>
            <p className="my-3 flex justify-center items-center">
              <span className="text-primaryDarkGray text-21px font-semibold">
                Congratulations
              </span>
            </p>
            <p className="text-eleventhGray text-4 flex flex-col justify-center items-center mb-7">
              <div>
                {totalAmountSending} {tokenSymbol} was successfully sent to:
              </div>
              <ul>
                {selectedUsersAndAmounts.map((userAndAmount) => (
                  <li key={userAndAmount.user.id}>
                    <div className="my-2">
                      <span className="font-semibold">
                        {userAndAmount.amount} {tokenSymbol}{' '}
                      </span>
                      <span>
                        to:{' '}
                        <span className="font-semibold">
                          {userAndAmount.user.first_name}{' '}
                          {userAndAmount.user.last_name}
                        </span>
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
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
              text={'Back to Members’s List'}
              onClick={() => {
                dispatch(clearedUsers());
                dispatch(baseAmountUpdated(0));
                closeModal();
              }}
              size="big"
            />
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
              dispatch(clearedLatestTxn());
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

export default SendTokenTipsModal;
