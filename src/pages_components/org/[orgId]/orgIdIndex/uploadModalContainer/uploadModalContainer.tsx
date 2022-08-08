import { useState } from 'react';
import Image from 'next/image';
import BasicModal from '@/shared_components/basicModal';

interface Props {
  closeModal: () => void;
}

const UploadModalContainer = ({ closeModal }: Props) => {
  const [currentStep, setCurrentStep] = useState<'input' | 'error'>('error');

  return (
    <div className="absolute top-0 left-0 mx-auto w-full z-50 bg-ninethLightGray min-h-100vh">
      <div className="container w-full md:max-w-50vw px-6 pb-1 mx-auto mt-12">
        {currentStep === 'input' && (
          <div className="shadow-primaryModalShadow rounded-4px bg-white pb-7">
            <div className="relative p-15px flex justify-center items-center rounded-tl-4px rounded-tr-4px">
              <span className="text-primaryDarkGray text-21px font-semibold">
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
            <div className="relative mt-14 flex justify-center items-center px-5">
              <div className="absolute -top-13">
                <Image
                  src="/images/home/downloadCSV.png"
                  alt="CSV download template image"
                  width="59px"
                  height="71px"
                />
              </div>
              <button className="border-3px border-thirdPurple rounded-xl bg-fourthPurple py-5 flex items-center justify-center w-full hover:bg-sixthPurple hover:border-fifthPurple">
                <span className="text-primaryGray text-17 font-bold">
                  Download Template
                </span>
              </button>
            </div>
            <div className="relative mt-18 flex justify-center items-center px-5 pb-6">
              <div className="absolute -top-13">
                <Image
                  src="/images/home/uploadCSV.png"
                  alt="CSV download template image"
                  width="59px"
                  height="71px"
                />
              </div>
              <button className="border-3px border-thirdPurple rounded-xl bg-fourthPurple py-5 flex items-center justify-center w-full hover:bg-seventhOrange hover:border-sixthOrange">
                <span className="text-primaryGray text-17 font-bold">
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
            <div className="px-5 text-primaryGray pt-5 pb-1 flex flex-col justify-center items-center">
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

export default UploadModalContainer;
