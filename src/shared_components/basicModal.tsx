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
    <div className="shadow-primaryModalShadow rounded-4px bg-white mb-16">
      <div
        className={cx(
          'p-15px flex justify-between items-center rounded-tl-4px rounded-tr-4px',
          { 'bg-primaryOrange': isManagerModeActive },
          { 'bg-thirdGray ': !isManagerModeActive }
        )}
      >
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
