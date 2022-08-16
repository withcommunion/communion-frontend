import Image from 'next/image';
import Link from 'next/link';

interface Props {
  actionAmount: number;
  actionName: string;
}

const ShortcutAction = ({ actionAmount, actionName }: Props) => {
  return (
    <Link href="/org/jacks-pizza-pittsfield/send" passHref>
      <button className="rounded-lg bg-slate-200 p-2 hover:bg-slate-400">
        <div className="relative">
          <div className="flex max-h-10vh min-w-55vw items-center md:min-w-15vw">
            <span className="p-1 text-4xl text-black">{actionAmount}</span>
            <div className="flex flex-col p-2">
              <span className="text-xl text-black">Token tip</span>
              <span className="text-xl text-black">{actionName}</span>
            </div>
          </div>
          <div className="z-100 absolute -right-8 -top-1 overflow-visible">
            <Image
              className=""
              width="90"
              height="85"
              src={'/images/cupcake.png'}
              alt="kindness cupcake"
            />
          </div>
        </div>
      </button>
    </Link>
  );
};

export default ShortcutAction;
