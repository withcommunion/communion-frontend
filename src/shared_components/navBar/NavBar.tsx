import Link from 'next/link';
import Image from 'next/image';
import cx from 'classnames';
import { useAppSelector } from '@/reduxHooks';
import { selectIsManagerModeActive } from '@/features/organization/organizationSlice';

export enum AvailablePages {
  orgHome = 'orgHome',
  orgSend = 'orgSend',
  orgRedeem = 'orgRedeem',
  settings = 'settings',
}

const pages = [
  {
    name: AvailablePages.orgHome,
    image: '/images/menu/Home.svg',
    activeImage: '/images/menu/HomeActive.svg',
    linkHref: '',
    width: '17px',
    height: '19px',
  },
  {
    name: AvailablePages.orgSend,
    image: '/images/menu/Send.svg',
    activeImage: '/images/menu/SendActive.svg',
    linkHref: 'send',
    width: '17px',
    height: '19px',
  },
  {
    name: AvailablePages.orgRedeem,
    image: '/images/menu/Redeem.svg',
    activeImage: '/images/menu/RedeemActive.svg',
    linkHref: 'redeem',
    width: '19px',
    height: '19px',
  },
  {
    name: AvailablePages.settings,
    image: '/images/menu/Settings.svg',
    activeImage: '/images/menu/SettingsActive.svg',
    linkHref: '/settings',
    width: '21px',
    height: '21px',
  },
];

interface Props {
  activePage: AvailablePages;
  activeOrgId: string;
}

export default function NavBar({ activePage, activeOrgId }: Props) {
  const isManagerModeActive = useAppSelector((state) =>
    selectIsManagerModeActive(state)
  );
  return (
    <nav className="fixed h-14 inset-x-0 bottom-0 bg-white shadow-menuShadow z-30">
      <ul className="flex justify-around items-center h-full mx-auto md:max-w-50vw ">
        {pages.map((link, num: number) => {
          const isActive = link.name === activePage;
          const isDisabledInManagerMode =
            isManagerModeActive && link.name === AvailablePages.orgRedeem;

          const navLink =
            link.name === AvailablePages.settings
              ? '/settings'
              : `/org/${activeOrgId}/${link.linkHref}`;
          return (
            <li key={num} className="w-12 h-full">
              <div
                className={cx({
                  'w-12 h-1 bg-primaryOrange rounded-xl': isActive,
                })}
              ></div>
              <Link href={navLink}>
                <a
                  onClick={(event) => {
                    if (isDisabledInManagerMode) {
                      event.preventDefault();
                    }
                  }}
                  className={cx('flex items-center justify-center h-full', {
                    'opacity-20': isDisabledInManagerMode,
                  })}
                >
                  <Image
                    src={isActive ? link.activeImage : link.image}
                    alt={link.name}
                    width={link.width}
                    height={link.height}
                  />
                </a>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
