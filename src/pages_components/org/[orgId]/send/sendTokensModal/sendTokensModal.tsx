// TODO: This will make this component real smoove https://reactjs.org/docs/animation.html
import React, { useEffect, useState } from 'react';
import cx from 'classnames';
import Image from 'next/image';

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
              <table className="w-full">
                <thead className="bg-primaryDarkGray border-primaryDarkGray rounded-t">
                  <tr>
                    <th className="text-start p-4 text-14px text-white font-semibold rounded-tl">
                      Name
                    </th>
                    <th className="text-end p-4 w-30vw text-14px text-white font-semibold rounded-tr">
                      Tokens
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {selectedUsersAndAmounts.map((userAndAmount) => (
                    <tr
                      key={userAndAmount.user.id}
                      className="border-l-2 border-r-2 border-b-2"
                    >
                      <td className="text-start text-primaryGray text-15px px-4 py-5">
                        {userAndAmount.user.first_name}{' '}
                        {userAndAmount.user.last_name}
                      </td>
                      <td className="text-end text-primaryGray text-15px px-4 py-5">
                        {userAndAmount.amount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex justify-center items-center flex-col my-6">
                <span className="mr-2 text-eighthGray text-15px">
                  You are about to send a total of
                </span>
                <div>
                  <span className="text-primaryPurple text-15px ">
                    <span className="font-semibold">{totalAmountSending}</span>{' '}
                    tokens
                  </span>
                </div>
              </div>
              <div className="flex justify-center">
                <PrimaryButton
                  text={'Send'}
                  onClick={async () => {
                    await sendTokens();
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
          <BasicModal
            title={'Congratulations!'}
            toggleModal={closeModal}
            primaryActionButtonText={`Back to Member's List`}
            onPrimaryActionButtonClick={() => {
              dispatch(clearedUsers());
              dispatch(baseAmountUpdated(0));
              closeModal();
            }}
          >
            <div className="text-center">
              <p className="my-5">You succesfully sent:</p>
              <ul>
                {selectedUsersAndAmounts.map((userAndAmount) => (
                  <li key={userAndAmount.user.id}>
                    <div className="my-2">
                      <span className="font-semibold">
                        {userAndAmount.amount} {tokenSymbol}{' '}
                      </span>
                      <span>
                        to: {userAndAmount.user.first_name}{' '}
                        {userAndAmount.user.last_name}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
              <p className="my-5">
                For a total of: {totalAmountSending} {tokenSymbol}
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
            </div>
          </BasicModal>
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
