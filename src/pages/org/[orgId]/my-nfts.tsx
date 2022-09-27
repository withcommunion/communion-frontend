import { GetServerSideProps } from 'next';
import { Amplify } from 'aws-amplify';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { AMPLIFY_CONFIG } from '@/util/cognitoAuthUtil';
import { getUserJwtTokenOnServer } from '@/util/cognitoAuthUtil';
import { useAppSelector } from '@/reduxHooks';
import { useFetchSelf, useFetchOrg } from '@/shared_hooks/sharedHooks';

import { selectOwnedNftsInCurrentOrg } from '@/features/selfSlice';

import NavBar, { AvailablePages } from '@/shared_components/navBar/NavBar';
import BackToButton from '@/shared_components/backToButton/BackToButton';
import NftGridDisplayList from '@/pages_components/org/[orgId]/send/nft/nftGridDisplayList/nftGridDisplayList';
import SelectedNftComponent from '@/pages_components/org/[orgId]/send/nft/selectedNftComponent/selectedNftComponent';

import { CommunionNft } from '@/util/walletApiUtil';

// https://docs.amplify.aws/lib/client-configuration/configuring-amplify-categories/q/platform/js/#general-configuration
Amplify.configure({ ...AMPLIFY_CONFIG, ssr: true });

interface Props {
  userJwt: string;
}

const MyNftPage = ({ userJwt }: Props) => {
  const router = useRouter();

  useFetchSelf(userJwt);
  useFetchOrg(userJwt);
  const { orgId } = router.query;
  const ownedCommunionNfts = useAppSelector((state) =>
    selectOwnedNftsInCurrentOrg(state)
  );

  const [selectedNft, setSelectedNft] = useState<CommunionNft>(
    ownedCommunionNfts[0]
  );

  useEffect(() => {
    if (ownedCommunionNfts.length > 0 && !selectedNft) {
      setSelectedNft(ownedCommunionNfts[0]);
    }
  }, [setSelectedNft, selectedNft, ownedCommunionNfts]);

  return (
    <div>
      <>
        <NavBar
          activePage={AvailablePages.orgHome}
          activeOrgId={(orgId || '').toString()}
        />
        <div className="h-full min-h-100vh bg-secondaryLightGray pb-6">
          <div className="container my-0 mx-auto mb-10 w-full px-6 md:max-w-50vw">
            <Link href={`/org/${(orgId || '').toString()}/`}>
              <a>
                <div className="w-fit">
                  <BackToButton
                    onClick={() => true}
                    backToDestinationText={'Home'}
                  />
                </div>
              </a>
            </Link>
            <>
              {selectedNft && (
                <SelectedNftComponent selectedItem={selectedNft} />
              )}
              <NftGridDisplayList
                availableNfts={ownedCommunionNfts}
                onNftClick={(nft) => {
                  setSelectedNft(nft);
                }}
                activeNft={selectedNft}
              />
            </>
          </div>
        </div>
      </>
    </div>
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

export default MyNftPage;
