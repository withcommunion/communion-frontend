import Image from 'next/image';

const SendPageHeader = () => {
  return (
    <div className="flex py-5">
      <Image
        src="/images/send/gift.svg"
        alt="gift"
        width="19px"
        height="21px"
      />
      <h2 className="mx-2 text-19px font-medium text-primaryPurple">
        Send Token Tips
      </h2>
    </div>
  );
};

export default SendPageHeader;
