import CancelButton from '@/pages_components/org/[orgId]/send/buttonsWrapper/cancelButton/CancelButton';
import { FC } from 'react';
import PrimarySmallButton from '@/shared_components/primaryButton/PrimarySmallButton';

// eslint-disable-next-line @typescript-eslint/ban-types
const ButtonsWrapper: FC<{
  onCancelButton: () => void;
  onHideSendModal: () => void;
}> = ({ onCancelButton, onHideSendModal }) => {
  return (
    <div className="fixed w-full left-0 bottom-14 ">
      <div className="flex justify-center items-center bg-white p-5">
        <CancelButton onCancelButton={onCancelButton} />
        <PrimarySmallButton
          text={'Continue'}
          functionButton={() => {
            onHideSendModal();
          }}
        />
      </div>
    </div>
  );
};

export default ButtonsWrapper;
