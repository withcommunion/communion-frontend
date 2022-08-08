import Image from 'next/image';

const UploadButton = () => {
  return (
    <button className="w-full border-2 rounded-xl border-secondaryBeige bg-thirdBeige flex items-center justify-center py-3">
      <Image
        src="/images/home/CSV/CSVUpload.png"
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
