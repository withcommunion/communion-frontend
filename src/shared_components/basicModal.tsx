import Image from 'next/image';
import React from 'react';
import cx from 'classnames';

import PrimaryButton from '@/shared_components/buttons/primaryButton';
import SecondaryButton from '@/shared_components/buttons/secondaryButton';

interface Props {
  title: string;
  toggleModal: () => void;
  isManagerModeActive?: boolean;
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
  isManagerModeActive,
  onPrimaryActionButtonClick,
  primaryActionButtonText,
  disablePrimaryActionButton,
  loadingPrimaryActionButton,
  onSecondaryActionButtonClick,
  secondaryActionButtonText,
  children,
}: Props) => {
  return (
    <div className="mb-16 rounded-4px bg-white shadow-primaryModalShadow">
      <div
        className={cx(
          'flex items-center justify-between rounded-tl-4px rounded-tr-4px p-15px',
          { 'bg-primaryOrange': isManagerModeActive },
          { 'bg-thirdGray ': !isManagerModeActive }
        )}
      >
        <span className="text-17px font-medium text-white">{title}</span>
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
      <div className="flex flex-row items-center justify-center px-15px pb-5">
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
