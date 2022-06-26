import Image from 'next/image';
import Link from 'next/link';

interface Props {
  actionAmount: number;
  actionName: string;
}

const ShortcutAction = ({ actionAmount, actionName }: Props) => {
  return (
    <Link href="/community" passHref>
      <button className="bg-slate-200 p-2 rounded-lg hover:bg-slate-400">
        <div className="relative">
          <div className="flex items-center min-w-55vw md:min-w-15vw max-h-10vh">
            <span className="text-black text-4xl p-1">{actionAmount}</span>
            <div className="flex flex-col p-2">
              <span className="text-xl text-black">Token tip</span>
              <span className="text-xl text-black">{actionName}</span>
            </div>
          </div>
          <div className="absolute -right-8 -top-1 overflow-visible z-100">
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
