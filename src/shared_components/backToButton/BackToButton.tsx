import Image from 'next/image';
import { FC, memo } from 'react';

const BackToButton: FC<{
  text: string;
  functionButton: () => void;
}> = ({ text, functionButton }) => {
  return (
    <button
      onClick={() => {
        functionButton();
      }}
      className="my-11px"
    >
      <Image src="/images/back.svg" width="17px" height="13px" />
      <span className="text-4 text-primaryPurple mx-6px ">Back to {text}</span>
    </button>
  );
};

export default memo(BackToButton);
