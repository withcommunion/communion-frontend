import Image from 'next/image';

interface Props {
  onClick: () => void;
}

const UploadButton = ({ onClick }: Props) => {
  return (
    <button
      onClick={() => onClick()}
      className="w-full border-2 rounded-xl border-secondaryBeige bg-thirdBeige flex items-center justify-center py-3"
    >
      <Image
        src="/images/home/csv/csvUploadIcon.png"
        alt="CSV Upload image"
        width="46px"
        height="39px"
      />
      <span className="text-17px font-bold text-sixthOrange mx-10px">
        CSV Upload
      </span>
    </button>
  );
};

export default UploadButton;
