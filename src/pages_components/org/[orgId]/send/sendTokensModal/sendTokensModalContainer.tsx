// TODO: This will make this component real smoove https://reactjs.org/docs/animation.html
import React, { useEffect, useState } from 'react';
import cx from 'classnames';
import Image from 'next/image';

import { useAppSelector, useAppDispatch } from '@/reduxHooks';
import BackToButton from '@/shared_components/backToButton/BackToButton';
import BasicModal from '@/shared_components/basicModal';
import AssetAmountInput from '@/pages_components/org/[orgId]/send/sendTokensModal/assetInputs/assetAmountInput';
import SendMsgInput from '@/pages_components/org/[orgId]/send/sendTokensModal/sendMsgInput/sendMsgInput';

import SelectedOrgMemberCard from './selectedOrgMemberCard/selectedOrgMemberCard';
import {
  clearedLatestTxn,
  baseAmountUpdated,
  baseMsgUpdated,
  updatedUserAmount,
  updatedUserMsg,
  userRemoved,
  clearedUsers,
  selectBaseAmount,
  selectLatestTxnErrorMessage,
  selectLatestTxnStatus,
  selectLatestTxn,
  selectUsersAndAmounts,
  selectTotalAmountSending,
  selectBaseMsg,
} from '@/features/multisend/multisendSlice';
import { selectIsManagerModeActive } from '@/features/organization/organizationSlice';
import { formatTxnHash, getSnowtraceExplorerUrl } from '@/util/avaxEthersUtil';
import PrimaryButton from '@/shared_components/buttons/primaryButton';
import SecondaryButton from '@/shared_components/buttons/secondaryButton';

interface Props {
  closeModal: () => void;
  tokenSymbol: string;
  sendTokens: () => Promise<void>;
}

const SendTokenTipsModalContainer = ({
  closeModal,
  tokenSymbol,
  sendTokens,
}: Props) => {
  const [isSendingSameAmount, setIsSendingSameAmount] = useState(true);
  const [currentStep, setCurrentStep] = useState<
    'input' | 'confirm' | 'success' | 'error'
  >('input');
  const dispatch = useAppDispatch();
  const latestTxnStatus = useAppSelector((state) =>
    selectLatestTxnStatus(state)
  );
  const latestTxnErrorMessage = useAppSelector((state) =>
    selectLatestTxnErrorMessage(state)
  );
  const latestTxn = useAppSelector((state) => selectLatestTxn(state));
  const baseAmountToSendPerUser = useAppSelector((state) =>
    selectBaseAmount(state)
  );

  const baseMsgToToSendForAllUsers = useAppSelector((state) =>
    selectBaseMsg(state)
  );

  const selectedUsersAndAmounts = useAppSelector((state) =>
    selectUsersAndAmounts(state)
  );
  const totalAmountSending = useAppSelector((state) =>
    selectTotalAmountSending(state)
  );
  const isManagerModeActive = useAppSelector((state) =>
    selectIsManagerModeActive(state)
  );

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
    <div className=" min-h-100vh w-full bg-secondaryLightGray">
      <div className="w-full bg-secondaryLightGray pb-1 md:max-w-50vw">
        <BackToButton backToDestinationText={'List'} onClick={closeModal} />
        {currentStep === 'input' && (
          <BasicModal
            title={'Send Token Tips to:'}
            isManagerModeActive={isManagerModeActive}
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
                          dispatch(
                            userRemoved({ userId: userAndAmount.user.id })
                          )
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
                  <div className="mt-12">
                    <SendMsgInput
                      isToAll
                      msg={baseMsgToToSendForAllUsers}
                      onChange={(value: string) =>
                        dispatch(baseMsgUpdated(value))
                      }
                    />
                  </div>
                </div>
              )}
              {!isSendingSameAmount &&
                selectedUsersAndAmounts.map((userAndAmount) => (
                  <ul key={userAndAmount.user.id}>
                    <SelectedOrgMemberCard
                      removeSelectedUser={() =>
                        dispatch(userRemoved({ userId: userAndAmount.user.id }))
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
                            message: userAndAmount.message,
                            amount: value,
                          })
                        )
                      }
                    />
                    <SendMsgInput
                      msg={userAndAmount.message || ''}
                      onChange={(value: string) =>
                        dispatch(
                          updatedUserMsg({
                            user: userAndAmount.user,
                            amount: userAndAmount.amount,
                            message: value,
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
                  <tr
                    className={cx({
                      'bg-primaryDarkGray': !isManagerModeActive,
                      'bg-primaryOrange': isManagerModeActive,
                    })}
                  >
                    <th className="text-14px p-4 text-start font-semibold text-white">
                      Name
                    </th>
                    <th className="text-14px p-4 text-end font-semibold text-white">
                      Message
                    </th>
                    <th className="text-14px w-20vw p-4 text-end font-semibold text-white">
                      Tokens
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {selectedUsersAndAmounts.map((userAndAmount) => (
                    <tr
                      key={userAndAmount.user.id}
                      className="border-l-2 border-b-2 border-r-2 border-eighthLightGray"
                    >
                      <td className="px-4 py-5 text-start text-15px text-primaryGray">
                        {userAndAmount.user.first_name}{' '}
                        {userAndAmount.user.last_name}
                      </td>
                      <td className="px-4 py-5 text-end text-15px text-primaryGray">
                        {userAndAmount.message}
                      </td>
                      <td className="px-4 py-5 text-end text-15px text-primaryGray">
                        {userAndAmount.amount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="my-6 flex flex-col items-center justify-center">
                <span className="mr-2 text-15px text-eighthGray">
                  You are about to send a total of
                </span>
                <div>
                  <span className="text-15px text-primaryPurple ">
                    <span className="font-semibold">{totalAmountSending}</span>{' '}
                    tokens
                  </span>
                  {isManagerModeActive && (
                    <strong className="font-semibold"> from the bank</strong>
                  )}
                </div>
              </div>
              <div className="flex justify-center">
                <SecondaryButton
                  text={'Back'}
                  onClick={() => {
                    setCurrentStep('input');
                  }}
                  size="big"
                  disabled={Boolean(latestTxnStatus === 'loading')}
                />
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
          <div className="mb-16 flex flex-col items-center justify-center rounded-4px bg-white shadow-primaryModalShadow">
            <div className="flex items-center justify-center pt-10">
              <Image
                src="/images/send/donat.png"
                width="192px"
                height="199px"
                alt="donat image"
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
                  {totalAmountSending} {tokenSymbol}
                </span>{' '}
                was successfully sent!
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
            </div>
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
            <div className="my-6">
              <PrimaryButton
                text={'Back to Members’s List'}
                onClick={() => {
                  dispatch(clearedUsers());
                  dispatch(baseAmountUpdated(0));
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

export default SendTokenTipsModalContainer;
