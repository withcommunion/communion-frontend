import Image from 'next/image';

interface Props {
  name: string;
}
const Greeting = ({ name }: Props) => {
  return (
    <div className="flex py-5">
      <Image
        src="/images/home/smileEmoji.svg"
        alt="smile emoji"
        width="20px"
        height="20px"
      />
      <span className="mx-2 text-19px font-medium text-primaryPurple">
        Hi, {name}
      </span>
    </div>
  );
};

export default Greeting;
