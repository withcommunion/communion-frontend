import type { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { Amplify } from 'aws-amplify';
import cx from 'classnames';

import { AMPLIFY_CONFIG } from '@/util/cognitoAuthUtil';
import { getUserJwtTokenOnServer } from '@/util/cognitoAuthUtil';

import { useAppSelector } from '@/reduxHooks';
import // selectHistoricalTxnsStatus,
'@/features/transactions/transactionsSlice';
import { selectOrg } from '@/features/organization/organizationSlice';

import { useFetchSelf, useFetchOrg } from '@/shared_hooks/sharedHooks';

import NavBar, { AvailablePages } from '@/shared_components/navBar/NavBar';
import OrgTokenBalanceContainer from '@/shared_components/orgTokenBalance/orgTokenBalanceContainer';
import {
  OrgTransactionHistoryList,
  ShortcutActionsList,
} from '@/pages_components/org/[orgId]/orgIdIndexComponents';
import NftTrophyDisplay from '@/shared_components/nftTrophyDisplay/nftTrophyDisplay';

// https://docs.amplify.aws/lib/client-configuration/configuring-amplify-categories/q/platform/js/#general-configuration
Amplify.configure({ ...AMPLIFY_CONFIG, ssr: true });

const nfts = [
  {
    erc721Meta: {
      title: 'string',
      properties: {
        name: 'string',
        description: 'string',
        image: '/images/nftTrophyDisplay/nft.png',
        attributes: [
          {
            display_type: 1,
            trait_type: 'string',
            value: 1,
          },
        ],
      },
    },
  },
  {
    erc721Meta: {
      title: 'string',
      properties: {
        name: 'string',
        description: 'string',
        image: '/images/nftTrophyDisplay/nft.png',
        attributes: [
          {
            display_type: 1,
            trait_type: 'string',
            value: 1,
          },
        ],
      },
    },
  },
  {
    erc721Meta: {
      title: 'string',
      properties: {
        name: 'string',
        description: 'string',
        image: '/images/nftTrophyDisplay/nft.png',
        attributes: [
          {
            display_type: 1,
            trait_type: 'string',
            value: 1,
          },
        ],
      },
    },
  },
];

interface Props {
  userJwt: string;
}

const Home = ({ userJwt }: Props) => {
  const router = useRouter();
  const { orgId } = router.query;

  const org = useAppSelector((state) => selectOrg(state));

  useFetchSelf(userJwt);
  useFetchOrg(userJwt);

  return (
    <>
      <NavBar
        activePage={AvailablePages.orgHome}
        activeOrgId={(orgId || '').toString()}
      />
      <>
        <div className="min-h-100vh bg-secondaryLightGray pb-2 ">
          <div className="container my-0 mx-auto w-full px-6 md:max-w-50vw">
            <OrgTokenBalanceContainer />
            <div className="mt-10px mb-4 flex flex-col rounded-md bg-primaryLightGray p-4 pt-14px">
              <div className="mb-2">
                <span className="text-twelfthGray">Your NFTs</span>
                <span className="ml-1.5 text-xs text-primaryGray">
                  (
                  {nfts
                    ? `You have ${nfts.length} NFT`
                    : 'You don’t have any NFTs'}
                  )
                </span>
              </div>
              <div className="self-center">
                <NftTrophyDisplay nfts={nfts.slice(0, 1)} showcaseNft={null} />
              </div>
            </div>
            <div className={cx('my-6', { 'h-35vh': !org.actions.length })}>
              <ShortcutActionsList
                shortcutActions={org.actions}
                orgId={(orgId || '').toString()}
              />
            </div>
            <div className="my-8">
              <OrgTransactionHistoryList userJwt={userJwt} />
            </div>
          </div>
        </div>
      </>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const userJwt = await getUserJwtTokenOnServer(context);
    return {
      props: { userJwt },
    };
  } catch (error) {
    console.log(error);
    return {
      props: {},
      redirect: {
        destination: '/',
      },
    };
  }
};

export default Home;
