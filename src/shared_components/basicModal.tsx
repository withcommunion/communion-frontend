import PrimaryBigButton from '@/shared_components/primaryButton/PrimaryBigButton';

import Image from 'next/image';
import React, { FC } from 'react';

const SendTokensModal: FC<{
  title: string;
  onModalClose: () => void;
  onContinueClick: () => void;
  buttonText: string;
  children: React.ReactNode;
}> = ({ title, onModalClose, onContinueClick, buttonText, children }) => {
  return (
    <div className="shadow-primaryModalShadow rounded-4px bg-white mb-16">
      <div className="bg-thirdGray p-15px flex justify-between items-center rounded-tl-4px rounded-tr-4px">
        <span className="text-white font-medium text-17px">{title}</span>
        <button onClick={onModalClose}>
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
      <div className="px-15px pb-5 flex justify-center items-center flex-col">
        <PrimaryBigButton text={buttonText} functionButton={onContinueClick} />
      </div>
    </div>
  );
};

export default SendTokensModal;
