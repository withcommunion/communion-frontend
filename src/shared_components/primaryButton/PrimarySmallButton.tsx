import { FC } from 'react';
// eslint-disable-next-line @typescript-eslint/ban-types
const PrimarySmallButton: FC<{
  text: string;
  functionButton: () => void;
}> = ({ text, functionButton }) => {
  return (
    <button
      className="rounded-28px h-46px bg-secondaryOrange text-white w-155px shadow-primaryButtonShadow mx-7.5px"
      onClick={functionButton}
    >
      {text}
    </button>
  );
};

export default PrimarySmallButton;
