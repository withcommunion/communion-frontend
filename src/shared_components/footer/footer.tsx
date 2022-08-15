import Image from 'next/image';

const Footer = () => {
  return (
    <div className="mt-10 mb-4 flex justify-center items-center">
      <Image
        src="/images/signUp/communion.png"
        alt="communion logo"
        width="120px"
        height="32px"
      />
    </div>
  );
};

export default Footer;
