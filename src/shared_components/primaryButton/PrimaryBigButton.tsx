import { FC } from 'react';
// eslint-disable-next-line @typescript-eslint/ban-types
const PrimaryBigButton: FC<{
  text: string;
  functionButton: () => void;
}> = ({ text, functionButton }) => {
  return (
    <button
      className="rounded-23px h-46px bg-secondaryOrange text-white w-295px shadow-primaryButtonShadow mx-7.5px"
      onClick={functionButton}
    >
      {text}
    </button>
  );
};

export default PrimaryBigButton;
