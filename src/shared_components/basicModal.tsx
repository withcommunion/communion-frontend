import PrimaryButton from '@/shared_components/buttons/primaryButton';
import SecondaryButton from '@/shared_components/buttons/secondaryButton';

import Image from 'next/image';
import React from 'react';

interface Props {
  title: string;
  toggleModal: () => void;
  onPrimaryActionButtonClick: () => void;
  primaryActionButtonText: string;
  disablePrimaryActionButton?: boolean;
  loadingPrimaryActionButton?: boolean;
  onSecondaryActionButtonClick?: () => void;
  secondaryActionButtonText?: string;
  children: React.ReactNode;
}

const BasicModal = ({
  title,
  toggleModal,
  onPrimaryActionButtonClick,
  primaryActionButtonText,
  disablePrimaryActionButton,
  loadingPrimaryActionButton,
  onSecondaryActionButtonClick,
  secondaryActionButtonText,
  children,
}: Props) => {
  return (
    <div className="shadow-primaryModalShadow rounded-4px bg-white mb-16">
      <div className="bg-thirdGray p-15px flex justify-between items-center rounded-tl-4px rounded-tr-4px">
        <span className="text-white font-medium text-17px">{title}</span>
        <button onClick={toggleModal}>
          <Image
            src="/images/whiteExit.svg"
            width="12px"
            height="12px"
            alt="x to close"
          />
        </button>
      </div>
      <div className="px-15px">
        <div className="mb-3">{children}</div>
      </div>
      <div className="px-15px pb-5 flex justify-center items-center flex-row">
        {onSecondaryActionButtonClick && secondaryActionButtonText && (
          <SecondaryButton
            onClick={onSecondaryActionButtonClick}
            text={secondaryActionButtonText}
            size="small"
          />
        )}
        <PrimaryButton
          text={primaryActionButtonText}
          onClick={onPrimaryActionButtonClick}
          size="big"
          disabled={Boolean(disablePrimaryActionButton)}
          loading={Boolean(loadingPrimaryActionButton)}
        />
      </div>
    </div>
  );
};

export default BasicModal;
