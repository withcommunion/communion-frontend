import PrimaryBigButton from '@/shared_components/primaryButton/PrimaryBigButton';

import Image from 'next/image';
import { FC } from 'react';

const SendTokensModal: FC<{
  title: string;
  functionExit: () => void;
  functionContinue: () => void;
  buttonText: string;
  children: any;
}> = ({ title, functionExit, functionContinue, buttonText, children }) => {
  return (
    <div className="shadow-primaryModalShadow rounded-4px bg-white mb-16">
      <div className="bg-thirdGray p-15px flex justify-between items-center rounded-tl-4px rounded-tr-4px">
        <span className="text-white font-medium text-17px">{title}</span>
        <button onClick={functionExit}>
          <Image src="/images/whiteExit.svg" width="12px" height="12px" />
        </button>
      </div>
      <div className="px-15px">
        <div className="mb-3">{children}</div>
      </div>
      <div className="px-15px pb-5 flex justify-center items-center flex-col">
        <PrimaryBigButton text={buttonText} functionButton={functionContinue} />
      </div>
    </div>
  );
};

export default SendTokensModal;
