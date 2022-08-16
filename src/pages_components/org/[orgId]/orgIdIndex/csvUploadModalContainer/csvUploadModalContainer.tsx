import { useState } from 'react';
import Image from 'next/image';
import BasicModal from '@/shared_components/basicModal';

interface Props {
  closeModal: () => void;
}

const CsvUploadModalContainer = ({ closeModal }: Props) => {
  const [currentStep, setCurrentStep] = useState<'input' | 'error'>('input');

  return (
    <div className="absolute top-0 left-0 z-50 mx-auto min-h-100vh w-full bg-ninethLightGray">
      <div className="container mx-auto mt-12 w-full px-6 pb-1 md:max-w-50vw">
        {currentStep === 'input' && (
          <div className="rounded-4px bg-white pb-7 shadow-primaryModalShadow">
            <div className="relative flex items-center justify-center rounded-tl-4px rounded-tr-4px p-15px">
              <span className="text-21px font-semibold text-primaryDarkGray">
                CSV Upload
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
            <div className="relative mt-14 flex items-center justify-center px-5">
              <div className="absolute -top-13">
                <Image
                  src="/images/home/downloadCSV.png"
                  alt="CSV download template image"
                  width="59px"
                  height="71px"
                />
              </div>
              <button className="flex w-full items-center justify-center rounded-xl border-3px border-thirdPurple bg-fourthPurple py-5 hover:border-fifthPurple hover:bg-sixthPurple">
                <span className="text-17 font-bold text-primaryGray">
                  Download Template
                </span>
              </button>
            </div>
            <div className="relative mt-18 flex items-center justify-center px-5 pb-6">
              <div className="absolute -top-13">
                <Image
                  src="/images/home/uploadCSV.png"
                  alt="CSV download template image"
                  width="59px"
                  height="71px"
                />
              </div>
              <button className="flex w-full items-center justify-center rounded-xl border-3px border-thirdPurple bg-fourthPurple py-5 hover:border-sixthOrange hover:bg-seventhOrange">
                <span className="text-17 font-bold text-primaryGray">
                  Upload CSV
                </span>
              </button>
            </div>
          </div>
        )}
        {currentStep === 'error' && (
          <BasicModal
            title={'Error'}
            toggleModal={closeModal}
            primaryActionButtonText={'Reupload'}
            onPrimaryActionButtonClick={() => {
              setCurrentStep('input');
            }}
          >
            <div className="flex flex-col items-center justify-center px-5 pt-5 pb-1 text-primaryGray">
              <p>Unable to read uploaded file.</p>
              <p className="my-2">Please double check the formatting</p>
              <p>and reupload</p>
            </div>
          </BasicModal>
        )}
      </div>
    </div>
  );
};

export default CsvUploadModalContainer;
