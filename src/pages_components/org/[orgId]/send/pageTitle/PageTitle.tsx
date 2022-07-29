import Image from 'next/image';

const PageTitle = () => {
  return (
    <div className="flex py-5">
      <Image
        src="/images/send/gift.svg"
        alt="gift"
        width="19px"
        height="21px"
      />
      <span className="mx-2 text-19px font-medium text-primaryPurple">
        Send Token Tips
      </span>
    </div>
  );
};

export default PageTitle;
