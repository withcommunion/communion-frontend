import Image from 'next/image';

const SendPageHeader = () => {
  return (
    <div className="flex py-5">
      <Image
        src="/images/redeem/invoice.svg"
        alt="gift"
        width="28px"
        height="28px"
      />
      <h2 className="mx-2 text-19px font-medium text-primaryPurple">Redeem</h2>
    </div>
  );
};

export default SendPageHeader;
