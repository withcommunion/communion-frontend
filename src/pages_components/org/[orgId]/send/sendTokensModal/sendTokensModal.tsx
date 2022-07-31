// TODO: This will make this component real smoove https://reactjs.org/docs/animation.html
import { useEffect, useState } from 'react';
import cx from 'classNames';

import { useAppSelector, useAppDispatch } from '@/reduxHooks';
import BackToButton from '@/shared_components/backToButton/BackToButton';
import BasicModal from '@/shared_components/basicModal';
import AssetAmountInput from '@/pages_components/org/[orgId]/send/sendTokensModal/assetInputs/assetAmountInput';
import SelectedOrgMemberCard from './selectedOrgMemberCard/selectedOrgMemberCard';
import {
  baseAmountUpdated,
  updatedUserAmount,
  clearedUsers,
  selectLatestTxnErrorMessage,
  selectLatestTxnStatus,
  UserAndAmount,
} from '@/features/multisend/multisendSlice';

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

  const [isSendingSameAmount, setIsSendingSameAmount] = useState(true);
  const [currentStep, setCurrentStep] = useState<
    'input' | 'confirm' | 'completed'
  >('input');

  useEffect(() => {
    if (selectedUsersAndAmounts.length === 0) {
      closeModal();
    }
  }, [selectedUsersAndAmounts, closeModal]);
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
                <span className="p-2">Sending: </span>
                <button
                  value="sameAmount"
                  className={cx({
                    'rounded-3px border-1px border-thirdOrange p-2 text-fourthOrange':
                      isSendingSameAmount,
                    'p-2 text-fourthGray': !isSendingSameAmount,
                  })}
                  onClick={() => {
                    dispatch(baseAmountUpdated(baseAmountToSendPerUser));
                    setIsSendingSameAmount(true);
                  }}
                >
                  The Same Amount
                </button>
                <button
                  className={cx({
                    'rounded-3px border-1px border-thirdOrange p-2 text-fourthOrange':
                      !isSendingSameAmount,
                    'p-2 text-fourthGray': isSendingSameAmount,
                  })}
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
              setCurrentStep('completed');
            }}
            primaryActionButtonText={'Submit'}
          >
            <div>
              <p className="my-5 text-center text-secondaryGray">
                You are about to send:
              </p>
              <table className="border">
                <thead>
                  <tr>
                    <th className="text-start w-100vw">Name</th>
                    <th className="text-start">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedUsersAndAmounts.map((userAndAmount) => (
                    <tr
                      key={userAndAmount.user.id}
                      className="border border-spacing-2"
                    >
                      <td className="min-w=50vw">
                        {userAndAmount.user.first_name}{' '}
                        {userAndAmount.user.last_name}
                      </td>
                      <td className="text-center">
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
        {currentStep === 'completed' && (
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
                        {baseAmountToSendPerUser} {tokenSymbol}{' '}
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
            </div>
          </BasicModal>
        )}
      </div>
    </div>
  );
};

export default SendTokenTipsModal;
