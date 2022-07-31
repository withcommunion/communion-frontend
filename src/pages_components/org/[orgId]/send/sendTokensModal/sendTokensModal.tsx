// TODO: This will make this component real smoove https://reactjs.org/docs/animation.html
import { useEffect, useState } from 'react';
import { useAppSelector } from '@/reduxHooks';

import BackToButton from '@/shared_components/backToButton/BackToButton';
import BasicModal from '@/shared_components/basicModal';
import AssetAmountInput from '@/pages_components/org/[orgId]/send/sendTokensModal/assetInputs/assetAmountInput';
import SelectedOrgMemberCard from './selectedOrgMemberCard/selectedOrgMemberCard';
import {
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
  onAssetAmountChange: (value: number) => void;
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
  onAssetAmountChange,
  sendTokens,
}: Props) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const latestTxnStatus = useAppSelector((state) =>
    selectLatestTxnStatus(state)
  );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const latestTxnErrorMessage = useAppSelector((state) =>
    selectLatestTxnErrorMessage(state)
  );

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
              onChange={(value: number) => onAssetAmountChange(value)}
            />
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
            title={'Send Token Tips to:'}
            toggleModal={closeModal}
            onPrimaryActionButtonClick={() => {
              closeModal();
            }}
            primaryActionButtonText={'Close'}
          >
            <div>
              <h2>Congratulations!</h2>
              <p>
                {totalAmountSending} {tokenSymbol} was sent to:
              </p>
              <ul>
                {selectedUsersAndAmounts.map((userAndAmount) => (
                  <li key={userAndAmount.user.id}>
                    <div>
                      <span>
                        Sent {baseAmountToSendPerUser} {tokenSymbol}{' '}
                      </span>
                      <span>
                        to: {userAndAmount.user.first_name}{' '}
                        {userAndAmount.user.last_name}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
              <span>
                For a total of: {totalAmountSending} {tokenSymbol}
              </span>
            </div>
          </BasicModal>
        )}
      </div>
    </div>
  );
};

export default SendTokenTipsModal;
