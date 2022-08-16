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
    linkHref: 'settings',
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
    <nav className="fixed inset-x-0 bottom-0 z-30 h-14 bg-white shadow-menuShadow">
      <ul className="mx-auto flex h-full items-center justify-around md:max-w-50vw ">
        {pages.map((link, num: number) => {
          const isActive = link.name === activePage;
          const isDisabledInManagerMode =
            isManagerModeActive && link.name === AvailablePages.orgRedeem;

          const navLink = `/org/${activeOrgId}/${link.linkHref}`;
          return (
            <li key={num} className="h-full w-12">
              <div
                className={cx({
                  'h-1 w-12 rounded-xl bg-primaryOrange': isActive,
                })}
              ></div>
              <Link href={navLink}>
                <a
                  onClick={(event) => {
                    if (isDisabledInManagerMode) {
                      event.preventDefault();
                    }
                  }}
                  className={cx('flex h-full items-center justify-center', {
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
