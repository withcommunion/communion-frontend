import Image from 'next/image';

interface Props {
  onClick: () => void;
}

const UploadButton = ({ onClick }: Props) => {
  return (
    <button
      onClick={() => onClick()}
      className="flex w-full items-center justify-center rounded-xl border-2 border-secondaryBeige bg-thirdBeige py-3"
    >
      <Image
        src="/images/home/csv/csvUploadIcon.png"
        alt="CSV Upload image"
        width="46px"
        height="39px"
      />
      <span className="mx-10px text-17px font-bold text-sixthOrange">
        CSV Upload
      </span>
    </button>
  );
};

export default UploadButton;
