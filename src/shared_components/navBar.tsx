import Link from 'next/link';
import { useRouter } from 'next/router';
import cx from 'classnames';

interface Props {
  signOut: () => void;
  active: 'home' | 'send' | 'profile';
}
export default function NavBar({ signOut, active }: Props) {
  const router = useRouter();
  const buttonClass =
    'bg-gray-200 disabled:bg-gray-400 hover:bg-blue-100 text-black py-1 px-2 rounded';
  return (
    <nav className="fixed bottom-0 bg-gray-100 w-full h-12 p-2 mt-0 z-10">
      <div className=" flex justify-center content-center">
        <ul className="flex flex-row text-center w-full md:w-1/4 gap-x-2">
          <li className="basis-1/4">
            <button
              className={cx(buttonClass, { 'bg-blue-200': active === 'home' })}
            >
              <Link href="/org/org-jacks-pizza-1">Home</Link>
            </button>
          </li>

          <li className="basis-1/4">
            <button
              className={cx(buttonClass, { 'bg-blue-200': active === 'send' })}
            >
              <Link href="/org/org-jacks-pizza-1/send">Send</Link>
            </button>
          </li>

          <li className="basis-1/4">
            <button className={buttonClass} disabled>
              Profile
            </button>
          </li>

          <li className="basis-1/4">
            <button
              className={buttonClass}
              onClick={() => {
                signOut();
                // TODO: This is hacky af
                setTimeout(() => {
                  router.push('/');
                }, 500);
              }}
            >
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}
