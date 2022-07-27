import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';

export interface IMenu {
  name: string;
  image: string;
  activeImage: string;
  linkHref: string;
  width: string | number;
  height: string | number;
}

export default function NavBar() {
  const router = useRouter();

  const pages: IMenu[] = [
    {
      name: 'home',
      image: '/images/menu/Home.svg',
      activeImage: '/images/menu/HomeActive.svg',
      linkHref: '/org/org-jacks-pizza-1/indexPlayground',
      width: '17px',
      height: '19px',
    },
    {
      name: 'send',
      image: '/images/menu/Send.svg',
      activeImage: '/images/menu/SendActive.svg',
      linkHref: '#',
      width: '17px',
      height: '19px',
    },
    {
      name: 'redeem',
      image: '/images/menu/Redeem.svg',
      activeImage: '/images/menu/RedeemActive.svg',
      linkHref: '#',
      width: '19px',
      height: '19px',
    },
    {
      name: 'settings',
      image: '/images/menu/Settings.svg',
      activeImage: '/images/menu/SettingsActive.svg',
      linkHref: '#',
      width: '21px',
      height: '21px',
    },
  ];

  const Links = pages.map((singleLink, num: number) => {
    return (
      <li key={num} className="w-12 h-full">
        <div
          className={
            router.asPath == singleLink.linkHref
              ? 'w-12 h-1 bg-primaryOrange rounded-xl'
              : 'none'
          }
        ></div>
        <Link href={singleLink.linkHref}>
          <a className="flex items-center justify-center h-full">
            <Image
              src={
                router.asPath == singleLink.linkHref
                  ? singleLink.activeImage
                  : singleLink.image
              }
              alt={singleLink.name}
              width={singleLink.width}
              height={singleLink.height}
            />
          </a>
        </Link>
      </li>
    );
  });

  return (
    <nav className="fixed h-14 inset-x-0 bottom-0 bg-white shadow-menuShadow z-30">
      <ul className="flex justify-around items-center mx-1 h-full mx-auto md:max-w-50vw ">
        {Links}
      </ul>
    </nav>
  );
}
