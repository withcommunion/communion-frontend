import Image from 'next/image';
import { memo } from 'react';

interface Props {
  backToDestinationText: string;
  onClick: () => void;
}
const BackToButton = ({ backToDestinationText, onClick }: Props) => {
  return (
    <button
      onClick={() => {
        onClick();
      }}
      className="my-11px"
    >
      <Image
        src="/images/back.svg"
        width="17px"
        height="13px"
        alt="back arrow"
      />
      <span className="text-4 text-primaryPurple mx-6px ">
        Back to {backToDestinationText}
      </span>
    </button>
  );
};

// TODO Look into why we are doing this.  I am relatively unfamilar with React.memo
export default memo(BackToButton);
