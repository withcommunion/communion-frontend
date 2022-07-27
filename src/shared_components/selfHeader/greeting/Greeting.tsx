import { FC } from 'react';
import { ISelfHeader } from '@/pages/org/[orgId]/indexPlayground';
import Image from 'next/image';

const Greeting: FC<{ selfHeader: ISelfHeader[] }> = ({ selfHeader }) => {
  const { name } = selfHeader[0];
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
